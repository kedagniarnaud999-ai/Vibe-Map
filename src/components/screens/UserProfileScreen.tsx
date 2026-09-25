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
  Phone,
  FileText,
  MapPin,
  Send,
  X,
  AlertTriangle
} from 'lucide-react';
import { UserPreferences, UserRole, ScreenId, TravelStyle } from '../../types';
import { logoutUser, submitGuideApplication } from '../../lib/firebase';
import { SUPPORTED_LANGUAGES, useI18n } from '../../lib/i18n';
import { useTravelStyleLabel } from '../../lib/labels';
import { UserAvatar } from '../UserAvatar';

interface UserProfileScreenProps {
  user: UserPreferences;
  onUpdateUser?: (updated: Partial<UserPreferences>) => Promise<boolean>;
  onOpenAuth: (targetRole?: UserRole) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ 
  user, 
  onUpdateUser,
  onOpenAuth,
  onNavigate
}) => {
  const { lang, setLang, t } = useI18n();
  const travelStyleLabel = useTravelStyleLabel();
  const [travelStyle, setTravelStyle] = useState<TravelStyle | undefined>(user.travelStyle);
  const [notifications, setNotifications] = useState(user.notificationsEnabled);
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(t('Préférences enregistrées avec succès !'));
  const [toastTone, setToastTone] = useState<'ok' | 'error'>('ok');
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const flash = (message: string, tone: 'ok' | 'error' = 'ok') => {
    setToastMessage(message);
    setToastTone(tone);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2800);
  };

  // Guide accreditation modal
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [applicantName, setApplicantName] = useState(user.name);
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantRegion, setApplicantRegion] = useState('Ouidah & Abomey');
  const [applicantExperience, setApplicantExperience] = useState(3);
  const [applicantLanguages, setApplicantLanguages] = useState('Français, Fon, English');
  const [applicantSpecialties, setApplicantSpecialties] = useState('Histoire Royale, Rituels Vodun, Écotourisme');
  const [applicantBio, setApplicantBio] = useState('');
  const [applyingLoading, setApplyingLoading] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  const handleSavePreferences = async () => {
    const updated = {
      ...user,
      travelStyle,
      notificationsEnabled: notifications,
      language: lang
    };

    setIsSavingPreferences(true);
    const synced = onUpdateUser ? await onUpdateUser(updated) : false;
    setIsSavingPreferences(false);

    flash(
      synced
        ? t('Préférences synchronisées avec Firestore !')
        : t('Enregistrement refusé : une session vérifiée est requise.'),
      synced ? 'ok' : 'error'
    );
  };

  const handleLogout = async () => {
    await logoutUser();
    onOpenAuth('traveler');
  };

  const handleSubmitGuideApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyingLoading(true);

    try {
      // userId and email come from the verified session inside submitGuideApplication:
      // the applicant cannot declare who they are.
      const res = await submitGuideApplication({
        fullName: applicantName,
        phone: applicantPhone,
        region: applicantRegion,
        experienceYears: Number(applicantExperience) || 1,
        languages: applicantLanguages.split(',').map(s => s.trim()),
        specialties: applicantSpecialties.split(',').map(s => s.trim()),
        bio: applicantBio
      });

      if (res.success) {
        setApplicationError('');
        setAppliedSuccess(true);
        setTimeout(() => {
          setShowGuideModal(false);
          setAppliedSuccess(false);
          flash(t('Demande d’agrément guide envoyée pour validation !'));
        }, 1500);
      } else {
        setApplicationError(res.error || t('Envoi impossible. Vérifiez que votre session est toujours active.'));
      }
    } catch (e) {
      console.error(e);
      setApplicationError(t('Envoi impossible. Vérifiez que votre session est toujours active.'));
    } finally {
      setApplyingLoading(false);
    }
  };

  const userRole = user.role || 'traveler';

  // Seule la description reste portee par l'ecran : le libelle vient du registre partage
  // avec la carte du passeport, pour que le meme choix porte partout le meme mot.
  const rhythms: { id: TravelStyle; desc: string }[] = [
    { id: 'Relaxed', desc: t('Flâneries, sanctuaires et thé') },
    { id: 'Explorer', desc: t('Découverte équilibrée et marchés') },
    { id: 'Cultural Deep-Dive', desc: t('Maîtres artisans, rituels et cours royales') }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6 font-sans">
      {/* Toast Notification */}
      {saveToast && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 ${
          toastTone === 'ok' ? 'bg-[#2e5a44]' : 'bg-[#c14e2f]'
        } text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2 animate-in fade-in`}>
          {toastTone === 'ok' ? (
            <Check className="w-4 h-4 text-green-300" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
            {t('Profil & Accréditation')}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
            {t('Mon Profil')}
          </h2>
        </div>

        <button
          onClick={() => onOpenAuth(userRole)}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e2d5] text-xs font-semibold text-[#c14e2f] hover:bg-[#faf7f0] flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>{user.id ? t('Changer de Compte') : t('Se connecter')}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <UserAvatar
          src={user.avatar}
          name={user.name}
          className="w-20 h-20 rounded-2xl object-cover border-4 border-[#fceee9] shadow"
          monogramClassName="text-2xl"
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="font-serif font-bold text-xl text-[#2c2926]">
              {user.name || t('Aucun compte ouvert')}
            </h3>
            {user.id && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                userRole === 'admin' ? 'bg-[#2c2926] text-amber-400 border border-amber-400/30' :
                userRole === 'guide' ? 'bg-[#5a5a40] text-white' : 'bg-[#fceee9] text-[#c14e2f]'
              }`}>
                {userRole === 'admin' ? (
                  <>
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>👑 {t('Administrateur / Conservateur')}</span>
                  </>
                ) : userRole === 'guide' ? (
                  <>
                    <Award className="w-3 h-3 text-white" />
                    <span>🎖️ {t('Médiateur Culturel Agréé')}</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3 h-3 text-[#c14e2f]" />
                    <span>🎒 {t('Voyageur du Patrimoine')}</span>
                  </>
                )}
              </span>
            )}
          </div>
          {user.email && (
            <p className="text-xs text-[#8c867c]">{user.email}</p>
          )}
        </div>
      </div>

      {/* Role-Specific Action Banners */}
      {userRole === 'admin' && (
        <div className="bg-[#2c2926] text-white rounded-3xl p-6 border border-amber-400/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h4 className="font-serif font-bold text-base text-amber-400">
                {t('Espace Conservateur du Patrimoine')}
              </h4>
            </div>
            <p className="text-xs text-gray-300">
              {t('Supervision des sites réels, brouillons d’ingestion appuyés sur des sources, décisions d’agrément et suivi des réservations.')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-[#2c2926] font-bold text-xs hover:bg-amber-300 transition-all flex-shrink-0 cursor-pointer shadow"
          >
            {t("Accéder à l'Administration")} →
          </button>
        </div>
      )}

      {userRole === 'guide' && (
        <div className="bg-[#5a5a40] text-white rounded-3xl p-6 border border-[#e8e2d5] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-200" />
              <h4 className="font-serif font-bold text-base text-white">
                {t('Portail Guide & Médiateur Culturel')}
              </h4>
            </div>
            <p className="text-xs text-gray-200">
              {t("Consultez vos demandes d'immersion reçues, mettez à jour votre tarif et gérez vos confirmations de visite.")}
            </p>
          </div>
          <button
            onClick={() => onNavigate('guide-portal')}
            className="px-5 py-2.5 rounded-xl bg-white text-[#5a5a40] font-bold text-xs hover:bg-[#faf7f0] transition-all flex-shrink-0 cursor-pointer shadow"
          >
            {t('Ouvrir mon Espace Guide')} →
          </button>
        </div>
      )}

      {userRole === 'traveler' && (
        <div className="bg-gradient-to-r from-[#faf7f0] to-[#f5f1e8] rounded-3xl p-6 border border-[#e8e2d5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#c14e2f]">
              <Award className="w-5 h-5" />
              <h4 className="font-serif font-bold text-base text-[#2c2926]">
                {t('Vous êtes Guide ou Gardien de Tradition ?')}
              </h4>
            </div>
            <p className="text-xs text-[#6b665e] max-w-md">
              {t("Déposez une demande d’agrément : un conservateur l’examine, et le rôle guide ouvre ensuite le portail où arrivent les demandes des voyageurs.")}
            </p>
          </div>
          <button
            onClick={() => {
              if (!user.id) {
                onOpenAuth('traveler');
                return;
              }
              setShowGuideModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#5a5a40] text-white font-bold text-xs hover:bg-[#484833] transition-all flex-shrink-0 cursor-pointer shadow-sm"
          >
            {user.id ? t('Postuler comme Guide Agréé') : t('Se connecter pour postuler')}
          </button>
        </div>
      )}

      {/* Travel Preferences & Language */}
      <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-5">
        <h3 className="font-serif font-bold text-lg text-[#2c2926]">
          {t('Préférences Culturelles & Langue')}
        </h3>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6b665e] uppercase tracking-wider block">
            {t('Langue du système (synchronisation temps réel)')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_LANGUAGES.map((option) => (
              <button
                key={option.code}
                type="button"
                onClick={() => setLang(option.code)}
                className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  lang === option.code
                    ? 'bg-[#c14e2f] text-white border-[#c14e2f]'
                    : 'bg-[#faf7f0] text-[#2c2926] border-[#e8e2d5] hover:bg-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6b665e] uppercase tracking-wider block">
            {t("Rythme d'exploration")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {rhythms.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setTravelStyle(style.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  travelStyle === style.id
                    ? 'bg-[#fceee9] border-[#c14e2f] text-[#c14e2f] shadow-sm'
                    : 'bg-[#faf7f0] border-transparent text-[#6b665e] hover:bg-[#e8e2d5]'
                }`}
              >
                <div className="font-serif font-bold text-xs">{travelStyleLabel(style.id)}</div>
                <div className="text-[10px] text-[#8c867c] mt-0.5">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0ece1]">
          <div>
            <h4 className="font-serif font-bold text-sm text-[#2c2926]">
              {t('Alertes Cérémonies & Rassemblements')}
            </h4>
            <p className="text-xs text-[#8c867c]">
              {t('Notifications pour les Vodun Days, Fête de la Gaani et sorties Egungun')}
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
            disabled={isSavingPreferences}
            className="flex-1 py-3 rounded-xl bg-[#c14e2f] text-white font-bold text-xs shadow hover:bg-[#a83f23] active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {isSavingPreferences ? t('Synchronisation…') : t('Enregistrer les Préférences')}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl bg-white border border-[#e8e2d5] text-red-600 font-bold text-xs hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('Déconnexion')}</span>
          </button>
        </div>
      </div>

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
                    {t('Agrément Médiateur & Guide Culturel')}
                  </h3>
                  <p className="text-[11px] text-[#6b665e]">
                    {t('Formulaire officiel pour guides et conteurs du Bénin')}
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
                  {t('Dossier Transmis avec Succès !')}
                </h4>
                <p className="text-xs text-[#6b665e] max-w-xs mx-auto">
                  {t("Votre demande d'agrément est transmise aux conservateurs. Si elle est validée, le rôle guide est accordé à votre compte et vos sessions en cours sont closes : l'accès au portail se prend à votre prochaine connexion. Aucune notification ne part vers vous.")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitGuideApplication} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    {t('Nom & Prénom du Guide')}
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
                      {t('Numéro Téléphone / WhatsApp')}
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
                      {t("Années d'Expérience")}
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
                    {t('Région & Circuits Principaux')}
                  </label>
                  <input
                    type="text"
                    value={applicantRegion}
                    onChange={(e) => setApplicantRegion(e.target.value)}
                    placeholder={t('Ex: Ouidah, Grand-Popo, Abomey, Porto-Novo, Dassa...')}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    {t('Langues Maîtrisées')}
                  </label>
                  <input
                    type="text"
                    value={applicantLanguages}
                    onChange={(e) => setApplicantLanguages(e.target.value)}
                    placeholder={t('Ex: Français, Fon, Anglais, Yorùbá...')}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    {t('Spécialités Culturelles & Domaines')}
                  </label>
                  <input
                    type="text"
                    value={applicantSpecialties}
                    onChange={(e) => setApplicantSpecialties(e.target.value)}
                    placeholder={t('Ex: Route des Esclaves, Vodun Days, Cités Lacustres Ganvié...')}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                    {t('Biographie & Démarche de Médiation')}
                  </label>
                  <textarea
                    rows={3}
                    value={applicantBio}
                    onChange={(e) => setApplicantBio(e.target.value)}
                    placeholder={t("Décrivez votre parcours, votre attachement aux traditions et la façon dont vous accompagnez les visiteurs...")}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none resize-none"
                  />
                </div>

                {applicationError && (
                  <div className="bg-[#fceee9] border border-[#e8e2d5] rounded-xl px-3 py-2.5 text-[11px] font-semibold text-[#c14e2f]">
                    {applicationError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGuideModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#faf7f0] text-[#6b665e] font-semibold text-xs border border-[#e8e2d5]"
                  >
                    {t('Annuler')}
                  </button>
                  <button
                    type="submit"
                    disabled={applyingLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#5a5a40] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    {applyingLoading ? (
                      <span>{t('Envoi en cours...')}</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('Soumettre mon Dossier')}</span>
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
