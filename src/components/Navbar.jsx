import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar({ lang, setLang, copy }) {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = lang === 'ar';

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 pointer-events-none"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Brand Architectural Mark */}
          <a
            href="#top"
            className="pointer-events-auto group flex items-center gap-3.5 qclay-glass rounded-full ps-3 pe-5 py-2 transition duration-500 hover:border-brass/40"
          >
            <div className="w-9 h-9 rounded-full bg-brass/15 border border-brass/40 flex items-center justify-center text-brass relative overflow-hidden">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                className="w-5 h-5 transition-transform duration-700 group-hover:scale-110"
              >
                <path
                  d="M4 23C4 14.1634 9.37258 7 16 7C22.6274 7 28 14.1634 28 23"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M9 23C9 15.8203 12.134 10 16 10C19.866 10 23 15.8203 23 23"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeOpacity="0.75"
                />
                <path
                  d="M16 7V23M2 23H30M7.5 15.5H24.5"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeOpacity="0.65"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs sm:text-sm tracking-[0.14em] text-stone-alabaster leading-none">
                {copy.nav.brandName}
              </span>
              <span className="font-mono text-[9px] tracking-[0.16em] text-stone-muted mt-1 hidden sm:block">
                {copy.meta.location}
              </span>
            </div>
          </a>

          {/* Center Floating Smoked-Glass Navigation Pill (Desktop) */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="pointer-events-auto hidden lg:flex items-center qclay-glass rounded-full p-1.5 shadow-2xl shadow-black/50"
          >
            {copy.nav.links.map((item) => {
              const isHovered = hoveredNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  className="relative px-5 py-2 rounded-full text-xs font-medium tracking-wide text-stone-alabaster/90 hover:text-stone-alabaster transition-colors flex items-baseline gap-1.5"
                >
                  {isHovered && (
                    <motion.span
                      layoutId="qclayNavHover"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
                      className="absolute inset-0 rounded-full bg-white/[0.09] border border-white/[0.12]"
                    />
                  )}
                  <span className="relative z-10 font-mono text-[9px] text-brass/85">
                    {item.id}
                  </span>
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster: Bilingual Switcher + Signature QClay Pill CTA */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              aria-label="Switch Language"
              className="qclay-glass rounded-full px-3.5 py-2.5 text-xs font-medium text-stone-alabaster hover:border-brass/50 transition flex items-center gap-2 cursor-pointer"
            >
              <span
                className={`text-[11px] font-mono transition ${
                  lang === 'en' ? 'text-brass font-semibold' : 'text-stone-muted'
                }`}
              >
                EN
              </span>
              <span className="w-[1px] h-3 bg-white/15" />
              <span
                className={`text-xs font-arabicDisplay transition ${
                  lang === 'ar' ? 'text-brass font-semibold' : 'text-stone-muted'
                }`}
              >
                عربي
              </span>
            </button>

            <a
              href="#vision"
              className="hidden sm:inline-flex items-center gap-3 bg-stone-alabaster text-obsidian ps-5 pe-1.5 py-1.5 rounded-full text-xs font-semibold tracking-wide group hover:bg-brass transition-colors duration-500 shadow-lg shadow-black/40"
            >
              <span>{copy.nav.cta}</span>
              <span className="w-7 h-7 rounded-full bg-obsidian text-stone-alabaster flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <ArrowUpRight
                  className={`w-3.5 h-3.5 transition-transform duration-500 ${
                    isRtl
                      ? '-scale-x-100 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
                      : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                  }`}
                />
              </span>
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
              className="lg:hidden qclay-glass w-10 h-10 rounded-full flex items-center justify-center text-stone-alabaster hover:border-brass/50 transition cursor-pointer"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Editorial Curtain Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-2xl flex flex-col justify-between px-6 pt-28 pb-10 lg:hidden"
          >
            <div className="space-y-2 border-t arch-hairline pt-6">
              <div className="font-mono text-[10px] tracking-[0.2em] text-brass mb-4">
                {copy.meta.status}
              </div>
              {copy.nav.links.map((item, idx) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-baseline justify-between py-4 border-b arch-hairline group"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-brass">{item.id}</span>
                    <span className="text-2xl font-display font-medium text-stone-alabaster group-hover:text-brass transition">
                      {item.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    className={`w-4 h-4 text-stone-muted group-hover:text-brass transition ${
                      isRtl ? '-scale-x-100' : ''
                    }`}
                  />
                </motion.a>
              ))}
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl qclay-glass-light">
                <div className="font-mono text-[10px] tracking-[0.16em] text-brass">
                  {copy.meta.code}
                </div>
                <p className="text-xs text-stone-muted mt-1">
                  {copy.hero.stakeholderLabel}
                </p>
              </div>
              <a
                href="#vision"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-between bg-stone-alabaster text-obsidian ps-5 pe-2 py-2 rounded-full text-xs font-semibold"
              >
                <span>{copy.nav.cta}</span>
                <span className="w-8 h-8 rounded-full bg-obsidian text-stone-alabaster flex items-center justify-center">
                  <ArrowUpRight className={`w-4 h-4 ${isRtl ? '-scale-x-100' : ''}`} />
                </span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
