import React from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Tag as TagIcon } from 'lucide-react';

interface TagType {
  id: string;
  name: string;
  name_ar?: string;
  color?: string;
  created_at?: string;
}

interface AdminTagsManagerProps {
  editingTagId: string | null;
  formTagName: string;
  setFormTagName: (val: string) => void;
  formTagNameAr: string;
  setFormTagNameAr: (val: string) => void;
  formTagColor: string;
  setFormTagColor: (val: string) => void;
  resetTagForm: () => void;
  handleTagSubmit: (e: React.FormEvent) => void;
  tags: TagType[];
  projectTags: any[];
  handleTagEditTrigger: (tag: TagType) => void;
  handleTagDeleteCall: (tag: TagType) => void;
}

export default function AdminTagsManager({
  editingTagId,
  formTagName,
  setFormTagName,
  formTagNameAr,
  setFormTagNameAr,
  formTagColor,
  setFormTagColor,
  resetTagForm,
  handleTagSubmit,
  tags,
  projectTags,
  handleTagEditTrigger,
  handleTagDeleteCall
}: AdminTagsManagerProps) {
  return (
    <motion.div
      key="tags"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-white uppercase mb-1">
          Tags Manager
        </h2>
        <p className="text-xs text-white/50 tracking-wider">
          Configure taxonomy tags that group and filter portfolio masterpiece showcases
        </p>
        <div className="w-16 h-px bg-gold/50 mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Add/Edit Form: takes 4 columns */}
        <form 
          onSubmit={handleTagSubmit} 
          className="lg:col-span-4 glass-panel p-6 border border-white/15 space-y-5"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
            {editingTagId ? 'Edit Tag Details' : 'Add New Tag'}
          </h3>
          <div className="w-8 h-px bg-gold/50" />

          {/* Tag Name EN */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
              Tag Name (English) <span className="text-gold font-bold">*</span>
            </label>
            <input
              type="text"
              required
              value={formTagName}
              onChange={(e) => setFormTagName(e.target.value)}
              className="w-full py-3 px-4 rounded-none bg-white/5 text-xs text-white placeholder-white/30 border border-white/10 hover:border-white/15 focus:border-gold outline-none transition-all duration-300 font-sans"
              placeholder="e.g. Modern, Minimalist"
            />
          </div>

          {/* Tag Name AR */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
              Tag Name (Arabic) <span className="text-gold font-bold">*</span>
            </label>
            <input
              type="text"
              required
              value={formTagNameAr}
              onChange={(e) => setFormTagNameAr(e.target.value)}
              className="w-full py-3 px-4 rounded-none bg-white/5 text-xs text-white placeholder-white/30 border border-white/10 hover:border-white/15 focus:border-gold outline-none transition-all duration-300 font-sans"
              placeholder="مثلاً: حديث، كلاسيكي"
            />
          </div>

          {/* Tag Color Code picker */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/40 tracking-wider uppercase font-medium block">
              Tag Accent Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={formTagColor}
                onChange={(e) => setFormTagColor(e.target.value)}
                className="w-12 h-10 border border-white/20 bg-transparent p-1 cursor-pointer"
              />
              <input
                type="text"
                required
                value={formTagColor}
                onChange={(e) => setFormTagColor(e.target.value)}
                className="flex-1 py-3 px-4 rounded-none bg-white/5 text-xs text-white border border-white/10 focus:border-gold outline-none font-mono"
                placeholder="#C9A84C"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {editingTagId && (
              <button
                type="button"
                onClick={resetTagForm}
                className="w-full py-3 border border-white/15 bg-white/5 text-white text-xs uppercase tracking-wider hover:border-white/30 transition-all duration-300"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs font-bold uppercase tracking-widest transition-all duration-300 select-none cursor-pointer"
            >
              {editingTagId ? 'Save' : 'Create'}
            </button>
          </div>
        </form>

        {/* Table of tags: takes 8 columns */}
        <div className="lg:col-span-8 glass-panel border border-white/12 overflow-x-auto">
          {tags.length === 0 ? (
            <div className="p-16 text-center select-none text-white/40">
              <TagIcon className="w-10 h-10 mx-auto opacity-20 mb-3" />
              No tags configured inside workspace. Use the creator form to set custom categories.
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[500px]">
              <thead>
                <tr className="border-b border-white/15 text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold bg-white/2">
                  <th className="py-3 px-5">Preview</th>
                  <th className="py-3 px-5">English Name</th>
                  <th className="py-3 px-5">Arabic Name</th>
                  <th className="py-3 px-5">Linked Works</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-white">
                {tags.map(tag => {
                  const linkedCount = projectTags.filter(pt => pt.tag_id === tag.id).length;
                  return (
                    <tr key={tag.id} className="hover:bg-white/2 transition-colors duration-300">
                      <td className="py-3 px-5">
                        <span 
                          className="px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase font-mono border"
                          style={{ 
                            backgroundColor: (tag.color || '#C9A84C') + '15', 
                            color: tag.color, 
                            borderColor: (tag.color || '#C9A84C') + '40'
                          }}
                        >
                          {tag.name}
                        </span>
                      </td>
                      <td className="py-3 px-5 font-sans font-medium">{tag.name}</td>
                      <td className="py-3 px-5 font-sans font-medium">{tag.name_ar || '—'}</td>
                      <td className="py-3 px-5 font-mono text-white/50">{linkedCount} works</td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTagEditTrigger(tag)}
                            className="p-1.5 border border-white/10 bg-white/5 text-white/70 hover:border-gold hover:text-gold transition-colors duration-300"
                            aria-label="Edit tag"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleTagDeleteCall(tag)}
                            className="p-1.5 border border-white/10 bg-white/5 text-red-400 hover:border-red-500 hover:bg-red-950/20 transition-colors duration-300"
                            aria-label="Delete tag"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
}
