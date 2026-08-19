import { 
  UserProfile, 
  Client, 
  Quotation, 
  Invoice, 
  Payment, 
  CreditDebitNote,
  ProjectEnquiry, 
  PortfolioProject,
  ManagedProject,
  CompletedWorkRecord,
  ChatbotQAItem,
  ChatbotSettings,
  SocialChannelItem,
  ServicePricePreset,
  PaymentTermItem,
  Purchase,
  Expense,
  StaffMember,
  SalaryRecord,
  AppNotification,
  EmailLog,
  LegalDocument,
  LegalDocumentHistoryItem,
  VisitorEvent
} from './types';
import { DEFAULT_INVOICE_NUMBERING, DEFAULT_QUOTATION_NUMBERING } from './utils/documentNumbering';

export const INITIAL_PRICE_PRESETS: ServicePricePreset[] = [
  {
    id: 'preset_web_design',
    service_name: 'Website Design & UI/UX Architecture',
    name: 'Website Design',
    description: 'Custom responsive web design, interactive prototypes, design system & Figma deliverables',
    sac_code: '998314',
    sacCode: '998314',
    default_price: 50000,
    rate: 50000,
    gst_applicable: true,
    gst_rate: 18,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-16T00:00:00Z'
  },
  {
    id: 'preset_full_stack_app',
    service_name: 'Full-Stack Web App Development',
    name: 'Full-Stack Web App',
    description: 'Production React, TypeScript & Node.js application engineering with responsive UI and API routes',
    sac_code: '998314',
    sacCode: '998314',
    default_price: 150000,
    rate: 150000,
    gst_applicable: true,
    gst_rate: 18,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-16T00:00:00Z'
  },
  {
    id: 'preset_backend_supabase',
    service_name: 'Backend API & Supabase Cluster Setup',
    name: 'Backend & DB Cluster',
    description: 'PostgreSQL database architecture, row-level security (RLS), Edge Functions, and REST API integration',
    sac_code: '998314',
    sacCode: '998314',
    default_price: 45000,
    rate: 45000,
    gst_applicable: true,
    gst_rate: 18,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-16T00:00:00Z'
  },
  {
    id: 'preset_cloud_hosting',
    service_name: 'Cloud Hosting & DevOps Setup',
    name: 'Cloud Hosting & CI/CD',
    description: 'SSL setup, Docker containerization, CDN routing, and automated CI/CD deployment pipelines',
    sac_code: '998314',
    sacCode: '998314',
    default_price: 15000,
    rate: 15000,
    gst_applicable: true,
    gst_rate: 18,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-16T00:00:00Z'
  },
  {
    id: 'preset_annual_maintenance',
    service_name: 'Annual Maintenance & Support (AMC)',
    name: 'Annual Maintenance (AMC)',
    description: 'Continuous uptime monitoring, security patching, monthly database backups, and SLA incident response',
    sac_code: '998314',
    sacCode: '998314',
    default_price: 36000,
    rate: 36000,
    gst_applicable: true,
    gst_rate: 18,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-16T00:00:00Z'
  },
  {
    id: 'preset_ai_automation',
    service_name: 'AI Agent & LLM Automation Pipeline',
    name: 'AI Agent & LLM Pipeline',
    description: 'Custom Gemini / AI Studio integration, automated document processing, prompt engineering, and semantic search',
    sac_code: '998314',
    sacCode: '998314',
    default_price: 75000,
    rate: 75000,
    gst_applicable: true,
    gst_rate: 18,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-16T00:00:00Z'
  }
];

export const INITIAL_PAYMENT_TERMS: PaymentTermItem[] = [
  {
    id: 'pt_milestone',
    name: '50% Advance, 30% Beta Milestone, 20% Production Release',
    description: 'Standard agency milestone schedule for custom software development projects.',
    is_default: true,
    sort_order: 1
  },
  {
    id: 'pt_net15',
    name: 'Net 15 Days from Invoice Issue Date',
    description: 'Payment due within 15 days of invoice date for retainer or maintenance agreements.',
    is_default: false,
    sort_order: 2
  },
  {
    id: 'pt_net30',
    name: 'Net 30 Days from Invoice Date',
    description: 'Standard corporate 30-day payment term.',
    is_default: false,
    sort_order: 3
  },
  {
    id: 'pt_100_advance',
    name: '100% Upfront Advance Payment',
    description: 'Full advance payment prior to service provisioning or domain/hosting purchases.',
    is_default: false,
    sort_order: 4
  }
];

export const DEFAULT_QUOTATION_TERMS: string[] = [
  'Quotation is valid for 30 calendar days from the issue date.',
  'Commercial development kicks off upon confirmation and receipt of 50% milestone advance.',
  'All statutory taxes (GST @ 18%, SAC 998314) are billed extra as itemized.',
  'Scope variations or add-ons beyond itemized deliverables are quoted separately.',
  'All intellectual property rights transfer to the client upon full project settlement.'
];

export const DEFAULT_INVOICE_TERMS: string[] = [
  'Payment is due within 15 calendar days from the invoice issue date.',
  'Goods & Services Tax (GST) charged under SAC Code 998314 (Information Technology Software Services).',
  'Please quote invoice number on all NEFT / RTGS / IMPS wire transfers.',
  'All disputes subject to exclusive arbitration in Silvassa, Dadra & Nagar Haveli jurisdiction.'
];

