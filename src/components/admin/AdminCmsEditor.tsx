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
  services: any[];
  testimonials: any[];
  
  // Services properties
  srvTitleEn: string;
  setSrvTitleEn: (val: string) => void;
  srvTitleAr: string;
  setSrvTitleAr: (val: string) => void;
  srvDescEn: string;
  setSrvDescEn: (val: string) => void;
  srvDescAr: string;
  setSrvDescAr: (val: string) => void;
  srvIcon: string;
  setSrvIcon: (val: string) => void;
  srvActive: boolean;
  setSrvActive: (val: boolean) => void;
  editingServiceId: string | null;
  handleCancelServiceEdit: () => void;
  handleSaveService: (e: React.FormEvent) => void;
  handleMoveService: (idx: number, direction: 'up' | 'down') => void;
  handleEditServiceTrigger: (srv: any) => void;
  handleDeleteService: (id: string) => void;

  // Testimonials properties
  tstClientEn: string;
  setTstClientEn: (val: string) => void;
  tstClientAr: string;
  setTstClientAr: (val: string) => void;
  tstTextEn: string;
  setTstTextEn: (val: string) => void;
  tstTextAr: string;
  setTstTextAr: (val: string) => void;
  tstRating: number;
  setTstRating: (val: number) => void;
  tstActive: boolean;
  setTstActive: (val: boolean) => void;
  editingTestimonialId: string | null;
  handleCancelTestimonialEdit: () => void;
  handleSaveTestimonial: (e: React.FormEvent) => void;
  handleMoveTestimonial: (idx: number, direction: 'up' | 'down') => void;
  handleEditTestimonialTrigger: (tst: any) => void;
  handleDeleteTestimonial: (id: string) => void;
}

