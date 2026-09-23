/**
 * Identifiant du modèle que le serveur appelle vraiment. Le front l'affiche dans
 * l'en-tête du Compagnon : écrit une seconde fois de l'autre côté du réseau, il a
 * déjà menti — « Gemini 3.5 Flash » s'affichait pendant que `server.ts` demandait
 * un 3.6, et le littéral ne passait même pas par `t()`.
 */
export const AI_MODEL = 'gemini-3.6-flash';
