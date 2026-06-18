/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Translation, ContactSettings, SiteContent, getContent } from '../types';
import Logo from './Logo';

interface HeroProps {
  t: Translation;
  lang: 'en' | 'ar';
  settings?: ContactSettings;
  siteContent?: SiteContent[];
}

export default function Hero({ t, lang, settings, siteContent }: HeroProps) {
  const logoImageUrl = siteContent?.find(i => i.key === 'brand_logo_image')?.value_en || '';
  
  const handleExploreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector('#portfolio');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const dynamicBgImage = getContent(siteContent, 'hero_background_image', lang, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80');

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden select-none"
      style={{ backgroundColor: '#0a0e27' }}
    >
      {/* Background Decorative Ambient Flares */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold/10 blur-[130px] pointer-events-none ambient-bg-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-white/5 blur-[150px] pointer-events-none" />

      {/* Grid Pattern Overlay to feel like architectural drafting paper */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" 
        style={{ maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)' }}
      />

      {/* Soft blurred background luxury interior layout representation */}
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-15 filter blur-[4px] pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `url('${dynamicBgImage}')` }}
        data-content-image="hero_background_image"
      />

      {/* Main Content Pane */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Monogram Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative mt-16 sm:mt-20 lg:mt-24 mb-8 group"
        >
          {/* Pulsing back flare */}
          <div className="absolute -inset-1.5 bg-gold/25 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 border border-gold/40 bg-[#0a0e27] shadow-[0_0_40px_rgba(201,168,76,0.25)] rounded-full overflow-hidden">
            <Logo 
              variant="emblem" 
              imageUrl={logoImageUrl} 
              className="w-[110%] h-[110%] object-contain object-center" 
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%] h-[112%] border border-gold/15 rounded-full pointer-events-none" />
          </div>
        </motion.div>

        {/* Small Intro Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-gold/30 bg-gold/5 text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-mono mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span>{lang === 'en' ? 'Bespoke Atelier' : 'مرسم وتصميم مخصص'}</span>
        </motion.div>

        {/* Grand Headline Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="font-serif font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-[0.16em] mb-4 text-center leading-none"
          data-content-key="hero_title"
        >
          {getContent(siteContent, 'hero_title', lang, 'HAZAR ALGHANEM')}
        </motion.h1>

        {/* Sub-headline Designer Definition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-serif text-lg sm:text-2xl italic text-gold tracking-wide mb-6 font-medium"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          data-content-key="hero_subtitle"
        >
          {getContent(siteContent, 'hero_subtitle', lang, t.heroSub)}
        </motion.p>

        {/* Beautiful Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="text-xs sm:text-sm tracking-[0.2em] uppercase text-gold/90 max-w-xl leading-relaxed mb-10 font-sans font-light"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          data-content-key="hero_tagline"
        >
          {getContent(siteContent, 'hero_tagline', lang, t.heroTagline)}
        </motion.p>

        {/* Interactive Luxury CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mb-14"
        >
          <button
            onClick={handleExploreClick}
            className="group relative px-8 py-3.5 border border-gold bg-gold/5 hover:bg-gold/15 text-white text-xs md:text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.35)] hover:border-gold hover:scale-105 active:scale-95"
            data-content-key="hero_cta_button"
          >
            <span className="relative z-10">{getContent(siteContent, 'hero_cta_button', lang, t.heroCTA)}</span>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gold border border-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>

      </div>

      {/* Elegant animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] text-gold/60 font-mono">
          {lang === 'en' ? 'SCROLL TO EXPLORE' : 'مرر للأسفل'}
        </span>
        <ArrowDown className="w-4 h-4 text-gold animate-bounce" />
      </motion.div>
    </section>
  );
}
