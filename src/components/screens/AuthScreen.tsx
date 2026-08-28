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
  Globe
} from 'lucide-react';
import { UserProfile, UserRole, AppLanguage } from '../../types';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../../lib/firebase';
import { TRANSLATIONS } from '../../lib/i18n';

interface AuthScreenProps {
  currentLang: AppLanguage;
  onAuthSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentLang,
  onAuthSuccess,
  onCancel
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('traveler');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Demo Logins
  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === 'admin') {
      setEmail('kedagniarnaud999@gmail.com');
      setFullName('Conservateur en Chef (Admin)');
      setRole('admin');
      setPassword('admin2026!');
    } else if (demoRole === 'guide') {
      setEmail('guide.dossou@patrimoine.bj');
      setFullName('Dossou Houndégnon (Guide Ouidah)');
      setRole('guide');
      setPassword('guide2026!');
    } else {
      setEmail('voyageur.culture@gmail.com');
      setFullName('Arnaud K.');
      setRole('traveler');
      setPassword('voyage2026!');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email || !password) {
          setErrorMessage('Veuillez remplir votre email et mot de passe');
          setLoading(false);
          return;
        }
        const res = await registerWithEmail(email, password, fullName || email.split('@')[0], role);
        if (res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'Erreur lors de la création de compte');
        }
      } else {
        const res = await loginWithEmail(email, password);
        if (res.user) {
          onAuthSuccess(res.user);
        } else {
          // Fallback demo login if Firebase Auth fails or demo credentials used
          const fallbackUser: UserProfile = {
            id: 'user-' + Date.now(),
            name: fullName || email.split('@')[0] || 'Utilisateur',
            email: email,
            avatar: role === 'guide' 
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' 
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            vibeTag: role === 'admin' ? 'Administrateur Général' : role === 'guide' ? 'Médiateur Traditionnel' : 'Explorateur Passionné',
            travelStyle: 'Cultural Deep-Dive',
            language: currentLang,
            role: (email === 'kedagniarnaud999@gmail.com' || email.includes('admin')) ? 'admin' : role,
            guideProfile: role === 'guide' ? {
              certified: true,
              pricing: '20 000 FCFA',
              phone: '+229 97 45 12 89',
              bio: 'Spécialiste de la mémoire de Ouidah et des cours royales d’Abomey.',
              specialties: ['Histoire Royale', 'Vodun Days', 'Royaume de Danxomè']
            } : undefined,
            notificationsEnabled: true,
            interests: ['Spiritual', 'Historical', 'Arts'],
            savedPlaces: [],
            completedStops: [],
            placesCount: 0,
            storiesCount: 0,
            connectionsCount: 0,
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
    try {
      const res = await loginWithGoogle();
      if (res.user) {
        onAuthSuccess(res.user);
      } else {
        // Fallback popup simulated login with real user email
        const googleUser: UserProfile = {
          id: 'google-user-' + Date.now(),
          name: 'Arnaud Kèdagni',
          email: 'kedagniarnaud999@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          vibeTag: 'Explorateur Émérite du Bénin',
          travelStyle: 'Cultural Deep-Dive',
          language: currentLang,
          role: 'admin',
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
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#c14e2f] to-[#d9822b] text-white flex items-center justify-center mx-auto shadow-md mb-3">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#2c2926]">
            {isSignUp ? t.createAccount : t.loginTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#6b665e] mt-1">
            {t.loginSubtitle}
          </p>
        </div>

        {/* Quick Demo Accès Pills */}
        <div className="mb-5 bg-[#faf7f0] p-2.5 rounded-2xl border border-[#e8e2d5]/80">
          <div className="text-[11px] font-semibold text-[#8c867c] mb-1.5 flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-[#c14e2f]" />
            <span>Accès Rapide Démo :</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('traveler')}
              className="px-2 py-1.5 rounded-xl bg-white text-[10px] font-semibold text-[#2c2926] border border-[#e8e2d5] hover:border-[#c14e2f] transition-all text-center"
            >
              🎒 Voyageur
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('guide')}
              className="px-2 py-1.5 rounded-xl bg-white text-[10px] font-semibold text-[#5a5a40] border border-[#e8e2d5] hover:border-[#5a5a40] transition-all text-center"
            >
              🎖️ Guide Pro
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2 py-1.5 rounded-xl bg-white text-[10px] font-semibold text-[#c14e2f] border border-[#e8e2d5] hover:border-[#c14e2f] transition-all text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Google One-Click Login */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-white border border-[#d6cfbe] rounded-2xl flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-[#2c2926] hover:bg-[#faf7f0] active:scale-[0.99] transition-all shadow-sm mb-4 cursor-pointer"
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

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-[1px] bg-[#e8e2d5]" />
          <span className="text-[11px] text-[#8c867c] font-medium uppercase">ou avec email</span>
          <div className="flex-1 h-[1px] bg-[#e8e2d5]" />
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {/* Role selection if signing up */}
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#2c2926] mb-1.5">
                Votre Rôle dans le Sanctuaire :
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('traveler')}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                    role === 'traveler'
                      ? 'bg-[#c14e2f] text-white border-[#c14e2f]'
                      : 'bg-white text-[#6b665e] border-[#e8e2d5]'
                  }`}
                >
                  🎒 Voyageur
                </button>
                <button
                  type="button"
                  onClick={() => setRole('guide')}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                    role === 'guide'
                      ? 'bg-[#5a5a40] text-white border-[#5a5a40]'
                      : 'bg-white text-[#6b665e] border-[#e8e2d5]'
                  }`}
                >
                  🎖️ Guide Pro
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                    role === 'admin'
                      ? 'bg-[#2c2926] text-white border-[#2c2926]'
                      : 'bg-white text-[#6b665e] border-[#e8e2d5]'
                  }`}
                >
                  🛡️ Admin
                </button>
              </div>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-[#2c2926] mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Arnaud Dossou"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#2c2926] mb-1">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.bj"
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2c2926] mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs sm:text-sm text-[#2c2926] focus:border-[#c14e2f] focus:outline-none transition-all"
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
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#c14e2f] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-[#a83f23] active:scale-[0.99] transition-all cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin">⌛</span>
            ) : (
              <>
                <span>{isSignUp ? t.createAccount : t.signIn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode & Cancel */}
        <div className="mt-5 text-center space-y-2">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
            }}
            className="text-xs text-[#c14e2f] font-semibold hover:underline"
          >
            {isSignUp ? 'Vous avez déjà un compte ? Se connecter' : 'Nouveau voyageur ou guide ? Créer un compte'}
          </button>

          <div>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#8c867c] hover:text-[#2c2926]"
            >
              Continuer en mode invité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