export const INITIAL_SOCIAL_CHANNELS: SocialChannelItem[] = [
  { id: 'linkedin', platform: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/fusionforgecreation', active: true, color: '#0A66C2' },
  { id: 'github', platform: 'github', name: 'GitHub', url: 'https://github.com/fusionforgecreation', active: true, color: '#6e5494' },
  { id: 'whatsapp', platform: 'whatsapp', name: 'WhatsApp', url: 'https://wa.me/919004077126', active: true, color: '#25D366' },
  { id: 'twitter', platform: 'twitter', name: 'Twitter / X', url: 'https://twitter.com/fusionforge_dev', active: true, color: '#1DA1F2' },
  { id: 'instagram', platform: 'instagram', name: 'Instagram', url: 'https://instagram.com/fusionforgecreation', active: true, color: '#E1306C' },
  { id: 'youtube', platform: 'youtube', name: 'YouTube', url: 'https://youtube.com/@fusionforgecreation', active: true, color: '#FF0000' }
];

export const AGENCY_CONFIG = {
  name: 'Fusion Forge Creation',
  legalName: 'Fusion Forge Creation',
  company_name: 'Fusion Forge Creation',
  tagline: 'Where Ideas Fuse With Technology',
  motto: 'INNOVATE • BUILD • AUTOMATE • GROW',
  email: 'contact@fusionforge.io',
  phone: '+91 90040 77126',
  address: 'H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230',
  city: 'Silvassa',
  state: 'Dadra & Nagar Haveli',
  state_code: '26',
  postalCode: '396230',
  gstin: '26AALFF1234F1Z5',
  pan: 'AALFF1234F',
  msme_number: 'UDYAM-DN-00-0012345',
  msmeNumber: 'UDYAM-DN-00-0012345',
  jurisdiction: 'Silvassa, Dadra & Nagar Haveli',
  sacCode: '998314',
  logo_url: '/logo.svg',
  signature_url: '/signatures/authorized_signatory.png',
  stamp_url: '',
  stampUrl: '',
  default_quotation_validity_days: 30,
  quotation_terms: DEFAULT_QUOTATION_TERMS,
  invoice_terms: DEFAULT_INVOICE_TERMS,
  delay_interest_clause: 'Interest @ 18% per annum will be charged on all delayed payments exceeding the due date.',
  payment_delay_interest_rate: 18,
  reverse_charge_default: 'No',
  
  // Phase 11: LUT & SEZ Compliance Defaults
  lut_arn: 'AD260426001234F',
  lutArn: 'AD260426001234F',
  lutNumber: 'AD260426001234F',
  lut_number: 'AD260426001234F',
  lutFinancialYear: '2026-27',
  lut_financial_year: '2026-27',
  lutDate: '2026-04-01',
  lut_date: '2026-04-01',
  lutExpiryDate: '2027-03-31',
  lut_expiry_date: '2027-03-31',
  default_invoice_type: 'Regular',
  defaultInvoiceType: 'Regular',

  payment_terms: INITIAL_PAYMENT_TERMS,
  numbering_configs: {
    invoice: DEFAULT_INVOICE_NUMBERING,
    quotation: DEFAULT_QUOTATION_NUMBERING
  },
  social_channels: INITIAL_SOCIAL_CHANNELS,
  socialChannels: INITIAL_SOCIAL_CHANNELS,
  social_links: {
    github: 'https://github.com/fusionforgecreation',
    linkedin: 'https://linkedin.com/company/fusionforgecreation',
    twitter: 'https://twitter.com/fusionforge_dev',
    instagram: 'https://instagram.com/fusionforgecreation',
    youtube: 'https://youtube.com/@fusionforgecreation',
    whatsapp: 'https://wa.me/919004077126'
  },
  socialLinks: {
    github: 'https://github.com/fusionforgecreation',
    linkedin: 'https://linkedin.com/company/fusionforgecreation',
    twitter: 'https://twitter.com/fusionforge_dev',
    instagram: 'https://instagram.com/fusionforgecreation',
    youtube: 'https://youtube.com/@fusionforgecreation',
    whatsapp: 'https://wa.me/919004077126'
  },
  bankDetails: {
    accountName: 'Fusion Forge Creation',
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    branch: 'Silvassa Branch',
    upiId: 'fusionforge@hdfcbank'
  },
  bank_name: 'HDFC Bank Ltd',
  account_name: 'Fusion Forge Creation',
  account_number: '50200012345678',
  ifsc_code: 'HDFC0001234',
  branch_name: 'Silvassa Branch',
  upi_id: 'fusionforge@hdfcbank',
  upiId: 'fusionforge@hdfcbank',
  terms_conditions: 'Payment due within 15 days of issue date.',
  terms: [
    '50% advance upon project initiation.',
    '30% on milestone beta delivery.',
    '20% on final production deployment.',
    'GST 18% applied under SAC Code 998314.'
  ]
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_super_admin',
    full_name: 'Manoj Satapathy',
    name: 'Manoj Satapathy',
    email: 'admin@fusionforgecreation.com',
    role: 'super_admin',
    phone: '+91 90040 77126',
    is_active: true,
    mfa_enabled: true,
    two_factor_confirmed: true,
    two_factor_auth_type: 'google_authenticator',
    two_factor_secret: 'JBSWY3DPEHPK3PXP',
    recovery_codes: ['FFC1-9824', 'FFC2-7716', 'FFC3-3490', 'FFC4-8812', 'FFC5-4421', 'FFC6-9031', 'FFC7-6120', 'FFC8-5539'],
    company: 'Fusion Forge Creation',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-14T10:00:00Z'
  }
];

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_QUOTATIONS: Quotation[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_PAYMENTS: Payment[] = [];

export const INITIAL_CREDIT_DEBIT_NOTES: CreditDebitNote[] = [];

export const INITIAL_ENQUIRIES: ProjectEnquiry[] = [];

export const INITIAL_PORTFOLIO: PortfolioProject[] = [];

export const INITIAL_SERVICES = [
  {
    id: 'srv_1',
    title: 'Web Application Development',
    category: 'Engineering',
    description: 'High-speed single page applications, enterprise customer portals, and SaaS platforms using React 19, Next.js, and TypeScript.',
    startingPrice: 75000,
    sacCode: '998314',
    deliverables: ['React 19 & Next.js Frameworks', 'Interactive Data Dashboards', 'Sub-second Page Speeds', 'Secure Client Portals'],
    active: true,
    featured: true
  },
  {
    id: 'srv_2',
    title: 'Mobile App Engineering',
    category: 'Engineering',
    description: 'Native feel, cross-platform mobile apps for iOS and Android built on React Native with smooth offline caching and native hardware integrations.',
    startingPrice: 95000,
    sacCode: '998314',
    deliverables: ['iOS & Android Cross-Platform', 'Push Notifications & Background Sync', 'Native Biometrics & Camera Access', 'App Store & Play Store Deployment'],
    active: true,
    featured: true
  },
  {
    id: 'srv_3',
    title: 'Backend & Cloud Architecture',
    category: 'Cloud & DevOps',
    description: 'Microservices, serverless workloads, REST/GraphQL APIs, and auto-scaling cloud deployments with 99.9% uptime architecture.',
    startingPrice: 60000,
    sacCode: '998314',
    deliverables: ['Node.js, Express & Go Services', 'Docker Container Orchestration', 'AWS / Google Cloud Setup', 'OAuth 2.0 & JWT Security Control'],
    active: true,
    featured: true
  },
  {
    id: 'srv_4',
    title: 'Database & Real-time Systems',
    category: 'Database',
    description: 'Relational PostgreSQL, Supabase BaaS, and Redis caching layers designed for zero data loss and sub-millisecond query performance.',
    startingPrice: 50000,
    sacCode: '998314',
    deliverables: ['PostgreSQL Schema & RLS Policies', 'Supabase Database Provisioning', 'Redis In-Memory Caching', 'WebSocket Live Multi-User Sync'],
    active: true,
    featured: false
  },
  {
    id: 'srv_5',
    title: 'UI/UX & Design Systems',
    category: 'Design',
    description: 'Bespoke design systems, responsive wireframing, high-fidelity Figma interactive prototypes, and conversion-focused user interfaces.',
    startingPrice: 40000,
    sacCode: '998314',
    deliverables: ['Figma High-Fidelity Prototypes', 'Design Tokens & UI Component Kits', 'Mobile Responsive Grid Math', 'User Flow & Usability Audits'],
    active: true,
    featured: false
  },
  {
    id: 'srv_6',
    title: 'GST Billing & Accounting Systems',
    category: 'Automation',
    description: 'Automated quotation and tax invoice software engines with SAC Code 998314 compliance, dynamic tax calculation, and instant PDF generation.',
    startingPrice: 45000,
    sacCode: '998314',
    deliverables: ['SAC 998314 Compliant Invoicing', 'CGST, SGST & IGST Calculation', 'Automated PDF Document Output', 'Client CRM & Payment Ledger'],
    active: true,
    featured: true
  }
];

export const INITIAL_MANAGED_PROJECTS: ManagedProject[] = [];

export const INITIAL_COMPLETED_WORKS: CompletedWorkRecord[] = [];

export const INITIAL_TECHNOLOGIES = [
  {
    id: 'tech_1',
    name: 'React 19 & Next.js',
    category: 'Frontend & UI' as const,
    description: 'Modern reactive component architecture & server side rendering',
    proficiency: 98,
    isFeatured: true
  },
  {
    id: 'tech_2',
    name: 'TypeScript',
    category: 'Frontend & UI' as const,
    description: 'Strict end-to-end type safety and compile-time verification',
    proficiency: 95,
    isFeatured: true
  },
  {
    id: 'tech_3',
    name: 'Tailwind CSS & Motion',
    category: 'Frontend & UI' as const,
    description: 'Modern utility-first styling and fluid micro-interactions',
    proficiency: 98,
    isFeatured: true
  },
  {
    id: 'tech_4',
    name: 'Node.js & Express',
    category: 'Backend & APIs' as const,
    description: 'High-throughput microservices and REST API routing',
    proficiency: 94,
    isFeatured: true
  },
  {
    id: 'tech_5',
    name: 'Go (Golang)',
    category: 'Backend & APIs' as const,
    description: 'Ultra-fast concurrent data processors & lightweight workers',
    proficiency: 88,
    isFeatured: true
  },
  {
    id: 'tech_6',
    name: 'WebSockets & Realtime',
    category: 'Backend & APIs' as const,
    description: 'Sub-second real-time streaming and bidirectional channels',
    proficiency: 92,
    isFeatured: true
  },
  {
    id: 'tech_7',
    name: 'PostgreSQL',
    category: 'Databases & Storage' as const,
    description: 'ACID compliant enterprise relational data with indexing',
    proficiency: 96,
    isFeatured: true
  },
  {
    id: 'tech_8',
    name: 'Supabase & BaaS',
    category: 'Databases & Storage' as const,
    description: 'Managed Postgres with instant Row Level Security & Auth',
    proficiency: 95,
    isFeatured: true
  },
  {
    id: 'tech_9',
    name: 'Redis Cache',
    category: 'Databases & Storage' as const,
    description: 'In-memory fast caching, session storage & rate limiting',
    proficiency: 90,
    isFeatured: false
  },
  {
    id: 'tech_10',
    name: 'Docker & Containers',
    category: 'Cloud, DevOps & Tools' as const,
    description: 'Reproducible production containers and orchestration',
    proficiency: 92,
    isFeatured: true
  },
  {
    id: 'tech_11',
    name: 'Google Cloud & AWS',
    category: 'Cloud, DevOps & Tools' as const,
    description: 'Scalable serverless & VM container infrastructure',
    proficiency: 90,
    isFeatured: true
  },
  {
    id: 'tech_12',
    name: 'GST Billing Engine (SAC 998314)',
    category: 'Cloud, DevOps & Tools' as const,
    description: 'Automated tax calculations, PDF generator, and compliance ledger',
    proficiency: 100,
    isFeatured: true
  }
];

export const INITIAL_TESTIMONIALS: {
  id: string;
  clientName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarUrl: string;
  projectName: string;
  isApproved: boolean;
}[] = [];

export const INITIAL_FAQS = [
  {
    id: 'faq_1',
    question: 'How does the engagement and development lifecycle work?',
    answer: 'Our workflow follows a structured 4-step agile process: 1) Architectural Discovery & Scope Definition, 2) Milestone-Based Commercial Quotation with GST breakdown, 3) Iterative Sprint Sprints with weekly live test links, and 4) Final Production Deployment, Security Audit, and 100% IP Code Handover.',
    category: 'General' as const,
    order: 1,
    isPublished: true
  },
  {
    id: 'faq_2',
    question: 'What is your pricing model and how are payments structured?',
    answer: 'We provide transparent fixed-price quotations based on agreed deliverables. Typically, engagements follow a 50% initiation advance, 30% on beta milestone delivery, and 20% on final deployment. All quotations and invoices are GST-compliant (SAC Code 998314) with instant PDF downloads.',
    category: 'Pricing & GST' as const,
    order: 2,
    isPublished: true
  },
  {
    id: 'faq_3',
    question: 'Do we own 100% of the code and intellectual property (IP)?',
    answer: 'Yes, absolutely. Upon settlement of the final invoice, 100% of the source code, design assets, database schemas, and intellectual property rights are unconditionally transferred to your organization.',
    category: 'General' as const,
    order: 3,
    isPublished: true
  },
  {
    id: 'faq_4',
    question: 'What post-launch support and warranty do you offer?',
    answer: 'Every project comes with an inclusive 60-day post-launch warranty covering bug fixes, performance monitoring, and server configuration. We also offer dedicated monthly SLA maintenance packages.',
    category: 'Support' as const,
    order: 4,
    isPublished: true
  },
  {
    id: 'faq_5',
    question: 'Can you integrate with our existing backend or database?',
    answer: 'Yes. We specialize in greenfield application development as well as modernizing legacy systems, building custom REST/GraphQL APIs, and integrating with Supabase, PostgreSQL, Firebase, MongoDB, or third-party enterprise services.',
    category: 'Technical' as const,
    order: 5,
    isPublished: true
  },
  {
    id: 'faq_6',
    question: 'Are your quotations and tax invoices GST compliant in India?',
    answer: 'Yes. Fusion Forge Creation is registered under GSTIN 21AAACF9876B1Z5 with Service Accounting Code SAC 998314 (Information Technology Software Services). We provide full B2B tax invoices with CGST/SGST or IGST breakdowns for input tax credit (ITC).',
    category: 'Pricing & GST' as const,
    order: 6,
    isPublished: true
  }
];

export const INITIAL_CHATBOT_SETTINGS: ChatbotSettings = {
  botName: 'ForgeBot AI',
  botSubtitle: 'Fusion Forge Interactive Assistant',
  avatarUrl: '',
  welcomeMessage: 'Hello! 👋 Welcome to Fusion Forge Creation. I am your instant virtual advisor. Ask me about our software engineering services, tech stack, custom quotes, GST compliance, or timelines!',
  fallbackMessage: "I couldn't find an exact match in our knowledge base, but our engineering directors can provide specific guidance. Would you like to submit a quick project enquiry or speak directly with our technical team?",
  quickPrompts: [
    'What services do you offer?',
    'How much does a web app cost?',
    'What is your tech stack?',
    'Are your invoices GST compliant (SAC 998314)?',
    'How to get a formal Quotation?'
  ],
  enableBot: true,
  contactEmail: 'contact@fusionforge.io',
  contactPhone: '+91 90040 77126'
};

export const INITIAL_CHATBOT_QA: ChatbotQAItem[] = [
  {
    id: 'cqa_1',
    question: 'What core services does Fusion Forge Creation provide?',
    answer: 'We engineer high-performance software solutions across 6 key pillars:\n\n1. Web Applications (React 19, Next.js, TypeScript)\n2. Mobile Applications (React Native iOS/Android)\n3. Full-Stack Enterprise Systems & Cloud Backends (Node.js, Go, REST/GraphQL)\n4. Database & Real-time Architectures (PostgreSQL, Supabase, Redis)\n5. GST-Compliant Billing & Accounting Engines (SAC 998314)\n6. UI/UX Design Systems & High-Fidelity Prototypes.',
    category: 'Services',
    keywords: ['service', 'services', 'offer', 'build', 'develop', 'what do you do', 'capabilities', 'features', 'solutions'],
    suggestedFollowUps: ['How much does a web app cost?', 'What tech stack do you use?', 'View Project Portfolio'],
    actionLink: '#services',
    actionLabel: 'Explore Services Catalog',
    isActive: true,
    orderIndex: 1,
    matchCount: 142
  },
  {
    id: 'cqa_2',
    question: 'How much does developing a custom web or mobile application cost?',
    answer: 'Our project investments are transparent and milestone-based:\n\n• MVP / Rapid Prototypes: ₹50,000 – ₹1,50,000\n• Standard Web & Mobile Applications: ₹1,50,000 – ₹3,00,000\n• Enterprise Cloud Platforms & Multi-User Portals: ₹3,00,000 – ₹6,00,000+\n• High-Scale Distributed Systems: Custom Scope.\n\nAll estimates include 18% GST with formal SAC 998314 Tax Invoices. You can submit your project scope requirements below to receive a formal commercial quotation within 24 hours!',
    category: 'Pricing & Quotes',
    keywords: ['price', 'pricing', 'cost', 'budget', 'rate', 'quote', 'quotation', 'how much', 'fee', 'charge', 'expensive', 'inr', 'rupees'],
    suggestedFollowUps: ['Submit Project Scope', 'Are your invoices GST compliant?', 'How to get a formal quotation?'],
    actionLink: '#contact',
    actionLabel: 'Submit Project Scope for Quotation',
    isActive: true,
    orderIndex: 2,
    matchCount: 210
  },
  {
    id: 'cqa_3',
    question: 'What technologies and frameworks do you build with?',
    answer: 'We leverage modern, production-hardened technologies:\n\n• Frontend: React 19, Next.js, TypeScript, Tailwind CSS, Motion\n• Mobile: React Native, Expo, WebRTC\n• Backend: Node.js, Express, Go (Golang), Python\n• Databases: PostgreSQL, Supabase, Redis Caching, WebSockets\n• Cloud & DevOps: Docker, Google Cloud Platform, AWS, CI/CD pipelines\n• Compliance: Automated GST SAC 998314 billing engines.',
    category: 'Tech Stack',
    keywords: ['tech', 'technology', 'stack', 'languages', 'react', 'nextjs', 'typescript', 'node', 'postgres', 'database', 'docker', 'cloud', 'backend', 'frontend'],
    suggestedFollowUps: ['View Technology Stack', 'View Project Portfolio', 'Do we own the source code?'],
    actionLink: '#tech-stack',
    actionLabel: 'View Detailed Technology Stack',
    isActive: true,
    orderIndex: 3,
    matchCount: 95
  },
  {
    id: 'cqa_4',
    question: 'How do I request a formal project quotation and proposal?',
    answer: 'You can submit your requirements directly through our online Project Scope form on this website. Our engineering team, led by Manoj Satapathy, will review your deliverables and send an official commercial Quotation with itemized milestone costs, tax breakdown (CGST/SGST/IGST), and timeline within 24 hours.',
    category: 'Pricing & Quotes',
    keywords: ['quotation', 'formal quote', 'proposal', 'estimate', 'enquiry', 'lead', 'hire', 'start project', 'consultation', 'book'],
    suggestedFollowUps: ['Fill Project Scope Form', 'How long does development take?', 'What are your payment terms?'],
    actionLink: '#contact',
    actionLabel: 'Submit Project Scope Form',
    isActive: true,
    orderIndex: 4,
    matchCount: 168
  },
  {
    id: 'cqa_5',
    question: 'Are your invoices GST compliant in India? What is SAC Code 998314?',
    answer: 'Yes, 100%. Fusion Forge Creation is registered under GSTIN 26AALFF1234F1Z5 in Silvassa (Dadra & Nagar Haveli). We provide official B2B Tax Invoices under SAC 998314 (Information Technology Software Services), enabling your business to claim full Input Tax Credit (ITC). Intra-state deals receive CGST (9%) + SGST (9%), while inter-state deals receive IGST (18%).',
    category: 'GST & Invoicing',
    keywords: ['gst', 'gstin', 'sac', '998314', 'tax', 'invoice', 'itc', 'input tax credit', 'cgst', 'sgst', 'igst', 'hsn', 'compliance', 'b2b'],
    suggestedFollowUps: ['What are your payment terms?', 'How much does a web app cost?'],
    actionLink: '#contact',
    actionLabel: 'Review Agency GST Information',
    isActive: true,
    orderIndex: 5,
    matchCount: 88
  },
  {
    id: 'cqa_6',
    question: 'How long does a typical software project take to build and deploy?',
    answer: 'Timelines depend on scope and milestone structure:\n\n• MVP / Rapid Prototype: 2 – 4 Weeks\n• Standard Web & Mobile App: 6 – 10 Weeks\n• Enterprise Platform & SaaS: 12 – 16 Weeks\n\nWe provide weekly staging preview links and live milestone demonstrations throughout every sprint.',
    category: 'General',
    keywords: ['timeline', 'duration', 'time', 'how long', 'weeks', 'months', 'deadline', 'delivery', 'turnaround', 'speed'],
    suggestedFollowUps: ['What is your development workflow?', 'Do we own the source code?'],
    actionLink: '#projects',
    actionLabel: 'See Past Project Timelines',
    isActive: true,
    orderIndex: 6,
    matchCount: 74
  },
  {
    id: 'cqa_7',
    question: 'Do we own 100% of the source code and intellectual property (IP)?',
    answer: 'Yes, absolutely. Upon settlement of project milestones, 100% of the source code, repository commits, design files, database architectures, and intellectual property rights belong exclusively to your organization with zero vendor lock-in.',
    category: 'General',
    keywords: ['ip', 'intellectual property', 'code ownership', 'source code', 'ownership', 'copyright', 'github', 'repo', 'license'],
    suggestedFollowUps: ['What post-launch support do you provide?', 'How to get a formal quote?'],
    actionLink: '#faqs',
    actionLabel: 'Read FAQs on IP Rights',
    isActive: true,
    orderIndex: 7,
    matchCount: 62
  },
  {
    id: 'cqa_8',
    question: 'What post-launch warranty and technical maintenance do you provide?',
    answer: 'Every deployment includes an inclusive 60-day post-launch warranty covering bug fixes, performance tuning, and cloud infrastructure monitoring. We also provide monthly SLA retainers for continuous feature rollouts and 24/7 uptime monitoring.',
    category: 'Contact & Support',
    keywords: ['warranty', 'maintenance', 'support', 'sla', 'bugs', 'post launch', 'updates', 'monitoring', 'hosting'],
    suggestedFollowUps: ['Contact Support Team', 'What services do you offer?'],
    actionLink: '#contact',
    actionLabel: 'Contact Technical Support',
    isActive: true,
    orderIndex: 8,
    matchCount: 45
  },
  {
    id: 'cqa_9',
    question: 'Where is Fusion Forge Creation located and how can I contact you directly?',
    answer: 'Our headquarters is located at Survey No. 274, Athal Village, Silvassa, Dadra & Nagar Haveli (396230).\n\n• Email: contact@fusionforge.io / manojsatapathy.jp@gmail.com\n• Phone / WhatsApp: +91 90040 77126\n• Executive Lead: Manoj Satapathy\n\nYou can contact us directly or drop a message via the enquiry form below!',
    category: 'Contact & Support',
    keywords: ['location', 'address', 'where', 'city', 'silvassa', 'office', 'phone', 'whatsapp', 'email', 'contact', 'manoj', 'satapathy', 'call', 'talk'],
    suggestedFollowUps: ['Fill Project Scope Form', 'How to get a formal quote?'],
    actionLink: '#contact',
    actionLabel: 'Reach Out via Phone / WhatsApp',
    isActive: true,
    orderIndex: 9,
    matchCount: 119
  }
];

// =============================================================================
// PHASE 10: INITIAL PURCHASES (B2B VENDORS & SUPPLIER INVOICES)
// =============================================================================
export const INITIAL_PURCHASES: Purchase[] = [];

// =============================================================================
// PHASE 10: INITIAL OPERATING EXPENSES (OPEX & OFFICE EXPENDITURES)
// =============================================================================
export const INITIAL_EXPENSES: Expense[] = [];

// =============================================================================
// PHASE 10: INITIAL STAFF MASTER (EMPLOYEE PROFILES)
// =============================================================================
export const INITIAL_STAFF_MEMBERS: StaffMember[] = [];

// =============================================================================
// PHASE 10: INITIAL SALARY & PAYROLL RECORDS (MONTHLY PAYSLIPS)
// =============================================================================
export const INITIAL_SALARY_RECORDS: SalaryRecord[] = [];

export const INITIAL_STATE_UT_MASTER = [
  { code: '01', name: 'Jammu and Kashmir', is_ut_without_legislature: false, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '02', name: 'Himachal Pradesh', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '03', name: 'Punjab', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '04', name: 'Chandigarh', is_ut_without_legislature: true, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '05', name: 'Uttarakhand', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '06', name: 'Haryana', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '07', name: 'Delhi', is_ut_without_legislature: false, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '08', name: 'Rajasthan', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '09', name: 'Uttar Pradesh', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '10', name: 'Bihar', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '11', name: 'Sikkim', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '12', name: 'Arunachal Pradesh', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '13', name: 'Nagaland', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '14', name: 'Manipur', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '15', name: 'Mizoram', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '16', name: 'Tripura', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '17', name: 'Meghalaya', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '18', name: 'Assam', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '19', name: 'West Bengal', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '20', name: 'Jharkhand', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '21', name: 'Odisha', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '22', name: 'Chhattisgarh', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '23', name: 'Madhya Pradesh', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '24', name: 'Gujarat', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '25', name: 'Daman and Diu (Legacy)', is_ut_without_legislature: true, is_union_territory: true, selectable: false, is_legacy: true, notes: 'Merged with 26 Dadra and Nagar Haveli and Daman and Diu' },
  { code: '26', name: 'Dadra and Nagar Haveli and Daman and Diu', is_ut_without_legislature: true, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '27', name: 'Maharashtra', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '28', name: 'Andhra Pradesh (Old)', is_ut_without_legislature: false, is_union_territory: false, selectable: false, is_legacy: true, notes: 'Bifurcated into 36 Telangana and 37 Andhra Pradesh' },
  { code: '29', name: 'Karnataka', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '30', name: 'Goa', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '31', name: 'Lakshadweep', is_ut_without_legislature: true, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '32', name: 'Kerala', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '33', name: 'Tamil Nadu', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '34', name: 'Puducherry', is_ut_without_legislature: false, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '35', name: 'Andaman and Nicobar Islands', is_ut_without_legislature: true, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '36', name: 'Telangana', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '37', name: 'Andhra Pradesh', is_ut_without_legislature: false, is_union_territory: false, selectable: true, is_legacy: false },
  { code: '38', name: 'Ladakh', is_ut_without_legislature: true, is_union_territory: true, selectable: true, is_legacy: false },
  { code: '97', name: 'Other Territory', is_ut_without_legislature: true, is_union_territory: true, selectable: true, is_legacy: false }
];

export const INITIAL_AUDIT_LOGS: any[] = [];

// =============================================================================
// PHASE 12: INITIAL CENTRAL NOTIFICATIONS & EMAIL DISPATCH LOGS
// =============================================================================

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_EMAIL_LOGS: EmailLog[] = [];

export { SUPABASE_SQL_SCHEMA } from './data/supabaseSql';

/*
-- OLD_SCHEMA_REPLACED_BY_AUTHORITATIVE_SOURCE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'admin', 'editor', 'accountant', 'staff')),
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. MASTER DATA
-- ==============================================================================

-- 2.1 State / UT Master (Exact Indian GST State Master with Legacy Flagging)
CREATE TABLE IF NOT EXISTS public.state_ut_master (
  code VARCHAR(2) PRIMARY KEY,
  name TEXT NOT NULL,
  is_ut_without_legislature BOOLEAN NOT NULL DEFAULT false,
  is_union_territory BOOLEAN NOT NULL DEFAULT false,
  selectable BOOLEAN NOT NULL DEFAULT true,
  is_legacy BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Services Master
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Code',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Technologies Master
CREATE TABLE IF NOT EXISTS public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Frontend & UI', 'Backend & APIs', 'Databases & Storage', 'Cloud, DevOps & Tools')),
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Projects Master
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  client_name TEXT NOT NULL,
  image_url TEXT,
  project_url TEXT,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.5 Testimonials Master
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 FAQs Master
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Website Settings
CREATE TABLE IF NOT EXISTS public.website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Fusion Forge Creation',
  tagline TEXT NOT NULL DEFAULT 'Where Ideas Fuse With Technology',
  contact_email TEXT NOT NULL DEFAULT 'contact@fusionforgecreation.com',
  contact_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  address_line1 TEXT NOT NULL DEFAULT 'Suite 504, Tech Park Cyber City, Patia',
  city TEXT NOT NULL DEFAULT 'Bhubaneswar',
  state TEXT NOT NULL DEFAULT 'Odisha',
  pincode VARCHAR(10) NOT NULL DEFAULT '751024',
  support_hours TEXT DEFAULT 'Mon - Fri: 9:00 AM - 6:00 PM IST',
  social_links JSONB DEFAULT '{"github": "https://github.com", "linkedin": "https://linkedin.com"}'::jsonb,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Seller Profile (Master Company & Tax Record)
CREATE TABLE IF NOT EXISTS public.seller_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Fusion Forge Creation',
  tagline TEXT NOT NULL DEFAULT 'Where Ideas Fuse With Technology',
  email TEXT NOT NULL DEFAULT 'contact@fusionforgecreation.com',
  phone TEXT NOT NULL DEFAULT '+91 [Enter Business Phone]',
  address TEXT NOT NULL DEFAULT '[Enter Business Address, Bhubaneswar, Odisha]',
  gstin VARCHAR(15) NOT NULL DEFAULT '21XXXXXXXXXX1ZX',
  state_code VARCHAR(2) NOT NULL DEFAULT '21' REFERENCES public.state_ut_master(code),
  jurisdiction TEXT NOT NULL DEFAULT 'Bhubaneswar, Odisha',
  logo_url TEXT DEFAULT '/logo.png',
  signature_url TEXT DEFAULT '/signatures/authorized_signatory.png',
  bank_name TEXT NOT NULL DEFAULT '[Enter Bank Name - e.g. HDFC Bank Ltd.]',
  account_name TEXT NOT NULL DEFAULT 'Fusion Forge Creation',
  account_number TEXT NOT NULL DEFAULT '[Enter Account Number]',
  ifsc_code TEXT NOT NULL DEFAULT '[Enter IFSC Code - e.g. HDFC000XXXX]',
  branch_name TEXT NOT NULL DEFAULT '[Enter Branch Name - e.g. Patia Branch]',
  terms_conditions TEXT NOT NULL DEFAULT '1. 50% advance on project kickoff, balance on completion. 2. Invoices are payable within 15 days of issue date. 3. Goods & Services Tax (GST) charged as per Indian taxation norms (SAC 998314). 4. All payments to be remitted to the aforementioned bank account only.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. CRM TABLES
-- ==============================================================================

-- 3.1 Clients Master
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_code VARCHAR(2) NOT NULL DEFAULT '24' REFERENCES public.state_ut_master(code),
  pincode VARCHAR(10),
  gstin VARCHAR(15),
  pan VARCHAR(10),
  place_of_supply TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'inactive', 'lead', 'deleted')),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  currency TEXT NOT NULL DEFAULT 'INR',
  total_billed NUMERIC(12,2) DEFAULT 0.00,
  total_paid NUMERIC(12,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Inbound Project Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Converted', 'Closed')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. SALES TABLES
-- ==============================================================================

-- 4.1 Quotations Table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'converted')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  discount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
  gst_applicable BOOLEAN NOT NULL DEFAULT true,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 Quotation Items Table
CREATE TABLE IF NOT EXISTS public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_price NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.3 Invoices Table (Authoritative GST Invoice)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT,
  quote_id UUID REFERENCES public.quotations(id),
  quote_number TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'overdue')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '15 days'),
  
  -- Financials & Tax Base
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  discount_type TEXT NOT NULL DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
  discount_value NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  
  -- GST Application & Rates
  gst_applicable BOOLEAN NOT NULL DEFAULT true,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
  gst_type TEXT NOT NULL DEFAULT 'igst' CHECK (gst_type IN ('cgst_sgst', 'cgst_utgst', 'igst', 'none')),
  
  -- Seller Details
  seller_name TEXT NOT NULL DEFAULT 'Fusion Forge Creation',
  seller_gstin VARCHAR(15) NOT NULL DEFAULT '21AAACF9876B1Z5',
  seller_state TEXT NOT NULL DEFAULT 'Odisha',
  seller_state_code VARCHAR(2) NOT NULL DEFAULT '21' REFERENCES public.state_ut_master(code),
  seller_address TEXT NOT NULL,
  
  -- Buyer & Place of Supply
  buyer_company TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_gstin VARCHAR(15),
  buyer_state TEXT NOT NULL DEFAULT 'Gujarat',
  buyer_state_code VARCHAR(2) NOT NULL DEFAULT '24' REFERENCES public.state_ut_master(code),
  buyer_address TEXT NOT NULL,
  place_of_supply VARCHAR(2) NOT NULL DEFAULT '24' REFERENCES public.state_ut_master(code),
  supply_type TEXT NOT NULL DEFAULT 'INTER_STATE',
  tax_label TEXT NOT NULL DEFAULT 'IGST',
  
  -- Tax Breakdowns
  cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  utgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  
  -- Grand Total & Payments
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  balance_due NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  amount_in_words TEXT,
  
  -- Items JSON Cache, Terms & Bank Details
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_terms TEXT DEFAULT 'Payment due within 15 days of invoice date.',
  bank_details JSONB,
  notes TEXT,
  
  -- Soft Delete Fields
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.4 Invoice Items Table (Relational Breakdown with automatic total_price)
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_price NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sac_code VARCHAR(10) DEFAULT '998314',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.5 Payment Table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'upi', 'cheque', 'credit_card', 'other')),
  reference_number TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Legacy / Cache fields
  receipt_number TEXT,
  invoice_number TEXT,
  client_id UUID REFERENCES public.clients(id) ON DELETE RESTRICT,
  client_name TEXT,
  currency TEXT NOT NULL DEFAULT 'INR'
);

-- ==============================================================================
-- PHASE 10: PURCHASES, EXPENSES, STAFF MEMBERS & PAYROLL SALARY RECORDS
-- ==============================================================================

-- 4.6 Purchases Table (Supplier & Vendor Invoices with Input Tax Credit Breakdown)
CREATE TABLE IF NOT EXISTS public.purchases (
  id TEXT PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  supplier_gstin VARCHAR(15),
  supplier_email TEXT,
  supplier_phone TEXT,
  supplier_address TEXT,
  supplier_state_code VARCHAR(2) REFERENCES public.state_ut_master(code),
  bill_number TEXT NOT NULL,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  description TEXT NOT NULL,
  hsn_sac_code VARCHAR(10),
  category TEXT,
  taxable_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
  cgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  sgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  utgst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  igst_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partially_paid', 'cancelled')),
  payment_mode TEXT,
  payment_date DATE,
  payment_ref TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  notes TEXT,
  is_itc_claimable BOOLEAN NOT NULL DEFAULT true,
  is_reverse_charge BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.7 Expenses Table (Operational, Travel, Software & Administrative Overheads)
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  vendor_gstin VARCHAR(15),
  amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  gst_applicable BOOLEAN NOT NULL DEFAULT false,
  taxable_amount NUMERIC(12,2),
  gst_rate NUMERIC(5,2),
  gst_amount NUMERIC(12,2),
  cgst_amount NUMERIC(12,2),
  sgst_amount NUMERIC(12,2),
  igst_amount NUMERIC(12,2),
  is_itc_eligible BOOLEAN NOT NULL DEFAULT true,
  payment_mode TEXT NOT NULL DEFAULT 'UPI',
  reference_number TEXT,
  attachment_url TEXT,
  attachment_name TEXT,
  paid_by TEXT,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.8 Staff Members Table (Employees, Engineers & Administrative Personnel)
CREATE TABLE IF NOT EXISTS public.staff_members (
  id TEXT PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  designation TEXT NOT NULL,
  department TEXT NOT NULL,
  joining_date DATE NOT NULL,
  pan_number VARCHAR(10),
  bank_account_name TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_ifsc VARCHAR(11),
  base_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  hra_allowance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  special_allowance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  pf_applicable BOOLEAN NOT NULL DEFAULT true,
  esi_applicable BOOLEAN NOT NULL DEFAULT false,
  tds_applicable BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.9 Salary Records Table (Payroll Cycles, Statutory Deductions & Payslips)
CREATE TABLE IF NOT EXISTS public.salary_records (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  employee_code TEXT,
  designation TEXT,
  department TEXT,
  period TEXT NOT NULL,
  period_month TEXT NOT NULL,
  period_year INTEGER NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  hra NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  special_allowance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  bonus_or_incentive NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  gross_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  provident_fund NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  esi NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  professional_tax NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  tds_deduction NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  advance_deduction NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  total_deductions NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  net_salary NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  payment_date DATE,
  payment_status TEXT NOT NULL DEFAULT 'processing' CHECK (payment_status IN ('processing', 'paid', 'hold', 'failed')),
  payment_mode TEXT,
  transaction_reference TEXT,
  payslip_generated BOOLEAN NOT NULL DEFAULT true,
  payslip_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. AUDIT / SECURITY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE', 'PAYMENT_RECORD', 'AUTH_LOGIN', 'CALCULATE_GST')),
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. AUTHORITATIVE GST CALCULATION RPC & DATABASE TRIGGERS
-- ==============================================================================

-- 6.1 Check if State Code is Union Territory without Legislature
CREATE OR REPLACE FUNCTION public.is_ut_without_legislature(p_state_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- 04: Chandigarh, 25: Daman & Diu (Legacy), 26: Dadra & Nagar Haveli and Daman & Diu, 31: Lakshadweep, 35: A&N, 38: Ladakh, 97: Other Territory
  RETURN p_state_code IN ('04', '25', '26', '31', '35', '38', '97');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6.2 Authoritative GST Calculation Function (RPC Endpoint)
CREATE OR REPLACE FUNCTION public.calculate_invoice_totals(
  p_items JSONB,
  p_discount_type TEXT DEFAULT 'fixed',
  p_discount_val NUMERIC DEFAULT 0.00,
  p_seller_state_code TEXT DEFAULT '21',
  p_buyer_state_code TEXT DEFAULT '24',
  p_gst_rate NUMERIC DEFAULT 18.00
)
RETURNS JSONB AS $$
DECLARE
  v_item JSONB;
  v_subtotal NUMERIC(12,2) := 0.00;
  v_discount_amount NUMERIC(12,2) := 0.00;
  v_taxable_amount NUMERIC(12,2) := 0.00;
  v_cgst NUMERIC(12,2) := 0.00;
  v_sgst NUMERIC(12,2) := 0.00;
  v_utgst NUMERIC(12,2) := 0.00;
  v_igst NUMERIC(12,2) := 0.00;
  v_total_tax NUMERIC(12,2) := 0.00;
  v_grand_total NUMERIC(12,2) := 0.00;
  v_is_intra BOOLEAN;
  v_is_ut BOOLEAN;
  v_supply_type TEXT;
  v_gst_type TEXT;
  v_tax_label TEXT;
  v_half_rate NUMERIC(5,2);
BEGIN
  -- 1. Compute Line Items Subtotal
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_subtotal := v_subtotal + ROUND(((v_item->>'quantity')::NUMERIC * (v_item->>'rate')::NUMERIC), 2);
  END LOOP;

  -- 2. Compute Discount
  IF p_discount_type = 'percentage' THEN
    v_discount_amount := ROUND((v_subtotal * p_discount_val / 100.0), 2);
  ELSE
    v_discount_amount := LEAST(v_subtotal, ROUND(p_discount_val, 2));
  END IF;

  v_taxable_amount := GREATEST(0.00, v_subtotal - v_discount_amount);
  v_is_intra := (p_seller_state_code = p_buyer_state_code);
  v_is_ut := v_is_intra AND public.is_ut_without_legislature(p_seller_state_code);
  v_half_rate := p_gst_rate / 2.0;

  -- 3. Tax Breakdown
  IF p_gst_rate <= 0 THEN
    v_supply_type := 'EXEMPT';
    v_gst_type := 'none';
    v_tax_label := 'Tax Exempt (0%)';
  ELSIF v_is_intra THEN
    v_supply_type := 'INTRA_STATE';
    v_cgst := ROUND((v_taxable_amount * v_half_rate / 100.0), 2);

    IF v_is_ut THEN
      -- Intra-State Union Territory (e.g. 26 -> 26 Dadra and Nagar Haveli and Daman and Diu)
      v_utgst := ROUND((v_taxable_amount * v_half_rate / 100.0), 2);
      v_gst_type := 'cgst_utgst';
      v_tax_label := 'CGST + UTGST';
    ELSE
      -- Intra-State Regular State (e.g. 21 -> 21 Odisha, 27 -> 27 Maharashtra)
      v_sgst := ROUND((v_taxable_amount * v_half_rate / 100.0), 2);
      v_gst_type := 'cgst_sgst';
      v_tax_label := 'CGST + SGST';
    END IF;
  ELSE
    -- Inter-State Supply (e.g. 21 Odisha -> 24 Gujarat)
    v_supply_type := 'INTER_STATE';
    v_igst := ROUND((v_taxable_amount * p_gst_rate / 100.0), 2);
    v_gst_type := 'igst';
    v_tax_label := 'IGST';
  END IF;

  v_total_tax := v_cgst + v_sgst + v_utgst + v_igst;
  v_grand_total := v_taxable_amount + v_total_tax;

  RETURN jsonb_build_object(
    'subtotal', v_subtotal,
    'discount_amount', v_discount_amount,
    'taxable_amount', v_taxable_amount,
    'supply_type', v_supply_type,
    'gst_type', v_gst_type,
    'tax_label', v_tax_label,
    'cgst_amount', v_cgst,
    'sgst_amount', v_sgst,
    'utgst_amount', v_utgst,
    'igst_amount', v_igst,
    'total_tax_amount', v_total_tax,
    'total_amount', v_grand_total,
    'seller_state_code', p_seller_state_code,
    'buyer_state_code', p_buyer_state_code,
    'authoritative_layer', 'Supabase PostgreSQL calculate_invoice_totals()'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6.3 Database Trigger Enforcing Authoritative Calculations on Invoices
CREATE OR REPLACE FUNCTION public.trg_enforce_invoice_authoritative_calculation()
RETURNS TRIGGER AS $$
DECLARE
  v_res JSONB;
BEGIN
  v_res := public.calculate_invoice_totals(
    NEW.items,
    NEW.discount_type,
    NEW.discount_value,
    NEW.seller_state_code,
    NEW.buyer_state_code,
    NEW.gst_rate
  );

  NEW.subtotal := (v_res->>'subtotal')::NUMERIC;
  NEW.discount_amount := (v_res->>'discount_amount')::NUMERIC;
  NEW.taxable_amount := (v_res->>'taxable_amount')::NUMERIC;
  NEW.supply_type := v_res->>'supply_type';
  NEW.gst_type := v_res->>'gst_type';
  NEW.tax_label := v_res->>'tax_label';
  NEW.cgst_amount := (v_res->>'cgst_amount')::NUMERIC;
  NEW.sgst_amount := (v_res->>'sgst_amount')::NUMERIC;
  NEW.utgst_amount := (v_res->>'utgst_amount')::NUMERIC;
  NEW.igst_amount := (v_res->>'igst_amount')::NUMERIC;
  NEW.total_amount := (v_res->>'total_amount')::NUMERIC;
  NEW.balance_due := GREATEST(0.00, NEW.total_amount - COALESCE(NEW.paid_amount, 0.00));
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_invoice_authoritative_gst ON public.invoices;
CREATE TRIGGER trg_invoice_authoritative_gst
BEFORE INSERT OR UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.trg_enforce_invoice_authoritative_calculation();

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES & ROLE-BASED ACCESS CONTROL (RBAC)
-- ==============================================================================

-- Enable Row Level Security across all application tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_ut_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper Functions to determine current authenticated user's role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT (public.get_auth_role() = 'super_admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_super()
RETURNS BOOLEAN AS $$
  SELECT (public.get_auth_role() IN ('super_admin', 'admin'));
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_accountant_or_admin()
RETURNS BOOLEAN AS $$
  SELECT (public.get_auth_role() IN ('super_admin', 'admin', 'accountant'));
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_content_editor()
RETURNS BOOLEAN AS $$
  SELECT (public.get_auth_role() IN ('super_admin', 'admin', 'editor'));
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 7.1 PUBLIC USERS POLICIES (Anonymous & Unauthenticated)
-- Can SELECT: active services, active projects, active technologies, 
--             featured testimonials, active FAQs, public website settings, seller public info.
-- Can INSERT: enquiries (Project Inquiry Submission).
-- MUST NOT ACCESS: clients, quotations, invoices, invoice_items, payments, profiles, audit_logs.
-- ------------------------------------------------------------------------------

-- Services (Public can SELECT active only)
CREATE POLICY "Public can select active services" 
ON public.services FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Content editors manage services" 
ON public.services FOR ALL 
USING (public.is_content_editor());

-- Projects (Public can select active portfolio projects)
CREATE POLICY "Public can select active projects" 
ON public.projects FOR SELECT 
USING (is_featured = true OR auth.role() = 'authenticated');

CREATE POLICY "Content editors manage projects" 
ON public.projects FOR ALL 
USING (public.is_content_editor());

-- Technologies (Public can select active tech stack)
CREATE POLICY "Public can select active technologies" 
ON public.technologies FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Content editors manage technologies" 
ON public.technologies FOR ALL 
USING (public.is_content_editor());

-- Testimonials (Public can select featured client reviews)
CREATE POLICY "Public can select featured testimonials" 
ON public.testimonials FOR SELECT 
USING (is_featured = true OR auth.role() = 'authenticated');

CREATE POLICY "Content editors manage testimonials" 
ON public.testimonials FOR ALL 
USING (public.is_content_editor());

-- FAQs (Public can select active FAQs)
CREATE POLICY "Public can select active faqs" 
ON public.faqs FOR SELECT 
USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Content editors manage faqs" 
ON public.faqs FOR ALL 
USING (public.is_content_editor());

-- Website Settings (Public can select public website settings)
CREATE POLICY "Public can select public website settings" 
ON public.website_settings FOR SELECT 
USING (true);

CREATE POLICY "Admins manage website settings" 
ON public.website_settings FOR ALL 
USING (public.is_admin_or_super());

-- Seller Profile (Public can select seller contact & public info)
CREATE POLICY "Public can select seller public information" 
ON public.seller_profile FOR SELECT 
USING (true);

CREATE POLICY "Super Admins manage seller profile" 
ON public.seller_profile FOR ALL 
USING (public.is_super_admin());

-- State UT Master (Public readable for tax validation)
CREATE POLICY "Public can select state_ut_master" 
ON public.state_ut_master FOR SELECT 
USING (true);

-- Enquiries (Public can INSERT new enquiries; Authenticated staff can SELECT/UPDATE)
CREATE POLICY "Public can insert enquiries" 
ON public.enquiries FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Staff can select and manage enquiries" 
ON public.enquiries FOR ALL 
USING (public.get_auth_role() IN ('super_admin', 'admin', 'staff', 'project_manager'));

-- ------------------------------------------------------------------------------
-- 7.2 SENSITIVE TABLES (Blocked from Public, Controlled by Role)
-- ------------------------------------------------------------------------------

-- Profiles: Super Admin full control; Users can view/edit own profile
CREATE POLICY "Super Admins have full access to profiles" 
ON public.profiles FOR ALL 
USING (public.is_super_admin());

CREATE POLICY "Users can view and update own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_admin_or_super());

CREATE POLICY "Users update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Clients: Super Admin, Admin, Accountant, Staff (Clients view own profile)
CREATE POLICY "Accountants and Admins manage clients" 
ON public.clients FOR ALL 
USING (public.get_auth_role() IN ('super_admin', 'admin', 'accountant'));

CREATE POLICY "Staff view assigned clients" 
ON public.clients FOR SELECT 
USING (public.get_auth_role() IN ('staff', 'project_manager'));

CREATE POLICY "Clients can view own client record" 
ON public.clients FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE client_id = clients.id));

-- Quotations & Quotation Items: Super Admin, Admin, Project Managers, Accountants
CREATE POLICY "Staff and Accountants manage quotations" 
ON public.quotations FOR ALL 
USING (public.get_auth_role() IN ('super_admin', 'admin', 'accountant', 'project_manager'));

CREATE POLICY "Clients can view their own quotations" 
ON public.quotations FOR SELECT 
USING (status IN ('sent', 'approved', 'rejected') AND auth.uid() IN (
  SELECT id FROM public.profiles WHERE client_id = quotations.client_id
));

CREATE POLICY "Staff and Accountants manage quotation items" 
ON public.quotation_items FOR ALL 
USING (public.get_auth_role() IN ('super_admin', 'admin', 'accountant', 'project_manager'));

-- Payments: Super Admin, Admin, Accountant full control; Clients view own payments
CREATE POLICY "Accountants and Admins manage payments" 
ON public.payments FOR ALL 
USING (public.is_accountant_or_admin());

CREATE POLICY "Clients can view their own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE client_id = payments.client_id
));

-- Audit Logs: Read-only for Super Admin & Admin; Insertable by trigger security definer
CREATE POLICY "Super Admins and Admins view audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.is_admin_or_super());

CREATE POLICY "System triggers append audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7.3 SECTION 19: SUPER ADMIN-ONLY INVOICE ACTIONS
-- Permitted roles (Super Admin, Admin, Accountant, assigned Staff, Client) can VIEW, PDF, PRINT.
-- STRICT REQUIREMENT: ONLY super_admin can MODIFY (UPDATE) or SOFT DELETE (UPDATE is_deleted=true / DELETE).
-- Enforced both at Database RLS Policy level AND UI level.
-- ------------------------------------------------------------------------------

-- Invoices: SELECT Policy (Permitted roles can view, download PDF, print)
CREATE POLICY "Permitted roles can view invoices" 
ON public.invoices FOR SELECT 
USING (
  -- Super Admin, Admin, Accountant, Staff can view non-deleted (or deleted if admin)
  (public.get_auth_role() IN ('super_admin', 'admin', 'accountant', 'staff', 'project_manager') AND (is_deleted = false OR public.is_admin_or_super()))
  OR
  -- Clients can only view their own issued/paid invoices
  (auth.uid() IN (SELECT id FROM public.profiles WHERE client_id = invoices.client_id) AND is_deleted = false)
);

-- Invoices: INSERT Policy (Super Admin & Accountant can create invoices)
CREATE POLICY "Super Admin and Accountant can create invoices" 
ON public.invoices FOR INSERT 
WITH CHECK (public.get_auth_role() IN ('super_admin', 'accountant', 'admin'));

-- Invoices: UPDATE Policy (STRICT: ONLY super_admin can modify invoices or soft-delete)
CREATE POLICY "ONLY super_admin can modify or soft-delete invoices" 
ON public.invoices FOR UPDATE 
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Invoices: DELETE Policy (STRICT: ONLY super_admin can hard delete invoices)
CREATE POLICY "ONLY super_admin can hard delete invoices" 
ON public.invoices FOR DELETE 
USING (public.is_super_admin());

-- Invoice Items: Permitted roles can view; ONLY super_admin can modify
CREATE POLICY "Permitted roles can view invoice items" 
ON public.invoice_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND (invoices.is_deleted = false OR public.is_admin_or_super())
  )
);

CREATE POLICY "ONLY super_admin can modify invoice items" 
ON public.invoice_items FOR ALL 
USING (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 7.4 PHASE 10: ACCOUNTING, PURCHASES, EXPENSES & PAYROLL RLS POLICIES
-- Strict Role-Based Access: super_admin full control, accountant & admin operational access,
-- unauthorized roles strictly blocked.
-- ------------------------------------------------------------------------------

-- Purchases: Super Admin, Admin, Accountant can SELECT, INSERT, UPDATE; Super Admin ONLY can DELETE
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial roles view purchases" 
ON public.purchases FOR SELECT 
USING (public.is_accountant_or_admin());

CREATE POLICY "Financial roles create purchases" 
ON public.purchases FOR INSERT 
WITH CHECK (public.is_accountant_or_admin());

CREATE POLICY "Financial roles update purchases" 
ON public.purchases FOR UPDATE 
USING (public.is_accountant_or_admin());

CREATE POLICY "ONLY super_admin can delete purchases" 
ON public.purchases FOR DELETE 
USING (public.is_super_admin());

-- Expenses: Super Admin, Admin, Accountant can SELECT, INSERT, UPDATE; Super Admin ONLY can DELETE
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial roles view expenses" 
ON public.expenses FOR SELECT 
USING (public.is_accountant_or_admin());

CREATE POLICY "Financial roles create expenses" 
ON public.expenses FOR INSERT 
WITH CHECK (public.is_accountant_or_admin());

CREATE POLICY "Financial roles update expenses" 
ON public.expenses FOR UPDATE 
USING (public.is_accountant_or_admin());

CREATE POLICY "ONLY super_admin can delete expenses" 
ON public.expenses FOR DELETE 
USING (public.is_super_admin());

-- Staff Members: Super Admin, Admin, Accountant can view staff directory; Admins manage staff
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial and Admin roles view staff" 
ON public.staff_members FOR SELECT 
USING (public.is_accountant_or_admin());

CREATE POLICY "Admins manage staff members" 
ON public.staff_members FOR ALL 
USING (public.is_admin_or_super());

-- Salary Records: Super Admin, Admin, Accountant can view & process payroll; Super Admin deletes
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial roles view salary records" 
ON public.salary_records FOR SELECT 
USING (public.is_accountant_or_admin());

CREATE POLICY "Financial roles process salary records" 
ON public.salary_records FOR INSERT 
WITH CHECK (public.is_accountant_or_admin());

CREATE POLICY "Financial roles update salary records" 
ON public.salary_records FOR UPDATE 
USING (public.is_accountant_or_admin());

CREATE POLICY "ONLY super_admin can delete salary records" 
ON public.salary_records FOR DELETE 
USING (public.is_super_admin());
*/

// =============================================================================
// PHASE 16: LEGAL DOCUMENT MONITORING & VISITOR MONITORING
// =============================================================================

export const INITIAL_LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'legal_doc_privacy',
    slug: 'privacy-policy',
    title: 'Privacy Policy & Data Protection Charter',
    documentType: 'privacy_policy',
    version: 'v2.1',
    effectiveDate: '2026-08-01',
    lastUpdatedDate: '2026-08-16',
    status: 'active',
    summary: 'Comprehensive privacy policy detailing data minimization, zero-third-party tracking sale, client credential encryption, and compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
    content: `# Privacy Policy & Data Protection Charter
**Fusion Forge Creation** ("we", "us", or "our") is dedicated to protecting the privacy, confidentiality, and sovereign data rights of our clients, prospects, and visitors.

---

### 1. Scope & Sovereign Data Collection
We operate on a **Data Minimization Principle**. We only gather information strictly required to design, develop, deploy, and support bespoke software architectures.
- **Inbound Inquiries**: Full Name, Authorized Corporate Email, Mobile / WhatsApp Number, Company Trade Name, Registered GSTIN (for B2B invoicing), and Project Technical Scope.
- **Client Portal Authentication**: Secure encrypted tokens managed via Supabase PostgreSQL Auth.
- **Telemetry & Visitor Analytics**: Aggregated, privacy-conscious event logs (anonymized session identifiers, section dwell count, device categories). We **never** record passwords, keystrokes, or invasive third-party cross-site trackers.

---

### 2. Legal Basis & Statutory Compliance
Our data processing protocols comply with:
- **Digital Personal Data Protection (DPDP) Act, 2023** (India)
- **Information Technology Act, 2000** & IT (Reasonable Security Practices) Rules, 2011
- **Goods and Services Tax Act, 2017** (mandatory record retention for registered B2B invoices)

---

### 3. Purpose of Processing
1. Preparing commercial Quotations, Technical Scopes of Work (SOW), and Project Roadmaps.
2. Generating statutory GST Tax Invoices and maintaining double-entry accounting ledgers.
3. Providing real-time milestone tracking, staging access, and client dashboard analytics.
4. Sending transactional email dispatches (estimates, tax invoices, payment acknowledgments).

---

### 4. Zero-Sale & Strict Confidentiality Guarantee
- We **NEVER** sell, rent, broker, or monetize your personal or corporate data under any circumstances.
- All intellectual assets, source code repositories, and client API keys are secured under standard Non-Disclosure Agreements (NDA).

---

### 5. Data Retention & Erasure Rights
- Inactive enquiry records may be erased upon written request to **manojsatapathy.jp@gmail.com**.
- B2B GST tax invoices, accounting vouchers, and payment receipts are retained for a statutory period of **72 months** pursuant to GST Rules.

---

### 6. Grievance Officer & Contact
- **Grievance Officer**: Manoj Satapathy (Founder & Solutions Architect)
- **Registered Office**: Dadra and Nagar Haveli and Daman and Diu, India - 396230
- **Email**: manojsatapathy.jp@gmail.com | **Phone**: +91 94084 56499`,
    jurisdiction: 'Dadra and Nagar Haveli and Daman and Diu, India',
    applicableLaw: 'Digital Personal Data Protection (DPDP) Act, 2023 & IT Act, 2000',
    createdBy: 'Manoj Satapathy',
    createdByEmail: 'manojsatapathy.jp@gmail.com',
    lastModifiedBy: 'Manoj Satapathy',
    lastModifiedByEmail: 'manojsatapathy.jp@gmail.com',
    lastModifiedByRole: 'Super Admin',
    changeSummary: 'Updated Section 1 with explicit DPDP Act 2023 compliance clauses and B2B GSTIN collection protocols.',
    versionHistoryCount: 2,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-08-16T14:30:00Z'
  },
  {
    id: 'legal_doc_terms',
    slug: 'terms-of-engagement',
    title: 'Master Terms of Engagement & Commercial Services Agreement',
    documentType: 'terms_of_engagement',
    version: 'v2.0',
    effectiveDate: '2026-07-15',
    lastUpdatedDate: '2026-08-15',
    status: 'active',
    summary: 'Standard contractual framework governing project scoping, milestone payments, intellectual property transfer, deliverables acceptance criteria, and limitation of liability.',
    content: `# Master Terms of Engagement & Commercial Services Agreement
These Terms of Engagement govern all software engineering, mobile development, cloud architecture, and technical consulting contracts delivered by **Fusion Forge Creation**.

---

### 1. Project Scoping & Formal Quotations
- Every engagement commences with an approved **Commercial Quotation** detailing the scope of deliverables, technology stack, timeline, and SAC Code **998314**.
- Any scope changes or additional feature requests outside the agreed milestone breakdown will be processed via an official written Addendum / Change Order.

---

### 2. Commercial Terms & Payment Schedule
1. **Advance Commitment**: Standard 40% initial deposit prior to architecture provisioning and sprint initiation.
2. **Milestone Disbursements**: 40% upon staging environment deployment and functional feature review.
3. **Final Settlement**: 20% balance prior to production handover, DNS domain binding, and source code transfer.
4. **Payment Windows**: All tax invoices carry Net-15 or Net-30 payment terms as specified on the invoice document.

---

### 3. Intellectual Property (IP) Transfer
- Upon receipt of 100% full and final payment of all outstanding tax invoices, **Fusion Forge Creation** transfers all proprietary custom source code, design system assets, and database schemas created exclusively for the Client.
- Reusable underlying libraries, open-source modules, and proprietary framework boilerplates remain subject to standard permissive licenses.

---

### 4. Client Staging & User Acceptance Testing (UAT)
- The Client receives a 10-business-day UAT window upon staging delivery to report functional discrepancies against the written Scope of Work.
- Acceptance is deemed ratified upon written sign-off, live deployment, or lapse of the 10-day review period without blocking issue notices.

---

### 5. Warranty & Post-Launch Support
- All custom deliverables include a **30-day complimentary bug-fix warranty** post-production rollout.
- Extended SLA maintenance, server DevOps management, and ongoing feature iterations are governed under dedicated Retainer Agreements.

---

### 6. Governing Law & Dispute Resolution
- This agreement is constructed under the laws of the Republic of India.
- Any unresolved legal dispute shall be subject to the exclusive jurisdiction of the competent courts of **Silvassa, Dadra and Nagar Haveli and Daman and Diu**.`,
    jurisdiction: 'Courts of Silvassa, Dadra and Nagar Haveli and Daman and Diu',
    applicableLaw: 'Indian Contract Act, 1872 & Information Technology Act, 2000',
    createdBy: 'Manoj Satapathy',
    createdByEmail: 'manojsatapathy.jp@gmail.com',
    lastModifiedBy: 'Manoj Satapathy',
    lastModifiedByEmail: 'manojsatapathy.jp@gmail.com',
    lastModifiedByRole: 'Super Admin',
    changeSummary: 'Standardized 3-tier milestone structure (40-40-20) and clarified 30-day post-launch warranty.',
    versionHistoryCount: 2,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-08-15T11:00:00Z'
  },
  {
    id: 'legal_doc_gst',
    slug: 'gst-compliance',
    title: 'GST Compliance, Tax Invoicing & SAC Classification Policy',
    documentType: 'gst_compliance',
    version: 'v1.4',
    effectiveDate: '2026-06-01',
    lastUpdatedDate: '2026-08-14',
    status: 'active',
    summary: 'Tax compliance charter outlining 18% GST calculation rules, intra-state (CGST+UTGST) vs inter-state (IGST) determination, SAC 998314 classification, and GSTR-1 e-filing parity.',
    content: `# GST Compliance, Tax Invoicing & SAC Classification Policy
**Fusion Forge Creation** operates as a fully registered Goods and Services Tax (GST) compliant technology enterprise in India.

---

### 1. Enterprise Tax Identification
- **Legal Trade Name**: Fusion Forge Creation
- **Registered GSTIN**: 26AALFF1234F1Z5
- **Permanent Account Number (PAN)**: AALFF1234F
- **Principal Place of Business**: Dadra and Nagar Haveli and Daman and Diu (State Code: 26)
- **Primary SAC Code**: **998314** (Information Technology Design and Development Services)

---

### 2. GST Tax Computation Matrix (18% Statutory Rate)
- **Intra-State Supply (Recipient in State Code 26 - DNH & DD)**:
  - Central GST (CGST): **9.0%**
  - UT GST (UTGST): **9.0%**
  - Total Applicable GST: **18.0%**
- **Inter-State Supply (Recipient in any other Indian State / UT, e.g., 27-Maharashtra, 24-Gujarat, 29-Karnataka, 07-Delhi)**:
  - Integrated GST (IGST): **18.0%**
- **Export of IT Services**: Zero-rated supply subject to Letter of Undertaking (LUT) under Section 16 of the IGST Act, 2017.

---

### 3. Tax Invoice Validity & Input Tax Credit (ITC)
To enable our corporate clients to seamlessly claim 100% Input Tax Credit (ITC) under GSTR-2B:
1. Valid 15-digit Client GSTIN must be provided prior to tax invoice finalization.
2. Every tax invoice contains mandatory fields: Invoice Number, Serial Date, Place of Supply (POS), SAC Code, Taxable Value, Segregated Tax Amounts, and Digital Signature / Seal.
3. Tax invoices are filed authoritatively in **GSTR-1** on or before the 11th of each calendar month.

---

### 4. Credit Notes, Debit Notes & Adjustments
- Issued strictly in compliance with Section 34 of the CGST Act, 2017 with clear reference to the original Tax Invoice Number and issuance date.
- Formatted for automatic monthly filing reconciliation in GSTR-1 Table 9B.`,
    jurisdiction: 'Dadra and Nagar Haveli and Daman and Diu (State Code 26)',
    applicableLaw: 'Central Goods and Services Tax (CGST) Act, 2017 & UTGST / IGST Acts',
    createdBy: 'Manoj Satapathy',
    createdByEmail: 'manojsatapathy.jp@gmail.com',
    lastModifiedBy: 'Manoj Satapathy',
    lastModifiedByEmail: 'manojsatapathy.jp@gmail.com',
    lastModifiedByRole: 'Super Admin',
    changeSummary: 'Verified SAC 998314 IT software classification and documented GSTR-1 Table 9B credit note filing protocols.',
    versionHistoryCount: 2,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-08-14T09:45:00Z'
  }
];

