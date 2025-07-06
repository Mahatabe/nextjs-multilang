"use client";

import React, { createContext, useState, useContext } from "react";
import en from "@/messages/en.json";
import bn from "@/messages/bn.json";

const languages = { en, bn };

type Lang = "en" | "bn";
type Translation = typeof en;

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translation;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: languages.en,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = languages[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
