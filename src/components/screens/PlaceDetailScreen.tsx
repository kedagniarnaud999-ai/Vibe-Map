import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  MapPin, 
  ShieldAlert, 
  Play, 
  Pause, 
  Volume2, 
  CheckCircle2, 
  MessageCircle, 
  AlertTriangle, 
  Info, 
  Eye, 
  VolumeX,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Place } from '../../types';
import { commonsPage, creditLine } from '../../lib/media';
import { useI18n } from '../../lib/i18n';
import { useCategoryLabel } from '../../lib/labels';

interface PlaceDetailScreenProps {
  place: Place;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: (placeId: string) => Promise<boolean>;
}

export const PlaceDetailScreen: React.FC<PlaceDetailScreenProps> = ({
  place,
  onBack,
  isSaved = false,
  onToggleSave
}) => {
  const { t } = useI18n();
  const categoryLabel = useCategoryLabel();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(25);
  const [expandedSection, setExpandedSection] = useState<'history' | 'etiquette' | 'visuals'>('history');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: 'ok' | 'warn' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const notify = (message: string, tone: 'ok' | 'warn' = 'ok') => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    if (!onToggleSave || isSaving) {
      return;
    }

    setIsSaving(true);
    const saved = await onToggleSave(place.id);
    setIsSaving(false);
    if (!saved) {
      notify(t('Enregistrement impossible : vérifiez votre session.'), 'warn');
      return;
    }
    notify(
      isSaved
        ? t('Site retiré de votre carnet.')
        : t('Site enregistré dans votre carnet de voyage !')
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] pb-28">
      {/* Hero Image Section */}
      <div className="relative h-72 sm:h-80 w-full bg-[#e8e2d5]">
        <img
          src={place.image}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2c2926] hover:bg-white transition-all shadow-md"
            aria-label={t('Retour')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-md disabled:opacity-60 ${
                isSaved ? 'bg-[#c14e2f] text-white' : 'bg-white/80 text-[#2c2926] hover:bg-white'
              }`}
              title={isSaved ? t('Retirer de mon carnet') : t('Enregistrer dans mon carnet')}
              aria-label={isSaved ? t('Retirer de mon carnet') : t('Enregistrer dans mon carnet')}
            >
              <Bookmark className={`w-5 h-5 ${isSaving ? 'animate-pulse' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: place.name, text: place.description, url: window.location.href });
                } else {
                  notify(t('Partage indisponible sur ce navigateur.'), 'warn');
                }
              }}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2c2926] hover:bg-white transition-all shadow-md"
              title={t('Partager')}
              aria-label={t('Partager')}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Title & Badges */}
        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c14e2f] text-white text-[11px] font-bold">
              {categoryLabel(place.category)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#d9822b]" />
              {place.location}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            {place.name}
          </h1>
          {place.imageCredit && (
            <a
              href={commonsPage(place.imageCredit.file)}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-1 text-[10px] leading-tight text-white/70 hover:text-white"
            >
              {t('Photo : {credit}', { credit: creditLine(place.imageCredit) })}
            </a>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-6">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#c14e2f] text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
            {toast.tone === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-[#d9822b]" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-[#f5d0b0]" />
            )}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Before You Enter: Etiquette Protocol */}
        <div className="bg-[#efece2] border border-[#dfdbcb] rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#3a3a28]">
            <ShieldAlert className="w-5 h-5 text-[#5a5a40] flex-shrink-0" />
            <h3 className="font-serif font-bold text-base">
              {t('Protocole & Éthique du Sanctuaire')}
            </h3>
          </div>
          <p className="text-xs text-[#6b665e] leading-relaxed">
            {t('Ce sanctuaire est un lieu sacré et historique toujours vivant. Observer les coutumes locales témoigne d’un profond respect pour la communauté et ses gardiens.')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {place.etiquette.map((rule, idx) => (
              <div
                key={idx}
                className="bg-white/90 rounded-xl p-3 border border-[#dfdbcb] space-y-1"
              >
                <div className="text-xs font-bold text-[#5a5a40] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c14e2f]" />
                  {rule.title}
                </div>
                <p className="text-[11px] text-[#6b665e] leading-normal">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Story Guide Player */}
        {place.audioGuide && (
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8e2d5] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#fceee9] text-[#c14e2f]">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a5a40] block">
                    {t('Récit Audio Sélectionné')}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#2c2926]">
                    {place.audioGuide.title}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono text-[#8c867c]">
                {place.audioGuide.duration}
              </span>
            </div>

            <p className="text-xs text-[#6b665e] italic">
              {place.audioGuide.narrator}
            </p>

            {/* Audio Scrubber & Controls */}
            <div className="space-y-2 pt-1">
              <div className="w-full bg-[#f0ece1] h-2 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="bg-[#c14e2f] h-full rounded-full transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setAudioProgress((p) => Math.max(0, p - 10))}
                  className="text-xs text-[#6b665e] hover:text-[#c14e2f]"
                >
                  -10s
                </button>

                <button
                  onClick={handleToggleAudio}
                  className="w-11 h-11 rounded-full bg-[#c14e2f] text-white flex items-center justify-center shadow hover:bg-[#a83f23] active:scale-95 transition-all"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => setAudioProgress((p) => Math.min(100, p + 10))}
                  className="text-xs text-[#6b665e] hover:text-[#c14e2f]"
                >
                  +10s
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deep Cultural History */}
        <div className="bg-white rounded-2xl p-5 border border-[#e8e2d5] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2c2926]">
              {t('Histoire Ancestrale & Symboles')}
            </h3>
            <span className="text-xs font-semibold text-[#5a5a40] bg-[#efece2] px-2.5 py-0.5 rounded-full">
              {t('Archive du Patrimoine')}
            </span>
          </div>

          <p className="text-sm text-[#6b665e] leading-relaxed font-sans">
            {place.deepHistory || place.description}
          </p>
        </div>

        {/* Words to Know / Vocabulary Flashcards */}
        {place.vocabulary && place.vocabulary.length > 0 && (
          <div className="space-y-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2c2926]">
                {t('Mots à Connaître')}
              </h3>
              <p className="text-xs text-[#6b665e]">
                {t('Le vocabulaire Fon essentiel pour comprendre le lieu')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {place.vocabulary.map((vocab, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedWord(selectedWord === vocab.term ? null : vocab.term)}
                  className="bg-white p-4 rounded-xl border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#c14e2f]">
                      {vocab.term}
                    </span>
                    {vocab.phonetic && (
                      <span className="text-[11px] font-mono text-[#8c867c]">
                        {vocab.phonetic}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6b665e] leading-relaxed">
                    {vocab.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Relics & Guides */}
        {place.visualGuides && place.visualGuides.length > 0 && (
          <div className="space-y-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2c2926]">
                {t('Guide Visuel & Éléments Sacrés')}
              </h3>
              <p className="text-xs text-[#6b665e]">
                {t('À observer lors de la marche dans l’enceinte sacrée')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {place.visualGuides.map((guide, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl overflow-hidden border border-[#e8e2d5] shadow-sm"
                >
                  <div className="h-36 bg-[#e8e2d5] overflow-hidden">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h5 className="font-serif font-bold text-xs text-[#2c2926]">
                      {guide.title}
                    </h5>
                    <p className="text-[11px] text-[#6b665e] leading-tight">
                      {guide.description}
                    </p>
                    {guide.credit && (
                      <a
                        href={commonsPage(guide.credit.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[10px] leading-tight text-[#8c867c] hover:text-[#c14e2f]"
                      >
                        {t('Photo : {credit}', { credit: creditLine(guide.credit) })}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
