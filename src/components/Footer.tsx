/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Instagram, Phone } from 'lucide-react';
import { Translation, ContactSettings, SiteContent, getContent } from '../types';
import Logo from './Logo';

interface FooterProps {
  t: Translation;
  lang: 'en' | 'ar';
  settings?: ContactSettings;
  siteContent?: SiteContent[];
}

export default function Footer({ t, lang, settings, siteContent }: FooterProps) {
  const logoImageUrl = siteContent?.find(i => i.key === 'brand_logo_image')?.value_en || '';
  
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const dynamicLocation = getContent(siteContent, 'contact_location', lang, lang === 'en' ? (settings?.location || 'Aleppo Heritage Area, Syria') : (settings?.location_ar || 'حلب، سوريا'));
  const dynamicInstagram = getContent(siteContent, 'contact_instagram', lang, settings?.instagram_url || 'https://instagram.com/hazar_alghanim');
  const dynamicWhatsapp = getContent(siteContent, 'contact_whatsapp', lang, settings?.whatsapp_number || '+963955111222');
  const cleanWhatsApp = dynamicWhatsapp.replace(/[^0-9]/g, '');

  return (
    <footer 
      className="relative bg-navy-dark pt-24 md:pt-28 pb-12 px-6 md:px-12 border-t border-gold/20"
      id="luxury-footer"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Monogram / Signature */}
        <a
          href="#home"
          onClick={handleScrollToTop}
          className="flex flex-col items-center mt-8 mb-8 group select-none hover:scale-[1.02] transition-transform duration-300 clickable-cursor"
        >
          <div className="relative w-48 h-48 flex items-center justify-center overflow-hidden rounded-full border border-gold/30 bg-[#0a0e27] shadow-[0_0_30px_rgba(201,168,76,0.2)]">
            <Logo 
              variant="full" 
              imageUrl={logoImageUrl}
              className="absolute w-[180%] h-[180%] object-cover object-center" 
              lang={lang}  
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono font-semibold mt-4" data-content-key="footer_tagline">
            {getContent(siteContent, 'footer_tagline', lang, 'Modern • Elegant • Unique')}
          </span>
        </a>

        {/* Short context address */}
        <p className="text-white/40 text-[10px] tracking-widest uppercase font-mono max-w-sm mb-8 leading-relaxed" data-content-key="contact_location">
          {dynamicLocation}
        </p>

        {/* Minimal Horizontal Social Nodes */}
        <div className="flex items-center gap-6 mb-10">
          <a
            href={dynamicInstagram}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 border border-white/10 hover:border-gold/80 bg-white/5 hover:bg-gold/10 text-white/60 hover:text-gold flex items-center justify-center transition-all duration-300 clickable-cursor"
            aria-label="Instagram Page"
            data-content-key="contact_instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <a
            href={`https://wa.me/${cleanWhatsApp || '963955111222'}`}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 border border-white/10 hover:border-gold/80 bg-white/5 hover:bg-gold/10 text-white/60 hover:text-gold flex items-center justify-center transition-all duration-300 clickable-cursor"
            aria-label="WhatsApp Channel"
            data-content-key="contact_whatsapp"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Fine legal spacer */}
        <div className="w-12 h-px bg-white/10 mb-8" />

        {/* Copyright notice */}
        <p className="text-[10px] sm:text-xs text-white/40 tracking-wider font-light" data-content-key="footer_copyright">
          {getContent(siteContent, 'footer_copyright', lang, t.footerRights)}
        </p>

      </div>
    </footer>
  );
}
