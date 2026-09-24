import React, { useEffect, useState } from 'react';
import { 
  Bookmark, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Users, 
  Award, 
  Share2, 
  CheckCircle2, 
  Compass, 
  Calendar,
  CalendarCheck,
  AlertCircle,
  LogIn,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserPreferences, Place, Story, UserRole } from '../../types';
import { getMyBookingsFromFirestore, BookingRecord } from '../../lib/firebase';
import { formatBookingWhen, formatInstant } from '../../lib/slots';
import { useI18n } from '../../lib/i18n';
import { UserAvatar } from '../UserAvatar';
import { useCategoryLabel, useBookingStatusLabel, useTravelStyleLabel } from '../../lib/labels';

interface JournalScreenProps {
  user: UserPreferences;
  places: Place[];
  stories: Story[];
  onSelectPlace: (place: Place) => void;
  onSelectStory: (story: Story) => void;
  onOpenAuth: (targetRole?: UserRole) => void;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({
  user,
  places,
  stories,
  onSelectPlace,
  onSelectStory,
  onOpenAuth
}) => {
  const { lang, t } = useI18n();
  const [activeTab, setActiveTab] = useState<'stamps' | 'stories' | 'badges' | 'requests'>('stamps');
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [requests, setRequests] = useState<BookingRecord[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsSignedIn, setRequestsSignedIn] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  const categoryLabel = useCategoryLabel();
  const bookingStatusLabel = useBookingStatusLabel();
  const travelStyleLabel = useTravelStyleLabel();

  const loadRequests = async () => {
    setRequestsLoading(true);
    const result = await getMyBookingsFromFirestore();
    setRequestsSignedIn(result.signedIn);
    setRequests(result.bookings);
    setRequestsError(result.error);
    setRequestsLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const formatCount = (value: number) => new Intl.NumberFormat(lang).format(value);

  const handleSharePassport = async () => {
    const sacredSitesCount = user.savedPlaces.length;
    const summary =
      sacredSitesCount > 1
        ? t('Mon passeport culturel La Vibe Map : {n} sites sacrés enregistrés.', { n: sacredSitesCount })
        : t('Mon passeport culturel La Vibe Map : {n} site sacré enregistré.', { n: sacredSitesCount });
    let shared = false;
    const viaNativeShare = typeof navigator.share === 'function';

    if (viaNativeShare) {
      try {
        await navigator.share({ title: 'La Vibe Map', text: summary, url: window.location.href });
        shared = true;
      } catch (e) {
        return;
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${summary} ${window.location.href}`);
        shared = true;
      } catch (e) {
        setShareNote(t('Copie impossible'));
        setTimeout(() => setShareNote(null), 2500);
        return;
      }
    }

    if (!shared) {
      setShareNote(t('Partage indisponible'));
      setTimeout(() => setShareNote(null), 2500);
      return;
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setShareNote(viaNativeShare ? t('Passeport partagé !') : t('Lien copié !'));
    setTimeout(() => setShareNote(null), 2500);
  };

  const savedPlacesList = places.filter((p) => user.savedPlaces.includes(p.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40]">
            {t('Carnet de Mémoire & Scrapbook de Voyage')}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2926]">
            {t('Mon Passeport Culturel')}
          </h2>
        </div>

        <button
          onClick={handleSharePassport}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c14e2f] text-white text-xs font-bold shadow hover:bg-[#a83f23] active:scale-95 transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{shareNote ?? t('Partager mon passeport')}</span>
        </button>
      </div>

      {/* Passport Header Card */}
      <div className="bg-gradient-to-br from-[#c14e2f] via-[#a83f23] to-[#5a5a40] text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            src={user.avatar}
            name={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#d9822b]"
            monogramClassName="text-lg"
          />
          <div>
            <h3 className="font-serif font-bold text-lg leading-tight">
              {user.name}
            </h3>
            {user.travelStyle && (
              <p className="text-xs text-[#d9822b] font-medium">{travelStyleLabel(user.travelStyle)}</p>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-center">
          <div>
            <span className="font-serif font-bold text-lg block">{formatCount(user.savedPlaces.length)}</span>
            <span className="text-[10px] text-white/80 uppercase">{t('Sites enregistrés')}</span>
          </div>
          <div>
            <span className="font-serif font-bold text-lg block">
              {requestsLoading ? '—' : formatCount(new Set(requests.map((r) => r.actorId)).size)}
            </span>
            <span className="text-[10px] text-white/80 uppercase">{t('Médiateurs contactés')}</span>
          </div>
          <div>
            <span className="font-serif font-bold text-lg block">{formatCount(user.storiesCount)}</span>
            <span className="text-[10px] text-white/80 uppercase">{t('Itinéraires enregistrés')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e8e2d5] gap-6">
        {[
          { id: 'stamps', label: t('Sites enregistrés'), icon: MapPin },
          { id: 'stories', label: t('Tous les récits'), icon: BookOpen },
          { id: 'badges', label: t('Badges Obtenus'), icon: Award },
          {
            id: 'requests',
            label: requests.length ? `${t('Mes demandes')} (${formatCount(requests.length)})` : t('Mes demandes'),
            icon: CalendarCheck
          }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 font-serif text-sm font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'text-[#c14e2f] border-[#c14e2f]'
                  : 'text-[#8c867c] border-transparent hover:text-[#2c2926]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'stamps' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {savedPlacesList.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8e2d5] hover:border-[#c14e2f]/40 p-4 flex gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#efece2] flex-shrink-0 relative">
                <img
                  src={place.image}
                  alt={place.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#c14e2f] text-white text-[8px] font-bold">
                  {t('Enregistré')}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#5a5a40]">
                  {categoryLabel(place.category)}
                </span>
                <h4 className="font-serif font-bold text-sm text-[#2c2926] line-clamp-1">
                  {place.name}
                </h4>
                <p className="text-[11px] text-[#6b665e] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8c867c]" /> {place.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="bg-white rounded-2xl p-4 border border-[#e8e2d5] hover:border-[#c14e2f]/40 transition-all cursor-pointer shadow-sm flex gap-3"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#efece2] flex-shrink-0">
                <img
                  src={story.heroImage}
                  alt={story.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#c14e2f]">
                  {categoryLabel(story.category)}
                </span>
                <h4 className="font-serif font-bold text-xs text-[#2c2926] line-clamp-2">
                  {story.title}
                </h4>
                <span className="text-[10px] text-[#8c867c]">{t('{n} min de lecture', { n: story.readMinutes })}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-4 animate-fade-in">
          {user.badges.length === 0 && (
            <div className="p-4 rounded-2xl border border-dashed border-[#dedad0] bg-[#f0ece1]/60">
              <p className="text-xs text-[#5a5a40]">
                {t('Aucun badge décerné sur ce compte. L’application n’attribue pas encore de distinction.')}
              </p>
            </div>
          )}

          {user.badges.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {user.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                badge.unlocked
                  ? 'bg-white border-[#e8e2d5] shadow-sm'
                  : 'bg-[#f0ece1]/60 border-dashed border-[#dedad0] opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white ${
                  badge.unlocked ? 'bg-[#c14e2f]' : 'bg-gray-400'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-serif font-bold text-xs text-[#2c2926]">
                  {badge.title}
                </h5>
                <span className="text-[10px] text-[#8c867c] block">
                  {badge.unlocked ? t('Débloqué') : t('Verrouillé')}
                </span>
              </div>
            </div>
            ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4 animate-fade-in">
          {requestsLoading && (
            <p className="text-xs text-[#8c867c]">{t('Chargement de vos demandes…')}</p>
          )}

          {!requestsLoading && !requestsSignedIn && (
            <div className="p-4 rounded-2xl border border-dashed border-[#dedad0] bg-[#f0ece1]/60 space-y-3">
              <p className="text-xs text-[#5a5a40]">
                {t('Connectez-vous avec un compte vérifié pour retrouver vos demandes.')}
              </p>
              <button
                onClick={() => onOpenAuth('traveler')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2e5a44] text-white text-xs font-bold hover:bg-[#24493a] active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('Se connecter')}</span>
              </button>
            </div>
          )}

          {!requestsLoading && requestsSignedIn && requestsError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-2">
              <p className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{t('Vos demandes n’ont pas pu être lues.')}</span>
              </p>
              <p className="text-[11px] text-red-600/90 pl-6">{requestsError}</p>
              <button
                onClick={loadRequests}
                className="ml-6 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 text-[11px] font-bold hover:bg-red-100 transition-colors"
              >
                {t('Réessayer')}
              </button>
            </div>
          )}

          {!requestsLoading && requestsSignedIn && !requestsError && requests.length === 0 && (
            <div className="p-5 rounded-2xl border border-dashed border-[#dedad0] bg-[#faf7f0] space-y-2 text-center">
              <CalendarCheck className="w-6 h-6 mx-auto text-[#8c867c]" />
              <p className="text-xs font-bold text-[#2c2926]">{t('Aucune demande posée avec ce compte.')}</p>
              <p className="text-[11px] text-[#8c867c]">
                {t('Une demande se pose depuis la fiche d’un médiateur, après avoir choisi une immersion.')}
              </p>
            </div>
          )}

          {!requestsLoading && requests.map((r) => (
            <div
              key={r.id || `${r.experienceId}-${r.createdAt}`}
              className="p-4 bg-white rounded-2xl border border-[#e8e2d5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="font-serif font-bold text-sm text-[#2c2926]">{r.experienceTitle}</div>
                <div className="text-[#5a5a40] font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{t('Médiateur :')} {r.actorName}</span>
                </div>
                <div className="text-[11px] text-[#8c867c] flex items-center gap-2 flex-wrap">
                  <Calendar className="w-3 h-3" />
                  <span>{formatBookingWhen(r.dateTime, r.createdAt, lang)}</span>
                  <span>•</span>
                  <span>{t('Demandée le')} {formatInstant(r.createdAt || '', lang)}</span>
                  <span>•</span>
                  <DollarSign className="w-3 h-3 text-[#c14e2f]" />
                  <span className="font-bold text-[#c14e2f]">{t('Montant')} : {r.price}</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                r.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                r.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                r.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {bookingStatusLabel(r.status)}
              </span>
            </div>
          ))}

          {!requestsLoading && requests.length > 0 && (
            <p className="text-[11px] text-[#8c867c]">
              {t('Une demande posée ici attend une réponse : l’état change quand l’équipe la traite depuis sa console, et rien ne vous est envoyé automatiquement.')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
