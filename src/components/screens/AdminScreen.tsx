import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  MapPin, 
  Database,
  Calendar,
  RefreshCw,
  Shield,
  Lock,
  ArrowLeft,
  Award,
  Check,
  X,
  UserCheck
} from 'lucide-react';
import { Place, Category, Actor, CulturalEvent, UserRole, GuideApplication } from '../../types';
import { 
  savePlaceToFirestore, 
  deletePlaceFromFirestore, 
  getAllBookingsForAdmin, 
  getAllRSVPsForAdmin,
  getAllGuideApplicationsForAdmin,
  decideGuideApplication,
  apiFetch,
  BookingRecord 
} from '../../lib/firebase';
import { PLACES_DATA } from '../../data/places';
import { useI18n } from '../../lib/i18n';
import { commonsThumb, creditLine } from '../../lib/media';
import { useCategoryLabel } from '../../lib/labels';

interface AdminScreenProps {
  userRole?: UserRole;
  places: Place[];
  actors: Actor[];
  events: CulturalEvent[];
  onPlaceAddedOrUpdated: (place: Place) => void;
  onPlaceDeleted: (placeId: string) => void;
  onOpenAuth?: (targetRole?: UserRole) => void;
  onBackToPublic?: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  userRole,
  places,
  actors,
  events,
  onPlaceAddedOrUpdated,
  onPlaceDeleted,
  onOpenAuth,
  onBackToPublic
}) => {
  const { t } = useI18n();
  const categoryLabel = useCategoryLabel();
  const [activeTab, setActiveTab] = useState<'scraper' | 'places' | 'guides' | 'bookings' | 'applications'>('scraper');
  const [isCatalogPublishing, setIsCatalogPublishing] = useState(false);
  const [searchSiteQuery, setSearchSiteQuery] = useState('');
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapedResult, setScrapedResult] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [guideApps, setGuideApps] = useState<GuideApplication[]>([]);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Place Form State
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceLocation, setNewPlaceLocation] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<Category>('Historical');
  const [newPlaceImageFile, setNewPlaceImageFile] = useState('');
  const [newPlaceImageAuthor, setNewPlaceImageAuthor] = useState('');
  const [newPlaceImageLicense, setNewPlaceImageLicense] = useState('');
  const [newPlaceDesc, setNewPlaceDesc] = useState('');
  const [newPlaceHistory, setNewPlaceHistory] = useState('');
  const [newPlaceLat, setNewPlaceLat] = useState('');
  const [newPlaceLng, setNewPlaceLng] = useState('');

  useEffect(() => {
    if (userRole === 'admin') {
      getAllBookingsForAdmin().then(setBookings);
      getAllRSVPsForAdmin().then(setRsvps);
      getAllGuideApplicationsForAdmin().then(setGuideApps);
    }
  }, [userRole]);

  // If the verified claim is not admin, nothing below is rendered
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#1c1917] text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#292524] rounded-3xl p-8 border border-amber-500/20 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              {t('Zone Sécurisée & Dissociée')}
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              {t('Espace Administration du Patrimoine')}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('Cet espace exige le rôle administrateur vérifié dans Firebase. Un compte sans ce rôle reste visiteur, quelle que soit son adresse email.')}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {onOpenAuth && (
              <button
                onClick={() => onOpenAuth('admin')}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Shield className="w-4 h-4" />
                <span>{t('Connexion Conservateur')}</span>
              </button>
            )}

            {onBackToPublic && (
              <button
                onClick={onBackToPublic}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3c3836] text-gray-300 font-semibold text-xs hover:bg-[#4a4542] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t("Retourner à l'Espace Public")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Web Scraper & Grounding Trigger (server route requires the admin claim)
  const handleScrape = async (overrideName?: string) => {
    const query = (overrideName || searchSiteQuery).trim();
    if (!query) return;
    if (overrideName) setSearchSiteQuery(overrideName);
    setScrapeLoading(true);
    setScrapeError(null);
    setScrapedResult(null);

    try {
      const json = await apiFetch<any>('/api/scrape/cultural-data', {
        method: 'POST',
        body: { siteName: query }
      });
      if (json.data) {
        setScrapedResult({
          ...json.data,
          selectedImage: json.data.images?.[0] || null
        });
      }
    } catch (e: any) {
      setScrapeError(e?.message || t('Le scraping est indisponible (accès refusé ou serveur d’administration indisponible).'));
    } finally {
      setScrapeLoading(false);
    }
  };

  // Upserts by place id, so publishing twice refreshes the same documents instead of duplicating them.
  const handlePublishBundledCatalog = async () => {
    setIsCatalogPublishing(true);
    const outcomes = await Promise.all(
      PLACES_DATA.map(async (place) => ({ place, saved: await savePlaceToFirestore(place) })),
    );
    outcomes.filter((outcome) => outcome.saved).forEach(({ place }) => onPlaceAddedOrUpdated(place));

    const failed = outcomes.filter((outcome) => !outcome.saved).length;
    setIsCatalogPublishing(false);
    alert(failed === 0
      ? t('{n} sites du catalogue embarqué sont publiés dans Firestore : ils sont désormais modifiables ici.', { n: outcomes.length })
      : t('{published} sites publiés, {failed} refusés. Un refus veut dire que le compte connecté ne porte pas le rôle admin.', { published: outcomes.length - failed, failed }));
  };

  const handleSaveScrapedAsPlace = async () => {
    if (!scrapedResult) return;
    const chosen = scrapedResult.selectedImage || scrapedResult.images?.[0];
    const coordinates = scrapedResult.coordinates;

    // Une image sans auteur ni licence est une image d'emprunt : le catalogue refuse la
    // publication plutôt que d'illustrer un lieu avec une photo qui ne le montre pas.
    if (!chosen?.thumb || !chosen?.author || !chosen?.license) {
      alert(t('Publication refusée : aucune photo Wikimedia Commons créditée n’est associée à ce site.'));
      return;
    }
    if (typeof coordinates?.lat !== 'number' || typeof coordinates?.lng !== 'number') {
      alert(t('Publication refusée : la recherche n’a pas donné de position pour ce site, et ce brouillon n’en saisit pas. Reprenez la fiche dans le formulaire manuel pour indiquer sa latitude et sa longitude.'));
      return;
    }
    // Le champ « Localisation » est vide sous les yeux de l’administrateur : l’enregistrer
    // quand même en écrivant « Bénin » ferait passer le pays pour la ville du site.
    if (typeof scrapedResult.location !== 'string' || !scrapedResult.location.trim()) {
      alert(t('Publication refusée : aucune localité n’est renseignée dans le champ « Localisation » de ce brouillon. « Bénin » n’est pas une localité, c’est le pays de tous les sites.'));
      return;
    }
    // De même, la catégorie détermine les puces sélectionnées dans ce brouillon : sans choix
    // visible, inscrire « Spiritual » classerait un lieu inconnu parmi les sanctuaires.
    if (typeof scrapedResult.category !== 'string' || !scrapedResult.category.trim()) {
      alert(t('Publication refusée : aucune catégorie n’est sélectionnée dans ce brouillon. Choisissez l’une des neuf catégories proposées avant d’enregistrer.'));
      return;
    }
    // La notice est le corps de la fiche : une phrase d’attente à la place afficherait un
    // vide habillé en contenu, en français de surcroît dans une interface anglaise.
    if (typeof scrapedResult.summary !== 'string' || !scrapedResult.summary.trim()) {
      alert(t('Publication refusée : le champ « Résumé » de ce brouillon est vide. La notice du site ne s’écrit pas toute seule : complétez-le à partir de la source consultée.'));
      return;
    }

    const newPlace: Place = {
      id: 'place-' + Date.now(),
      name: scrapedResult.name || searchSiteQuery,
      location: scrapedResult.location,
      category: scrapedResult.category,
      image: chosen.thumb,
      imageCredit: { file: chosen.file, author: chosen.author, license: chosen.license },
      description: scrapedResult.summary,
      deepHistory: scrapedResult.deepHistory || undefined,
      // Un classement patrimonial se cite avec sa source ; il ne se déduit pas d'un
      // brouillon en cours de rédaction. Le formulaire n'en saisit aucun.
      badges: [],
      etiquette: (scrapedResult.etiquette || []).map((rule: string) => ({
        title: rule,
        // La règle publiée tient dans son énoncé : rien à ajouter dessous.
        description: '',
        icon: 'Shield'
      })),
      visualGuides: [],
      verifiedGuideIds: [],
      vocabulary: [],
      coordinates: {
        lat: coordinates.lat,
        lng: coordinates.lng
      }
    };

    const saved = await savePlaceToFirestore(newPlace);
    if (!saved) {
      alert(t("Échec de l'enregistrement de « {name} ». Un refus signifie que le compte connecté ne porte pas le rôle admin.", { name: newPlace.name }));
      return;
    }

    onPlaceAddedOrUpdated(newPlace);
    setScrapedResult(null);
    setSearchSiteQuery('');
    alert(t('Le site "{name}" ({category}) a été enregistré dans le catalogue !', { name: newPlace.name, category: categoryLabel(newPlace.category) }));
  };

  const handleCreateOrUpdatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageFile = newPlaceImageFile.trim();
    const imageAuthor = newPlaceImageAuthor.trim();
    const imageLicense = newPlaceImageLicense.trim();
    // Une photo de lieu doit être nommée, signée et sous licence : sans ces trois
    // informations, elle ne vaut pas comme document et n'entre pas au catalogue.
    if (!imageFile || !imageAuthor || !imageLicense) {
      alert(t('Publication refusée : indiquez le fichier Wikimedia Commons, son auteur et sa licence.'));
      return;
    }
    const latitude = parseFloat(newPlaceLat);
    const longitude = parseFloat(newPlaceLng);
    // La position est une donnée géographique, pas un détail de mise en page :
    // un repli l'épinglerait sur la carte au milieu d'un autre site.
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      alert(t('Publication refusée : indiquez une latitude entre -90 et 90 et une longitude entre -180 et 180.'));
      return;
    }
    const placeToSave: Place = {
      id: editingPlace ? editingPlace.id : 'site-' + Date.now(),
      name: newPlaceName,
      location: newPlaceLocation,
      category: newPlaceCategory,
      image: commonsThumb(imageFile, 960),
      imageCredit: { file: imageFile, author: imageAuthor, license: imageLicense },
      description: newPlaceDesc,
      deepHistory: newPlaceHistory,
      // Le formulaire ne demande ni le classement ni le protocole du lieu : les inscrire
      // d'office ferait passer chaque nouvelle fiche pour un site classé à tenue couverte.
      badges: [],
      etiquette: [],
      visualGuides: [],
      verifiedGuideIds: [],
      vocabulary: [],
      coordinates: {
        lat: latitude,
        lng: longitude
      }
    };

    const saved = await savePlaceToFirestore(placeToSave);
    if (!saved) {
      alert(t("Échec de l'enregistrement de « {name} ». Un refus signifie que le compte connecté ne porte pas le rôle admin.", { name: placeToSave.name }));
      return;
    }

    onPlaceAddedOrUpdated(placeToSave);
    setShowAddModal(false);
    setEditingPlace(null);
    resetPlaceForm();
    alert(t('Site "{name}" sauvegardé avec succès !', { name: placeToSave.name }));
  };

  const handleDeletePlace = async (id: string, name: string) => {
    if (!confirm(t('Confirmez-vous la suppression définitive du site "{name}" ?', { name }))) {
      return;
    }

    const deleted = await deletePlaceFromFirestore(id);
    if (!deleted) {
      alert(t('Suppression refusée pour « {name} ». Vérifiez que le compte connecté porte le rôle admin.', { name }));
      return;
    }

    onPlaceDeleted(id);
  };

  // The decision route writes the application and the Firebase role claim together.
  const decide = async (appId: string, status: 'approved' | 'rejected') => {
    setDecisionError(null);
    const result = await decideGuideApplication(appId, status);

    if (!result.success) {
      setDecisionError(result.error || t('Décision impossible : vérifiez les droits administrateur et la disponibilité du serveur.'));
      return;
    }

    setGuideApps((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
    if (status === 'approved') {
      alert(t('Guide agréé. Son rôle a été accordé et ses sessions précédentes ont été révoquées.'));
    }
  };

  const resetPlaceForm = () => {
    setNewPlaceName('');
    setNewPlaceLocation('');
    setNewPlaceCategory('Historical');
    setNewPlaceImageFile('');
    setNewPlaceImageAuthor('');
    setNewPlaceImageLicense('');
    setNewPlaceDesc('');
    setNewPlaceHistory('');
    setNewPlaceLat('');
    setNewPlaceLng('');
  };

  const openEditModal = (p: Place) => {
    setEditingPlace(p);
    setNewPlaceName(p.name);
    setNewPlaceLocation(p.location);
    setNewPlaceCategory(p.category);
    setNewPlaceImageFile(p.imageCredit?.file || '');
    setNewPlaceImageAuthor(p.imageCredit?.author || '');
    setNewPlaceImageLicense(p.imageCredit?.license || '');
    setNewPlaceDesc(p.description);
    setNewPlaceHistory(p.deepHistory || '');
    setNewPlaceLat(String(p.coordinates?.lat ?? ''));
    setNewPlaceLng(String(p.coordinates?.lng ?? ''));
    setShowAddModal(true);
  };

  const chosenScrapedImage = scrapedResult?.selectedImage || scrapedResult?.images?.[0] || null;

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-6 px-4 font-sans text-[#2c2926]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Admin Cockpit Header */}
        <div className="bg-[#2c2926] text-white rounded-3xl p-6 shadow-xl border border-amber-400/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  {t('Panneau de Contrôle du Conservateur')}
                </h1>
                <p className="text-xs text-gray-300 mt-0.5">
                  {t('Supervision Cloud Firestore & PostgreSQL • Scraping Grounding • Validation Guides')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-mono">
                ● {t('Rôle Vérifié')}
              </span>
              {onBackToPublic && (
                <button
                  onClick={onBackToPublic}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 transition-all cursor-pointer"
                >
                  {t('Vue Visiteur')}
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 border-t border-white/10 pt-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('scraper')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'scraper'
                  ? 'bg-amber-400 text-black shadow'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('Scraper & Grounding IA')}</span>
            </button>
            <button
              onClick={() => setActiveTab('places')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'places'
                  ? 'bg-amber-400 text-black shadow'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('Gestion des Sanctuaires ({n})', { n: places.length })}</span>
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'bg-amber-400 text-black shadow'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t('Agrément Guides ({n})', { n: guideApps.length })}</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-amber-400 text-black shadow'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('Réservations Visiteurs ({n})', { n: bookings.length })}</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Web Scraper */}
        {activeTab === 'scraper' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-5">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2c2926] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#c14e2f]" />
                <span>{t('Scraping documenté du patrimoine')}</span>
              </h3>
              <p className="text-xs text-[#6b665e] mt-1">
                {t('Interrogez le web et les répertoires via Gemini Grounding : nom, résumé et histoire reviennent en brouillon, avec les sources consultées et des photos sous crédit Wikimedia. Sans correspondance documentée, le brouillon reste vide et la publication est refusée.')}
              </p>
            </div>

            {/* Quick Suggested Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#8c867c] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#c14e2f]" />
                {t('Suggestions rapides de sites du Bénin :')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Temple des Pythons (Ouidah)',
                  'Palais Royaux d’Abomey',
                  'Ganvié Cité Lacustre',
                  'Porte du Non-Retour',
                  'Forêt Sacrée de Kpassè',
                  'Musée Honmè Porto-Novo'
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleScrape(preset)}
                    className="px-2.5 py-1 rounded-xl bg-[#faf7f0] border border-[#e8e2d5] hover:border-[#c14e2f] text-[11px] text-[#2c2926] font-medium transition-all"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                <input
                  type="text"
                  value={searchSiteQuery}
                  onChange={(e) => setSearchSiteQuery(e.target.value)}
                  placeholder={t("Ex: Forêt Sacrée de Kpassè, Temple des Pythons, Palais Royal d'Abomey...")}
                  className="w-full pl-10 pr-4 py-3 bg-[#faf7f0] border border-[#e8e2d5] rounded-2xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                />
              </div>
              <button
                onClick={() => handleScrape()}
                disabled={scrapeLoading || !searchSiteQuery.trim()}
                className="px-6 py-3 rounded-2xl bg-[#c14e2f] text-white font-bold text-xs sm:text-sm hover:bg-[#a83f23] transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {scrapeLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('Scraping...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('Scraper le Web')}</span>
                  </>
                )}
              </button>
            </div>

            {scrapeError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{scrapeError}</span>
              </div>
            )}

            {/* Scraped Preview & Edit Card */}
            {scrapedResult && (
              <div className="p-5 bg-[#faf7f0] rounded-2xl border border-[#d6cfbe] space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e2d5]">
                  <div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('Données Authentiques Récupérées')}</span>
                    </span>
                    <p className="text-xs text-[#6b665e] mt-1">
                      {t("Vérifiez la catégorie et les photos avant d'enregistrer.")}
                    </p>
                  </div>
                  <button
                    onClick={handleSaveScrapedAsPlace}
                    className="px-5 py-2.5 bg-[#2e5a44] text-white rounded-xl text-xs font-bold hover:bg-[#204030] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('Enregistrer dans le Catalogue')}</span>
                  </button>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#2c2926] mb-1.5">
                    {t('Catégorie du Site :')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'Spiritual', label: t('🕊️ Sanctuaire & Spirituel') },
                      { id: 'Historical', label: t('🏛️ Palais & Histoire') },
                      { id: 'Nature', label: t('🌿 Nature & Cité Lacustre') },
                      { id: 'Arts', label: t('🎨 Arts & Artisanat') },
                      { id: 'Heritage', label: t('📜 Patrimoine') },
                      { id: 'Food', label: t('🍲 Gastronomie') },
                      { id: 'Oral History', label: t('🎙️ Histoire Orale') },
                      { id: 'Lodging', label: t('🛏️ Hébergement') },
                      { id: 'Leisure', label: t('🏖️ Loisirs') }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setScrapedResult({ ...scrapedResult, category: c.id })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          scrapedResult.category === c.id
                            ? 'bg-[#c14e2f] text-white shadow-sm'
                            : 'bg-white text-[#6b665e] border border-[#e8e2d5]'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {!String(scrapedResult.category || '').trim() && (
                    <p className="text-[11px] text-[#8a5a3c] mt-1.5">
                      {t('Aucune catégorie choisie : la recherche ne la devine pas. Sélectionnez-en une pour publier ce site.')}
                    </p>
                  )}
                </div>

                {/* Licensed photographs resolved on Wikimedia Commons */}
                <div>
                  <label className="block text-xs font-bold text-[#2c2926] mb-1.5">
                    {t('Photo Réelle Associée :')}
                  </label>
                  {scrapedResult.images?.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="grid grid-cols-3 gap-2">
                        {scrapedResult.images.map((image: any) => (
                          <div
                            key={image.file}
                            onClick={() => setScrapedResult({ ...scrapedResult, selectedImage: image })}
                            className={`relative h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                              chosenScrapedImage?.file === image.file
                                ? 'border-[#c14e2f] ring-2 ring-[#c14e2f]/30 scale-[1.02]'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={image.thumb} alt={image.file} className="w-full h-full object-cover" />
                            {chosenScrapedImage?.file === image.file && (
                              <div className="absolute top-1 right-1 bg-[#c14e2f] text-white p-1 rounded-full">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {chosenScrapedImage && (
                        <a
                          href={chosenScrapedImage.page}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[10px] text-[#5a5a40] hover:text-[#c14e2f] truncate"
                        >
                          {creditLine(chosenScrapedImage)}
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#8c867c]">
                      {t('Aucune photo sous licence trouvée sur Wikimedia Commons pour ce site : la publication restera refusée tant qu’aucune image créditée ne lui est associée.')}
                    </p>
                  )}
                </div>

                {/* Info Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#2c2926] block mb-1">{t('Nom & Résumé')}</label>
                    <input
                      type="text"
                      value={scrapedResult.name || ''}
                      onChange={(e) => setScrapedResult({ ...scrapedResult, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs mb-2 font-semibold"
                    />
                    <textarea
                      rows={3}
                      value={scrapedResult.summary || ''}
                      onChange={(e) => setScrapedResult({ ...scrapedResult, summary: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#6b665e]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#2c2926] block mb-1">{t('Localisation')}</label>
                    <input
                      type="text"
                      placeholder={t('ex : Ouidah, Bénin')}
                      value={scrapedResult.location || ''}
                      onChange={(e) => setScrapedResult({ ...scrapedResult, location: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Places Management */}
        {activeTab === 'places' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2c2926]">
                  {t('Catalogue des Sanctuaires et Sites ({n})', { n: places.length })}
                </h3>
                <p className="text-xs text-[#6b665e] flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  {t('Synchronisé avec Firestore et Cloud SQL')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePublishBundledCatalog}
                  disabled={isCatalogPublishing}
                  className="px-4 py-2 rounded-xl border border-[#c14e2f] text-[#c14e2f] text-xs font-bold flex items-center gap-1.5 hover:bg-[#fdf3ef] disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isCatalogPublishing ? 'animate-spin' : ''}`} />
                  <span>{isCatalogPublishing ? t('Publication…') : t('Publier le catalogue embarqué')}</span>
                </button>
                <button
                  onClick={() => {
                    setEditingPlace(null);
                    resetPlaceForm();
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-[#a83f23] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('Ajouter un Sanctuaire')}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] overflow-hidden flex flex-col justify-between"
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3.5 space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-sm text-[#2c2926] line-clamp-1">
                        {place.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white font-bold text-[#c14e2f] border border-[#e8e2d5]">
                        {categoryLabel(place.category)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6b665e] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c14e2f]" />
                      <span>{place.location}</span>
                    </p>
                    <p className="text-xs text-[#6b665e] line-clamp-2">{place.description}</p>
                  </div>

                  <div className="px-3.5 py-2.5 bg-white border-t border-[#e8e2d5] flex items-center justify-between">
                    <button
                      onClick={() => openEditModal(place)}
                      className="text-xs font-bold text-[#5a5a40] hover:text-[#2c2926] flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t('Modifier')}</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlace(place.id, place.name)}
                      className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t('Supprimer')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Guide Accreditation Applications */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2c2926] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#5a5a40]" />
                <span>{t("Demandes d'Agrément des Guides & Médiateurs ({n})", { n: guideApps.length })}</span>
              </h3>
              <p className="text-xs text-[#6b665e] mt-0.5">
                {t('Validez les compétences des guides locaux postulant pour accompagner des visiteurs.')}
              </p>
            </div>

            {decisionError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{decisionError}</span>
              </div>
            )}

            {guideApps.length === 0 ? (
              <div className="p-8 text-center bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] text-xs text-[#6b665e]">
                {t("Aucune demande d'agrément en attente.")}
              </div>
            ) : (
              <div className="space-y-3">
                {guideApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#2c2926]">
                          {app.fullName}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[#6b665e] flex flex-wrap gap-3 text-[11px]">
                        <span>📧 {app.email}</span>
                        <span>📱 {app.phone}</span>
                        <span>📍 {app.region}</span>
                        <span>⭐ {t("{n} ans d'expérience", { n: app.experienceYears })}</span>
                      </div>
                      <p className="text-[11px] text-[#5a5a40]">
                        🗣️ {t('Langues')} : {app.languages?.join(', ')} • {t('Spécialités')} : {app.specialties?.join(', ')}
                      </p>
                      {app.bio && (
                        <p className="text-[11px] text-[#8c867c] italic mt-1 bg-white p-2 rounded-lg border border-[#e8e2d5]">
                          "{app.bio}"
                        </p>
                      )}
                    </div>

                    {app.status === 'pending' && app.id && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => decide(app.id!, 'approved')}
                          className="px-3 py-1.5 rounded-xl bg-[#2e5a44] text-white text-xs font-bold hover:bg-[#204030] flex items-center gap-1 shadow cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{t('Agréer Guide')}</span>
                        </button>
                        <button
                          onClick={() => decide(app.id!, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{t('Rejeter')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 4: Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2c2926]">
              {t("Réservations d'Immersions et Visites ({n})", { n: bookings.length })}
            </h3>

            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] text-xs text-[#6b665e]">
                {t('Aucune réservation enregistrée pour le moment.')}
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id || Math.random()}
                    className="p-4 bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-serif font-bold text-sm text-[#2c2926]">
                        {b.experienceTitle}
                      </div>
                      <div className="text-[#6b665e] mt-0.5">
                        {t('Voyageur')} : {b.travelerName} ({b.travelerEmail}) • {t('Date')} : {b.dateTime}
                      </div>
                      <div className="text-[#c14e2f] font-bold mt-1">
                        {t('Montant')} : {b.price}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      b.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Place Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e8e2d5] max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif font-bold text-lg text-[#2c2926] mb-4">
                {editingPlace ? t('Modifier le Sanctuaire') : t('Ajouter un Nouveau Sanctuaire')}
              </h3>

              <form onSubmit={handleCreateOrUpdatePlace} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Nom du Site')}</label>
                  <input
                    type="text"
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Localisation')}</label>
                    <input
                      type="text"
                      value={newPlaceLocation}
                      onChange={(e) => setNewPlaceLocation(e.target.value)}
                      required
                      placeholder="Ouidah, Abomey..."
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Catégorie')}</label>
                    <select
                      value={newPlaceCategory}
                      onChange={(e) => setNewPlaceCategory(e.target.value as Category)}
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    >
                      <option value="Spiritual">{t('Spirituel (Vodun)')}</option>
                      <option value="Historical">{t('Historique & Royal')}</option>
                      <option value="Nature">{t('Nature & Écotourisme')}</option>
                      <option value="Arts">{t('Arts & Artisanat')}</option>
                      <option value="Heritage">{t('Patrimoine')}</option>
                      <option value="Food">{t('Gastronomie & Terroir')}</option>
                      <option value="Oral History">{t('Histoire Orale')}</option>
                      <option value="Lodging">{t('Hébergement & Séjours')}</option>
                      <option value="Leisure">{t('Loisirs & Plages')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Fichier Wikimedia Commons')}</label>
                  <input
                    type="text"
                    value={newPlaceImageFile}
                    onChange={(e) => setNewPlaceImageFile(e.target.value)}
                    placeholder="Porte du non-retour au Benin.jpg"
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Auteur de la photo')}</label>
                      <input
                        type="text"
                        value={newPlaceImageAuthor}
                        onChange={(e) => setNewPlaceImageAuthor(e.target.value)}
                        className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Licence')}</label>
                      <input
                        type="text"
                        value={newPlaceImageLicense}
                        onChange={(e) => setNewPlaceImageLicense(e.target.value)}
                        placeholder="CC BY-SA 4.0"
                        className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                      />
                    </div>
                  </div>
                  {newPlaceImageFile.trim() ? (
                    <div className="flex items-center gap-2 mt-2">
                      <img
                        src={commonsThumb(newPlaceImageFile.trim(), 160)}
                        alt=""
                        className="w-16 h-12 object-cover rounded-lg border border-[#e8e2d5]"
                      />
                      <span className="text-[10px] text-[#5a5a40]">
                        {newPlaceImageAuthor.trim() && newPlaceImageLicense.trim()
                          ? creditLine({ file: newPlaceImageFile.trim(), author: newPlaceImageAuthor.trim(), license: newPlaceImageLicense.trim() })
                          : t('Crédit incomplet : la fiche ne pourra pas être publiée.')}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#8c867c] mt-2">
                      {t('Aucun fichier : la publication sera refusée, aucune photo de remplacement n’est ajoutée.')}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Latitude')}</label>
                    <input
                      type="text"
                      placeholder="6.3622"
                      value={newPlaceLat}
                      onChange={(e) => setNewPlaceLat(e.target.value)}
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Longitude')}</label>
                    <input
                      type="text"
                      placeholder="2.0864"
                      value={newPlaceLng}
                      onChange={(e) => setNewPlaceLng(e.target.value)}
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Description Courte')}</label>
                  <textarea
                    rows={2}
                    value={newPlaceDesc}
                    onChange={(e) => setNewPlaceDesc(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">{t('Histoire Approfondie & Protocole')}</label>
                  <textarea
                    rows={3}
                    value={newPlaceHistory}
                    onChange={(e) => setNewPlaceHistory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#faf7f0] text-[#6b665e] font-semibold text-xs border border-[#e8e2d5]"
                  >
                    {t('Annuler')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#c14e2f] text-white font-bold text-xs shadow hover:bg-[#a83f23]"
                  >
                    {editingPlace ? t('Mettre à Jour') : t('Créer le Sanctuaire')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
