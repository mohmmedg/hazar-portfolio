/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Translation {
  navHome: string;
  navAbout: string;
  navServices: string;
  navPortfolio: string;
  navTestimonials: string;
  navContact: string;
  
  heroTagline: string;
  heroSub: string;
  heroCTA: string;
  
  aboutTitle: string;
  aboutSub: string;
  aboutP1: string;
  aboutP2: string;
  aboutStat1: string;
  aboutStat2: string;
  aboutStat3: string;
  aboutPhilosophy: string;
  aboutPhQuote: string;
  
  servicesTitle: string;
  servicesSubtitle: string;
  service1Title: string;
  service1Desc: string;
  service2Title: string;
  service2Desc: string;
  service3Title: string;
  service3Desc: string;
  service4Title: string;
  service4Desc: string;
  
  portfolioTitle: string;
  portfolioSubtitle: string;
  portfolioFilterAll: string;
  portfolioFilterLiving: string;
  portfolioFilterDining: string;
  portfolioFilterBedroom: string;
  portfolioFilterKitchen: string;
  portfolioFilterEntrance: string;
  portfolioView: string;
  portfolioCategoryLabel: string;
  
  testimonialsTitle: string;
  testimonialSubtitle: string;
  
  contactTitle: string;
  contactSubtitle: string;
  contactNameLabel: string;
  contactPhoneLabel: string;
  contactMsgLabel: string;
  contactSubmitBtn: string;
  contactSending: string;
  contactSuccessMsg: string;
  contactLocTitle: string;
  contactLocVal: string;
  contactSocialTitle: string;
  
  footerRights: string;
}

export interface PortfolioItem {
  id: string;
  category: 'living' | 'dining' | 'bedroom' | 'kitchen' | 'entrance';
  titleEN: string;
  titleAR: string;
  descEN: string;
  descAR: string;
  image: string;
}

export interface Tag {
  id: string;
  name: string;
  name_ar?: string;
  color?: string;
  created_at?: string;
}

export interface ProjectTag {
  project_id: string;
  tag_id: string;
}

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value_en: string;
  value_ar: string;
  content_type: 'text' | 'textarea' | 'image' | 'url' | 'number';
  label: string;
  updated_at?: string;
}

export function getContent(siteContent: SiteContent[] | undefined, key: string, lang: 'en' | 'ar', fallback: string): string {
  if (!siteContent || !Array.isArray(siteContent)) return fallback;
  const item = siteContent.find(c => c.key === key);
  if (!item) return fallback;
  const val = lang === 'ar' ? item.value_ar : item.value_en;
  return val !== undefined && val !== null ? val : fallback;
}

export interface ServiceCMS {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  display_order: number;
  active: boolean;
  created_at?: string;
}

export interface TestimonialCMS {
  id: string;
  client_name_en: string;
  client_name_ar: string;
  text_en: string;
  text_ar: string;
  rating: number;
  active: boolean;
  display_order: number;
  created_at?: string;
}

export interface ContactSettings {
  whatsapp_number: string;
  instagram_url: string;
  email: string;
  phone: string;
  location: string;
  location_ar: string;
  tagline: string;
  tagline_ar: string;
  studio_description: string;
  studio_description_ar: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  rating: number;
  quoteEN: string;
  quoteAR: string;
  clientEN: string;
  clientAR: string;
  roleEN: string;
  roleAR: string;
}

