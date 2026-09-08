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
  Globe,
  Lock,
  ArrowLeft,
  Send,
  Check
} from 'lucide-react';
import { UserProfile, Actor, AppLanguage, UserRole } from '../../types';
import { getGuideBookingsFromFirestore, updateBookingStatus, submitGuideApplication, BookingRecord } from '../../lib/firebase';
import { TRANSLATIONS } from '../../lib/i18n';

interface GuidePortalScreenProps {
  user: UserProfile;
  currentLang: AppLanguage;
  actors: Actor[];
  onOpenAuth?: (targetRole?: UserRole) => void;
  onBackToPublic?: () => void;
}

export const GuidePortalScreen: React.FC<GuidePortalScreenProps> = ({
  user,
  currentLang,
  actors,
  onOpenAuth,
  onBackToPublic
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.fr;
  const [guideBookings, setGuideBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Application form state if not accredited
  const [applicantName, setApplicantName] = useState(user.name);
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantRegion, setApplicantRegion] = useState('Ouidah, Abomey');
  const [applicantExp, setApplicantExp] = useState(3);
  const [applicantLanguages, setApplicantLanguages] = useState('Français, Fon, English');
  const [applicantSpecialties, setApplicantSpecialties] = useState('Histoire Royale, Rituels Vodun');
  const [applicantBio, setApplicantBio] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const isGuide = user.role === 'guide' || user.role === 'admin';

  // Match current user with an Actor profile if available
  const currentActor = actors.find((a) => 
    a.name.toLowerCase().includes(user.name.toLowerCase()) || 
    a.id === user.guideProfile?.actorId || 
    a.id === '1'
  ) || actors[0];

  useEffect(() => {
    if (isGuide) {
      getGuideBookingsFromFirestore(currentActor.id)
        .then((records) => {
          setGuideBookings(records);
        })
        .finally(() => setLoading(false));
    }
  }, [currentActor.id, isGuide]);

  const handleStatusChange = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    await updateBookingStatus(bookingId, status);
    setGuideBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingApp(true);
    try {
      const res = await submitGuideApplication({
        userId: user.id || 'applicant-' + Date.now(),
        fullName: applicantName,
        email: user.email,
        phone: applicantPhone,
        region: applicantRegion,
        experienceYears: Number(applicantExp) || 1,
        languages: applicantLanguages.split(',').map(s => s.trim()),
        specialties: applicantSpecialties.split(',').map(s => s.trim()),
        bio: applicantBio
      });
      if (res.success) {
        setSubmittedSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingApp(false);
    }
  };

  // If not guide or admin, render the Guide Access & Accreditation Gate
  if (!isGuide) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] py-8 px-4 font-sans text-[#2c2926] flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d5] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#5a5a40] text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#2c2926]">
              Portail Réservé aux Médiateurs Agréés
            </h2>
            <p className="text-xs text-[#6b665e] max-w-sm mx-auto">
              Cet espace est dédié aux guides touristiques, conteurs traditionnels et médiateurs certifiés du Bénin pour gérer leurs réservations de voyageurs.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="bg-green-50 p-5 rounded-2xl border border-green-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base text-green-900">
                Demande d'Agrément Enregistrée !
              </h4>
              <p className="text-xs text-green-800">
                Votre dossier a été transmis à la commission des conservateurs. Vous serez notifié dès activation de votre compte guide.
              </p>
              {onBackToPublic && (
                <button
                  onClick={onBackToPublic}
                  className="mt-3 px-4 py-2 bg-green-800 text-white font-bold text-xs rounded-xl hover:bg-green-900 transition-all"
                >
                  Retourner à la Découverte du Patrimoine
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-[#faf7f0] rounded-2xl border border-[#e8e2d5] space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#2c2926]">
                  Vous êtes déjà Guide ou Médiateur Agréé ?
                </h4>
                <p className="text-xs text-[#6b665e]">
                  Connectez-vous avec votre compte professionnel pour accéder à vos demandes de visite et plannings.
                </p>
                {onOpenAuth && (
                  <button
                    onClick={() => onOpenAuth('guide')}
                    className="w-full py-2.5 px-4 bg-[#5a5a40] text-white font-bold text-xs rounded-xl hover:bg-[#484833] transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Se Connecter avec mon Compte Guide</span>
                  </button>
                )}
              </div>

              <div className="border-t border-[#f0ece1] pt-4">
                <h4 className="font-serif font-bold text-sm text-[#2c2926] mb-2">
                  Postuler pour devenir Médiateur Culturel Agréé :
                </h4>
                <form onSubmit={handleApply} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">Téléphone / WhatsApp</label>
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+229 97..."
                        required
                        className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">Années de pratique</label>
                      <input
                        type="number"
                        min={1}
                        max={40}
                        value={applicantExp}
                        onChange={(e) => setApplicantExp(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#2c2926] mb-1">Régions & Spécialités</label>
                    <input
                      type="text"
                      value={applicantSpecialties}
                      onChange={(e) => setApplicantSpecialties(e.target.value)}
                      placeholder="Ex: Ouidah, Danxomè, Ganvié..."
                      required
                      className="w-full px-3 py-2 bg-[#faf7f0] border border-[#e8e2d5] rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="w-full py-2.5 rounded-xl bg-[#c14e2f] text-white font-bold text-xs hover:bg-[#a83f23] transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingApp ? 'Envoi...' : 'Soumettre ma Demande d’Agrément'}</span>
                  </button>
                </form>
              </div>

              {onBackToPublic && (
                <div className="text-center pt-2">
                  <button
                    onClick={onBackToPublic}
                    className="text-xs text-[#8c867c] hover:text-[#2c2926] transition-colors"
                  >
                    ← Retourner à l'Espace Voyageur
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

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
