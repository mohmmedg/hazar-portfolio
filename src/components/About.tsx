/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Landmark, Compass, Award } from 'lucide-react';
import { Translation, ContactSettings, SiteContent, getContent } from '../types';

interface AboutProps {
  t: Translation;
  lang: 'en' | 'ar';
  settings?: ContactSettings;
  siteContent?: SiteContent[];
}

function StatCounter({ targetValue, valueStr, suffix = "+", delay = 0.1 }: { targetValue: number; valueStr?: string; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.5 });

  const finalValue = valueStr ? (parseInt(valueStr.replace(/\D/g, '')) || targetValue) : targetValue;
  const finalSuffix = valueStr ? valueStr.replace(/[0-9]/g, '') : suffix;

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = finalValue;
      if (start === end) {
        setCount(end);
        return;
      }

      const duration = 1.8; // seconds
      const totalSteps = 60;
      const stepDuration = (duration * 1000) / totalSteps;
      
      const timer = setInterval(() => {
        start += Math.ceil(end / totalSteps);
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isInView, finalValue]);

  return (
    <div ref={elementRef} className="font-serif text-4xl sm:text-5xl font-bold text-gold tracking-tighter">
      {count}
      <span>{finalSuffix}</span>
    </div>
  );
}

export default function About({ t, lang, settings, siteContent }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isContainerInView = useInView(containerRef, { once: true, amount: 0.15 });

  const customDesc1 = getContent(siteContent, 'about_description_1', lang, t.aboutP1);
  const customDesc2 = getContent(siteContent, 'about_description_2', lang, t.aboutP2);

  const statProjectsVal = getContent(siteContent, 'about_stat_projects', lang, '50+');
  const statYearsVal = getContent(siteContent, 'about_stat_years', lang, '5+');
  const statClientsVal = getContent(siteContent, 'about_stat_clients', lang, '40+');

  return (
    <section 
      id="about" 
      className="relative py-24 px-6 md:px-12 bg-navy-dark overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute right-0 top-1/3 w-[350px] h-[350px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-[400px] h-[400px] rounded-full bg-navy-light/30 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={containerRef}>
        
        {/* Animated Headline indicator */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase font-mono font-bold mb-3"
          >
            {lang === 'en' ? 'THE STUDIO' : 'الاستوديو الإبداعي'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-widest uppercase"
            data-content-key="about_title"
          >
            {getContent(siteContent, 'about_title', lang, t.aboutTitle)}
          </motion.h2>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-4" />
        </div>

        {/* Modular Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Main Context Paragraph (Glass Panel) - takes 7 columns on desktop */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'en' ? -40 : 40 }}
            animate={isContainerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-12 xl:col-span-7 glass-panel-m p-8 md:p-12 rounded-none flex flex-col justify-between border border-white/15 hover:border-gold/30 transition-colors duration-500"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div>
              <p className="text-gold text-xs font-mono uppercase tracking-widest mb-4">
                {t.aboutSub}
              </p>
              
              <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light mb-6" data-content-key="about_description_1">
                {customDesc1}
              </p>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light mb-10" data-content-key="about_description_2">
                {customDesc2}
              </p>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 text-center">
              <div>
                <StatCounter targetValue={50} valueStr={statProjectsVal} delay={0.1} />
                <p className="text-[10px] sm:text-xs tracking-wider uppercase text-white/50 mt-2 font-light" data-content-key="about_stat_label_projects">
                  {getContent(siteContent, 'about_stat_label_projects', lang, t.aboutStat1)}
                </p>
              </div>
              
              <div>
                <StatCounter targetValue={5} suffix="+" valueStr={statYearsVal} delay={0.2} />
                <p className="text-[10px] sm:text-xs tracking-wider uppercase text-white/50 mt-2 font-light" data-content-key="about_stat_label_years">
                  {getContent(siteContent, 'about_stat_label_years', lang, t.aboutStat2)}
                </p>
              </div>
              
              <div>
                <StatCounter targetValue={40} valueStr={statClientsVal} delay={0.3} />
                <p className="text-[10px] sm:text-xs tracking-wider uppercase text-white/50 mt-2 font-light" data-content-key="about_stat_label_clients">
                  {getContent(siteContent, 'about_stat_label_clients', lang, t.aboutStat3)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Philosophy Showcase (Glass Panel) - takes 5 columns on desktop */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'en' ? 40 : -40 }}
            animate={isContainerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="lg:col-span-12 xl:col-span-5 glass-panel p-8 md:p-12 rounded-none flex flex-col justify-center items-center text-center relative overflow-hidden group border border-white/15 hover:border-gold/30 transition-all duration-500 gold-glow-hover"
          >
            {/* Fine architectural sketch design absolute asset */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,168,76,0.06),transparent_60%)] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 border border-gold/30 flex items-center justify-center bg-gold/5 mb-8 group-hover:scale-110 transition-transform duration-500">
                <Landmark className="w-8 h-8 text-gold" />
              </div>

              <h4 className="text-[11px] uppercase tracking-[0.25em] text-gold font-mono mb-4">
                {t.aboutPhilosophy}
              </h4>

              <blockquote className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-wide leading-snug max-w-sm">
                {t.aboutPhQuote}
              </blockquote>

              <div className="w-8 h-0.5 bg-gold/40 mt-8 mb-4" />
              
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-mono">
                {lang === 'en' ? 'Bespoke Design Ethos' : 'اتقان التصميم السوري الفاخر'}
              </p>
            </div>
          </motion.div>

        </div>
        
      </div>
    </section>
  );
}
