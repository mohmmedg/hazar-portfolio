import React from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ChevronRight, Edit, Trash2 } from 'lucide-react';

interface AdminCmsEditorProps {
  cmsSection: 'hero' | 'about' | 'services' | 'testimonials' | 'contact' | 'footer';
  setCmsSection: (sec: 'hero' | 'about' | 'services' | 'testimonials' | 'contact' | 'footer') => void;
  isPreviewEnabled: boolean;
  setIsPreviewEnabled: (val: boolean) => void;
  editingContent: any[];
  setEditingContent: React.Dispatch<React.SetStateAction<any[]>>;
  handleCmsImageUpload: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  handleSaveCmsSection: (e: React.FormEvent) => void;
  handleSaveLogo: () => Promise<void>;
  triggerToast: (type: 'success' | 'error', message: string) => void;
  services: any[];
  testimonials: any[];
  srvTitleEn: string; setSrvTitleEn: (val: string) => void;
  srvTitleAr: string; setSrvTitleAr: (val: string) => void;
  srvDescEn: string; setSrvDescEn: (val: string) => void;
  srvDescAr: string; setSrvDescAr: (val: string) => void;
  srvIcon: string; setSrvIcon: (val: string) => void;
  srvActive: boolean; setSrvActive: (val: boolean) => void;
  editingServiceId: string | null;
  handleCancelServiceEdit: () => void;
  handleSaveService: (e: React.FormEvent) => void;
  handleMoveService: (idx: number, direction: 'up' | 'down') => void;
  handleEditServiceTrigger: (srv: any) => void;
  handleDeleteService: (id: string) => void;
  tstClientEn: string; setTstClientEn: (val: string) => void;
  tstClientAr: string; setTstClientAr: (val: string) => void;
  tstTextEn: string; setTstTextEn: (val: string) => void;
  tstTextAr: string; setTstTextAr: (val: string) => void;
  tstRating: number; setTstRating: (val: number) => void;
  tstActive: boolean; setTstActive: (val: boolean) => void;
  editingTestimonialId: string | null;
  handleCancelTestimonialEdit: () => void;
  handleSaveTestimonial: (e: React.FormEvent) => void;
  handleMoveTestimonial: (idx: number, direction: 'up' | 'down') => void;
  handleEditTestimonialTrigger: (tst: any) => void;
  handleDeleteTestimonial: (id: string) => void;
}

// ─── KEY MAPPING: matches DEFAULT_SITE_CONTENT in App.tsx ───────────────────
const SECTION_KEY_MAPPING: Record<string, string[]> = {
  hero: [
    'hero_title',
    'hero_subtitle',
    'hero_tagline',
    'hero_cta_button',
    'hero_background_image',
  ],
  about: [
    'about_title',
    'about_description_1',
    'about_description_2',
    'about_image',
    'about_stat_projects',
    'about_stat_label_projects',
    'about_stat_years',
    'about_stat_label_years',
    'about_stat_clients',
    'about_stat_label_clients',
  ],
  services: ['services_title', 'services_subtitle'],
  testimonials: ['testimonials_title', 'testimonials_subtitle'],
  contact: [
    'contact_title',
    'contact_subtitle',
    'contact_whatsapp',
    'contact_instagram',
    'contact_email',
    'contact_phone',
    'contact_location',
  ],
  footer: ['footer_tagline', 'footer_copyright'],
};

// ─── LOGO KEY ────────────────────────────────────────────────────────────────

