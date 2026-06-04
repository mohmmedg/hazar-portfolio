import { supabase, isSupabaseEnabled } from './supabase';

// ── PROJECTS ──────────────────────────────────────
export async function fetchProjects() {
  if (!isSupabaseEnabled) {
    const raw = localStorage.getItem('hazar_projects');
    return raw ? JSON.parse(raw) : [];
  }
  const { data, error } = await supabase!
    .from('projects')
    .select(`*, project_images(image_url, display_order)`)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  // Transform relational schema back to flat layout expected by the frontend UI
  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    featured: p.featured,
    dateAdded: p.date_added || p.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    images: (p.project_images || [])
      .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
      .map((img: any) => img.image_url)
  }));
}

export async function saveProject(project: any) {
  if (!isSupabaseEnabled) {
    const all = JSON.parse(localStorage.getItem('hazar_projects') || '[]');
    const exists = all.findIndex((p: any) => p.id === project.id);
    if (exists >= 0) all[exists] = project;
    else all.unshift(project);
    localStorage.setItem('hazar_projects', JSON.stringify(all));
    return project;
  }

  // 1. Prepare project record for main projects table
  const projectRecord = {
    id: project.id,
    name: project.name,
    category: project.category,
    description: project.description,
    featured: !!project.featured,
    date_added: project.dateAdded || new Date().toISOString().split('T')[0]
  };

  const { error: projectError } = await supabase!
    .from('projects')
    .upsert(projectRecord);
  
  if (projectError) throw projectError;

  // 2. Clear old mappings and synchronize modern array entries to junction
  await supabase!
    .from('project_images')
    .delete()
    .eq('project_id', project.id);

  if (Array.isArray(project.images) && project.images.length > 0) {
    const imagesToInsert = project.images.map((url: string, index: number) => ({
      project_id: project.id,
      image_url: url,
      display_order: index
    }));

    const { error: imagesError } = await supabase!
      .from('project_images')
      .insert(imagesToInsert);
    
    if (imagesError) throw imagesError;
  }

  return project;
}

export async function deleteProject(id: string) {
  if (!isSupabaseEnabled) {
    const all = JSON.parse(localStorage.getItem('hazar_projects') || '[]');
    const updated = all.filter((p: any) => p.id !== id);
    localStorage.setItem('hazar_projects', JSON.stringify(updated));
    return;
  }
  const { error } = await supabase!
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── SITE CONTENT ──────────────────────────────────
export async function fetchSiteContent() {
  if (!isSupabaseEnabled) {
    const raw = localStorage.getItem('hazar_site_content');
    return raw ? JSON.parse(raw) : null;
  }
  const { data, error } = await supabase!
    .from('site_content')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function saveSiteContent(content: any[]) {
  if (!isSupabaseEnabled) {
    localStorage.setItem('hazar_site_content', JSON.stringify(content));
    return;
  }
  
  const payload = content.map(item => ({
    id: item.id,
    section: item.section,
    key: item.key,
    value_en: item.value_en,
    value_ar: item.value_ar,
    content_type: item.content_type,
    label: item.label
  }));

  const { error } = await supabase!
    .from('site_content')
    .upsert(payload);
  if (error) throw error;
}

// ── CONTACT SETTINGS ──────────────────────────────
export async function fetchContactSettings() {
  if (!isSupabaseEnabled) {
    const raw = localStorage.getItem('hazar_contact_settings');
    return raw ? JSON.parse(raw) : null;
  }
  const { data, error } = await supabase!
    .from('contact_settings')
    .select('key, value');
  if (error) throw error;
  if (!data || data.length === 0) return null;

  return data.reduce((acc: any, row: any) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function saveContactSettings(settings: any) {
  if (!isSupabaseEnabled) {
    localStorage.setItem('hazar_contact_settings', JSON.stringify(settings));
    return;
  }
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value)
  }));
  const { error } = await supabase!
    .from('contact_settings')
    .upsert(rows);
  if (error) throw error;
}

// ── SERVICES ──────────────────────────────────────
export async function fetchServices() {
  if (!isSupabaseEnabled) {
    const raw = localStorage.getItem('hazar_services_list');
    return raw ? JSON.parse(raw) : [];
  }
  const { data, error } = await supabase!
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveServices(services: any[]) {
  if (!isSupabaseEnabled) {
    localStorage.setItem('hazar_services_list', JSON.stringify(services));
    return;
  }
  const { error } = await supabase!
    .from('services')
    .upsert(services);
  if (error) throw error;
}

// ── TESTIMONIALS ──────────────────────────────────
export async function fetchTestimonials() {
  if (!isSupabaseEnabled) {
    const raw = localStorage.getItem('hazar_testimonials_list');
    return raw ? JSON.parse(raw) : [];
  }
  const { data, error } = await supabase!
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveTestimonials(testimonials: any[]) {
  if (!isSupabaseEnabled) {
    localStorage.setItem('hazar_testimonials_list', JSON.stringify(testimonials));
    return;
  }
  const { error } = await supabase!
    .from('testimonials')
    .upsert(testimonials);
  if (error) throw error;
}

// ── IMAGE UPLOAD ───────────────────────────────────
export async function uploadImage(
  file: File,
  projectId: string
): Promise<string> {
  if (!isSupabaseEnabled) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  const ext = file.name.split('.').pop();
  const path = `${projectId}/${Date.now()}.${ext}`;
  const { error } = await supabase!.storage
    .from('project-images')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase!.storage
    .from('project-images')
    .getPublicUrl(path);
  return data.publicUrl;
}

// ── TAGS ──────────────────────────────────────────
export async function fetchTags() {
  if (!isSupabaseEnabled) {
    const raw = localStorage.getItem('hazar_tags');
    return raw ? JSON.parse(raw) : [];
  }
  const { data, error } = await supabase!
    .from('tags')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveTags(tags: any[]) {
  if (!isSupabaseEnabled) {
    localStorage.setItem('hazar_tags', JSON.stringify(tags));
    return;
  }
  const { error } = await supabase!
    .from('tags')
    .upsert(tags);
  if (error) throw error;
}

// ── PROJECT TAGS ──────────────────────────────────
export async function fetchProjectTags() {
  if (!isSupabaseEnabled) {
    const raw = localStorage.getItem('hazar_project_tags');
    return raw ? JSON.parse(raw) : [];
  }
  const { data, error } = await supabase!
    .from('project_tags')
    .select('*');
  if (error) throw error;
  return data || [];
}

export async function saveProjectTags(projectTags: any[]) {
  if (!isSupabaseEnabled) {
    localStorage.setItem('hazar_project_tags', JSON.stringify(projectTags));
    return;
  }
  
  // Clear existing data first
  await supabase!
    .from('project_tags')
    .delete()
    .neq('project_id', '');
    
  if (projectTags.length > 0) {
    const { error } = await supabase!
      .from('project_tags')
      .insert(projectTags);
    if (error) throw error;
  }
}
