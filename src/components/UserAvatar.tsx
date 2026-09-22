import React from 'react';

interface UserAvatarProps {
  src?: string;
  name: string;
  /** Dimensionnement commun a la photo et au monogramme. */
  className?: string;
  /** Taille de police du monogramme, differente selon l'endroit ou on l'affiche. */
  monogramClassName?: string;
}

/**
 * Une session verifiee sans photoURL n'a aucun visage connu : on affiche une
 * initiale. Une banque d'images preterait les traits d'une personne reelle a un
 * visiteur, et le resultat est persiste dans son profil Firestore.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  className = '',
  monogramClassName = 'text-base'
}) => {
  if (src) {
    return <img src={src} alt={name} referrerPolicy="no-referrer" className={className} />;
  }

  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <span
      role="img"
      aria-label={name}
      className={`flex items-center justify-center bg-[#fceee9] text-[#c14e2f] font-serif font-bold ${monogramClassName} ${className}`}
    >
      {initial || '·'}
    </span>
  );
};
