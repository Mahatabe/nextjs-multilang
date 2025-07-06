"use client";

import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-4 bg-gray-900 text-white text-center fixed bottom-0 left-0">
      {t.footer.copyright}
    </footer>
  );
}