export default function AdminCmsEditor({
  cmsSection, setCmsSection,
  isPreviewEnabled, setIsPreviewEnabled,
  editingContent, setEditingContent,
  handleCmsImageUpload, handleSaveCmsSection,
  services, testimonials,
  srvTitleEn, setSrvTitleEn, srvTitleAr, setSrvTitleAr,
  srvDescEn, setSrvDescEn, srvDescAr, setSrvDescAr,
  srvIcon, setSrvIcon, srvActive, setSrvActive,
  editingServiceId, handleCancelServiceEdit, handleSaveService,
  handleMoveService, handleEditServiceTrigger, handleDeleteService,
  tstClientEn, setTstClientEn, tstClientAr, setTstClientAr,
  tstTextEn, setTstTextEn, tstTextAr, setTstTextAr,
  tstRating, setTstRating, tstActive, setTstActive,
  editingTestimonialId, handleCancelTestimonialEdit, handleSaveTestimonial,
  handleMoveTestimonial, handleEditTestimonialTrigger, handleDeleteTestimonial,
}: AdminCmsEditorProps) {

  const getVal = (key: string, lang: 'en' | 'ar' = 'en') =>
    editingContent.find(i => i.key === key)?.[lang === 'en' ? 'value_en' : 'value_ar'] || '';


  const filteredItems = editingContent.filter(item =>
    SECTION_KEY_MAPPING[cmsSection]?.includes(item.key)
  );

  return (
    <motion.div
      key="site_content"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-white uppercase mb-1">
            Site Content Manager (CMS)
          </h2>
          <p className="text-xs text-white/50 tracking-wider">
            Edit text, upload images, manage catalog systems, and fine-tune language outputs
          </p>
          <div className="w-16 h-px bg-gold/50 mt-4" />
        </div>
        <button
          onClick={() => setIsPreviewEnabled(!isPreviewEnabled)}
          className={`flex items-center gap-2 px-5 py-3 border text-xs uppercase tracking-widest transition-all duration-300 ${
            isPreviewEnabled
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
          }`}
        >
          {isPreviewEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{isPreviewEnabled ? 'Hide Live Preview' : 'Show Live Preview'}</span>
        </button>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Section tabs */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-[9px] tracking-[0.25em] text-white/30 uppercase font-mono block mb-3 font-semibold select-none">
            Active Website Sections
          </span>
          {(['hero', 'about', 'services', 'testimonials', 'contact', 'footer'] as const).map(section => (
            <button
              key={section}
              type="button"
              onClick={() => setCmsSection(section)}
              className={`w-full px-4 py-3 border text-left flex items-center justify-between uppercase font-sans font-medium tracking-wider text-xs transition-all duration-300 ${
                cmsSection === section
                  ? 'border-gold bg-gold/10 text-gold font-bold'
                  : 'border-white/5 text-white/60 hover:text-gold hover:bg-white/2 hover:border-white/10'
              }`}
            >
              <span>{section} SECTION</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* Center: Form */}
        <div className={isPreviewEnabled ? 'lg:col-span-5 space-y-8' : 'lg:col-span-9 space-y-8'}>

          {/* Services catalogue */}
          {cmsSection === 'services' && (
            <div className="space-y-6 glass-panel p-6 border border-white/10">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">[ SERVICES COLLECTION ]</h3>
                <p className="text-[10px] text-white/50 mt-1 uppercase">Add, modify, delete, and reorder service cards</p>
              </div>
              <form onSubmit={handleSaveService} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Title (EN)</label>
                    <input type="text" value={srvTitleEn} onChange={e => setSrvTitleEn(e.target.value)} className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none" placeholder="e.g. Interior Architecture" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Title (AR)</label>
                    <input type="text" value={srvTitleAr} onChange={e => setSrvTitleAr(e.target.value)} dir="rtl" className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none" placeholder="..." />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Description (EN)</label>
                    <textarea rows={3} value={srvDescEn} onChange={e => setSrvDescEn(e.target.value)} className="w-full py-2 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Description (AR)</label>
                    <textarea rows={3} value={srvDescAr} onChange={e => setSrvDescAr(e.target.value)} dir="rtl" className="w-full py-2 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Icon (Lucide)</label>
                    <select value={srvIcon} onChange={e => setSrvIcon(e.target.value)} className="w-full py-2.5 px-3 bg-navy-dark border border-white/10 focus:border-gold outline-none text-xs text-white cursor-pointer">
                      {['Compass', 'Home', 'Box', 'MessageSquare', 'Layers', 'Paintbrush', 'Palette', 'Map'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2.5 pt-4">
                    <input type="checkbox" id="srv_active" checked={srvActive} onChange={e => setSrvActive(e.target.checked)} className="w-4 h-4 border border-white/15 bg-white/5 cursor-pointer" />
                    <label htmlFor="srv_active" className="text-xs text-white/60 uppercase tracking-wider cursor-pointer">Active on site</label>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  {editingServiceId && <button type="button" onClick={handleCancelServiceEdit} className="px-4 py-2 border border-white/15 bg-white/5 text-xs text-white uppercase hover:bg-white/10">Cancel</button>}
                  <button type="submit" className="px-6 py-2 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs uppercase font-extrabold tracking-widest">
                    {editingServiceId ? 'Save Edits ✓' : 'Add Service +'}
                  </button>
                </div>
              </form>
              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <span className="text-[9px] tracking-widest text-gold font-mono block">EXISTING SERVICES:</span>
                {services.length === 0 ? (
                  <div className="text-center py-6 text-xs text-white/40">No services added yet</div>
                ) : services.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/2 hover:border-white/15 transition-all">
                    <div className="space-y-0.5 max-w-[60%]">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-white truncate">{item.title_en}</span>
                        {!item.active && <span className="px-1 py-0.5 text-[8px] bg-red-950 text-red-400 font-bold border border-red-500/20 uppercase">MUTED</span>}
                      </div>
                      <p className="text-[10px] text-white/50 truncate">{item.description_en}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => handleMoveService(idx, 'up')} disabled={idx === 0} className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]">▲</button>
                        <button type="button" onClick={() => handleMoveService(idx, 'down')} disabled={idx === services.length - 1} className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]">▼</button>
                      </div>
                      <button onClick={() => handleEditServiceTrigger(item)} className="p-2 border border-white/5 bg-white/5 hover:border-gold text-white/75 hover:text-gold"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteService(item.id)} className="p-2 border border-white/5 bg-white/5 hover:border-red-500 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials catalogue */}
          {cmsSection === 'testimonials' && (
            <div className="space-y-6 glass-panel p-6 border border-white/10">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">[ CLIENT TESTIMONIALS ]</h3>
                <p className="text-[10px] text-white/50 mt-1 uppercase">Manage client reviews and ratings</p>
              </div>
              <form onSubmit={handleSaveTestimonial} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Client Name (EN)</label>
                    <input type="text" value={tstClientEn} onChange={e => setTstClientEn(e.target.value)} className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Client Name (AR)</label>
                    <input type="text" value={tstClientAr} onChange={e => setTstClientAr(e.target.value)} dir="rtl" className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Review (EN)</label>
                    <textarea rows={3} value={tstTextEn} onChange={e => setTstTextEn(e.target.value)} className="w-full py-2 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Review (AR)</label>
                    <textarea rows={3} value={tstTextAr} onChange={e => setTstTextAr(e.target.value)} dir="rtl" className="w-full py-2 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Rating</label>
                    <select value={tstRating} onChange={e => setTstRating(Number(e.target.value))} className="w-full py-2.5 px-3 bg-navy-dark border border-white/10 focus:border-gold outline-none text-xs text-white cursor-pointer">
                      {[5,4,3,2,1].map(sc => <option key={sc} value={sc}>{sc} Stars</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2.5 pt-4">
                    <input type="checkbox" id="tst_active" checked={tstActive} onChange={e => setTstActive(e.target.checked)} className="w-4 h-4 border border-white/15 bg-white/5 cursor-pointer" />
                    <label htmlFor="tst_active" className="text-xs text-white/60 uppercase tracking-wider cursor-pointer">Active on site</label>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  {editingTestimonialId && <button type="button" onClick={handleCancelTestimonialEdit} className="px-4 py-2 border border-white/15 bg-white/5 text-xs text-white uppercase hover:bg-white/10">Cancel</button>}
                  <button type="submit" className="px-6 py-2 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs uppercase font-extrabold tracking-widest">
                    {editingTestimonialId ? 'Save Edits ✓' : 'Add Review +'}
                  </button>
                </div>
              </form>
              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <span className="text-[9px] tracking-widest text-gold font-mono block">EXISTING REVIEWS:</span>
                {testimonials.length === 0 ? (
                  <div className="text-center py-6 text-xs text-white/40">No testimonials added yet</div>
                ) : testimonials.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/2 hover:border-white/15 transition-all">
                    <div className="space-y-0.5 max-w-[60%]">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-white truncate">{item.client_name_en}</span>
                        {!item.active && <span className="px-1 py-0.5 text-[8px] bg-red-950 text-red-400 font-bold border border-red-500/20 uppercase">MUTED</span>}
                      </div>
                      <p className="text-[10px] text-white/50 truncate">"{item.text_en}"</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => handleMoveTestimonial(idx, 'up')} disabled={idx === 0} className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]">▲</button>
                        <button type="button" onClick={() => handleMoveTestimonial(idx, 'down')} disabled={idx === testimonials.length - 1} className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]">▼</button>
                      </div>
                      <button onClick={() => handleEditTestimonialTrigger(item)} className="p-2 border border-white/5 bg-white/5 hover:border-gold text-white/75 hover:text-gold"><Edit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteTestimonial(item.id)} className="p-2 border border-white/5 bg-white/5 hover:border-red-500 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standard text/image editor */}
          <form onSubmit={handleSaveCmsSection} className="glass-panel p-6 sm:p-10 border border-white/10 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
                [ TEXT & ASSET EDITOR — {cmsSection.toUpperCase()} ]
              </h3>
              <p className="text-[10px] text-white/50 mt-1 uppercase">
                {filteredItems.length === 0
                  ? '⚠ No content fields found — check that the database has been seeded'
                  : `${filteredItems.length} field(s) available for this section`}
              </p>
            </div>

            {filteredItems.length === 0 && (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm text-white/50">No editable fields found for <span className="text-gold font-mono">{cmsSection}</span>.</p>
                <p className="text-xs text-white/30">Run the seed SQL in Supabase to populate the site_content table.</p>
              </div>
            )}

            <div className="space-y-6">
              {filteredItems.map(item => (
                <div key={item.key} className="space-y-3.5 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gold uppercase font-mono tracking-widest font-semibold">
                      {item.label || item.key}
                    </label>
                    <span className="text-[9px] text-white/30 font-mono uppercase select-none">[ {item.key} ]</span>
                  </div>

                  {item.content_type === 'image' ? (
                    <div className="space-y-3">
                      {item.value_en && (
                        <div className="w-full h-36 border border-white/10 bg-black/40 overflow-hidden relative group">
                          <img src={item.value_en} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <input type="file" accept="image/*" id={`upload_${item.key}`} className="hidden" onChange={e => handleCmsImageUpload(e, item.key)} />
                        <label htmlFor={`upload_${item.key}`} className="font-mono text-[10px] border border-white/20 px-4 py-2.5 bg-white/5 text-white/80 hover:text-gold hover:border-gold/60 transition-colors uppercase cursor-pointer select-none">
                          Upload Image
                        </label>
                        <span className="text-[10px] text-white/40 italic">Recommended: 1920×1080 for backgrounds</span>
                      </div>
                    </div>
                  ) : item.content_type === 'textarea' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ENGLISH ]</span>
                        <textarea rows={4} value={item.value_en || ''} onChange={e => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_en: e.target.value } : p))} className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none" placeholder="English text..." />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ARABIC ]</span>
                        <textarea rows={4} value={item.value_ar || ''} onChange={e => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_ar: e.target.value } : p))} dir="rtl" className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none text-right" placeholder="النص العربي..." />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ENGLISH ]</span>
                        <input type="text" value={item.value_en || ''} onChange={e => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_en: e.target.value } : p))} className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ARABIC ]</span>
                        <input type="text" value={item.value_ar || ''} onChange={e => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_ar: e.target.value } : p))} dir={item.content_type === 'url' ? 'ltr' : 'rtl'} className="w-full py-2.5 px-3 bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none text-right" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredItems.length > 0 && (
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button type="submit" className="px-8 py-3.5 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-all">
                  Save [{cmsSection.toUpperCase()}] Section
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right: Live preview */}
        {isPreviewEnabled && (
          <div className="lg:col-span-4 space-y-6 sticky top-24 self-start">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <span className="text-[10px] tracking-widest text-gold uppercase font-mono font-bold">[ Live Preview ]</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-mono text-white/50 uppercase">REAL-TIME</span>
              </div>
            </div>

            <div className="glass-panel border border-white/15 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              {cmsSection === 'hero' && (
                <div className="relative min-h-[300px] flex flex-col justify-center items-center p-8 text-center bg-[#070b14]">
                  {getVal('hero_background_image') && (
                    <img src={getVal('hero_background_image')} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
                  )}
                  <div className="relative z-10 space-y-4">
                    <span className="text-[9px] tracking-[0.3em] font-mono text-gold block uppercase animate-pulse">{getVal('hero_tagline') || 'EXCLUSIVE STUDIO'}</span>
                    <h2 className="font-serif text-xl font-bold uppercase text-white tracking-widest">{getVal('hero_title') || 'HAZAR ALGHANEM'}</h2>
                    <p className="text-[10px] text-white/50 max-w-xs mx-auto line-clamp-2">{getVal('hero_subtitle') || 'Interior & Exterior Design Studio'}</p>
                    <button type="button" className="px-5 py-2 border border-gold/50 text-[10px] bg-gold/5 text-gold uppercase tracking-widest pointer-events-none mt-2">
                      {getVal('hero_cta_button') || 'EXPLORE OUR WORK'}
                    </button>
                  </div>
                </div>
              )}

              {cmsSection === 'about' && (
                <div className="p-6 bg-[#070b14] space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">{getVal('about_title') || 'THE DESIGN STUDIO'}</h3>
                  <p className="text-[10px] text-white/60 line-clamp-3 leading-relaxed">{getVal('about_description_1') || 'Description...'}</p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    {[
                      { val: 'about_stat_projects', lbl: 'about_stat_label_projects' },
                      { val: 'about_stat_years', lbl: 'about_stat_label_years' },
                      { val: 'about_stat_clients', lbl: 'about_stat_label_clients' },
                    ].map(({ val, lbl }) => (
                      <div key={val} className="bg-white/2 p-2 border border-white/5">
                        <span className="text-sm font-bold text-gold block">{getVal(val) || '—'}</span>
                        <span className="text-[8px] text-white/45 uppercase font-mono block">{getVal(lbl) || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cmsSection === 'services' && (
                <div className="p-6 bg-[#070b14] space-y-4">
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-center">{getVal('services_title') || 'WHAT WE DO'}</h4>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {services.filter(s => s.active).map(srv => (
                      <div key={srv.id} className="p-3 bg-white/2 border border-white/5 flex items-start gap-2.5">
                        <span className="text-gold text-[10px] mt-0.5">✦</span>
                        <div>
                          <h5 className="font-serif text-xs font-bold text-white">{srv.title_en}</h5>
                          <p className="text-[9px] text-white/55 line-clamp-1">{srv.description_en}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cmsSection === 'testimonials' && (
                <div className="p-6 bg-[#070b14] text-center space-y-4">
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">{getVal('testimonials_title') || 'WHAT CLIENTS SAY'}</h4>
                  {testimonials.filter(t => t.active)[0] ? (
                    <div className="p-4 bg-white/2 border border-white/5 space-y-3">
                      <div className="text-gold text-xs">★ ★ ★ ★ ★</div>
                      <p className="text-[10px] text-white/80 line-clamp-3 italic">"{testimonials.filter(t => t.active)[0].text_en}"</p>
                      <span className="text-[9px] font-bold text-gold uppercase">{testimonials.filter(t => t.active)[0].client_name_en}</span>
                    </div>
                  ) : <p className="text-xs text-white/40 py-6 font-mono">No active testimonials</p>}
                </div>
              )}

              {cmsSection === 'contact' && (
                <div className="p-6 bg-[#070b14] space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white uppercase">{getVal('contact_title') || "LET'S CREATE TOGETHER"}</h3>
                  <div className="space-y-2 text-[10px] text-white/70 font-mono">
                    <p>📞 {getVal('contact_phone') || '+963...'}</p>
                    <p>✉ {getVal('contact_email') || 'hazar@...'}</p>
                    <p>📍 {getVal('contact_location') || 'Aleppo'}</p>
                  </div>
                </div>
              )}

              {cmsSection === 'footer' && (
                <div className="p-4 bg-black/40 text-center space-y-2">
                  <p className="text-gold uppercase tracking-[0.2em] font-mono text-[10px]">{getVal('footer_tagline') || 'Modern • Elegant • Unique'}</p>
                  <p className="text-white/40 text-[10px]">{getVal('footer_copyright') || '© 2026 Hazar'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
