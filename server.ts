import express, { Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  getOrCreateUser,
  getUserProfile,
  createBooking,
  getBookingsByUser,
  createSavedItinerary,
  getSavedItinerariesByUser,
  createRSVP,
  getAllPlaces,
  upsertPlace
} from "./src/db/queries.ts";
import {
  getAuthenticatedEmail,
  getAuthenticatedRole,
  getAuthenticatedUid,
  getAuthenticatedUser,
  requireAdmin,
  requireAuth,
  type AuthRequest
} from "./src/middleware/auth.ts";
import {
  getAdminAuth,
  getAdminFirestore,
  isFirebaseAdminUnavailableError
} from "./src/lib/firebase-admin.ts";

dotenv.config();

const PORT = 3000;

const LIMITS = {
  identifier: 128,
  name: 120,
  tag: 80,
  title: 200,
  label: 120,
  avatar: 500,
  dateTime: 80,
  price: 60,
  message: 2000,
  query: 300,
  description: 4000,
  deepHistory: 8000,
  historyItems: 4,
  interests: 12,
  stops: 40
};

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Sans cle Gemini, la route repond une erreur explicite : un 200 au texte ecrit a la main
// se lirait cote client comme une sortie du modele, et l'archive etiquetee de l'ecran ne
// serait jamais atteinte.
function aiUnavailable(res: Response) {
  return res.status(503).json({ error: "ai_unavailable" });
}

// Timeout wrapper to ensure responsive UI even if API is slow or throttled
function withTimeout<T>(promise: Promise<T>, ms: number = 7000, fallbackMessage = "Timeout"): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(fallbackMessage)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

interface CommonsImage {
  file: string;
  thumb: string;
  page: string;
  author: string;
  license: string;
}

const plainText = (value: unknown): string =>
  String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// Une photo n'a d'intérêt que si l'on peut dire qui la signe et à quelles conditions la
// réutiliser. Commons répond les deux dans la requête : aucune URL d'image n'est écrite à
// la main ici, et un échec renvoie une liste vide plutôt qu'un visuel de substitution.
async function commonsImages(searchTerm: string, limit = 4): Promise<CommonsImage[]> {
  const term = searchTerm.trim();
  if (!term) return [];

  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: term,
    gsrnamespace: "6",
    gsrlimit: String(Math.min(limit * 4, 40)),
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiextmetadatafilter: "Artist|LicenseShortName",
    iiurlwidth: "960",
    format: "json"
  });

  try {
    const response = await withTimeout(
      fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
        headers: { "User-Agent": "LaVibeMap/1.0 (cultural catalog lookup)" }
      }).then((r) => r.json()),
      6000,
      "Commons lookup timed out"
    );

    const pages: any[] = Object.values(response?.query?.pages || {});
    return pages
      .sort((a: any, b: any) => (a?.index ?? 0) - (b?.index ?? 0))
      .map((entry: any) => {
        const info = entry?.imageinfo?.[0] || {};
        const meta = info.extmetadata || {};
        return {
          mime: String(info.mime || ""),
          file: String(entry?.title || "").replace(/^File:/, ""),
          thumb: String(info.thumburl || ""),
          page: String(info.descriptionurl || ""),
          author: plainText(meta.Artist?.value),
          license: plainText(meta.LicenseShortName?.value)
        };
      })
      .filter(
        (image) =>
          /^image\/(jpeg|png)$/.test(image.mime) &&
          image.file &&
          image.thumb &&
          image.author &&
          image.license
      )
      .slice(0, limit)
      .map(({ mime, ...image }) => image);
  } catch (err: any) {
    console.warn("Commons lookup skipped:", err?.message || err);
    return [];
  }
}

function boundedString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function boundedStringList(value: unknown, maxItems: number, maxLength: number): string[] {
  return Array.isArray(value)
    ? value.map((item) => boundedString(item, maxLength)).filter(Boolean).slice(0, maxItems)
    : [];
}

function verifiedEmail(req: AuthRequest, res: Response): string | undefined {
  const email = getAuthenticatedEmail(req);
  if (email) {
    return email;
  }

  res.status(403).json({ error: "Forbidden: verified email required" });
  return undefined;
}

