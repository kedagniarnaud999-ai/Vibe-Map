import React, { useState } from 'react';
import { Search, BookOpen, Clock, ArrowRight, Volume2, Sparkles, Filter } from 'lucide-react';
import { Story } from '../../types';

interface LibraryScreenProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ stories, onSelectStory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Heritage', 'Spiritual', 'Oral History', 'Textiles'];

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
          Digital Cultural Library
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
          Sacred Knowledge & Living Heritage
        </h2>
        <p className="text-xs text-[#6b665e]">
          Curated historical essays, oral chronicles, and textile symbol decoders written by West African scholars.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c867c]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search textile symbols, Vodun cosmology, royal griots..."
          className="w-full pl-10 pr-4 py-3 bg-[#f0ece1] text-[#2c2926] placeholder-[#8c867c] text-sm rounded-xl border border-transparent focus:border-[#c14e2f] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#c14e2f] text-white shadow-sm'
                : 'bg-[#f0ece1] text-[#6b665e] hover:bg-[#e8e2d5]'
            }`}
          >
            {cat}
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
                {story.category}
              </div>
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{story.readTime}</span>
              </div>
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
                  <img
                    src={story.author.avatar}
                    alt={story.author.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-[#6b665e] font-medium">
                    {story.author.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#c14e2f] flex items-center gap-0.5">
                  Read <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
