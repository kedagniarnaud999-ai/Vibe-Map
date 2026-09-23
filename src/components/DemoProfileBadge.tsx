import React from 'react';
import { FlaskConical } from 'lucide-react';
import { useI18n } from '../lib/i18n';

/**
 * Un profil de demonstration n'est qu'un modele de mise en page : la mention doit apparaitre
 * partout ou il est montre, avec une couleur neutre pour ne pas voler le rouge des pastilles verifiees.
 */
export const DemoProfileBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useI18n();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#efece2] border border-[#dfdbcb] text-[#5a5a40] text-[10px] font-bold ${className}`}
    >
      <FlaskConical className="w-3 h-3 flex-shrink-0" />
      {t('Profil de démonstration')}
    </span>
  );
};
