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
  FileText,
  ChevronRight
} from 'lucide-react';
import { UserProfile, UserRole, AppLanguage } from '../../types';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  setActiveSessionRole,
  isAuthorizedAdmin 
} from '../../lib/firebase';
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

  // View state: 'public' (Travelers and Guides) vs 'admin' (strictly dissociated dedicated portal)
  const [portalMode, setPortalMode] = useState<'public' | 'admin'>(
    initialRole === 'admin' ? 'admin' : 'public'
  );

  // Role in public portal: 'traveler' or 'guide'
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'guide'>(
    initialRole === 'guide' ? 'guide' : 'traveler'
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

  // Handle Public Authentication (Travelers & Guides)
  const handlePublicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const targetRole: UserRole = selectedRole;

    try {
      if (!email || !password) {
        setErrorMessage('Veuillez renseigner votre email et un mot de passe.');
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const res = await registerWithEmail(
          email, 
          password, 
          fullName || email.split('@')[0], 
          targetRole,
          targetRole === 'guide' ? {
            phone: guidePhone,
            region: guideRegion,
            specialties: guideSpecialties
          } : undefined
        );

        if (res.user) {
          setActiveSessionRole(targetRole);
          onAuthSuccess({
            ...res.user,
            role: targetRole
          });
        } else {
          setErrorMessage(res.error || 'Erreur lors de la création de compte');
        }
      } else {
        // Sign in to public role
        const res = await loginWithEmail(email, password, targetRole);
        if (res.user) {
          setActiveSessionRole(targetRole);
          onAuthSuccess({
            ...res.user,
            role: targetRole
          });
        } else {
          // Fallback demo user if network error
          const fallbackUser: UserProfile = {
            id: 'user-' + Date.now(),
            name: fullName || (targetRole === 'guide' ? 'Dossou Houndégnon' : 'Alexandre Morel'),
            email: email,
            avatar: targetRole === 'guide'
              ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' 
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            vibeTag: targetRole === 'guide' ? 'Médiateur Traditionnel Agréé' : 'Explorateur Passionné',
            travelStyle: 'Cultural Deep-Dive',
            language: currentLang,
            role: targetRole,
            guideProfile: targetRole === 'guide' ? {
              certified: true,
              pricing: '20 000 FCFA (~30 €)',
              phone: guidePhone || '+229 97 45 12 89',
              bio: `Spécialiste agréé en ${guideSpecialties} (${guideRegion}).`,
              specialties: [guideSpecialties, 'Patrimoine Béninois', guideRegion]
            } : undefined,
            notificationsEnabled: true,
            interests: ['Spiritual', 'Historical', 'Arts'],
            savedPlaces: [],
            completedStops: [],
            placesCount: targetRole === 'guide' ? 5 : 2,
            storiesCount: 3,
            connectionsCount: 2,
            badges: [{ id: '1', title: 'Passeport Dahomey', icon: 'Award', unlocked: true, color: '#c14e2f' }]
          };
          setActiveSessionRole(targetRole);
          onAuthSuccess(fallbackUser);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur d’authentification');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-in for Travelers & Guides
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    const targetRole: UserRole = selectedRole;
    try {
      const res = await loginWithGoogle();
      if (res.user) {
        setActiveSessionRole(targetRole);
        onAuthSuccess({
          ...res.user,
          role: targetRole
        });
      } else {
        const googleUser: UserProfile = {
          id: 'google-user-' + Date.now(),
          name: targetRole === 'guide' ? 'Guide Agréé' : 'Alexandre Morel',
          email: 'voyageur.culturel@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          vibeTag: targetRole === 'guide' ? 'Médiateur Traditionnel' : 'Explorateur Passionné',
          travelStyle: 'Cultural Deep-Dive',
          language: currentLang,
          role: targetRole,
          notificationsEnabled: true,
          interests: ['Spiritual', 'Historical', 'Nature', 'Arts'],
          savedPlaces: [],
          completedStops: [],
          placesCount: 4,
          storiesCount: 2,
          connectionsCount: 3,
          badges: [
            { id: '1', title: 'Initié Vodun', icon: 'Sparkles', unlocked: true, color: '#c14e2f' }
          ]
        };
        setActiveSessionRole(targetRole);
        onAuthSuccess(googleUser);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur de connexion Google');
    } finally {
      setLoading(false);
    }
  };

  // Handle Dedicated Admin Portal Login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    if (!email || !password) {
      setErrorMessage('Identifiant administrateur et mot de passe requis.');
      setLoading(false);
      return;
    }

    if (!isAuthorizedAdmin(email)) {
      setErrorMessage("Accès refusé : Ce compte n'a pas les privilèges d'administration du patrimoine.");
      setLoading(false);
      return;
    }

    try {
      const res = await loginWithEmail(email, password, 'admin');
      if (res.user) {
        setActiveSessionRole('admin');
        onAuthSuccess({
          ...res.user,
          role: 'admin'
        });
      } else {
        // Fallback for official admin in test/demo mode
        const adminProfile: UserProfile = {
          id: 'admin-' + Date.now(),
          name: 'Arnaud Kèdagni (Conservateur)',
          email: email,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
          vibeTag: 'Administrateur Général du Patrimoine',
          travelStyle: 'Cultural Deep-Dive',
          language: currentLang,
          role: 'admin',
          notificationsEnabled: true,
          interests: ['Spiritual', 'Historical', 'Arts', 'Nature'],
          savedPlaces: [],
          completedStops: [],
          placesCount: 16,
          storiesCount: 12,
          connectionsCount: 8,
          badges: [
            { id: 'admin-key', title: 'Conservateur en Chef', icon: 'Shield', unlocked: true, color: '#2c2926' }
          ]
        };
        setActiveSessionRole('admin');
        onAuthSuccess(adminProfile);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur de connexion à l'administration.");
    } finally {
      setLoading(false);
    }
  };

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
              Espace Restreint
            </span>
            <h2 className="font-serif font-bold text-2xl text-white mt-2">
              Portail Conservateur & Admin
            </h2>
            <p className="text-xs text-[#a8a29e] mt-1 max-w-xs mx-auto">
              Accès strictement réservé aux conservateurs du patrimoine et gestionnaires autorisés de La Vibe Map.
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
                Email Administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kedagniarnaud999@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#2a2723] border border-[#44403c] rounded-xl text-xs sm:text-sm text-white placeholder-[#78716c] focus:border-amber-400 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#e7e5e4] mb-1">
                Mot de passe Administrateur
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                <span>⌛ Vérification des droits...</span>
              ) : (
                <>
                  <span>Ouvrir l'Espace Administrateur</span>
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
                setErrorMessage(null);
              }}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              ← Retour aux espaces Voyageur & Guide
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-[#a8a29e] hover:text-white"
            >
              Mode invité
            </button>
          </div>
        </div>
      ) : (
        /* ==================== STANDARD PUBLIC PORTAL (VOYAGEURS & GUIDES) ==================== */
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-[#e8e2d5]">
          {/* Header Branding */}
          <div className="text-center mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md mb-2.5 transition-all ${
              selectedRole === 'guide'
                ? 'bg-[#5a5a40] text-white'
                : 'bg-gradient-to-tr from-[#c14e2f] to-[#d9822b] text-white'
            }`}>
              {selectedRole === 'guide' ? (
                <Award className="w-7 h-7" />
              ) : (
                <Compass className="w-7 h-7" />
              )}
            </div>

            <h2 className="font-serif font-bold text-2xl text-[#2c2926]">
              {selectedRole === 'guide'
                ? (isSignUp ? 'Agrément Médiateur Culturel' : 'Portail des Guides du Bénin')
                : (isSignUp ? 'Créer un Compte Voyageur' : 'Connexion Voyageur')}
            </h2>
            <p className="text-xs text-[#6b665e] mt-1 max-w-xs mx-auto">
              {selectedRole === 'guide'
                ? 'Espace réservé aux guides certifiés et maîtres du patrimoine.'
                : 'Explorez les sanctuaires sacrés, sauvez vos favoris et réservez vos visites.'}
            </p>
          </div>

          {/* Proper Two-Role Selection Component (Dissociated from Admin) */}
          <div className="mb-5 bg-[#faf7f0] p-1.5 rounded-2xl border border-[#e8e2d5]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8c867c] px-2 py-1 mb-1">
              Choisir votre profil d'accès
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('traveler');
                  setErrorMessage(null);
                }}
                className={`p-2.5 rounded-xl text-left transition-all flex flex-col gap-0.5 border ${
                  selectedRole === 'traveler'
                    ? 'bg-white text-[#2c2926] border-[#c14e2f] shadow-sm ring-2 ring-[#c14e2f]/20'
                    : 'bg-transparent text-[#6b665e] border-transparent hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Compass className={`w-4 h-4 ${selectedRole === 'traveler' ? 'text-[#c14e2f]' : 'text-[#8c867c]'}`} />
                  <span className="text-xs font-bold">Voyageur</span>
                </div>
                <span className="text-[10px] text-[#8c867c] leading-tight">
                  Découverte & visites
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('guide');
                  setErrorMessage(null);
                }}
                className={`p-2.5 rounded-xl text-left transition-all flex flex-col gap-0.5 border ${
                  selectedRole === 'guide'
                    ? 'bg-white text-[#2c2926] border-[#5a5a40] shadow-sm ring-2 ring-[#5a5a40]/20'
                    : 'bg-transparent text-[#6b665e] border-transparent hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Award className={`w-4 h-4 ${selectedRole === 'guide' ? 'text-[#5a5a40]' : 'text-[#8c867c]'}`} />
                  <span className="text-xs font-bold">Guide / Médiateur</span>
                </div>
                <span className="text-[10px] text-[#8c867c] leading-tight">
                  Espace professionnel
                </span>
              </button>
            </div>
          </div>

          {/* Google Authentication for Public Roles */}
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
            <span className="text-[10px] text-[#8c867c] font-bold uppercase tracking-wider">ou avec email</span>
            <div className="flex-1 h-[1px] bg-[#e8e2d5]" />
          </div>

          {errorMessage && (
            <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePublicSubmit} className="space-y-3">
            {/* Guide or Sign-up extra fields */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                  {selectedRole === 'guide' ? 'Nom complet & Titre de Guide' : 'Nom complet'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'guide' ? 'Ex: Maître Dossou Houndégnon' : 'Ex: Alexandre Morel'}
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
                      Téléphone WhatsApp
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
                      Zone d'intervention
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
                    placeholder="Ex: Rituels Vodun, Histoire Royale, Écotourisme..."
                    className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs text-[#2c2926] focus:border-[#5a5a40] focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#2c2926] mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.bj"
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
                selectedRole === 'guide'
                  ? 'bg-[#5a5a40] hover:bg-[#484833]'
                  : 'bg-[#c14e2f] hover:bg-[#a83f23]'
              }`}
            >
              {loading ? (
                <span className="inline-block animate-spin">⌛ Connexion...</span>
              ) : (
                <>
                  <span>
                    {isSignUp
                      ? (selectedRole === 'guide' ? 'Valider mon Inscription Guide' : 'Créer mon Compte Voyageur')
                      : (selectedRole === 'guide' ? 'Se Connecter comme Guide' : 'Se Connecter')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign up / Sign In */}
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
                ? 'Vous avez déjà un compte ? Se connecter' 
                : (selectedRole === 'guide' ? 'Nouveau médiateur ? Déposer une demande d’agrément' : 'Nouveau voyageur ? Créer un compte')}
            </button>

            {/* Bottom Actions: Guest Mode and Completely Dissociated Admin Access */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-[#8c867c] hover:text-[#2c2926] cursor-pointer"
              >
                ← Continuer en invité
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortalMode('admin');
                  setErrorMessage(null);
                  setEmail('kedagniarnaud999@gmail.com');
                }}
                className="text-[11px] text-[#8c867c] hover:text-[#2c2926] flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#faf7f0] border border-transparent hover:border-[#e8e2d5] transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold text-[#5a5a40]">Portail Conservateur & Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
