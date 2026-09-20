import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { AppLanguage } from '../types';
import { EN } from './translations-en';

const STORAGE_KEY = 'lavibemap_language';

/** Langues proposees a l'utilisateur. */
export const SUPPORTED_LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' }
];

const isSupported = (value: string | null): value is AppLanguage =>
  value === 'fr' || value === 'en';

function readStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'fr';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  // Les anciennes versions proposaient fon/goun/yoruba : on retombe sur le francais.
  return isSupported(stored) ? stored : 'fr';
}

export type TranslationVars = Record<string, string | number>;

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  );
}

interface I18nValue {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  /**
   * La chaine francaise est la cle. En anglais on cherche dans `EN` ; a defaut
   * on rend le francais, ce qui rend la dette de traduction visible sans jamais
   * casser l'ecran. `npm run check:i18n` liste les entrees manquantes.
   */
  t: (fr: string, vars?: TranslationVars) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<AppLanguage>(readStoredLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (fr: string, vars?: TranslationVars) =>
      interpolate(lang === 'fr' ? fr : EN[fr] ?? fr, vars),
    [lang]
  );

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n doit etre utilise dans <LanguageProvider>');
  return value;
}
