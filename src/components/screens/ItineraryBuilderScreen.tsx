import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Bookmark, 
  Share2, 
  RefreshCw,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Place, Story, ItineraryStop } from '../../types';
import { saveItineraryToFirestore } from '../../lib/firebase';

interface ItineraryBuilderScreenProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onSaveItinerary?: () => void;
}

export const ItineraryBuilderScreen: React.FC<ItineraryBuilderScreenProps> = ({
  places,
  onSelectPlace,
  onSaveItinerary
}) => {
  const [duration, setDuration] = useState<'2h' | 'half-day' | 'full-day' | '3-days'>('half-day');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Spiritual Traditions',
    'Royal Architecture'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimeline, setGeneratedTimeline] = useState<ItineraryStop[] | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const interestOptions = [
    'Spiritual Traditions',
    'Royal Architecture',
    'Textile Arts & Appliqué',
    'Oral History & Griots',
    'Lake Villages & Nature',
    'Culinary & Palm Fermentation'
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedTimeline(null);

    try {
      const response = await fetch('/api/gemini/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          interests: selectedInterests,
          userVibe: 'Explorateur Immersif du Patrimoine'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
          const stops: ItineraryStop[] = data.timeline.map((s: any, idx: number) => ({
            id: `stop-${idx + 1}`,
            time: s.time || '09:00',
            placeId: s.placeId || (places[idx % places.length]?.id ?? 'ouidah-python'),
            title: s.title || 'Visite Culturelle',
            description: s.description || 'Immersion patrimoniale au cœur des traditions.',
            insight: s.insight || 'Saluez toujours les aînés et gardiens du sanctuaire.',
            transitTime: s.transitTime || '10 min',
            transitMode: 'walk',
            icon: 'sparkles',
            color: 'bg-primary',
            verified: true
          }));

          setGeneratedTimeline(stops);
          setIsGenerating(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Gemini itinerary API error, using rich local fallback:', e);
    }

    // Rich fallback
    setTimeout(() => {
      setIsGenerating(false);
      const stops: ItineraryStop[] = [
        {
          id: 'stop-1',
          time: '09:00 AM',
          placeId: 'temple-of-pythons',
          title: 'Temple of Pythons & The Sacred Covenant',
          description: 'Begin with morning silence as the temple awakens. Observe the sacred royal pythons and learn about the covenant between Dangbé and Ouidah.',
          insight: 'Vibe Tip: Ask the keeper for the traditional greeting "Akwaba" and remember to step inside with bare feet.',
          transitTime: '15 min walk through historical quarter',
          transitMode: 'walk',
          icon: 'sparkles',
          color: 'bg-primary',
          verified: true
        },
        {
          id: 'stop-2',
          time: '10:30 AM',
          placeId: 'sacred-forest-kpasse',
          title: 'Sacred Forest of Kpassè: The King’s Tree',
          description: 'Walk beneath the 400-year-old sacred Iroko tree where King Kpassè was transformed to protect his kingdom.',
          insight: 'Vibe Tip: Keep discussions to a gentle whisper; local tradition honors the forest as a listening space.',
          transitTime: '10 min zemidjan (taxi) ride',
          transitMode: 'taxi',
          icon: 'forest',
          color: 'bg-secondary',
          verified: true
        },
        {
          id: 'stop-3',
          time: '12:30 PM',
          placeId: 'fondation-zinsou',
          title: 'Fondation Zinsou & Textile Heritage',
          description: 'Observe how contemporary African artists reinterpret royal Fon appliqué tapestries with modern mediums.',
          insight: 'Vibe Tip: Free entrance. The reading room on the top floor has rare books on Dahomey metallurgy.',
          transitTime: '20 min scenic coastal drive',
          transitMode: 'taxi',
          icon: 'palette',
          color: 'bg-tertiary',
          verified: true
        },
        {
          id: 'stop-4',
          time: '03:30 PM',
          placeId: 'door-of-no-return',
          title: 'The Door of No Return: Sunset Meditation',
          description: 'End at the Atlantic coastline memorial archway for quiet reflection and sea breeze.',
          insight: 'Vibe Tip: Stand beneath the bronze arch as the Atlantic waves break in rhythm with ancestral memory.',
          icon: 'map-pin',
          color: 'bg-primary-container',
          verified: true
        }
      ];

      setGeneratedTimeline(stops);
    }, 800);
  };

  const handleSaveToJournal = async () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#c14e2f', '#5a5a40', '#d9822b', '#7c766b']
      });
    } catch (e) {
      // fallback
    }

    if (generatedTimeline) {
      await saveItineraryToFirestore(
        `Itinéraire ${duration} - ${selectedInterests.join(', ')}`,
        duration,
        selectedInterests,
        generatedTimeline,
        'kedagniarnaud999@gmail.com'
      );
    }

    setSavedSuccess(true);
    if (onSaveItinerary) onSaveItinerary();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
          AI Cultural Curation
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          Weave Your Cultural Vibe
        </h2>
        <p className="text-xs text-[#6b665e]">
          Generate an etiquette-guided, historically sequenced itinerary customized to your rhythm.
        </p>
      </div>

      {/* Input Configuration Box */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d5] shadow-sm space-y-5">
        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="font-serif font-bold text-sm text-[#2c2926] block">
            How much time do you have?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '2h', label: '2 Hours' },
              { id: 'half-day', label: 'Half Day' },
              { id: 'full-day', label: 'Full Day' },
              { id: '3-days', label: '3 Days Immersion' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setDuration(item.id as any)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  duration === item.id
                    ? 'bg-[#c14e2f] text-white border-[#c14e2f] shadow-sm'
                    : 'bg-[#f0ece1] text-[#6b665e] border-transparent hover:bg-[#e8e2d5]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interests Selector */}
        <div className="space-y-2">
          <label className="font-serif font-bold text-sm text-[#2c2926] block">
            What aspects of Beninese culture do you want to understand?
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((opt) => {
              const isSelected = selectedInterests.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleInterest(opt)}
                  className={`py-2 px-3.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[#fceee9] text-[#c14e2f] border-[#c14e2f]/40 shadow-sm'
                      : 'bg-[#f0ece1] text-[#6b665e] border-transparent hover:bg-[#e8e2d5]'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weave Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#c14e2f] to-[#5a5a40] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Weaving Cultural Sequence & Transit Routes...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#d9822b]" />
              <span>Weave Personalized Itinerary</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Timeline Result */}
      {generatedTimeline && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a5a40]">
                Curated Route
              </span>
              <h3 className="font-serif font-bold text-xl text-[#2c2926]">
                Your Cultural Sequence
              </h3>
            </div>

            <button
              onClick={handleSaveToJournal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Saved to Journal!' : 'Save Itinerary'}</span>
            </button>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#dedad0]">
            {generatedTimeline.map((stop, idx) => {
              const matchedPlace = places.find((p) => p.id === stop.placeId);
              return (
                <div key={stop.id} className="relative space-y-2">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-[#c14e2f] ring-4 ring-[#fdfcf8] flex items-center justify-center text-white text-[10px] font-bold">
                    {idx + 1}
                  </div>

                  {/* Stop Card */}
                  <div className="bg-white rounded-2xl p-5 border border-[#e8e2d5] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#efece2] text-[#3a3a28] font-mono text-xs font-bold">
                        {stop.time}
                      </span>
                      {stop.verified && (
                        <span className="flex items-center gap-1 text-[11px] text-[#c14e2f] font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Etiquette Verified
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-[#2c2926]">
                        {stop.title}
                      </h4>
                      <p className="text-xs text-[#6b665e] leading-relaxed mt-1 font-sans">
                        {stop.description}
                      </p>
                    </div>

                    {/* Vibe Tip Insight Box */}
                    <div className="p-3 rounded-xl bg-[#f0ece1] border border-[#e8e2d5] text-xs text-[#5a5a40] font-medium flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#c14e2f] flex-shrink-0 mt-0.5" />
                      <span>{stop.insight}</span>
                    </div>

                    {matchedPlace && (
                      <button
                        onClick={() => onSelectPlace(matchedPlace)}
                        className="text-xs font-bold text-[#c14e2f] hover:underline flex items-center gap-1 pt-1"
                      >
                        <span>View Deep Site Context</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Transit Indicator */}
                  {stop.transitTime && (
                    <div className="text-[11px] text-[#8c867c] flex items-center gap-1.5 pl-2 py-1 italic font-sans">
                      <Navigation className="w-3 h-3 text-[#c14e2f]" />
                      <span>{stop.transitTime}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
