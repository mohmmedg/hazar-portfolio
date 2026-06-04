/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TRANSLATIONS, PORTFOLIO_DATA, Tag, ProjectTag, ContactSettings, SiteContent, ServiceCMS, TestimonialCMS } from './types';
import {
  fetchProjects,
  fetchSiteContent,
  fetchContactSettings,
  fetchServices,
  fetchTestimonials,
  fetchTags,
  fetchProjectTags,
  saveProject,
  saveTags,
  saveProjectTags,
  saveContactSettings,
  saveSiteContent,
  saveServices,
  saveTestimonials
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
  // HERO SECTION
  { id: 'sc1', section: 'hero', key: 'hero_title', value_en: 'HAZAR ALGHANEM', value_ar: 'هزار الغانم', content_type: 'text', label: 'Studio Name' },
  { id: 'sc2', section: 'hero', key: 'hero_subtitle', value_en: 'Interior & Exterior Design Studio', value_ar: 'استوديو التصميم الداخلي والخارجي', content_type: 'text', label: 'Studio Subtitle' },
  { id: 'sc3', section: 'hero', key: 'hero_tagline', value_en: 'Transforming ideas into luxurious realities ✦', value_ar: 'نحول أفكارك إلى واقع فاخر ✦', content_type: 'textarea', label: 'Hero Tagline' },
  { id: 'sc4', section: 'hero', key: 'hero_cta_button', value_en: 'Explore Our Work', value_ar: 'استعرض أعمالنا', content_type: 'text', label: 'CTA Button Text' },
  { id: 'sc5', section: 'hero', key: 'hero_background_image', value_en: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80', value_ar: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80', content_type: 'image', label: 'Hero Background Image' },

  // ABOUT SECTION
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

  // SERVICES SECTION
  { id: 'sc16', section: 'services', key: 'services_title', value_en: 'What We Do', value_ar: 'خدماتنا الإبداعية', content_type: 'text', label: 'Section Title' },
  { id: 'sc17', section: 'services', key: 'services_subtitle', value_en: 'Refined architectural solutions curated for discerning tastes', value_ar: 'حلول معمارية رفيعة المستوى تم تصميمها بأيدي خبراء لأصحاب الذوق المتميز', content_type: 'text', label: 'Section Subtitle' },

  // TESTIMONIALS SECTION
  { id: 'sc18', section: 'testimonials', key: 'testimonials_title', value_en: 'What Clients Say', value_ar: 'شهادات نفخر بها', content_type: 'text', label: 'Section Title' },
  { id: 'sc28', section: 'testimonials', key: 'testimonials_subtitle', value_en: 'Enduring relationships forged through exceptional craft', value_ar: 'شراكات مستمرة مبنية على الفن الاستثنائي والالتزام بالاتقان', content_type: 'text', label: 'Section Subtitle' },

  // CONTACT SECTION
  { id: 'sc19', section: 'contact', key: 'contact_title', value_en: 'Let\'s Create Together', value_ar: 'لنبتكر معاً مساحة أحلامك', content_type: 'text', label: 'Section Title' },
  { id: 'sc20', section: 'contact', key: 'contact_subtitle', value_en: 'Entrust us with your vision and let us elevate your standard of living', value_ar: 'أوكل إلينا رؤيتك وسنقوم بصياغة فضاء يجسد رقيّ معاييرك السكنية والجمالية', content_type: 'textarea', label: 'Section Subtitle' },
  { id: 'sc21', section: 'contact', key: 'contact_whatsapp', value_en: '+963955111222', value_ar: '+963955111222', content_type: 'text', label: 'WhatsApp Number' },
  { id: 'sc22', section: 'contact', key: 'contact_instagram', value_en: 'https://instagram.com/hazar.alghanem', value_ar: 'https://instagram.com/hazar.alghanem', content_type: 'url', label: 'Instagram URL' },
  { id: 'sc23', section: 'contact', key: 'contact_email', value_en: 'hazar@example.com', value_ar: 'hazar@example.com', content_type: 'text', label: 'Email Address' }, // TODO: replace with real email
  { id: 'sc24', section: 'contact', key: 'contact_phone', value_en: '+963 955 111 222', value_ar: '+963 955 111 222', content_type: 'text', label: 'Phone Number' },
  { id: 'sc25', section: 'contact', key: 'contact_location', value_en: 'Aleppo Heritage Area, Syria', value_ar: 'حلب، سوريا', content_type: 'text', label: 'Location' },

  // FOOTER
  { id: 'sc26', section: 'footer', key: 'footer_copyright', value_en: 'HAZAR ALGHANEM © 2026 — All Rights Reserved', value_ar: 'استوديو هزار الغانم © 2026 — جميع الحقوق محفوظة', content_type: 'text', label: 'Copyright Text' },
  { id: 'sc27', section: 'footer', key: 'footer_tagline', value_en: 'Modern • Elegant • Unique', value_ar: 'عصري • أنيق • فريد', content_type: 'text', label: 'Footer Tagline' }
];

