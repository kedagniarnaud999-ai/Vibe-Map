import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  Phone, 
  Sparkles, 
  Plus, 
  Edit, 
  MessageSquare,
  Globe
} from 'lucide-react';
import { UserProfile, Actor, AppLanguage } from '../../types';
import { getGuideBookingsFromFirestore, updateBookingStatus, BookingRecord } from '../../lib/firebase';
import { TRANSLATIONS } from '../../lib/i18n';

interface GuidePortalScreenProps {
  user: UserProfile;
  currentLang: AppLanguage;
  actors: Actor[];
}

export const GuidePortalScreen: React.FC<GuidePortalScreenProps> = ({
  user,
  currentLang,
  actors
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [guideBookings, setGuideBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Match current user with an Actor profile if available
  const currentActor = actors.find((a) => 
    a.name.toLowerCase().includes(user.name.toLowerCase()) || 
    a.id === user.guideProfile?.actorId || 
    a.id === '1'
  ) || actors[0];

  useEffect(() => {
    getGuideBookingsFromFirestore(currentActor.id)
      .then((records) => {
        setGuideBookings(records);
      })
      .finally(() => setLoading(false));
  }, [currentActor.id]);

  const handleStatusChange = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    await updateBookingStatus(bookingId, status);
    setGuideBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-6 px-4 font-sans text-[#2c2926]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Guide Identity Cockpit */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-md border border-[#e8e2d5]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || currentActor.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#5a5a40] shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#2c2926]">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5a5a40] text-white text-[10px] font-bold flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Médiateur Agréé</span>
                  </span>
                </div>
                <p className="text-xs text-[#6b665e] mt-0.5">
                  {currentActor.role} • {currentActor.location}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-[#8c867c]">
                  <span>⭐ {currentActor.rating} ({currentActor.reviewsCount} avis)</span>
                  <span>•</span>
                  <span>🗣️ {currentActor.languages.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#faf7f0] p-3 rounded-2xl border border-[#e8e2d5] text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end">
              <span className="text-[10px] uppercase font-bold text-[#8c867c]">Tarif Guide Base</span>
              <span className="font-serif font-bold text-lg text-[#c14e2f]">
                {user.guideProfile?.pricing || '20 000 FCFA'}
              </span>
              <span className="text-[10px] text-[#5a5a40]">~30 € / Demi-journée</span>
            </div>
          </div>
        </div>

        {/* Incoming Traveler Reservations */}
        <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2c2926] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#c14e2f]" />
              <span>Demandes de Visites & Immersions ({guideBookings.length})</span>
            </h3>
          </div>

          {loading ? (
            <div className="text-center py-6 text-xs text-[#8c867c]">Chargement de vos réservations...</div>
          ) : guideBookings.length === 0 ? (
            <div className="p-6 text-center bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] text-xs text-[#6b665e] space-y-2">
              <Calendar className="w-8 h-8 text-[#8c867c] mx-auto opacity-50" />
              <p className="font-semibold text-[#2c2926]">Aucune réservation directe pour le moment</p>
              <p className="text-[11px] text-[#8c867c]">
                Votre profil est visible par les voyageurs sur la carte et le répertoire des médiateurs. Dès qu'un voyageur réserve une expérience, elle apparaîtra ici.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {guideBookings.map((b) => (
                <div
                  key={b.id || Math.random()}
                  className="p-4 bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-serif font-bold text-sm text-[#2c2926]">
                      {b.experienceTitle}
                    </div>
                    <div className="text-[#5a5a40] font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{b.travelerName}</span>
                      <span className="text-[#8c867c]">({b.travelerEmail})</span>
                    </div>
                    <div className="text-[11px] text-[#8c867c] flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>{b.dateTime}</span>
                      <span>•</span>
                      <DollarSign className="w-3 h-3 text-[#c14e2f]" />
                      <span className="font-bold text-[#c14e2f]">{b.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      b.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>

                    {b.id && b.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(b.id!, 'completed')}
                        className="px-3 py-1.5 bg-[#2e5a44] text-white text-[11px] font-semibold rounded-xl hover:bg-[#204030] cursor-pointer"
                      >
                        Marquer Réalisée
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guide Experiences Catalog */}
        <div className="bg-white rounded-3xl p-6 border border-[#e8e2d5] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#2c2926]">
              Mes Expériences & Itinéraires Proposés
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentActor.experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-4 bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif font-bold text-sm text-[#2c2926]">
                      {exp.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-white text-[11px] font-bold text-[#c14e2f] border border-[#e8e2d5] flex-shrink-0">
                      {exp.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b665e] mt-1">{exp.description}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8c867c] pt-2 border-t border-[#e8e2d5]">
                  <span>Durée : {exp.duration}</span>
                  <span className="text-green-700 font-semibold">✓ Au catalogue</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
