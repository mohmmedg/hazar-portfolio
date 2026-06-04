/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Translation, SiteContent, TestimonialCMS, getContent } from '../types';

interface TestimonialsProps {
  t: Translation;
  lang: 'en' | 'ar';
  siteContent?: SiteContent[];
  testimonials?: TestimonialCMS[];
}

export default function Testimonials({ t, lang, siteContent, testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef, { once: true, amount: 0.15 });

  // Compile active and sorted testimonials
  const activeTestimonials = testimonials && testimonials.length > 0
    ? testimonials.filter(item => item.active).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    : [];

  // Auto-rotating timer for carousel
  useEffect(() => {
    if (activeTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prevIdx) => (prevIdx + 1) % activeTestimonials.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(timer);
  }, [activeTestimonials.length]);

  const currentTestimonial = activeTestimonials[activeIndex];

  return (
    <section 
      id="testimonials" 
      className="relative py-24 px-6 md:px-12 bg-radial-[circle_at_top_right,_var(--color-navy-light)_0%,_var(--color-navy-dark)_70%] overflow-hidden"
    >
      {/* Background Decorative Blur Orbs */}
      <div className="absolute right-10 top-1/4 w-[350px] h-[350px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-1/3 bottom-1/4 w-[400px] h-[400px] rounded-full bg-navy-light/30 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto" ref={scrollRef}>
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase font-mono font-bold mb-3"
          >
            {lang === 'en' ? 'VERIFIED ACCLAIM' : 'شهادات حقيقية نفخر بها'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-widest uppercase"
            data-content-key="testimonials_title"
          >
            {getContent(siteContent, 'testimonials_title', lang, t.testimonialsTitle)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="text-xs sm:text-sm tracking-wide text-white/50 max-w-xl mx-auto mt-4 font-sans font-light leading-relaxed animate-pulse"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            data-content-key="testimonials_subtitle"
          >
            {getContent(siteContent, 'testimonials_subtitle', lang, t.testimonialSubtitle)}
          </motion.p>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-5" />
        </div>

        {/* Carousel Outer Container */}
        <div className="relative">
          {/* Quote Mark Floating Accents */}
          <div className={`absolute -top-10 ${lang === 'ar' ? 'right-4' : 'left-4'} opacity-10 text-gold z-0 pointer-events-none hidden sm:block`}>
            <Quote className="w-32 h-32 transform rotate-180" />
          </div>

          <div className="relative z-10 glass-panel-m border border-white/15 rounded-none p-8 sm:p-16 text-center hover:shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_30px_rgba(201,168,76,0.1)] transition-all duration-500">
            {currentTestimonial ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="flex flex-col items-center"
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 mb-8">
                    {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Main Quote Content */}
                  <p className="font-serif text-lg sm:text-2xl md:text-3xl text-white font-medium tracking-wide leading-relaxed max-w-3xl mb-8 select-none">
                    “{lang === 'ar' ? currentTestimonial.text_ar : currentTestimonial.text_en}”
                  </p>

                  {/* Separator */}
                  <div className="w-8 h-px bg-gold/40 mb-6" />

                  {/* Client Signature */}
                  <h4 className="text-sm sm:text-base font-bold tracking-widest text-gold uppercase mb-1">
                    {lang === 'ar' ? currentTestimonial.client_name_ar : currentTestimonial.client_name_en}
                  </h4>
                  
                  <p className="text-[10px] sm:text-xs text-white/40 tracking-widest uppercase font-mono">
                    {lang === 'en' ? 'Bespoke Client' : 'عميل مميز لدى الاستوديو'}
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-white/40 tracking-widest uppercase font-mono py-12">
                {lang === 'en' ? 'No testimonials available' : 'لا توجد شهادات متوفرة حالياً'}
              </div>
            )}

            {/* Quick Carousel Indicators */}
            {activeTestimonials.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                {activeTestimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-0.5 transition-all duration-500 clickable-cursor ${
                      activeIndex === idx ? 'bg-gold w-10 shadow-[0_0_8px_rgba(201,168,76,0.8)]' : 'bg-white/25 hover:bg-white/50 w-6'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