export const INITIAL_LEGAL_HISTORY: LegalDocumentHistoryItem[] = [
  {
    id: 'hist_privacy_v2_1',
    documentId: 'legal_doc_privacy',
    documentSlug: 'privacy-policy',
    version: 'v2.1',
    title: 'Privacy Policy & Data Protection Charter',
    summary: 'Comprehensive privacy policy detailing data minimization, zero-third-party tracking sale, client credential encryption, and compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
    content: INITIAL_LEGAL_DOCUMENTS[0].content,
    effectiveDate: '2026-08-01',
    status: 'active',
    changedBy: 'Manoj Satapathy',
    changedByEmail: 'manojsatapathy.jp@gmail.com',
    changedByRole: 'Super Admin',
    changeSummary: 'Updated Section 1 with explicit DPDP Act 2023 compliance clauses and B2B GSTIN collection protocols.',
    created_at: '2026-08-16T14:30:00Z'
  },
  {
    id: 'hist_privacy_v2_0',
    documentId: 'legal_doc_privacy',
    documentSlug: 'privacy-policy',
    version: 'v2.0',
    title: 'Privacy Policy & Client Data Charter',
    summary: 'Initial DPDP Act alignment and client credential security framework.',
    content: `# Privacy Policy & Client Data Charter\n**Fusion Forge Creation** ensures full data privacy and security for all business accounts.\n1. We collect only necessary contact details.\n2. We do not sell user data.\n3. We comply with Indian IT Act 2000.`,
    effectiveDate: '2026-03-01',
    status: 'archived',
    changedBy: 'Manoj Satapathy',
    changedByEmail: 'manojsatapathy.jp@gmail.com',
    changedByRole: 'Super Admin',
    changeSummary: 'Initial comprehensive revision from v1.0 standard terms.',
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 'hist_terms_v2_0',
    documentId: 'legal_doc_terms',
    documentSlug: 'terms-of-engagement',
    version: 'v2.0',
    title: 'Master Terms of Engagement & Commercial Services Agreement',
    summary: 'Standard contractual framework governing project scoping, milestone payments, intellectual property transfer, deliverables acceptance criteria, and limitation of liability.',
    content: INITIAL_LEGAL_DOCUMENTS[1].content,
    effectiveDate: '2026-07-15',
    status: 'active',
    changedBy: 'Manoj Satapathy',
    changedByEmail: 'manojsatapathy.jp@gmail.com',
    changedByRole: 'Super Admin',
    changeSummary: 'Standardized 3-tier milestone structure (40-40-20) and clarified 30-day post-launch warranty.',
    created_at: '2026-08-15T11:00:00Z'
  },
  {
    id: 'hist_terms_v1_0',
    documentId: 'legal_doc_terms',
    documentSlug: 'terms-of-engagement',
    version: 'v1.0',
    title: 'Terms of Engagement',
    summary: 'Initial terms of service and project quotation agreements.',
    content: `# Terms of Engagement (v1.0)\nInitial agency client agreement. Deliverables subject to formal invoice payment.`,
    effectiveDate: '2026-01-15',
    status: 'archived',
    changedBy: 'Manoj Satapathy',
    changedByEmail: 'manojsatapathy.jp@gmail.com',
    changedByRole: 'Super Admin',
    changeSummary: 'Initial baseline creation.',
    created_at: '2026-01-15T09:00:00Z'
  },
  {
    id: 'hist_gst_v1_4',
    documentId: 'legal_doc_gst',
    documentSlug: 'gst-compliance',
    version: 'v1.4',
    title: 'GST Compliance, Tax Invoicing & SAC Classification Policy',
    summary: 'Tax compliance charter outlining 18% GST calculation rules, intra-state (CGST+UTGST) vs inter-state (IGST) determination, SAC 998314 classification, and GSTR-1 e-filing parity.',
    content: INITIAL_LEGAL_DOCUMENTS[2].content,
    effectiveDate: '2026-06-01',
    status: 'active',
    changedBy: 'Manoj Satapathy',
    changedByEmail: 'manojsatapathy.jp@gmail.com',
    changedByRole: 'Super Admin',
    changeSummary: 'Verified SAC 998314 IT software classification and documented GSTR-1 Table 9B credit note filing protocols.',
    created_at: '2026-08-14T09:45:00Z'
  }
];

export const INITIAL_VISITOR_EVENTS: VisitorEvent[] = [];


