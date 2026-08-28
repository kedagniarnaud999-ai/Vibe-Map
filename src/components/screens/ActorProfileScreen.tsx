import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Globe, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { Actor } from '../../types';
import { createBookingInFirestore } from '../../lib/firebase';

interface ActorProfileScreenProps {
  actor: Actor;
  onBack: () => void;
}

export const ActorProfileScreen: React.FC<ActorProfileScreenProps> = ({ actor, onBack }) => {
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState('Tomorrow, 10:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBook = async () => {
    if (!selectedExperience) return;
    setIsSubmitting(true);
    try {
      await createBookingInFirestore({
        actorId: actor.id,
        actorName: actor.name,
        experienceId: selectedExperience.id || 'exp-1',
        experienceTitle: selectedExperience.title,
        dateTime: bookingDate,
        price: selectedExperience.price,
        travelerName: 'Arnaud K.',
        travelerEmail: 'kedagniarnaud999@gmail.com'
      });
    } catch (e) {
      console.warn('Booking save warning:', e);
    }
    setIsSubmitting(false);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedExperience(null);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] pb-32">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#fdfcf8]/90 backdrop-blur-md border-b border-[#e8e2d5] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#e8e2d5] text-[#2c2926] transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold text-sm text-[#2c2926]">
            Mediator Profile
          </span>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: actor.name, text: actor.bio, url: window.location.href });
              }
            }}
            className="p-2 rounded-full text-[#6b665e] hover:bg-[#e8e2d5] transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8e2d5] shadow-sm space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={actor.avatar}
            alt={actor.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#fceee9] shadow-md flex-shrink-0"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#2c2926]">
                {actor.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fceee9] text-[#c14e2f] text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {actor.badgeTitle}
              </span>
            </div>

            <p className="text-sm font-semibold text-[#5a5a40]">{actor.role}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6b665e]">
              <span className="flex items-center gap-1 text-[#5a5a40] font-bold">
                <Star className="w-3.5 h-3.5 fill-current text-[#d9822b]" /> {actor.rating} ({actor.reviewsCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8c867c]" /> {actor.location}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#8c867c]" /> {actor.languages.join(' • ')}
              </span>
            </div>
          </div>
        </div>

        {/* Quote Block */}
        {actor.quote && (
          <div className="bg-[#efece2] border-l-4 border-[#5a5a40] p-4 rounded-xl">
            <p className="font-serif text-sm font-semibold text-[#3a3a28] italic">
              {actor.quote}
            </p>
          </div>
        )}

        {/* Bio */}
        {actor.bio && (
          <div className="bg-white rounded-2xl p-5 border border-[#e8e2d5] shadow-sm space-y-2">
            <h3 className="font-serif font-bold text-base text-[#2c2926]">
              About & Credentials
            </h3>
            <p className="text-xs text-[#6b665e] leading-relaxed font-sans">
              {actor.bio}
            </p>
          </div>
        )}

        {/* Expertise Areas */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-lg text-[#2c2926]">
            Areas of Cultural Expertise
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actor.expertise.map((exp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-[#e8e2d5] shadow-sm space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c14e2f]" />
                  <h4 className="font-serif font-bold text-sm text-[#2c2926]">
                    {exp.title}
                  </h4>
                </div>
                <p className="text-xs text-[#6b665e] leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bookable Experiences */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2c2926]">
              Curated Experiences
            </h3>
            <span className="text-xs font-semibold text-[#5a5a40]">
              Direct mediator booking
            </span>
          </div>

          <div className="space-y-3">
            {actor.experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-2xl p-5 border border-[#e8e2d5] shadow-sm flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base text-[#2c2926]">
                      {exp.title}
                    </h4>
                    {exp.isVirtual && (
                      <span className="px-2 py-0.5 rounded bg-[#efece2] text-[#5a5a40] text-[10px] font-bold">
                        Virtual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6b665e] leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#8c867c] pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {exp.duration}
                    </span>
                    <span className="font-bold text-[#c14e2f] text-sm">
                      {exp.price}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedExperience(exp)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all"
                >
                  Book Experience
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Carousel/List */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2c2926]">
              Traveler Endorsements
            </h3>
            <span className="text-xs text-[#8c867c]">Verified visits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actor.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-xl p-4 border border-[#e8e2d5] shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-[#2c2926]">
                    {rev.author}
                  </span>
                  <div className="flex text-[#d9822b]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#6b665e] italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-[#8c867c] block">
                  {rev.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Drawer Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#fdfcf8] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border border-[#e8e2d5] shadow-2xl space-y-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d5]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5a5a40]">
                  Request Introduction
                </span>
                <h3 className="font-serif font-bold text-lg text-[#2c2926]">
                  {selectedExperience.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExperience(null)}
                className="p-2 rounded-full hover:bg-[#e8e2d5] text-[#2c2926]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#fceee9] text-[#c14e2f] flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-[#2c2926]">
                  Introduction Confirmed!
                </h4>
                <p className="text-xs text-[#6b665e] max-w-xs mx-auto">
                  {actor.name} has been notified. You will receive meeting and etiquette details on your WhatsApp / SMS.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-[#e8e2d5] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8c867c]">Mediator:</span>
                    <span className="font-bold text-[#2c2926]">{actor.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8c867c]">Duration:</span>
                    <span className="font-medium text-[#2c2926]">{selectedExperience.duration}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8c867c]">Honorarium:</span>
                    <span className="font-bold text-[#c14e2f]">{selectedExperience.price}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#2c2926] block">
                    Preferred Time & Date
                  </label>
                  <select
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white border border-[#e8e2d5] text-xs font-medium focus:border-[#c14e2f] focus:outline-none"
                  >
                    <option>Tomorrow, 09:00 AM (Recommended Morning Sanctuary Walk)</option>
                    <option>Tomorrow, 03:00 PM (Afternoon Sunset Walk)</option>
                    <option>Saturday, 10:00 AM (Weekend Guided Deep Dive)</option>
                  </select>
                </div>

                <div className="bg-[#efece2] p-3 rounded-xl text-[11px] text-[#3a3a28] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5a5a40] flex-shrink-0" />
                  <span>Your visit directly supports local heritage preservation.</span>
                </div>

                <button
                  onClick={handleBook}
                  className="w-full py-3.5 rounded-xl bg-[#c14e2f] text-white font-bold text-xs shadow-md hover:bg-[#a83f23] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Confirm Introduction Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
