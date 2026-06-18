/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { TRANSLATIONS, Tag, ProjectTag, ContactSettings, SiteContent, ServiceCMS, TestimonialCMS } from './types';
import {
  fetchProjects,
  fetchSiteContent,
  fetchContactSettings,
  fetchServices,
  fetchTestimonials,
  fetchTags,
  fetchProjectTags,
} from './lib/db';
import { supabase, isSupabaseEnabled } from './lib/supabase';

// Component Imports
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import AdminLoginPage from './components/AdminLoginPage';
import AdminRoute from './routes/AdminRoute';

const DEFAULT_SITE_CONTENT: SiteContent[] = [
  { id: 'sc1', section: 'hero', key: 'hero_title', value_en: 'HAZAR ALGHANEM', value_ar: 'هزار الغانم', content_type: 'text', label: 'Studio Name' },
  { id: 'sc2', section: 'hero', key: 'hero_subtitle', value_en: 'Interior & Exterior Design Studio', value_ar: 'استوديو التصميم الداخلي والخارجي', content_type: 'text', label: 'Studio Subtitle' },
  { id: 'sc3', section: 'hero', key: 'hero_tagline', value_en: 'Transforming ideas into luxurious realities ✦', value_ar: 'نحول أفكارك إلى واقع فاخر ✦', content_type: 'textarea', label: 'Hero Tagline' },
  { id: 'sc4', section: 'hero', key: 'hero_cta_button', value_en: 'Explore Our Work', value_ar: 'استعرض أعمالنا', content_type: 'text', label: 'CTA Button Text' },
  { id: 'sc5', section: 'hero', key: 'hero_background_image', value_en: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80', value_ar: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80', content_type: 'image', label: 'Hero Background Image' },
  { id: 'sc6', section: 'about', key: 'about_title', value_en: 'The Design Studio', value_ar: 'استوديو التصميم', content_type: 'text', label: 'Section Title' },
  { id: 'sc7', section: 'about', key: 'about_description_1', value_en: 'HAZAR ALGHANEM is an award-winning interior and exterior architectural design studio specializing in bespoke, ultra-luxury residential and commercial spaces. Established with a vision to redefine high-end living, our approach blends modern European sophistication with authentic Eastern architectural details.', value_ar: 'استوديو هزار الغانم هو استوديو تصميم معماري داخلي وخارجي حائز على جوائز مرموقة، متخصص في ابتكار أرقى المساحات السكنية والتجارية الفاخرة للعملاء ذوي الذوق الرفيع. تأسس برؤية رائدة لإنتاج تصاميم متميزة تجمع بين الرقي والابتكار.', content_type: 'textarea', label: 'Main Description' },
  { id: 'sc8', section: 'about', key: 'about_description_2', value_en: 'Our commitment to flawless execution and tailored styling has earned us an elite clientele. From grand Aleppo villas to sleek corporate galleries, we curate each detail with architectural honesty, premium craftsmanship, and a deep respect for local context and space density.', value_ar: 'التزامنا بالتنفيذ الخالي من العيوب والتنسيق المصمم خصيصاً أكسبنا نخبة من العملاء. من الفيلات الحلبية المهيبة الفخمة إلى صالات العرض الأنيقة والتجارية، نعتني بكل تفصيل مع احترام بيئة المكان وأصالته التاريخية والحديثة.', content_type: 'textarea', label: 'Philosophy Statement' },
  { id: 'sc9', section: 'about', key: 'about_stat_projects', value_en: '50+', value_ar: '50+', content_type: 'text', label: 'Projects Count' },
  { id: 'sc10', section: 'about', key: 'about_stat_years', value_en: '5+', value_ar: '5+', content_type: 'text', label: 'Years Experience' },
  { id: 'sc11', section: 'about', key: 'about_stat_clients', value_en: '40+', value_ar: '40+', content_type: 'text', label: 'Happy Clients' },
  { id: 'sc12', section: 'about', key: 'about_stat_label_projects', value_en: 'Projects Completed', value_ar: 'مشروع منجز', content_type: 'text', label: 'Projects Label' },
  { id: 'sc13', section: 'about', key: 'about_stat_label_years', value_en: 'Years of Experience', value_ar: 'سنوات خبرة', content_type: 'text', label: 'Years Label' },
  { id: 'sc14', section: 'about', key: 'about_stat_label_clients', value_en: 'Happy Clients', value_ar: 'عميل راضٍ', content_type: 'text', label: 'Clients Label' },
  { id: 'sc15', section: 'about', key: 'about_image', value_en: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', value_ar: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', content_type: 'image', label: 'About Section Image' },
  { id: 'sc16', section: 'services', key: 'services_title', value_en: 'What We Do', value_ar: 'خدماتنا الإبداعية', content_type: 'text', label: 'Section Title' },
  { id: 'sc17', section: 'services', key: 'services_subtitle', value_en: 'Refined architectural solutions curated for discerning tastes', value_ar: 'حلول معمارية رفيعة المستوى تم تصميمها بأيدي خبراء لأصحاب الذوق المتميز', content_type: 'text', label: 'Section Subtitle' },
  { id: 'sc18', section: 'testimonials', key: 'testimonials_title', value_en: 'What Clients Say', value_ar: 'شهادات نفخر بها', content_type: 'text', label: 'Section Title' },
  { id: 'sc28', section: 'testimonials', key: 'testimonials_subtitle', value_en: 'Enduring relationships forged through exceptional craft', value_ar: 'شراكات مستمرة مبنية على الفن الاستثنائي والالتزام بالاتقان', content_type: 'text', label: 'Section Subtitle' },
  { id: 'sc19', section: 'contact', key: 'contact_title', value_en: 'Let\'s Create Together', value_ar: 'لنبتكر معاً مساحة أحلامك', content_type: 'text', label: 'Section Title' },
  { id: 'sc20', section: 'contact', key: 'contact_subtitle', value_en: 'Entrust us with your vision and let us elevate your standard of living', value_ar: 'أوكل إلينا رؤيتك وسنقوم بصياغة فضاء يجسد رقيّ معاييرك السكنية والجمالية', content_type: 'textarea', label: 'Section Subtitle' },
  { id: 'sc21', section: 'contact', key: 'contact_whatsapp', value_en: '+963955111222', value_ar: '+963955111222', content_type: 'text', label: 'WhatsApp Number' },
  { id: 'sc22', section: 'contact', key: 'contact_instagram', value_en: 'https://instagram.com/hazar.alghanem', value_ar: 'https://instagram.com/hazar.alghanem', content_type: 'url', label: 'Instagram URL' },
  { id: 'sc23', section: 'contact', key: 'contact_email', value_en: 'hazar@example.com', value_ar: 'hazar@example.com', content_type: 'text', label: 'Email Address' },
  { id: 'sc24', section: 'contact', key: 'contact_phone', value_en: '+963 955 111 222', value_ar: '+963 955 111 222', content_type: 'text', label: 'Phone Number' },
  { id: 'sc25', section: 'contact', key: 'contact_location', value_en: 'Aleppo Heritage Area, Syria', value_ar: 'حلب، سوريا', content_type: 'text', label: 'Location' },
  { id: 'sc26', section: 'footer', key: 'footer_copyright', value_en: 'HAZAR ALGHANEM © 2026 — All Rights Reserved', value_ar: 'استوديو هزار الغانم © 2026 — جميع الحقوق محفوظة', content_type: 'text', label: 'Copyright Text' },
  { id: 'sc27', section: 'footer', key: 'footer_tagline', value_en: 'Modern • Elegant • Unique', value_ar: 'عصري • أنيق • فريد', content_type: 'text', label: 'Footer Tagline' }
];

