/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Translation, ContactSettings, SiteContent } from '../types';
import Logo from './Logo';

interface NavbarProps {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  t: Translation;
  settings?: ContactSettings;
  siteContent?: SiteContent[];
}

export default function Navbar({ lang, setLang, t, settings, siteContent }: NavbarProps) {
  const cleanWhatsApp = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '963955111222';
  const logoImageUrl = siteContent?.find(i => i.key === 'brand_logo_image')?.value_en || '';
  const whatsappLink = `https://wa.me/${cleanWhatsApp}`;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll height to apply stronger glass filter
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.navHome, href: '#home' },
    { label: t.navAbout, href: '#about' },
    { label: t.navServices, href: '#services' },
    { label: t.navPortfolio, href: '#portfolio' },
    { label: t.navTestimonials, href: '#testimonials' },
    { label: t.navContact, href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of navbar
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

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-4 glass-panel-strong border-b border-white/10' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
        id="luxury-header"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group select-none text-white hover:text-gold transition-colors duration-300"
          >
            <div className="w-16 h-16 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <Logo variant="emblem" className="w-12 h-12 text-gold"  />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.25em] text-sm md:text-base font-bold leading-none">
                HAZAR ALGHANEM
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-gold font-mono whitespace-nowrap mt-1">
                Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative text-xs tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors duration-300 py-1 font-sans font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Right (Language + WhatsApp CTA) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selection */}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 border border-white/15 bg-white/5 hover:border-gold hover:bg-gold/10 text-xs tracking-wider flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Quick Contact CTA */}
            <a
              href={whatsappLink} // Premium placeholder WhatsApp link
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 border border-gold/70 bg-gold/5 hover:bg-gold/15 text-gold text-xs uppercase tracking-wider font-semibold hover:shadow-[0_0_15px_rgba(201,168,76,0.35)] transition-all duration-300 flex items-center gap-1.5"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{lang === 'en' ? 'Direct Speak' : 'اتصال مباشر'}</span>
            </a>
          </div>

          {/* Mobile Actions Overlay Trigger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 border border-white/10 bg-white/5 text-[10px] tracking-wider flex items-center gap-1.5 text-white/90"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-gold" />
              <span>{lang === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 border border-white/15 bg-white/5 text-white hover:text-gold transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-40 lg:hidden pt-24 px-6 pb-8 glass-panel-strong flex flex-col justify-between"
          >
            <nav className="flex flex-col gap-6 mt-6 items-center">
              {navItems.map((item, index) => (
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-lg tracking-widest uppercase text-white/80 hover:text-gold hover:scale-105 transition-all duration-300 font-serif font-semibold"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 text-center items-center">
              <div className="w-16 h-px bg-white/10 my-2" />
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                {lang === 'ar' ? (settings?.location_ar || 'حلب، سوريا') : (settings?.location || 'Aleppo, Syria')}
              </p>
              
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full max-w-xs py-3 border border-gold bg-gold/10 text-gold text-xs uppercase tracking-widest font-bold hover:bg-gold/25 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(201,168,76,0.2)]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{lang === 'en' ? 'Direct Speak' : 'اتصال مباشر عبر واتساب'}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
