import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "La Vibe Map Cultural API", timestamp: new Date().toISOString() });
  });

  // AI Cultural Companion Chat API
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAI();
      if (!ai) {
        // Fallback response if key is missing
        return res.json({
          reply: `Akwaba ! Concernant votre question sur "${message}" : Au Bénin, les traditions vivantes (Vodun, Royauté d'Abomey, Rites Gèlèdé) reposent sur le profond respect des aînés et des sanctuaires. N'hésitez pas à demander la permission aux gardiens avant toute photo.`,
          fonPhrase: {
            fon: "Kou do agbé",
            phonetic: "Kou doh ah-gbeh",
            meaning: "Bonjour / Paix et longue vie"
          },
          etiquetteTip: "Dans les couvents et cours royales, retirez chaussures et couvrez vos épaules par respect."
        });
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
      if (Array.isArray(conversationHistory)) {
        conversationHistory.slice(-4).forEach((h: any) => {
          if (h.text) {
            contents.push({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            });
          }
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        }
      });

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
      console.error("Gemini Chat API Error:", err);
      return res.status(500).json({
        error: "Erreur lors de la consultation de l'assistant culturel",
        fallbackReply: "Akwaba ! Les sanctuaires et cours royales du Bénin vous accueillent avec respect. Saluez toujours les dignitaires avant d'entamer une visite."
      });
    }
  });

  // AI Itinerary Weaver API
  app.post("/api/gemini/itinerary", async (req, res) => {
    try {
      const { duration, interests, userVibe } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          timeline: [
            {
              time: '08:30',
              title: 'Temple des Pythons & Salutation au Chef Traditionnel',
              description: 'Immersion respectueuse dans le sanctuaire totémique de Ouidah.',
              insight: 'Demandez la bénédiction du gardien avant d’entrer dans la chambre sacrée.',
              transitTime: '15 min de marche',
              placeId: 'ouidah-python',
              verified: true
            },
            {
              time: '11:00',
              title: 'La Route des Esclaves & Arbre de l’Oubli',
              description: 'Marche mémorielle commentée par un historien de la communauté.',
              insight: 'Observer une minute de silence sous l’Arbre du Retour.',
              transitTime: '20 min en Zémidjan',
              placeId: 'slave-route',
              verified: true
            },
            {
              time: '14:30',
              title: 'Porte du Non-Retour & Méditation Littorale',
              description: 'Arrivée sur la plage atlantique face au monument mémoriel.',
              insight: 'Les couchers de soleil y sont propices au recueillement.',
              placeId: 'porte-non-retour',
              verified: true
            }
          ]
        });
      }

      const prompt = `Génère un itinéraire culturel fluide et séquentiel au Bénin pour une durée de "${duration || '1 jour'}" avec les centres d'intérêt suivants: ${Array.isArray(interests) ? interests.join(', ') : 'Patrimoine, Spiritualité Vodun, Histoire'}. Le style du voyageur est "${userVibe || 'Explorateur Immersif'}".

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
      "placeId": "ouidah-python",
      "verified": true
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || '{"timeline": []}');
      return res.json(parsed);
    } catch (err: any) {
      console.error("Gemini Itinerary API Error:", err);
      return res.status(500).json({ error: "Erreur génération itinéraire" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cultural API & App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
