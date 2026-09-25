import { ActorKind, BookingStatus, Category, GuideApplicationStatus, TravelStyle, UserRole } from '../types';
import { useI18n } from './i18n';

/**
 * Les enumerations de categories sont persistees telles quelles (Firestore, filtres,
 * API) : seuls les libelles passent par la table de traduction.
 */
export const useCategoryLabel = () => {
  const { t } = useI18n();

  const labels: Record<Category, string> = {
    Spiritual: t('Spirituel'),
    Historical: t('Historique'),
    Nature: t('Nature'),
    Arts: t('Arts'),
    Heritage: t('Patrimoine'),
    Food: t('Gastronomie'),
    'Oral History': t('Histoire Orale'),
    Lodging: t('Hébergement'),
    Leisure: t('Loisirs')
  };

  return (value: Category) => labels[value] ?? value;
};

/** Les roles viennent des claims verifies : on traduit l'affichage, jamais l'identifiant stocke. */
export const useRoleLabel = () => {
  const { t } = useI18n();

  const labels: Record<UserRole, string> = {
    traveler: t('Voyageur'),
    guide: t('Guide'),
    admin: t('Administrateur')
  };

  return (value: UserRole) => labels[value] ?? value;
};

/** La nature d'un profil d'annuaire est une donnee, pas une deviation du texte du role. */
export const useActorKindLabel = () => {
  const { t } = useI18n();

  const labels: Record<ActorKind, string> = {
    structure: t('Structure'),
    guide: t('Guide')
  };

  return (value: ActorKind) => labels[value] ?? value;
};

/**
 * L'administration et le portail mediateur listent les memes reservations : une seule
 * table de libelles, pour qu'un statut ne s'affiche pas en anglais d'un cote et en
 * francais de l'autre. Une valeur inconnue reste montre telle quelle plutot que
 * remplacee par un libelle qui n'aurait rien a voir avec la donnee.
 */
export const useBookingStatusLabel = () => {
  const { t } = useI18n();

  const labels: Record<BookingStatus, string> = {
    pending: t('En attente'),
    confirmed: t('Confirmée'),
    completed: t('Terminée'),
    cancelled: t('Annulée')
  };

  return (value: BookingStatus) => labels[value] ?? value;
};

/**
 * Une demande d'agrement se decide dans la file d'attente de l'admin, et l'identifiant stocke
 * (`pending`, `approved`, `rejected`) sert aussi aux couleurs de la pastille et aux filtres :
 * seuls les mots affiches passent par la table.
 */
export const useGuideApplicationStatusLabel = () => {
  const { t } = useI18n();

  const labels: Record<GuideApplicationStatus, string> = {
    pending: t('En attente'),
    approved: t('Agréée'),
    rejected: t('Rejetée')
  };

  return (value: GuideApplicationStatus) => labels[value] ?? value;
};

/**
 * Le rythme d'exploration est le seul gout que le voyageur choisisse lui-meme. Il est stocke
 * par son identifiant (`'Cultural Deep-Dive'`) : la carte du passeport et l'ecran de profil
 * partagent ce registre, pour que le meme choix ne s'affiche pas avec deux mots differents.
 */
export const useTravelStyleLabel = () => {
  const { t } = useI18n();

  const labels: Record<TravelStyle, string> = {
    Relaxed: t('Doux'),
    Explorer: t('Explorateur'),
    'Cultural Deep-Dive': t('Immersion Profonde')
  };

  return (value: TravelStyle) => labels[value] ?? value;
};

/**
 * Les codes sont ceux que la table de messages du SDK empaqueté connaît : le paquet livré
 * n'emporte pas ses phrases anglaises, donc la chaine qu'un visiteur lirait sans ce registre
 * est `Firebase: Error (auth/wrong-password).`. Les trois codes d'identifiants refusés
 * (`wrong-password`, `user-not-found`, `invalid-credential`) disent un seul mot, comme les
 * trois codes de fenetre Google : trois mots differents feraient de ce formulaire un oracle
 * d'existence de comptes. Un code inconnu rend le mot deja traduit que l'appelant fournit.
 */
export const useAuthErrorLabel = () => {
  const { t } = useI18n();

  const labels: Record<string, string> = {
    'invalid-email': t('Format d’adresse email invalide.'),
    'wrong-password': t('Email ou mot de passe incorrect.'),
    'user-not-found': t('Email ou mot de passe incorrect.'),
    'invalid-credential': t('Email ou mot de passe incorrect.'),
    'user-disabled': t('Ce compte a été désactivé.'),
    'email-already-in-use': t('Cette adresse email est déjà utilisée.'),
    'weak-password': t('Mot de passe trop simple.'),
    'too-many-requests': t('Trop de tentatives. Réessayez dans un instant.'),
    'network-request-failed': t('Connexion réseau impossible. Vérifiez votre connexion.'),
    'operation-not-allowed': t('Ce mode de connexion n’est pas activé sur ce projet.'),
    'internal-error': t('Le service de connexion a répondu une erreur. Réessayez.'),
    'popup-closed-by-user': t('Fenêtre de connexion fermée avant la fin.'),
    'cancelled-popup-request': t('Fenêtre de connexion fermée avant la fin.'),
    'popup-blocked': t('Fenêtre de connexion fermée avant la fin.'),
    'account-exists-with-different-credential': t('Un compte existe déjà avec cette adresse, via un autre mode de connexion.')
  };

  return (code: string | undefined, fallback: string) => {
    const key = code?.replace(/^auth\//, '');
    return (key && labels[key]) || fallback;
  };
};
