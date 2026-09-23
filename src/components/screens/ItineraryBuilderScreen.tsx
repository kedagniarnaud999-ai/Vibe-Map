import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Bookmark, 
  RefreshCw,
  Navigation,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Place, ItineraryStop } from '../../types';
import { apiFetch, saveItineraryToFirestore } from '../../lib/firebase';
import { useI18n } from '../../lib/i18n';

// Le parcours conseillé tient en trois temps de journée : pas d'horaire précis que
// personne n'aurait mesuré, mais un ordre lisible. Les libellés restent passés à t()
// en littéraux, seuls vérifiables par le gate des traductions.
const ADVISED_STEPS = 3;

interface ItineraryBuilderScreenProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  requireSession: () => boolean;
  onSaveItinerary?: () => void;
}

export const ItineraryBuilderScreen: React.FC<ItineraryBuilderScreenProps> = ({
  places,
  onSelectPlace,
  requireSession,
  onSaveItinerary
}) => {
  const { lang, t } = useI18n();
  const [duration, setDuration] = useState<'2h' | 'half-day' | 'full-day' | '3-days'>('half-day');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Spiritual Traditions',
    'Royal Architecture'
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimeline, setGeneratedTimeline] = useState<ItineraryStop[] | null>(null);
  const [timelineSource, setTimelineSource] = useState<'ai' | 'curated' | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Les valeurs restent les enumerations envoyees a l'API : seuls les libelles passent par t().
  const interestOptions = [
    { value: 'Spiritual Traditions', label: t('Traditions Spirituelles') },
    { value: 'Royal Architecture', label: t('Architecture Royale') },
    { value: 'Textile Arts & Appliqué', label: t('Arts du Textile & Appliqué') },
    { value: 'Oral History & Griots', label: t('Histoire Orale & Griots') },
    { value: 'Lake Villages & Nature', label: t('Villages Lacustres & Nature') },
    { value: 'Culinary & Palm Fermentation', label: t('Gastronomie & Fermentation de Palm') }
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleGenerate = async () => {
    setGeneratedTimeline(null);
    setTimelineSource(null);
    setSaveError(null);

    if (!requireSession()) {
      setGenerateError(t('Connectez-vous pour tisser votre itinéraire : la génération est réservée aux comptes vérifiés.'));
      return;
    }

    setGenerateError(null);
    setIsGenerating(true);

    try {
      const data = await apiFetch<any>('/api/gemini/itinerary', {
        method: 'POST',
        body: {
          duration,
          interests: selectedInterests,
          userVibe: 'Explorateur Immersif du Patrimoine',
          places: places.map((p) => ({ id: p.id, name: p.name, location: p.location })),
          lang
        }
      });

      if (data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
        const stops: ItineraryStop[] = data.timeline.map((s: any, idx: number) => ({
          id: `stop-${idx + 1}`,
          // Une heure, un trajet ou une règle de conduite que le modèle n'a pas
          // donnés ne doivent pas être comblés par l'application : ils passeraient
          // pour mesurés, et ils sont enregistrés tels quels dans le parcours.
          time: typeof s.time === 'string' ? s.time.trim() : '',
          placeId: typeof s.placeId === 'string' && s.placeId ? s.placeId : null,
          title: typeof s.title === 'string' && s.title ? s.title : t('Visite Culturelle'),
          description:
            typeof s.description === 'string' && s.description
              ? s.description
              : t('Immersion patrimoniale au cœur des traditions.'),
          insight: typeof s.insight === 'string' ? s.insight.trim() : '',
          transitTime:
            typeof s.transitTime === 'string' && s.transitTime ? s.transitTime : undefined,
          icon: 'sparkles',
          color: 'bg-primary',
        }));

        setGeneratedTimeline(stops);
        setTimelineSource('ai');
        setIsGenerating(false);
        return;
      }
    } catch (e) {
      console.warn('Gemini itinerary API unavailable, using curated sequence:', e);
    }

    // Le parcours conseillé prend le catalogue réellement chargé : noms, résumés
    // et règles de tenue viennent des fiches elles-mêmes. Chaque étape mène donc à
    // une fiche qui existe, avec le libellé que le visiteur voit déjà sur la carte.
    setTimeout(() => {
      setIsGenerating(false);
      const advised = places.slice(0, ADVISED_STEPS);
      if (advised.length === 0) {
        setGenerateError(t('Aucune fiche de lieu n’est disponible : rien à proposer pour l’instant.'));
        return;
      }
      setGeneratedTimeline(advised.map((place, idx) => ({
        id: `stop-${idx + 1}`,
        time: idx === 0 ? t('Matinée') : idx === 1 ? t('Mi-journée') : t('Fin de journée'),
        placeId: place.id,
        title: place.name,
        description: place.description,
        insight: place.etiquette[0]?.description ?? '',
        icon: 'sparkles',
        color: 'bg-primary',
      })));
      setTimelineSource('curated');
    }, 800);
  };

  const handleSaveToJournal = async () => {
    if (!generatedTimeline) return;

    if (!requireSession()) {
      setSaveError(t('Connectez-vous pour enregistrer votre itinéraire dans le Passeport Culturel.'));
      return;
    }

    setSaveError(null);
    const savedId = await saveItineraryToFirestore(
      `Itinéraire ${duration} - ${selectedInterests.join(', ')}`,
      duration,
      selectedInterests,
      generatedTimeline
    );

    if (!savedId) {
      setSaveError(t("Enregistrement impossible. Vérifiez que votre session est toujours active."));
      return;
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#c14e2f', '#5a5a40', '#d9822b', '#7c766b']
      });
    } catch (e) {
      // confetti is decorative only
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
          {t('Curation Culturelle par IA')}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          {t('Tissez Votre Vibe Culturelle')}
        </h2>
        <p className="text-xs text-[#6b665e]">
          {t('Générez un itinéraire séquencé historiquement, guidé par les protocoles et adapté à votre rythme.')}
        </p>
      </div>

      {/* Input Configuration Box */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e2d5] shadow-sm space-y-5">
        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="font-serif font-bold text-sm text-[#2c2926] block">
            {t('De combien de temps disposez-vous ?')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '2h', label: t('2 Heures') },
              { id: 'half-day', label: t('Demi-Journée') },
              { id: 'full-day', label: t('Journée Complète') },
              { id: '3-days', label: t('3 Jours d’Immersion') }
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
            {t('Quels aspects de la culture béninoise souhaitez-vous comprendre ?')}
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((opt) => {
              const isSelected = selectedInterests.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleInterest(opt.value)}
                  className={`py-2 px-3.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-[#fceee9] text-[#c14e2f] border-[#c14e2f]/40 shadow-sm'
                      : 'bg-[#f0ece1] text-[#6b665e] border-transparent hover:bg-[#e8e2d5]'
                  }`}
                >
                  {opt.label}
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
              <span>{t('Tissage de la séquence culturelle et des trajets')}...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#d9822b]" />
              <span>{t('Tisser un Itinéraire Personnalisé')}</span>
            </>
          )}
        </button>
      </div>

      {generateError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{generateError}</span>
        </div>
      )}

      {/* Generated Timeline Result */}
      {generatedTimeline && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a5a40]">
                {timelineSource === 'ai' ? t('Itinéraire généré par l’IA') : t('Itinéraire de référence')}
              </span>
              <h3 className="font-serif font-bold text-xl text-[#2c2926]">
                {t('Votre séquence culturelle')}
              </h3>
              {timelineSource === 'curated' && (
                <p className="text-[11px] text-[#8c867c] mt-1">
                  {t('La génération n’a pas répondu : cette séquence est notre parcours conseillé, pas une réponse du modèle.')}
                </p>
              )}
            </div>

            <button
              onClick={handleSaveToJournal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{savedSuccess ? t('Enregistré !') : t('Enregistrer')}</span>
            </button>
          </div>

          {saveError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

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
                    {stop.time && (
                      <div className="flex items-center">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#efece2] text-[#3a3a28] font-mono text-xs font-bold">
                          {stop.time}
                        </span>
                      </div>
                    )}

                    <div>
                      <h4 className="font-serif font-bold text-base text-[#2c2926]">
                        {stop.title}
                      </h4>
                      <p className="text-xs text-[#6b665e] leading-relaxed mt-1 font-sans">
                        {stop.description}
                      </p>
                    </div>

                    {/* Vibe Tip Insight Box */}
                    {!!stop.insight && (
                      <div className="p-3 rounded-xl bg-[#f0ece1] border border-[#e8e2d5] text-xs text-[#5a5a40] font-medium flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#c14e2f] flex-shrink-0 mt-0.5" />
                        <span>{stop.insight}</span>
                      </div>
                    )}

                    {matchedPlace && (
                      <button
                        onClick={() => onSelectPlace(matchedPlace)}
                        className="text-xs font-bold text-[#c14e2f] hover:underline flex items-center gap-1 pt-1"
                      >
                        <span>{t('Voir le contexte complet du site')}</span>
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
