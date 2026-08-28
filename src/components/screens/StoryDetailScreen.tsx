import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Clock, 
  Volume2, 
  Play, 
  Pause, 
  Sparkles, 
  ArrowRight,
  Info,
  Check
} from 'lucide-react';
import { Story, ScreenId } from '../../types';

interface StoryDetailScreenProps {
  story: Story;
  onBack: () => void;
  onSelectStory: (story: Story) => void;
  onNavigate: (screen: ScreenId) => void;
  allStories: Story[];
}

export const StoryDetailScreen: React.FC<StoryDetailScreenProps> = ({
  story,
  onBack,
  onSelectStory,
  onNavigate,
  allStories
}) => {
  const [activeSymbolId, setActiveSymbolId] = useState<string>('lion');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const selectedSymbol = story.symbols?.find((s) => s.id === activeSymbolId) || story.symbols?.[0];

  return (
    <div className="min-h-screen bg-[#fdfcf8] pb-28">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#fdfcf8]/90 backdrop-blur-md border-b border-[#e8e2d5] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#e8e2d5] text-[#2c2926] transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-[#c14e2f] bg-[#fceee9]' : 'text-[#6b665e] hover:bg-[#e8e2d5]'
              }`}
              title="Save Article"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: story.title, text: story.subtitle, url: window.location.href });
                }
              }}
              className="p-2 rounded-full text-[#6b665e] hover:bg-[#e8e2d5] transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Reader Container */}
      <article className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Category & Time */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-[#fceee9] text-[#c14e2f] font-semibold text-xs uppercase tracking-wider">
            {story.category}
          </span>
          <span className="text-xs text-[#8c867c] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {story.readTime}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2926] leading-tight">
            {story.title}
          </h1>
          <p className="font-serif text-lg text-[#6b665e] italic leading-relaxed">
            {story.subtitle}
          </p>
        </div>

        {/* Author Bio Header */}
        <div className="flex items-center gap-3 py-3 border-y border-[#e8e2d5]">
          <img
            src={story.author.avatar}
            alt={story.author.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border-2 border-[#c14e2f]/30"
          />
          <div>
            <h4 className="font-serif font-bold text-sm text-[#2c2926]">
              {story.author.name}
            </h4>
            <p className="text-xs text-[#5a5a40]">{story.author.title}</p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-[#e8e2d5] bg-[#e8e2d5] h-64 sm:h-80">
          <img
            src={story.heroImage}
            alt={story.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body - Paragraph 1 with Drop Cap */}
        <div className="prose text-[#2c2926] text-base leading-relaxed font-sans space-y-4">
          <p className="first-letter:font-serif first-letter:text-5xl first-letter:font-bold first-letter:text-[#c14e2f] first-letter:mr-2.5 first-letter:float-left first-letter:leading-none">
            {story.introduction}
          </p>
          <p className="text-[#6b665e] leading-relaxed">
            {story.secondParagraph}
          </p>
        </div>

        {/* Audio Track Insert */}
        {story.audioTrack && (
          <div className="bg-[#f0ece1] rounded-2xl p-4 sm:p-5 border border-[#e8e2d5] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c14e2f] text-white flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-serif font-bold text-sm text-[#2c2926]">
                  {story.audioTrack.title}
                </h5>
                <p className="text-xs text-[#6b665e]">
                  {story.audioTrack.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-10 h-10 rounded-full bg-white text-[#c14e2f] shadow flex items-center justify-center hover:bg-[#fceee9] transition-all flex-shrink-0"
              aria-label="Play audio snippet"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        )}

        {/* Interactive Symbol Decoding Section */}
        {story.symbols && story.symbols.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#2c2926]">
                {story.symbolsTitle || 'Decoding the Symbols'}
              </h3>
              <p className="text-xs text-[#6b665e] leading-relaxed">
                {story.symbolsDescription}
              </p>
            </div>

            {/* Symbol Selection Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {story.symbols.map((sym) => {
                const isSelected = activeSymbolId === sym.id;
                return (
                  <button
                    key={sym.id}
                    onClick={() => setActiveSymbolId(sym.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#c14e2f] text-white border-[#c14e2f] shadow-md scale-[1.02]'
                        : 'bg-white text-[#2c2926] border-[#e8e2d5] hover:border-[#c14e2f]/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden mb-2 bg-[#e8e2d5]">
                      <img
                        src={sym.image}
                        alt={sym.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-serif font-bold text-xs">
                      {sym.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Symbol Detail Card */}
            {selectedSymbol && (
              <div className="bg-white rounded-2xl p-5 border border-[#c14e2f]/30 shadow-sm flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#e8e2d5] flex-shrink-0">
                  <img
                    src={selectedSymbol.image}
                    alt={selectedSymbol.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#fceee9] text-[#c14e2f] text-[10px] font-bold">
                      Royal Dahomey Emblem
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#2c2926]">
                      {selectedSymbol.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#6b665e] leading-relaxed">
                    {selectedSymbol.meaning}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pull Quote */}
        {story.quote && (
          <blockquote className="my-6 p-6 rounded-2xl bg-[#efece2] border-l-4 border-[#5a5a40] space-y-2">
            <p className="font-serif text-lg font-bold text-[#3a3a28] italic leading-relaxed">
              {story.quote.text}
            </p>
            <footer className="text-xs text-[#5a5a40] font-semibold">
              — {story.quote.author}
            </footer>
          </blockquote>
        )}

        {/* Conclusion */}
        {story.conclusion && (
          <p className="text-sm text-[#6b665e] leading-relaxed font-sans">
            {story.conclusion}
          </p>
        )}

        {/* Workshop CTA Card */}
        {story.workshopCTA && (
          <div className="bg-gradient-to-br from-[#c14e2f] to-[#5a5a40] text-white rounded-2xl p-6 shadow-md space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#d9822b]" />
              <span>Living Craftsmanship</span>
            </div>
            <h3 className="font-serif text-xl font-bold">
              {story.workshopCTA.title}
            </h3>
            <p className="text-xs text-white/90 leading-relaxed font-sans">
              {story.workshopCTA.description}
            </p>
            <button
              onClick={() => onNavigate('actors')}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#c14e2f] text-xs font-bold shadow hover:bg-[#fdfcf8] active:scale-95 transition-all"
            >
              <span>Connect with Master Weavers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Related Stories */}
        {story.relatedStories && story.relatedStories.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-[#e8e2d5]">
            <h3 className="font-serif font-bold text-lg text-[#2c2926]">
              Related Stories
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {story.relatedStories.map((rel) => {
                const targetStory = allStories.find((s) => s.id === rel.id) || story;
                return (
                  <div
                    key={rel.id}
                    onClick={() => onSelectStory(targetStory)}
                    className="bg-white rounded-xl overflow-hidden border border-[#e8e2d5] hover:border-[#c14e2f]/40 p-3 flex gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#e8e2d5] flex-shrink-0">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center space-y-1">
                      <span className="text-[10px] font-bold text-[#c14e2f] uppercase">
                        {rel.category}
                      </span>
                      <h5 className="font-serif font-bold text-xs text-[#2c2926] line-clamp-2">
                        {rel.title}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
