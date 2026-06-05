import React from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  FolderOpen, 
  Tag as TagIcon, 
  Settings, 
  Edit 
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'add_project' | 'manage_projects' | 'tags' | 'contact_settings' | 'site_content';
  setActiveTab: (tab: 'dashboard' | 'add_project' | 'manage_projects' | 'tags' | 'contact_settings' | 'site_content') => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean) => void;
  lang: 'en' | 'ar';
  editingProjectId: string | null;
  setEditingProjectId: (val: string | null) => void;
  resetForm: () => void;
  resetTagForm: () => void;
  tags: any[];
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  lang,
  editingProjectId,
  setEditingProjectId,
  resetForm,
  resetTagForm,
  tags
}: AdminSidebarProps) {
  return (
    <aside 
      className={`fixed lg:sticky top-[73px] h-[calc(100vh-73px)] z-30 lg:z-10 w-64
      bg-slate-950
      border-r border-white/10
      flex flex-col justify-between p-6
      transition-transform duration-500 transform lg:translate-x-0 ${
        isMobileSidebarOpen 
          ? 'translate-x-0' 
          : lang === 'ar' ? 'translate-x-64 lg:translate-x-0' : '-translate-x-64 lg:translate-x-0'
      }`}
    >
      <div className="space-y-8">
        <div className="hidden lg:block">
          <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase font-mono block mb-2 font-bold select-none">
            Navigation
          </span>
          <div className="w-12 h-px bg-gold/30" />
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 border flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-transparent text-white/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-widest text-left">Dashboard</span>
          </button>

          <button
            onClick={() => {
              setEditingProjectId(null);
              resetForm();
              setActiveTab('add_project');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 border flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'add_project' && !editingProjectId
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-transparent text-white/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-widest text-left">Add Project</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('manage_projects');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 border flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'manage_projects'
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-transparent text-white/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <FolderOpen className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-widest text-left">Manage Projects</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tags');
              resetTagForm();
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 border flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'tags'
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-transparent text-white/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <TagIcon className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-widest text-left">Tags Manager</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('contact_settings');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 border flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'contact_settings'
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-transparent text-white/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-widest text-left">Contact Settings</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('site_content');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full px-4 py-3 border flex items-center gap-3 transition-all duration-300 ${
              activeTab === 'site_content'
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-transparent text-white/70 hover:text-gold hover:bg-white/5'
            }`}
          >
            <Edit className="w-4 h-4 shrink-0" />
            <span className="text-xs uppercase tracking-widest text-left">Site Content (CMS)</span>
          </button>
        </nav>
      </div>

      <div className="bg-slate-950 p-4 border border-white/10 text-[10px] font-mono tracking-wide text-white/40 space-y-1 select-none">
        <p className="text-gold font-semibold uppercase mb-1">System Info</p>
        <p>Database: Unified Storage</p>
        <p>Role: Atelier Director</p>
        <p>Active Tags: {tags.length}</p>
      </div>
    </aside>
  );
}
