import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import DomeRobotCanvas from './DomeRobotCanvas';

export default function HeroSection({ lang, copy }) {
  const isRtl = lang === 'ar';

  return (
    <div id="top" className="relative bg-obsidian text-stone-alabaster selection:bg-brass/30">
      {/* =====================================================================
          PART 1: BALANCED, NON-CLIPPING HERO WITH 3D ROBOT & DOME SETTING
      ===================================================================== */}
      <section className="relative min-h-[100svh] w-full p-2.5 sm:p-4 lg:p-6 flex flex-col">
        {/* Sculpted QClay Architectural Bezel Frame */}
        <div className="relative flex-1 w-full rounded-[24px] sm:rounded-[34px] overflow-hidden border border-white/[0.12] bg-obsidian-surface shadow-[0_30px_100px_rgba(0,0,0,0.85)] flex flex-col justify-between">
          
          {/* 1. Crisp Vector Architectural Geodesic Dome Backdrop (No Stretched Low-Res Images) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Warm Architectural Atrium Radial Lighting */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_48%,rgba(212,163,89,0.12),transparent_58%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(247,245,240,0.04),transparent_50%)]" />

            {/* Crisp SVG Geodesic Dome Structural Silhouette */}
            <svg
              viewBox="0 0 1440 900"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full opacity-25"
            >
              {/* Outer Geodesic Canopy Arch */}
              <path
                d="M180 900C180 420 460 130 920 130C1380 130 1660 420 1660 900"
                stroke="rgba(212, 163, 89, 0.35)"
                strokeWidth="1.2"
              />
              {/* Secondary Inner Geodesic Ribs */}
              <path
                d="M310 900C310 490 540 230 920 230C1300 230 1530 490 1530 900"
                stroke="rgba(247, 245, 240, 0.16)"
                strokeWidth="1"
              />
              <path
                d="M460 900C460 560 640 340 920 340C1200 340 1380 560 1380 900"
                stroke="rgba(247, 245, 240, 0.1)"
                strokeWidth="1"
              />
              {/* Horizontal Geodesic Latitude Rings */}
              <line
                x1="120"
                y1="720"
                x2="1440"
                y2="720"
                stroke="rgba(247, 245, 240, 0.08)"
                strokeWidth="1"
              />
              <line
                x1="260"
                y1="520"
                x2="1440"
                y2="520"
                stroke="rgba(247, 245, 240, 0.06)"
                strokeWidth="1"
              />
            </svg>

            <div className="absolute inset-0 studio-grain" />
          </div>

          {/* 2. Subtle Swiss / QClay Hairline Grid */}
          <div className="absolute inset-0 z-10 pointer-events-none hidden md:grid grid-cols-12">
            <div className="col-span-1 border-e arch-hairline relative">
              <span className="absolute top-28 -end-[4.5px] text-[10px] font-mono text-white/20">+</span>
              <span className="absolute bottom-20 -end-[4.5px] text-[10px] font-mono text-white/20">+</span>
            </div>
            <div className="col-span-5 border-e arch-hairline relative">
              <span className="absolute top-28 -end-[4.5px] text-[10px] font-mono text-white/20">+</span>
              <span className="absolute bottom-20 -end-[4.5px] text-[10px] font-mono text-white/20">+</span>
            </div>
            <div className="col-span-6 relative" />
          </div>

          {/* 3. Main Hero Stage: Safe Navbar Clearance + Balanced Negative Space */}
          <div className="relative z-20 flex-1 max-w-[1480px] w-full mx-auto px-5 sm:px-10 lg:px-14 pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-14 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
              
              {/* Left / Start 6 Columns: Concise, Non-Clipping Editorial Typography */}
              <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-start">
                {/* Minimal Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-7 h-[1px] bg-brass shrink-0" />
                  <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-brass uppercase">
                    {copy.hero.eyebrow}
                  </span>
                </motion.div>

                {/* Balanced, Readable Monumental Headline (No Clipping or Overlap) */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-display font-medium tracking-tight text-stone-alabaster ${
                    isRtl
                      ? 'text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[4.1rem] leading-[1.2]'
                      : 'text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.35rem] leading-[1.06]'
                  }`}
                >
                  <span className="block">{copy.hero.headlineLine1}</span>
                  <span className="block sm:ps-6 lg:ps-10 mt-1 sm:mt-2">
                    <span
                      className={
                        isRtl
                          ? 'text-brass font-semibold'
                          : 'font-serif italic font-normal text-brass text-[1.1em] pe-2'
                      }
                    >
                      {copy.hero.headlineItalic}
                    </span>{' '}
                    <span>{copy.hero.headlineLine2}</span>
                  </span>
                </motion.h1>

                {/* Concise Subtitle + Purposeful CTA Cluster */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.25 }}
                  className="sm:ps-6 lg:ps-10 space-y-6 max-w-lg"
                >
                  <p className="text-sm sm:text-base text-stone-alabaster/80 leading-relaxed border-s-2 border-brass/50 ps-4">
                    {copy.hero.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3.5 pt-1">
                    <a
                      href="#experiences"
                      className="inline-flex items-center gap-3.5 bg-stone-alabaster text-obsidian ps-5 pe-2 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide group hover:bg-brass transition-all duration-500 shadow-xl shadow-black/40"
                    >
                      <span>{copy.hero.primaryCta}</span>
                      <span className="w-8 h-8 rounded-full bg-obsidian text-stone-alabaster flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                        <ArrowUpRight
                          className={`w-4 h-4 transition-transform duration-500 ${
                            isRtl
                              ? '-scale-x-100 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
                              : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                          }`}
                        />
                      </span>
                    </a>

                    <a
                      href="#vision"
                      className="inline-flex items-center gap-2 qclay-glass hover:border-brass/50 text-stone-alabaster px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition duration-300"
                    >
                      <span>{copy.hero.secondaryCta}</span>
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Right / End 6 Columns: Grounded 3D Robot Character on Architectural Plinth */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-6 relative flex items-center justify-center"
              >
                <DomeRobotCanvas
                  greetingText={copy.hero.robotGreeting}
                  subText={copy.hero.robotSub}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PART 2: BELOW-THE-FOLD ASYMMETRIC EDITORIAL PRELUDE (#vision)
          Clean transition from Hero; displays original Dome photos at native scale
      ===================================================================== */}
      <section
        id="vision"
        className="relative max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 py-20 sm:py-28 border-t arch-hairline"
      >
        {/* Stakeholder Banner Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
          className="flex flex-wrap items-center justify-between gap-4 pb-10 border-b arch-hairline"
        >
          <span className="font-mono text-xs tracking-[0.2em] text-brass">
            {copy.editorialPrelude.index}
          </span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-stone-muted">
            {copy.hero.stakeholderLabel}
          </span>
        </motion.div>

        {/* Asymmetric 12-Column Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 pt-12 items-start">
          
          {/* Left 7 Columns: Editorial Thesis Typography & 3 Architectural Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75 }}
              className={`font-display font-normal text-stone-alabaster tracking-tight ${
                isRtl
                  ? 'text-2xl sm:text-4xl lg:text-[2.75rem] leading-[1.22]'
                  : 'text-3xl sm:text-4xl lg:text-[3.1rem] leading-[1.08]'
              }`}
            >
              <span>{copy.editorialPrelude.headingRegular} </span>
              <span
                className={
                  isRtl
                    ? 'text-brass font-semibold'
                    : 'font-serif italic text-brass font-normal text-[1.08em]'
                }
              >
                {copy.editorialPrelude.headingItalic}
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm sm:text-base text-stone-alabaster/75 leading-relaxed pt-1"
            >
              <p>{copy.editorialPrelude.body1}</p>
              <p>{copy.editorialPrelude.body2}</p>
            </motion.div>

            {/* 3 Numbered Editorial Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t arch-hairline">
              {copy.editorialPrelude.pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="space-y-2"
                >
                  <span className="font-serif italic text-2xl text-brass block">
                    {pillar.num}.
                  </span>
                  <h3 className="text-base font-display font-semibold text-stone-alabaster">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-muted leading-relaxed">
                    {pillar.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Original Dome Photographs Displayed at Native Resolution (No Stretching) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-center lg:items-end"
          >
            <div className="relative w-full max-w-[520px] rounded-[24px] overflow-hidden border border-white/15 shadow-2xl bg-obsidian-surface">
              <picture className="w-full block">
                <source
                  media="(min-width: 768px)"
                  srcSet="./assets/architecture/amman-dome-desktop.jpg?v=2"
                />
                <img
                  src="./assets/architecture/amman-dome-mobile.jpg?v=2"
                  alt="Amman Dome Original Architectural Visualization"
                  className="w-full h-auto block"
                />
              </picture>
              <div className="p-4 sm:p-5 bg-obsidian-surface/95 border-t arch-hairline flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.18em] text-brass block">
                    {copy.editorialPrelude.tag}
                  </span>
                  <span className="text-xs sm:text-sm font-display font-medium text-stone-alabaster">
                    {copy.nav.brandName} — {copy.meta.location}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
