import React, { useState } from 'react';
import { Search, ShieldCheck, Star, MapPin, ArrowRight, Award, Users } from 'lucide-react';
import { Actor } from '../../types';

interface ActorDirectoryScreenProps {
  actors: Actor[];
  onSelectActor: (actor: Actor) => void;
}

export const ActorDirectoryScreen: React.FC<ActorDirectoryScreenProps> = ({
  actors,
  onSelectActor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const roles = ['All', 'Historian', 'Cultural Mediator', 'Artisan'];

  const filteredActors = actors.filter((a) => {
    const matchesRole =
      filterRole === 'All' ||
      a.role.toLowerCase().includes(filterRole.toLowerCase()) ||
      a.badgeTitle.toLowerCase().includes(filterRole.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
          Trusted Local Resources
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          Verified Cultural Mediators
        </h2>
        <p className="text-xs text-[#6b665e]">
          Connect with scholars, oral historians, and master craftspeople for respectful cultural immersion.
        </p>
      </div>

      {/* Trust Pledge Banner */}
      <div className="bg-[#efece2] border border-[#dfdbcb] rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#c14e2f] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-serif font-bold text-xs text-[#3a3a28]">
            The La Vibe Map Trust Pledge
          </h4>
          <p className="text-[11px] text-[#6b665e] leading-relaxed">
            Every mediator is vetted by local councils and elders to guarantee respectful, nuanced engagement without commercial distortion.
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
          placeholder="Search by name, specialty, or city..."
          className="w-full pl-10 pr-4 py-3 bg-[#f0ece1] text-[#2c2926] placeholder-[#8c867c] text-sm rounded-xl border border-transparent focus:border-[#c14e2f] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* Role Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterRole === r
                ? 'bg-[#c14e2f] text-white shadow-sm'
                : 'bg-[#f0ece1] text-[#6b665e] hover:bg-[#e8e2d5]'
            }`}
          >
            {r}
          </button>
        ))}
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
              <img
                src={actor.avatar}
                alt={actor.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#c14e2f]/30 flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-serif font-bold text-lg text-[#2c2926] group-hover:text-[#c14e2f] transition-colors">
                    {actor.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#fceee9] text-[#c14e2f] text-[10px] font-bold">
                    {actor.badgeTitle}
                  </span>
                </div>
                <p className="text-xs text-[#5a5a40] font-medium">{actor.role}</p>
                <div className="flex items-center gap-3 text-xs text-[#6b665e] flex-wrap">
                  <span className="flex items-center gap-1 text-[#5a5a40] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current text-[#d9822b]" /> {actor.rating} ({actor.reviewsCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8c867c]" /> {actor.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#f0ece1]">
              <div className="text-[11px] text-[#8c867c]">
                <span>{actor.experienceYears} yrs experience</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectActor(actor);
                }}
                className="px-4 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all flex items-center gap-1"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