const DEFAULT_SERVICES: ServiceCMS[] = [
  {
    id: "s1",
    title_en: "Interior Design",
    title_ar: "التصميم الداخلي",
    description_en: "Residential and commercial interior spaces crafted with precision and elegance.",
    description_ar: "تصميم المساحات الداخلية السكنية والتجارية بدقة وأناقة.",
    icon: "Compass",
    display_order: 1,
    active: true
  },
  {
    id: "s2",
    title_en: "Exterior Design",
    title_ar: "التصميم الخارجي واللاندسكيب",
    description_en: "Facades and landscape design that make lasting first impressions.",
    description_ar: "تصميم الواجهات والمناظر الطبيعية التي تترك انطباعاً لا يُنسى.",
    icon: "Home",
    display_order: 2,
    active: true
  },
  {
    id: "s3",
    title_en: "3D Visualization",
    title_ar: "التصور ثلاثي الأبعاد",
    description_en: "Photorealistic renders that bring your vision to life before construction begins.",
    description_ar: "تصورات واقعية تحيي رؤيتك قبل بدء البناء.",
    icon: "Box",
    display_order: 3,
    active: true
  },
  {
    id: "s4",
    title_en: "Design Consultation",
    title_ar: "استشارات التصميم",
    description_en: "Tailored expert advice to guide your project from concept to completion.",
    description_ar: "نصائح خبراء مخصصة لإرشاد مشروعك من الفكرة إلى الإنجاز.",
    icon: "MessageSquare",
    display_order: 4,
    active: true
  }
];

