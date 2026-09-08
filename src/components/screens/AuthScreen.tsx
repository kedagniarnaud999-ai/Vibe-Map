import React, { useState } from 'react';
import { 
  Shield, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Compass, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  KeyRound,
  Eye,
  EyeOff,
  Globe,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';
import { UserProfile, UserRole, AppLanguage } from '../../types';
import { loginWithGoogle, loginWithEmail, registerWithEmail, loadUserProfileFromFirestore } from '../../lib/firebase';
import { TRANSLATIONS } from '../../lib/i18n';

interface AuthScreenProps {
  currentLang: AppLanguage;
  initialRole?: UserRole;
  onAuthSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentLang,
  initialRole = 'traveler',
  onAuthSuccess,
  onCancel
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [authMode, setAuthMode] = useState<'traveler' | 'guide' | 'admin'>(
    initialRole === 'admin' ? 'admin' : initialRole === 'guide' ? 'guide' : 'traveler'
  );
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [guidePhone, setGuidePhone] = useState('');
  const [guideRegion, setGuideRegion] = useState('Ouidah');
  const [guideSpecialties, setGuideSpecialties] = useState('Histoire Royale & Sanctuaires Vodun');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const targetRole: UserRole = authMode === 'admin' ? 'admin' : authMode === 'guide' ? 'guide' : 'traveler';

    try {
      if (isSignUp) {
        if (!email || !password) {
          setErrorMessage('Veuillez renseigner votre email et un mot de passe.');
          setLoading(false);
          return;
        }

        const res = await registerWithEmail(email, password, fullName || email.split('@')[0], targetRole);

        if (res.user) {
          const authenticated = {
            ...res.user,
            role: targetRole,
            guideProfile: targetRole === 'guide' ? {
              certified: true,
              phone: guidePhone || '+229 97 00 00 00',
              pricing: '20 000 FCFA (~30 €)',
              bio: `Médiateur culturel spécialisé en ${guideSpecialties} dans la région de ${guideRegion}.`,
              specialties: [guideSpecialties, 'Patrimoine Immatériel', guideRegion]
            } : res.user.guideProfile
          };
          onAuthSuccess(authenticated);
        } else {
          setErrorMessage(res.error || 'Erreur lors de la création de compte');
        }
      } else {
        // Sign in
        const res = await loginWithEmail(email, password);
        if (res.user) {
          // Enforce the user's actively selected portal mode
          const authenticated = {
            ...res.user,
            role: targetRole
          };
          onAuthSuccess(authenticated);
        } else {
          // Fallback profile if offline/testing
          const fallbackUser: UserProfile = {
            id: 'user-' + Date.now(),
            name: fullName || (targetRole === 'admin' ? 'Arnaud K. (Conservateur)' : targetRole === 'guide' ? 'Dossou Houndégnon' : 'Alexandre Morel'),
            email: email || (targetRole === 'admin' ? 'kedagniarnaud999@gmail.com' : targetRole === 'guide' ? 'guide.dossou@patrimoine.bj' : 'alexandre.travel@gmail.com'),
            avatar: targetRole === 'guide'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' 
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            vibeTag: targetRole === 'admin' ? 'Administrateur Général du Patrimoine' : targetRole === 'guide' ? 'Médiateur Traditionnel Agréé' : 'Explorateur Passionné',
            travelStyle: 'Cultural Deep-Dive',
            language: currentLang,
            role: targetRole,
            guideProfile: targetRole === 'guide' ? {
              certified: true,
              pricing: '20 000 FCFA (~30 €)',
              phone: '+229 97 45 12 89',
              bio: 'Spécialiste de la mémoire de Ouidah, de la Porte du Non-Retour et des cours royales d’Abomey.',
              specialties: ['Histoire Royale', 'Vodun Days', 'Royaume de Danxomè']
            } : undefined,
            notificationsEnabled: true,
            interests: ['Spiritual', 'Historical', 'Arts'],
            savedPlaces: [],
            completedStops: [],
            placesCount: targetRole === 'admin' ? 12 : 3,
            storiesCount: targetRole === 'admin' ? 8 : 2,
            connectionsCount: 2,
            badges: [{ id: '1', title: 'Passeport Dahomey', icon: 'Award', unlocked: true, color: '#c14e2f' }]
          };
          onAuthSuccess(fallbackUser);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur d’authentification');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    const targetRole: UserRole = authMode === 'admin' ? 'admin' : authMode === 'guide' ? 'guide' : 'traveler';
    try {
      const res = await loginWithGoogle();
      if (res.user) {
        onAuthSuccess({
          ...res.user,
          role: targetRole
        });
      } else {
        // Fallback demo Google user with selected role
        const googleUser: UserProfile = {
          id: 'google-user-' + Date.now(),
          name: targetRole === 'admin' ? 'Arnaud Kèdagni' : 'Alexandre Morel',
          email: targetRole === 'admin' ? 'kedagniarnaud999@gmail.com' : 'alexandre.travel@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          vibeTag: targetRole === 'admin' ? 'Conservateur du Patrimoine' : 'Explorateur Passionné',
          travelStyle: 'Cultural Deep-Dive',
          language: currentLang,
          role: targetRole,
          notificationsEnabled: true,
          interests: ['Spiritual', 'Historical', 'Nature', 'Arts'],
          savedPlaces: [],
          completedStops: [],
          placesCount: 8,
          storiesCount: 5,
          connectionsCount: 3,
          badges: [
            { id: '1', title: 'Initié Vodun', icon: 'Sparkles', unlocked: true, color: '#c14e2f' },
            { id: '2', title: 'Gardien d’Abomey', icon: 'Shield', unlocked: true, color: '#5a5a40' }
          ]
        };
        onAuthSuccess(googleUser);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur de connexion Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-8 px-4 flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e8e2d5]">
        {/* Header Branding */}
        <div className="text-center mb-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md mb-2.5 transition-all ${
            authMode === 'admin' 
              ? 'bg-[#2c2926] text-amber-400 ring-2 ring-amber-400/30' 
              : authMode === 'guide'
              ? 'bg-[#5a5a40] text-white'
              : 'bg-gradient-to-tr from-[#c14e2f] to-[#d9822b] text-white'
          }`}>
            {authMode === 'admin' ? (
              <Shield className="w-7 h-7" />
            ) : authMode === 'guide' ? (
              <Award className="w-7 h-7" />
            ) : (
              <Compass className="w-7 h-7 animate-pulse" />
            )}
          </div>

          <h2 className="font-serif font-bold text-2xl text-[#2c2926]">
            {authMode === 'admin' 
              ? 'Espace Administrateur'
              : authMode === 'guide'
              ? (isSignUp ? 'Agrément Guide & Médiateur' : 'Portail Médiateurs & Guides')
              : (isSignUp ? 'Créer un Compte Voyageur' : 'Connexion Voyageur')}
          </h2>
          <p className="text-xs text-[#6b665e] mt-1 max-w-xs mx-auto">
            {authMode === 'admin'
              ? 'Accès réservé aux conservateurs et gestionnaires du patrimoine.'
              : authMode === 'guide'
              ? 'Espace réservé aux guides agréés et maîtres de tradition du Bénin.'
              : 'Explorez les sanctuaires sacrés, sauvez vos favoris et réservez vos visites.'}
          </p>
        </div>

        {/* 3-Way Portal Selector */}
        <div className="mb-5 bg-[#faf7f0] p-1 rounded-2xl border border-[#e8e2d5] grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('traveler');
              setErrorMessage(null);
            }}
            className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              authMode === 'traveler'
                ? 'bg-[#c14e2f] text-white shadow-sm'
                : 'text-[#6b665e] hover:text-[#2c2926]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Voyageur</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('guide');
              setErrorMessage(null);
            }}
            className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              authMode === 'guide'
                ? 'bg-[#5a5a40] text-white shadow-sm'
                : 'text-[#6b665e] hover:text-[#2c2926]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('admin');
              setErrorMessage(null);
            }}
            className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              authMode === 'admin'
                ? 'bg-[#2c2926] text-amber-400 shadow-sm border border-amber-400/30'
                : 'text-[#6b665e] hover:text-[#2c2926]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Google Authentication Button */}
        {authMode !== 'admin' && (
          <>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white border border-[#d6cfbe] rounded-2xl flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold text-[#2c2926] hover:bg-[#faf7f0] active:scale-[0.99] transition-all shadow-2xs mb-3 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-[1px] bg-[#e8e2d5]" />
              <span className="text-[10px] text-[#8c867c] font-bold uppercase tracking-wider">ou par email</span>
              <div className="flex-1 h-[1px] bg-[#e8e2d5]" />
            </div>
          </>
        )}

        {errorMessage && (
          <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Guide / Sign-up extra fields */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                {authMode === 'guide' ? 'Nom complet & Titre du Médiateur' : 'Nom complet'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={authMode === 'guide' ? 'Ex: Maître Dossou Houndégnon' : 'Ex: Alexandre Morel'}
                  className="w-full pl-10 pr-4 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          {isSignUp && authMode === 'guide' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">
                    Téléphone / WhatsApp
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
                    Région d'intervention
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8c867c]" />
                    <input
                      type="text"
                      value={guideRegion}
                      onChange={(e) => setGuideRegion(e.target.value)}
                      placeholder="Ouidah, Abomey..."
                      className="w-full pl-8 pr-2 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">
                  Spécialités culturelles
                </label>
                <input
                  type="text"
                  value={guideSpecialties}
                  onChange={(e) => setGuideSpecialties(e.target.value)}
                  placeholder="Ex: Rituels Vodun, Histoire Royale, Danse Gèlèdé..."
                  className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2c2926] mb-1">
              {authMode === 'admin' ? 'Email Administrateur' : 'Adresse Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authMode === 'admin' ? 'kedagniarnaud999@gmail.com' : 'nom@exemple.bj'}
                className="w-full pl-10 pr-4 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2c2926] mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              authMode === 'admin'
                ? 'bg-[#2c2926] hover:bg-black'
                : authMode === 'guide'
                ? 'bg-[#5a5a40] hover:bg-[#484833]'
                : 'bg-[#c14e2f] hover:bg-[#a83f23]'
            }`}
          >
            {loading ? (
              <span className="inline-block animate-spin">⌛ Connexion...</span>
            ) : (
              <>
                <span>
                  {authMode === 'admin'
                    ? 'Déverrouiller l’Administration'
                    : isSignUp
                    ? (authMode === 'guide' ? 'Valider mon Inscription Guide' : 'Créer mon Compte Voyageur')
                    : (authMode === 'guide' ? 'Se Connecter comme Guide' : 'Se Connecter')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode & Discreet Admin Link */}
        <div className="mt-4 text-center space-y-2 border-t border-[#f0ece1] pt-3">
          {authMode !== 'admin' && (
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage(null);
              }}
              className="text-xs text-[#c14e2f] font-semibold hover:underline block mx-auto"
            >
              {isSignUp 
                ? 'Vous avez déjà un compte ? Se connecter' 
                : (authMode === 'guide' ? 'Nouveau médiateur ? Déposer une demande' : 'Nouveau voyageur ? Créer un compte')}
            </button>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#8c867c] hover:text-[#2c2926]"
            >
              ← Mode invité
            </button>

            {authMode !== 'admin' ? (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('admin');
                  setIsSignUp(false);
                  setEmail('kedagniarnaud999@gmail.com');
                  setErrorMessage(null);
                }}
                className="text-[11px] text-[#8c867c] hover:text-[#2c2926] flex items-center gap-1"
              >
                <Shield className="w-3 h-3 text-[#8c867c]" />
                <span>Accès Conservateur</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('traveler');
                  setErrorMessage(null);
                }}
                className="text-[11px] text-[#c14e2f] font-semibold hover:underline"
              >
                Retour Espace Public
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