function isAdminRequest(req: AuthRequest): boolean {
  return getAuthenticatedRole(req) === "admin";
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "La Vibe Map Cultural & Cloud SQL API",
      cloudSqlRegion: "europe-west1",
      ai: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Cloud SQL Database APIs
  app.post("/api/db/users/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = getAuthenticatedUid(req);
      const email = verifiedEmail(req, res);
      if (!email) {
        return;
      }

      const user = await getOrCreateUser(
        uid,
        email,
        boundedString(req.body?.name, LIMITS.name) || getAuthenticatedUser(req).name,
        boundedString(req.body?.avatar, LIMITS.avatar),
        boundedString(req.body?.vibeTag, LIMITS.tag),
        boundedString(req.body?.travelStyle, LIMITS.tag)
      );
      res.json(user);
    } catch (error: any) {
      console.error("Cloud SQL user sync error:", error);
      res.status(500).json({ error: "Failed to sync user to Cloud SQL" });
    }
  });

  app.get("/api/db/users/:uid", requireAuth, async (req: AuthRequest, res) => {
    try {
      const requestedUid = boundedString(req.params.uid, LIMITS.identifier);
      if (!requestedUid) {
        return res.status(400).json({ error: "Invalid user identifier" });
      }

      if (requestedUid !== getAuthenticatedUid(req) && !isAdminRequest(req)) {
        return res.status(403).json({ error: "Forbidden: Insufficient role" });
      }

      const user = await getUserProfile(requestedUid);
      res.json(user || {});
    } catch (error: any) {
      console.error("Cloud SQL user fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user from Cloud SQL" });
    }
  });

  app.post("/api/db/bookings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = verifiedEmail(req, res);
      if (!email) {
        return;
      }

      const booking = {
        actorId: boundedString(req.body?.actorId, LIMITS.identifier),
        actorName: boundedString(req.body?.actorName, LIMITS.name),
        experienceId: boundedString(req.body?.experienceId, LIMITS.identifier),
        experienceTitle: boundedString(req.body?.experienceTitle, LIMITS.title),
        dateTime: boundedString(req.body?.dateTime, LIMITS.dateTime),
        price: boundedString(req.body?.price, LIMITS.price),
        travelerName: boundedString(req.body?.travelerName, LIMITS.name) || getAuthenticatedUser(req).name || "Voyageur",
        travelerEmail: email
      };

      if (!booking.actorId || !booking.experienceId || !booking.dateTime) {
        return res.status(400).json({ error: "actorId, experienceId and dateTime are required" });
      }

      res.json(await createBooking(booking));
    } catch (error: any) {
      console.error("Cloud SQL booking error:", error);
      res.status(500).json({ error: "Failed to save booking to Cloud SQL" });
    }
  });

  app.get("/api/db/bookings", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = verifiedEmail(req, res);
      if (!email) {
        return;
      }

      res.json(await getBookingsByUser(email));
    } catch (error: any) {
      console.error("Cloud SQL fetch bookings error:", error);
      res.status(500).json({ error: "Failed to fetch bookings from Cloud SQL" });
    }
  });

  app.post("/api/db/itineraries", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = verifiedEmail(req, res);
      if (!email) {
        return;
      }

      const title = boundedString(req.body?.title, LIMITS.title);
      if (!title) {
        return res.status(400).json({ error: "Itinerary title is required" });
      }

      const itinerary = await createSavedItinerary({
        title,
        duration: boundedString(req.body?.duration, LIMITS.tag) || "1 jour",
        interests: boundedStringList(req.body?.interests, LIMITS.interests, LIMITS.tag),
        userEmail: email,
        stops: Array.isArray(req.body?.stops) ? req.body.stops.slice(0, LIMITS.stops) : []
      });
      res.json(itinerary);
    } catch (error: any) {
      console.error("Cloud SQL itinerary error:", error);
      res.status(500).json({ error: "Failed to save itinerary to Cloud SQL" });
    }
  });

  app.get("/api/db/itineraries", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = verifiedEmail(req, res);
      if (!email) {
        return;
      }

      res.json(await getSavedItinerariesByUser(email));
    } catch (error: any) {
      console.error("Cloud SQL fetch itineraries error:", error);
      res.status(500).json({ error: "Failed to fetch itineraries from Cloud SQL" });
    }
  });

  app.post("/api/db/rsvps", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = verifiedEmail(req, res);
      if (!email) {
        return;
      }

      const eventId = boundedString(req.body?.eventId, LIMITS.identifier);
      if (!eventId) {
        return res.status(400).json({ error: "eventId is required" });
      }

      const rsvp = await createRSVP({
        eventId,
        eventTitle: boundedString(req.body?.eventTitle, LIMITS.title),
        userEmail: email
      });
      res.json(rsvp);
    } catch (error: any) {
      console.error("Cloud SQL rsvp error:", error);
      res.status(500).json({ error: "Failed to save RSVP to Cloud SQL" });
    }
  });

  // Places API
  app.get("/api/db/places", async (_req, res) => {
    try {
      const list = await getAllPlaces();
      res.json(list);
    } catch (error: any) {
      console.error("Cloud SQL fetch places error:", error);
      res.status(500).json({ error: "Failed to fetch places from Cloud SQL" });
    }
  });

  app.post("/api/db/places", requireAdmin, async (req: AuthRequest, res) => {
    try {
      const place = {
        id: boundedString(req.body?.id, LIMITS.identifier),
        name: boundedString(req.body?.name, LIMITS.title),
        location: boundedString(req.body?.location, LIMITS.title),
        category: boundedString(req.body?.category, LIMITS.tag),
        description: boundedString(req.body?.description, LIMITS.description),
        deepHistory: boundedString(req.body?.deepHistory, LIMITS.deepHistory),
        image: boundedString(req.body?.image, LIMITS.avatar),
        lat: boundedString(req.body?.lat, 30),
        lng: boundedString(req.body?.lng, 30)
      };

      if (!place.id || !place.name || !place.location || !place.category) {
        return res.status(400).json({ error: "id, name, location and category are required" });
      }

      res.json(await upsertPlace(place));
    } catch (error: any) {
      console.error("Cloud SQL save place error:", error);
      res.status(500).json({ error: "Failed to save place to Cloud SQL" });
    }
  });

  // Guide accreditation decision: updates the application and the Firebase role claim together
  app.post("/api/admin/guide-applications/:applicationId/decision", requireAdmin, async (req: AuthRequest, res) => {
    const decision = boundedString(req.body?.decision, 20);
    const applicationId = boundedString(req.params.applicationId, LIMITS.identifier);

    if (!["approved", "rejected"].includes(decision) || !applicationId) {
      return res.status(400).json({ error: "decision must be 'approved' or 'rejected'" });
    }

    try {
      const auth = getAdminAuth();
      const firestore = getAdminFirestore();
      const applicationRef = firestore.collection("guide_applications").doc(applicationId);
      const applicationSnap = await applicationRef.get();

      if (!applicationSnap.exists) {
        return res.status(404).json({ error: "Guide application not found" });
      }

      const applicantUid = boundedString(applicationSnap.data()?.userId, LIMITS.identifier);
      if (!applicantUid) {
        return res.status(409).json({ error: "Guide application has no applicant uid" });
      }

      let applicant;
      try {
        applicant = await auth.getUser(applicantUid);
      } catch (error: any) {
        if (error?.code === "auth/user-not-found") {
          return res.status(404).json({ error: "Guide applicant not found" });
        }
        throw error;
      }

      const claims: Record<string, unknown> = { ...(applicant.customClaims ?? {}) };
      const currentRole = claims.role;
      const isProtectedAdmin = currentRole === "admin";
      const profileRef = firestore.collection("users").doc(applicantUid);
      const profileSnap = await profileRef.get();
      const guideProfile = { ...((profileSnap.data()?.guideProfile ?? {}) as Record<string, unknown>) };

      await applicationRef.update({
        status: decision,
        reviewedAt: new Date().toISOString(),
        reviewedBy: getAuthenticatedUid(req)
      });

      if (decision === "approved") {
        if (!isProtectedAdmin) {
          claims.role = "guide";
        }

        await profileRef.set({
          role: isProtectedAdmin ? "admin" : "guide",
          guideProfile: { ...guideProfile, certified: true }
        }, { merge: true });
      } else if (currentRole === "guide") {
        claims.role = "traveler";

        await profileRef.set({
          role: "traveler",
          guideProfile: { ...guideProfile, certified: false }
        }, { merge: true });
      }

      await auth.setCustomUserClaims(applicantUid, claims);
      await auth.revokeRefreshTokens(applicantUid);

      res.json({ success: true, applicationId, applicantUid, status: decision });
    } catch (error: any) {
      if (isFirebaseAdminUnavailableError(error)) {
        return res.status(503).json({ error: "Admin service unavailable" });
      }

      console.error("Guide application decision error:", error);
      res.status(500).json({ error: "Failed to review guide application" });
    }
  });

  // AI Cultural Companion Chat API
  app.post("/api/gemini/chat", requireAuth, async (req: AuthRequest, res) => {
    const message = boundedString(req.body?.message, LIMITS.message);
    const conversationHistory = Array.isArray(req.body?.conversationHistory)
      ? req.body.conversationHistory.slice(-LIMITS.historyItems)
      : [];

    try {
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAI();
      if (!ai) {
        return aiUnavailable(res);
      }

      const systemPrompt = `Tu es le Compagnon Culturel et Médiateur Authentique de "La Vibe Map", l'application de découverte patrimoniale et spirituelle du Bénin (Ouidah, Abomey, Ganvié, Porto-Novo, Allada).
Ton rôle est de guider les voyageurs avec respect, précision historique, dignité culturelle et bienveillance.
Tu réponds en français clair et élégant, avec :
1. Une explication culturelle ou pratique captivante et authentique.
2. Une expression ou formule de politesse en langue Fon (avec sa prononciation phonétique et son sens).
3. Une règle d'étiquette ou recommandation éthique pour respecter les dignitaires, sanctuaires ou habitants.

Format de sortie strict en JSON valide:
{
  "reply": "Ta réponse détaillée et chaleureuse",
  "fonPhrase": {
    "fon": "Expression en Fon",
    "phonetic": "Prononciation phonétique simplifiée",
    "meaning": "Signification en français"
  },
  "etiquetteTip": "Conseil d'étiquette ou de bienséance pour le lieu ou la situation"
}`;

      const contents: any[] = [];
      conversationHistory.forEach((entry: any) => {
        const historyText = boundedString(entry?.text, LIMITS.message);
        if (!historyText) {
          return;
        }

        contents.push({
          role: entry?.sender === 'user' ? 'user' : 'model',
          parts: [{ text: historyText }]
        });
      });
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await withTimeout(ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      }), 7000);

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (parseErr) {
        return res.json({
          reply: responseText,
          fonPhrase: {
            fon: "Akwaba",
            phonetic: "Ah-kwah-bah",
            meaning: "Bienvenue chaleureuse"
          },
          etiquetteTip: "Saluez toujours de la main droite en entrant dans une cour traditionnelle."
        });
      }
    } catch (err: any) {
      console.warn("Gemini Chat API fallback triggered:", err?.message || err);
      const lower = message.toLowerCase();
      let customReply = "Akwaba ! Au Bénin, terre d'histoire et berceau du Vodun, la culture se transmet par la parole, les rythmes et le respect sacré des sanctuaires.";
      if (lower.includes('vaudou') || lower.includes('vodun') || lower.includes('temple')) {
        customReply = "Le Vodun au Bénin est une spiritualité d'harmonie avec la nature et les forces invisibles (Mami Wata, Dangbé, Héviosso). À Ouidah et Abomey, chaque sanctuaire a ses dignitaires et ses règles de visite.";
      } else if (lower.includes('abomey') || lower.includes('roi') || lower.includes('palais')) {
        customReply = "Les Palais Royaux d'Abomey, inscrits au patrimoine mondial de l'UNESCO, témoignent de la puissance du royaume du Danxomè et de la vaillance des célèbres guerrières Agoodjié (Amazones).";
      } else if (lower.includes('ganvié') || lower.includes('lac') || lower.includes('eau')) {
        customReply = "Ganvié, la 'Venise de l'Afrique', a été bâtie sur pilotis au XVIIIe siècle pour protéger ses habitants des razzias. La vie y est rythmée par la pirogue et le marché flottant.";
      }
      return res.json({
        reply: customReply,
        fonPhrase: {
          fon: "Kou do agbé",
          phonetic: "Kou doh ah-gbeh",
          meaning: "Bonjour / Paix et longue vie"
        },
        etiquetteTip: "Saluez toujours de la main droite en entrant dans une cour traditionnelle et demandez la permission avant de photographier."
      });
    }
  });

  // AI Itinerary Weaver API
  app.post("/api/gemini/itinerary", requireAuth, async (req: AuthRequest, res) => {
    const duration = boundedString(req.body?.duration, LIMITS.tag) || '1 jour';
    const interests = boundedStringList(req.body?.interests, LIMITS.interests, LIMITS.tag);
    const userVibe = boundedString(req.body?.userVibe, LIMITS.label) || 'Explorateur Immersif';

    try {
      const ai = getAI();

      if (!ai) {
        return aiUnavailable(res);
      }

      const prompt = `Génère un itinéraire culturel fluide et séquentiel au Bénin pour une durée de "${duration}" avec les centres d'intérêt suivants: ${interests.length > 0 ? interests.join(', ') : 'Patrimoine, Spiritualité Vodun, Histoire'}. Le style du voyageur est "${userVibe}".

Chaque étape doit comporter des heures précises, un titre évocateur, une description captivante, un conseil d'initié (insight/étiquette), un temps de trajet estimé (transitTime), et un identifiant de lieu associé parmi ('ouidah-python', 'abomey-palaces', 'ganvie-village', 'slave-route', 'porte-non-retour', 'porto-novo-adjina', 'allada-togudo', 'ouidah-zinsou').

Format de sortie en JSON strict:
{
  "timeline": [
    {
      "time": "09:00",
      "title": "Nom de l'étape",
      "description": "Courte description évocatrice (2 phrases)",
      "insight": "Conseil d'étiquette ou anecdote culturelle secrète",
      "transitTime": "15 min en Zémidjan",
      "placeId": "ouidah-python"
    }
  ]
}`;

      const response = await withTimeout(ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      }), 7000);

      const parsed = JSON.parse(response.text || '{"timeline": []}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn("Gemini Itinerary API fallback triggered:", err?.message || err);
      return res.json({
        timeline: [
          {
            time: '08:30',
            title: 'Temple des Pythons & Sanctuaire Sacré Dangbé',
            description: 'Immersion respectueuse dans le sanctuaire totémique de Ouidah.',
            insight: 'Retirer chaussures et lunettes de soleil avant d’entrer dans la case sacrée.',
            transitTime: '15 min de marche',
            placeId: 'ouidah-python'
          },
          {
            time: '11:00',
            title: 'La Route des Esclaves & Arbre de l’Oubli',
            description: 'Marche mémorielle commentée par un historien de la communauté.',
            insight: 'Observer un moment de recueillement sous l’Arbre du Retour.',
            transitTime: '20 min en Zémidjan',
            placeId: 'slave-route'
          },
          {
            time: '14:30',
            title: 'Porte du Non-Retour & Méditation Littorale',
            description: 'Arrivée sur la plage atlantique face au monument mémoriel de bronze.',
            insight: 'Les couchers de soleil y sont particulièrement propices à la méditation historique.',
            transitTime: '25 min en pirogue ou taxi',
            placeId: 'porte-non-retour'
          }
        ]
      });
    }
  });

  // Live Web Search Grounding API (Google Search with gemini-3.6-flash)
  app.post("/api/gemini/search-grounding", requireAuth, async (req: AuthRequest, res) => {
    const searchQuery = boundedString(req.body?.query, LIMITS.query);

    try {
      if (!searchQuery) {
        return res.status(400).json({ error: "Query is required" });
      }
      const ai = getAI();
      if (!ai) {
        return aiUnavailable(res);
      }

      const prompt = `Recherche les informations en temps réel et vérifiées sur le web concernant cette demande sur le tourisme, la culture, les guides ou le patrimoine au Bénin : "${searchQuery}".
Donne un résumé clair, des faits récents, les tarifs indicatifs en FCFA et Euros si disponibles, les conseils de visite et les sources fiables.`;

      const response = await withTimeout(ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      }), 7000);

      const text = response.text || "Le compagnon n'a pas produit de réponse exploitable pour cette demande.";
      const searchChunks = (response.candidates?.[0]?.groundingMetadata as any)?.groundingChunks || [];
      const webSources = searchChunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({
          title: c.web.title || "Source sans titre",
          url: c.web.uri
        }));

      return res.json({
        text,
        // Une source que le modèle n'a pas consultée ne peut pas être attribuée à sa réponse.
        sources: webSources
      });
    } catch (err: any) {
      console.warn("Search grounding fallback triggered:", err?.message || err);
      return res.json({
        text: `Le compagnon culturel n'a pas pu vérifier « ${searchQuery || 'Bénin'} » en direct. Aucune donnée d'horaires, de tarifs ou de protocole n'est avancée ici : la réponse serait inventée.`,
        sources: []
      });
    }
  });

  // Authentic cultural place database lookup helper
  const BENIN_CULTURAL_CATALOG: Record<string, any> = {
    'python': {
      name: 'Temple des Pythons & Sanctuaire Sacré Dangbé',
      category: 'Spiritual',
      location: 'Ouidah, Bénin',
      coordinates: { lat: 6.3622, lng: 2.0864 },
      summary: 'Sanctuaire ancestral totémique dédié au python royal (Dangbé), symbole sacré de prospérité, de bienveillance et de protection spirituelle à Ouidah.',
      deepHistory: 'Érigé au XVIIIe siècle suite à la guerre entre les royaumes de Savi et de Ouidah, le temple abrite des dizaines de pythons sacrés qui circulent librement dans la cité et sont respectés par la population.',
      etiquette: [
        'Ne jamais faire de mal à un python (totem protecteur de la cité)',
        'Retirer chaussures et lunettes de soleil avant d’entrer dans la case sacrée',
        'Demander la bénédiction du prêtre gardien avant de manipuler les reptiles'
      ],
      commonsQuery: 'Temple des Pythons Ouidah'
    },
    'abomey': {
      name: 'Palais Royaux d’Abomey & Cour de Béhanzin',
      category: 'Historical',
      location: 'Abomey, Zou, Bénin',
      coordinates: { lat: 7.1856, lng: 1.9912 },
      summary: 'Complexe monumental inscrit au Patrimoine Mondial de l’UNESCO, cœur de l’ancien et puissant royaume du Danxomè fondé au XVIIe siècle.',
      deepHistory: 'Douze rois s’y sont succédé entre 1625 et 1900. On y admire les bas-reliefs en terre cuite polychrome, les trônes sculptés montés sur des crânes d’ennemis et les sépultures sacrées.',
      etiquette: [
        'Bordures sacrées des bas-reliefs intouchables',
        'Salutation respectueuse de la main droite devant le trône royal',
        'Silence requis dans les cours mémorielles des reines et amazones'
      ],
      commonsQuery: 'Royal Palaces of Abomey'
    },
    'ganvie': {
      name: 'Ganvié, la Venise Africaine du Lac Nokoué',
      category: 'Nature',
      location: 'Lac Nokoué, So-Ava, Bénin',
      coordinates: { lat: 6.4678, lng: 2.4172 },
      summary: 'Plus grande cité lacustre d’Afrique de l’Ouest, érigée au XVIIIe siècle sur pilotis par le peuple Tofinu pour échapper aux razzias esclavagistes.',
      deepHistory: 'Son nom signifie "nous sommes sauvés dans la collectivité". Le marché flottant matinal et les maisons sur pilotis en bambou forment un écosystème d’une rare harmonie aquatique.',
      etiquette: [
        'Port du gilet de sauvetage obligatoire lors de la traversée',
        'Toujours demander la permission aux commerçantes du marché flottant avant de photographier',
        'Préserver la propreté du lac en ne jetant aucun déchet'
      ],
      commonsQuery: 'Ganvie Benin'
    },
    'porte': {
      name: 'Mémorial de la Porte du Non-Retour & Djègbadji',
      category: 'Historical',
      location: 'Plage de Ouidah, Bénin',
      coordinates: { lat: 6.3195, lng: 2.0878 },
      summary: 'Monument mémoriel majeur érigé face à l’Océan Atlantique, commémorant l’ultime étape de la déportation des captifs africains lors de la traite transatlantique.',
      deepHistory: 'Érigée en 1995 à l’initiative de l’UNESCO, dans le cadre du projet international « La Route de l’esclave », la Porte du Non-Retour est l’œuvre de l’architecte Yves Ahouen-Gnimon, avec des bas-reliefs de Fortuné Bandeira, des bronzes de Dominique Kouas Gnonnou et des masques egungun sculptés par Yves Kpede. Le monument honore les ancêtres déportés et symbolise la réconciliation et le retour mémoriel de la diaspora.',
      etiquette: [
        'Lieu de recueillement sacré : maintenir une attitude digne',
        'Moment privilégié au coucher du soleil pour les méditations',
        'Écouter les chants et poèmes récités par les guides mémoriaux'
      ],
      commonsQuery: 'Door of No Return Ouidah'
    },
    'kpasse': {
      name: 'Forêt Sacrée de Kpassè & Arbre Métamorphique',
      category: 'Spiritual',
      location: 'Ouidah Centre, Bénin',
      coordinates: { lat: 6.3689, lng: 2.0834 },
      summary: 'Sanctuaire naturel et spirituel séculaire où le Roi Kpassè, fondateur de Ouidah au XIVe siècle, s’est mystiquement métamorphosé en un iroko géant.',
      deepHistory: 'Abritant de gigantesques sculptures modernes et rituelles des divinités Vodun (Lègba, Mami Wata, Héviosso, Gu), la forêt demeure un lieu actif de prières et de libations.',
      etiquette: [
        'Retirer ses couvre-chefs devant l’Arbre du Roi',
        'Ne rien cueillir ni ramasser au sol (sol consacré)',
        'Verser une offrande d’eau ou de boisson traditionnelle si invité par le prêtre'
      ],
      commonsQuery: 'Kpasse sacred forest Ouidah'
    },
    'honme': {
      name: 'Musée Honmè & Palais des Rois de Hogbonou',
      category: 'Historical',
      location: 'Porto-Novo, Bénin',
      coordinates: { lat: 6.4969, lng: 2.6289 },
      summary: 'Ancien palais royal du Roi Toffa Ier à Porto-Novo, illustrant l’art de vivre, l’architecture en terre cuite et la diplomatie des souverains du sud-Bénin.',
      deepHistory: 'Le musée conserve les instruments de musique cérémoniels royaux (les célèbres tambours Alounloun), les costumes d’apparat et la cour intérieure des cérémonies de couronnement.',
      etiquette: [
        'Interdiction de toucher les instruments cérémoniels sans guide',
        'Respect des cours privées réservées aux prêtresses de la cour'
      ],
      commonsQuery: 'Honme Porto-Novo'
    }
  };

  // Scraper / Cultural Data Aggregator (AI Powered with robust fallback)
  app.post("/api/scrape/cultural-data", requireAdmin, async (req: AuthRequest, res) => {
    const lower = boundedString(req.body?.siteName, LIMITS.title).toLowerCase();

    // Check catalog for instant rich matched data
    let matchedCatalog: any = null;
    for (const [key, val] of Object.entries(BENIN_CULTURAL_CATALOG)) {
      if (lower.includes(key) || val.name.toLowerCase().includes(lower)) {
        matchedCatalog = val;
        break;
      }
    }

    try {
      const ai = getAI();
      if (ai) {
        const prompt = `Effectue une recherche approfondie sur le patrimoine du Bénin pour le site ou sanctuaire culturel : "${lower}".
Détermine précisément:
1. Son nom complet et son type ("Sanctuaire", "Palais Royal", "Musée", "Cité Lacustre", "Forêt Sacrée").
2. Sa catégorie principale parmi: "Spiritual", "Historical", "Nature", "Arts", "Food", "Heritage", "Oral History", "Lodging", "Leisure".
3. Sa localisation géographique (Ville, Région, Bénin). Pour la position GPS : uniquement celle que la source consultée publie. Ne la déduis jamais du nom, de la ville voisine ni d'un ordre de grandeur ; à défaut, réponds null.
4. Un résumé captivant en 2 phrases ("summary").
5. Son histoire spirituelle et ancestrale approfondie ("deepHistory").
6. Les règles d'étiquette et de bienséance effectivement énoncées par la source ("etiquette"). Aucune n'est obligatoire : ne rattrape pas un manque par un nombre imposé.

Renvoie UNIQUEMENT un JSON valide au format:
{
  "name": "Nom complet du site",
  "category": "Spiritual" | "Historical" | "Nature" | "Arts" | "Food" | "Heritage" | "Oral History" | "Lodging" | "Leisure",
  "location": "Ville, Bénin",
  "coordinates": { "lat": <latitude publiée par la source>, "lng": <longitude publiée par la source> } | null,
  "summary": "Court résumé captivant",
  "deepHistory": "Histoire détaillée et signification rituelle/historique",
  "etiquette": ["Règle publiée par la source"]
}`;

        let response;
        try {
          response = await withTimeout(ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              tools: [{ googleSearch: {} }],
              responseMimeType: "application/json"
            }
          }), 7000);
        } catch (toolErr: any) {
          console.warn("Search tool query failed or timed out, retrying direct generation:", toolErr?.message || toolErr);
          response = await withTimeout(ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          }), 6000);
        }

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.name) {
          const grounding = (response.candidates?.[0]?.groundingMetadata as any)?.groundingChunks || [];
          const sources = grounding
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source sans titre', url: c.web.uri }));
          const images = await commonsImages(matchedCatalog?.commonsQuery || parsed.name);
          return res.json({
            success: true,
            data: {
              ...parsed,
              images,
              sources,
              // Le texte sort d'un modèle : seul le catalogue écrit à la main mérite « vérifié ».
              verified: Boolean(matchedCatalog)
            }
          });
        }
      }
    } catch (err: any) {
      console.warn("AI scraper live lookup note:", err?.message || err);
    }

    // Fallback to rich catalog or structured fallback
    if (matchedCatalog) {
      const { commonsQuery, ...curated } = matchedCatalog;
      return res.json({
        success: true,
        data: {
          ...curated,
          images: await commonsImages(commonsQuery),
          verified: true
        }
      });
    }

    // Generic Beninese cultural site fallback
    const isSpiritual = lower.includes('vodun') || lower.includes('temple') || lower.includes('sanctuaire') || lower.includes('arbre') || lower.includes('forêt');
    const isNature = lower.includes('lac') || lower.includes('pendjari') || lower.includes('fleuve') || lower.includes('chutes') || lower.includes('parc');
    const isArts = lower.includes('centre') || lower.includes('art') || lower.includes('tissage') || lower.includes('sculpture');

    const cat = isSpiritual ? 'Spiritual' : isNature ? 'Nature' : isArts ? 'Arts' : 'Historical';

    // Rien n'est connu de ce site : la réponse reste un brouillon vide que l'administration
    // devra compléter. Ni la position ni le résumé ne sont devinés ici.
    return res.json({
      success: true,
      data: {
        name: lower,
        category: cat,
        location: '',
        coordinates: null,
        summary: '',
        deepHistory: '',
        etiquette: [],
        images: await commonsImages(lower),
        verified: false
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const fs = await import('fs');
    const cwdDist = path.join(process.cwd(), 'dist');
    const dirDist = path.join(__dirname, 'index.html');
    const distPath = fs.existsSync(path.join(cwdDist, 'index.html'))
      ? cwdDist
      : (fs.existsSync(dirDist) ? __dirname : cwdDist);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cultural API & Cloud SQL server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
