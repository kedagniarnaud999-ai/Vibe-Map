import React, { useState } from 'react';
import { Search, ShieldCheck, Star, MapPin, ArrowRight } from 'lucide-react';
import { Actor } from '../../types';
import { monogram } from '../../lib/media';
import { useI18n } from '../../lib/i18n';

interface ActorDirectoryScreenProps {
  actors: Actor[];
  onSelectActor: (actor: Actor) => void;
}

export const ActorDirectoryScreen: React.FC<ActorDirectoryScreenProps> = ({
  actors,
  onSelectActor
}) => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActors = actors.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      searchQuery === '' ||
      a.name.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query) ||
      a.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
          {t('Ressources Locales de Confiance')}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          {t('Structures publiques et institutions culturelles')}
        </h2>
        <p className="text-xs text-[#6b665e]">
          {t('Adresses officielles pour préparer une visite, vérifier les conditions d’accès et s’orienter vers un encadrement reconnu.')}
        </p>
      </div>

      {/* Trust Pledge Banner */}
      <div className="bg-[#efece2] border border-[#dfdbcb] rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#c14e2f] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-serif font-bold text-xs text-[#3a3a28]">
            {t('Ce que cet annuaire garantit')}
          </h4>
          <p className="text-[11px] text-[#6b665e] leading-relaxed">
            {t('Seules des structures existantes, qui publient leurs propres contacts, sont référencées. La Vibe Map ne certifie aucun médiateur et ne prend aucune commission sur une mise en relation.')}
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Rechercher une structure, un secteur ou une ville...')}
          className="w-full pl-10 pr-4 py-3 bg-[#f0ece1] text-[#2c2926] placeholder-[#8c867c] text-sm rounded-xl border border-transparent focus:border-[#c14e2f] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* Mediators List */}
      <div className="space-y-4">
        {filteredActors.map((actor) => (
          <div
            key={actor.id}
            onClick={() => onSelectActor(actor)}
            className="group bg-white rounded-2xl p-5 border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
          >
            <div className="flex items-start gap-4">
              {actor.avatar ? (
                <img
                  src={actor.avatar}
                  alt={actor.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#c14e2f]/30 flex-shrink-0"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="w-16 h-16 rounded-full bg-[#efece2] border-2 border-[#c14e2f]/30 flex items-center justify-center font-serif text-lg font-bold text-[#5a5a40] flex-shrink-0"
                >
                  {monogram(actor.name)}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-serif font-bold text-lg text-[#2c2926] group-hover:text-[#c14e2f] transition-colors">
                    {actor.name}
                  </h3>
                  {actor.badgeTitle && (
                    <span className="px-2 py-0.5 rounded-full bg-[#fceee9] text-[#c14e2f] text-[10px] font-bold">
                      {actor.badgeTitle}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5a5a40] font-medium">{actor.role}</p>
                <div className="flex items-center gap-3 text-xs text-[#6b665e] flex-wrap">
                  {actor.rating !== undefined && (
                    <span className="flex items-center gap-1 text-[#5a5a40] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current text-[#d9822b]" /> {actor.rating} ({actor.reviewsCount === 1 ? t('1 avis') : t('{count} avis', { count: actor.reviewsCount })})
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8c867c]" /> {actor.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#f0ece1]">
              <div className="text-[11px] text-[#8c867c]">
                {actor.experienceYears !== undefined ? (
                  <span>{actor.experienceYears === 1 ? t('{count} an d’expérience', { count: actor.experienceYears }) : t('{count} ans d’expérience', { count: actor.experienceYears })}</span>
                ) : actor.contact?.phone ? (
                  <a
                    href={`tel:${actor.contact.phone.replace(/\s+/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[#c14e2f]"
                  >
                    {actor.contact.phone}
                  </a>
                ) : actor.contact?.email ? (
                  <a
                    href={`mailto:${actor.contact.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-[#c14e2f] break-all"
                  >
                    {actor.contact.email}
                  </a>
                ) : null}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectActor(actor);
                }}
                className="px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all flex items-center gap-1"
              >
                <span>{t('Voir le profil')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {filteredActors.length === 0 && (
          <p className="text-xs text-[#6b665e] bg-white rounded-2xl border border-[#e8e2d5] p-5">
            {t('Aucune structure ne correspond à cette recherche.')}
          </p>
        )}
      </div>
    </div>
  );
};