export const TRANSLATIONS: Record<'en' | 'ar', Translation> = {
  en: {
    navHome: "Home",
    navAbout: "About Us",
    navServices: "Services",
    navPortfolio: "Portfolio",
    navTestimonials: "Testimonials",
    navContact: "Contact",
    
    heroTagline: "Transforming ideas into luxurious realities ✦",
    heroSub: "Interior & Exterior Design Studio",
    heroCTA: "Explore Our Work",
    
    aboutTitle: "The Design Studio",
    aboutSub: "Hazar AlGhanem based in Aleppo, Syria",
    aboutP1: "HAZAR ALGHANEM is an award-winning interior and exterior architectural design studio specializing in bespoke, ultra-luxury residential and commercial spaces. Established with a vision to redefine high-end living, our approach blends modern European sophistication with authentic Eastern architectural details.",
    aboutP2: "Our commitment to flawless execution and tailored styling has earned us an elite clientele. From grand Aleppo villas to sleek corporate galleries, we curate each detail with architectural honesty, premium craftsmanship, and a deep respect for local context and space density.",
    aboutStat1: "Projects Completed",
    aboutStat2: "Years of Experience",
    aboutStat3: "Happy Clients",
    aboutPhilosophy: "Design Philosophy",
    aboutPhQuote: "“Every space tells a story. We design yours.”",
    
    servicesTitle: "What We Do",
    servicesSubtitle: "Refined architectural solutions curated for discerning tastes",
    service1Title: "Interior Design",
    service1Desc: "Crafting bespoke residential and commercial environments balancing aesthetic poetry with everyday functionality.",
    service2Title: "Exterior Design",
    service2Desc: "Commanding facades, grand villa entryways, and premium landscape staging that captivate from the first gaze.",
    service3Title: "3D Visualization",
    service3Desc: "Photorealistic 3D renders with physics-accurate lighting reflections, enabling client immersion during planning phase.",
    service4Title: "Design Consultation",
    service4Desc: "Tailored expert advisory regarding materials selection, color theories, layout spacing, and luxury design procurement.",
    
    portfolioTitle: "Our Work",
    portfolioSubtitle: "A curated gallery of residential & commercial masterpieces",
    portfolioFilterAll: "All Masterpieces",
    portfolioFilterLiving: "Living Room",
    portfolioFilterDining: "Dining Room",
    portfolioFilterBedroom: "Bedroom",
    portfolioFilterKitchen: "Kitchen",
    portfolioFilterEntrance: "Entrance & Facade",
    portfolioView: "View Masterpiece",
    portfolioCategoryLabel: "Collection",
    
    testimonialsTitle: "What Clients Say",
    testimonialSubtitle: "Enduring relationships forged through exceptional craft",
    
    contactTitle: "Let's Create Together",
    contactSubtitle: "Entrust us with your vision and let us elevate your standard of living",
    contactNameLabel: "Your Name",
    contactPhoneLabel: "Phone / WhatsApp",
    contactMsgLabel: "Project Scope / Message",
    contactSubmitBtn: "Initiate Consultation ✦",
    contactSending: "Establishing connection...",
    contactSuccessMsg: "Thank you. Hazar AlGhanem's team will reach out within 24 hours.",
    contactLocTitle: "Our Sanctuary",
    contactLocVal: "Aleppo, Syria",
    contactSocialTitle: "Join Our Universe",
    
    footerRights: "HAZAR ALGHANEM © 2026 — All Rights Reserved"
  },
  ar: {
    navHome: "الرئيسية",
    navAbout: "من نحن",
    navServices: "خدماتنا",
    navPortfolio: "أعمالنا",
    navTestimonials: "آراء العملاء",
    navContact: "تواصل معنا",
    
    heroTagline: "نحول الأفكار إلى واقع فاخر تلامسه الحواس ✦",
    heroSub: "استوديو التصميم الداخلي والخارجي",
    heroCTA: "استكشف أعمالنا",
    
    aboutTitle: "استوديو التصميم",
    aboutSub: "هزار الغانم - حلب، سوريا",
    aboutP1: "استوديو هزار الغانم هو استوديو تصميم معماري داخلي وخارجي حائز على جوائز مرموقة، متخصص في ابتكار أرقى المساحات السكنية والتجارية الفاخرة للعملاء ذوي الذوق الرفيع. تأسس برؤية رائدة لإنتاج تصاميم متميزة تجمع بين الرقي والابتكار.",
    aboutP2: "التزامنا بالتنفيذ الخالي من العيوب والتنسيق المصمم خصيصاً أكسبنا نخبة من العملاء. من الفيلات الحلبية المهيبة الفخمة إلى صالات العرض الأنيقة والتجارية، نعتني بكل تفصيل مع احترام بيئة المكان وأصالته التاريخية والحديثة.",
    aboutStat1: "مشروع مكتمل",
    aboutStat2: "سنوات الخبرة",
    aboutStat3: "عميل سعيد",
    aboutPhilosophy: "فلسفة التصميم",
    aboutPhQuote: "“كل مساحة تروي قصة... ونحن نصمم قصتكم.”",
    
    servicesTitle: "خدماتنا الإبداعية",
    servicesSubtitle: "حلول معمارية رفيعة المستوى تم تصميمها بأيدي خبراء لأصحاب الذوق المتميز",
    service1Title: "التصميم الداخلي",
    service1Desc: "صياغة وتخطيط مساحات معيشية وتجارية حصرية توازن بدقة مذهلة بين شاعرية الجمال وعملية الحياة اليومية.",
    service2Title: "التصميم الخارجي واللاندسكيب",
    service2Desc: "تصميم واجهات ذات هيبة معمارية، ومداخل فيلات مهيبة، وتنسيق حدائقي فخم يأسر الألباب من النظرة الأولى.",
    service3Title: "الإظهار المعماري ثلاثي الأبعاد",
    service3Desc: "مخططات ورسومات ثلاثية الأبعاد بدقة فوتوغرافية فائقة مع محاكاة واقعية للغاية للضوء والظل والمواد المستخدمة.",
    service4Title: "الاستشارات التصميمية",
    service4Desc: "استشارات مهنية مخصصة تشتمل على دراسة الألوان، اختيار المواد الفاخرة، تدفق الحركة وتوزيع المساحات المثالي.",
    
    portfolioTitle: "معرض أعمالنا",
    portfolioSubtitle: "سلسلة منتقاة من التحف الفنية السكنية والتجارية الفاخرة",
    portfolioFilterAll: "كل الروائع",
    portfolioFilterLiving: "غرف المعيشة",
    portfolioFilterDining: "غرف الطعام",
    portfolioFilterBedroom: "غرف النوم",
    portfolioFilterKitchen: "المطابخ",
    portfolioFilterEntrance: "المداخل والواجهات",
    portfolioView: "عرض المشروع",
    portfolioCategoryLabel: "المجموعة",
    
    testimonialsTitle: "شهادات نفخر بها",
    testimonialSubtitle: "شراكات مستمرة مبنية على الفن الاستثنائي والالتزام بالاتقان",
    
    contactTitle: "لنبتكر معاً مساحة أحلامك",
    contactSubtitle: "أوكل إلينا رؤيتك وسنقوم بصياغة فضاء يجسد رقيّ معاييرك السكنية والجمالية",
    contactNameLabel: "الاسم الكريم",
    contactPhoneLabel: "رقم الهاتف / الواتساب",
    contactMsgLabel: "نطاق المشروع / تفاصيل الرسالة",
    contactSubmitBtn: "ابدأ استشارتك الفاخرة الآن ✦",
    contactSending: "جاري تأمين الاتصال...",
    contactSuccessMsg: "شكراً لاهتمامكم. سيتواصل فريق هزار الغانم معكم خلال 24 ساعة.",
    contactLocTitle: "مقرّنا الإبداعي",
    contactLocVal: "حلب، سوريا",
    contactSocialTitle: "انضم إلى عالمنا الفني",
    
    footerRights: "استوديو هزار الغانم © 2026 — جميع الحقوق محفوظة"
  }
};

