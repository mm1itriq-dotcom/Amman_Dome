import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ExperiencesSection from './components/ExperiencesSection';
import { heroTranslations } from './i18n/heroTranslations';

export default function App() {
  const [lang, setLang] = useState('en');
  const copy = heroTranslations[lang];

  useEffect(() => {
    const isRtl = lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="min-h-screen bg-obsidian text-stone-alabaster antialiased">
      <Navbar lang={lang} setLang={setLang} copy={copy} />
      <main>
        <HeroSection lang={lang} copy={copy} />
        <ExperiencesSection lang={lang} copy={copy} />
      </main>
    </div>
  );
}
