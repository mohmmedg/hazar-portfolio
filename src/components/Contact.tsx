/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { 
  Send, 
  Instagram, 
  PhoneCall, 
  CheckCircle, 
  User, 
  MessageCircle 
} from 'lucide-react';
import { Translation, ContactSettings, SiteContent, getContent } from '../types';

const sanitize = (str: string): string => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

interface ContactProps {
  t: Translation;
  lang: 'en' | 'ar';
  settings?: ContactSettings;
  siteContent?: SiteContent[];
}

export default function Contact({ t, lang, settings, siteContent }: ContactProps) {
  const dynamicWhatsappStr = getContent(siteContent, 'contact_whatsapp', lang, settings?.whatsapp_number || '+963955111222');
  const dynamicInstaStr = getContent(siteContent, 'contact_instagram', lang, settings?.instagram_url || 'https://instagram.com/hazar_alghanim');
  const dynamicEmailStr = getContent(siteContent, 'contact_email', lang, settings?.email || 'hazar@example.com');
  const dynamicPhoneStr = getContent(siteContent, 'contact_phone', lang, settings?.phone || '+963 955 111 222');
  const dynamicLocationStr = getContent(siteContent, 'contact_location', lang, lang === 'ar' ? (settings?.location_ar || t.contactLocVal) : (settings?.location || t.contactLocVal));

  const instagramUrl = dynamicInstaStr;
  const getInstaHandle = () => {
    try {
      const parts = instagramUrl.replace(/\/$/, '').split('/');
      const handle = parts[parts.length - 1];
      return handle ? `@${handle}` : '@hazar_alghanim';
    } catch {
      return '@hazar_alghanim';
    }
  };
  const cleanWhatsApp = dynamicWhatsappStr.replace(/[^0-9]/g, '');
  const whatsappLink = `https://wa.me/${cleanWhatsApp || '963955111222'}`;
  const displayPhone = dynamicPhoneStr;
  const displayLocation = dynamicLocationStr;

  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef, { once: true, amount: 0.12 });

  // Form states
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedName = sanitize(name.trim());
    const sanitizedContactInfo = sanitize(contactInfo.trim());
    const sanitizedMessage = sanitize(message.trim());
    if (!sanitizedName || !sanitizedContactInfo || !sanitizedMessage) return;

    setIsSubmitting(true);

    // Simulate luxury API response / submit processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName('');
      setContactInfo('');
      setMessage('');

      // Auto dismiss success toast after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="relative py-24 px-6 md:px-12 bg-navy-dark overflow-hidden"
    >
      {/* Background Lights */}
      <div className="absolute left-10 bottom-1/4 w-[350px] h-[350px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-10 top-1/3 w-[450px] h-[450px] rounded-full bg-navy-light/20 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto" ref={scrollRef}>
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-gold uppercase font-mono font-bold mb-3"
          >
            {lang === 'en' ? 'COMMISSIONS & INQUIRIES' : 'حجز الاستشارات والمشاريع'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif font-bold text-3xl sm:text-5xl text-white tracking-widest uppercase"
            data-content-key="contact_title"
          >
            {getContent(siteContent, 'contact_title', lang, t.contactTitle)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.0, delay: 0.3 }}
            className="text-xs sm:text-sm tracking-wide text-white/50 max-w-xl mx-auto mt-4 font-sans font-light leading-relaxed animate-pulse"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            data-content-key="contact_subtitle"
          >
            {getContent(siteContent, 'contact_subtitle', lang, t.contactSubtitle)}
          </motion.p>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-5" />
        </div>

        {/* Symmetric Single-Column Layout */}
        <div className="space-y-12 max-w-2xl mx-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          
          {/* Quick Connect / Social channels connect card - Centered above the form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="glass-panel p-6 sm:p-8 rounded-none border border-white/15 hover:border-gold/30 text-center transition-colors duration-500"
          >
            <h3 className="font-serif text-sm sm:text-base font-bold text-white mb-4 uppercase tracking-wider">
              {t.contactSocialTitle}
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 border border-white/15 bg-white/5 hover:border-gold/85 bg-white/5 hover:bg-gold/10 text-white hover:text-gold text-xs uppercase tracking-widest font-semibold transition-all duration-300 flex items-center justify-center gap-2 clickable-cursor"
              >
                <Instagram className="w-4 h-4 text-gold" />
                <span>{getInstaHandle()}</span>
              </a>

              {/* WhatsApp Direct Gateway */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 border border-gold bg-gold/10 hover:bg-gold/23 text-gold hover:text-white text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 clickable-cursor hover:shadow-[0_0_15px_rgba(201,168,76,0.3)]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{displayPhone}</span>
              </a>
            </div>
          </motion.div>

          {/* Exquisite Interactive Glass Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative"
          >
            {/* Success Toast / Panel */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 z-20 glass-panel-strong border border-gold/40 rounded-none p-8 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <CheckCircle className="w-16 h-16 text-gold animate-bounce" />
                  <h3 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
                    {lang === 'en' ? 'MESSAGE SECURED' : 'تم استلام الرسالة بنجاح'}
                  </h3>
                  <p className="text-white/80 text-sm max-w-sm leading-relaxed font-light">
                    {t.contactSuccessMsg}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2 border border-gold bg-gold/10 text-gold text-xs uppercase tracking-widest font-semibold hover:bg-gold/20"
                  >
                    {lang === 'en' ? 'Close Alert' : 'إغلاق التنبيه'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Form Fields */}
            <form 
              onSubmit={handleSubmit}
              className="glass-panel-m p-8 sm:p-12 rounded-none border border-white/15 space-y-6"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/50 block">
                  {t.contactNameLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full py-4 ${lang === 'en' ? 'pl-11 pr-5' : 'pr-11 pl-5'} rounded-none bg-white/5 text-sm text-white placeholder-white/30 border border-white/10 hover:border-white/20 focus:border-gold outline-none transition-all duration-300 font-sans`}
                    placeholder={lang === 'en' ? 'e.g. Tareq Al-Husseini' : 'مثال: السيد طارق الحسيني'}
                  />
                </div>
              </div>

              {/* Phone / WhatsApp Field */}
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/50 block">
                  {t.contactPhoneLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30 font-mono text-sm leading-none">
                    +
                  </div>
                  <input
                    type="tel"
                    required
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className={`w-full py-4 ${lang === 'en' ? 'pl-11 pr-5' : 'pr-11 pl-5'} rounded-none bg-white/5 text-sm text-white placeholder-white/30 border border-white/10 hover:border-white/20 focus:border-gold outline-none transition-all duration-300 font-sans`}
                    placeholder={lang === 'en' ? 'e.g. 963 955 111 222' : 'مثال: 00963955111222'}
                  />
                </div>
              </div>

              {/* Message Scope Textarea */}
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/50 block">
                  {t.contactMsgLabel}
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-white/30">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full py-4 ${lang === 'en' ? 'pl-11 pr-5' : 'pr-11 pl-5'} rounded-none bg-white/5 text-sm text-white placeholder-white/30 border border-white/10 hover:border-white/20 focus:border-gold outline-none transition-all duration-300 font-sans resize-none`}
                    placeholder={lang === 'en' ? 'Describe your villa, penthouse, facade or boutique scope...' : 'تفضل بسرد نطاق الفيلا الفاخرة، أو تصميم الواجهات، أو مشروعك المعماري...'}
                  />
                </div>
              </div>

              {/* Gold Gradient Premium Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative py-4 rounded-none overflow-hidden bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark font-sans text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 select-none clickable-cursor"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-navy-dark" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t.contactSending}</span>
                  </>
                ) : (
                  <>
                    <span>{t.contactSubmitBtn}</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
