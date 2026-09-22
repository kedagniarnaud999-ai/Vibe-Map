import React, { useState } from 'react';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { Story, Category } from '../../types';
import { commonsPage, creditLine, monogram } from '../../lib/media';
import { useI18n } from '../../lib/i18n';
import { useCategoryLabel } from '../../lib/labels';

interface LibraryScreenProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ stories, onSelectStory }) => {
  const { t } = useI18n();
  const categoryLabel = useCategoryLabel();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Les pastilles suivent le corpus : une categorie sans recit ne propose pas un filtre vide.
  const usedCategories: Category[] = stories.map((s) => s.category);
  const filters: ('All' | Category)[] = ['All', ...Array.from(new Set(usedCategories))];

  const filteredStories = stories.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
          {t('Bibliothèque Culturelle Numérique')}
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          {t('Savoirs Sacrés & Patrimoine Vivant')}
        </h2>
        <p className="text-xs text-[#6b665e]">
          {t('Essais historiques, chroniques orales et décodeurs de symboles textiles, écrits par des chercheurs ouest-africains.')}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('Rechercher des symboles textiles, la cosmogonie Vodun, les griots royaux...')}
          className="w-full pl-10 pr-4 py-3 bg-[#f0ece1] text-[#2c2926] placeholder-[#8c867c] text-sm rounded-xl border border-transparent focus:border-[#c14e2f] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {filters.map((id) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === id
                ? 'bg-[#c14e2f] text-white shadow-sm'
                : 'bg-[#f0ece1] text-[#6b665e] hover:bg-[#e8e2d5]'
            }`}
          >
            {id === 'All' ? t('Tous') : categoryLabel(id)}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="group bg-white rounded-2xl overflow-hidden border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div className="relative h-48 bg-[#e8e2d5] overflow-hidden">
              <img
                src={story.heroImage}
                alt={story.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#c14e2f]">
                {categoryLabel(story.category)}
              </div>
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{t('{n} min de lecture', { n: story.readMinutes })}</span>
              </div>
              {story.imageCredit && (
                <a
                  href={commonsPage(story.imageCredit.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-x-0 bottom-0 bg-black/45 px-2 py-1 text-[9px] leading-tight text-white/85 hover:text-white"
                >
                  {t('Photo : {credit}', { credit: creditLine(story.imageCredit) })}
                </a>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2c2926] group-hover:text-[#c14e2f] transition-colors leading-snug">
                  {story.title}
                </h3>
                <p className="text-xs text-[#6b665e] line-clamp-2 mt-1 font-sans">
                  {story.subtitle}
                </p>
              </div>

              <div className="pt-2 border-t border-[#f0ece1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {story.author.avatar ? (
                    <img
                      src={story.author.avatar}
                      alt={story.author.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full bg-[#efece2] flex items-center justify-center font-serif text-[9px] font-bold text-[#5a5a40] flex-shrink-0"
                    >
                      {monogram(story.author.name)}
                    </div>
                  )}
                  <span className="text-xs text-[#6b665e] font-medium">
                    {story.author.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#c14e2f] flex items-center gap-0.5">
                  {t('Lire')} <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
