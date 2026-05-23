import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, LANGS } from "../i18n/translations";
import { getCookie, setCookie } from "../lib/cookies";

const LangCtx = createContext({ lang: "en", t: TRANSLATIONS.en, setLang: () => {} });

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "en";
    const fromCookie = getCookie("lipi-lang");
    if (fromCookie && TRANSLATIONS[fromCookie]) return fromCookie;
    return "en";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    setCookie("lipi-lang", lang, 365);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      t: TRANSLATIONS[lang] || TRANSLATIONS.en,
      setLang: (l) => {
        if (TRANSLATIONS[l]) setLangState(l);
      },
      langs: LANGS,
    }),
    [lang]
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
};

export const useLanguage = () => useContext(LangCtx);
