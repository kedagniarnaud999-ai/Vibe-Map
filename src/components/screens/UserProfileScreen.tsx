import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Globe, 
  Bell, 
  Compass, 
  Award, 
  Heart, 
  Check, 
  Info,
  Sparkles,
  LogIn,
  LogOut,
  Shield,
  Layers,
  Database,
  Phone,
  FileText,
  MapPin,
  Send,
  X,
  Lock
} from 'lucide-react';
import { UserPreferences, UserRole, AppLanguage, ScreenId } from '../../types';
import { syncUserProfileToFirestore, logoutUser, submitGuideApplication } from '../../lib/firebase';
import { TRANSLATIONS } from '../../lib/i18n';

interface UserProfileScreenProps {
  user: UserPreferences;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onUpdateUser?: (updated: Partial<UserPreferences>) => void;
  onOpenAuth: (targetRole?: UserRole) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ 
  user, 
  currentLang,
  onLanguageChange,
  onUpdateUser,
  onOpenAuth,
  onNavigate
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [travelStyle, setTravelStyle] = useState(user.travelStyle);
  const [notifications, setNotifications] = useState(user.notificationsEnabled);
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Préférences enregistrées avec succès !');

  // Guide accreditation modal
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [applicantName, setApplicantName] = useState(user.name);
  const [applicantEmail, setApplicantEmail] = useState(user.email);
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantRegion, setApplicantRegion] = useState('Ouidah & Abomey');
  const [applicantExperience, setApplicantExperience] = useState(3);
  const [applicantLanguages, setApplicantLanguages] = useState('Français, Fon, English');
  const [applicantSpecialties, setApplicantSpecialties] = useState('Histoire Royale, Rituels Vodun, Écotourisme');
  const [applicantBio, setApplicantBio] = useState('');
  const [applyingLoading, setApplyingLoading] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleSavePreferences = async () => {
    const updated = {
      ...user,
      travelStyle,
      notificationsEnabled: notifications,
      language: currentLang
    };
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    await syncUserProfileToFirestore(updated);
    setToastMessage('Préférences synchronisées avec Firestore !');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleLogout = async () => {
    await logoutUser();
    onOpenAuth('traveler');
  };

  const handleSubmitGuideApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyingLoading(true);

    try {
      const res = await submitGuideApplication({
        userId: user.id || 'anonymous-applicant',
        fullName: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        region: applicantRegion,
        experienceYears: Number(applicantExperience) || 1,
        languages: applicantLanguages.split(',').map(s => s.trim()),
        specialties: applicantSpecialties.split(',').map(s => s.trim()),
        bio: applicantBio
      });

      if (res.success) {
        setAppliedSuccess(true);
        setTimeout(() => {
          setShowGuideModal(false);
          setAppliedSuccess(false);
          setToastMessage('Demande d’agrément guide envoyée pour validation !');
          setSaveToast(true);
          setTimeout(() => setSaveToast(false), 3000);
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setApplyingLoading(false);
    }
  };

  const userRole = user.role || 'traveler';

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6 font-sans">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#2e5a44] text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-green-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
            Profil & Accréditation
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
            {t.navProfile}
          </h2>
        </div>

        <button
          onClick={() => onOpenAuth(userRole)}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e2d5] text-xs font-semibold text-[#c14e2f] hover:bg-[#faf7f0] flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Changer de Compte</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={user.name}
          referrerPolicy="no-referrer"
          className="w-20 h-20 rounded-2xl object-cover border-4 border-[#fceee9] shadow"
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="font-serif font-bold text-xl text-[#2c2926]">
              {user.name}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
              userRole === 'admin' ? 'bg-[#2c2926] text-amber-400 border border-amber-400/30' :
              userRole === 'guide' ? 'bg-[#5a5a40] text-white' : 'bg-[#fceee9] text-[#c14e2f]'
            }`}>
              {userRole === 'admin' ? (
                <>
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>👑 Administrateur / Conservateur</span>
                </>
              ) : userRole === 'guide' ? (
                <>
                  <Award className="w-3 h-3 text-white" />
                  <span>🎖️ Médiateur Culturel Agréé</span>
                </>
              ) : (
                <>
                  <Compass className="w-3 h-3 text-[#c14e2f]" />
                  <span>🎒 Voyageur du Patrimoine</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-[#8c867c]">{user.email}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#2e5a44] bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
              <Database className="w-3 h-3" />
              <span>Base Firestore & PostgreSQL Connectée</span>
            </span>
          </div>
        </div>
      </div>

      {/* Role-Specific Action Banners */}
      {userRole === 'admin' && (
        <div className="bg-[#2c2926] text-white rounded-3xl p-6 border border-amber-400/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h4 className="font-serif font-bold text-base text-amber-400">
                Espace Conservateur du Patrimoine
              </h4>
            </div>
            <p className="text-xs text-gray-300">
              Supervision des sanctuaires réels, scraping automatique de données, validation des réservations et gestion des guides agréés.
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-[#2c2926] font-bold text-xs hover:bg-amber-300 transition-all flex-shrink-0 cursor-pointer shadow"
          >
            Accéder à l'Administration →
          </button>
        </div>
      )}

      {userRole === 'guide' && (
        <div className="bg-[#5a5a40] text-white rounded-3xl p-6 border border-[#e8e2d5] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-200" />
              <h4 className="font-serif font-bold text-base text-white">
                Portail Guide & Médiateur Culturel
              </h4>
            </div>
            <p className="text-xs text-gray-200">
              Consultez vos demandes d'immersion reçues, mettez à jour votre tarif et gérez vos confirmations de visite.
            </p>
          </div>
          <button
            onClick={() => onNavigate('guide-portal')}
            className="px-5 py-2.5 rounded-xl bg-white text-[#5a5a40] font-bold text-xs hover:bg-[#faf7f0] transition-all flex-shrink-0 cursor-pointer shadow"
          >
            Ouvrir mon Espace Guide →
          </button>
        </div>
      )}

      {userRole === 'traveler' && (
        <div className="bg-gradient-to-r from-[#faf7f0] to-[#f5f1e8] rounded-3xl p-6 border border-[#e8e2d5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#c14e2f]">
              <Award className="w-5 h-5" />
              <h4 className="font-serif font-bold text-base text-[#2c2926]">
                Vous êtes Guide ou Gardien de Tradition ?
              </h4>
            </div>
            <p className="text-xs text-[#6b665e] max-w-md">
              Rejoignez le réseau officiel des médiateurs culturels agréés de La Vibe Map pour faire rayonner l'histoire du Bénin et recevoir des réservations de voyageurs.
            </p>
          </div>
          <button
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#5a5a40] text-white font-bold text-xs hover:bg-[#484833] transition-all flex-shrink-0 cursor-pointer shadow-sm"
          >
            Postuler comme Guide Agréé
          </button>
        </div>
      )}

      {/* Travel Preferences & Language */}
      <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-5">
        <h3 className="font-serif font-bold text-lg text-[#2c2926]">
          Préférences Culturelles & Langue
        </h3>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6b665e] uppercase tracking-wider block">
            {t.systemLang} (Synchronisation Temps Réel)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { code: 'fr' as AppLanguage, label: 'Français 🇫🇷' },
              { code: 'en' as AppLanguage, label: 'English 🇬🇧' },
              { code: 'fon' as AppLanguage, label: 'Fɔ̀ngbè 🇧🇯' },
              { code: 'goun' as AppLanguage, label: 'Gungbe 🇧🇯' },
              { code: 'yoruba' as AppLanguage, label: 'Yorùbá 🇧🇯' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => onLanguageChange(lang.code)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  currentLang === lang.code
                    ? 'bg-[#c14e2f] text-white border-[#c14e2f]'
                    : 'bg-[#faf7f0] text-[#2c2926] border-[#e8e2d5] hover:bg-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6b665e] uppercase tracking-wider block">
            Rythme d'exploration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'Relaxed', label: 'Doux', desc: 'Flâneries, sanctuaires et thé' },
              { id: 'Explorer', label: 'Explorateur', desc: 'Découverte équilibrée et marchés' },
              { id: 'Cultural Deep-Dive', label: 'Immersion Profonde', desc: 'Maîtres artisans, rituels et cours royales' }
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setTravelStyle(style.id as any)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  travelStyle === style.id
                    ? 'bg-[#fceee9] border-[#c14e2f] text-[#c14e2f] shadow-sm'
                    : 'bg-[#faf7f0] border-transparent text-[#6b665e] hover:bg-[#e8e2d5]'
                }`}
              >
                <div className="font-serif font-bold text-xs">{style.label}</div>
                <div className="text-[10px] text-[#8c867c] mt-0.5">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0ece1]">
          <div>
            <h4 className="font-serif font-bold text-sm text-[#2c2926]">
              Alertes Cérémonies & Rassemblements
            </h4>
            <p className="text-xs text-[#8c867c]">
              Notifications pour les Vodun Days, Fête de la Gaani et sorties Egungun
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              notifications ? 'bg-[#c14e2f]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                notifications ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSavePreferences}
            className="flex-1 py-3 rounded-xl bg-[#c14e2f] text-white font-bold text-xs shadow hover:bg-[#a83f23] active:scale-95 transition-all cursor-pointer"
          >
            Enregistrer les Préférences
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl bg-white border border-[#e8e2d5] text-red-600 font-bold text-xs hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Discreet Administrator Entry Link */}
      {userRole !== 'admin' && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onOpenAuth('admin')}
            className="text-[11px] text-[#8c867c] hover:text-[#2c2926] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Lock className="w-3 h-3 text-[#8c867c]" />
            <span>Accès Réservé au Conservatoire & Administration</span>
          </button>
        </div>
      )}

      {/* Guide Accreditation Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e8e2d5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-[#f0ece1] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#5a5a40] text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2c2926]">
                    Agrément Médiateur & Guide Culturel
                  </h3>
                  <p className="text-[11px] text-[#6b665e]">
                    Formulaire officiel pour guides et conteurs du Bénin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-full text-[#8c867c] hover:text-[#2c2926]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {appliedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#2c2926]">
                  Dossier Transmis avec Succès !
                </h4>
                <p className="text-xs text-[#6b665e] max-w-xs mx-auto">
                  Votre demande d'agrément a été transmise aux conservateurs. Vous recevrez une notification dès validation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitGuideApplication} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    Nom & Prénom du Guide
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                      Numéro Téléphone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+229 97 00 00 00"
                      required
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                      Années d'Expérience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={applicantExperience}
                      onChange={(e) => setApplicantExperience(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    Région & Circuits Principaux
                  </label>
                  <input
                    type="text"
                    value={applicantRegion}
                    onChange={(e) => setApplicantRegion(e.target.value)}
                    placeholder="Ex: Ouidah, Grand-Popo, Abomey, Porto-Novo, Dassa..."
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    Langues Maîtrisées
                  </label>
                  <input
                    type="text"
                    value={applicantLanguages}
                    onChange={(e) => setApplicantLanguages(e.target.value)}
                    placeholder="Ex: Français, Fon, Anglais, Yorùbá..."
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    Spécialités Culturelles & Domaines
                  </label>
                  <input
                    type="text"
                    value={applicantSpecialties}
                    onChange={(e) => setApplicantSpecialties(e.target.value)}
                    placeholder="Ex: Route des Esclaves, Vodun Days, Cités Lacustres Ganvié..."
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    Biographie & Démarche de Médiation
                  </label>
                  <textarea
                    rows={3}
                    value={applicantBio}
                    onChange={(e) => setApplicantBio(e.target.value)}
                    placeholder="Décrivez votre parcours, votre attachement aux traditions et la façon dont vous accompagnez les visiteurs..."
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#faf7f0] text-[#6b665e] font-semibold text-xs border border-[#e8e2d5]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={applyingLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#5a5a40] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    {applyingLoading ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Soumettre mon Dossier</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
