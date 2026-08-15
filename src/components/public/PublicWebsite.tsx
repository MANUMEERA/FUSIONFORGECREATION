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
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AGENCY_CONFIG } from '../../mockData';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../BrandLogo';

export const PublicWebsite: React.FC = () => {
  const { 
    portfolio, 
    addEnquiry, 
    setCurrentView, 
    setActiveTab, 
    currentUser, 
    setCurrentUser,
    users 
  } = useApp();

  const { success, info } = useToast();
  
  // Navigation active state & mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPortfolioModal, setSelectedPortfolioModal] = useState<any | null>(null);

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
    serviceCategory: 'web_development' as const,
    projectDescription: '',
    budgetRange: '₹1,50,000 - ₹3,00,000'
  });
  const [submitted, setSubmitted] = useState(false);

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
    addEnquiry({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      serviceCategory: form.serviceCategory,
      budgetRange: form.budgetRange,
      estimatedTimeline: '3-6 Weeks',
      projectDescription: form.projectDescription,
      featuresRequired: selectedFeatures,
      source: 'website_form'
    });
    setSubmitted(true);
    success('Enquiry Submitted Successfully!', `Thank you ${form.name}. Our solutions architect will contact you within 24 business hours.`);
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
      answer: 'Yes. Fusion Forge Creation is registered under GSTIN 21AAACF9876B1Z5 with Service Accounting Code SAC 998314 (Information Technology Software Services). We provide full B2B tax invoices with CGST/SGST or IGST breakdowns for input tax credit (ITC).'
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
    <div id="home" className="bg-[#070b14] text-slate-100 min-h-screen selection:bg-blue-600 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER / NAVBAR (LOGO | Home | Services | Projects | FAQs | Contact | Login)
          ───────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <a href="#home" className="flex items-center group cursor-pointer">
            <BrandLogo size="md" variant="full" theme="dark" />
          </a>

          {/* DESKTOP NAV LINKS (Services | Portfolio | Testimonials | FAQ | Enquiry) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <a 
              href="#services"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              Services
            </a>
            <a 
              href="#projects"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              Portfolio
            </a>
            <a 
              href="#testimonials"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              Testimonials
            </a>
            <a 
              href="#faqs"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              FAQ
            </a>
            <a 
              href="#contact"
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-all cursor-pointer"
            >
              Enquiry
            </a>
          </div>

          {/* RIGHT ACTION: Admin Portal & Start Project Buttons */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-nav-admin-portal"
              onClick={() => setShowLoginModal(true)}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Portal</span>
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
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a1120] border-b border-slate-800 px-6 py-4 space-y-2">
            <a 
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Services
            </a>
            <a 
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Portfolio
            </a>
            <a 
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Testimonials
            </a>
            <a 
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              FAQ
            </a>
            <a 
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Enquiry
            </a>
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLoginModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin & Staff Portal</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO / MAIN BANNER ("Where Ideas Fuse With Technology")
          MATCHING 1ST IMAGE EXACTLY:
          - Left Column: Badge, Massive Title, Paragraph, Pill Badges, CTA buttons, Metric counters
          - Right Column: Elegant Rounded White Banner Card showcasing Official High-Res Banner
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden border-b border-slate-800/80">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-0" />
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: HERO CONTENT (7 Cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Badge: FUSION FORGE CREATIONS */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold shadow-inner">
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
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Custom Apps</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Supabase</span>
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 text-xs font-medium">
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
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span className="text-cyan-400 font-mono text-xs">&lt;/&gt;</span>
                  <span>Our Core Services</span>
                </a>
              </div>

              {/* Stats Counters (100% Custom Code | 99.9% Uptime SLA | 24/7 Support) */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
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
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 rounded-[28px] blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />
                
                {/* Clean Framed Card in Crisp White/Light border with Rounded Corners */}
                <div className="relative rounded-[24px] bg-white p-2.5 sm:p-3 shadow-2xl shadow-blue-950/50 border border-slate-200">
                  
                  {/* Top Badge: OFFICIAL BANNER */}
                  <div className="absolute top-5 right-5 z-20">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#08143d]/85 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-slate-700 shadow-md">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>OFFICIAL BANNER</span>
                    </span>
                  </div>

                  {/* Banner Image Container */}
                  <div className="w-full overflow-hidden rounded-[18px] bg-slate-50 aspect-[1440/600] flex items-center justify-center">
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
      <section id="services" className="py-24 border-b border-slate-800/80 bg-[#060a12] scroll-mt-20">
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
            <p className="text-sm text-slate-400 max-w-md mt-3 md:mt-0 leading-relaxed">
              End-to-end technical craftsmanship across modern web architectures, native mobile ecosystems, cloud backends, and GST billing automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1: Web Development */}
            <div className="p-8 rounded-3xl bg-[#0b1220] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                  <Code2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Web Application Development</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  High-speed single page applications, enterprise customer portals, and dynamic SaaS platforms built using React 19, TypeScript, and Next.js.
                </p>
                <div className="space-y-2 mb-6">
                  {['React 19 & Next.js Frameworks', 'Interactive Data Dashboards', 'Sub-second Page Speeds', 'Secure Client Portals'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                      <Check className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-blue-400 hover:text-blue-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform"
              >
                <span>Request Web Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 2: Mobile Engineering */}
            <div className="p-8 rounded-3xl bg-[#0b1220] border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all mb-6">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mobile App Engineering</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Native feel, cross-platform mobile apps for iOS and Android built on React Native with smooth offline caching and native hardware integrations.
                </p>
                <div className="space-y-2 mb-6">
                  {['iOS & Android Cross-Platform', 'Push Notifications & Background Sync', 'Native Biometrics & Camera Access', 'App Store & Play Store Deployment'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform"
              >
                <span>Request Mobile Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 3: Backend & Cloud */}
            <div className="p-8 rounded-3xl bg-[#0b1220] border border-slate-800 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all mb-6">
                  <Server className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Backend & Cloud Architecture</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Microservices, serverless workloads, REST/GraphQL APIs, and auto-scaling cloud deployments with 99.9% uptime architecture.
                </p>
                <div className="space-y-2 mb-6">
                  {['Node.js, Express & Go Services', 'Docker Container Orchestration', 'AWS / Google Cloud Setup', 'OAuth 2.0 & JWT Security Control'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-purple-400 hover:text-purple-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform"
              >
                <span>Request Backend Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 4: Database & Realtime */}
            <div className="p-8 rounded-3xl bg-[#0b1220] border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all mb-6">
                  <Database className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Database & Real-time Systems</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Relational PostgreSQL, Supabase BaaS, and Redis caching layers designed for zero data loss and sub-millisecond query performance.
                </p>
                <div className="space-y-2 mb-6">
                  {['PostgreSQL Schema & RLS Policies', 'Supabase Database Provisioning', 'Redis In-Memory Caching', 'WebSocket Live Multi-User Sync'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform"
              >
                <span>Request DB Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 5: UI/UX Design */}
            <div className="p-8 rounded-3xl bg-[#0b1220] border border-slate-800 hover:border-pink-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-all mb-6">
                  <Palette className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">UI/UX & Design Systems</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Bespoke design systems, responsive wireframing, high-fidelity Figma interactive prototypes, and conversion-focused user interfaces.
                </p>
                <div className="space-y-2 mb-6">
                  {['Figma High-Fidelity Prototypes', 'Design Tokens & UI Component Kits', 'Mobile Responsive Grid Math', 'User Flow & Usability Audits'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                      <Check className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-pink-400 hover:text-pink-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform"
              >
                <span>Request UI/UX Prototype</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 6: GST Billing & Invoicing Systems */}
            <div className="p-8 rounded-3xl bg-[#0b1220] border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all mb-6">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">GST Billing & Accounting Systems</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Automated quotation and tax invoice software engines with SAC Code 998314 compliance, dynamic tax calculation, and instant PDF generation.
                </p>
                <div className="space-y-2 mb-6">
                  {['SAC 998314 Compliant Invoicing', 'CGST, SGST & IGST Calculation', 'Automated PDF Document Output', 'Client CRM & Payment Ledger'].map((item, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-300 space-x-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a 
                href="#contact"
                className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300 pt-4 border-t border-slate-800/80 group-hover:translate-x-1 transition-transform"
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
      <section id="projects" className="py-24 border-b border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
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
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
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
              className="rounded-3xl border border-slate-800 bg-[#0a1120] overflow-hidden hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between shadow-2xl group"
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
                      <div key={i} className="flex items-center text-xs text-slate-400 space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="text-slate-300 font-medium">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tech stack pills */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono font-semibold text-cyan-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedPortfolioModal(proj)}
                    className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <span>View Architectural Specs</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
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
      <section id="tech-stack" className="py-24 border-b border-slate-800/80 bg-[#060a12] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Modern Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
              Technology Stack & Tooling
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              We leverage production-hardened frameworks and modern cloud services for maximum speed, security, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techCategories.map((cat, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-[#0b1220] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-black text-blue-400 uppercase tracking-wider mb-4 pb-3 border-b border-slate-800">
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
      <section className="py-24 border-b border-slate-800/80 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Client Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            Trusted by Visionary Leaders
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            See how Fusion Forge Creation delivers concrete ROI and dependable software architecture for forward-thinking businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div 
              key={idx}
              className="p-8 rounded-3xl bg-[#0a1120] border border-slate-800 flex flex-col justify-between shadow-xl relative"
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

              <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-3">
                <img 
                  src={testi.avatar} 
                  alt={testi.name}
                  className="w-11 h-11 rounded-full object-cover border border-blue-500/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white">{testi.name}</div>
                  <div className="text-[11px] text-slate-400">{testi.role}</div>
                  <div className="text-[10px] text-blue-400 font-semibold">{testi.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. FAQS SECTION (Frequently Asked Questions)
          ───────────────────────────────────────────────────────────── */}
      <section id="faqs" className="py-24 border-b border-slate-800/80 bg-[#060a12] scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need to know about our workflow, billing, code ownership, and warranties.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-[#0b1220] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 cursor-pointer focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-lg bg-slate-800 text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-800/60 text-xs sm:text-sm text-slate-300 leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick FAQ CTA */}
          <div className="mt-12 p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <div className="text-sm font-bold text-white">Have a customized project question?</div>
              <div className="text-xs text-slate-400">Speak directly with our technical team in Bhubaneswar.</div>
            </div>
            <a 
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
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
          <span className="text-xs font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Start Your Engagement
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
            Initiate Project Enquiry & Quote
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Submit your scope below or use our interactive cost estimator to receive an official formal Quotation within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Project Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-[#0a1120] border border-slate-800 shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-cyan-400 mb-4">
              <Mail className="w-4 h-4" />
              <span>Project Scope Submission</span>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-2xl font-black text-white">Enquiry Received Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you! Your requirements have been registered in our Project Portal. Manoj Satapathy & the engineering team will deliver a structured commercial proposal to <span className="font-mono text-cyan-400 font-bold">{form.email}</span> shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        serviceCategory: 'web_development',
                        projectDescription: '',
                        budgetRange: '₹1,50,000 - ₹3,00,000'
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
                    >
                      <option value="web_development">Web Application Development</option>
                      <option value="mobile_app">Mobile Application (iOS/Android)</option>
                      <option value="full_stack_enterprise">Full-Stack Enterprise Suite</option>
                      <option value="backend_api">Backend & Cloud Architecture</option>
                      <option value="database_solutions">Database & Realtime Systems</option>
                      <option value="ui_ux_design">UI/UX & Design Systems</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Estimated Budget Range
                    </label>
                    <select
                      value={form.budgetRange}
                      onChange={e => setForm({ ...form, budgetRange: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
                    >
                      <option value="₹50,000 - ₹1,50,000">₹50,000 - ₹1,50,000 (MVP / Prototype)</option>
                      <option value="₹1,50,000 - ₹3,00,000">₹1,50,000 - ₹3,00,000 (Standard Web/App)</option>
                      <option value="₹3,00,000 - ₹6,00,000">₹3,00,000 - ₹6,00,000 (Enterprise Cloud)</option>
                      <option value="₹6,00,000+">₹6,00,000+ (High-Scale Multi-Platform)</option>
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
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
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0d1629] to-[#0a1120] border border-blue-500/40 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">Ballpark Estimator</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold font-mono">
                  SAC 998314
                </span>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
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
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature checkboxes */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
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
                            ? 'bg-blue-500/15 border-blue-500/60 text-white' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? 'text-blue-400' : 'text-slate-600'}`} />
                          <span className="text-[11px] font-semibold truncate">{feat.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold ml-2">
                          +₹{feat.price/1000}k
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-slate-800 space-y-1">
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
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/20 cursor-pointer"
              >
                <span>{estimatorApplied ? '✓ Applied to Form' : 'Apply Estimate to Scope'}</span>
              </button>
            </div>

            {/* Direct Contact Info Box */}
            <div className="p-6 rounded-3xl bg-[#0b1220] border border-slate-800 text-xs space-y-3">
              <div className="font-bold text-white text-sm">Direct Agency Contacts</div>
              
              <div className="flex items-start space-x-3 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{AGENCY_CONFIG.name}</div>
                  <div className="text-slate-400">{AGENCY_CONFIG.address}, {AGENCY_CONFIG.city}, {AGENCY_CONFIG.state} - {AGENCY_CONFIG.postalCode}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="font-mono text-slate-300">{AGENCY_CONFIG.email}</span>
              </div>

              <div className="flex items-center space-x-3 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="font-mono text-slate-300">{AGENCY_CONFIG.phone}</span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>GSTIN: <strong className="text-slate-200">{AGENCY_CONFIG.gstin}</strong></span>
                <span>PAN: <strong className="text-slate-200">{AGENCY_CONFIG.pan}</strong></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800/80 bg-[#050811] pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
            
            {/* Col 1: Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <BrandLogo size="sm" variant="full" theme="dark" showTagline={false} />
              <p className="text-xs text-slate-400 leading-relaxed">
                Where Ideas Fuse With Technology. Premier software engineering agency building bespoke web, mobile, and cloud architectures.
              </p>
              <div className="text-[11px] text-cyan-400 font-bold tracking-wider">
                INNOVATE • BUILD • AUTOMATE • GROW
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Navigation</div>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Featured Projects</a></li>
                <li><a href="#tech-stack" className="hover:text-white transition-colors">Technology Stack</a></li>
                <li><a href="#faqs" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact & Enquiry</a></li>
              </ul>
            </div>

            {/* Col 3: Technical Capabilities */}
            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Services</div>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Mobile Applications</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Backend & Cloud APIs</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Database Engineering</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">UI/UX Design Systems</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">GST Accounting Engines</a></li>
              </ul>
            </div>

            {/* Col 4: Tax & Legal Compliance */}
            <div className="space-y-3">
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-3">Compliance & Office</div>
              <div className="space-y-1">
                <div>GSTIN: <span className="font-mono text-slate-200">{AGENCY_CONFIG.gstin}</span></div>
                <div>PAN: <span className="font-mono text-slate-200">{AGENCY_CONFIG.pan}</span></div>
                <div>SAC Code: <span className="font-mono text-slate-200">998314 (IT Software)</span></div>
                <div>City: <span className="text-slate-200">Bhubaneswar, Odisha, India</span></div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-blue-400" />
                  <span>Staff & Client Portal Login</span>
                </button>
              </div>
            </div>

          </div>

          {/* Copyright & Bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">Fusion Forge Creation</span>. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Engagement</span>
              <span>•</span>
              <span>GST Compliance</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: LOGIN MODAL (With 1-Click Role Switcher)
          ───────────────────────────────────────────────────────────── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0b1329] border border-blue-500/40 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-slate-200 relative">
            
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">Portal & Management Login</h3>
              <p className="text-xs text-slate-400 mt-1">
                Access Quotations, Invoices, Client CRM, and Project Desks.
              </p>
            </div>

            <div className="space-y-2.5 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Select Profile to Login:
              </div>

              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleLoginAs(u)}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.company || 'Fusion Forge Creation'}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                    u.role === 'project_manager' ? 'bg-amber-500/20 text-amber-400' :
                    u.role === 'accountant' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Default Admin:</span>
              <button
                onClick={() => handleLoginAs(users[0])}
                className="font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Login as Manoj Satapathy (Admin) →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PROJECT ARCHITECTURAL SPECS
          ───────────────────────────────────────────────────────────── */}
      {selectedPortfolioModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl text-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-800 mb-6">
              <div>
                <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  {selectedPortfolioModal.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{selectedPortfolioModal.title}</h3>
                <p className="text-xs text-slate-400">Client: {selectedPortfolioModal.clientName}</p>
              </div>
              <button
                onClick={() => setSelectedPortfolioModal(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-white mb-2">Executive Summary & Deliverables</h4>
                <p className="text-slate-300 leading-relaxed">{selectedPortfolioModal.summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2">Technical Implementation Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPortfolioModal.techStack.map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-2">Key Engineering Milestones</h4>
                <div className="space-y-2">
                  {selectedPortfolioModal.deliverables.map((del: string, i: number) => (
                    <div key={i} className="flex items-center space-x-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedPortfolioModal(null);
                    const contactElem = document.getElementById('contact');
                    if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow cursor-pointer"
                >
                  <span>Build Similar Solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
