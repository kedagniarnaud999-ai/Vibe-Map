import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Compass, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Eye,
  EyeOff,
  Phone,
  MapPin
} from 'lucide-react';
import { UserProfile } from '../../types';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  submitGuideApplication
} from '../../lib/firebase';
import { useI18n } from '../../lib/i18n';
import { useRoleLabel } from '../../lib/labels';

interface AuthScreenProps {
  initialPortal?: 'public' | 'admin';
  onAuthSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

const splitList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialPortal = 'public',
  onAuthSuccess,
  onCancel
}) => {
  const { t } = useI18n();
  const roleLabel = useRoleLabel();
  // View state: 'public' (Travelers and Guide applicants) vs 'admin' (dissociated portal)
  const [portalMode, setPortalMode] = useState<'public' | 'admin'>(initialPortal);

  // Intention only: an applicant signs in as a traveler until the guide claim is granted.
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'guide'>('traveler');

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  // Guide fields start empty: an accreditation request may only carry what the applicant typed.
  const [guidePhone, setGuidePhone] = useState('');
  const [guideRegion, setGuideRegion] = useState('');
  const [guideSpecialties, setGuideSpecialties] = useState('');
  const [guideLanguages, setGuideLanguages] = useState('');
  const [guideExperienceYears, setGuideExperienceYears] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<UserProfile | null>(null);

  const resetNotices = () => {
    setErrorMessage(null);
    setConfirmation(null);
    setPendingUser(null);
  };

  // A guide intent is not a guide role: the verified claim decides where the session lands.
  const finishWithSession = (user: UserProfile, notice?: string) => {
    if (!notice) {
      onAuthSuccess(user);
      return;
    }
    setPendingUser(user);
    setConfirmation(notice);
  };

  const handleAuthResult = async (
    result: { user: UserProfile | null; error?: string },
    guideNotice?: string
  ) => {
    setLoading(false);

    if (!result.user) {
      setErrorMessage(result.error || t('Connexion impossible. Vérifiez votre email et votre mot de passe.'));
      return;
    }

    if (portalMode === 'admin' && result.user.role !== 'admin') {
      setErrorMessage(
        t('Identifiants corrects, mais ce compte ne détient pas le rôle administrateur. Seul un opérateur peut le lui accorder côté Firebase.')
      );
      return;
    }

    if (selectedRole === 'guide' && result.user.role !== 'guide') {
      finishWithSession(result.user, guideNotice);
      return;
    }

    finishWithSession(result.user);
  };

  // Handle Public Authentication (Travelers & Guide applicants)
  const handlePublicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetNotices();

    if (!email || !password) {
      setErrorMessage(t('Veuillez renseigner votre email et un mot de passe.'));
      return;
    }
    if (isSignUp && !fullName.trim()) {
      setErrorMessage(t('Veuillez indiquer votre nom complet.'));
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const res = await registerWithEmail(email, password, fullName.trim());
        setLoading(false);

        if (!res.user) {
          setErrorMessage(res.error || t('Erreur lors de la création de compte'));
          return;
        }

        if (selectedRole === 'guide') {
          const application = await submitGuideApplication({
            fullName: fullName.trim(),
            phone: guidePhone.trim(),
            region: guideRegion.trim(),
            experienceYears: Number.parseInt(guideExperienceYears, 10) || 0,
            languages: splitList(guideLanguages),
            specialties: splitList(guideSpecialties),
            bio: ''
          });

          finishWithSession(
            res.user,
            application.success
              ? t('Compte voyageur créé et demande d’agrément déposée. Un conservateur validera votre dossier ; l’accès Guide s’activera à ce moment-là.')
              : t('Compte voyageur créé. La demande d’agrément n’a pas pu être enregistrée : {error}', { error: application.error || t('erreur inconnue') })
          );
          return;
        }

        finishWithSession(res.user);
        return;
      }

      await handleAuthResult(
        await loginWithEmail(email, password),
        t('Connexion réussie. Votre accès Guide s’ouvrira dès qu’un administrateur aura validé votre demande d’agrément.')
      );
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || t('Erreur d’authentification'));
    }
  };

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    resetNotices();
    setLoading(true);
    try {
      await handleAuthResult(
        await loginWithGoogle(),
        t('Connexion réussie. Déposez une demande d’agrément pour accéder à l’espace Guide.')
      );
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || t('Erreur de connexion Google'));
    }
  };

  // Handle Dedicated Admin Portal Login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetNotices();

    if (!email || !password) {
      setErrorMessage(t('Identifiant administrateur et mot de passe requis.'));
      return;
    }

    setLoading(true);
    try {
      await handleAuthResult(await loginWithEmail(email, password));
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || t("Erreur de connexion à l'administration."));
    }
  };

  if (confirmation && pendingUser) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] py-8 px-4 flex flex-col justify-center items-center font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e8e2d5] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-700 border border-green-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#2c2926]">{t('Session vérifiée ouverte')}</h2>
          <p className="text-xs text-[#6b665e] leading-relaxed">{confirmation}</p>
          <p className="text-[11px] text-[#8c867c]">
            {t('Rôle accordé par Firebase : {role}', { role: roleLabel(pendingUser.role) })}
          </p>
          <button
            type="button"
            onClick={() => onAuthSuccess(pendingUser)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#c14e2f] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#a83f23] transition-all cursor-pointer"
          >
            <span>{t('Continuer')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-8 px-4 flex flex-col justify-center items-center font-sans">
      {portalMode === 'admin' ? (
        /* ==================== DISSOCIATED ADMIN PORTAL ==================== */
        <div className="w-full max-w-md bg-[#1e1c19] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#2c2926] text-amber-400 border border-amber-400/40 flex items-center justify-center mx-auto shadow-lg mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              {t('Espace Restreint')}
            </span>
            <h2 className="font-serif font-bold text-2xl text-white mt-2">
              {t('Portail Conservateur & Admin')}
            </h2>
            <p className="text-xs text-[#a8a29e] mt-1 max-w-xs mx-auto">
              {t('Réservé aux comptes titulaires du rôle administrateur. La connexion seule ne suffit pas : le rôle est vérifié dans Firebase.')}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#e7e5e4] mb-1">
                {t('Email du compte administrateur')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('vous@exemple.bj')}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2a2723] border border-[#44403c] rounded-xl text-xs sm:text-sm text-white placeholder-[#78716c] focus:border-amber-400 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#e7e5e4] mb-1">
                {t('Mot de passe')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#2a2723] border border-[#44403c] rounded-xl text-xs sm:text-sm text-white placeholder-[#78716c] focus:border-amber-400 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a8a29e] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
            >
              {loading ? (
                <span>{t('Vérification des droits...')}</span>
              ) : (
                <>
                  <span>{t("Ouvrir l'Espace Administrateur")}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#3a3632] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setPortalMode('public');
                resetNotices();
              }}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              ← {t('Retour aux espaces Voyageur & Guide')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#a8a29e] hover:text-white"
            >
              {t('Mode invité')}
            </button>
          </div>
        </div>
      ) : (
        /* ==================== STANDARD PUBLIC PORTAL (VOYAGEURS & CANDIDATS GUIDE) ==================== */
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e8e2d5]">
          <div className="text-center mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md mb-2.5 transition-all ${
              selectedRole === 'guide'
                ? 'bg-[#5a5a40] text-white'
                : 'bg-gradient-to-tr from-[#c14e2f] to-[#d9822b] text-white'
            }`}>
              {selectedRole === 'guide' ? <Award className="w-7 h-7" /> : <Compass className="w-7 h-7" />}
            </div>

            <h2 className="font-serif font-bold text-2xl text-[#2c2926]">
              {selectedRole === 'guide'
                ? (isSignUp ? t('Demander un Agrément Médiateur') : t('Connexion Guide'))
                : (isSignUp ? t('Créer un Compte Voyageur') : t('Connexion Voyageur'))}
            </h2>
            <p className="text-xs text-[#6b665e] mt-1 max-w-xs mx-auto">
              {selectedRole === 'guide'
                ? t('Votre demande est examinée par un conservateur ; l’accès Guide est accordé après vérification.')
                : t('Explorez les sanctuaires sacrés, sauvez vos favoris et réservez vos visites.')}
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white border border-[#d6cfbe] rounded-2xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-[#2c2926] hover:bg-[#faf7f0] active:scale-[0.99] transition-all shadow-2xs mb-3 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{t('Continuer avec Google')}</span>
          </button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-[1px] bg-[#e8e2d5]" />
            <span className="text-[10px] text-[#8c867c] font-bold uppercase tracking-wider">{t('ou avec email')}</span>
            <div className="flex-1 h-[1px] bg-[#e8e2d5]" />
          </div>

          {errorMessage && (
            <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePublicSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                  {selectedRole === 'guide' ? t('Nom complet & Titre de Guide') : t('Nom complet')}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'guide' ? t('Ex: Maître Dossou Houndégnon') : t('Ex: Alexandre Morel')}
                    className="w-full pl-10 pr-4 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {isSignUp && selectedRole === 'guide' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">
                      {t('Téléphone WhatsApp')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c867c]" />
                      <input
                        type="tel"
                        value={guidePhone}
                        onChange={(e) => setGuidePhone(e.target.value)}
                        placeholder="+229 97..."
                        className="w-full pl-8 pr-2 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">
                      {t("Zone d'intervention")}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c867c]" />
                      <input
                        type="text"
                        value={guideRegion}
                        onChange={(e) => setGuideRegion(e.target.value)}
                        placeholder="Ouidah, Abomey..."
                        required
                        className="w-full pl-8 pr-2 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">
                      {t("Années d'Expérience")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="70"
                      value={guideExperienceYears}
                      onChange={(e) => setGuideExperienceYears(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">
                      {t('Langues (séparées par des virgules)')}
                    </label>
                    <input
                      type="text"
                      value={guideLanguages}
                      onChange={(e) => setGuideLanguages(e.target.value)}
                      placeholder={t('Français, Fon, English')}
                      required
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">
                    {t('Spécialités culturelles (séparées par des virgules)')}
                  </label>
                  <input
                    type="text"
                    value={guideSpecialties}
                    onChange={(e) => setGuideSpecialties(e.target.value)}
                    placeholder={t('Ex: Rituels Vodun, Histoire Royale, Écotourisme...')}
                    required
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                {t('Adresse Email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('nom@exemple.bj')}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                {t('Mot de passe')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="w-full pl-10 pr-10 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c867c] hover:text-[#2c2926]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer ${
                selectedRole === 'guide'
                  ? 'bg-[#5a5a40] hover:bg-[#484833]'
                  : 'bg-[#c14e2f] hover:bg-[#a83f23]'
              }`}
            >
              {loading ? (
                <span>{t('Connexion en cours...')}</span>
              ) : (
                <>
                  <span>
                    {isSignUp
                      ? (selectedRole === 'guide' ? t('Déposer ma demande d’agrément') : t('Créer mon Compte Voyageur'))
                      : t('Se connecter')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center space-y-3 border-t border-[#f0ece1] pt-3">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage(null);
              }}
              className="text-xs text-[#c14e2f] font-semibold hover:underline block mx-auto cursor-pointer"
            >
              {isSignUp 
                ? t('Vous avez déjà un compte ? Se connecter') 
                : (selectedRole === 'guide' ? t('Nouveau médiateur ? Déposer une demande d’agrément') : t('Nouveau voyageur ? Créer un compte'))}
            </button>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-[#8c867c] hover:text-[#2c2926] cursor-pointer"
              >
                ← {t('Continuer en invité')}
              </button>

              {/* L'agrément se demande, il ne se choisit pas : un candidat n'a pas de porte
                  au sens où un visiteur en a une. Le lien reste en note de bas de carte, et
                  le portail admin, lui, n'est jamais proposé ici — il suit le claim Firebase. */}
              {selectedRole === 'guide' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('traveler');
                    setIsSignUp(false);
                    resetNotices();
                  }}
                  className="text-[11px] text-[#8c867c] hover:text-[#2c2926] cursor-pointer"
                >
                  {t('Retour à l’accès voyageur')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('guide');
                    setIsSignUp(true);
                    resetNotices();
                  }}
                  className="text-[11px] text-[#8c867c] hover:text-[#5a5a40] underline underline-offset-2 decoration-[#d6cfbe] hover:decoration-[#5a5a40] cursor-pointer"
                >
                  {t('Vous encadrez des visites ? Demander un agrément')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
