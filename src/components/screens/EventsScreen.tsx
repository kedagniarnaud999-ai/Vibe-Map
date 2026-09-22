import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, ShieldAlert, AlertCircle } from 'lucide-react';
import { CulturalEvent } from '../../types';
import { saveEventRSVPToFirestore } from '../../lib/firebase';
import { commonsPage, creditLine } from '../../lib/media';
import { useI18n } from '../../lib/i18n';

interface EventsScreenProps {
  events: CulturalEvent[];
  requireSession: () => boolean;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({ events, requireSession }) => {
  const { t } = useI18n();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [rsvpPending, setRsvpPending] = useState<string | null>(null);
  const [rsvpSaved, setRsvpSaved] = useState<string | null>(null);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  const types = ['All', ...Array.from(new Set(events.map((e) => e.type)))];

  const eventTypeLabels: Record<string, string> = {
    All: t('Tous'),
    Festival: t('Festival'),
    Workshop: t('Atelier'),
    Ceremony: t('Cérémonie'),
    Concert: t('Concert')
  };

  // `accessType` est une littérale française persistée, déjà rendue dans la langue
  // active par `localizeEvents` côté App : aucune table de correspondance ici.
  const eventTypeLabel = (value: string) => eventTypeLabels[value] ?? value;

  const filteredEvents = events.filter(
    (e) => selectedType === 'All' || e.type === selectedType
  );

  const featured = events.find((e) => e.isFeatured) || events[0];

  // Ownership comes from the signed-in account, never from a value typed in this screen.
  const handleRSVP = async (id: string) => {
    const evt = events.find((e) => e.id === id);
    if (!evt || rsvpPending) {
      return;
    }

    if (!requireSession()) {
      setRsvpError(t('Connectez-vous pour ajouter un rassemblement à votre agenda.'));
      return;
    }

    setRsvpError(null);
    setRsvpPending(id);
    const saved = await saveEventRSVPToFirestore(id, evt.title);
    setRsvpPending(null);

    if (!saved) {
      setRsvpError(t("L'enregistrement a échoué. Vérifiez que votre session est toujours active."));
      return;
    }

    setRsvpSaved(id);
    setTimeout(() => setRsvpSaved(null), 2500);
  };

  const rsvpLabel = (id: string) =>
    rsvpPending === id
      ? t('Enregistrement…')
      : rsvpSaved === id
        ? t('Ajouté à l’agenda')
        : t('Ajouter à mon agenda');

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
          {t('Traditions Vivantes')}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          {t('Rassemblements Culturels & Rituels')}
        </h2>
        <p className="text-xs text-[#6b665e]">
          {t('Participez aux festivals et aux cérémonies sacrées du Bénin, dans le respect des protocoles culturels.')}
        </p>
      </div>

      {rsvpError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{rsvpError}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {types.map((typeId) => (
          <button
            key={typeId}
            onClick={() => setSelectedType(typeId)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === typeId
                ? 'bg-[#c14e2f] text-white shadow-sm'
                : 'bg-[#f0ece1] text-[#6b665e] hover:bg-[#e8e2d5]'
            }`}
          >
            {eventTypeLabel(typeId)}
          </button>
        ))}
      </div>

      {/* Featured Event Hero */}
      {featured && (
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#e8e2d5] bg-[#efece2]">
          <div className="h-64 sm:h-72 w-full relative bg-[#3f4e4f]">
            {featured.image && (
              <>
                <img
                  src={featured.image}
                  alt={featured.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              </>
            )}
            
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full bg-[#c14e2f] text-white text-[10px] font-bold">
                {t('Rassemblement à la Une')}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
              <div className="flex items-center gap-3 text-xs text-white/90">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#d9822b]" /> {featured.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d9822b]" /> {featured.location}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                {featured.title}
              </h3>
              <p className="text-xs text-white/80 line-clamp-2 font-sans">
                {featured.description}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleRSVP(featured.id)}
                  disabled={rsvpPending !== null}
                  className="px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{rsvpLabel(featured.id)}</span>
                </button>
              </div>

              {featured.image && featured.imageCredit && (
                <a
                  href={commonsPage(featured.imageCredit.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[9px] leading-tight text-white/70 hover:text-white"
                >
                  {t('Photo : {credit}', { credit: creditLine(featured.imageCredit) })}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-serif font-bold text-lg text-[#2c2926]">
          {t('Prochains Rassemblements')}
        </h3>

        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8e2d5] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#efece2] flex-shrink-0 flex items-center justify-center">
                  {evt.image ? (
                    <img
                      src={evt.image}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Sparkles aria-hidden="true" className="w-5 h-5 text-[#c14e2f]" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#fceee9] text-[#c14e2f] text-[10px] font-bold">
                      {eventTypeLabel(evt.type)}
                    </span>
                    <span className="text-xs text-[#8c867c] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {evt.date}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#2c2926]">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-[#6b665e] line-clamp-1">
                    {evt.description}
                  </p>
                  <p className="text-[11px] text-[#8c867c] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {evt.location}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0ece1]">
                <span className="text-[11px] font-semibold text-[#5a5a40] px-2.5 py-1 rounded bg-[#efece2]">
                  {evt.accessType}
                </span>

                <button
                  onClick={() => handleRSVP(evt.id)}
                  disabled={rsvpPending !== null}
                  className="px-3.5 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all disabled:opacity-60"
                >
                  {rsvpLabel(evt.id)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
