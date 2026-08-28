import React, { useState } from 'react';
import { Sparkles, Bell, Compass, ArrowLeft, Globe, Shield, User, LogIn, ChevronDown } from 'lucide-react';
import { ScreenId, AppLanguage, UserProfile } from '../types';
import { TRANSLATIONS } from '../lib/i18n';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  title,
  subtitle,
  showBack,
  currentLang,
  onLanguageChange,
  user
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fon', label: 'Fɔ̀ngbè (Fon)', flag: '🇧🇯' },
    { code: 'goun', label: 'Gungbe (Goun)', flag: '🇧🇯' },
    { code: 'yoruba', label: 'Yorùbá', flag: '🇧🇯' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fdfcf8]/95 backdrop-blur-md border-b border-[#e8e2d5] px-3 sm:px-4 py-2.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {showBack ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-[#e8e2d5] text-[#2c2926] transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[#c14e2f]" />
            </button>
            <div className="min-w-0">
              <h1 className="font-serif text-base sm:text-lg font-semibold text-[#2c2926] truncate">
                {title || t.appName}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-[#6b665e] font-sans truncate">{subtitle}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#c14e2f] to-[#5a5a40] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#c14e2f] block leading-none">
                  La Vibe Map
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-[#5a5a40] font-sans">
                  Patrimoine du Bénin
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Right Tools: Language Switcher, AI, Role Badge & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-[#e8e2d5] text-xs font-semibold text-[#2c2926] hover:bg-[#f5f1e8] transition-all cursor-pointer shadow-sm"
              title={t.systemLang}
            >
              <Globe className="w-3.5 h-3.5 text-[#c14e2f]" />
              <span className="uppercase text-[11px] font-bold">
                {currentLang}
              </span>
              <ChevronDown className="w-3 h-3 text-[#8c867c]" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-[#e8e2d5] py-1 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-[#8c867c] border-b border-[#f0ece1]">
                  {t.systemLang}
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLanguageChange(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      currentLang === l.code
                        ? 'bg-[#faf7f0] text-[#c14e2f] font-bold'
                        : 'text-[#2c2926] hover:bg-[#f5f1e8]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {currentLang === l.code && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Companion Quick Trigger */}
          {currentScreen !== 'assistant' && (
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#fceee9] text-[#c14e2f] text-xs font-semibold hover:bg-[#f2c8bd] transition-all cursor-pointer"
              title="Assistant Culturel IA"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">IA Vibe</span>
            </button>
          )}

          {/* Role Portal Shortcuts */}
          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                currentScreen === 'admin'
                  ? 'bg-[#2c2926] text-white'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
              title="Espace Administrateur"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {user.role === 'guide' && (
            <button
              onClick={() => onNavigate('guide-portal')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                currentScreen === 'guide-portal'
                  ? 'bg-[#5a5a40] text-white'
                  : 'bg-[#efece2] text-[#5a5a40] border border-[#d6cfbe]'
              }`}
              title="Espace Médiateur / Guide"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          )}

          {/* User Profile / Login Avatar */}
          <button
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#c14e2f]/30 hover:ring-[#c14e2f] transition-all flex-shrink-0 cursor-pointer"
            title={user.name || t.navProfile}
          >
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="User"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
