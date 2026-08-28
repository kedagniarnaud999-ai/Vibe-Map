import React, { useState } from 'react';
import { 
  Bookmark, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Users, 
  Award, 
  Share2, 
  CheckCircle2, 
  Compass, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPreferences, Place, Story } from '../../types';

interface JournalScreenProps {
  user: UserPreferences;
  places: Place[];
  stories: Story[];
  onSelectPlace: (place: Place) => void;
  onSelectStory: (story: Story) => void;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  user,
  places,
  stories,
  onSelectPlace,
  onSelectStory
}) => {
  const [activeTab, setActiveTab] = useState<'stamps' | 'stories' | 'badges'>('stamps');
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleSharePassport = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  const savedPlacesList = places.filter((p) => user.savedPlaces.includes(p.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
            Travel Memory & Scrapbook
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
            My Cultural Passport
          </h2>
        </div>

        <button
          onClick={handleSharePassport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{shareSuccess ? 'Passport Shared!' : 'Share Vibe'}</span>
        </button>
      </div>

      {/* Cultural Depth Level Card */}
      <div className="bg-gradient-to-br from-[#c14e2f] via-[#a83f23] to-[#5a5a40] text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#d9822b]"
            />
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-[#d9822b] font-medium">{user.vibeTag}</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
            Level 2
          </span>
        </div>

        {/* Level Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/90">
            <span>Cultural Depth Progress</span>
            <span className="font-bold">65% to Scholar</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#d9822b] rounded-full w-[65%]" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-center">
          <div>
            <span className="font-serif font-bold text-lg block">{user.placesCount}</span>
            <span className="text-[10px] text-white/80 uppercase">Sanctuaries Visited</span>
          </div>
          <div>
            <span className="font-serif font-bold text-lg block">{user.storiesCount}</span>
            <span className="text-[10px] text-white/80 uppercase">Stories Decoded</span>
          </div>
          <div>
            <span className="font-serif font-bold text-lg block">{user.connectionsCount}</span>
            <span className="text-[10px] text-white/80 uppercase">Guardians Met</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e8e2d5] gap-6">
        {[
          { id: 'stamps', label: 'Visited Sanctuaries', icon: MapPin },
          { id: 'stories', label: 'Saved Stories', icon: BookOpen },
          { id: 'badges', label: 'Earned Badges', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 font-serif text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'text-[#c14e2f] border-[#c14e2f]'
                  : 'text-[#8c867c] border-transparent hover:text-[#2c2926]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'stamps' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {savedPlacesList.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d5] hover:border-[#c14e2f]/40 p-4 flex gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#efece2] flex-shrink-0 relative">
                <img
                  src={place.image}
                  alt={place.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#c14e2f] text-white text-[8px] font-bold">
                  Visited
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#5a5a40]">
                  {place.category}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#2c2926] line-clamp-1">
                  {place.name}
                </h4>
                <p className="text-[11px] text-[#6b665e] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8c867c]" /> {place.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="bg-white rounded-2xl p-4 border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm flex gap-3"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#efece2] flex-shrink-0">
                <img
                  src={story.heroImage}
                  alt={story.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#c14e2f]">
                  {story.category}
                </span>
                <h4 className="font-serif font-bold text-xs text-[#2c2926] line-clamp-2">
                  {story.title}
                </h4>
                <span className="text-[10px] text-[#8c867c]">{story.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                badge.unlocked
                  ? 'bg-white border-[#e8e2d5] shadow-sm'
                  : 'bg-[#f0ece1]/60 border-dashed border-[#dedad0] opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white ${
                  badge.unlocked ? 'bg-[#c14e2f]' : 'bg-gray-400'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-serif font-bold text-xs text-[#2c2926]">
                  {badge.title}
                </h5>
                <span className="text-[10px] text-[#8c867c] block">
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
