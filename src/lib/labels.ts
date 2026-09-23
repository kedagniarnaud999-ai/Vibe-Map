import { ActorKind, Category, UserRole } from '../types';
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