export default function AdminCmsEditor({
  cmsSection,
  setCmsSection,
  isPreviewEnabled,
  setIsPreviewEnabled,
  editingContent,
  setEditingContent,
  handleCmsImageUpload,
  handleSaveCmsSection,
  services,
  testimonials,
  srvTitleEn,
  setSrvTitleEn,
  srvTitleAr,
  setSrvTitleAr,
  srvDescEn,
  setSrvDescEn,
  srvDescAr,
  setSrvDescAr,
  srvIcon,
  setSrvIcon,
  srvActive,
  setSrvActive,
  editingServiceId,
  handleCancelServiceEdit,
  handleSaveService,
  handleMoveService,
  handleEditServiceTrigger,
  handleDeleteService,
  tstClientEn,
  setTstClientEn,
  tstClientAr,
  setTstClientAr,
  tstTextEn,
  setTstTextEn,
  tstTextAr,
  setTstTextAr,
  tstRating,
  setTstRating,
  tstActive,
  setTstActive,
  editingTestimonialId,
  handleCancelTestimonialEdit,
  handleSaveTestimonial,
  handleMoveTestimonial,
  handleEditTestimonialTrigger,
  handleDeleteTestimonial,
}: AdminCmsEditorProps) {
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
            Edit text paragraphs, upload images, manage catalog systems, and fine-tune language outputs without manual coding
          </p>
          <div className="w-16 h-px bg-gold/50 mt-4" />
        </div>

        {/* Fast toggle for Live Preview */}
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

      {/* Sub panels split: Left Category Select, Center inputs, Right live preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vertical CMS Section tabs Menu */}
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

        {/* Inner Form Grid (Splits further using isPreviewEnabled toggle) */}
        <div className={isPreviewEnabled ? 'lg:col-span-5 space-y-8' : 'lg:col-span-9 space-y-8'}>
          
          {/* IF SECTION IS 'services' OR 'testimonials', RENDER ITEM LIST MANAGER EXTRA ACCORDION */}
          {cmsSection === 'services' && (
            <div className="space-y-6 glass-panel p-6 border border-white/10">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
                  [ SERVICES COLLECTION CATALOGUE ]
                </h3>
                <p className="text-[10px] text-white/50 mt-1 uppercase">Add, modify, delete, and control display orders of interactive service grids</p>
              </div>

              {/* Creation / Edit Form */}
              <form onSubmit={handleSaveService} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Title (EN)</label>
                    <input
                      type="text"
                      value={srvTitleEn}
                      onChange={(e) => setSrvTitleEn(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none"
                      placeholder="e.g. Interior Architecture"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Title (AR)</label>
                    <input
                      type="text"
                      value={srvTitleAr}
                      onChange={(e) => setSrvTitleAr(e.target.value)}
                      dir="rtl"
                      className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none"
                      placeholder="..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Description (English)</label>
                    <textarea
                      rows={3}
                      value={srvDescEn}
                      onChange={(e) => setSrvDescEn(e.target.value)}
                      className="w-full py-2 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none"
                      placeholder="English descriptive summary..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Description (Arabic)</label>
                    <textarea
                      rows={3}
                      value={srvDescAr}
                      onChange={(e) => setSrvDescAr(e.target.value)}
                      dir="rtl"
                      className="w-full py-2 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none"
                      placeholder="..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Icon Name (Lucide-React)</label>
                    <select
                      value={srvIcon}
                      onChange={(e) => setSrvIcon(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-none bg-navy-dark border border-white/10 focus:border-gold outline-none text-xs text-white cursor-pointer"
                    >
                      {['Compass', 'Home', 'Box', 'MessageSquare', 'Layers', 'Paintbrush', 'Palette', 'Map'].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2.5 pt-4">
                    <input
                      type="checkbox"
                      id="srv_active_chk"
                      checked={srvActive}
                      onChange={(e) => setSrvActive(e.target.checked)}
                      className="w-4 h-4 rounded-none border border-white/15 bg-white/5 text-gold focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="srv_active_chk" className="text-xs text-white/60 uppercase tracking-wider select-none cursor-pointer">
                      Active on main site
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={handleCancelServiceEdit}
                      className="px-4 py-2 border border-white/15 bg-white/5 text-xs text-white uppercase hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs uppercase font-extrabold tracking-widest hover:shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                  >
                    {editingServiceId ? 'Save Edits ✓' : 'Add New Service +'}
                  </button>
                </div>
              </form>

              {/* List representation with ordering controls */}
              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <span className="text-[9px] tracking-widest text-gold font-mono block">EXISTING SERVICES CATALOG:</span>
                {services.length === 0 ? (
                  <div className="text-center py-6 text-xs text-white/40">No service catalog cards mapped globally</div>
                ) : (
                  services.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/2 hover:border-white/15 transition-all">
                      <div className="space-y-0.5 max-w-[60%]">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-white truncate">{item.title_en}</span>
                          {!item.active && <span className="px-1 py-0.5 text-[8px] bg-red-950 text-red-400 font-bold border border-red-500/20 uppercase">MUTED</span>}
                        </div>
                        <p className="text-[10px] text-white/50 truncate leading-tight">{item.description_en}</p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Ordering buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button 
                            type="button" 
                            onClick={() => handleMoveService(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]"
                          >
                            ▲
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleMoveService(idx, 'down')}
                            disabled={idx === services.length - 1}
                            className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Action buttons */}
                        <button
                          onClick={() => handleEditServiceTrigger(item)}
                          className="p-2 border border-white/5 bg-white/5 hover:border-gold text-white/75 hover:text-gold"
                          title="Edit Service properties"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(item.id)}
                          className="p-2 border border-white/5 bg-white/5 hover:border-red-500 text-red-400"
                          title="Delete Service card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {cmsSection === 'testimonials' && (
            <div className="space-y-6 glass-panel p-6 border border-white/10">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
                  [ CUSTOMER CITATIONS & ACCLAIMS ]
                </h3>
                <p className="text-[10px] text-white/50 mt-1 uppercase">Configure dynamic testimonials, adjust customer scores, active settings, and list priority</p>
              </div>

              {/* Creation / Edit Form */}
              <form onSubmit={handleSaveTestimonial} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Client Name (EN)</label>
                    <input
                      type="text"
                      value={tstClientEn}
                      onChange={(e) => setTstClientEn(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none"
                      placeholder="e.g. Sir Alistair Carlyle"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Client Name (AR)</label>
                    <input
                      type="text"
                      value={tstClientAr}
                      onChange={(e) => setTstClientAr(e.target.value)}
                      dir="rtl"
                      className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none"
                      placeholder="..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Review Quote (English)</label>
                    <textarea
                      rows={3}
                      value={tstTextEn}
                      onChange={(e) => setTstTextEn(e.target.value)}
                      className="w-full py-2 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none"
                      placeholder="Quote..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Review Quote (Arabic)</label>
                    <textarea
                      rows={3}
                      value={tstTextAr}
                      onChange={(e) => setTstTextAr(e.target.value)}
                      dir="rtl"
                      className="w-full py-2 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none"
                      placeholder="..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">Rating Score (1 - 5 Stars)</label>
                    <select
                      value={tstRating}
                      onChange={(e) => setTstRating(Number(e.target.value))}
                      className="w-full py-2.5 px-3 rounded-none bg-navy-dark border border-white/10 focus:border-gold outline-none text-xs text-white cursor-pointer"
                    >
                      {[5, 4, 3, 2, 1].map(sc => (
                        <option key={sc} value={sc}>{sc} STARS</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2.5 pt-4">
                    <input
                      type="checkbox"
                      id="tst_active_chk"
                      checked={tstActive}
                      onChange={(e) => setTstActive(e.target.checked)}
                      className="w-4 h-4 rounded-none border border-white/15 bg-white/5 text-gold focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="tst_active_chk" className="text-xs text-white/60 uppercase tracking-wider select-none cursor-pointer">
                      Active on main site
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingTestimonialId && (
                    <button
                      type="button"
                      onClick={handleCancelTestimonialEdit}
                      className="px-4 py-2 border border-white/15 bg-white/5 text-xs text-white uppercase hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs uppercase font-extrabold tracking-widest hover:shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                  >
                    {editingTestimonialId ? 'Save Edits ✓' : 'Add New Review +'}
                  </button>
                </div>
              </form>

              {/* List representation with ordering controls */}
              <div className="border-t border-white/10 pt-4 space-y-2.5">
                <span className="text-[9px] tracking-widest text-gold font-mono block">PERSISTED CLIENT DIRECTORY:</span>
                {testimonials.length === 0 ? (
                  <div className="text-center py-6 text-xs text-white/40">No verified testimonials added yet</div>
                ) : (
                  testimonials.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/2 hover:border-white/15 transition-all">
                      <div className="space-y-0.5 max-w-[60%]">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-white truncate">{item.client_name_en}</span>
                          {!item.active && <span className="px-1 py-0.5 text-[8px] bg-red-950 text-red-400 font-bold border border-red-500/20 uppercase">MUTED</span>}
                        </div>
                        <p className="text-[10px] text-white/50 truncate leading-tight">“{item.text_en}”</p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Ordering buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button 
                            type="button" 
                            onClick={() => handleMoveTestimonial(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]"
                          >
                            ▲
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleMoveTestimonial(idx, 'down')}
                            disabled={idx === testimonials.length - 1}
                            className="p-1 border border-white/5 hover:border-gold/30 disabled:opacity-20 text-white hover:text-gold text-[10px]"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Action buttons */}
                        <button
                          onClick={() => handleEditTestimonialTrigger(item)}
                          className="p-2 border border-white/5 bg-white/5 hover:border-gold text-white/75 hover:text-gold"
                          title="Edit Testimonial properties"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="p-2 border border-white/5 bg-white/5 hover:border-red-500 text-red-400"
                          title="Delete Testimonial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Standard Key-Value Localized site content editor form */}
          <form onSubmit={handleSaveCmsSection} className="glass-panel p-6 sm:p-10 border border-white/10 space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xs font-mono tracking-[0.2em] text-gold uppercase font-bold">
                [ TEXT TRANSLATION & ASSET INPUT BOARD ]
              </h3>
              <p className="text-[10px] text-white/50 mt-1 uppercase">Configure specific {cmsSection} page variables side-by-side with real-time feedback</p>
            </div>

            <div className="space-y-6">
              {editingContent
                .filter(item => {
                  const mapping: Record<string, string[]> = {
                    hero: ['hero_tagline', 'hero_title', 'hero_subtitle', 'hero_cta', 'hero_bg'],
                    about: [
                      'about_sec_title', 'about_sec_subtitle', 'about_biography_1', 'about_biography_2',
                      'about_ph_quote', 'about_ph_author',
                      'about_stat_1_val', 'about_stat_1_lbl',
                      'about_stat_2_val', 'about_stat_2_lbl',
                      'about_stat_3_val', 'about_stat_3_lbl'
                    ],
                    services: ['services_title', 'services_subtitle'],
                    testimonials: ['testimonials_title', 'testimonials_subtitle'],
                    contact: [
                      'contact_title', 'contact_subtitle', 'contact_whatsapp',
                      'contact_instagram', 'contact_email', 'contact_phone', 'contact_location'
                    ],
                    footer: ['footer_tagline', 'footer_copyright']
                  };
                  return mapping[cmsSection]?.includes(item.key);
                })
                .map(item => (
                  <div key={item.key} className="space-y-3.5 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gold uppercase font-mono tracking-widest font-semibold block">
                        {item.label}
                      </label>
                      <span className="text-[9px] text-white/30 font-mono tracking-wider uppercase font-bold select-none">[ KEY_ID: {item.key} ]</span>
                    </div>

                    {/* SIDE-BY-SIDE TRANSLATION INPUTS */}
                    {item.content_type === 'image' ? (
                      <div className="space-y-3">
                        {item.value_en && (
                          <div className="w-full h-36 border border-white/10 bg-black/40 overflow-hidden relative group">
                            <img 
                              src={item.value_en} 
                              alt={item.label} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-navy-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-[10px] tracking-widest uppercase font-mono text-gold">Replace Brand Image Asset</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            id={`upload_${item.key}`}
                            className="hidden"
                            onChange={(e) => handleCmsImageUpload(e, item.key)}
                          />
                          <label
                            htmlFor={`upload_${item.key}`}
                            className="font-mono text-[10px] border border-white/20 px-4 py-2.5 bg-white/5 text-white/80 hover:text-gold hover:border-gold/60 transition-colors uppercase cursor-pointer select-none"
                          >
                            Upload Base64 Asset
                          </label>
                          <span className="text-[10px] text-white/40 italic">Best size: 1920x1080 for Hero Backgrounds</span>
                        </div>
                      </div>
                    ) : item.content_type === 'textarea' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* English Textarea */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ENGLISH VALUES ]</span>
                          <textarea
                            rows={4}
                            value={item.value_en || ''}
                            onChange={(e) => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_en: e.target.value } : p))}
                            className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none font-sans"
                            placeholder="Write English segment..."
                          />
                        </div>

                        {/* Arabic Textarea */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ARABIC VALUES ]</span>
                          <textarea
                            rows={4}
                            value={item.value_ar || ''}
                            onChange={(e) => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_ar: e.target.value } : p))}
                            dir="rtl"
                            className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none resize-none font-sans text-right"
                            placeholder="أدخل النص العربي..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* English Text/URL Input */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ENGLISH VALUES ]</span>
                          <input
                            type="text"
                            value={item.value_en || ''}
                            onChange={(e) => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_en: e.target.value } : p))}
                            className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none font-sans"
                            placeholder="Value..."
                          />
                        </div>

                        {/* Arabic Text/URL Input */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">[ ARABIC VALUES ]</span>
                          <input
                            type="text"
                            value={item.value_ar || ''}
                            onChange={(e) => setEditingContent(prev => prev.map(p => p.key === item.key ? { ...p, value_ar: e.target.value } : p))}
                            dir={item.content_type === 'url' ? 'ltr' : 'rtl'}
                            className="w-full py-2.5 px-3 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none font-sans text-right"
                            placeholder="القيمة..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Save section panel button */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs sm:text-sm font-extrabold uppercase tracking-[0.15em] transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]"
              >
                Save [{cmsSection.toUpperCase()}] Section
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: MINI LIVE PREVIEW HUD */}
        {isPreviewEnabled && (
          <div className="lg:col-span-4 space-y-6 sticky top-24 self-start">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3">
              <span className="text-[10px] tracking-widest text-gold uppercase font-mono font-bold">
                [ Interactive Live Preview ]
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-mono text-white/50 uppercase">REAL-TIME</span>
              </div>
            </div>

            {/* Dynamic rendering according to cmsSection and current inputs */}
            <div className="glass-panel border border-white/15 overflow-hidden transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              
              {/* HERO LIVE PREVIEW DISPLAY */}
              {cmsSection === 'hero' && (
                <div className="relative min-h-[300px] flex flex-col justify-center items-center p-8 text-center bg-[#070b14]">
                  {/* Bg */}
                  {editingContent.find(i => i.key === 'hero_bg')?.value_en && (
                    <img 
                      src={editingContent.find(o => o.key === 'hero_bg')?.value_en} 
                      alt="Hero preview bg" 
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="relative z-10 space-y-4">
                    <span className="text-[9px] tracking-[0.3em] font-mono text-gold block uppercase select-none animate-pulse">
                      {editingContent.find(k => k.key === 'hero_tagline')?.value_en || 'EXCLUSIVE STUDIO'}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-white tracking-widest max-w-sm">
                      {editingContent.find(k => k.key === 'hero_title')?.value_en || 'HAZAR ALGHANEM'}
                    </h2>
                    <p className="text-[10px] text-white/50 max-w-xs mx-auto text-center line-clamp-2">
                      {editingContent.find(k => k.key === 'hero_subtitle')?.value_en || 'Luxurious spaces curated for the elite...'}
                    </p>
                    <button type="button" className="px-5 py-2 border border-gold/50 text-[10px] bg-gold/5 text-gold uppercase tracking-widest pointer-events-none mt-2">
                      {editingContent.find(k => k.key === 'hero_cta')?.value_en || 'EXPLORE ATELIER'}
                    </button>
                  </div>
                </div>
              )}

              {/* ABOUT LIVE PREVIEW DISPLAY */}
              {cmsSection === 'about' && (
                <div className="p-6 bg-[#070b14] text-left space-y-4 font-sans">
                  <span className="text-[9px] tracking-widest text-gold font-mono block uppercase">
                    {editingContent.find(k => k.key === 'about_sec_subtitle')?.value_en || 'OUR PHILOSOPHY'}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                    {editingContent.find(k => k.key === 'about_sec_title')?.value_en || 'ABOUT OUR ATELIER'}
                  </h3>
                  <p className="text-[10px] text-white/60 line-clamp-3 leading-relaxed">
                    {editingContent.find(k => k.key === 'about_biography_1')?.value_en || 'Decades of luxury craft...'}
                  </p>
                  <div className="border-l-2 border-gold/40 pl-4 py-1 italic text-white/80 text-[11px] line-clamp-2">
                    “{editingContent.find(k => k.key === 'about_ph_quote')?.value_en || 'Simplicity is the ultimate sophistication...'}”
                  </div>

                  {/* Stat block preview */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="bg-white/2 p-2 border border-white/5">
                      <span className="text-sm font-bold text-gold block">{editingContent.find(k => k.key === 'about_stat_1_val')?.value_en || '50+'}</span>
                      <span className="text-[8px] text-white/45 uppercase font-mono block">{editingContent.find(k => k.key === 'about_stat_1_lbl')?.value_en || 'Projects'}</span>
                    </div>
                    <div className="bg-white/2 p-2 border border-white/5">
                      <span className="text-sm font-bold text-gold block">{editingContent.find(k => k.key === 'about_stat_2_val')?.value_en || '15+'}</span>
                      <span className="text-[8px] text-white/45 uppercase font-mono block">{editingContent.find(k => k.key === 'about_stat_2_lbl')?.value_en || 'Awards'}</span>
                    </div>
                    <div className="bg-white/2 p-2 border border-white/5">
                      <span className="text-sm font-bold text-gold block">{editingContent.find(k => k.key === 'about_stat_3_val')?.value_en || '5+'}</span>
                      <span className="text-[8px] text-white/45 uppercase font-mono block">{editingContent.find(k => k.key === 'about_stat_3_lbl')?.value_en || 'Years'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICES GRID PREVIEW */}
              {cmsSection === 'services' && (
                <div className="p-6 bg-[#070b14] space-y-4">
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-center">
                    {editingContent.find(k => k.key === 'services_title')?.value_en || 'OUR STRATEGIES'}
                  </h4>
                  <p className="text-[9px] text-white/40 text-center uppercase mx-auto select-none">
                    {editingContent.find(k => k.key === 'services_subtitle')?.value_en || 'Dynamic listing...'}
                  </p>
                  
                  {/* Service micro grid render */}
                  <div className="space-y-2 mt-4 max-h-[220px] overflow-y-auto pr-1">
                    {services.filter(s => s.active).map(srv => (
                      <div key={srv.id} className="p-3 bg-white/2 border border-white/5 flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-none border border-gold/30 bg-gold/5 flex items-center justify-center text-gold shrink-0">
                          <span className="text-[10px] font-mono">✦</span>
                        </div>
                        <div>
                          <h5 className="font-serif text-xs font-bold text-white">{srv.title_en}</h5>
                          <p className="text-[9px] text-white/55 line-clamp-1 leading-tight">{srv.description_en}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TESTIMONIALS SLIDER PREVIEW */}
              {cmsSection === 'testimonials' && (
                <div className="p-6 bg-[#070b14] text-center space-y-4">
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                    {editingContent.find(k => k.key === 'testimonials_title')?.value_en || 'CLIENT ACCLAIM'}
                  </h4>
                  
                  {testimonials.filter(t => t.active).length > 0 ? (
                    <div className="p-4 bg-white/2 border border-white/5 space-y-3 relative">
                      <div className="text-gold text-xs flex justify-center gap-1">★ ★ ★ ★ ★</div>
                      <p className="text-[10px] text-white/80 line-clamp-3 leading-relaxed select-none italic">
                        “{testimonials.filter(tst => tst.active)[0]?.text_en || ''}”
                      </p>
                      <span className="block text-[9px] font-bold text-gold uppercase tracking-wider">
                        {testimonials.filter(tst => tst.active)[0]?.client_name_en || ''}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-white/45 py-8 font-mono uppercase">Directory Empty</p>
                  )}
                </div>
              )}

              {/* CONTACT PREVIEW DISPLAY */}
              {cmsSection === 'contact' && (
                <div className="p-6 bg-[#070b14] space-y-4 text-left font-sans">
                  <span className="text-[9px] tracking-widest text-gold font-mono block uppercase">
                    {editingContent.find(k => k.key === 'contact_subtitle')?.value_en || 'GET IN TOUCH'}
                  </span>
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                    {editingContent.find(k => k.key === 'contact_title')?.value_en || 'REQUEST INQUIRE'}
                  </h3>
                  <div className="space-y-2 pt-2 text-[10px] text-white/70 font-mono">
                    <p>📞 Phone: {editingContent.find(k => k.key === 'contact_phone')?.value_en || '+963...'}</p>
                    <p>✉ Email: {editingContent.find(k => k.key === 'contact_email')?.value_en || 'hazar@...'}</p>
                    <p>📍 Atelier: {editingContent.find(k => k.key === 'contact_location')?.value_en || 'Heritage Aleppo'}</p>
                  </div>
                </div>
              )}

              {/* FOOTER PREVIEW DISPLAY */}
              {cmsSection === 'footer' && (
                <div className="p-4 bg-black/40 text-center space-y-2 text-[10px] font-sans font-light">
                  <p className="text-gold uppercase tracking-[0.2em] font-mono leading-relaxed select-none">
                    {editingContent.find(k => k.key === 'footer_tagline')?.value_en || 'Modern • Classic'}
                  </p>
                  <p className="text-white/40 leading-snug">
                    {editingContent.find(k => k.key === 'footer_copyright')?.value_en || '© 2026 Hazar. Rights reserved.'}
                  </p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
