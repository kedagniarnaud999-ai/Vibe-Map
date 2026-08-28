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
  Sparkles
} from 'lucide-react';
import { UserPreferences } from '../../types';

interface UserProfileScreenProps {
  user: UserPreferences;
  onUpdateUser?: (updated: Partial<UserPreferences>) => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ user, onUpdateUser }) => {
  const [travelStyle, setTravelStyle] = useState(user.travelStyle);
  const [notifications, setNotifications] = useState(user.notificationsEnabled);
  const [language, setLanguage] = useState(user.language);
  const [saveToast, setSaveToast] = useState(false);

  const handleSavePreferences = () => {
    if (onUpdateUser) {
      onUpdateUser({
        travelStyle,
        notificationsEnabled: notifications,
        language
      });
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#c14e2f] text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-[#d9822b]" />
          <span>Preferences updated!</span>
        </div>
      )}

      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
          Traveler Profile
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          Account & Vibe Settings
        </h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={user.avatar}
          alt={user.name}
          referrerPolicy="no-referrer"
          className="w-20 h-20 rounded-full object-cover border-4 border-[#fceee9] shadow"
        />
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="font-serif font-bold text-xl text-[#2c2926]">
              {user.name}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fceee9] text-[#c14e2f] text-xs font-bold">
              {user.vibeTag}
            </span>
          </div>
          <p className="text-xs text-[#8c867c]">{user.email}</p>
          <p className="text-xs text-[#6b665e] pt-1">
            Current Focus: <span className="font-semibold text-[#5a5a40]">Ouidah, Abomey & Porto-Novo</span>
          </p>
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm space-y-5">
        <h3 className="font-serif font-bold text-lg text-[#2c2926]">
          Curation Preferences
        </h3>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6b665e] uppercase tracking-wider block">
            Travel Style & Exploration Rhythm
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'Relaxed', desc: 'Slow strolls, quiet shrines & tea' },
              { id: 'Explorer', desc: 'Balanced discovery of sites & markets' },
              { id: 'Cultural Deep-Dive', desc: 'Master artisans, rituals & history' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setTravelStyle(style.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  travelStyle === style.id
                    ? 'bg-[#fceee9] border-[#c14e2f] text-[#c14e2f] shadow-sm'
                    : 'bg-[#f0ece1] border-transparent text-[#6b665e] hover:bg-[#e8e2d5]'
                }`}
              >
                <div className="font-serif font-bold text-xs">{style.id}</div>
                <div className="text-[10px] text-[#8c867c] mt-0.5">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6b665e] uppercase tracking-wider block">
            Interface & Phonetic Assistance
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 bg-[#f0ece1] text-xs font-medium rounded-xl border border-transparent focus:border-[#c14e2f] focus:bg-white focus:outline-none"
          >
            <option>Français (FR) / English with Fon Phonetics</option>
            <option>English (US/UK) with Cultural Fon Pronunciations</option>
            <option>Français Intégral</option>
          </select>
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0ece1]">
          <div>
            <h4 className="font-serif font-bold text-sm text-[#2c2926]">
              Cultural Gathering Notifications
            </h4>
            <p className="text-xs text-[#8c867c]">
              Alerts for weekend festivals, ceremonies, and workshops
            </p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
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

        <button
          onClick={handleSavePreferences}
          className="w-full py-3 rounded-xl bg-[#c14e2f] text-white font-bold text-xs shadow hover:bg-[#a83f23] active:scale-95 transition-all"
        >
          Save Preferences
        </button>
      </div>

      {/* Sustainable Cultural Tourism Impact Card */}
      <div className="bg-[#efece2] border border-[#d9822b]/40 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-[#3a3a28]">
          <Heart className="w-4 h-4 text-[#c14e2f] fill-current" />
          <h4 className="font-serif font-bold text-sm">
            Ethical Cultural Tourism Commitment
          </h4>
        </div>
        <p className="text-xs text-[#6b665e] leading-relaxed">
          100% of all guide introductions and artisan workshop honorariums go directly to local practitioners, preserving centuries of sacred Beninese heritage without intermediaries.
        </p>
      </div>
    </div>
  );
};
