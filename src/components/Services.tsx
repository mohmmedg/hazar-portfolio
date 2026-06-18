/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import * as Icons from 'lucide-react';
import { Translation, SiteContent, ServiceCMS, getContent } from '../types';

interface ServicesProps {
  t: Translation;
  lang: 'en' | 'ar';
  siteContent?: SiteContent[];
  services?: ServiceCMS[];
}

export default function Services({ t, lang, siteContent, services }: ServicesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef, { once: true, amount: 0.12 });

  // Map icon strings to Lucide components
  const getIconComponent = (iconName: string) => {
    const Component = (Icons as any)[iconName];
    return Component || Icons.Compass;
  };

  // Compile active and sorted services cards
  const activeServices = services && services.length > 0
    ? services.filter(s => s.active).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    : [];

  return (
    <section 
      id="services" 
      className="relative py-24 px-6 md:px-12 bg-radial-[circle_at_bottom_left,_var(--color-navy-light)_0%,_var(--color-navy-dark)_70%] overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute left-1/4 top-1/4 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={scrollRef}>
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase font-mono font-bold mb-3"
          >
            {lang === 'en' ? 'OUR CAPABILITIES' : 'قدراتنا الفنية'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-widest uppercase"
            data-content-key="services_title"
          >
            {getContent(siteContent, 'services_title', lang, t.servicesTitle)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="text-xs sm:text-sm tracking-wide text-white/50 max-w-xl mx-auto mt-4 font-sans font-light leading-relaxed animate-pulse"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            data-content-key="services_subtitle"
          >
            {getContent(siteContent, 'services_subtitle', lang, t.servicesSubtitle)}
          </motion.p>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-5" />
        </div>

        {/* Dynamic Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeServices.map((service, index) => {
            const IconComponent = getIconComponent(service.icon || 'Compass');
            const dynamicTitle = lang === 'ar' ? service.title_ar : service.title_en;
            const dynamicDesc = lang === 'ar' ? service.description_ar : service.description_en;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.12 }}
                className="group relative glass-panel p-8 rounded-none flex flex-col justify-between items-start text-left hover:scale-[1.03] hover:bg-white/5 transition-all duration-500 border border-white/10 hover:border-gold/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(201,168,76,0.15)] flex-1 min-h-[300px]"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                {/* Decorative gold hover flare */}
                <div className="absolute right-6 top-6 w-12 h-12 bg-gold/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex flex-col items-start w-full">
                  {/* Icon Wrapper */}
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center bg-white/5 mb-8 text-gold group-hover:bg-gold/10 group-hover:border-gold/40 group-hover:scale-110 transition-all duration-500">
                    <IconComponent className="w-6 h-6 text-gold" />
                  </div>

                  {/* Title */}
                  <h3 className={`font-serif text-lg sm:text-xl font-semibold text-white tracking-wide mb-4 ${lang === 'ar' ? 'text-right w-full' : 'text-left'}`}>
                    {dynamicTitle}
                  </h3>

                  {/* Description */}
                  <p className={`text-white/60 text-xs sm:text-sm leading-relaxed font-light ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    {dynamicDesc}
                  </p>
                </div>

                {/* Card Corner Subtle Accent */}
                <div className={`absolute bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} w-5 h-5 border-b border-r border-gold/0 group-hover:border-gold/30 transition-all duration-500 pointer-events-none`} />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
