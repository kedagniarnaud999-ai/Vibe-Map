import React from 'react';
import { Compass, Map, BookOpen, Sparkles, User, Users, Shield, Award } from 'lucide-react';
import { ScreenId, AppLanguage, UserRole } from '../types';
import { TRANSLATIONS } from '../lib/i18n';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  currentLang: AppLanguage;
  userRole?: UserRole;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentScreen, 
  onNavigate,
  currentLang,
  userRole
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;

  const navItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.navDiscover || 'Récits', icon: Compass },
    { id: 'map', label: t.navMap || 'Carte', icon: Map },
    { id: 'actors', label: t.navActors || 'Guides', icon: Users },
    { id: 'itinerary-builder', label: 'Itinéraire', icon: Sparkles },
    ...(userRole === 'admin' 
      ? [{ id: 'admin' as ScreenId, label: 'Admin', icon: Shield }]
      : userRole === 'guide'
      ? [{ id: 'guide-portal' as ScreenId, label: 'Espace Guide', icon: Award }]
      : [{ id: 'profile' as ScreenId, label: t.navProfile || 'Profil', icon: User }]
    )
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fdfcf8]/95 backdrop-blur-lg border-t border-[#e8e2d5] px-2 py-1.5 transition-all">
      <div className="max-w-lg mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.id === 'home' && (currentScreen === 'library' || currentScreen === 'story-detail')) ||
            (item.id === 'actors' && currentScreen === 'actor-profile') ||
            (item.id === 'map' && currentScreen === 'place-detail');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#c14e2f] font-semibold scale-105'
                  : 'text-[#6b665e] hover:text-[#2c2926]'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-[#fceee9]' : 'bg-transparent'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight font-sans truncate max-w-[70px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