const DEFAULT_TESTIMONIALS: TestimonialCMS[] = [
  {
    id: "t1",
    client_name_en: "Al-Sayyed Tareq Al-Husseini",
    client_name_ar: "السيد طارق الحسيني",
    text_en: "Hazar AlGhanem translated our core family lifestyle values into a sanctuary. The sheer grandeur of the stone masonry they designed for our villa entryway is an absolute masterpiece.",
    text_ar: "نجح استوديو هزار الغانم في تحويل قيم عائلتنا وأسلوب حياتنا إلى ملاذ آمن ساحر. الفخامة المطلقة للواجهات الحجرية التي صمموها لمدخل فيلتنا هي تحفة فنية لا تُضاهى.",
    rating: 5,
    active: true,
    display_order: 1
  },
  {
    id: "t2",
    client_name_en: "Dr. Reem Al-Jabri",
    client_name_ar: "الدكتورة ريم الجابري",
    text_en: "Exceptional designers. Their material selections, photorealistic render fidelity, and unwavering devotion to architectural details are unmatched in the region. Incredible work.",
    text_ar: "مصممون استثنائيون. اختيارهم المذهل للمواد، والدقة الفائقة لرسوماتهم المعرضة، وحرصهم الشديد على أدق التفاصيل المعمارية يجعلهم الأفضل بلا منازع في المنطقة.",
    rating: 5,
    active: true,
    display_order: 2
  },
  {
    id: "t3",
    client_name_en: "Engineer Omar Al-Sadi",
    client_name_ar: "المهندس عمر السعدي",
    text_en: "We entrusted the studio with our corporate headquarters. The Glassmorphism aesthetic they developed integrates natural sunlight with obsidian stone, elevating client trust on arrival.",
    text_ar: "لقد أسندنا للاستوديو مهمة تصميم مقرنا الرئيسي. إن جماليات الزجاج المتجمد التي ابتكروها تدمج ضوء الشمس الطبيعي مع حجر الأوبسيديان الفاخر، مما يعزز ثقة عملائنا بمجرد دخولهم.",
    rating: 5,
    active: true,
    display_order: 3
  }
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

  // Unified global storage states
  const [projects, setProjects] = useState<any[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [projectTags, setProjectTags] = useState<ProjectTag[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);

  // CMS dynamic database simulation states (zero physical-flash by rendering immediately from cache)
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [services, setServices] = useState<ServiceCMS[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialCMS[]>([]);
  const [isCmsLoading, setIsCmsLoading] = useState(true);

  // Initialize unified database from localStorage or pre-seeded data on load
  useEffect(() => {
    // 0. Loading site content cache check
    const contentCache = localStorage.getItem('hazar_site_content');
    let initialContent = DEFAULT_SITE_CONTENT;
    if (contentCache) {
      try {
        initialContent = JSON.parse(contentCache);
      } catch (e) {
        console.error('Failed to parse cached site content', e);
      }
    } else {
      localStorage.setItem('hazar_site_content', JSON.stringify(DEFAULT_SITE_CONTENT));
    }
    setSiteContent(initialContent);

    // Dynamic services cache load
    const storedServices = localStorage.getItem('hazar_services_list');
    let initialServices = DEFAULT_SERVICES;
    if (storedServices) {
      try {
        initialServices = JSON.parse(storedServices);
      } catch (e) {
        console.error('Failed to parse cached services list', e);
      }
    } else {
      localStorage.setItem('hazar_services_list', JSON.stringify(DEFAULT_SERVICES));
    }
    setServices(initialServices);

    // Dynamic testimonials cache load
    const storedTestimonials = localStorage.getItem('hazar_testimonials_list');
    let initialTestimonials = DEFAULT_TESTIMONIALS;
    if (storedTestimonials) {
      try {
        initialTestimonials = JSON.parse(storedTestimonials);
      } catch (e) {
        console.error('Failed to parse cached testimonials list', e);
      }
    } else {
      localStorage.setItem('hazar_testimonials_list', JSON.stringify(DEFAULT_TESTIMONIALS));
    }
    setTestimonials(initialTestimonials);

    // 1. Projects
    const storedProjects = localStorage.getItem('hazar_projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (e) {
        console.error('Failed to parse projects on init', e);
      }
    } else {
      const seeded = PORTFOLIO_DATA.map((item, index) => {
        let catMapped = 'Living Room';
        if (item.category === 'living') catMapped = 'Living Room';
        else if (item.category === 'dining') catMapped = 'Dining Room';
        else if (item.category === 'bedroom') catMapped = 'Bedroom';
        else if (item.category === 'kitchen') catMapped = 'Kitchen';
        else if (item.category === 'entrance') catMapped = 'Entrance';

        return {
          id: item.id,
          name: item.titleEN,
          category: catMapped,
          description: item.descEN,
          images: [item.image],
          featured: index < 3,
          dateAdded: '2025-05-18'
        };
      });
      localStorage.setItem('hazar_projects', JSON.stringify(seeded));
      setProjects(seeded);
    }

    // 2. Tags
    const storedTags = localStorage.getItem('hazar_tags');
    if (storedTags) {
      try {
        setTags(JSON.parse(storedTags));
      } catch (e) {
        console.error('Failed to parse tags on init', e);
      }
    } else {
      const initialTags = [
        { id: 't1', name: 'Modern', name_ar: 'حديث', color: '#E5C158', created_at: new Date().toISOString() },
        { id: 't2', name: 'Luxury', name_ar: 'فاخر', color: '#C9A84C', created_at: new Date().toISOString() },
        { id: 't3', name: 'Villa', name_ar: 'فيلا', color: '#2C3A5A', created_at: new Date().toISOString() },
        { id: 't5', name: 'Commercial', name_ar: 'تجاري', color: '#3B82F6', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('hazar_tags', JSON.stringify(initialTags));
      setTags(initialTags);
    }

    // 3. Project Tags
    const storedProjTags = localStorage.getItem('hazar_project_tags');
    if (storedProjTags) {
      try {
        setProjectTags(JSON.parse(storedProjTags));
      } catch (e) {
        console.error('Failed to parse project tags on init', e);
      }
    } else {
      const initialProjTags = [
        { project_id: 'p1', tag_id: 't2' },
        { project_id: 'p2', tag_id: 't2' },
        { project_id: 'p3', tag_id: 't2' },
        { project_id: 'p5', tag_id: 't2' },
        { project_id: 'p5', tag_id: 't1' }
      ];
      localStorage.setItem('hazar_project_tags', JSON.stringify(initialProjTags));
      setProjectTags(initialProjTags);
    }

    // 4. Contact settings
    const storedSettings = localStorage.getItem('hazar_contact_settings');
    if (storedSettings) {
      try {
        setContactSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Failed to parse contact settings on init', e);
      }
    } else {
      const initialSettings = { ...DEFAULT_CONTACT_SETTINGS, updatedAt: new Date().toISOString() };
      localStorage.setItem('hazar_contact_settings', JSON.stringify(initialSettings));
      setContactSettings(initialSettings);
    }

    // ── SUPABASE BACKGROUND REVALIDATE ──
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

  // Reactive CMS state modifiers
  const handleUpdateSiteContent = (newContent: SiteContent[]) => {
    // Admin save action: clears cache loaded timestamp metadata immediately so refresh next visitor sees instantly
    localStorage.removeItem('hazar_site_content_loaded_at');
    localStorage.setItem('hazar_site_content', JSON.stringify(newContent));
    setSiteContent([...newContent]);
  };

  const handleUpdateServices = (newServices: ServiceCMS[]) => {
    localStorage.setItem('hazar_services_list', JSON.stringify(newServices));
    setServices([...newServices]);
  };

  const handleUpdateTestimonials = (newTestimonials: TestimonialCMS[]) => {
    localStorage.setItem('hazar_testimonials_list', JSON.stringify(newTestimonials));
    setTestimonials([...newTestimonials]);
  };

  // Reactive state updaters
  const handleUpdateProjects = (newProjects: any[]) => {
    localStorage.setItem('hazar_projects', JSON.stringify(newProjects));
    setProjects([...newProjects]);
  };

  const handleUpdateTags = (newTags: Tag[]) => {
    localStorage.setItem('hazar_tags', JSON.stringify(newTags));
    setTags([...newTags]);
  };

  const handleUpdateProjectTags = (newProjTags: ProjectTag[]) => {
    localStorage.setItem('hazar_project_tags', JSON.stringify(newProjTags));
    setProjectTags([...newProjTags]);
  };

  const handleUpdateContactSettings = (newSettings: ContactSettings) => {
    const updatedSettings = { ...newSettings, updatedAt: new Date().toISOString() };
    localStorage.setItem('hazar_contact_settings', JSON.stringify(updatedSettings));
    setContactSettings(updatedSettings);
  };

  // ── SUPABASE REALTIME SYNC ──
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

  // Monitor URL changes for real-time SPA navigation
  // Dynamically update document layout properties based on chosen language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

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
    <div className={`min-h-screen relative selection:bg-gold/30 selection:text-white bg-navy-dark`}>
      {/* Absolute Aesthetic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft floating luxury glow backdrop */}
        <div className="absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gold/3 opacity-40 blur-[140px] ambient-bg-glow" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-navy-light/30 opacity-30 blur-[150px]" />
      </div>

      {/* Custom Luxury Dot + Glass Ring Cursor */}
      <CustomCursor />

      {/* Layout Content wrapper */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <Navbar lang={lang} setLang={setLang} t={t} settings={contactSettings} siteContent={siteContent} />

        {/* Sections */}
        <main>
          {/* [1] Hero Landing */}
          <Hero t={t} lang={lang} settings={contactSettings} siteContent={siteContent} />

          {/* [2] The Studio Story (About) */}
          <About t={t} lang={lang} settings={contactSettings} siteContent={siteContent} />

          {/* [3] Professional Services (What We Do) */}
          <Services t={t} lang={lang} siteContent={siteContent} services={services} />

          {/* [4] Masterpiece Portfolio Gallery */}
          <Portfolio t={t} lang={lang} projects={projects} tags={tags} projectTags={projectTags} />

          {/* [5] Testimonials Client Praise carousel */}
          <Testimonials t={t} lang={lang} siteContent={siteContent} testimonials={testimonials} />

          {/* [6] Commission / Contact Inquiries Panel */}
          <Contact t={t} lang={lang} settings={contactSettings} siteContent={siteContent} />
        </main>

        {/* [7] Minimal Copyright Signature (Footer) */}
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