const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  whatsapp_number: import.meta.env.VITE_CONTACT_WHATSAPP || '',
  instagram_url: import.meta.env.VITE_CONTACT_INSTAGRAM || '',
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  phone: import.meta.env.VITE_CONTACT_PHONE || '',
  location: 'Aleppo, Syria',
  location_ar: 'حلب، سوريا',
  tagline: 'Transforming ideas into luxurious realities ✦',
  tagline_ar: 'نحول أفكارك إلى واقع فاخر ✦',
  studio_description: 'HAZAR ALGHANEM is an award-winning interior and exterior architectural design studio specializing in bespoke, ultra-luxury residential and commercial spaces. Established with a vision to redefine high-end living, our approach blends modern European sophistication with authentic Eastern architectural details.',
  studio_description_ar: 'استوديو هزار الغانم هو استوديو تصميم معماري داخلي وخارجي حائز على جوائز مرموقة، متخصص في ابتكار أرقى المساحات السكنية والتجارية الفاخرة للعملاء ذوي الذوق الرفيع. تأسس برؤية رائدة لإنتاج تصاميم متميزة تجمع بين الرقي والابتكار.',
  updatedAt: new Date().toISOString()
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const t = TRANSLATIONS[lang];
  const navigate = useNavigate();

  const [projects, setProjects] = useState<any[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [projectTags, setProjectTags] = useState<ProjectTag[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [siteContent, setSiteContent] = useState<SiteContent[]>(DEFAULT_SITE_CONTENT);
  const [services, setServices] = useState<ServiceCMS[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialCMS[]>([]);
  const [isCmsLoading, setIsCmsLoading] = useState(true);

  // Load all data from Supabase only
  useEffect(() => {
    async function loadAllData() {
      try {
        const [projectsData, tagsData, projectTagsData, contentData, settingsData, servicesData, testimonialsData] = await Promise.all([
          fetchProjects(),
          fetchTags(),
          fetchProjectTags(),
          fetchSiteContent(),
          fetchContactSettings(),
          fetchServices(),
          fetchTestimonials()
        ]);
        if (projectsData && projectsData.length > 0) setProjects(projectsData);
        if (tagsData && tagsData.length > 0) setTags(tagsData);
        if (projectTagsData && projectTagsData.length > 0) setProjectTags(projectTagsData);
        if (contentData && contentData.length > 0) setSiteContent(contentData);
        if (settingsData && Object.keys(settingsData).length > 0) setContactSettings(settingsData);
        if (servicesData && servicesData.length > 0) setServices(servicesData);
        if (testimonialsData && testimonialsData.length > 0) setTestimonials(testimonialsData);
      } catch (err) {
        console.error('Data load error:', err);
      } finally {
        setIsCmsLoading(false);
      }
    }
    loadAllData();
  }, []);

  // Supabase Realtime Sync
  useEffect(() => {
    if (!isSupabaseEnabled) return;

    const channel = supabase!
      .channel('projects-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, async () => {
        try {
          const fresh = await fetchProjects();
          if (fresh) setProjects([...fresh]);
        } catch (e) {
          console.error('Realtime fetch failed', e);
        }
      })
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, []);

  // Language direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleUpdateProjects = (newProjects: any[]) => setProjects([...newProjects]);
  const handleUpdateTags = (newTags: Tag[]) => setTags([...newTags]);
  const handleUpdateProjectTags = (newProjTags: ProjectTag[]) => setProjectTags([...newProjTags]);
  const handleUpdateContactSettings = (newSettings: ContactSettings) => setContactSettings({ ...newSettings, updatedAt: new Date().toISOString() });
  const handleUpdateSiteContent = (newContent: SiteContent[]) => setSiteContent([...newContent]);
  const handleUpdateServices = (newServices: ServiceCMS[]) => setServices([...newServices]);
  const handleUpdateTestimonials = (newTestimonials: TestimonialCMS[]) => setTestimonials([...newTestimonials]);

  const adminPanelElement = (
    <div className="min-h-screen relative bg-navy-dark">
      <CustomCursor />
      <AdminPanel
        lang={lang}
        onBackToSite={() => navigate('/')}
        projects={projects}
        setProjects={handleUpdateProjects}
        tags={tags}
        setTags={handleUpdateTags}
        projectTags={projectTags}
        setProjectTags={handleUpdateProjectTags}
        contactSettings={contactSettings}
        setContactSettings={handleUpdateContactSettings}
        siteContent={siteContent}
        setSiteContent={handleUpdateSiteContent}
        services={services}
        setServices={handleUpdateServices}
        testimonials={testimonials}
        setTestimonials={handleUpdateTestimonials}
      />
    </div>
  );

  const publicSiteElement = (
    <div className="min-h-screen relative selection:bg-gold/30 selection:text-white bg-navy-dark">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gold/3 opacity-40 blur-[140px] ambient-bg-glow" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-navy-light/30 opacity-30 blur-[150px]" />
      </div>
      <CustomCursor />
      <div className="relative z-10">
        <Navbar lang={lang} setLang={setLang} t={t} settings={contactSettings} siteContent={siteContent} />
        <main>
          <Hero t={t} lang={lang} settings={contactSettings} siteContent={siteContent} />
          <About t={t} lang={lang} settings={contactSettings} siteContent={siteContent} />
          <Services t={t} lang={lang} siteContent={siteContent} services={services} />
          <Portfolio t={t} lang={lang} projects={projects} tags={tags} projectTags={projectTags} />
          <Testimonials t={t} lang={lang} siteContent={siteContent} testimonials={testimonials} />
          <Contact t={t} lang={lang} settings={contactSettings} siteContent={siteContent} />
        </main>
        <Footer t={t} lang={lang} settings={contactSettings} siteContent={siteContent} />
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={publicSiteElement} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminRoute>{adminPanelElement}</AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
