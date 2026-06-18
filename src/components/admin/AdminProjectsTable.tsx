import React from 'react';
import { motion } from 'motion/react';
import { Search, FolderOpen, Star, Edit, Trash2, X } from 'lucide-react';
import { Tag } from '../../types';

interface AdminProjectsTableProps {
  processedProjectsList: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterCategory: string;
  setFilterCategory: (val: string) => void;
  deletingProjectId: string | null;
  projectTags: any[];
  tags: any[];
  toggleProjectFeatured: (id: string) => void;
  handleEditTrigger: (project: any) => void;
  handleDeleteTrigger: (project: any) => void;
}

export default function AdminProjectsTable({
  processedProjectsList,
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  deletingProjectId,
  projectTags,
  tags,
  toggleProjectFeatured,
  handleEditTrigger,
  handleDeleteTrigger
}: AdminProjectsTableProps) {
  return (
    <motion.div
      key="manage_projects"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-white uppercase mb-1">
          Manage Projects
        </h2>
        <p className="text-xs text-white/50 tracking-wider">
          Query, edit or remove works from the Atelier database index
        </p>
        <div className="w-16 h-px bg-gold/50 mt-4" />
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-panel p-4 border border-white/10">
        <div className="relative w-full md:w-96 select-none">
          <span className="absolute inset-y-0 left-4 flex items-center text-white/30 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            className="w-full py-3 pl-11 pr-5 rounded-none bg-white/5 border border-white/10 hover:border-white/15 focus:border-gold outline-none text-xs text-white placeholder-white/30 tracking-wider"
            placeholder="Search works..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] tracking-widest text-white/40 uppercase font-mono font-bold">
            Filter Category:
          </span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="py-3 px-4 rounded-none bg-navy-dark text-xs text-white border border-white/10 focus:border-gold outline-none select-none cursor-pointer"
          >
            <option value="all">All Category Items</option>
            <option value="Living Room">Living Room</option>
            <option value="Dining Room">Dining Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Entrance">Entrance</option>
            <option value="Exterior">Exterior</option>
          </select>
        </div>
      </div>

      {/* MAIN PROJECTS TABLE */}
      <div className="glass-panel overflow-x-auto border border-white/12">
        {processedProjectsList.length === 0 ? (
          <div className="p-16 text-center select-none">
            <FolderOpen className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-white/60 text-sm tracking-wider font-medium">No results found</p>
            <p className="text-white/30 text-xs mt-1">Try adapting your search term or category filters</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/15 text-[10px] uppercase tracking-widest text-white/40 font-mono font-bold bg-white/2 whitespace-nowrap">
                <th className="py-4 px-6">Thumbnail</th>
                <th className="py-4 px-6">Work Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Assigned Tags</th>
                <th className="py-4 px-6">Date Added</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {processedProjectsList.map((proj) => {
                const isCurrentlyDeleting = proj.id === deletingProjectId;
                const currentTagsLinked = projectTags
                  .filter(pt => pt.project_id === proj.id)
                  .map(pt => tags.find(t => t.id === pt.tag_id))
                  .filter(Boolean) as Tag[];

                return (
                  <tr 
                    key={proj.id}
                    className={`hover:bg-white/2 transition-all duration-300 ${
                      isCurrentlyDeleting ? 'opacity-0 scale-95 duration-300' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="w-12 h-12 border border-white/10 overflow-hidden bg-black/45 md:hover:scale-110 transition-transform duration-300 shrink-0">
                        {proj.images[0] ? (
                          <img
                            src={proj.images[0]}
                            alt="Project preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <X className="w-4 h-4 text-white/20" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-serif text-white font-bold tracking-wide">
                      <div className="max-w-xs">
                        <span className="block truncate">{proj.name}</span>
                        <span className="block text-[10px] text-white/40 font-sans font-light truncate mt-0.5">
                          {proj.description || 'No description listed'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-gold text-[10px] uppercase font-semibold">
                      {proj.category}
                    </td>

                    {/* Associated Tags list Column */}
                    <td className="py-4 px-6 font-sans">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {currentTagsLinked.length === 0 ? (
                          <span className="text-white/30 text-[10px]">—</span>
                        ) : (
                          currentTagsLinked.map(t => (
                            <span
                              key={t.id}
                              className="text-[9px] px-1.5 py-0.5 font-semibold text-white/80 shrink-0 border border-white/10"
                              style={{ backgroundColor: (t.color || '#C9A84C') + '15', borderColor: (t.color || '#C9A84C') + '30' }}
                            >
                              {t.name}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-white/70">
                      {proj.dateAdded}
                    </td>

                    <td className="py-4 px-6 text-center select-none">
                      <button
                        onClick={() => toggleProjectFeatured(proj.id)}
                        className={`p-1.5 border justify-center mx-auto transition-colors duration-300 flex items-center shrink-0 ${
                          proj.featured 
                            ? 'border-gold bg-gold/15 text-gold' 
                            : 'border-white/15 bg-white/3 text-white/30 hover:border-gold/50'
                        }`}
                        aria-label="Toggle Featured showcase"
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-gold' : ''}`} />
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleEditTrigger(proj)}
                          className="p-2 border border-white/15 bg-white/5 text-white/70 hover:border-gold hover:text-gold transition-colors duration-300"
                          aria-label="Edit project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteTrigger(proj)}
                          className="p-2 border border-white/15 bg-white/5 text-red-400 hover:border-red-500 hover:bg-red-950/15 transition-colors duration-300"
                          aria-label="Delete project"
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
    </motion.div>
  );
}
