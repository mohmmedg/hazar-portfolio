import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Loader2, Upload, X } from 'lucide-react';

interface AdminProjectFormProps {
  editingProjectId: string | null;
  formName: string;
  setFormName: (val: string) => void;
  formCategory: 'Living Room' | 'Dining Room' | 'Bedroom' | 'Kitchen' | 'Entrance' | 'Exterior';
  setFormCategory: (val: 'Living Room' | 'Dining Room' | 'Bedroom' | 'Kitchen' | 'Entrance' | 'Exterior') => void;
  formFeatured: boolean;
  setFormFeatured: (val: boolean) => void;
  tags: any[];
  selectedTagIds: string[];
  setSelectedTagIds: (val: string[] | ((prev: string[]) => string[])) => void;
  formDescription: string;
  setFormDescription: (val: string) => void;
  isProcessingImages: boolean;
  formImages: string[];
  removeFormImage: (idx: number) => void;
  formErrors: Record<string, string>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  setActiveTab: (tab: 'dashboard' | 'add_project' | 'manage_projects' | 'tags' | 'contact_settings' | 'site_content') => void;
}

export default function AdminProjectForm({
  editingProjectId,
  formName,
  setFormName,
  formCategory,
  setFormCategory,
  formFeatured,
  setFormFeatured,
  tags,
  selectedTagIds,
  setSelectedTagIds,
  formDescription,
  setFormDescription,
  isProcessingImages,
  formImages,
  removeFormImage,
  formErrors,
  fileInputRef,
  handleImageUpload,
  handleFormSubmit,
  resetForm,
  setActiveTab
}: AdminProjectFormProps) {
  
  const isArabicText = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicPattern.test(text);
  };

  return (
    <motion.div
      key="add_project"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-white uppercase mb-1">
          {editingProjectId ? 'Modify Project' : 'Upload Masterpiece'}
        </h2>
        <p className="text-xs text-white/50 tracking-wider">
          {editingProjectId ? 'Pre-filled with database values. Save updates to publish instantly.' : 'Append a luxury villa, facade, or penthouse concept to the digital portfolio.'}
        </p>
        <div className="w-16 h-px bg-gold/50 mt-4" />
      </div>

      <form onSubmit={handleFormSubmit} className="glass-panel p-8 sm:p-12 rounded-none border border-white/15 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Columns */}
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-xs tracking-wider uppercase text-white/50 font-medium block">
                Project Name (English/Arabic) <span className="text-gold font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                }}
                className={`w-full py-4 px-5 rounded-none bg-white/5 text-sm text-white placeholder-white/30 border focus:border-gold outline-none transition-all duration-300 font-sans ${
                  formErrors.name ? 'border-red-500/60' : 'border-white/10 hover:border-white/20'
                }`}
                placeholder="e.g. Aurelia Penthouse, صالون أوريليا"
              />
              {formErrors.name && (
                <p className="text-red-400 text-xs mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.name}</span>
                </p>
              )}
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label className="text-xs tracking-wider uppercase text-white/50 font-medium block">
                Collection Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as any)}
                className="w-full py-4 px-5 rounded-none bg-navy-dark text-sm text-white border border-white/10 hover:border-white/20 focus:border-gold outline-none transition-all duration-300 select-none cursor-pointer"
              >
                <option value="Living Room">Living Room</option>
                <option value="Dining Room">Dining Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Entrance">Entrance</option>
                <option value="Exterior">Exterior</option>
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="py-4 border-2 border-white/5 bg-white/2 px-5 flex items-center justify-between select-none">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                  Featured Showpiece
                </span>
                <span className="text-[10px] text-white/40 block mt-0.5">
                  Priority placement at the absolute start of the public gallery
                </span>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold peer-checked:after:bg-navy-dark" />
              </label>
            </div>

            {/* MULTI_SELECT TAGS ACCORDION */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-xs tracking-wider uppercase text-white/50 font-medium block">
                Assign Taxonomy Tags (Multi-select)
              </label>
              
              {tags.length === 0 ? (
                <div className="p-4 border border-white/5 bg-white/2 text-[11px] text-white/40 text-center font-mono select-none">
                  No tags configured. Add tags under "Tags Manager" sidebar node first.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto p-3 border border-white/10 bg-black/10">
                  {tags.map(tag => {
                    const isChecked = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedTagIds(prev => prev.filter(tid => tid !== tag.id));
                          } else {
                            setSelectedTagIds(prev => [...prev, tag.id]);
                          }
                        }}
                        className={`flex items-center gap-2 py-2 px-3 border text-xs tracking-wide transition-all duration-200 select-none ${
                          isChecked 
                            ? 'bg-gold/15 text-gold font-semibold' 
                            : 'border-white/10 bg-white/3 text-white/60 hover:text-white hover:border-white/20'
                        }`}
                        style={{ borderColor: isChecked ? tag.color : undefined }}
                      >
                        <div 
                          className="w-2.5 h-2.5 shrink-0" 
                          style={{ backgroundColor: tag.color || '#C9A84C' }} 
                        />
                        <span className="truncate">{tag.name} / {tag.name_ar}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Columns */}
          <div className="space-y-6">
            {/* Description Field */}
            <div className="space-y-2">
              <label className="text-xs tracking-wider uppercase text-white/50 font-medium block">
                Project Description (Optional)
              </label>
              <textarea
                rows={11}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                dir={isArabicText(formDescription) ? 'rtl' : 'ltr'}
                className="w-full py-4 px-5 rounded-none bg-white/5 text-sm text-white placeholder-white/30 border border-white/10 hover:border-white/20 focus:border-gold outline-none transition-all duration-300 font-sans resize-none"
                placeholder="e.g. Luxurious marble finishes and bespoke chandelier designs... أو تفاصيل التطعيمات الملكية الفاخرة..."
              />
              <p className="text-[10px] text-white/30 tracking-wide">
                System dynamically detects language script alignment (RTL block supports standard Arabic).
              </p>
            </div>
          </div>
        </div>

        {/* IMAGES UPLOAD ACCORDION / BLOCK */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Project Media Frame <span className="text-gold font-bold">*</span>
            </h3>
            <p className="text-xs text-white/40 mt-0.5">
              Multiple files allowed (optimal resolution 1200x800). Max 10 images. Supports JPG, PNG, and WEBP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
            {/* Upload trigger button */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImages}
                className={`w-full group h-40 border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-pointer ${
                  formErrors.images 
                    ? 'border-red-500/60 bg-red-950/10 hover:bg-red-950/20' 
                    : 'border-white/20 hover:border-gold/50 bg-white/2 hover:bg-gold/5'
                }`}
              >
                {isProcessingImages ? (
                  <>
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gold">Processing File...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-white/40 group-hover:text-gold transition-colors duration-300" />
                    <div className="text-center">
                      <span className="text-xs uppercase tracking-wider font-bold text-white block">
                        Select Images
                      </span>
                      <span className="text-[10px] text-white/40 block mt-0.5">
                        {10 - formImages.length} slot(s) available
                      </span>
                    </div>
                  </>
                )}
              </button>

              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
              />

              {formErrors.images && (
                <p className="text-red-400 text-xs mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.images}</span>
                </p>
              )}
            </div>

            {/* Image previews list */}
            <div className="md:col-span-3">
              {formImages.length === 0 ? (
                <div className="h-40 border border-white/10 bg-black/10 flex items-center justify-center p-6 text-center select-none">
                  <span className="text-xs text-white/20 tracking-wider">
                    No uploaded file drafts. Select media files to generate thumbnails.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto p-2 border border-white/10 bg-black/10">
                  {formImages.map((b64, idx) => (
                    <div key={idx} className="relative group aspect-square bg-white/5 border border-white/10 overflow-hidden">
                      <img
                        src={b64}
                        alt="Preview thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeFormImage(idx)}
                          className="p-1 px-1.5 bg-red-600 border border-red-500 text-white hover:bg-red-700 transition-colors duration-300"
                          aria-label="Remove image draft"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/85 text-[8px] font-mono text-gold px-1.5 py-0.5 leading-none">
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submission and Control Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setActiveTab('manage_projects');
            }}
            className="w-full sm:w-auto px-6 py-4 border border-white/15 bg-white/5 text-white text-xs uppercase tracking-wider hover:border-gold hover:text-white transition-all duration-300"
          >
            Cancel Draft
          </button>

          <button
            type="submit"
            disabled={isProcessingImages}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark font-sans text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] disabled:opacity-50 select-none cursor-pointer"
          >
            {editingProjectId ? 'Save Changes ✓' : 'Add Project ✦'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
