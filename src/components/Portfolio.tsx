/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { Translation, PortfolioItem, PORTFOLIO_DATA, Tag, ProjectTag } from '../types';
import { AdminProject } from './AdminPanel';

interface PortfolioProps {
  t: Translation;
  lang: 'en' | 'ar';
  projects: AdminProject[];
  tags: Tag[];
  projectTags: ProjectTag[];
}

type FilterCategory = string;

export default function Portfolio({ t, lang, projects, tags, projectTags }: PortfolioProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(null);
  const [subImageIdx, setSubImageIdx] = useState<number>(0); 
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef, { once: true, amount: 0.08 });

  // Map dynamic projects prop with precise priority sorting
  const sortedProjects = React.useMemo(() => {
    return [...projects]
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [projects]);

  // Map category strings to standard query keys
  const getMappedCategory = (cat: string): string => {
    const c = cat.toLowerCase();
    if (c.includes('living')) return 'living';
    if (c.includes('dining')) return 'dining';
    if (c.includes('bedroom')) return 'bedroom';
    if (c.includes('kitchen')) return 'kitchen';
    if (c.includes('entrance') || c.includes('exterior') || c.includes('facade')) return 'entrance';
    return c;
  };

  // Get display translations for categories
  const getCategoryLabel = (cat: string): string => {
    const key = getMappedCategory(cat);
    if (key === 'living') return t.portfolioFilterLiving;
    if (key === 'dining') return t.portfolioFilterDining;
    if (key === 'bedroom') return t.portfolioFilterBedroom;
    if (key === 'kitchen') return t.portfolioFilterKitchen;
    if (key === 'entrance') return t.portfolioFilterEntrance;
    if (key === 'exterior') return lang === 'en' ? 'Exterior' : 'التصميم الخارجي';
    return cat;
  };

  // Helpers to resolve differences between dynamic and placeholder safely
  const getProjectTitle = (item: any): string => {
    if (item.name) return item.name;
    return lang === 'en' ? item.titleEN : item.titleAR;
  };

  const getProjectDesc = (item: any): string => {
    if (item.description !== undefined) return item.description;
    return lang === 'en' ? item.descEN : item.descAR;
  };

  const getProjectImages = (item: any): string[] => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    if (item.image) {
      return [item.image];
    }
    return [];
  };

  // Dynamic category calculations based on existing active items
  const activeCategories = Array.from(new Set(sortedProjects.map(p => p.category as string)));
  
  const dynamicFilters = [
    { key: 'all', label: t.portfolioFilterAll },
    ...activeCategories.map((cat: string) => ({
      key: getMappedCategory(cat),
      label: getCategoryLabel(cat)
    }))
  ];

  // De-duplicate filters matching same keys
  const seenKeys = new Set<string>();
  const filters = dynamicFilters.filter(filt => {
    if (seenKeys.has(filt.key)) return false;
    seenKeys.add(filt.key);
    return true;
  });

  // Filter projects list by BOTH category AND tag filters in conjunction
  const filteredData = React.useMemo(() => {
    return sortedProjects.filter(item => {
      // 1. Check category filter matching
      const matchesCategory = activeFilter === 'all' || getMappedCategory(item.category) === activeFilter;
      
      // 2. Check tag filter matching
      let matchesTag = true;
      if (activeTagFilter !== null) {
        matchesTag = projectTags.some(pt => pt.project_id === item.id && pt.tag_id === activeTagFilter);
      }
      
      return matchesCategory && matchesTag;
    });
  }, [sortedProjects, activeFilter, activeTagFilter, projectTags]);

  // Lightbox index handlers
  const openLightbox = (id: string) => {
    const idx = filteredData.findIndex(item => item.id === id);
    if (idx !== -1) {
      setSelectedItemIdx(idx);
      setSubImageIdx(0); // Reset sub image carousel
    }
  };

  const closeLightbox = () => {
    setSelectedItemIdx(null);
  };

  // Navigate between project records
  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIdx !== null) {
      const nextIdx = (selectedItemIdx + 1) % filteredData.length;
      setSelectedItemIdx(nextIdx);
      setSubImageIdx(0);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItemIdx !== null) {
      const prevIdx = (selectedItemIdx - 1 + filteredData.length) % filteredData.length;
      setSelectedItemIdx(prevIdx);
      setSubImageIdx(0);
    }
  };

  const currentItem = selectedItemIdx !== null ? filteredData[selectedItemIdx] : null;
  const currentItemImages = currentItem ? getProjectImages(currentItem) : [];

  return (
    <section 
      id="portfolio" 
      className="relative py-24 px-6 md:px-12 bg-navy-dark overflow-hidden"
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute right-1/4 top-1/3 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[150px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-1/4 w-[500px] h-[500px] rounded-full bg-navy-light/20 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={scrollRef}>
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase font-mono font-bold mb-3"
          >
            {lang === 'en' ? 'SELECTED REVELATIONS' : 'تحف فنية مختارة'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-widest uppercase"
          >
            {t.portfolioTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="text-xs sm:text-sm tracking-wide text-white/50 max-w-xl mx-auto mt-4 font-sans font-light leading-relaxed"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.portfolioSubtitle}
          </motion.p>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-5" />
        </div>

        {/* Categories Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2.5 rounded-none text-xs tracking-wider uppercase transition-all duration-300 font-medium clickable-cursor ${
                activeFilter === filter.key
                  ? 'bg-gold text-navy-dark shadow-[0_4px_15px_rgba(201,168,76,0.4)] border-transparent scale-105'
                  : 'glass-panel text-white/80 border-white/15 hover:border-gold hover:text-white hover:bg-gold/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Tags Filter Row (Available only if tags are registered) */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-2xl mx-auto border-t border-white/5 pt-5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-mono font-bold mr-2">
              {lang === 'en' ? 'TAGS:' : 'الوسوم:'}
            </span>
            <button
              onClick={() => setActiveTagFilter(null)}
              className={`px-3 py-1 text-[10px] tracking-wider uppercase transition-all duration-300 font-medium border ${
                activeTagFilter === null
                  ? 'border-gold bg-gold/10 text-gold font-bold'
                  : 'border-white/10 bg-white/3 text-white/60 hover:text-gold hover:border-gold/30'
              }`}
            >
              {lang === 'en' ? 'ALL TAGS' : 'الكل'}
            </button>
            {tags.map((tag) => {
              const isSelected = activeTagFilter === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveTagFilter(isSelected ? null : tag.id)}
                  className={`px-3 py-1 text-[10px] tracking-wider uppercase transition-all duration-300 font-medium border flex items-center gap-1.5`}
                  style={{ 
                    borderColor: isSelected ? tag.color : 'rgba(255,255,255,0.1)',
                    backgroundColor: isSelected ? tag.color + '15' : 'rgba(255,255,255,0.03)',
                    color: isSelected ? tag.color : 'rgba(255,255,255,0.6)'
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span>{lang === 'ar' ? tag.name_ar : tag.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Gallery Grid (3 columns on desktop, responsive) */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredData.map((item) => {
              const imagesList = getProjectImages(item);
              const mainBgImage = imagesList[0] || '';
              const titleResolved = getProjectTitle(item);
              const descResolved = getProjectDesc(item);

              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="group relative h-[360px] md:h-[400px] rounded-none overflow-hidden glass-panel border border-white/15 cursor-pointer gold-glow-hover flex flex-col justify-end"
                  onClick={() => openLightbox(item.id)}
                >
                  {/* Background Asset Image with scale Zoom */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url('${mainBgImage}')` }}
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Micro glow overlay */}
                  <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 rounded-none transition-all duration-500 pointer-events-none" />

                  {/* Floating Category Tag */}
                  <div className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-10`}>
                    <span className="glass-panel text-[9px] font-mono tracking-widest text-gold py-1.5 px-3 rounded-none uppercase border border-gold/20">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  {item.featured && (
                    <div className={`absolute top-6 ${lang === 'ar' ? 'right-6' : 'left-6'} z-10`}>
                      <span className="bg-gold text-navy-dark text-[8PX] font-sans font-extrabold tracking-widest py-1 px-2.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-navy-dark fill-current" />
                        <span>FEATURED</span>
                      </span>
                    </div>
                  )}

                  {/* Animated content sliding on hover */}
                  <div className="relative z-10 p-8 w-full flex flex-col justify-end" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <p className="text-[9px] font-mono tracking-[0.2em] text-gold uppercase mb-1">
                      {t.portfolioCategoryLabel}
                    </p>
                    
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide leading-tight group-hover:text-gold transition-colors duration-300">
                      {titleResolved}
                    </h3>

                    <p className="text-white/60 text-xs line-clamp-2 leading-relaxed font-light mb-4 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {descResolved}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-gold uppercase tracking-widest font-mono font-bold group-hover:translate-x-1.5 transition-transform duration-300">
                      <Eye className="w-4 h-4" />
                      <span>{t.portfolioView}</span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Luxury Lightbox Overlay Rendering */}
      <AnimatePresence>
        {currentItem !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 glass-panel-strong bg-navy-dark/95 backdrop-blur-[30px] flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-none border border-white/15 bg-white/5 hover:bg-white/10 hover:border-gold text-white hover:text-gold transition-all duration-300 z-50 clickable-cursor"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left navigation arrow for records */}
            <button
              onClick={showPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-none border border-white/10 bg-white/5 hover:bg-gold/15 text-white hover:text-gold transition-all duration-300 z-50 hidden md:block clickable-cursor"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right navigation arrow for records */}
            <button
              onClick={showNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-none border border-white/10 bg-white/5 hover:bg-gold/15 text-white hover:text-gold transition-all duration-300 z-50 hidden md:block clickable-cursor"
              aria-label="Next project"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image & details central wrapper */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-5xl w-full max-h-[90vh] md:max-h-[85vh] rounded-none overflow-hidden glass-panel border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.85)] flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Column: Massive Image Frame with SUB-IMAGE carousel navigation */}
              <div className="md:w-3/5 min-h-[300px] md:min-h-[500px] max-h-[45vh] md:max-h-[85vh] relative bg-black/45 flex flex-col justify-between">
                <img
                  src={currentItemImages[subImageIdx] || currentItemImages[0]}
                  alt={getProjectTitle(currentItem)}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Sub image left/right arrows overlay */}
                {currentItemImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubImageIdx(prev => (prev - 1 + currentItemImages.length) % currentItemImages.length);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 border border-white/20 bg-black/40 hover:bg-gold hover:text-navy-dark text-white transition-all duration-300 z-20"
                      aria-label="Previous sub-image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubImageIdx(prev => (prev + 1) % currentItemImages.length);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 border border-white/20 bg-black/40 hover:bg-gold hover:text-navy-dark text-white transition-all duration-300 z-20"
                      aria-label="Next sub-image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Small indicator for active sub-images */}
                {currentItemImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {currentItemImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubImageIdx(idx);
                        }}
                        className={`h-1.5 transition-all duration-300 ${
                          idx === subImageIdx ? 'bg-gold w-6' : 'bg-white/40 hover:bg-white/70 w-2'
                        }`}
                        aria-label={`Show image slot ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Premium Text Info Frame */}
              <div 
                className="md:w-2/5 p-8 md:p-12 flex flex-col justify-between bg-navy-dark/95 border-t md:border-t-0 md:border-l border-white/10"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none border border-gold/40 bg-gold/5 text-[9px] uppercase tracking-widest text-gold font-mono mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span>{getCategoryLabel(currentItem.category)}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-wide leading-tight">
                    {getProjectTitle(currentItem)}
                  </h3>

                  <div className="w-12 h-px bg-gold/50 my-4" />

                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-light mb-8 max-h-[200px] overflow-y-auto">
                    {getProjectDesc(currentItem)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/15">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono">Design Studio</span>
                    <span className="text-[11px] font-semibold text-gold tracking-wider">HAZAR ALGHANEM</span>
                  </div>
                  
                  {/* Small mobile quick project navs */}
                  <div className="flex md:hidden items-center gap-2">
                    <button
                      onClick={showPrev}
                      className="p-1 px-2.5 rounded-none border border-white/10 bg-white/5 text-white active:bg-gold/10 hover:text-gold"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={showNext}
                      className="p-1 px-2.5 rounded-none border border-white/10 bg-white/5 text-white active:bg-gold/10 hover:text-gold"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
