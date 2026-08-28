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
  Database
} from 'lucide-react';
import { UserPreferences, UserRole, AppLanguage } from '../../types';
import { syncUserProfileToFirestore, logoutUser } from '../../lib/firebase';
import { TRANSLATIONS } from '../../lib/i18n';

interface UserProfileScreenProps {
  user: UserPreferences;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onUpdateUser?: (updated: Partial<UserPreferences>) => void;
  onOpenAuth: () => void;
  onNavigate: (screen: any) => void;
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
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleRoleSwitch = async (newRole: UserRole) => {
    const updated = { ...user, role: newRole };
    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    await syncUserProfileToFirestore(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleLogout = async () => {
    await logoutUser();
    onOpenAuth();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6 font-sans">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#2e5a44] text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-green-300" />
          <span>Profil synchronisé avec Firestore & Cloud SQL !</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
            Sanctuaire Personnel
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
            {t.navProfile} & Rôle
          </h2>
        </div>

        <button
          onClick={onOpenAuth}
          className="px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e2d5] text-xs font-semibold text-[#c14e2f] hover:bg-[#faf7f0] flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Connexion / Changer</span>
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
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              user.role === 'admin' ? 'bg-red-100 text-red-800' :
              user.role === 'guide' ? 'bg-[#efece2] text-[#5a5a40]' : 'bg-[#fceee9] text-[#c14e2f]'
            }`}>
              {user.role === 'admin' ? '👑 Administrateur' : user.role === 'guide' ? '🎖️ Médiateur / Guide' : '🎒 Voyageur'}
            </span>
          </div>
          <p className="text-xs text-[#8c867c]">{user.email}</p>
          <div className="pt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#2e5a44] bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
              <Database className="w-3 h-3" />
              <span>Base Réelle Connectée</span>
            </span>
            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="text-[11px] font-bold text-[#c14e2f] hover:underline"
              >
                Ouvrir l'Espace Admin →
              </button>
            )}
            {user.role === 'guide' && (
              <button
                onClick={() => onNavigate('guide-portal')}
                className="text-[11px] font-bold text-[#5a5a40] hover:underline"
              >
                Ouvrir l'Espace Guide →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Role Switcher Sandbox */}
      <div className="bg-[#faf7f0] rounded-3xl p-5 border border-[#e8e2d5] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif font-bold text-sm text-[#2c2926]">
              Changer de Rôle pour le Test :
            </h4>
            <p className="text-xs text-[#6b665e]">
              Testez l'application selon différentes perspectives culturelles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleRoleSwitch('traveler')}
            className={`p-3 rounded-2xl text-center text-xs font-semibold border transition-all cursor-pointer ${
              user.role === 'traveler' || !user.role
                ? 'bg-[#c14e2f] text-white border-[#c14e2f] shadow'
                : 'bg-white text-[#6b665e] border-[#e8e2d5] hover:bg-[#faf7f0]'
            }`}
          >
            🎒 Voyageur
          </button>
          <button
            onClick={() => handleRoleSwitch('guide')}
            className={`p-3 rounded-2xl text-center text-xs font-semibold border transition-all cursor-pointer ${
              user.role === 'guide'
                ? 'bg-[#5a5a40] text-white border-[#5a5a40] shadow'
                : 'bg-white text-[#6b665e] border-[#e8e2d5] hover:bg-[#faf7f0]'
            }`}
          >
            🎖️ Médiateur / Guide
          </button>
          <button
            onClick={() => handleRoleSwitch('admin')}
            className={`p-3 rounded-2xl text-center text-xs font-semibold border transition-all cursor-pointer ${
              user.role === 'admin'
                ? 'bg-[#2c2926] text-white border-[#2c2926] shadow'
                : 'bg-white text-[#6b665e] border-[#e8e2d5] hover:bg-[#faf7f0]'
            }`}
          >
            🛡️ Administrateur
          </button>
        </div>
      </div>

      {/* Travel Preferences */}
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
    </div>
  );
};
