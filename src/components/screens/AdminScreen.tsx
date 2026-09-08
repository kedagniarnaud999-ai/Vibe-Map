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
  Clock, 
  Users, 
  MapPin, 
  Compass, 
  Database,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  DollarSign,
  Shield,
  Lock,
  ArrowLeft,
  Award,
  Check,
  X,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { Place, Category, Actor, CulturalEvent, AppLanguage, UserRole, GuideApplication } from '../../types';
import { 
  savePlaceToFirestore, 
  deletePlaceFromFirestore, 
  getAllBookingsForAdmin, 
  getAllRSVPsForAdmin,
  updateBookingStatus,
  getAllGuideApplicationsForAdmin,
  updateGuideApplicationStatus,
  BookingRecord 
} from '../../lib/firebase';
import { TRANSLATIONS } from '../../lib/i18n';

interface AdminScreenProps {
  currentLang: AppLanguage;
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
  currentLang,
  userRole,
  places,
  actors,
  events,
  onPlaceAddedOrUpdated,
  onPlaceDeleted,
  onOpenAuth,
  onBackToPublic
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [activeTab, setActiveTab] = useState<'scraper' | 'places' | 'guides' | 'bookings' | 'applications'>('scraper');
  const [searchSiteQuery, setSearchSiteQuery] = useState('');
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapedResult, setScrapedResult] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [guideApps, setGuideApps] = useState<GuideApplication[]>([]);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Place Form State
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceLocation, setNewPlaceLocation] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<Category>('Historical');
  const [newPlaceImage, setNewPlaceImage] = useState('');
  const [newPlaceDesc, setNewPlaceDesc] = useState('');
  const [newPlaceHistory, setNewPlaceHistory] = useState('');
  const [newPlaceLat, setNewPlaceLat] = useState('6.3622');
  const [newPlaceLng, setNewPlaceLng] = useState('2.0864');

  useEffect(() => {
    if (userRole === 'admin') {
      getAllBookingsForAdmin().then(setBookings);
      getAllRSVPsForAdmin().then(setRsvps);
      getAllGuideApplicationsForAdmin().then(setGuideApps);
    }
  }, [userRole]);

  // If user is not admin, show secure Access Guard
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#1c1917] text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#292524] rounded-3xl p-8 border border-amber-500/20 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              Zone Sécurisée & Dissociée
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Espace Administration du Patrimoine
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cet espace est strictement réservé aux conservateurs, administrateurs et gestionnaires de données patrimoniales de La Vibe Map.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {onOpenAuth && (
              <button
                onClick={() => onOpenAuth('admin')}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Shield className="w-4 h-4" />
                <span>Connexion Conservateur (kedagniarnaud999@gmail.com)</span>
              </button>
            )}

            {onBackToPublic && (
              <button
                onClick={onBackToPublic}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3c3836] text-gray-300 font-semibold text-xs hover:bg-[#4a4542] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retourner à l'Espace Public</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Web Scraper & Grounding Trigger
  const handleScrape = async (overrideName?: string) => {
    const query = (overrideName || searchSiteQuery).trim();
    if (!query) return;
    if (overrideName) setSearchSiteQuery(overrideName);
    setScrapeLoading(true);
    setScrapedResult(null);

    try {
      const res = await fetch('/api/scrape/cultural-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName: query })
      });
      const json = await res.json();
      if (json.data) {
        setScrapedResult({
          ...json.data,
          selectedImage: json.data.realImages?.[0] || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800'
        });
      }
    } catch (e) {
      console.error('Scrape error:', e);
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleSaveScrapedAsPlace = async () => {
    if (!scrapedResult) return;
    const newPlace: Place = {
      id: 'place-' + Date.now(),
      name: scrapedResult.name || searchSiteQuery,
      location: scrapedResult.location || 'Bénin',
      category: scrapedResult.category || 'Spiritual',
      distanceKm: 28,
      image: scrapedResult.selectedImage || scrapedResult.realImages?.[0] || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
      description: scrapedResult.summary || 'Site du patrimoine béninois.',
      deepHistory: scrapedResult.deepHistory || `Horaires constatés: ${scrapedResult.openingHours || '8h30-18h'}. Tarifs indicatifs: ${scrapedResult.admissionFee || '2 000 FCFA'}.`,
      badges: ['Donnée Vérifiée ANPT', 'Patrimoine Bénin'],
      etiquette: (scrapedResult.etiquette || ['Respecter le protocole traditionnel', 'Demander l\'autorisation pour photographier']).map((rule: string) => ({
        title: rule,
        description: 'Règle recommandée pour la visite.',
        icon: 'Shield'
      })),
      visualGuides: [],
      verifiedGuideIds: ['1', '2'],
      vocabulary: [],
      coordinates: {
        x: 50,
        y: 50,
        lat: scrapedResult.coordinates?.lat || 6.3622,
        lng: scrapedResult.coordinates?.lng || 2.0864
      }
    };

    await savePlaceToFirestore(newPlace);
    onPlaceAddedOrUpdated(newPlace);
    alert(`Le site "${newPlace.name}" (${newPlace.category}) a été enregistré dans le catalogue !`);
    setScrapedResult(null);
    setSearchSiteQuery('');
  };

  const handleCreateOrUpdatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    const placeToSave: Place = {
      id: editingPlace ? editingPlace.id : 'site-' + Date.now(),
      name: newPlaceName,
      location: newPlaceLocation,
      category: newPlaceCategory,
      distanceKm: 35,
      image: newPlaceImage || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=600',
      description: newPlaceDesc,
      deepHistory: newPlaceHistory,
      badges: ['Patrimoine National'],
      etiquette: [
        { title: 'Tenue respectueuse', description: 'Épaules et jambes couvertes', icon: 'Shield' },
        { title: 'Demander avant de photographier', description: 'Accord du dignitaire requis', icon: 'Sparkles' }
      ],
      visualGuides: [],
      verifiedGuideIds: ['1', '2'],
      vocabulary: [],
      coordinates: {
        x: 50,
        y: 50,
        lat: parseFloat(newPlaceLat) || 6.36,
        lng: parseFloat(newPlaceLng) || 2.08
      }
    };

    await savePlaceToFirestore(placeToSave);
    onPlaceAddedOrUpdated(placeToSave);
    setShowAddModal(false);
    setEditingPlace(null);
    resetPlaceForm();
    alert(`Site "${placeToSave.name}" sauvegardé avec succès !`);
  };

  const handleDeletePlace = async (id: string, name: string) => {
    if (confirm(`Confirmez-vous la suppression définitive du site "${name}" ?`)) {
      await deletePlaceFromFirestore(id);
      onPlaceDeleted(id);
    }
  };

  const handleApproveGuide = async (appId: string, userId: string) => {
    const success = await updateGuideApplicationStatus(appId, userId, 'approved');
    if (success) {
      setGuideApps((prev) => prev.map((a) => a.id === appId ? { ...a, status: 'approved' } : a));
      alert('Guide agréé avec succès ! Son rôle a été mis à jour.');
    }
  };

  const handleRejectGuide = async (appId: string, userId: string) => {
    const success = await updateGuideApplicationStatus(appId, userId, 'rejected');
    if (success) {
      setGuideApps((prev) => prev.map((a) => a.id === appId ? { ...a, status: 'rejected' } : a));
    }
  };

  const resetPlaceForm = () => {
    setNewPlaceName('');
    setNewPlaceLocation('');
    setNewPlaceCategory('Historical');
    setNewPlaceImage('');
    setNewPlaceDesc('');
    setNewPlaceHistory('');
    setNewPlaceLat('6.3622');
    setNewPlaceLng('2.0864');
  };

  const openEditModal = (p: Place) => {
    setEditingPlace(p);
    setNewPlaceName(p.name);
    setNewPlaceLocation(p.location);
    setNewPlaceCategory(p.category);
    setNewPlaceImage(p.image);
    setNewPlaceDesc(p.description);
    setNewPlaceHistory(p.deepHistory || '');
    setNewPlaceLat(String(p.coordinates?.lat || 6.36));
    setNewPlaceLng(String(p.coordinates?.lng || 2.08));
    setShowAddModal(true);
  };

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
                  Panneau de Contrôle du Conservateur
                </h1>
                <p className="text-xs text-gray-300 mt-0.5">
                  Supervision Cloud Firestore & PostgreSQL • Scraping Grounding • Validation Guides
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-mono">
                ● Base En Ligne
              </span>
              {onBackToPublic && (
                <button
                  onClick={onBackToPublic}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-200 transition-all cursor-pointer"
                >
                  Vue Visiteur
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
              <span>Scraper & Grounding IA</span>
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
              <span>Gestion des Sanctuaires ({places.length})</span>
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
              <span>Agrément Guides ({guideApps.length})</span>
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
              <span>Réservations Visiteurs ({bookings.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Web Scraper */}
        {activeTab === 'scraper' && (
          <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-5">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2c2926] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#c14e2f]" />
                <span>Scraping Automatique de Données Réelles du Patrimoine</span>
              </h3>
              <p className="text-xs text-[#6b665e] mt-1">
                Interrogez le web et les répertoires officiels via Gemini Grounding pour extraire automatiquement les horaires, tarifs réels, étiquettes sacrées et résumés historiques vérifiés.
              </p>
            </div>

            {/* Quick Suggested Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#8c867c] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#c14e2f]" />
                Suggestions rapides de sites du Bénin :
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
                  placeholder="Ex: Forêt Sacrée de Kpassè, Temple des Pythons, Palais Royal d'Abomey..."
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
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Scraper le Web</span>
                  </>
                )}
              </button>
            </div>

            {/* Scraped Preview & Edit Card */}
            {scrapedResult && (
              <div className="p-5 bg-[#faf7f0] rounded-2xl border border-[#d6cfbe] space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e2d5]">
                  <div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Données Authentiques Récupérées</span>
                    </span>
                    <p className="text-xs text-[#6b665e] mt-1">
                      Vérifiez la catégorie et les photos avant d'enregistrer.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveScrapedAsPlace}
                    className="px-5 py-2.5 bg-[#2e5a44] text-white rounded-xl text-xs font-bold hover:bg-[#204030] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer dans le Catalogue</span>
                  </button>
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#2c2926] mb-1.5">
                    Catégorie du Site :
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'Spiritual', label: '🕊️ Sanctuaire & Spirituel' },
                      { id: 'Historical', label: '🏛️ Palais & Histoire' },
                      { id: 'Nature', label: '🌿 Nature & Cité Lacustre' },
                      { id: 'Arts', label: '🎨 Arts & Artisanat' }
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
                </div>

                {/* Real Photos Selection */}
                {scrapedResult.realImages && scrapedResult.realImages.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-[#2c2926] mb-1.5">
                      Photo Réelle Associée :
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {scrapedResult.realImages.map((imgUrl: string, i: number) => (
                        <div
                          key={i}
                          onClick={() => setScrapedResult({ ...scrapedResult, selectedImage: imgUrl })}
                          className={`relative h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            (scrapedResult.selectedImage || scrapedResult.realImages[0]) === imgUrl
                              ? 'border-[#c14e2f] ring-2 ring-[#c14e2f]/30 scale-[1.02]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="Photo" className="w-full h-full object-cover" />
                          {(scrapedResult.selectedImage || scrapedResult.realImages[0]) === imgUrl && (
                            <div className="absolute top-1 right-1 bg-[#c14e2f] text-white p-1 rounded-full">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#2c2926] block mb-1">Nom & Résumé</label>
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
                    <label className="font-bold text-[#2c2926] block mb-1">Détails Pratiques & Coordonnées</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Localisation (ex: Ouidah, Bénin)"
                        value={scrapedResult.location || ''}
                        onChange={(e) => setScrapedResult({ ...scrapedResult, location: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Horaires"
                          value={scrapedResult.openingHours || ''}
                          onChange={(e) => setScrapedResult({ ...scrapedResult, openingHours: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Tarifs"
                          value={scrapedResult.admissionFee || ''}
                          onChange={(e) => setScrapedResult({ ...scrapedResult, admissionFee: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs"
                        />
                      </div>
                    </div>
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
                  Catalogue des Sanctuaires et Sites ({places.length})
                </h3>
                <p className="text-xs text-[#6b665e]">
                  Synchronisé avec Firestore et Cloud SQL
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPlace(null);
                  resetPlaceForm();
                  setShowAddModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-[#a83f23] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Sanctuaire</span>
              </button>
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
                        {place.category}
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
                      <span>Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDeletePlace(place.id, place.name)}
                      className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
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
                <span>Demandes d'Agrément des Guides & Médiateurs ({guideApps.length})</span>
              </h3>
              <p className="text-xs text-[#6b665e] mt-0.5">
                Validez les compétences des guides locaux postulant pour accompagner des visiteurs.
              </p>
            </div>

            {guideApps.length === 0 ? (
              <div className="p-8 text-center bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] text-xs text-[#6b665e]">
                Aucune demande d'agrément en attente.
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
                        <span>⭐ {app.experienceYears} ans d'expérience</span>
                      </div>
                      <p className="text-[11px] text-[#5a5a40]">
                        🗣️ Langues : {app.languages?.join(', ')} • Spécialités : {app.specialties?.join(', ')}
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
                          onClick={() => handleApproveGuide(app.id!, app.userId)}
                          className="px-3 py-1.5 rounded-xl bg-[#2e5a44] text-white text-xs font-bold hover:bg-[#204030] flex items-center gap-1 shadow cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Agréer Guide</span>
                        </button>
                        <button
                          onClick={() => handleRejectGuide(app.id!, app.userId)}
                          className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Rejeter</span>
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
              Réservations d'Immersions et Visites ({bookings.length})
            </h3>

            {bookings.length === 0 ? (
              <div className="p-8 text-center bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] text-xs text-[#6b665e]">
                Aucune réservation enregistrée pour le moment.
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
                        Voyageur : {b.travelerName} ({b.travelerEmail}) • Date : {b.dateTime}
                      </div>
                      <div className="text-[#c14e2f] font-bold mt-1">
                        Montant : {b.price}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-bold text-[10px]">
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
                {editingPlace ? 'Modifier le Sanctuaire' : 'Ajouter un Nouveau Sanctuaire'}
              </h3>

              <form onSubmit={handleCreateOrUpdatePlace} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">Nom du Site</label>
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
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">Localisation</label>
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
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">Catégorie</label>
                    <select
                      value={newPlaceCategory}
                      onChange={(e) => setNewPlaceCategory(e.target.value as Category)}
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    >
                      <option value="Spiritual">Spirituel (Vodun)</option>
                      <option value="Historical">Historique & Royal</option>
                      <option value="Nature">Nature & Écotourisme</option>
                      <option value="Arts">Arts & Artisanat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">URL Image</label>
                  <input
                    type="url"
                    value={newPlaceImage}
                    onChange={(e) => setNewPlaceImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">Latitude</label>
                    <input
                      type="text"
                      value={newPlaceLat}
                      onChange={(e) => setNewPlaceLat(e.target.value)}
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">Longitude</label>
                    <input
                      type="text"
                      value={newPlaceLng}
                      onChange={(e) => setNewPlaceLng(e.target.value)}
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">Description Courte</label>
                  <textarea
                    rows={2}
                    value={newPlaceDesc}
                    onChange={(e) => setNewPlaceDesc(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">Histoire Approfondie & Protocole</label>
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
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#c14e2f] text-white font-bold text-xs shadow hover:bg-[#a83f23]"
                  >
                    {editingPlace ? 'Mettre à Jour' : 'Créer le Sanctuaire'}
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
