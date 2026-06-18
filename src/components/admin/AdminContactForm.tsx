import React from 'react';
import { motion } from 'motion/react';

interface AdminContactFormProps {
  handleContactSubmit: (e: React.FormEvent) => void;
  contactWhatsapp: string;
  setContactWhatsapp: (val: string) => void;
  contactInstagram: string;
  setContactInstagram: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  contactLocation: string;
  setContactLocation: (val: string) => void;
  contactLocationAr: string;
  setContactLocationAr: (val: string) => void;
  contactTagline: string;
  setContactTagline: (val: string) => void;
  contactTaglineAr: string;
  setContactTaglineAr: (val: string) => void;
  contactStudioDesc: string;
  setContactStudioDesc: (val: string) => void;
  contactStudioDescAr: string;
  setContactStudioDescAr: (val: string) => void;
}

export default function AdminContactForm({
  handleContactSubmit,
  contactWhatsapp,
  setContactWhatsapp,
  contactInstagram,
  setContactInstagram,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  contactLocation,
  setContactLocation,
  contactLocationAr,
  setContactLocationAr,
  contactTagline,
  setContactTagline,
  contactTaglineAr,
  setContactTaglineAr,
  contactStudioDesc,
  setContactStudioDesc,
  contactStudioDescAr,
  setContactStudioDescAr
}: AdminContactFormProps) {
  return (
    <motion.div
      key="contact_settings"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-white uppercase mb-1">
          Contact Information Manager
        </h2>
        <p className="text-xs text-white/50 tracking-wider">
          Fine-tune WhatsApp telephone routes, studio addresses, Instagram tags, and about page narrative copies
        </p>
        <div className="w-16 h-px bg-gold/50 mt-4" />
      </div>

      <form onSubmit={handleContactSubmit} className="glass-panel p-8 sm:p-12 border border-white/15 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel: Direct channels */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
              [ DIRECT CONNECTIVITY & MEDIA LINKS ]
            </h3>

            {/* WhatsApp Direct */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                WhatsApp Line (International Format) <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none transition-all duration-300"
                placeholder="e.g. +963955111222"
              />
            </div>

            {/* Instagram Direct */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Instagram URL Link <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="url"
                required
                value={contactInstagram}
                onChange={(e) => setContactInstagram(e.target.value)}
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none transition-all duration-300"
                placeholder="e.g. https://instagram.com/hazar.alghanem"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Atelier Primary Email <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none font-sans"
                placeholder="hazar@example.com"
              />
            </div>

            {/* Phone Address */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Reservation Desk Phone Call <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none font-mono"
                placeholder="+963955111222"
              />
            </div>
          </div>

          {/* Right Panel: Localization details */}
          <div className="space-y-6">
            <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
              [ PHYSICAL ADDRESSES & HERITAGE LOCATIONS ]
            </h3>

            {/* Physical Location EN */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Physical Address (English) <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={contactLocation}
                onChange={(e) => setContactLocation(e.target.value)}
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none font-sans"
                placeholder="Aleppo Heritage Area, Syria"
              />
            </div>

            {/* Physical Location AR */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Physical Address (Arabic) <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={contactLocationAr}
                onChange={(e) => setContactLocationAr(e.target.value)}
                dir="rtl"
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none font-sans h-12"
                placeholder="المرسم الرئيسي الفني، حلب، سوريا"
              />
            </div>
          </div>
        </div>

        {/* Brand Tagline Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
          <div className="space-y-6">
            <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
              [ HERO SECTION EDITABLE BRAND SLOGANS ]
            </h3>

            {/* Tagline EN */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Hero Slogan Tagline (English) <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={contactTagline}
                onChange={(e) => setContactTagline(e.target.value)}
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none font-sans"
                placeholder="Transforming ideas into luxurious realities ✦"
              />
            </div>

            {/* Tagline AR */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Hero Slogan Tagline (Arabic) <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={contactTaglineAr}
                onChange={(e) => setContactTaglineAr(e.target.value)}
                dir="rtl"
                className="w-full py-3.5 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none font-sans"
                placeholder="نحول أفكارك إلى واقع فاخر ✦"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
              [ ABOUT PAGE DETAILED BIOGRAPHY COPY ]
            </h3>

            {/* Studio Desc EN */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Studio Story Description (English) <span className="text-gold font-bold">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={contactStudioDesc}
                onChange={(e) => setContactStudioDesc(e.target.value)}
                className="w-full py-3 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none resize-none font-sans"
                placeholder="English brand biography..."
              />
            </div>

            {/* Studio Desc AR */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
                Studio Story Description (Arabic) <span className="text-gold font-bold">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={contactStudioDescAr}
                onChange={(e) => setContactStudioDescAr(e.target.value)}
                dir="rtl"
                className="w-full py-3 px-4 rounded-none bg-white/5 text-sm text-white border border-white/10 focus:border-gold outline-none resize-none font-sans"
                placeholder="السيرة المهنية للعلامة التجارية..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark font-sans text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] select-none cursor-pointer"
          >
            Save Configuration ✓
          </button>
        </div>
      </form>
    </motion.div>
  );
}