export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: "p1",
    category: "living",
    titleEN: "Aurelia Grand Salon",
    titleAR: "صالون أوريليا المهيب",
    descEN: "Bespoke brass inlays and soft velvet textures create an atmosphere of refined warmth for entertaining elite guests.",
    descAR: "تطعيمات من النحاس المصمم خصيصاً مع لمسات مخملية ناعمة توفر أجواءً من الدفء الملوكي لاستقبال كبار الشخصيات.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p2",
    category: "dining",
    titleEN: "Monarch Feast Hall",
    titleAR: "قاعة الولائم الملكية",
    descEN: "An solid marble dining table centered under floating hand-blown crystal glass pendulums in a glass-walled pavilion.",
    descAR: "طاولة طعام من الرخام الصافي الفاخر، تتوسط ثريات مصنوعة من الكريستال المنفوخ يدوياً في جناح زجاجي فاخر.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p3",
    category: "bedroom",
    titleEN: "Somnus Sanctuary Bedchamber",
    titleAR: "جناح سومنوس الفاخر للنوم",
    descEN: "Accents of brushed bronze, custom woven silk headboard, and amber backlighting create a serene sleep oasis.",
    descAR: "لمسات من البرونز المصقول، لوح سرير من الحرير المغزول يدوياً، وإضاءة خلفية دافئة لشاعرية واسترخاء متكامل.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p4",
    category: "kitchen",
    titleEN: "Therma Culinary Atelier",
    titleAR: "مطبخ ثيرما عالي التقنية والجمال",
    descEN: "Sleek obsidian marble island paired with smart concealed cabinetry and custom-designed linear warm lighting.",
    descAR: "جزيرة مطبخ متكاملة من رخام الأوبسيديان اللامع مقترنة بخزائن ذكية مخفية وإضاءة خطية دافئة مصممة حصرياً.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p5",
    category: "entrance",
    titleEN: "Aleppo Grand Foyer",
    titleAR: "ردهة قصر الشهباء الفاخرة",
    descEN: "Double-height stone portico facing majestic glass arches that celebrate historical Aleppo Syrian masonry in modern layout.",
    descAR: "ردهة شاهقة الارتفاع وجدران حجرية مزينة بأقواس زجاجية تحتفي بعراقة البناء السوري بحلب في قالب عصري فاخر.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p6",
    category: "living",
    titleEN: "Zephyr Panoramic Parlor",
    titleAR: "مجلس زفير ذو الإطلالة البانورامية",
    descEN: "Floor-to-ceiling panoramic views framed in minimalist dark bronze frames, complete with floating fireplace design.",
    descAR: "إطلالات بانورامية من الأرض للسقف مؤطرة بالبرونز الداكن الخفيف مع مدفأة جدارية معلقة حديثة غاية في الجمال والروعة.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p7",
    category: "bedroom",
    titleEN: "Seraphic Master Suite",
    titleAR: "جناح الماستر الملائكي المقمر",
    descEN: "Soft cream textures blended with polished champagne gold trim, offering stunning architectural balance.",
    descAR: "خامات كريمية ناعمة مع لمسات من ذهب الشامبانيا اللامع، توفر توازناً معمارياً غاية في الأناقة والجاذبية.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p8",
    category: "kitchen",
    titleEN: "Titanium Tech Hearth",
    titleAR: "الموقد التكنولوجي المعدني الفاخر",
    descEN: "Brushed metals and dynamic stone worktop custom-shaped for intuitive dining and preparation workflows.",
    descAR: "معادن مصقولة وأسطح عمل حجرية حركية تم تشكيلها لتوفير الراحة والجمالية أثناء تحضير الطعام ومشاركته.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "p9",
    category: "entrance",
    titleEN: "Imperial Vista Portal",
    titleAR: "بوابة رؤية الإمبراطورية الفريدة",
    descEN: "A structural glass entrance with floating staircases and bespoke architectural lighting that welcomes daylight elegantly.",
    descAR: "مدخل زجاجي هيكلي مذهل مزود بسلالم معلقة وإضاءة معمارية إستثنائية ترحب بضوء النهار بكل أناقة انسيابية.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "t1",
    rating: 5,
    quoteEN: "Hazar AlGhanem translated our core family lifestyle values into a sanctuary. The sheer grandeur of the stone masonry they designed for our villa entryway is an absolute masterpiece.",
    quoteAR: "نجح استوديو هزار الغانم في تحويل قيم عائلتنا وأسلوب حياتنا إلى ملاذ آمن ساحر. الفخامة المطلقة للواجهات الحجرية التي صمموها لمدخل فيلتنا هي تحفة فنية لا تُضاهى.",
    clientEN: "Al-Sayyed Tareq Al-Husseini",
    clientAR: "السيد طارق الحسيني",
    roleEN: "Aleppo Landmark Villa Owner",
    roleAR: "مالك قيّصري لفيلا في حلب"
  },
  {
    id: "t2",
    rating: 5,
    quoteEN: "Exceptional designers. Their material selections, photorealistic render fidelity, and unwavering devotion to architectural details are unmatched in the region. Incredible work.",
    quoteAR: "مصممون استثنائيون. اختيارهم المذهل للمواد، والدقة الفائقة لرسوماتهم المعرضة، وحرصهم الشديد على أدق التفاصيل المعمارية يجعلهم الأفضل بلا منازع في المنطقة.",
    clientEN: "Dr. Reem Al-Jabri",
    clientAR: "الدكتورة ريم الجابري",
    roleEN: "Founder, Zenith Medical Gallery",
    roleAR: "مؤسسة معرض زينيث ومشفى تجميل"
  },
  {
    id: "t3",
    rating: 5,
    quoteEN: "We entrusted the studio with our corporate headquarters. The Glassmorphism aesthetic they developed integrates natural sunlight with obsidian stone, elevating client trust on arrival.",
    quoteAR: "لقد أسندنا للاستوديو مهمة تصميم مقرنا الرئيسي. إن جماليات الزجاج المتجمد التي ابتكروها تدمج ضوء الشمس الطبيعي مع حجر الأوبسيديان الفاخر، مما يعزز ثقة عملائنا بمجرد دخولهم.",
    clientEN: "Engineer Omar Al-Sadi",
    clientAR: "المهندس عمر السعدي",
    roleEN: "CEO, Levant Heritage Group",
    roleAR: "الرئيس التنفيذي لمجموعة الهيريتج للمقاولات"
  }
];
