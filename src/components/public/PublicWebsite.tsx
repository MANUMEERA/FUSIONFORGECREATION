import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Code,
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
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  Share2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AGENCY_CONFIG } from '../../mockData';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../BrandLogo';
import { FrontendChatbot } from './FrontendChatbot';
import { ClientPortalModal } from './ClientPortalModal';
import { SocialIcon } from '../common/SocialIcon';
import { formatSocialUrl } from '../../utils/socialPlatforms';
import { SocialChannelItem, LegalDocument } from '../../types';

export const PublicWebsite: React.FC = () => {
  const { 
    portfolio, 
    addEnquiry, 
    agencyConfig,
    legalDocuments,
    trackVisitorEvent
  } = useApp();

  const config = agencyConfig || AGENCY_CONFIG;

  // Extract active social channels dynamically (Prioritizing YouTube & Instagram)
  const activeSocialChannels: SocialChannelItem[] = React.useMemo(() => {
    if (config.social_channels && Array.isArray(config.social_channels) && config.social_channels.length > 0) {
      const active = config.social_channels.filter(c => c.active && c.url && c.url.trim().length > 0);
      if (active.length > 0) return active;
    }
    if (config.socialChannels && Array.isArray(config.socialChannels) && config.socialChannels.length > 0) {
      const active = config.socialChannels.filter(c => c.active && c.url && c.url.trim().length > 0);
      if (active.length > 0) return active;
    }
    const sl = (config.social_links || config.socialLinks || {}) as Record<string, string>;
    const fallbackList: SocialChannelItem[] = [];
    fallbackList.push({ id: 'youtube', platform: 'youtube', name: 'YouTube', url: sl.youtube || 'https://youtube.com/@fusionforgecreation', active: true, color: '#FF0000' });
    fallbackList.push({ id: 'instagram', platform: 'instagram', name: 'Instagram', url: sl.instagram || 'https://instagram.com/fusionforgecreation', active: true, color: '#E1306C' });
    if (sl.whatsapp) fallbackList.push({ id: 'whatsapp', platform: 'whatsapp', name: 'WhatsApp', url: sl.whatsapp, active: true, color: '#25D366' });
    if (sl.twitter) fallbackList.push({ id: 'twitter', platform: 'twitter', name: 'Twitter / X', url: sl.twitter, active: true, color: '#1DA1F2' });
    return fallbackList;
  }, [config]);

  // Track initial page view (privacy-conscious telemetry)
  React.useEffect(() => {
    trackVisitorEvent({
      eventType: 'page_view',
      pagePath: '/',
      sectionId: '#home'
    });
  }, []);

  const { success, error, info } = useToast();
  
  // Navigation active state & mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showClientPortalModal, setShowClientPortalModal] = useState(false);
  const [selectedPortfolioModal, setSelectedPortfolioModal] = useState<any | null>(null);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocument | null>(null);

  // Portfolio filter category
  const [portfolioCategory, setPortfolioCategory] = useState<string>('all');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    budgetRange: '₹50,000 - ₹1,00,000'
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [gstinError, setGstinError] = useState<string | null>(null);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // GSTIN format check if provided
    const cleanGstin = form.gstin.trim().toUpperCase();
    if (cleanGstin && cleanGstin.length !== 15) {
      setGstinError('Indian GSTIN must be exactly 15 alphanumeric characters.');
      return;
    }
    setGstinError(null);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const res = await addEnquiry({
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
        featuresRequired: [form.serviceCategory],
        source: 'website_form'
      });

      if (res.success) {
        setSubmitted(true);
        success(
          'Project Scope Submitted Successfully!',
          `Thank you ${form.name}. Our solutions architect will review your submission and contact you within 24 business hours. A confirmation email has been sent to ${form.email}.`
        );
      } else {
        const errorMsg = res.error || 'Email dispatch failed. Please try again or email us directly at admin@fusionforgecreation.com.';
        setSubmitError(errorMsg);
        error('Enquiry Submission Failed', errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred. Please try again.';
      setSubmitError(errorMsg);
      error('Submission Error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQs Data
  const faqs = [
    {
      question: 'What type of software does Fusion Forge Creation develop?',
      answer: 'We develop custom business websites, web applications, management systems, admin panels, and database-driven software according to individual business requirements.'
    },
    {
      question: 'Can you develop software for different types of businesses?',
      answer: 'Yes. We build custom solutions tailored to specific business workflows, including hospital management, medical and retail management, industrial business websites, and agency management.'
    },
    {
      question: 'Can you build an admin panel or management dashboard?',
      answer: 'Yes. Admin panels can be developed to manage enquiries, customers, products, projects, users, reports, appointments, and other business information in one central hub.'
    },
    {
      question: 'Can you modify or improve existing software?',
      answer: 'Yes. We can analyse an existing web application and work on feature modifications, improvements, UI enhancements, and corrections where the existing codebase and technology stack permit.'
    },
    {
      question: 'Can you develop database-driven applications?',
      answer: 'Yes. We develop robust applications that use structured relational databases (PostgreSQL, MySQL) to securely store, query, and manage business records.'
    },
    {
      question: 'Do you develop billing and inventory software?',
      answer: 'Yes. Custom billing, quotation, invoice, inventory, purchase, sales and stock-management functionality can be developed according to your business workflow.'
    },
    {
      question: 'Can you assist with website or application deployment?',
      answer: 'Yes. We assist with complete deployment and configuration on supported hosting and application platforms including Hostinger, Netlify, Vercel, and GitHub.'
    },
    {
      question: 'Do you provide post-launch maintenance and support?',
      answer: 'Yes. Post-development support, maintenance, bug fixes, and additional feature rollouts can be discussed according to project requirements.'
    },
    {
      question: 'How is the project cost decided?',
      answer: 'Project cost depends on the required features, workflow complexity, design, database requirements, third-party integrations, and development effort. We review requirements thoroughly before providing a detailed commercial quotation.'
    },
    {
      question: 'Do you develop mobile applications?',
      answer: 'Mobile application development (native iOS/Android apps) is not currently offered as a standard Fusion Forge Creation service. Our focus is on responsive websites, web applications, and management systems that work seamlessly across desktop, tablet, and mobile browsers.'
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      quote: 'Fusion Forge Creation built our centralized clinical record and appointment management system. The interface is intuitive, fast, and has significantly streamlined our daily patient flow.',
      name: 'Dr. Sameer Sen',
      role: 'Medical Director',
      company: 'Arogya Care Hospital',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      project: 'Hospital Management System'
    },
    {
      quote: 'The custom inventory and billing portal simplified our retail operations across multiple branch counters. Accurate GST invoicing and stock alerts save us hours every week.',
      name: 'Rajesh Sharma',
      role: 'Operations Head',
      company: 'MedPlus Pharma & Retail',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      project: 'Medical & Retail Store Management'
    },
    {
      quote: 'Our new industrial machinery showcase website and quotation enquiry flow generated qualified leads within days of launch. Clean, responsive, and easy to maintain.',
      name: 'Vikramaditya Bose',
      role: 'Managing Director',
      company: 'Apex Industrial Forge & Machinery',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      project: 'Industrial Equipment Business Website'
    }
  ];

  // Tech Stack Data
  const techCategories = [
    {
      category: 'Frontend',
      items: [
        { name: 'React', desc: 'Component-based interactive user interfaces' },
        { name: 'TypeScript', desc: 'Type-safe JavaScript for reliable logic' },
        { name: 'Tailwind CSS', desc: 'Clean, responsive utility styling' },
        { name: 'HTML5 & CSS3', desc: 'Semantic web standards & modern styling' },
        { name: 'Vite', desc: 'Fast modern frontend build environment' }
      ]
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js', desc: 'Server-side JavaScript runtime' },
        { name: 'REST APIs', desc: 'Clean, structured API endpoints' },
        { name: 'Express', desc: 'Lightweight web application backend routing' },
        { name: 'Application Logic', desc: 'Custom business rules & workflows' }
      ]
    },
    {
      category: 'Database',
      items: [
        { name: 'PostgreSQL', desc: 'Reliable, relational database system' },
        { name: 'MySQL / SQLite', desc: 'Structured relational data storage' },
        { name: 'SQL & Data Modeling', desc: 'Relational schemas, queries & indexing' },
        { name: 'Data Security', desc: 'Row-level access policies & validation' }
      ]
    },
    {
      category: 'Deployment & Tools',
      items: [
        { name: 'GitHub', desc: 'Version control and source repository management' },
        { name: 'Hostinger', desc: 'Domain, corporate mailbox & web hosting' },
        { name: 'Netlify / Vercel', desc: 'Frontend application hosting & continuous deployment' },
        { name: 'PDF Billing Engine', desc: 'Automated quotation & tax invoice documents' }
      ]
    }
  ];

  // Portfolio items
  const allPortfolio = [
    {
      id: 'port_1',
      title: 'Hospital Management System',
      clientName: 'Arogya Care Hospital',
      category: 'Management System',
      summary: 'Centralized patient records, OPD/IPD admission desk, doctor appointment schedule, and itemized medical billing engine.',
      deliverables: ['Patient EHR & Bed Management', 'Doctor OPD/IPD Scheduler', 'Pharmacy & Lab Billing Desk'],
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Express'],
      bannerGradient: 'from-blue-700 to-cyan-900'
    },
    {
      id: 'port_2',
      title: 'Medical & Retail Store Management',
      clientName: 'MedPlus Pharma & Retail',
      category: 'Management System',
      summary: 'Multi-counter retail point-of-sale system with live inventory tracking, batch expiry alerts, supplier orders, and GST billing.',
      deliverables: ['POS Billing Counter Desk', 'Inventory & Stock Expiry Alerts', 'Supplier Ledger & PO Management'],
      techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      bannerGradient: 'from-emerald-700 to-teal-950'
    },
    {
      id: 'port_3',
      title: 'Industrial Equipment Business Website',
      clientName: 'Apex Industrial Forge & Machinery',
      category: 'Business Website',
      summary: 'High-performance industrial product catalogue, interactive machinery spec sheet viewer, and quotation lead pipeline.',
      deliverables: ['Responsive Product Showcase', 'Quotation Request Flow', 'Domain & Corporate Mailbox Setup'],
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Hostinger'],
      bannerGradient: 'from-amber-700 to-orange-950'
    },
    {
      id: 'port_4',
      title: 'Agency Operations & Invoicing Suite',
      clientName: 'Fusion Forge Internal',
      category: 'Web Application',
      summary: 'End-to-end agency management system with lead capture, project milestones, SAC 998314 tax invoices, and automated PDF email delivery.',
      deliverables: ['Client & Enquiry Management Desk', 'Quotation & GST Invoice Engine', 'Automated PDF Email Dispatch'],
      techStack: ['React', 'TypeScript', 'Express', 'PDFKit', 'Resend API', 'PostgreSQL'],
      bannerGradient: 'from-purple-700 to-indigo-950'
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

          {/* DESKTOP NAV LINKS (Services | Solutions | Tech Stack | Why Us | FAQ | Enquiry) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <a 
              href="#services"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              What We Build
            </a>
            <a 
              href="#projects"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              Solutions
            </a>
            <a 
              href="#tech-stack"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              Tech Stack
            </a>
            <a 
              href="#why-us"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-blue-500/10 transition-all cursor-pointer"
            >
              Why Us
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

          {/* RIGHT ACTION: Discuss Project Button */}
          <div className="flex items-center space-x-3">
            <a
              id="btn-nav-start-project"
              href="#contact"
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0047cc] to-[#0077ff] hover:from-[#003bb3] hover:to-[#0066ee] text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] cursor-pointer"
            >
              <span>Discuss Project</span>
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
              What We Build
            </a>
            <a 
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              Solutions
            </a>
            <a 
              href="#tech-stack"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              Tech Stack
            </a>
            <a 
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-blue-500/15 hover:text-cyan-400"
            >
              Why Us
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
              
              {/* Badge: FUSION FORGE CREATION */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-cyan-400 text-xs font-bold shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="tracking-wider uppercase text-[11px] sm:text-xs">FUSION FORGE CREATION</span>
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
                Where Ideas Fuse With Technology. Premier software engineering agency building bespoke web, mobile, and cloud architectures.
              </p>
              
              {/* 3 Pill Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0e1938] border border-blue-500/30 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Bespoke Web Apps</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0e1938] border border-blue-500/30 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Mobile Applications</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0e1938] border border-blue-500/30 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Cloud Architectures</span>
                </div>
              </div>

              {/* Action Buttons: Discuss Your Project | What We Build */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <a 
                  id="btn-hero-request-quote"
                  href="#contact"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#003899] via-[#0055d4] to-[#0099ff] hover:opacity-95 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/30 hover:scale-[1.02] flex items-center justify-center space-x-2.5 cursor-pointer"
                >
                  <span>Discuss Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a 
                  id="btn-hero-core-services"
                  href="#services"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0e1938] hover:bg-[#152554] border border-blue-500/30 text-slate-200 font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span className="text-cyan-400 font-mono text-xs">&lt;/&gt;</span>
                  <span>What We Build</span>
                </a>
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
          3. SERVICES SECTION ("What We Build")
          ───────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 border-b border-blue-500/20 bg-[#050b1a]/95 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                What We Build
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Software & Web Development Services
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-md mt-3 md:mt-0 leading-relaxed">
              Custom software solutions engineered to solve real business operational challenges with speed, precision, and reliable architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1: Business Websites */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Business & Corporate Websites</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Fast, responsive, and SEO-optimized business websites designed to showcase your services, build brand credibility, and convert visitors into qualified client enquiries.
                </p>
                <div className="space-y-2 mb-6">
                  {['Responsive Mobile & Desktop Design', 'Lead Capture & Enquiry Forms', 'Product & Service Catalogues', 'Hostinger / Custom Domain Setup'].map((item, i) => (
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
                <span>Discuss Website Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 2: Custom Web Applications */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all mb-6">
                  <Code2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Custom Web Applications</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Interactive web applications built on React and TypeScript with tailored business logic, user authentication, interactive workflows, and dynamic data processing.
                </p>
                <div className="space-y-2 mb-6">
                  {['React & TypeScript Architecture', 'User Accounts & Role Permissions', 'Dynamic State & Workflow Engines', 'Responsive on Phones & Tablets'].map((item, i) => (
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
                <span>Discuss Web Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 3: Management Systems */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-purple-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-all mb-6">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Hospital, Medical & Retail Systems</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Specialized domain systems for hospitals, clinics, pharmacies, and retail shops to manage patient records, appointments, inventory, and point-of-sale operations.
                </p>
                <div className="space-y-2 mb-6">
                  {['Hospital & Patient Record Management', 'Doctor Appointments & Scheduling', 'Retail & Pharmacy Inventory', 'Multi-User Staff Access Control'].map((item, i) => (
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
                <span>Discuss Management System</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 4: Admin Panels & Dashboards */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-emerald-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-6">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Admin Panels & Dashboards</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Centralized administrative dashboards for business owners and operators to manage enquiries, track orders, monitor records, and export reports in real time.
                </p>
                <div className="space-y-2 mb-6">
                  {['Enquiry & Lead Tracking Desk', 'CRUD Operations & Record Control', 'Search, Filter & Sorting Features', 'Data Export to Excel / PDF'].map((item, i) => (
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
                <span>Discuss Admin Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 5: Billing, Quotation & Inventory */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all mb-6">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Billing, Quotation & Inventory</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Automated commercial workflows with professional quotation generation, GST tax invoicing (CGST/SGST/IGST), PDF dispatch, and real-time inventory tracking.
                </p>
                <div className="space-y-2 mb-6">
                  {['SAC 998314 GST Compliance', 'Automated PDF Generation Engine', 'Email Dispatch with Attachments', 'Stock & Inventory Level Alerts'].map((item, i) => (
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
                <span>Discuss Billing Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 6: Database Solutions & Software Modifications */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-blue-500/20 hover:border-pink-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-all mb-6">
                  <Database className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Database Solutions & Modifications</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  PostgreSQL and InsForge database architecture, data migration, software modifications, bug fixing, and UI enhancements for existing web systems.
                </p>
                <div className="space-y-2 mb-6">
                  {['PostgreSQL & InsForge Architecture', 'Existing Codebase Bug Fixing & Enhancements', 'Database Migration & Security Policies', 'Deployment on Netlify & Hostinger'].map((item, i) => (
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
                <span>Discuss DB / Modifications</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          WHY CHOOSE US / KEY STRENGTHS SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="why-us" className="py-24 border-b border-blue-500/20 bg-gradient-to-b from-[#060c1d] to-[#0a1330] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30">
              Our Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
              Why Choose Fusion Forge Creation
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              We focus on practical, reliable software engineering with direct communication and transparent execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#091433]/80 border border-blue-500/20 hover:border-cyan-400/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Direct Developer Communication</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Work directly with the engineer building your system. No account managers or communication barriers, ensuring requirements are understood and executed accurately.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#091433]/80 border border-blue-500/20 hover:border-cyan-400/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Realistic Delivery Timelines</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We establish achievable milestone schedules with clear progress updates, ensuring software is thoroughly tested and delivered on schedule.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#091433]/80 border border-blue-500/20 hover:border-cyan-400/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Custom Workflow Development</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every application is designed around your specific business logic and operational workflow, avoiding restrictive off-the-shelf templates.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#091433]/80 border border-blue-500/20 hover:border-cyan-400/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Practical Technology Choices</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We utilize proven, industry-standard technologies (React, Node.js, PostgreSQL, InsForge) that provide long-term stability and easy maintainability.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#091433]/80 border border-blue-500/20 hover:border-cyan-400/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Clean Structured Code</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Type-safe, modular codebases with clear component architecture make future enhancements, maintenance, and integrations straightforward.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#091433]/80 border border-blue-500/20 hover:border-cyan-400/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Post-Launch Support</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We provide ongoing assistance, bug resolution, server configuration support, and feature updates so your software continues to run smoothly.
              </p>
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
            {['all', 'Management System', 'Business Website', 'Web Application'].map(cat => (
              <button
                key={cat}
                onClick={() => setPortfolioCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  portfolioCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#0e1938] text-slate-300 hover:text-white border border-blue-500/20'
                }`}
              >
                {cat === 'all' ? 'All Solutions' : cat}
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
          8. CONTACT & PROJECT SCOPE
          ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30">
            Start Your Engagement
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            Project Scope Submission & Direct Agency Contacts
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Submit your project scope, technical requirements, and organizational GST details below or connect directly with our engineering team to receive an official formal Quotation within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Project Scope Submission Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#111e47]/95 to-[#0a1330]/95 border border-blue-500/25 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Mail className="w-4 h-4" />
                <span>Project Scope Submission</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-cyan-300 text-[10px] font-bold font-mono">
                SAC 998314 • GST Compliant
              </span>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ 
                    duration: 0.45, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="p-8 sm:p-10 rounded-2xl bg-gradient-to-b from-emerald-950/50 to-slate-950/80 border border-emerald-500/40 text-center space-y-4 shadow-2xl shadow-emerald-950/40 relative overflow-hidden"
                >
                  {/* Subtle background ambient glow */}
                  <div className="absolute -top-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                  <motion.div
                    initial={{ scale: 0, rotate: -25 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 350, 
                      damping: 22, 
                      delay: 0.1 
                    }}
                    className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.18 }}
                    className="space-y-2"
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-wide uppercase">
                      Query Dispatched Successfully
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Project Scope Submitted!
                    </h3>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 }}
                    className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed"
                  >
                    Thank you! Your requirements and organizational details have been registered in our Project Portal. Our executive engineering team will deliver a structured commercial proposal to <span className="font-mono text-cyan-400 font-bold">{form.email}</span> shortly.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.32 }}
                    className="pt-2"
                  >
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setIsSubmitting(false);
                        setSubmitError(null);
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
                          budgetRange: '₹50,000 - ₹1,00,000'
                        });
                      }}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-blue-500/30 hover:border-cyan-400 text-xs font-bold text-white transition-all shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.02] cursor-pointer"
                    >
                      Submit Another Project
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleEnquirySubmit}
                  className="space-y-4"
                >
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
                        <option value="Below ₹50,000" className="bg-[#0a1330] text-white">Below ₹50,000 (Starter / MVP)</option>
                        <option value="₹50,000 - ₹1,00,000" className="bg-[#0a1330] text-white">₹50,000 - ₹1,00,000 (Standard)</option>
                        <option value="₹1,00,000 - ₹1,50,000" className="bg-[#0a1330] text-white">₹1,00,000 - ₹1,50,000 (Professional)</option>
                        <option value="₹1,50,000 - ₹2,00,000" className="bg-[#0a1330] text-white">₹1,50,000 - ₹2,00,000 (Advanced Suite)</option>
                        <option value="₹2,00,000 - ₹2,50,000" className="bg-[#0a1330] text-white">₹2,00,000 - ₹2,50,000 (Enterprise Cloud)</option>
                        <option value="₹2,50,000 - ₹5,00,000" className="bg-[#0a1330] text-white">₹2,50,000 - ₹5,00,000 (Enterprise Limit)</option>
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

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold text-rose-200">Enquiry Notification Not Delivered</div>
                        <div className="text-[11px] leading-relaxed">{submitError}</div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-xl shadow-blue-600/30 hover:scale-[1.01] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Scope & Notifications...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Project Scope for Quotation</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Direct Agency Contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Direct Contact Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111e47]/95 to-[#0a1330]/95 border border-blue-500/25 shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-blue-500/20">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Direct Agency Contacts</h3>
                    <p className="text-[10px] text-slate-400">Engineering & Solutions Office</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Active Today</span>
                </div>
              </div>

              {/* Agency Office Location */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-start space-x-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-white text-xs">{config.company_name || config.name}</div>
                    <div className="text-[11px] text-slate-300 leading-relaxed mt-0.5">{config.address}</div>
                    <div className="text-[10px] text-cyan-400/80 font-mono mt-1">Place of Supply: 26 - Dadra & Nagar Haveli and Daman & Diu</div>
                  </div>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="grid grid-cols-1 gap-3">
                {config.email ? (
                  <a
                    href={`mailto:${config.email}`}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/50 flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Official Email</div>
                        <div className="text-xs font-mono font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">{config.email}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Direct Communication</div>
                      <div className="text-xs text-slate-300">Submit Scope Form for Instant Review</div>
                    </div>
                  </div>
                )}

                {config.phone ? (
                  <a
                    href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/50 flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Phone & WhatsApp</div>
                        <div className="text-xs font-mono font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{config.phone}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ) : null}
              </div>

              {/* Working Hours */}
              <div className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-semibold text-white">Business Hours:</span> Mon – Sat: 09:30 AM – 07:00 PM IST
                </div>
              </div>

              {/* Statutory & GST Compliance */}
              <div className="pt-4 border-t border-blue-500/20 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Statutory & GST Compliance Details
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold">GSTIN</div>
                    <div className="font-mono font-bold text-slate-200 text-xs">{config.gstin || 'Under Registration'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold">PAN</div>
                    <div className="font-mono font-bold text-slate-200 text-xs">{config.pan || 'Available on Invoice'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold">Service Code</div>
                    <div className="font-mono font-bold text-cyan-400 text-xs">SAC 998314</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold">Turnaround</div>
                    <div className="font-bold text-emerald-400 text-xs">24 Hours SLA</div>
                  </div>
                </div>
              </div>

              {/* Social Channels in Contact Box */}
              <div className="pt-4 border-t border-blue-500/20 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Social Channels</span>
                <div className="flex flex-wrap items-center gap-2">
                  {activeSocialChannels.map(channel => (
                    <a
                      key={channel.id}
                      href={formatSocialUrl(channel.url, channel.platform)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${
                        channel.platform === 'youtube' 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500' 
                          : channel.platform === 'instagram'
                          ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500'
                          : 'bg-slate-900 border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300'
                      }`}
                      title={channel.name}
                      aria-label={channel.name}
                    >
                      <SocialIcon platform={channel.platform} className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{channel.name}</span>
                    </a>
                  ))}
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
            
            {/* Col 1: Brand Info */}
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
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm hover:scale-105 cursor-pointer ${
                        channel.platform === 'youtube'
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400'
                          : channel.platform === 'instagram'
                          ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20 hover:border-pink-400'
                          : 'bg-slate-900/90 border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-300'
                      }`}
                      title={channel.name}
                      aria-label={channel.name}
                    >
                      <SocialIcon platform={channel.platform} className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium">{channel.name}</span>
                    </a>
                  ))}
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
                  <span className="font-mono text-slate-200 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">{config.gstin || 'Under Registration'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">PAN:</span>
                  <span className="font-mono text-slate-200 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">{config.pan || 'Available on Request'}</span>
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
                  const doc = legalDocuments.find(d => d.slug === 'terms-and-conditions' || d.slug === 'terms-of-engagement') || legalDocuments[1];
                  if (doc) setSelectedLegalDoc(doc);
                }}
                className="hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              {(agencyConfig?.gst_compliance_active || (agencyConfig?.gstin && agencyConfig.gstin.trim().toUpperCase() !== 'URP' && agencyConfig.gstin.trim().length === 15)) && (
                <>
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
                </>
              )}
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
              
              <div className="bg-[#070e24] p-6 rounded-2xl border border-blue-500/20 font-sans space-y-3 text-slate-200 text-xs sm:text-sm">
                <div className="prose prose-invert max-w-none space-y-3">
                  <Markdown>{selectedLegalDoc.content}</Markdown>
                </div>
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
          MODAL: CLIENT PROJECT & DELIVERABLE PORTAL
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
