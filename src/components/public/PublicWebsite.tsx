import React, { useState } from 'react';
import { 
  Code2, 
  Smartphone, 
  Server, 
  Database, 
  Palette, 
  FileSpreadsheet,
  ArrowRight, 
  CheckCircle2, 
  Send, 
  Calculator, 
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Star,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  LogIn,
  ExternalLink,
  Cpu,
  Lock,
  Cloud,
  Check,
  X,
  UserCheck,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AGENCY_CONFIG } from '../../mockData';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../BrandLogo';
import { FrontendChatbot } from './FrontendChatbot';
import { SupabaseAuthModal } from '../portal/SupabaseAuthModal';
import { ClientPortalModal } from './ClientPortalModal';
import { SocialIcon } from '../common/SocialIcon';
import { formatSocialUrl } from '../../utils/socialPlatforms';
import { SocialChannelItem, LegalDocument } from '../../types';

export const PublicWebsite: React.FC = () => {
  const { 
    portfolio, 
    addEnquiry, 
    setCurrentView, 
    setActiveTab, 
    currentUser, 
    setCurrentUser,
    users,
    agencyConfig,
    legalDocuments,
    trackVisitorEvent
  } = useApp();

  const config = agencyConfig || AGENCY_CONFIG;

  // Track initial page view (privacy-conscious telemetry)
  React.useEffect(() => {
    trackVisitorEvent({
      eventType: 'page_view',
      pagePath: '/',
      sectionId: '#home'
    });
  }, []);
  
  // Extract active social channels dynamically
  const activeSocialChannels: SocialChannelItem[] = React.useMemo(() => {
    if (config.social_channels && Array.isArray(config.social_channels) && config.social_channels.length > 0) {
      return config.social_channels.filter(c => c.active && c.url && c.url.trim().length > 0);
    }
    if (config.socialChannels && Array.isArray(config.socialChannels) && config.socialChannels.length > 0) {
      return config.socialChannels.filter(c => c.active && c.url && c.url.trim().length > 0);
    }
    const sl = (config.social_links || config.socialLinks || {}) as Record<string, string>;
    const fallbackList: SocialChannelItem[] = [];
    if (sl.linkedin) fallbackList.push({ id: 'linkedin', platform: 'linkedin', name: 'LinkedIn', url: sl.linkedin, active: true });
    if (sl.github) fallbackList.push({ id: 'github', platform: 'github', name: 'GitHub', url: sl.github, active: true });
    if (sl.whatsapp) fallbackList.push({ id: 'whatsapp', platform: 'whatsapp', name: 'WhatsApp', url: sl.whatsapp, active: true });
    if (sl.twitter) fallbackList.push({ id: 'twitter', platform: 'twitter', name: 'Twitter / X', url: sl.twitter, active: true });
    if (sl.instagram) fallbackList.push({ id: 'instagram', platform: 'instagram', name: 'Instagram', url: sl.instagram, active: true });
    if (sl.youtube) fallbackList.push({ id: 'youtube', platform: 'youtube', name: 'YouTube', url: sl.youtube, active: true });
    return fallbackList;
  }, [config]);

  const { success, info } = useToast();
  
  // Navigation active state & mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showClientPortalModal, setShowClientPortalModal] = useState(false);
  const [selectedPortfolioModal, setSelectedPortfolioModal] = useState<any | null>(null);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocument | null>(null);

  // Portfolio filter category
  const [portfolioCategory, setPortfolioCategory] = useState<string>('all');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Cost Estimator state
  const [platform, setPlatform] = useState<'web' | 'mobile' | 'both'>('web');
  const [backendNeeds, setBackendNeeds] = useState<'standard' | 'enterprise'>('standard');
  const [uiLevel, setUiLevel] = useState<'custom' | 'design_system'>('custom');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Auth & Security', 'Database Storage']);
  const [estimatorApplied, setEstimatorApplied] = useState(false);

  // Contact / Enquiry form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    gstin: '',
    address: '',
    serviceCategory: 'web_development' as const,
    projectDescription: '',
    budgetRange: '₹1,50,000 - ₹3,00,000'
  });
  const [submitted, setSubmitted] = useState(false);
  const [gstinError, setGstinError] = useState<string | null>(null);

  // Feature pricing options for estimator
  const featureOptions = [
    { id: 'Auth & Security', name: 'User Auth & Role-Based Access Control', price: 25000 },
    { id: 'Database Storage', name: 'PostgreSQL / Supabase Scalable DB', price: 30000 },
    { id: 'Payment Gateway', name: 'Razorpay / Stripe Payment Processing', price: 35000 },
    { id: 'Real-time WebSockets', name: 'Real-time Live Sync & WebSockets', price: 40000 },
    { id: 'PDF & Reports', name: 'GST Compliant PDF Generation Engine', price: 20000 },
    { id: 'AI Assistant', name: 'Gemini AI Intelligent Model Integration', price: 45000 }
  ];

  const calculateEstimatedTotal = () => {
    let base = platform === 'web' ? 75000 : platform === 'mobile' ? 95000 : 150000;
    if (backendNeeds === 'enterprise') base += 50000;
    if (uiLevel === 'design_system') base += 35000;
    selectedFeatures.forEach(featId => {
      const found = featureOptions.find(f => f.id === featId);
      if (found) base += found.price;
    });
    return base;
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleApplyEstimatorToForm = () => {
    const est = calculateEstimatedTotal();
    const estFormatted = `₹${(est/100000).toFixed(1)}L - ₹${((est*1.3)/100000).toFixed(1)}L`;
    setForm(prev => ({
      ...prev,
      budgetRange: estFormatted,
      projectDescription: prev.projectDescription || `Estimated for ${platform === 'both' ? 'Web + Mobile' : platform === 'web' ? 'Web Portal' : 'Mobile App'} with ${selectedFeatures.join(', ')}.`
    }));
    setEstimatorApplied(true);
    info('Estimator Applied', `Populated enquiry scope with calculated estimate (${estFormatted}).`);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // GSTIN format check if provided
    const cleanGstin = form.gstin.trim().toUpperCase();
    if (cleanGstin && cleanGstin.length !== 15) {
      setGstinError('Indian GSTIN must be exactly 15 alphanumeric characters.');
      return;
    }
    setGstinError(null);

    addEnquiry({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      gstin: cleanGstin,
      address: form.address.trim(),
      serviceCategory: form.serviceCategory,
      budgetRange: form.budgetRange,
      estimatedTimeline: '3-6 Weeks',
      projectDescription: form.projectDescription.trim(),
      featuresRequired: selectedFeatures,
      source: 'website_form'
    });
    setSubmitted(true);
    success('Project Scope Submitted Successfully!', `Thank you ${form.name}. Our solutions architect will review your submission and contact you within 24 business hours.`);
  };

  const handleLoginAs = (userObj: any) => {
    setCurrentUser(userObj);
    setShowLoginModal(false);
    setCurrentView('portal');
    setActiveTab('dashboard');
    success('Authenticated Session', `Signed in as ${userObj.name} (${userObj.role.replace('_', ' ').toUpperCase()}).`);
  };

  // FAQs Data
  const faqs = [
    {
      question: 'How does the engagement and development lifecycle work?',
      answer: 'Our workflow follows a structured 4-step agile process: 1) Architectural Discovery & Scope Definition, 2) Milestone-Based Commercial Quotation with GST breakdown, 3) Iterative Sprint Sprints with weekly live test links, and 4) Final Production Deployment, Security Audit, and 100% IP Code Handover.'
    },
    {
      question: 'What is your pricing model and how are payments structured?',
      answer: 'We provide transparent fixed-price quotations based on agreed deliverables. Typically, engagements follow a 50% initiation advance, 30% on beta milestone delivery, and 20% on final deployment. All quotations and invoices are GST-compliant (SAC Code 998314) with instant PDF downloads.'
    },
    {
      question: 'Do we own 100% of the code and intellectual property (IP)?',
      answer: 'Yes, absolutely. Upon settlement of the final invoice, 100% of the source code, design assets, database schemas, and intellectual property rights are unconditionally transferred to your organization.'
    },
    {
      question: 'What post-launch support and warranty do you offer?',
      answer: 'Every project comes with an inclusive 60-day post-launch warranty covering bug fixes, performance monitoring, and server configuration. We also offer dedicated monthly SLA maintenance packages.'
    },
    {
      question: 'Can you integrate with our existing backend or database?',
      answer: 'Yes. We specialize in greenfield application development as well as modernizing legacy systems, building custom REST/GraphQL APIs, and integrating with Supabase, PostgreSQL, Firebase, MongoDB, or third-party enterprise services.'
    },
    {
      question: 'Are your quotations and tax invoices GST compliant in India?',
      answer: `Yes. ${config.company_name || config.name || 'Fusion Forge Creation'} is registered under GSTIN ${config.gstin || '26AALFF1234F1Z5'} with Service Accounting Code SAC ${config.sacCode || '998314'} (Information Technology Software Services) in ${config.city || 'Silvassa'} (${config.state || 'Dadra & Nagar Haveli'}). We provide full B2B tax invoices with CGST/SGST or IGST breakdowns for full input tax credit (ITC).`
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      quote: 'Fusion Forge Creation engineered our real-time financial trading analytics platform with exceptional speed and reliability. Sub-second data updates and pristine UI made all the difference.',
      name: 'Arvind Kapoor',
      role: 'Chief Executive Officer',
      company: 'Apex Fintech Solutions Pvt. Ltd.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      project: 'Apex Financial Intelligence Platform'
    },
    {
      quote: 'Their technical execution on our cross-platform telemedicine suite was world-class. From HIPAA-compliant data encryption to crystal-clear WebRTC video streaming, they delivered ahead of schedule.',
      name: 'Dr. Sameer Sen',
      role: 'Head of Digital Products',
      company: 'Nexus HealthTech India',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      project: 'Nexus Telehealth Consultation Suite'
    },
    {
      quote: 'The team transformed our logistics dispatch workflow with automated GPS telematics and GST-ready billing. The investment paid for itself within the first quarter.',
      name: 'Sunita Rao',
      role: 'VP Operations',
      company: 'Quantum Logistics & Freight',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      project: 'Quantum Fleet Telematics Engine'
    }
  ];

  // Tech Stack Data
  const techCategories = [
    {
      category: 'Frontend & UI',
      items: [
        { name: 'React 19 & Next.js', desc: 'Modern reactive component architecture' },
        { name: 'TypeScript', desc: 'Strict end-to-end type safety' },
        { name: 'Tailwind CSS', desc: 'Utility-first responsive styling' },
        { name: 'Motion & Animations', desc: 'Fluid micro-interactions' }
      ]
    },
    {
      category: 'Backend & APIs',
      items: [
        { name: 'Node.js & Express', desc: 'High-throughput microservices' },
        { name: 'Go (Golang)', desc: 'Ultra-fast concurrent data processors' },
        { name: 'GraphQL & REST', desc: 'Clean, documented API contracts' },
        { name: 'WebSockets', desc: 'Sub-second real-time streaming' }
      ]
    },
    {
      category: 'Databases & Storage',
      items: [
        { name: 'PostgreSQL', desc: 'ACID compliant enterprise relational data' },
        { name: 'Supabase & BaaS', desc: 'Managed Postgres with instant RLS' },
        { name: 'Redis Cache', desc: 'In-memory fast caching & rate limiting' },
        { name: 'MongoDB', desc: 'Flexible document schemas' }
      ]
    },
    {
      category: 'Cloud, DevOps & Tools',
      items: [
        { name: 'Docker & Containers', desc: 'Reproducible production containers' },
        { name: 'Google Cloud & AWS', desc: 'Scalable serverless & VM infrastructure' },
        { name: 'CI/CD Pipelines', desc: 'Automated testing and zero-downtime deploy' },
        { name: 'GST & PDF Engine', desc: 'Automated tax billing and receipt generation' }
      ]
    }
  ];

  // Portfolio items extended
  const allPortfolio = [
    ...portfolio,
    {
      id: 'port_3',
      title: 'Quantum Fleet Telematics & IoT Engine',
      clientName: 'Quantum Logistics & Freight',
      category: 'Enterprise Cloud',
      summary: 'Real-time GPS vehicle tracking, geofencing, fuel analytics, and automated consignment dispatching.',
      deliverables: ['Live Map Dashboard', 'Driver Mobile App', 'Automated GST Dispatch Invoices'],
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets', 'Tailwind CSS'],
      bannerGradient: 'from-emerald-600 to-teal-900'
    },
    {
      id: 'port_4',
      title: 'Aura EcoLiving D2C Headless Commerce',
      clientName: 'Aura EcoLiving Ltd.',
      category: 'Web Application',
      summary: 'High-converting direct-to-consumer store with custom checkout, Razorpay gateway, and inventory sync.',
      deliverables: ['Headless Storefront', 'Admin Order Desk', 'Razorpay Payment Flow'],
      techStack: ['React 19', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Stripe/Razorpay'],
      bannerGradient: 'from-amber-600 to-rose-900'
    }
  ];

  const filteredPortfolio = portfolioCategory === 'all' 
    ? allPortfolio 
    : allPortfolio.filter(p => p.category.toLowerCase().includes(portfolioCategory.toLowerCase()));

  return (
    <div id="home" className="bg-gradient-to-b from-[#060c1d] via-[#091433] to-[#04091a] text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER / NAVBAR (LOGO | Home | Services | Projects | FAQs | Contact | Login)
          ───────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0a1330]/90 backdrop-blur-xl border-b border-blue-500/20 shadow-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <a href="#home" className="flex items-center group cursor-pointer">
            <BrandLogo size="md" variant="full" theme="dark" />
          </a>

          {/* DESKTOP NAV LINKS (Services | Portfolio | Testimonials | FAQ | Enquiry) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <a 
              href="#services"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              Services
            </a>
            <a 
              href="#projects"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              Portfolio
            </a>
            <a 
              href="#testimonials"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              Testimonials
            </a>
            <a 
              href="#faqs"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              FAQ
            </a>
            <a 
              href="#contact"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              Enquiry
            </a>
          </div>

          {/* RIGHT ACTION: SUPER ADMIN PANEL & Start Project Buttons */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-nav-super-admin-panel"
              onClick={() => setShowLoginModal(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-blue-500/30 text-slate-200 hover:text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>SUPER ADMIN PANEL</span>
            </button>

            <a
              id="btn-nav-start-project"
              href="#contact"
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0047cc] to-[#0077ff] hover:from-[#003bb3] hover:to-[#0066ee] text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Start Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-blue-500/30 text-slate-300 shadow-md md:hidden cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1330] border-b border-blue-500/20 px-6 py-4 space-y-2 shadow-2xl">
            <a 
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              Services
            </a>
            <a 
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              Portfolio
            </a>
            <a 
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              Testimonials
            </a>
            <a 
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              FAQ
            </a>
            <a 
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              Enquiry
            </a>
            <div className="pt-2 border-t border-blue-500/20">
              <button
                id="btn-mobile-super-admin-panel"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLoginModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SUPER ADMIN PANEL</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO / MAIN BANNER ("Where Ideas Fuse With Technology")
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden border-b border-blue-500/20">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/20 via-cyan-500/10 to-transparent blur-3xl pointer-events-none -z-0" />
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: HERO CONTENT (7 Cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Badge: FUSION FORGE CREATIONS */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-cyan-400 text-xs font-bold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="tracking-wider uppercase text-[11px] sm:text-xs">FUSION FORGE CREATIONS</span>
              </div>
              
              {/* Main Headline: WHERE IDEAS FUSE WITH TECHNOLOGY */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                WHERE IDEAS <br />
                FUSE WITH <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0088ff] via-[#00c8ff] to-[#0077ff]">
                  TECHNOLOGY
                </span>
              </h1>
              
              {/* Sub-headline description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                We design, architect, and deploy high-performance web applications, mobile apps, custom backend microservices, and enterprise business software tailored to scale your vision.
              </p>
              
              {/* 3 Pill Badges (Custom Apps | Supabase | Security) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0e1938] border border-blue-500/30 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Custom Apps</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0e1938] border border-blue-500/30 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Supabase</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0e1938] border border-blue-500/30 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Security</span>
                </div>
              </div>

              {/* Action Buttons: Request Free Quote | Our Core Services */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <a 
                  id="btn-hero-request-quote"
                  href="#contact"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#003899] via-[#0055d4] to-[#0099ff] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/30 hover:scale-[1.02] flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  <span>Request Free Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a 
                  id="btn-hero-core-services"
                  href="#services"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0e1938] hover:bg-[#152554] border border-blue-500/30 text-slate-200 font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span className="text-cyan-400 font-mono text-xs">&lt;/&gt;</span>
                  <span>Our Core Services</span>
                </a>
              </div>

              {/* Stats Counters (100% Custom Code | 99.9% Uptime SLA | 24/7 Support) */}
              <div className="pt-6 border-t border-blue-500/20 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">100%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Custom Code</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">99.9%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">24/7</div>
                  <div className="text-[11px] text-slate-400 font-medium">Support</div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: REPLICA OF THE HERO OFFICIAL BANNER CARD (6 Cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-xl lg:max-w-none group">
                {/* Glowing Aura underneath the banner frame */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/40 to-cyan-500/40 rounded-[28px] blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                
                {/* Clean Framed Card in Dark Gradient with Glowing Border */}
                <div className="relative rounded-[24px] bg-gradient-to-b from-[#111e47]/95 to-[#0a1330]/95 p-2.5 sm:p-3 shadow-2xl shadow-blue-950/80 border border-blue-500/30">
                  
                  {/* Top Badge: OFFICIAL BANNER */}
                  <div className="absolute top-5 right-5 z-20">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#08143d]/85 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-blue-500/30 shadow-md">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>OFFICIAL BANNER</span>
                    </span>
                  </div>

                  {/* Banner Image Container */}
                  <div className="w-full overflow-hidden rounded-[18px] bg-slate-950 aspect-[1440/600] flex items-center justify-center">
                    <img 
                      src="/banner.svg" 
                      alt="Fusion Forge Creations - Where Ideas Fuse With Technology" 
                      className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. SERVICES SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 border-b border-blue-500/20 bg-[#050b1a]/95 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Core Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Engineering Services
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-md mt-3 md:mt-0 leading-relaxed">
              End-to-end technical craftsmanship across modern web architectures, native mobile ecosystems, cloud backends, and GST billing automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1: Web Development */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                  <Code2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Web Application Development</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  High-speed single page applications, enterprise customer portals, and dynamic SaaS platforms built using React 19, TypeScript, and Next.js.
                </p>
                <div className="space-y-2 mb-6">
                  {['React 19 & Next.js Frameworks', 'Interactive Data Dashboards', 'Sub-second Page Speeds', 'Secure Client Portals'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-200 space-x-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-4 border-t border-blue-500/20 group-hover:translate-x-1 transition-transform"
              >
                <span>Request Web Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 2: Mobile Engineering */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all mb-6">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mobile App Engineering</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Native feel, cross-platform mobile apps for iOS and Android built on React Native with smooth offline caching and native hardware integrations.
                </p>
                <div className="space-y-2 mb-6">
                  {['iOS & Android Cross-Platform', 'Push Notifications & Background Sync', 'Native Biometrics & Camera Access', 'App Store & Play Store Deployment'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-200 space-x-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-4 border-t border-blue-500/20 group-hover:translate-x-1 transition-transform"
              >
                <span>Request Mobile Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 3: Backend & Cloud */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-purple-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all mb-6">
                  <Server className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Backend & Cloud Architecture</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Microservices, serverless workloads, REST/GraphQL APIs, and auto-scaling cloud deployments with 99.9% uptime architecture.
                </p>
                <div className="space-y-2 mb-6">
                  {['Node.js, Express & Go Services', 'Docker Container Orchestration', 'AWS / Google Cloud Setup', 'OAuth 2.0 & JWT Security Control'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-200 space-x-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-purple-400 hover:text-purple-300 pt-4 border-t border-blue-500/20 group-hover:translate-x-1 transition-transform"
              >
                <span>Request Backend Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 4: Database & Realtime */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-emerald-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-6">
                  <Database className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Database & Real-time Systems</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Relational PostgreSQL, Supabase BaaS, and Redis caching layers designed for zero data loss and sub-millisecond query performance.
                </p>
                <div className="space-y-2 mb-6">
                  {['PostgreSQL Schema & RLS Policies', 'Supabase Database Provisioning', 'Redis In-Memory Caching', 'WebSocket Live Multi-User Sync'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-200 space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-4 border-t border-blue-500/20 group-hover:translate-x-1 transition-transform"
              >
                <span>Request DB Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 5: UI/UX Design */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-pink-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-all mb-6">
                  <Palette className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">UI/UX & Design Systems</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Bespoke design systems, responsive wireframing, high-fidelity Figma interactive prototypes, and conversion-focused user interfaces.
                </p>
                <div className="space-y-2 mb-6">
                  {['Figma High-Fidelity Prototypes', 'Design Tokens & UI Component Kits', 'Mobile Responsive Grid Math', 'User Flow & Usability Audits'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-200 space-x-2">
                      <Check className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-pink-400 hover:text-pink-300 pt-4 border-t border-blue-500/20 group-hover:translate-x-1 transition-transform"
              >
                <span>Request UI/UX Prototype</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 6: GST Billing & Invoicing Systems */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all mb-6">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">GST Billing & Accounting Systems</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Automated quotation and tax invoice software engines with SAC Code 998314 compliance, dynamic tax calculation, and instant PDF generation.
                </p>
                <div className="space-y-2 mb-6">
                  {['SAC 998314 Compliant Invoicing', 'CGST, SGST & IGST Calculation', 'Automated PDF Document Output', 'Client CRM & Payment Ledger'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-200 space-x-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300 pt-4 border-t border-blue-500/20 group-hover:translate-x-1 transition-transform"
              >
                <span>Explore Invoicing Tech</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FEATURED PROJECTS SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="projects" className="py-24 border-b border-blue-500/20 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30">
              Featured Case Studies
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
              Delivered Digital Products
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            {['all', 'Web Application', 'Mobile App', 'Enterprise Cloud'].map(cat => (
              <button
                key={cat}
                onClick={() => setPortfolioCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  portfolioCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#0e1938] text-slate-300 hover:text-white border border-blue-500/20'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPortfolio.map(proj => (
            <div 
              key={proj.id}
              className="rounded-3xl border border-blue-500/20 bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 overflow-hidden hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between shadow-2xl group"
            >
              {/* Project Card Header Banner */}
              <div className={`h-40 bg-gradient-to-r ${proj.bannerGradient} p-6 flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex justify-between items-start relative z-10">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-bold text-white border border-white/15 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <span className="text-xs text-white/90 font-bold bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                    {proj.clientName}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md relative z-10">
                  {proj.title}
                </h3>
              </div>

              {/* Project Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <p className="text-sm text-slate-300 leading-relaxed">{proj.summary}</p>
                  
                  {/* Deliverables checklist */}
                  <div className="mt-4 space-y-1.5">
                    {proj.deliverables.map((del, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-slate-200 font-medium">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tech stack pills */}
                  <div className="pt-4 border-t border-blue-500/20 flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#08122c] border border-blue-500/30 text-[11px] font-mono font-semibold text-cyan-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedPortfolioModal(proj)}
                    className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-xs font-bold text-cyan-200 hover:text-white flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>View Architectural Specs</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. TECHNOLOGY STACK SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="tech-stack" className="py-24 border-b border-blue-500/20 bg-gradient-to-b from-[#070e24] to-[#050b1d] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Modern Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
              Technology Stack & Tooling
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              We leverage production-hardened frameworks and modern cloud services for maximum speed, security, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techCategories.map((cat, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-blue-400/40 transition-all flex flex-col justify-between shadow-xl">
                <div>
                  <div className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-4 pb-3 border-b border-blue-500/20">
                    {cat.category}
                  </div>
                  <div className="space-y-4">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <Cpu className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 pl-4">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. TESTIMONIALS SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 border-b border-blue-500/20 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Client Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            Trusted by Visionary Leaders
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            See how Fusion Forge Creation delivers concrete ROI and dependable software architecture for forward-thinking businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-blue-400/40 flex flex-col justify-between shadow-xl transition-all relative"
            >
              <div>
                <div className="flex space-x-1 text-amber-400 mb-4">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{testi.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-blue-500/20 flex items-center space-x-3">
                <img 
                  src={testi.avatar} 
                  alt={testi.name}
                  className="w-11 h-11 rounded-full object-cover border border-cyan-400/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white">{testi.name}</div>
                  <div className="text-[11px] text-slate-400">{testi.role}</div>
                  <div className="text-[10px] text-cyan-400 font-semibold">{testi.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. FAQS SECTION (Frequently Asked Questions)
          ───────────────────────────────────────────────────────────── */}
      <section id="faqs" className="py-24 border-b border-blue-500/20 bg-gradient-to-b from-[#070e24] to-[#050b1d] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Everything you need to know about our workflow, billing, code ownership, and warranties.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 overflow-hidden shadow-md transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-blue-500/15 text-cyan-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-blue-500/20 text-xs sm:text-sm text-slate-300 leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick FAQ CTA */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#111e47] to-[#0c1636] border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl">
            <div>
              <div className="text-sm font-bold text-white">Have a customized project question?</div>
              <div className="text-xs text-slate-300">Speak directly with our technical team in {config.city || 'Silvassa'}, {config.state || 'Dadra & Nagar Haveli'}.</div>
            </div>
            <a 
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30"
            >
              Get in Touch
            </a>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. ENQUIRY / CONTACT & COST ESTIMATOR SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30">
            Start Your Engagement
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            Project Scope Submission
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Submit your project scope, technical requirements, and organizational GST details below or use our interactive cost estimator to receive an official formal Quotation within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Project Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#111e47]/95 to-[#0a1330]/95 border border-blue-500/25 shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-cyan-400 mb-4">
              <Mail className="w-4 h-4" />
              <span>Project Scope Submission</span>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-black text-white">Project Scope Submitted Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you! Your requirements and organizational details have been registered in our Project Portal. Manoj Satapathy & the engineering team will deliver a structured commercial proposal to <span className="font-mono text-cyan-400 font-bold">{form.email}</span> shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setGstinError(null);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        gstin: '',
                        address: '',
                        serviceCategory: 'web_development',
                        projectDescription: '',
                        budgetRange: '₹1,50,000 - ₹3,00,000'
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Submit Another Project
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Vikramaditya Bose"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Official Email *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="vikram@company.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="Enterprise / Startup Name"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* GSTIN and Address Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                        GSTIN
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">15-Digit (Optional if URP)</span>
                    </div>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 27AABCA1234F1ZM"
                      value={form.gstin}
                      onChange={e => {
                        setForm({ ...form, gstin: e.target.value.toUpperCase() });
                        if (gstinError) setGstinError(null);
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border text-xs text-white placeholder:text-slate-500 focus:bg-slate-900 outline-none transition-colors uppercase font-mono ${
                        gstinError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-blue-500'
                      }`}
                    />
                    {gstinError && (
                      <p className="text-[10px] text-rose-400 mt-1 font-medium">{gstinError}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Corporate / Registered Office Address"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Target Service Category *
                    </label>
                    <select
                      value={form.serviceCategory}
                      onChange={e => setForm({ ...form, serviceCategory: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="web_development" className="bg-[#0a1330] text-white">Web Application Development</option>
                      <option value="mobile_app" className="bg-[#0a1330] text-white">Mobile Application (iOS/Android)</option>
                      <option value="full_stack_enterprise" className="bg-[#0a1330] text-white">Full-Stack Enterprise Suite</option>
                      <option value="backend_api" className="bg-[#0a1330] text-white">Backend & Cloud Architecture</option>
                      <option value="database_solutions" className="bg-[#0a1330] text-white">Database & Realtime Systems</option>
                      <option value="ui_ux_design" className="bg-[#0a1330] text-white">UI/UX & Design Systems</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Estimated Budget Range
                    </label>
                    <select
                      value={form.budgetRange}
                      onChange={e => setForm({ ...form, budgetRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="₹50,000 - ₹1,50,000" className="bg-[#0a1330] text-white">₹50,000 - ₹1,50,000 (MVP / Prototype)</option>
                      <option value="₹1,50,000 - ₹3,00,000" className="bg-[#0a1330] text-white">₹1,50,000 - ₹3,00,000 (Standard Web/App)</option>
                      <option value="₹3,00,000 - ₹6,00,000" className="bg-[#0a1330] text-white">₹3,00,000 - ₹6,00,000 (Enterprise Cloud)</option>
                      <option value="₹6,00,000+" className="bg-[#0a1330] text-white">₹6,00,000+ (High-Scale Multi-Platform)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Project Scope & Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your target objectives, required user flows, external integrations, timeline, etc..."
                    value={form.projectDescription}
                    onChange={e => setForm({ ...form, projectDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-xl shadow-blue-600/30 hover:scale-[1.01] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Project Scope for Quotation</span>
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Quick Interactive Cost Estimator & Agency Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Cost Estimator Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/95 to-[#0a1330]/95 border border-blue-500/25 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Ballpark Estimator</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-cyan-300 text-[10px] font-bold font-mono">
                  SAC 998314
                </span>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-300 tracking-wider block mb-2">
                  1. Platform
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'web', label: 'Web' },
                    { id: 'mobile', label: 'Mobile' },
                    { id: 'both', label: 'Both' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPlatform(item.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        platform === item.id 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                          : 'bg-[#0e1938] border border-blue-500/30 text-slate-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature checkboxes */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-300 tracking-wider block mb-2">
                  2. Select Key Features
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {featureOptions.map(feat => {
                    const selected = selectedFeatures.includes(feat.id);
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat.id)}
                        className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selected 
                            ? 'bg-blue-900/40 border-blue-400/60 text-white' 
                            : 'bg-[#08122c] border-slate-700/80 text-slate-300 hover:border-blue-500/40'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span className="text-[11px] font-semibold truncate">{feat.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold ml-2">
                          +₹{feat.price/1000}k
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-blue-500/20 space-y-1">
                <div className="text-[11px] text-slate-400">Estimated Development Budget</div>
                <div className="text-2xl font-black text-white font-mono">
                  ₹ {calculateEstimatedTotal().toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-slate-400 ml-1">+ 18% GST</span>
                </div>
                <div className="text-xs text-cyan-400 font-mono font-semibold">
                  Grand Total: ₹ {Math.round(calculateEstimatedTotal() * 1.18).toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyEstimatorToForm}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/30 cursor-pointer"
              >
                <span>{estimatorApplied ? '✓ Applied to Form' : 'Apply Estimate to Scope'}</span>
              </button>
            </div>

            {/* Direct Contact Info Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 text-xs space-y-3 shadow-xl">
              <div className="font-bold text-white text-sm flex items-center justify-between">
                <span>Direct Agency Contacts</span>
                <span className="text-[10px] text-emerald-400 font-normal">Active Today</span>
              </div>
              
              <div className="flex items-start space-x-3 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{config.company_name || config.name}</div>
                  <div className="text-slate-400 leading-relaxed">{config.address}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href={`mailto:${config.email}`} className="font-mono text-slate-300 hover:text-cyan-400 transition-colors">{config.email}</a>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} className="font-mono text-slate-300 hover:text-emerald-400 transition-colors">{config.phone}</a>
              </div>

              <div className="pt-2 border-t border-blue-500/20 flex items-center justify-between text-[11px] text-slate-400">
                <span>GSTIN: <strong className="text-slate-200 font-mono">{config.gstin}</strong></span>
                <span>PAN: <strong className="text-slate-200 font-mono">{config.pan}</strong></span>
              </div>

              {/* Social Channels in Contact Box */}
              <div className="pt-2 border-t border-blue-500/20 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Social Channels</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeSocialChannels.map(channel => (
                    <a
                      key={channel.id}
                      href={formatSocialUrl(channel.url, channel.platform)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-all hover:scale-105"
                      title={channel.name}
                      aria-label={channel.name}
                    >
                      <SocialIcon platform={channel.platform} className="w-3.5 h-3.5" />
                    </a>
                  ))}
                  {activeSocialChannels.length === 0 && (
                    <span className="text-[10px] text-slate-500 italic">No channels active</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-blue-500/20 bg-[#040816] pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-blue-500/20">
            
            {/* Col 1: Brand Info & Social Links */}
            <div className="space-y-4 md:col-span-1">
              <BrandLogo size="sm" variant="full" theme="dark" showTagline={false} />
              <p className="text-xs text-slate-400 leading-relaxed">
                {config.tagline || 'Where Ideas Fuse With Technology'}. Premier software engineering agency building bespoke web, mobile, and cloud architectures.
              </p>
              <div className="text-[11px] text-cyan-400 font-bold tracking-wider">
                INNOVATE • BUILD • AUTOMATE • GROW
              </div>

              {/* Social Channels in Footer */}
              <div className="pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Follow & Connect
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activeSocialChannels.map(channel => (
                    <a
                      key={channel.id}
                      href={formatSocialUrl(channel.url, channel.platform)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-all shadow-sm hover:scale-105"
                      title={channel.name}
                      aria-label={channel.name}
                    >
                      <SocialIcon platform={channel.platform} className="w-4 h-4" />
                    </a>
                  ))}
                  {activeSocialChannels.length === 0 && (
                    <span className="text-[11px] text-slate-500 italic">No social links configured</span>
                  )}
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Navigation</div>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-cyan-400 transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Services</a></li>
                <li><a href="#projects" className="hover:text-cyan-400 transition-colors">Featured Projects</a></li>
                <li><a href="#tech-stack" className="hover:text-cyan-400 transition-colors">Technology Stack</a></li>
                <li><a href="#faqs" className="hover:text-cyan-400 transition-colors">Frequently Asked Questions</a></li>
                <li><a href="#contact" className="hover:text-cyan-400 transition-colors">Contact & Enquiry</a></li>
              </ul>
            </div>

            {/* Col 3: Technical Capabilities */}
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Services</div>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Web Development</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Mobile Applications</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Backend & Cloud APIs</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">Database Engineering</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">UI/UX Design Systems</a></li>
                <li><a href="#services" className="hover:text-cyan-400 transition-colors">GST Accounting Engines</a></li>
              </ul>
            </div>

            {/* Col 4: Tax & Legal Compliance */}
            <div className="space-y-3">
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Compliance & Office</span>
                <span className="text-[10px] text-cyan-400 lowercase font-mono">SAC: {config.sacCode || '998314'}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="font-mono text-slate-200 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">{config.gstin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PAN:</span>
                  <span className="font-mono text-slate-200 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">{config.pan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SAC Code:</span>
                  <span className="font-mono text-slate-200">{config.sacCode || '998314'} (IT Software)</span>
                </div>
                <div className="pt-1 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-0.5">Registered Office:</div>
                  <div className="text-slate-200 text-[11px] leading-relaxed font-medium">
                    {config.address}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  Jurisdiction: <span className="text-slate-200 font-semibold">{config.jurisdiction || 'Silvassa, Dadra & Nagar Haveli'}</span>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  id="btn-footer-staff-portal"
                  onClick={() => setShowLoginModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>Staff Portal</span>
                </button>
                <button
                  id="btn-footer-client-portal"
                  onClick={() => setShowClientPortalModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>Client Portal</span>
                </button>
              </div>
            </div>

          </div>

          {/* Copyright & Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span>
                © 2026 <span className="text-slate-300 font-semibold">Fusion Forge Creation</span>. All rights reserved.
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-slate-400 font-medium">
                Designed & Developed by <span className="text-cyan-400 font-semibold">Fusion Forge Creation</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-3 text-slate-400">
              <button 
                type="button"
                onClick={() => {
                  const doc = legalDocuments.find(d => d.slug === 'privacy-policy') || legalDocuments[0];
                  if (doc) setSelectedLegalDoc(doc);
                }}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-slate-700">•</span>
              <button 
                type="button"
                onClick={() => {
                  const doc = legalDocuments.find(d => d.slug === 'terms-of-engagement') || legalDocuments[1];
                  if (doc) setSelectedLegalDoc(doc);
                }}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Terms of Engagement
              </button>
              <span className="text-slate-700">•</span>
              <button 
                type="button"
                onClick={() => {
                  const doc = legalDocuments.find(d => d.slug === 'gst-compliance') || legalDocuments[2];
                  if (doc) setSelectedLegalDoc(doc);
                }}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                GST Compliance
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PUBLIC LEGAL DOCUMENT VIEWER (DPDP & GST Compliance)
          ───────────────────────────────────────────────────────────── */}
      {selectedLegalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#111e47] to-[#0a1330] border border-blue-500/30 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] flex flex-col">
            
            <div className="flex justify-between items-start pb-4 border-b border-blue-500/20 mb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {selectedLegalDoc.version}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {selectedLegalDoc.status}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">{selectedLegalDoc.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Effective: {selectedLegalDoc.effectiveDate} • Last Updated: {selectedLegalDoc.lastUpdatedDate} • Jurisdiction: {selectedLegalDoc.jurisdiction}
                </p>
              </div>
              <button
                onClick={() => setSelectedLegalDoc(null)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200">
                <strong>Document Summary:</strong> {selectedLegalDoc.summary}
              </div>
              
              <div className="bg-[#070e24] p-5 rounded-2xl border border-blue-500/20 whitespace-pre-wrap font-sans space-y-2">
                {selectedLegalDoc.content}
              </div>
            </div>

            <div className="pt-4 border-t border-blue-500/20 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-slate-400">
                Governing Law: <strong className="text-slate-200">{selectedLegalDoc.applicableLaw}</strong>
              </span>
              <button
                onClick={() => setSelectedLegalDoc(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close Document
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: SECURE SUPABASE AUTHENTICATION MODAL (MFA / 2FA & Password Recovery)
          ───────────────────────────────────────────────────────────── */}
      <SupabaseAuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CLIENT PROJECT & DELIVERABLE PORTAL (Partioned from Admin)
          ───────────────────────────────────────────────────────────── */}
      <ClientPortalModal
        isOpen={showClientPortalModal}
        onClose={() => setShowClientPortalModal(false)}
      />

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PROJECT ARCHITECTURAL SPECS
          ───────────────────────────────────────────────────────────── */}
      {selectedPortfolioModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#111e47] to-[#0a1330] border border-blue-500/30 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start pb-4 border-b border-blue-500/20 mb-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-cyan-300 uppercase bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-500/40">
                  {selectedPortfolioModal.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{selectedPortfolioModal.title}</h3>
                <p className="text-xs text-slate-400">Client: {selectedPortfolioModal.clientName}</p>
              </div>
              <button
                onClick={() => setSelectedPortfolioModal(null)}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-cyan-400 mb-2">Executive Summary & Deliverables</h4>
                <p className="text-slate-300 leading-relaxed">{selectedPortfolioModal.summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">Technical Implementation Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPortfolioModal.techStack.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-[#08122c] border border-blue-500/30 text-cyan-300 font-mono text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-cyan-400 mb-2">Key Engineering Milestones</h4>
                <div className="space-y-2">
                  {selectedPortfolioModal.deliverables.map((del: string, i: number) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-blue-500/20 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedPortfolioModal(null);
                    const contactElem = document.getElementById('contact');
                    if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <span>Build Similar Solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Frontend Virtual Assistant Chatbot */}
      <FrontendChatbot />

    </div>
  );
};
