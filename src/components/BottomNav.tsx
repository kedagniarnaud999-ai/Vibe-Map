import React from 'react';
import { Compass, Map, BookOpen, Sparkles, User, Users } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: ScreenId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Explore', icon: Compass },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'library', label: 'Learn', icon: BookOpen },
    { id: 'itinerary-builder', label: 'Vibe', icon: Sparkles },
    { id: 'actors', label: 'Guides', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fdfcf8]/95 backdrop-blur-lg border-t border-[#e8e2d5] px-2 py-1.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.id === 'library' && currentScreen === 'story-detail') ||
            (item.id === 'actors' && currentScreen === 'actor-profile') ||
            (item.id === 'map' && currentScreen === 'place-detail');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
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
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-sans">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
