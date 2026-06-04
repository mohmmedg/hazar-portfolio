/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LogOut, ExternalLink, Grid } from 'lucide-react';
import { Tag, ProjectTag, ContactSettings, SiteContent, ServiceCMS, TestimonialCMS } from '../types';
import Logo from './Logo';
import useAuth from '../hooks/useAuth';
import { saveProject, saveTags, saveProjectTags, saveContactSettings, saveSiteContent, saveServices, saveTestimonials } from '../lib/db';

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
  images: string[]; // array of base64 strings
  featured: boolean;
  dateAdded: string; // YYYY-MM-DD
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

  // Layout & Navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add_project' | 'manage_projects' | 'tags' | 'contact_settings' | 'site_content'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Site Content CMS tab states
  const [cmsSection, setCmsSection] = useState<'hero' | 'about' | 'services' | 'testimonials' | 'contact' | 'footer'>('hero');
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(true);
  const [editingContent, setEditingContent] = useState<SiteContent[]>([]);

  // Services CMS management states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvTitleEn, setSrvTitleEn] = useState('');
  const [srvTitleAr, setSrvTitleAr] = useState('');
  const [srvDescEn, setSrvDescEn] = useState('');
  const [srvDescAr, setSrvDescAr] = useState('');
  const [srvIcon, setSrvIcon] = useState('Compass');
  const [srvActive, setSrvActive] = useState(true);

  // Testimonials CMS management states
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [tstClientEn, setTstClientEn] = useState('');
  const [tstClientAr, setTstClientAr] = useState('');
  const [tstTextEn, setTstTextEn] = useState('');
  const [tstTextAr, setTstTextAr] = useState('');
  const [tstRating, setTstRating] = useState<number>(5);
  const [tstActive, setTstActive] = useState(true);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add/Edit Project Form States
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'Living Room' | 'Dining Room' | 'Bedroom' | 'Kitchen' | 'Entrance' | 'Exterior'>('Living Room');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  
  // Validation inline errors
  const [formErrors, setFormErrors] = useState<{ name?: string; images?: string }>({});
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  // Tags Manager form states
  const [formTagName, setFormTagName] = useState('');
  const [formTagNameAr, setFormTagNameAr] = useState('');
  const [formTagColor, setFormTagColor] = useState('#C9A84C');
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  // Contact Settings Form states
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

  // Manage Projects states (search, filter, delete confirmation + animation state)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [projectToDelete, setProjectToDelete] = useState<AdminProject | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Reference for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync editing content on change of source datasets
  useEffect(() => {
    if (siteContent && siteContent.length > 0) {
      setEditingContent(JSON.parse(JSON.stringify(siteContent)));
    }
  }, [siteContent, activeTab]);

  // Auto-save projects to Supabase/localStorage
  useEffect(() => {
    if (projects && projects.length > 0) {
      projects.forEach(proj => {
        saveProject(proj).catch(err => {
          console.error('Failed to save project:', err);
          triggerToast('error', 'Failed to save project. Check your connection.');
        });
      });
    }
  }, [projects]);

  // Auto-save tags to Supabase/localStorage
  useEffect(() => {
    if (tags && tags.length > 0) {
      saveTags(tags).catch(err => {
        console.error('Failed to save tags:', err);
        triggerToast('error', 'Failed to save tags. Check your connection.');
      });
    }
  }, [tags]);

  // Auto-save project tags to Supabase/localStorage
  useEffect(() => {
    if (projectTags && projectTags.length > 0) {
      saveProjectTags(projectTags).catch(err => {
        console.error('Failed to save project tags:', err);
        triggerToast('error', 'Failed to save project tags. Check your connection.');
      });
    }
  }, [projectTags]);

  // Auto-save site content
  useEffect(() => {
    if (siteContent && siteContent.length > 0) {
      saveSiteContent(siteContent).catch(err => {
        console.error('Failed to save site content:', err);
        triggerToast('error', 'Failed to save site content. Check your connection.');
      });
    }
  }, [siteContent]);

  // Auto-save contact settings
  useEffect(() => {
    if (contactSettings && Object.keys(contactSettings).length > 0) {
      saveContactSettings(contactSettings).catch(err => {
        console.error('Failed to save contact settings:', err);
        triggerToast('error', 'Failed to save contact settings. Check your connection.');
      });
    }
  }, [contactSettings]);

  // Auto-save services
  useEffect(() => {
    if (services && services.length > 0) {
      saveServices(services).catch(err => {
        console.error('Failed to save services:', err);
        triggerToast('error', 'Failed to save services. Check your connection.');
      });
    }
  }, [services]);

  // Auto-save testimonials
  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      saveTestimonials(testimonials).catch(err => {
        console.error('Failed to save testimonials:', err);
        triggerToast('error', 'Failed to save testimonials. Check your connection.');
      });
    }
  }, [testimonials]);

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

  // Toast Notification triggers
  const triggerToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    const newToast = { id, type, message };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore errors while logging out
    }
    triggerToast('success', 'Logged out successfully');
  };

  // --- SITE CONTENT (CMS) HELPER ROUTINES ---
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
        if (!item.value_en?.trim() || !item.value_ar?.trim()) {
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      triggerToast('error', 'Please fill in translations for all language inputs');
      return;
    }

    setSiteContent(editingContent);
    triggerToast('success', `Saved [${cmsSection.toUpperCase()}] content successfully ✓`);
  };

  // --- SERVICES CMS CRUD ---
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
    setSrvTitleEn('');
    setSrvTitleAr('');
    setSrvDescEn('');
    setSrvDescAr('');
    setSrvIcon('Compass');
    setSrvActive(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvTitleEn.trim() || !srvTitleAr.trim() || !srvDescEn.trim() || !srvDescAr.trim()) {
      triggerToast('error', 'All fields are mandatory to save service');
      return;
    }

    if (editingServiceId) {
      const updated = services.map(s => s.id === editingServiceId ? {
        ...s,
        title_en: srvTitleEn,
        title_ar: srvTitleAr,
        description_en: srvDescEn,
        description_ar: srvDescAr,
        icon: srvIcon,
        active: srvActive
      } : s);
      setServices(updated);
      triggerToast('success', 'Service modified successfully ✓');
      setEditingServiceId(null);
    } else {
      const newSrv: ServiceCMS = {
        id: 'srv_' + Date.now().toString(),
        title_en: srvTitleEn,
        title_ar: srvTitleAr,
        description_en: srvDescEn,
        description_ar: srvDescAr,
        icon: srvIcon,
        active: srvActive,
        display_order: services.length + 1
      };
      setServices([...services, newSrv]);
      triggerToast('success', 'Added new service card ✓');
    }
    handleCancelServiceEdit();
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    triggerToast('success', 'Service deleted successfully');
  };

  const handleMoveService = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= services.length) return;
    const list = [...services];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const reordered = list.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setServices(reordered);
    triggerToast('success', 'Order updated');
  };

  // --- TESTIMONIALS CMS CRUD ---
  const handleEditTestimonialTrigger = (tst: TestimonialCMS) => {
    setEditingTestimonialId(tst.id);
    setTstClientEn(tst.client_name_en);
    setTstClientAr(tst.client_name_ar);
    setTstTextEn(tst.text_en);
    setTstTextAr(tst.text_ar);
    setTstRating(tst.rating || 5);
    setTstActive(tst.active);
  };

  const handleCancelTestimonialEdit = () => {
    setEditingTestimonialId(null);
    setTstClientEn('');
    setTstClientAr('');
    setTstTextEn('');
    setTstTextAr('');
    setTstRating(5);
    setTstActive(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tstClientEn.trim() || !tstClientAr.trim() || !tstTextEn.trim() || !tstTextAr.trim()) {
      triggerToast('error', 'All fields are required to save client review');
      return;
    }

    if (editingTestimonialId) {
      const updated = testimonials.map(t => t.id === editingTestimonialId ? {
        ...t,
        client_name_en: tstClientEn,
        client_name_ar: tstClientAr,
        text_en: tstTextEn,
        text_ar: tstTextAr,
        rating: tstRating,
        active: tstActive
      } : t);
      setTestimonials(updated);
      triggerToast('success', 'Review modified successfully ✓');
      setEditingTestimonialId(null);
    } else {
      const newTst: TestimonialCMS = {
        id: 'tst_' + Date.now().toString(),
        client_name_en: tstClientEn,
        client_name_ar: tstClientAr,
        text_en: tstTextEn,
        text_ar: tstTextAr,
        rating: tstRating,
        active: tstActive,
        display_order: testimonials.length + 1
      };
      setTestimonials([...testimonials, newTst]);
      triggerToast('success', 'Added new testimonial citation ✓');
    }
    handleCancelTestimonialEdit();
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    triggerToast('success', 'Testimonial removed successfully');
  };

  const handleMoveTestimonial = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= testimonials.length) return;
    const list = [...testimonials];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const reordered = list.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setTestimonials(reordered);
    triggerToast('success', 'Order updated');
  };

  // Image Processing Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files) as File[];
    
    // Validate up to 10 images limit
    if (formImages.length + fileList.length > 10) {
      triggerToast('error', 'Maximum limit of 10 images per project exceeded');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsProcessingImages(true);
    setFormErrors(prev => ({ ...prev, images: undefined }));
    const base64Promises: Promise<string>[] = [];

    for (const file of fileList) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        triggerToast('error', `${file.name} has unsupported format. Choose JPG, PNG, or WEBP only.`);
        continue;
      }

      // Validate file size (max 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        triggerToast('error', `${file.name} exceeds maximum size of 5MB.`);
        continue;
      }

      const promise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });
      base64Promises.push(promise);
    }

    try {
      const results = await Promise.all(base64Promises);
      if (results.length === 0) {
        triggerToast('error', 'No valid images were selected. Check file formats and sizes.');
        setIsProcessingImages(false);
        return;
      }
      setFormImages(prev => [...prev, ...results]);
      triggerToast('success', `${results.length} image(s) processed successfully`);
    } catch (err) {
      console.error(err);
      triggerToast('error', 'Error in processing image data. Please try again.');
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFormImage = (indexToRemove: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const resetForm = () => {
    setEditingProjectId(null);
    setFormName('');
    setFormCategory('Living Room');
    setFormImages([]);
    setFormDescription('');
    setFormFeatured(false);
    setSelectedTagIds([]);
    setFormErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Handler for Add / Edit project form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { name?: string; images?: string } = {};
    if (!formName.trim()) {
      errors.name = 'Project Name is required';
    }
    if (formImages.length === 0) {
      errors.images = 'At least one project image is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      triggerToast('error', 'Please fill in all required fields');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const targetProjId = editingProjectId || 'proj_' + Date.now().toString();

    if (editingProjectId) {
      // Edit mode
      const updated = projects.map(proj => {
        if (proj.id === editingProjectId) {
          return {
            ...proj,
            name: formName,
            category: formCategory,
            description: formDescription,
            images: formImages,
            featured: formFeatured
          };
        }
        return proj;
      });
      setProjects(updated);

      // Save Project Tags
      const filteredProjTags = projectTags.filter(pt => pt.project_id !== editingProjectId);
      const newProjTags = selectedTagIds.map(tagId => ({ project_id: editingProjectId, tag_id: tagId }));
      setProjectTags([...filteredProjTags, ...newProjTags]);

      triggerToast('success', 'Project updated successfully ✓');
    } else {
      // Create mode
      const newProj: AdminProject = {
        id: targetProjId,
        name: formName,
        category: formCategory,
        description: formDescription,
        images: formImages,
        featured: formFeatured,
        dateAdded: todayStr
      };
      setProjects([newProj, ...projects]);

      // Add Project Tags
      const newProjTags = selectedTagIds.map(tagId => ({ project_id: targetProjId, tag_id: tagId }));
      setProjectTags([...projectTags, ...newProjTags]);

      triggerToast('success', 'Project added successfully ✓');
    }

    resetForm();
    setActiveTab('manage_projects');
  };

  // Toggle Featured directly from list
  const toggleProjectFeatured = (id: string) => {
    const updated = projects.map(proj => {
      if (proj.id === id) {
        const nextState = !proj.featured;
        triggerToast('success', `Project marked as ${nextState ? 'featured ✦' : 'standard'}`);
        return { ...proj, featured: nextState };
      }
      return proj;
    });
    setProjects(updated);
  };

  // Edit action trigger
  const handleEditTrigger = (project: AdminProject) => {
    setEditingProjectId(project.id);
    setFormName(project.name);
    setFormCategory(project.category);
    setFormImages(project.images);
    setFormDescription(project.description);
    setFormFeatured(project.featured);
    setFormErrors({});

    // Filter project tags
    const currentProjTags = projectTags
      .filter(pt => pt.project_id === project.id)
      .map(pt => pt.tag_id);
    setSelectedTagIds(currentProjTags);

    setActiveTab('add_project');
  };

  // Delete Action confirmation trigger
  const handleDeleteTrigger = (project: AdminProject) => {
    setProjectToDelete(project);
  };

  // Confirm delete handler (Delayed actual state update to allow transition animation)
  const confirmDeleteProject = () => {
    if (!projectToDelete) return;
    setDeletingProjectId(projectToDelete.id);

    // Wait 300ms for row scale-down and fade completion
    setTimeout(() => {
      const filtered = projects.filter(proj => proj.id !== projectToDelete.id);
      
      // Clean tags linked as well
      const filteredProjTags = projectTags.filter(pt => pt.project_id !== projectToDelete.id);
      
      setProjects(filtered);
      setProjectTags(filteredProjTags);
      
      triggerToast('success', 'Project removed successfully from records');
      setProjectToDelete(null);
      setDeletingProjectId(null);
    }, 300);
  };

  // TAG MANAGER CONTROLS
  const resetTagForm = () => {
    setFormTagName('');
    setFormTagNameAr('');
    setFormTagColor('#C9A84C');
    setEditingTagId(null);
  };

  const handleTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTagName.trim() || !formTagNameAr.trim()) {
      triggerToast('error', 'Tag values are required');
      return;
    }

    if (editingTagId) {
      const updated = tags.map(t => {
        if (t.id === editingTagId) {
          return { ...t, name: formTagName.trim(), name_ar: formTagNameAr.trim(), color: formTagColor };
        }
        return t;
      });
      setTags(updated);
      triggerToast('success', 'Tag updated successfully ✓');
    } else {
      const newTag: Tag = {
        id: 't_' + Date.now().toString(),
        name: formTagName.trim(),
        name_ar: formTagNameAr.trim(),
        color: formTagColor,
        created_at: new Date().toISOString()
      };
      setTags([...tags, newTag]);
      triggerToast('success', 'Tag created successfully ✦');
    }
    resetTagForm();
  };

  const handleTagEditTrigger = (tagItem: Tag) => {
    setFormTagName(tagItem.name);
    setFormTagNameAr(tagItem.name_ar || '');
    setFormTagColor(tagItem.color || '#C9A84C');
    setEditingTagId(tagItem.id);
  };

  const handleTagDeleteCall = (tagItem: Tag) => {
    const remainingTags = tags.filter(t => t.id !== tagItem.id);
    const remainingProjTags = projectTags.filter(pt => pt.tag_id !== tagItem.id);
    setTags(remainingTags);
    setProjectTags(remainingProjTags);
    triggerToast('success', `Tag "${tagItem.name}" deleted from index`);
  };

  // CONTACT SETTINGS CONTROLS
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\+\-\(\)\s]+$/;

    const errors: string[] = [];
    
    if (!contactWhatsapp.trim()) errors.push('WhatsApp number is required');
    if (!contactInstagram.trim()) errors.push('Instagram URL is required');
    if (!contactEmail.trim()) {
      errors.push('Email is required');
    } else if (!emailRegex.test(contactEmail)) {
      errors.push('Please enter a valid email address');
    }
    if (!contactPhone.trim()) {
      errors.push('Phone number is required');
    } else if (!phoneRegex.test(contactPhone)) {
      errors.push('Please enter a valid phone number');
    }
    if (!contactLocation.trim()) errors.push('Location (English) is required');
    if (!contactLocationAr.trim()) errors.push('Location (Arabic) is required');
    if (!contactTagline.trim()) errors.push('Tagline (English) is required');
    if (!contactTaglineAr.trim()) errors.push('Tagline (Arabic) is required');
    if (!contactStudioDesc.trim()) errors.push('Studio description (English) is required');
    if (!contactStudioDescAr.trim()) errors.push('Studio description (Arabic) is required');

    if (errors.length > 0) {
      triggerToast('error', errors[0]);
      return;
    }

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
    triggerToast('success', 'Contact Settings configuration saved ✓');
  };

  // Filter & Search computation on saved projects
  const processedProjectsList = projects.filter(proj => {
    const matchesSearch = proj.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || proj.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Math Statistics
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

      {/* ADMIN NAV BAR */}
      <header className="sticky top-0 z-40 w-full glass-panel-m border-b border-white/10 px-6 py-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Logo variant="emblem" className="w-10 h-10 text-gold" />
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

      {/* DASHBOARD CONTENT BODY WRAPPER */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        
        {/* SIDE NAV BAR */}
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          lang={lang}
          editingProjectId={editingProjectId}
          setEditingProjectId={setEditingProjectId}
          resetForm={resetForm}
          resetTagForm={resetTagForm}
          tags={tags}
        />

        {/* MAIN PANEL CONTENT SPACE */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full lg:max-w-[calc(100vw-256px)] select-text relative">
          
          {/* Render active workspace panel tab */}
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
              formName={formName}
              setFormName={setFormName}
              formCategory={formCategory}
              setFormCategory={setFormCategory}
              formFeatured={formFeatured}
              setFormFeatured={setFormFeatured}
              tags={tags}
              selectedTagIds={selectedTagIds}
              setSelectedTagIds={setSelectedTagIds}
              formDescription={formDescription}
              setFormDescription={setFormDescription}
              isProcessingImages={isProcessingImages}
              formImages={formImages}
              removeFormImage={removeFormImage}
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              deletingProjectId={deletingProjectId}
              projectTags={projectTags}
              tags={tags}
              toggleProjectFeatured={toggleProjectFeatured}
              handleEditTrigger={handleEditTrigger}
              handleDeleteTrigger={handleDeleteTrigger}
            />
          )}

          {activeTab === 'tags' && (
            <AdminTagsManager
              editingTagId={editingTagId}
              formTagName={formTagName}
              setFormTagName={setFormTagName}
              formTagNameAr={formTagNameAr}
              setFormTagNameAr={setFormTagNameAr}
              formTagColor={formTagColor}
              setFormTagColor={setFormTagColor}
              resetTagForm={resetTagForm}
              handleTagSubmit={handleTagSubmit}
              tags={tags}
              projectTags={projectTags}
              handleTagEditTrigger={handleTagEditTrigger}
              handleTagDeleteCall={handleTagDeleteCall}
            />
          )}

          {activeTab === 'contact_settings' && (
            <AdminContactForm
              handleContactSubmit={handleContactSubmit}
              contactWhatsapp={contactWhatsapp}
              setContactWhatsapp={setContactWhatsapp}
              contactInstagram={contactInstagram}
              setContactInstagram={setContactInstagram}
              contactEmail={contactEmail}
              setContactEmail={setContactEmail}
              contactPhone={contactPhone}
              setContactPhone={setContactPhone}
              contactLocation={contactLocation}
              setContactLocation={setContactLocation}
              contactLocationAr={contactLocationAr}
              setContactLocationAr={setContactLocationAr}
              contactTagline={contactTagline}
              setContactTagline={setContactTagline}
              contactTaglineAr={contactTaglineAr}
              setContactTaglineAr={setContactTaglineAr}
              contactStudioDesc={contactStudioDesc}
              setContactStudioDesc={setContactStudioDesc}
              contactStudioDescAr={contactStudioDescAr}
              setContactStudioDescAr={setContactStudioDescAr}
            />
          )}

          {activeTab === 'site_content' && (
            <AdminCmsEditor
              cmsSection={cmsSection}
              setCmsSection={setCmsSection}
              isPreviewEnabled={isPreviewEnabled}
              setIsPreviewEnabled={setIsPreviewEnabled}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              handleCmsImageUpload={handleCmsImageUpload}
              handleSaveCmsSection={handleSaveCmsSection}
              services={services}
              testimonials={testimonials}
              
              srvTitleEn={srvTitleEn}
              setSrvTitleEn={setSrvTitleEn}
              srvTitleAr={srvTitleAr}
              setSrvTitleAr={setSrvTitleAr}
              srvDescEn={srvDescEn}
              setSrvDescEn={setSrvDescEn}
              srvDescAr={srvDescAr}
              setSrvDescAr={setSrvDescAr}
              srvIcon={srvIcon}
              setSrvIcon={setSrvIcon}
              srvActive={srvActive}
              setSrvActive={setSrvActive}
              editingServiceId={editingServiceId}
              handleCancelServiceEdit={handleCancelServiceEdit}
              handleSaveService={handleSaveService}
              handleMoveService={handleMoveService}
              handleEditServiceTrigger={handleEditServiceTrigger}
              handleDeleteService={handleDeleteService}

              tstClientEn={tstClientEn}
              setTstClientEn={setTstClientEn}
              tstClientAr={tstClientAr}
              setTstClientAr={setTstClientAr}
              tstTextEn={tstTextEn}
              setTstTextEn={setTstTextEn}
              tstTextAr={tstTextAr}
              setTstTextAr={setTstTextAr}
              tstRating={tstRating}
              setTstRating={setTstRating}
              tstActive={tstActive}
              setTstActive={setTstActive}
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

      {/* DOUBLE CONFIRMATION POPUP */}
      <AdminDeleteModal
        projectToDelete={projectToDelete}
        setProjectToDelete={setProjectToDelete}
        confirmDeleteProject={confirmDeleteProject}
      />

      {/* Global Toasts rendering */}
      <AdminToast toasts={toasts} />

    </div>
  );
}
