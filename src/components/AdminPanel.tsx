/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LogOut, ExternalLink, Grid } from 'lucide-react';
import { Tag, ProjectTag, ContactSettings, SiteContent, ServiceCMS, TestimonialCMS } from '../types';
import Logo from './Logo';
import useAuth from '../hooks/useAuth';
import { saveProject, saveTags, saveProjectTags, saveContactSettings, saveSiteContent, saveServices, saveTestimonials, deleteProject, deleteService, deleteTestimonial, deleteTag } from '../lib/db';

// Import newly refactored sub-components
import AdminToast from './admin/AdminToast';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboard from './admin/AdminDashboard';
import AdminProjectForm from './admin/AdminProjectForm';
import AdminProjectsTable from './admin/AdminProjectsTable';
import AdminTagsManager from './admin/AdminTagsManager';
import AdminContactForm from './admin/AdminContactForm';
import AdminCmsEditor from './admin/AdminCmsEditor';
import AdminDeleteModal from './admin/AdminDeleteModal';

export interface AdminProject {
  id: string;
  name: string;
  category: 'Living Room' | 'Dining Room' | 'Bedroom' | 'Kitchen' | 'Entrance' | 'Exterior';
  description: string;
  images: string[];
  featured: boolean;
  dateAdded: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface AdminPanelProps {
  onBackToSite: () => void;
  lang: 'en' | 'ar';
  projects: AdminProject[];
  setProjects: (projects: AdminProject[]) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  projectTags: ProjectTag[];
  setProjectTags: (projectTags: ProjectTag[]) => void;
  contactSettings: ContactSettings;
  setContactSettings: (settings: ContactSettings) => void;
  siteContent: SiteContent[];
  setSiteContent: (content: SiteContent[]) => void;
  services: ServiceCMS[];
  setServices: (services: ServiceCMS[]) => void;
  testimonials: TestimonialCMS[];
  setTestimonials: (testimonials: TestimonialCMS[]) => void;
}

export default function AdminPanel({ 
  onBackToSite, 
  lang,
  projects,
  setProjects,
  tags,
  setTags,
  projectTags,
  setProjectTags,
  contactSettings,
  setContactSettings,
  siteContent,
  setSiteContent,
  services,
  setServices,
  testimonials,
  setTestimonials
}: AdminPanelProps) {
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'add_project' | 'manage_projects' | 'tags' | 'contact_settings' | 'site_content'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [cmsSection, setCmsSection] = useState<'hero' | 'about' | 'services' | 'testimonials' | 'contact' | 'footer'>('hero');
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(true);
  const [editingContent, setEditingContent] = useState<SiteContent[]>([]);

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvTitleEn, setSrvTitleEn] = useState('');
  const [srvTitleAr, setSrvTitleAr] = useState('');
  const [srvDescEn, setSrvDescEn] = useState('');
  const [srvDescAr, setSrvDescAr] = useState('');
  const [srvIcon, setSrvIcon] = useState('Compass');
  const [srvActive, setSrvActive] = useState(true);

  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [tstClientEn, setTstClientEn] = useState('');
  const [tstClientAr, setTstClientAr] = useState('');
  const [tstTextEn, setTstTextEn] = useState('');
  const [tstTextAr, setTstTextAr] = useState('');
  const [tstRating, setTstRating] = useState<number>(5);
  const [tstActive, setTstActive] = useState(true);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Living Room' | 'Dining Room' | 'Bedroom' | 'Kitchen' | 'Entrance' | 'Exterior'>('Living Room');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ name?: string; images?: string }>({});
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  const [formTagName, setFormTagName] = useState('');
  const [formTagNameAr, setFormTagNameAr] = useState('');
  const [formTagColor, setFormTagColor] = useState('#C9A84C');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactInstagram, setContactInstagram] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLocation, setContactLocation] = useState('');
  const [contactLocationAr, setContactLocationAr] = useState('');
  const [contactTagline, setContactTagline] = useState('');
  const [contactTaglineAr, setContactTaglineAr] = useState('');
  const [contactStudioDesc, setContactStudioDesc] = useState('');
  const [contactStudioDescAr, setContactStudioDescAr] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [projectToDelete, setProjectToDelete] = useState<AdminProject | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync editing content on tab change
  useEffect(() => {
    if (siteContent && siteContent.length > 0) {
      setEditingContent(JSON.parse(JSON.stringify(siteContent)));
    }
  }, [siteContent, activeTab]);

  // Sync Contact Form on settings loaded
  useEffect(() => {
    if (contactSettings) {
      setContactWhatsapp(contactSettings.whatsapp_number || '');
      setContactInstagram(contactSettings.instagram_url || '');
      setContactEmail(contactSettings.email || '');
      setContactPhone(contactSettings.phone || '');
      setContactLocation(contactSettings.location || '');
      setContactLocationAr(contactSettings.location_ar || '');
      setContactTagline(contactSettings.tagline || '');
      setContactTaglineAr(contactSettings.tagline_ar || '');
      setContactStudioDesc(contactSettings.studio_description || '');
      setContactStudioDescAr(contactSettings.studio_description_ar || '');
    }
  }, [contactSettings]);

  const triggerToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {}
    triggerToast('success', 'Logged out successfully');
  };

  // --- SITE CONTENT (CMS) ---
  const handleCmsImageUpload = (e: React.ChangeEvent<HTMLInputElement>, itemKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEditingContent(prev => prev.map(item => item.key === itemKey ? { ...item, value_en: base64, value_ar: base64 } : item));
      triggerToast('success', 'Image uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCmsSection = (e: React.FormEvent) => {
    e.preventDefault();
    const sectionKeys: Record<string, string[]> = {
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

    const keysToValidate = sectionKeys[cmsSection];
    if (!keysToValidate) return;

    let hasErrors = false;
    editingContent.forEach(item => {
      if (keysToValidate.includes(item.key)) {
        if (!item.value_en?.trim() || !item.value_ar?.trim()) hasErrors = true;
      }
    });

    if (hasErrors) {
      triggerToast('error', 'Please fill in translations for all language inputs');
      return;
    }

    setSiteContent(editingContent);
    saveSiteContent(editingContent).catch(err => {
      console.error('Failed to save site content:', err);
      triggerToast('error', 'Failed to save site content. Check your connection.');
    });
    triggerToast('success', `Saved [${cmsSection.toUpperCase()}] content successfully ✓`);
  };

  // The Brand Logo save was previously fire-and-forget with zero success/error
  // feedback and never synced the global `siteContent` state, so a failed
  // save (RLS rejection, oversized base64 payload, network error, etc.)
  // looked exactly like a successful one — nothing happened on screen.
  const handleSaveLogo = async () => {
    setSiteContent(editingContent);
    try {
      await saveSiteContent(editingContent);
      triggerToast('success', 'Logo saved successfully ✓');
    } catch (err) {
      console.error('Failed to save logo:', err);
      triggerToast('error', 'Failed to save logo. The image may be too large, or your account may lack admin permissions.');
      throw err;
    }
  };

  // --- SERVICES CRUD ---
  const handleEditServiceTrigger = (srv: ServiceCMS) => {
    setEditingServiceId(srv.id);
    setSrvTitleEn(srv.title_en);
    setSrvTitleAr(srv.title_ar);
    setSrvDescEn(srv.description_en);
    setSrvDescAr(srv.description_ar);
    setSrvIcon(srv.icon || 'Compass');
    setSrvActive(srv.active);
  };

  const handleCancelServiceEdit = () => {
    setEditingServiceId(null);
    setSrvTitleEn(''); setSrvTitleAr('');
    setSrvDescEn(''); setSrvDescAr('');
    setSrvIcon('Compass'); setSrvActive(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitleEn.trim() || !srvTitleAr.trim() || !srvDescEn.trim() || !srvDescAr.trim()) {
      triggerToast('error', 'All fields are mandatory to save service');
      return;
    }

    let updated: ServiceCMS[];
    if (editingServiceId) {
      updated = services.map(s => s.id === editingServiceId ? {
        ...s, title_en: srvTitleEn, title_ar: srvTitleAr,
        description_en: srvDescEn, description_ar: srvDescAr,
        icon: srvIcon, active: srvActive
      } : s);
      triggerToast('success', 'Service modified successfully ✓');
      setEditingServiceId(null);
    } else {
      const newSrv: ServiceCMS = {
        id: 'srv_' + Date.now().toString(),
        title_en: srvTitleEn, title_ar: srvTitleAr,
        description_en: srvDescEn, description_ar: srvDescAr,
        icon: srvIcon, active: srvActive,
        display_order: services.length + 1
      };
      updated = [...services, newSrv];
      triggerToast('success', 'Added new service card ✓');
    }
    setServices(updated);
    saveServices(updated).catch(err => {
      console.error('Failed to save services:', err);
      triggerToast('error', 'Failed to save services. Check your connection.');
    });
    handleCancelServiceEdit();
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id);
    } catch (err) {
      console.error('Delete service error:', err);
      triggerToast('error', 'Failed to delete service');
      return;
    }
    setServices(services.filter(s => s.id !== id));
    triggerToast('success', 'Service deleted successfully');
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= services.length) return;
    const list = [...services];
    [list[index], list[targetIdx]] = [list[targetIdx], list[index]];
    const reordered = list.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setServices(reordered);
    saveServices(reordered).catch(err => console.error('Failed to save services order:', err));
    triggerToast('success', 'Order updated');
  };

  // --- TESTIMONIALS CRUD ---
  const handleEditTestimonialTrigger = (tst: TestimonialCMS) => {
    setEditingTestimonialId(tst.id);
    setTstClientEn(tst.client_name_en); setTstClientAr(tst.client_name_ar);
    setTstTextEn(tst.text_en); setTstTextAr(tst.text_ar);
    setTstRating(tst.rating || 5); setTstActive(tst.active);
  };

  const handleCancelTestimonialEdit = () => {
    setEditingTestimonialId(null);
    setTstClientEn(''); setTstClientAr('');
    setTstTextEn(''); setTstTextAr('');
    setTstRating(5); setTstActive(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tstClientEn.trim() || !tstClientAr.trim() || !tstTextEn.trim() || !tstTextAr.trim()) {
      triggerToast('error', 'All fields are required to save client review');
      return;
    }

    let updated: TestimonialCMS[];
    if (editingTestimonialId) {
      updated = testimonials.map(t => t.id === editingTestimonialId ? {
        ...t, client_name_en: tstClientEn, client_name_ar: tstClientAr,
        text_en: tstTextEn, text_ar: tstTextAr,
        rating: tstRating, active: tstActive
      } : t);
      triggerToast('success', 'Review modified successfully ✓');
      setEditingTestimonialId(null);
    } else {
      const newTst: TestimonialCMS = {
        id: 'tst_' + Date.now().toString(),
        client_name_en: tstClientEn, client_name_ar: tstClientAr,
        text_en: tstTextEn, text_ar: tstTextAr,
        rating: tstRating, active: tstActive,
        display_order: testimonials.length + 1
      };
      updated = [...testimonials, newTst];
      triggerToast('success', 'Added new testimonial citation ✓');
    }
    setTestimonials(updated);
    saveTestimonials(updated).catch(err => {
      console.error('Failed to save testimonials:', err);
      triggerToast('error', 'Failed to save testimonials. Check your connection.');
    });
    handleCancelTestimonialEdit();
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteTestimonial(id);
    } catch (err) {
      console.error('Delete testimonial error:', err);
      triggerToast('error', 'Failed to delete testimonial');
      return;
    }
    setTestimonials(testimonials.filter(t => t.id !== id));
    triggerToast('success', 'Testimonial removed successfully');
  };

  const handleMoveTestimonial = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= testimonials.length) return;
    const list = [...testimonials];
    [list[index], list[targetIdx]] = [list[targetIdx], list[index]];
    const reordered = list.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setTestimonials(reordered);
    saveTestimonials(reordered).catch(err => console.error('Failed to save testimonials order:', err));
    triggerToast('success', 'Order updated');
  };

  // --- IMAGE UPLOAD ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileList = Array.from(files) as File[];
    if (formImages.length + fileList.length > 10) {
      triggerToast('error', 'Maximum limit of 10 images per project exceeded');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setIsProcessingImages(true);
    setFormErrors(prev => ({ ...prev, images: undefined }));
    const base64Promises: Promise<string>[] = [];
    for (const file of fileList) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        triggerToast('error', `${file.name} has unsupported format. Choose JPG, PNG, or WEBP only.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        triggerToast('error', `${file.name} exceeds maximum size of 5MB.`);
        continue;
      }
      base64Promises.push(new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      }));
    }
    try {
      const results = await Promise.all(base64Promises);
      if (results.length === 0) {
        triggerToast('error', 'No valid images were selected. Check file formats and sizes.');
        return;
      }
      setFormImages(prev => [...prev, ...results]);
      triggerToast('success', `${results.length} image(s) processed successfully`);
    } catch (err) {
      triggerToast('error', 'Error in processing image data. Please try again.');
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFormImage = (indexToRemove: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const resetForm = () => {
    setEditingProjectId(null);
    setFormName(''); setFormCategory('Living Room');
    setFormImages([]); setFormDescription('');
    setFormFeatured(false); setSelectedTagIds([]);
    setFormErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- PROJECT FORM SUBMIT ---
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; images?: string } = {};
    if (!formName.trim()) errors.name = 'Project Name is required';
    if (formImages.length === 0) errors.images = 'At least one project image is required';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      triggerToast('error', 'Please fill in all required fields');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const targetProjId = editingProjectId || 'proj_' + Date.now().toString();

    if (editingProjectId) {
      const updated = projects.map(proj => proj.id === editingProjectId ? {
        ...proj, name: formName, category: formCategory,
        description: formDescription, images: formImages, featured: formFeatured
      } : proj);
      setProjects(updated);
      updated.forEach(proj => {
        if (proj.id === editingProjectId) {
          saveProject(proj).catch(err => {
            console.error('Failed to save project:', err);
            triggerToast('error', 'Failed to save project. Check your connection.');
          });
        }
      });
      const filteredProjTags = projectTags.filter(pt => pt.project_id !== editingProjectId);
      const newProjTags = selectedTagIds.map(tagId => ({ project_id: editingProjectId, tag_id: tagId }));
      const updatedProjTags = [...filteredProjTags, ...newProjTags];
      setProjectTags(updatedProjTags);
      saveProjectTags(updatedProjTags).catch(err => console.error('Failed to save project tags:', err));
      triggerToast('success', 'Project updated successfully ✓');
    } else {
      const newProj: AdminProject = {
        id: targetProjId, name: formName, category: formCategory,
        description: formDescription, images: formImages,
        featured: formFeatured, dateAdded: todayStr
      };
      setProjects([newProj, ...projects]);
      saveProject(newProj).catch(err => {
        console.error('Failed to save project:', err);
        triggerToast('error', 'Failed to save project. Check your connection.');
      });
      const newProjTags = selectedTagIds.map(tagId => ({ project_id: targetProjId, tag_id: tagId }));
      const updatedProjTags = [...projectTags, ...newProjTags];
      setProjectTags(updatedProjTags);
      saveProjectTags(updatedProjTags).catch(err => console.error('Failed to save project tags:', err));
      triggerToast('success', 'Project added successfully ✓');
    }

    resetForm();
    setActiveTab('manage_projects');
  };

  const toggleProjectFeatured = (id: string) => {
    const updated = projects.map(proj => {
      if (proj.id === id) {
        const nextState = !proj.featured;
        triggerToast('success', `Project marked as ${nextState ? 'featured ✦' : 'standard'}`);
        const updatedProj = { ...proj, featured: nextState };
        saveProject(updatedProj).catch(err => console.error('Failed to save project:', err));
        return updatedProj;
      }
      return proj;
    });
    setProjects(updated);
  };

  const handleEditTrigger = (project: AdminProject) => {
    setEditingProjectId(project.id);
    setFormName(project.name); setFormCategory(project.category);
    setFormImages(project.images); setFormDescription(project.description);
    setFormFeatured(project.featured); setFormErrors({});
    setSelectedTagIds(projectTags.filter(pt => pt.project_id === project.id).map(pt => pt.tag_id));
    setActiveTab('add_project');
  };

  const handleDeleteTrigger = (project: AdminProject) => {
    setProjectToDelete(project);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setDeletingProjectId(projectToDelete.id);
    try {
      await deleteProject(projectToDelete.id);
    } catch (err) {
      console.error('Delete error:', err);
      triggerToast('error', 'Failed to delete project');
      setDeletingProjectId(null);
      return;
    }
    setTimeout(() => {
      setProjects(projects.filter(proj => proj.id !== projectToDelete.id));
      setProjectTags(projectTags.filter(pt => pt.project_id !== projectToDelete.id));
      triggerToast('success', 'Project removed successfully from records');
      setProjectToDelete(null);
      setDeletingProjectId(null);
    }, 300);
  };

  // --- TAGS CRUD ---
  const resetTagForm = () => {
    setFormTagName(''); setFormTagNameAr('');
    setFormTagColor('#C9A84C'); setEditingTagId(null);
  };

  const handleTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTagName.trim() || !formTagNameAr.trim()) {
      triggerToast('error', 'Tag values are required');
      return;
    }

    let updated: Tag[];
    if (editingTagId) {
      updated = tags.map(t => t.id === editingTagId
        ? { ...t, name: formTagName.trim(), name_ar: formTagNameAr.trim(), color: formTagColor }
        : t);
      triggerToast('success', 'Tag updated successfully ✓');
    } else {
      const newTag: Tag = {
        id: 't_' + Date.now().toString(),
        name: formTagName.trim(), name_ar: formTagNameAr.trim(),
        color: formTagColor, created_at: new Date().toISOString()
      };
      updated = [...tags, newTag];
      triggerToast('success', 'Tag created successfully ✦');
    }
    setTags(updated);
    saveTags(updated).catch(err => {
      console.error('Failed to save tags:', err);
      triggerToast('error', 'Failed to save tags. Check your connection.');
    });
    resetTagForm();
  };

  const handleTagEditTrigger = (tagItem: Tag) => {
    setFormTagName(tagItem.name);
    setFormTagNameAr(tagItem.name_ar || '');
    setFormTagColor(tagItem.color || '#C9A84C');
    setEditingTagId(tagItem.id);
  };

  const handleTagDeleteCall = async (tagItem: Tag) => {
    try {
      await deleteTag(tagItem.id);
    } catch (err) {
      console.error('Delete tag error:', err);
      triggerToast('error', 'Failed to delete tag');
      return;
    }
    setTags(tags.filter(t => t.id !== tagItem.id));
    setProjectTags(projectTags.filter(pt => pt.tag_id !== tagItem.id));
    triggerToast('success', `Tag "${tagItem.name}" deleted from index`);
  };

  // --- CONTACT SETTINGS ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\+\-\(\)\s]+$/;
    const errors: string[] = [];
    if (!contactWhatsapp.trim()) errors.push('WhatsApp number is required');
    if (!contactInstagram.trim()) errors.push('Instagram URL is required');
    if (!contactEmail.trim()) errors.push('Email is required');
    else if (!emailRegex.test(contactEmail)) errors.push('Please enter a valid email address');
    if (!contactPhone.trim()) errors.push('Phone number is required');
    else if (!phoneRegex.test(contactPhone)) errors.push('Please enter a valid phone number');
    if (!contactLocation.trim()) errors.push('Location (English) is required');
    if (!contactLocationAr.trim()) errors.push('Location (Arabic) is required');
    if (!contactTagline.trim()) errors.push('Tagline (English) is required');
    if (!contactTaglineAr.trim()) errors.push('Tagline (Arabic) is required');
    if (!contactStudioDesc.trim()) errors.push('Studio description (English) is required');
    if (!contactStudioDescAr.trim()) errors.push('Studio description (Arabic) is required');
    if (errors.length > 0) { triggerToast('error', errors[0]); return; }

    const updated: ContactSettings = {
      whatsapp_number: contactWhatsapp.trim(),
      instagram_url: contactInstagram.trim(),
      email: contactEmail.trim(),
      phone: contactPhone.trim(),
      location: contactLocation.trim(),
      location_ar: contactLocationAr.trim(),
      tagline: contactTagline.trim(),
      tagline_ar: contactTaglineAr.trim(),
      studio_description: contactStudioDesc.trim(),
      studio_description_ar: contactStudioDescAr.trim()
    };
    setContactSettings(updated);
    saveContactSettings(updated).catch(err => {
      console.error('Failed to save contact settings:', err);
      triggerToast('error', 'Failed to save contact settings. Check your connection.');
    });
    triggerToast('success', 'Contact Settings configuration saved ✓');
  };

  const processedProjectsList = projects.filter(proj => {
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || proj.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProjectsCount = projects.length;
  const categoryBreakdown = projects.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen relative bg-navy-dark flex flex-col font-sans selection:bg-gold/30 selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gold/2 opacity-30 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-navy-light/30 opacity-30 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-40 w-full glass-panel-m border-b border-white/10 px-6 py-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Logo variant="emblem" className="w-10 h-10 text-gold" imageUrl={siteContent?.find(i => i.key === 'brand_logo_image')?.value_en || undefined} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif text-sm tracking-widest text-gold uppercase font-bold leading-none">
              HAZAR ARCHITECTURE
            </h1>
            <span className="text-[9px] tracking-[0.25em] text-white/50 uppercase font-mono font-semibold mt-0.5">
              Premium Admin Panel
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSite}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 border border-white/15 bg-white/5 text-white/90 text-xs tracking-wider uppercase hover:border-gold hover:text-white transition-all duration-300"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
            <span>Public Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gold/60 bg-gold/5 hover:bg-gold/15 text-gold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-all duration-300 select-none cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 border border-white/10 bg-white/5 text-white hover:text-gold transition-colors duration-300"
            aria-label="Toggle Side Area"
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => { setActiveTab(tab); setIsMobileSidebarOpen(false); }}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          lang={lang}
          editingProjectId={editingProjectId}
          setEditingProjectId={setEditingProjectId}
          resetForm={resetForm}
          resetTagForm={resetTagForm}
          tags={tags}
        />

        <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full lg:max-w-[calc(100vw-256px)] select-text relative">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              totalProjectsCount={totalProjectsCount}
              tags={tags}
              projects={projects}
              contactSettings={contactSettings}
              categoryBreakdown={categoryBreakdown}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'add_project' && (
            <AdminProjectForm
              editingProjectId={editingProjectId}
              formName={formName} setFormName={setFormName}
              formCategory={formCategory} setFormCategory={setFormCategory}
              formFeatured={formFeatured} setFormFeatured={setFormFeatured}
              tags={tags}
              selectedTagIds={selectedTagIds} setSelectedTagIds={setSelectedTagIds}
              formDescription={formDescription} setFormDescription={setFormDescription}
              isProcessingImages={isProcessingImages}
              formImages={formImages} removeFormImage={removeFormImage}
              formErrors={formErrors}
              fileInputRef={fileInputRef}
              handleImageUpload={handleImageUpload}
              handleFormSubmit={handleFormSubmit}
              resetForm={resetForm}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'manage_projects' && (
            <AdminProjectsTable
              processedProjectsList={processedProjectsList}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              filterCategory={filterCategory} setFilterCategory={setFilterCategory}
              deletingProjectId={deletingProjectId}
              projectTags={projectTags} tags={tags}
              toggleProjectFeatured={toggleProjectFeatured}
              handleEditTrigger={handleEditTrigger}
              handleDeleteTrigger={handleDeleteTrigger}
            />
          )}
          {activeTab === 'tags' && (
            <AdminTagsManager
              editingTagId={editingTagId}
              formTagName={formTagName} setFormTagName={setFormTagName}
              formTagNameAr={formTagNameAr} setFormTagNameAr={setFormTagNameAr}
              formTagColor={formTagColor} setFormTagColor={setFormTagColor}
              resetTagForm={resetTagForm}
              handleTagSubmit={handleTagSubmit}
              tags={tags} projectTags={projectTags}
              handleTagEditTrigger={handleTagEditTrigger}
              handleTagDeleteCall={handleTagDeleteCall}
            />
          )}
          {activeTab === 'contact_settings' && (
            <AdminContactForm
              handleContactSubmit={handleContactSubmit}
              contactWhatsapp={contactWhatsapp} setContactWhatsapp={setContactWhatsapp}
              contactInstagram={contactInstagram} setContactInstagram={setContactInstagram}
              contactEmail={contactEmail} setContactEmail={setContactEmail}
              contactPhone={contactPhone} setContactPhone={setContactPhone}
              contactLocation={contactLocation} setContactLocation={setContactLocation}
              contactLocationAr={contactLocationAr} setContactLocationAr={setContactLocationAr}
              contactTagline={contactTagline} setContactTagline={setContactTagline}
              contactTaglineAr={contactTaglineAr} setContactTaglineAr={setContactTaglineAr}
              contactStudioDesc={contactStudioDesc} setContactStudioDesc={setContactStudioDesc}
              contactStudioDescAr={contactStudioDescAr} setContactStudioDescAr={setContactStudioDescAr}
            />
          )}
          {activeTab === 'site_content' && (
            <AdminCmsEditor
              cmsSection={cmsSection} setCmsSection={setCmsSection}
              isPreviewEnabled={isPreviewEnabled} setIsPreviewEnabled={setIsPreviewEnabled}
              editingContent={editingContent} setEditingContent={setEditingContent}
              handleCmsImageUpload={handleCmsImageUpload}
              handleSaveCmsSection={handleSaveCmsSection}
              handleSaveLogo={handleSaveLogo}
              triggerToast={triggerToast}
              services={services} testimonials={testimonials}
              srvTitleEn={srvTitleEn} setSrvTitleEn={setSrvTitleEn}
              srvTitleAr={srvTitleAr} setSrvTitleAr={setSrvTitleAr}
              srvDescEn={srvDescEn} setSrvDescEn={setSrvDescEn}
              srvDescAr={srvDescAr} setSrvDescAr={setSrvDescAr}
              srvIcon={srvIcon} setSrvIcon={setSrvIcon}
              srvActive={srvActive} setSrvActive={setSrvActive}
              editingServiceId={editingServiceId}
              handleCancelServiceEdit={handleCancelServiceEdit}
              handleSaveService={handleSaveService}
              handleMoveService={handleMoveService}
              handleEditServiceTrigger={handleEditServiceTrigger}
              handleDeleteService={handleDeleteService}
              tstClientEn={tstClientEn} setTstClientEn={setTstClientEn}
              tstClientAr={tstClientAr} setTstClientAr={setTstClientAr}
              tstTextEn={tstTextEn} setTstTextEn={setTstTextEn}
              tstTextAr={tstTextAr} setTstTextAr={setTstTextAr}
              tstRating={tstRating} setTstRating={setTstRating}
              tstActive={tstActive} setTstActive={setTstActive}
              editingTestimonialId={editingTestimonialId}
              handleCancelTestimonialEdit={handleCancelTestimonialEdit}
              handleSaveTestimonial={handleSaveTestimonial}
              handleMoveTestimonial={handleMoveTestimonial}
              handleEditTestimonialTrigger={handleEditTestimonialTrigger}
              handleDeleteTestimonial={handleDeleteTestimonial}
            />
          )}
        </main>
      </div>

      <AdminDeleteModal
        projectToDelete={projectToDelete}
        setProjectToDelete={setProjectToDelete}
        confirmDeleteProject={confirmDeleteProject}
      />
      <AdminToast toasts={toasts} />
    </div>
  );
}
