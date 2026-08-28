import React from 'react';
import { Sparkles, Bell, Compass, ArrowLeft } from 'lucide-react';
import { ScreenId } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  title,
  subtitle,
  showBack
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fdfcf8]/90 backdrop-blur-md border-b border-[#e8e2d5] px-4 py-3 transition-all">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-[#e8e2d5] text-[#2c2926] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c14e2f]"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-[#c14e2f]" />
            </button>
            <div>
              <h1 className="font-serif text-lg font-semibold text-[#2c2926] line-clamp-1">
                {title || 'La Vibe Map'}
              </h1>
              {subtitle && (
                <p className="text-xs text-[#6b665e] font-sans line-clamp-1">{subtitle}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c14e2f] to-[#5a5a40] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-[#c14e2f] block leading-none">
                  La Vibe Map
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#5a5a40] font-sans">
                  Bénin Cultural Hub
                </span>
              </div>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {currentScreen !== 'assistant' && (
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fceee9] text-[#c14e2f] text-xs font-semibold hover:bg-[#f2c8bd] transition-all"
              title="Cultural AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Vibe</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('events')}
            className="relative p-2 rounded-full hover:bg-[#e8e2d5] text-[#6b665e] transition-colors"
            title="Cultural Events"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c14e2f] rounded-full ring-2 ring-[#fdfcf8]"></span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#c14e2f]/30 hover:ring-[#c14e2f] transition-all"
            title="My Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
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
