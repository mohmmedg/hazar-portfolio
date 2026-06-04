import React from 'react';
import { motion } from 'motion/react';
import { 
  FolderOpen, 
  Tag as TagIcon, 
  Star, 
  Settings, 
  TrendingUp, 
  Plus 
} from 'lucide-react';

interface AdminDashboardProps {
  totalProjectsCount: number;
  tags: any[];
  projects: any[];
  contactSettings: any;
  categoryBreakdown: Record<string, number>;
  setActiveTab: (tab: 'dashboard' | 'add_project' | 'manage_projects' | 'tags' | 'contact_settings' | 'site_content') => void;
}

export default function AdminDashboard({
  totalProjectsCount,
  tags,
  projects,
  contactSettings,
  categoryBreakdown,
  setActiveTab
}: AdminDashboardProps) {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-white uppercase mb-1">
          System Overview
        </h2>
        <p className="text-xs text-white/50 tracking-wider">
          Administrative workspace with live telemetry and data records
        </p>
        <div className="w-16 h-px bg-gold/50 mt-4" />
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total projects */}
        <div className="glass-panel p-6 border border-white/12 relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-gold/30 bg-gold/5 flex items-center justify-center text-gold shrink-0">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono block">
                Total Works
              </span>
              <p className="text-2xl font-serif font-extrabold text-white mt-1 leading-none">
                {totalProjectsCount}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Total Tags */}
        <div className="glass-panel p-6 border border-white/12 relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-gold/30 bg-gold/5 flex items-center justify-center text-gold shrink-0">
              <TagIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono block">
                Total Taxonomy Tags
              </span>
              <p className="text-2xl font-serif font-extrabold text-white mt-1 leading-none">
                {tags.length}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Featured items status */}
        <div className="glass-panel p-6 border border-white/12 relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-gold/30 bg-gold/5 flex items-center justify-center text-gold shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono block">
                Featured Showcase
              </span>
              <p className="text-2xl font-serif font-extrabold text-white mt-1 leading-none">
                {projects.filter(p => p.featured).length}
              </p>
            </div>
          </div>
        </div>

        {/* Card 4: Last updated contact metadata */}
        <div className="glass-panel p-6 border border-white/12 relative overflow-hidden group hover:border-gold/30 transition-all duration-500">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-gold/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-gold/30 bg-gold/5 flex items-center justify-center text-gold shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono block">
                Config Updated
              </span>
              <p className="text-[11px] text-white uppercase font-bold truncate mt-1 leading-tight">
                Contact Channels
              </p>
              <span className="text-[9px] font-mono text-gold leading-none">
                {contactSettings.updatedAt ? new Date(contactSettings.updatedAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-none border border-white/12">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold animate-bounce" />
            <span>Collection Breakdown</span>
          </h3>

          <div className="space-y-4">
            {['Living Room', 'Dining Room', 'Bedroom', 'Kitchen', 'Entrance', 'Exterior'].map(cat => {
              const count = categoryBreakdown[cat] || 0;
              const percentage = totalProjectsCount > 0 ? (count / totalProjectsCount) * 100 : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/70 hover:text-white transition-colors uppercase tracking-wider font-medium">{cat}</span>
                    <span className="font-mono text-gold font-bold">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-none overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.0, ease: 'easeOut' }}
                      className="h-full bg-gold" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-none border border-white/12 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              System Diagnostics
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-light mb-6">
              Changes committed on this portal are saved to the web application's persistent local cache immediately. Both the public creative portfolio gallery and contact cards will re-render reactive and updated nodes simultaneously.
            </p>
            
            <div className="space-y-2 border-y border-white/10 py-4 font-mono text-[10px] text-white/50 space-y-1.5">
              <div className="flex justify-between">
                <span>STORAGE ADAPTER:</span>
                <span className="text-gold">localStorage://hazar_projects</span>
              </div>
              <div className="flex justify-between">
                <span>SYSTEM ENCRYPTION:</span>
                <span className="text-emerald-400">SESSION_ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>WORKSPACE ROLE:</span>
                <span className="text-white">ATELIER DIRECTEUR DESIGNATE</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setActiveTab('add_project')}
              className="w-full py-3.5 bg-gradient-to-r from-gold to-[#8A6D25] text-navy-dark text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] inline-flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Project</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
