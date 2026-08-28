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
  VisitorEvent,
  SupplierVendor,
  UnitMasterItem,
  HsnMasterItem,
  GoodsItem
} from './types';
import { 
  DEFAULT_INVOICE_NUMBERING, 
  DEFAULT_QUOTATION_NUMBERING,
  DEFAULT_CREDIT_NOTE_NUMBERING,
  DEFAULT_DEBIT_NOTE_NUMBERING 
} from './utils/documentNumbering';

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
  { id: 'youtube', platform: 'youtube', name: 'YouTube', url: 'https://youtube.com/@fusionforgecreation', active: true, color: '#FF0000' },
  { id: 'instagram', platform: 'instagram', name: 'Instagram', url: 'https://instagram.com/fusionforgecreation', active: true, color: '#E1306C' },
  { id: 'whatsapp', platform: 'whatsapp', name: 'WhatsApp', url: '', active: false, color: '#25D366' },
  { id: 'twitter', platform: 'twitter', name: 'Twitter / X', url: 'https://twitter.com/fusionforge_dev', active: false, color: '#1DA1F2' },
  { id: 'linkedin', platform: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/fusionforgecreation', active: false, color: '#0A66C2' },
  { id: 'github', platform: 'github', name: 'GitHub', url: 'https://github.com/fusionforgecreation', active: false, color: '#6e5494' }
];

export const AGENCY_CONFIG = {
  name: 'Fusion Forge Creation',
  legalName: 'Fusion Forge Creation',
  company_name: 'Fusion Forge Creation',
  tagline: 'Where Ideas Fuse With Technology',
  motto: 'INNOVATE • BUILD • AUTOMATE • GROW',
  website_url: 'https://fusionforgecreation.com',
  website: 'https://fusionforgecreation.com',
  websiteUrl: 'https://fusionforgecreation.com',
  email: 'admin@fusionforgecreation.com',
  phone: '+91 63588 55524',
  address: 'Yogi Milan, Near Ring Road, Amli, Silvassa, Dadra & Nagar Haveli - 396230',
  city: 'Silvassa',
  state: 'Dadra and Nagar Haveli and Daman and Diu',
  state_code: '26',
  postalCode: '396230',
  gstin: '',
  pan: '',
  msme_number: '',
  msmeNumber: '',
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
  gst_compliance_active: false,
  gstComplianceActive: false,
  
  // Phase 11: LUT & SEZ Compliance Defaults
  lut_arn: '',
  lutArn: '',
  lutNumber: '',
  lut_number: '',
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
    quotation: DEFAULT_QUOTATION_NUMBERING,
    credit_note: DEFAULT_CREDIT_NOTE_NUMBERING,
    debit_note: DEFAULT_DEBIT_NOTE_NUMBERING
  },
  social_channels: INITIAL_SOCIAL_CHANNELS,
  socialChannels: INITIAL_SOCIAL_CHANNELS,
  social_links: {
    github: 'https://github.com/fusionforgecreation',
    linkedin: 'https://linkedin.com/company/fusionforgecreation',
    twitter: 'https://twitter.com/fusionforge_dev',
    instagram: 'https://instagram.com/fusionforgecreation',
    youtube: 'https://youtube.com/@fusionforgecreation',
    whatsapp: ''
  },
  socialLinks: {
    github: 'https://github.com/fusionforgecreation',
    linkedin: 'https://linkedin.com/company/fusionforgecreation',
    twitter: 'https://twitter.com/fusionforge_dev',
    instagram: 'https://instagram.com/fusionforgecreation',
    youtube: 'https://youtube.com/@fusionforgecreation',
    whatsapp: ''
  },
  bankDetails: {
    accountName: 'Fusion Forge Creation',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    upiId: ''
  },
  bank_name: '',
  account_name: 'Fusion Forge Creation',
  account_number: '',
  ifsc_code: '',
  branch_name: '',
  upi_id: '',
  upiId: '',
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
    full_name: 'Super Admin',
    name: 'Super Admin',
    email: 'admin@fusionforgecreation.com',
    role: 'super_admin',
    phone: '+91 63588 55524',
    is_active: true,
    mfa_enabled: true,
    two_factor_confirmed: false,
    two_factor_secret: '',
    two_factor_auth_type: 'google_authenticator',
    recovery_codes: ['FFC1-9824', 'FFC2-7716', 'FFC3-3490', 'FFC4-8812', 'FFC5-4921', 'FFC6-8302', 'FFC7-2195', 'FFC8-6043'],
    company: 'Fusion Forge Creation',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z'
  }
];

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_QUOTATIONS: Quotation[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_PAYMENTS: Payment[] = [];

export const INITIAL_CREDIT_DEBIT_NOTES: CreditDebitNote[] = [];

export const INITIAL_ENQUIRIES: ProjectEnquiry[] = [];

export const INITIAL_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'port_shree_krishna',
    title: 'Shree Krishna Multispecialty Hospital',
    slug: 'shree-krishna-hospital',
    clientName: 'Shree Krishna Multispecialty Hospital',
    category: 'Hospital Management Web Application',
    summary: 'Database-driven hospital management software designed to organize hospital operations, patient information, appointments, doctors, medical records, IPD workflows and administrative activities.',
    deliverables: [
      'Patient & OPD Registration',
      'Doctor & Staff Schedules',
      'Appointment Management',
      'Medical Records & History',
      'IPD Workflow & Bed Tracking',
      'Admin Dashboard & Reports'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL / Supabase'],
    bannerGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    featured: true
  },
  {
    id: 'port_chaudhary_medical',
    title: 'Chaudhary Medical / Retail Management System',
    slug: 'chaudhary-medical-retail',
    clientName: 'Chaudhary Medical & Retail',
    category: 'Medical & Retail Management Software',
    summary: 'Business management software designed for medical and retail operations, including inventory, billing, products, purchases, sales and administrative management.',
    deliverables: [
      'Medicine & Product Inventory',
      'Stock Management & Reorders',
      'Point-of-Sale (POS) Billing',
      'Purchases & Vendor Records',
      'Customer Ledger & Invoicing',
      'Sales & Profit Reports'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    bannerGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    featured: true
  },
  {
    id: 'port_mh_engineering',
    title: 'M H ENGINEERING WORKS',
    slug: 'mh-engineering-works',
    clientName: 'M H Engineering Works',
    category: 'Business Website & Enquiry Management',
    summary: 'Professional business website developed for a mechanical fabrication and erection contractor, including company information, services, contact enquiry and administrative management.',
    deliverables: [
      'Company Profile & Capability Desk',
      'Fabrication & Erection Showcase',
      'Project Enquiry & Lead Capture',
      'Responsive Mobile & Desktop Layout',
      'Admin Management Dashboard'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    bannerGradient: 'from-amber-700 via-orange-800 to-slate-900',
    featured: true
  },
  {
    id: 'port_fusion_forge',
    title: 'Fusion Forge Creation',
    slug: 'fusion-forge-creation-platform',
    clientName: 'Fusion Forge Creation',
    category: 'Business & Agency Management Platform',
    summary: 'Our own digital platform for managing enquiries, clients, projects, quotations, invoices, payments and website content.',
    deliverables: [
      'Client & Lead Enquiry CRM',
      'Quotation & Formal Scope Generator',
      'GST Tax Invoicing & Receipt Ledger',
      'Project Milestone Monitoring',
      'Content & Legal Docs Management',
      'Centralized Admin Portal'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase / PostgreSQL', 'Node.js'],
    bannerGradient: 'from-purple-700 via-indigo-900 to-slate-950',
    featured: true
  }
];

export const INITIAL_SERVICES = [
  {
    id: 'srv_1',
    title: 'Business Websites',
    category: 'Web Development',
    description: 'Professional, responsive websites for companies, contractors, businesses and organizations.',
    startingPrice: 35000,
    sacCode: '998314',
    deliverables: ['Custom Company Branding', 'Responsive Layout (Desktop & Mobile)', 'Enquiry & Contact Forms', 'Fast Page Performance'],
    active: true,
    featured: true
  },
  {
    id: 'srv_2',
    title: 'Business Web Applications',
    category: 'Web Applications',
    description: 'Custom web applications designed around your business processes, workflows and requirements.',
    startingPrice: 65000,
    sacCode: '998314',
    deliverables: ['Tailored Workflow Logic', 'User Authentication & Roles', 'Interactive Data Management', 'Modern React & TypeScript Architecture'],
    active: true,
    featured: true
  },
  {
    id: 'srv_3',
    title: 'Management Systems',
    category: 'Software Systems',
    description: 'Database-driven software for managing customers, products, employees, projects, records and daily operations.',
    startingPrice: 85000,
    sacCode: '998314',
    deliverables: ['Customer & Client Management', 'Operational Records & History', 'Employee / Staff Tracking', 'Organized Day-to-Day Operations'],
    active: true,
    featured: true
  },
  {
    id: 'srv_4',
    title: 'Admin Panels & Dashboards',
    category: 'Dashboards',
    description: 'Centralized dashboards for managing business information, users, enquiries, products, projects, reports and other operational data.',
    startingPrice: 50000,
    sacCode: '998314',
    deliverables: ['Centralized Administration', 'Live Data Tables & Filtering', 'Enquiry & Lead Tracking', 'Role-Based Access Controls'],
    active: true,
    featured: true
  },
  {
    id: 'srv_5',
    title: 'Billing & Inventory Software',
    category: 'Business Software',
    description: 'Business software for billing, quotations, invoices, inventory, purchases, sales, payments and stock management.',
    startingPrice: 55000,
    sacCode: '998314',
    deliverables: ['Quotation & Invoice Generation', 'Stock & Inventory Tracking', 'Purchase & Sales Records', 'Payment Status Tracking'],
    active: true,
    featured: true
  },
  {
    id: 'srv_6',
    title: 'Database & Business Data Systems',
    category: 'Databases',
    description: 'Structured database-driven applications for storing, managing, searching and reporting business information.',
    startingPrice: 45000,
    sacCode: '998314',
    deliverables: ['Structured PostgreSQL Database', 'Reliable Data Storage & Backups', 'Search & Filtering Capabilities', 'Data Export & Reporting'],
    active: true,
    featured: true
  },
  {
    id: 'srv_7',
    title: 'Custom Business Automation',
    category: 'Automation',
    description: 'Digital workflows designed to reduce repetitive manual work and organize business processes.',
    startingPrice: 40000,
    sacCode: '998314',
    deliverables: ['Automated Notifications & Logs', 'Streamlined Workflows', 'Reduction in Manual Data Entry', 'Structured Task Routing'],
    active: true,
    featured: false
  },
  {
    id: 'srv_8',
    title: 'Existing Software Modification',
    category: 'Maintenance',
    description: 'Feature improvements, corrections and modifications for existing web applications where the source code and technology permit.',
    startingPrice: 30000,
    sacCode: '998314',
    deliverables: ['Codebase Review & Analysis', 'Bug Fixes & Feature Additions', 'UI/UX Improvements', 'Database Adjustments'],
    active: true,
    featured: false
  }
];

export const INITIAL_MANAGED_PROJECTS: ManagedProject[] = [];

export const INITIAL_COMPLETED_WORKS: CompletedWorkRecord[] = [];

export const INITIAL_TECHNOLOGIES = [
  {
    id: 'tech_1',
    name: 'React',
    category: 'Frontend' as const,
    description: 'Component-based user interfaces for modern web applications',
    proficiency: 95,
    isFeatured: true
  },
  {
    id: 'tech_2',
    name: 'TypeScript',
    category: 'Frontend' as const,
    description: 'Type-safe JavaScript for reliable application logic',
    proficiency: 95,
    isFeatured: true
  },
  {
    id: 'tech_3',
    name: 'JavaScript / HTML / CSS',
    category: 'Frontend' as const,
    description: 'Standard web development core technologies',
    proficiency: 98,
    isFeatured: true
  },
  {
    id: 'tech_4',
    name: 'Tailwind CSS',
    category: 'Frontend' as const,
    description: 'Responsive, clean utility-first interface styling',
    proficiency: 95,
    isFeatured: true
  },
  {
    id: 'tech_5',
    name: 'Vite',
    category: 'Frontend' as const,
    description: 'Fast modern frontend build tool and dev environment',
    proficiency: 92,
    isFeatured: true
  },
  {
    id: 'tech_6',
    name: 'Node.js',
    category: 'Backend' as const,
    description: 'Server-side JavaScript runtime for application logic',
    proficiency: 92,
    isFeatured: true
  },
  {
    id: 'tech_7',
    name: 'REST APIs',
    category: 'Backend' as const,
    description: 'Clean, structured API endpoints for client-server communication',
    proficiency: 94,
    isFeatured: true
  },
  {
    id: 'tech_8',
    name: 'PostgreSQL',
    category: 'Database' as const,
    description: 'Reliable, relational database system for structured business records',
    proficiency: 95,
    isFeatured: true
  },
  {
    id: 'tech_9',
    name: 'Supabase',
    category: 'Database' as const,
    description: 'PostgreSQL backend with built-in authentication and data storage',
    proficiency: 94,
    isFeatured: true
  },
  {
    id: 'tech_10',
    name: 'SQL & Database Design',
    category: 'Database' as const,
    description: 'Relational data modeling, queries, schemas and indexes',
    proficiency: 95,
    isFeatured: true
  },
  {
    id: 'tech_11',
    name: 'GitHub',
    category: 'Deployment & Tools' as const,
    description: 'Version control and source code management',
    proficiency: 90,
    isFeatured: true
  },
  {
    id: 'tech_12',
    name: 'Hostinger / Cloud Hosting',
    category: 'Deployment & Tools' as const,
    description: 'Website, domain, mailbox and application deployment',
    proficiency: 92,
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
    question: 'What type of software does Fusion Forge Creation develop?',
    answer: 'We develop custom business websites, web applications, management systems, admin panels and database-driven software according to individual business requirements.',
    category: 'General' as const,
    order: 1,
    isPublished: true
  },
  {
    id: 'faq_2',
    question: 'Can you develop software for different types of businesses?',
    answer: 'Yes. We can develop custom solutions around different business workflows. Our development work includes examples such as hospital management, medical and retail management, industrial business websites and agency management.',
    category: 'General' as const,
    order: 2,
    isPublished: true
  },
  {
    id: 'faq_3',
    question: 'Can you build an admin panel?',
    answer: 'Yes. Admin panels can be developed to manage enquiries, customers, products, projects, users, reports and other business information.',
    category: 'Capabilities' as const,
    order: 3,
    isPublished: true
  },
  {
    id: 'faq_4',
    question: 'Can you modify existing software?',
    answer: 'Yes. We can analyse an existing web application and work on feature modifications, improvements and corrections where the existing source code and technology allow.',
    category: 'Capabilities' as const,
    order: 4,
    isPublished: true
  },
  {
    id: 'faq_5',
    question: 'Can you develop database-driven applications?',
    answer: 'Yes. We develop applications that use structured databases to store and manage business information.',
    category: 'Technical' as const,
    order: 5,
    isPublished: true
  },
  {
    id: 'faq_6',
    question: 'Do you develop billing and inventory software?',
    answer: 'Yes. Custom billing, quotation, invoice, inventory, purchase, sales and stock-management functionality can be developed according to business requirements.',
    category: 'Capabilities' as const,
    order: 6,
    isPublished: true
  },
  {
    id: 'faq_7',
    question: 'Can you deploy the website or application?',
    answer: 'We can assist with deployment and configuration on supported hosting and application platforms.',
    category: 'Deployment' as const,
    order: 7,
    isPublished: true
  },
  {
    id: 'faq_8',
    question: 'Do you provide maintenance and modifications?',
    answer: 'Yes. Post-development support, maintenance and additional feature development can be discussed according to the project requirements.',
    category: 'Support' as const,
    order: 8,
    isPublished: true
  },
  {
    id: 'faq_9',
    question: 'How is the project cost decided?',
    answer: 'Project cost depends on the required features, workflow, design, database requirements, integrations and development effort. We review the requirements before providing a quotation.',
    category: 'Pricing' as const,
    order: 9,
    isPublished: true
  },
  {
    id: 'faq_10',
    question: 'Do you develop mobile applications?',
    answer: 'Mobile application development is not currently offered as a standard Fusion Forge Creation service. Our current focus is on responsive websites, web applications and business management software that can be accessed through modern web browsers.',
    category: 'General' as const,
    order: 10,
    isPublished: true
  }
];

export const INITIAL_CHATBOT_SETTINGS: ChatbotSettings = {
  botName: 'Forge Assistant',
  botSubtitle: 'Fusion Forge Information Desk',
  avatarUrl: '',
  welcomeMessage: 'Hello! 👋 Welcome to Fusion Forge Creation. Ask me about our web development services, business software solutions, tech stack, or how to get in touch!',
  fallbackMessage: 'I am here to assist with general information about our web and software development services. You can also submit a project enquiry directly to discuss your requirements.',
  quickPrompts: [
    'What services do you offer?',
    'What types of software do you build?',
    'What is your tech stack?',
    'Can you build an admin panel or management system?',
    'How do I discuss a project?'
  ],
  enableBot: true,
  contactEmail: '',
  contactPhone: ''
};

export const INITIAL_CHATBOT_QA: ChatbotQAItem[] = [
  {
    id: 'cqa_1',
    question: 'What core services does Fusion Forge Creation provide?',
    answer: 'We develop custom business websites, web applications, management systems, admin panels, billing & inventory software, and database solutions tailored to business requirements.',
    category: 'Services',
    keywords: ['service', 'services', 'offer', 'build', 'develop', 'what do you do', 'solutions', 'websites', 'applications'],
    suggestedFollowUps: ['What types of software do you build?', 'What tech stack do you use?', 'View Projects'],
    actionLink: '#services',
    actionLabel: 'View What We Build',
    isActive: true,
    orderIndex: 1,
    matchCount: 142
  },
  {
    id: 'cqa_2',
    question: 'What types of software do you build?',
    answer: 'We build practical business software including:\n• Business Websites\n• Custom Web Applications\n• Management Systems (e.g. Hospital, Medical / Retail)\n• Admin Panels & Dashboards\n• Billing & Inventory Systems\n• Database-driven Business Systems\n• Existing Software Modifications',
    category: 'Services',
    keywords: ['types', 'software', 'management', 'hospital', 'retail', 'billing', 'inventory', 'admin panel', 'dashboard'],
    suggestedFollowUps: ['View Projects', 'How do I discuss a project?'],
    actionLink: '#projects',
    actionLabel: 'View Solutions We Have Built',
    isActive: true,
    orderIndex: 2,
    matchCount: 195
  },
  {
    id: 'cqa_3',
    question: 'What technologies do you work with?',
    answer: 'Our realistic technology stack includes:\n• Frontend: React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Vite\n• Backend: Node.js, REST APIs, Application Logic\n• Database: PostgreSQL, Supabase, SQL\n• Deployment: GitHub, Hostinger, Netlify, Supabase',
    category: 'Tech Stack',
    keywords: ['tech', 'technology', 'stack', 'languages', 'react', 'typescript', 'node', 'postgres', 'supabase', 'database', 'sql'],
    suggestedFollowUps: ['View What We Build', 'View Projects'],
    actionLink: '#tech-stack',
    actionLabel: 'View Technologies',
    isActive: true,
    orderIndex: 3,
    matchCount: 95
  },
  {
    id: 'cqa_4',
    question: 'How do I submit a project enquiry or discuss requirements?',
    answer: 'You can submit your requirements directly through our Project Scope form on this website. We review every enquiry and get in touch to discuss your specific workflow and technical needs.',
    category: 'Enquiries',
    keywords: ['contact', 'quote', 'quotation', 'enquiry', 'hire', 'start project', 'discuss', 'requirement', 'form'],
    suggestedFollowUps: ['What services do you offer?', 'View Projects'],
    actionLink: '#contact',
    actionLabel: 'Open Project Scope Form',
    isActive: true,
    orderIndex: 4,
    matchCount: 168
  },
  {
    id: 'cqa_5',
    question: 'Can you build custom management systems and admin panels?',
    answer: 'Yes! We specialize in database-driven management systems and centralized admin dashboards for organizing customers, products, appointments, records, staff, and day-to-day operations.',
    category: 'Capabilities',
    keywords: ['admin', 'panel', 'dashboard', 'management system', 'crm', 'erp', 'portal'],
    suggestedFollowUps: ['View Projects', 'Discuss Your Project'],
    actionLink: '#projects',
    actionLabel: 'View Example Management Systems',
    isActive: true,
    orderIndex: 5,
    matchCount: 88
  },
  {
    id: 'cqa_6',
    question: 'Do you develop mobile applications?',
    answer: 'Mobile application development (native iOS/Android apps) is not currently offered as a standard service. Our focus is on responsive websites, web applications and management systems that work seamlessly across desktop, tablet and mobile browsers.',
    category: 'Services',
    keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'play store', 'app store'],
    suggestedFollowUps: ['What services do you offer?', 'View What We Build'],
    actionLink: '#services',
    actionLabel: 'View Web Services',
    isActive: true,
    orderIndex: 6,
    matchCount: 74
  },
  {
    id: 'cqa_7',
    question: 'Can you modify or improve existing web applications?',
    answer: 'Yes. We can review existing web applications and implement feature improvements, corrections, and modifications where the source code and technology stack permit.',
    category: 'Capabilities',
    keywords: ['modify', 'existing', 'improve', 'update', 'fix', 'codebase', 'legacy'],
    suggestedFollowUps: ['Discuss Your Project', 'What services do you offer?'],
    actionLink: '#contact',
    actionLabel: 'Discuss Software Modification',
    isActive: true,
    orderIndex: 7,
    matchCount: 62
  }
];

// =============================================================================
// PHASE 10: GST UNIT MASTER (UOM / UQC STATUTORY CODES)
// =============================================================================
export const INITIAL_UNITS: UnitMasterItem[] = [
  {
    id: 'unit_nos',
    code: 'NOS',
    name: 'Numbers',
    uqc: 'NOS-NUMBERS',
    symbol: 'nos',
    decimalPlaces: 0,
    isDefault: true,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_pcs',
    code: 'PCS',
    name: 'Pieces',
    uqc: 'PCS-PIECES',
    symbol: 'pcs',
    decimalPlaces: 0,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_box',
    code: 'BOX',
    name: 'Boxes',
    uqc: 'BOX-BOX',
    symbol: 'box',
    decimalPlaces: 0,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_set',
    code: 'SET',
    name: 'Sets',
    uqc: 'SET-SETS',
    symbol: 'set',
    decimalPlaces: 0,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_hrs',
    code: 'HRS',
    name: 'Hours',
    uqc: 'HRS-HOURS',
    symbol: 'hrs',
    decimalPlaces: 2,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_day',
    code: 'DAY',
    name: 'Days',
    uqc: 'DAY-DAYS',
    symbol: 'day',
    decimalPlaces: 1,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_mon',
    code: 'MON',
    name: 'Months',
    uqc: 'MON-MONTHS',
    symbol: 'mo',
    decimalPlaces: 0,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_mtr',
    code: 'MTR',
    name: 'Meters',
    uqc: 'MTR-METERS',
    symbol: 'm',
    decimalPlaces: 2,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_kgs',
    code: 'KGS',
    name: 'Kilograms',
    uqc: 'KGS-KILOGRAMS',
    symbol: 'kg',
    decimalPlaces: 3,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_sqf',
    code: 'SQF',
    name: 'Square Feet',
    uqc: 'SQF-SQUARE FEET',
    symbol: 'sq.ft',
    decimalPlaces: 2,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'unit_oth',
    code: 'OTH',
    name: 'Others',
    uqc: 'OTH-OTHERS',
    symbol: 'oth',
    decimalPlaces: 0,
    isDefault: false,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  }
];

// =============================================================================
// PHASE 10: HSN / SAC MASTER (TAX RATES & CGST/SGST/IGST SCHEDULE)
// =============================================================================
export const INITIAL_HSN_CODES: HsnMasterItem[] = [
  {
    id: 'hsn_sac_998313',
    code: '998313',
    description: 'Information technology (IT) infrastructure and network management services',
    type: 'services_sac',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Input Services',
    defaultUnit: 'MON',
    notes: 'Cloud hosting, VPS clusters, Kubernetes managed clusters and CDN subscriptions',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_sac_998314',
    code: '998314',
    description: 'Information technology (IT) design and development services',
    type: 'services_sac',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Input Services',
    defaultUnit: 'HRS',
    notes: 'Software coding, architecture, UI/UX design deliverables, API development',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_sac_998315',
    code: '998315',
    description: 'Hosting and information technology (IT) infrastructure provisioning services',
    type: 'services_sac',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Input Services',
    defaultUnit: 'MON',
    notes: 'Domain names, DNS managers, SSL certificates, load balancers',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_sac_998413',
    code: '998413',
    description: 'Telecommunications and broadband internet access services',
    type: 'services_sac',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Input Services',
    defaultUnit: 'MON',
    notes: 'Dedicated leased line internet, office fiber broadband connections',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_847130',
    code: '847130',
    description: 'Laptops, notebooks, and portable digital automatic data processing machines',
    type: 'goods_hsn',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Capital Goods',
    defaultUnit: 'NOS',
    notes: 'High-performance engineering laptops (MacBook, Dell Precision, ThinkPad)',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_847170',
    code: '847170',
    description: 'Storage units, NVMe SSDs, hard disk drives, removable flash storage',
    type: 'goods_hsn',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Inputs',
    defaultUnit: 'NOS',
    notes: 'Server SSD arrays, high-speed backup external drives',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_851762',
    code: '851762',
    description: 'Machines for reception, conversion and transmission of data; switches, routers, modems',
    type: 'goods_hsn',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Capital Goods',
    defaultUnit: 'NOS',
    notes: 'Gigabit Managed Switches, Wi-Fi 6 Routers, Hardware Firewalls',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_852852',
    code: '852852',
    description: 'Monitors and display units capable of connecting to automatic data processing systems',
    type: 'goods_hsn',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Capital Goods',
    defaultUnit: 'NOS',
    notes: '27-inch 4K IPS Developer Displays, Ultrawide dual-input monitors',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_482010',
    code: '482010',
    description: 'Registers, account books, note books, order books, receipt books, letter pads',
    type: 'goods_hsn',
    gstRate: 12,
    cgstRate: 6,
    sgstRate: 6,
    igstRate: 12,
    cessRate: 0,
    itcEligibility: 'Inputs',
    defaultUnit: 'PAC',
    notes: 'Office registers, carbon copy receipt pads, printer paper packs',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  },
  {
    id: 'hsn_998221',
    code: '998221',
    description: 'Financial auditing, tax compliance and accounting retainer services',
    type: 'services_sac',
    gstRate: 18,
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    cessRate: 0,
    itcEligibility: 'Input Services',
    defaultUnit: 'MON',
    notes: 'Chartered Accountant audits, GST filing and corporate compliance advisory',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-08-16T00:00:00Z'
  }
];

// =============================================================================
// PHASE 10: SUPPLIER / VENDOR MASTER
// =============================================================================
export const INITIAL_SUPPLIERS: SupplierVendor[] = [];

// =============================================================================
// PHASE 10: GOODS & ITEMS MASTER FOR PURCHASES
// =============================================================================
export const INITIAL_GOODS_ITEMS: GoodsItem[] = [];

// =============================================================================
// PHASE 10: INITIAL PURCHASES (B2B VENDORS & SUPPLIER INVOICES WITH ATTACHMENTS)
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

export { INSFORGE_PRODUCTION_SCHEMA_V2, INSFORGE_SQL_SCHEMA } from './data/insforgeSql';

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
    title: 'Privacy Policy',
    documentType: 'privacy_policy',
    version: 'v3.0',
    effectiveDate: '2026-08-25',
    lastUpdatedDate: '2026-08-25',
    status: 'active',
    summary: 'Official Privacy Policy of Fusion Forge Creation explaining our practices on collecting, using, storing, and protecting visitor, client, project enquiry, business, account, and technical information.',
    content: `# PRIVACY POLICY

**Last Updated:** 25 August 2026

## 1. Introduction

Fusion Forge Creation ("Fusion Forge Creation", "we", "us", or "our") respects the privacy of visitors, prospective customers, customers and users of our website and services.

This Privacy Policy explains how we collect, use, store and protect information when you visit our website, submit an enquiry, communicate with us, or use services and web applications provided by Fusion Forge Creation.

By using our website or voluntarily providing information to us, you acknowledge the practices described in this Privacy Policy.

---

## 2. About Fusion Forge Creation

**Fusion Forge Creation** provides website development, web application development, business software development, database-driven applications, management systems, admin panels, billing and inventory software, custom business automation and related technical services.

Our current business contact details are:

**Fusion Forge Creation**
Yogi Milan,
Near Ring Road, Amli,
Silvassa, Dadra & Nagar Haveli – 396230, India

**Phone:** +91 63588 55524

**Email:** [admin@fusionforgecreation.com](mailto:admin@fusionforgecreation.com)

---

## 3. Information We May Collect

Depending on how you interact with our website or services, we may collect information such as:

### 3.1 Contact Information

* Name
* Email address
* Telephone/mobile number
* Company or organization name
* Business address
* Other contact information voluntarily provided by you

### 3.2 Project Information

When you submit a project enquiry, we may collect:

* Type of service required
* Estimated budget range
* Project requirements
* Business requirements
* Preferred features
* Technical requirements
* Other information voluntarily provided in the enquiry

### 3.3 Business Information

If required for a project, quotation, invoice or business relationship, we may collect information such as:

* Company information
* Billing information
* Tax-related information voluntarily provided by the customer
* Project information
* Purchase or service details
* Payment-related information necessary for accounting or transaction processing

### 3.4 Account Information

Where a project or application provides user accounts, we may collect information necessary to create and manage those accounts, including:

* Name
* Email address
* Login information
* User role
* Account status

Passwords should be stored using appropriate security mechanisms and should not be knowingly stored or displayed in plain text.

### 3.5 Technical Information

Our website or services may automatically receive limited technical information such as:

* IP address
* Browser type
* Device type
* Operating system
* Pages visited
* Approximate usage information
* Error or diagnostic information

The exact information collected depends on the technologies and services used by the website.

---

## 4. How We Use Information

We may use collected information for legitimate business and operational purposes, including:

* Responding to enquiries
* Understanding project requirements
* Preparing quotations and proposals
* Communicating with prospective customers
* Providing requested services
* Managing customer relationships
* Developing and maintaining software
* Providing technical support
* Managing accounts and application access
* Processing invoices and payments
* Maintaining business records
* Improving our website and services
* Detecting security problems or misuse
* Meeting applicable legal or regulatory obligations

We do not collect information for purposes unrelated to the services or business activities described in this Policy unless permitted or required by applicable law.

---

## 5. Project Enquiry Information

When you submit an enquiry through our website, the information you provide may be stored in our business management system so that we can:

* Review your requirements
* Contact you
* Track the enquiry
* Prepare a quotation
* Follow up on the project
* Convert the enquiry into a customer/project where applicable

Providing accurate information helps us understand your requirements and respond appropriately.

---

## 6. Communication

If you provide your contact details through our enquiry or contact forms, we may contact you regarding:

* Your enquiry
* Project requirements
* Quotations
* Project discussions
* Technical matters
* Service-related communication
* Existing customer support

We do not intend to use project enquiry information for unrelated promotional purposes without an appropriate basis or permission.

---

## 7. Cookies and Similar Technologies

Our website may use cookies or similar technologies for purposes such as:

* Maintaining website functionality
* Remembering certain preferences
* Authentication where applicable
* Security
* Website analytics
* Improving user experience

The use of cookies may depend on the services and third-party technologies integrated with the website.

You may be able to control cookies through your browser settings. Disabling certain cookies may affect some website functionality.

---

## 8. Third-Party Services

Our website and software projects may use third-party technology providers for services such as:

* Hosting
* Database services
* Authentication
* Email delivery
* Analytics
* Payment processing
* Website deployment
* Cloud infrastructure
* Communication

Examples may include hosting, database or application service providers selected for a particular project.

Third-party providers may process information according to their own privacy policies and terms.

Fusion Forge Creation does not control the privacy practices of independent third-party providers.

---

## 9. Payment Information

Where payments are made for our services, payment information may be processed through the applicable payment method or service provider.

We do not intend to unnecessarily store sensitive payment credentials such as complete card numbers, CVV numbers or banking passwords on our website.

Customers should provide payment information only through appropriate and authorized payment channels.

---

## 10. Protection of Information

We take reasonable technical and organizational measures to protect information against unauthorized access, misuse, alteration, disclosure or loss.

Depending on the nature of the information and the system involved, safeguards may include:

* Authentication
* Access controls
* Database security
* Secure communication
* Role-based permissions
* Server-side protection
* Backup and recovery procedures

However, no internet-based system can be guaranteed to be completely secure.

Therefore, we cannot guarantee absolute security of information transmitted over the internet.

---

## 11. Confidential Project Information

During software development, customers may provide confidential business information, documents, workflows, credentials or technical information.

We will use such information only as reasonably necessary to understand, develop, maintain or support the relevant project, subject to the applicable agreement with the customer.

Customers should not provide unnecessary passwords, secret keys or other sensitive credentials through ordinary website enquiry forms.

Where credentials are required for technical work, they should be provided through an appropriate secure method.

---

## 12. Data Retention

We may retain information for as long as reasonably necessary for:

* Providing services
* Managing customer relationships
* Maintaining project records
* Accounting and invoicing
* Legal or regulatory requirements
* Resolving disputes
* Security and fraud prevention
* Legitimate business purposes

The retention period may vary depending on the nature of the information.

When information is no longer reasonably required, we may delete, anonymize or securely dispose of it, subject to applicable legal obligations.

---

## 13. Data Sharing

We do not intend to sell personal information as a commercial product.

Information may be shared with appropriate parties where reasonably necessary for:

* Providing requested services
* Hosting and operating applications
* Sending requested communications
* Processing payments
* Providing technical services
* Maintaining infrastructure
* Meeting legal requirements
* Protecting rights, property or security

Where third-party service providers are involved, they may process information on their own systems according to their applicable terms and privacy policies.

---

## 14. Legal Disclosure

We may disclose information where we reasonably believe disclosure is necessary to:

* Comply with applicable law
* Respond to lawful requests
* Protect our rights or property
* Prevent fraud or misuse
* Protect the security of users or systems
* Investigate unlawful activity

---

## 15. Children's Privacy

Our website and services are primarily intended for businesses, organizations and adult users.

We do not knowingly request personal information from children for independent use of our business services.

If a parent or guardian believes that a child has provided personal information to us unnecessarily, they may contact us so that the matter can be reviewed.

---

## 16. External Links

Our website may contain links to external websites or services.

Fusion Forge Creation is not responsible for the privacy practices, content or security of third-party websites.

Users should review the privacy policies of external services before providing information to them.

---

## 17. Your Rights and Requests

Subject to applicable law, you may contact us to request information regarding personal data that we hold about you.

Depending on the circumstances and applicable legal requirements, you may request:

* Access to relevant personal information
* Correction of inaccurate information
* Deletion of information where legally permissible
* Clarification regarding the use of your information
* Withdrawal of certain permissions where applicable

Requests should be sent to:

**[admin@fusionforgecreation.com](mailto:admin@fusionforgecreation.com)**

We may need to verify the identity of the person making a request before processing it.

---

## 18. Accuracy of Information

You are responsible for providing reasonably accurate information when submitting an enquiry, creating an account or entering into a business relationship with Fusion Forge Creation.

If your information changes, you may contact us to request an update where appropriate.

---

## 19. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect:

* Changes in our services
* Changes in technology
* Changes in legal requirements
* Changes in website functionality
* Changes in our data practices

The updated version will be published on this page with a revised "Last Updated" date.

---

## 20. Contact Us

For privacy-related questions, requests or concerns, contact:

**Fusion Forge Creation**

**Email:** [admin@fusionforgecreation.com](mailto:admin@fusionforgecreation.com)  
**Phone:** +91 63588 55524

**Address:**  
Yogi Milan,  
Near Ring Road, Amli,  
Silvassa, Dadra & Nagar Haveli – 396230, India

---

## 21. Important Notice

This Privacy Policy is intended to explain our general information-handling practices for the website and related services.

For specific software projects, customers may have additional contractual, confidentiality, security or data-processing requirements. Such requirements may be addressed separately in the applicable project agreement, quotation, service agreement or other written documentation.`,
    jurisdiction: 'Dadra & Nagar Haveli, India',
    applicableLaw: 'Information Technology Act, 2000 & DPDP Act, 2023',
    createdBy: 'Fusion Forge Creation',
    createdByEmail: 'admin@fusionforgecreation.com',
    lastModifiedBy: 'Fusion Forge Creation',
    lastModifiedByEmail: 'admin@fusionforgecreation.com',
    lastModifiedByRole: 'Admin',
    changeSummary: 'Published comprehensive 21-section Privacy Policy covering project enquiries, business information handling, security safeguards, and data rights as of 25 August 2026.',
    versionHistoryCount: 3,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z'
  },
  {
    id: 'legal_doc_terms',
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    documentType: 'terms_of_engagement',
    version: 'v3.0',
    effectiveDate: '2026-08-25',
    lastUpdatedDate: '2026-08-25',
    status: 'active',
    summary: 'Official Terms & Conditions governing website use, enquiries, quotations, custom software development, third-party services, intellectual property, payments, and client responsibilities.',
    content: `# TERMS & CONDITIONS

**Last Updated:** 25 August 2026

## 1. Introduction

These Terms & Conditions ("Terms") govern the use of the Fusion Forge Creation website and provide general terms relating to enquiries, quotations, software development services and related business interactions.

By using this website or engaging Fusion Forge Creation for services, you acknowledge that you have read and understood these Terms.

For a specific software project, the final scope, price, timelines, deliverables and other obligations may be defined separately in a quotation, proposal, work order, service agreement or other written agreement.

Where a signed or otherwise accepted project agreement contains terms that specifically apply to a project, those project-specific terms will govern that project to the extent of any inconsistency.

---

## 2. About Fusion Forge Creation

**Fusion Forge Creation** provides services including:

* Business website development
* Web application development
* Business management software
* Admin panels and dashboards
* Database-driven applications
* Billing and invoice software
* Inventory and retail management systems
* Custom business automation
* Existing software modifications
* Deployment assistance
* Technical maintenance and support

Mobile application development is not currently offered as a standard Fusion Forge Creation service.

---

## 3. Website Use

You may use this website for legitimate purposes, including:

* Learning about our services
* Reviewing our projects
* Contacting us
* Submitting a project enquiry
* Requesting information or a quotation

You must not use the website to:

* Conduct unlawful activity
* Attempt unauthorized access
* Interfere with website operation
* Introduce malicious software
* Abuse enquiry forms
* Submit fraudulent information
* Attempt to access another user's account
* Copy or misuse protected website content
* Attack or disrupt our servers, applications or services

We reserve the right to restrict access where misuse or suspicious activity is identified.

---

## 4. Project Enquiries

Submitting an enquiry through our website does not create a contract between you and Fusion Forge Creation.

An enquiry allows us to understand your requirements and determine whether we can provide the requested service.

We may contact you to obtain additional information before preparing a quotation or proposal.

---

## 5. Target Service Category and Budget

The project enquiry form may request:

* Target Service Category
* Estimated Budget Range
* Project requirements
* Other business information

The estimated budget range is collected for preliminary project understanding and planning.

It is not a final quotation or binding price.

The final project price depends on the agreed scope, features, complexity, integrations, development requirements and other project-specific factors.

---

## 6. Quotations and Proposals

Any quotation or proposal issued by Fusion Forge Creation may include:

* Project scope
* Features
* Deliverables
* Development charges
* Hosting or third-party charges where applicable
* Estimated timeline
* Payment schedule
* Support terms
* Other project conditions

A quotation is not a final contract until it is accepted according to the stated acceptance method.

Unless otherwise stated, quotations may have a specified validity period.

---

## 7. Project Scope

Software development will be performed according to the agreed project scope.

Features that are not included in the agreed scope may require:

* Additional development
* Additional charges
* Additional time
* A separate quotation or change request

Requests made after approval of the original scope may therefore be treated as change requests.

---

## 8. Requirements Provided by the Customer

The customer is responsible for providing reasonably accurate and complete project requirements, business rules, content and information necessary for development.

Delays in receiving required information, approvals, content, credentials or decisions may affect project timelines.

Where requirements change substantially during development, the project scope and timeline may need to be reviewed.

---

## 9. Software Development

Fusion Forge Creation develops software according to agreed requirements and the technologies selected for the particular project.

Depending on the project, software may include:

* Frontend applications
* Backend services
* Databases
* Authentication
* Admin panels
* Reports
* APIs
* Business workflows
* Third-party integrations

The exact features and technologies will depend on the agreed project scope.

We do not guarantee that every technology or integration requested by a customer will be technically or commercially suitable.

---

## 10. Third-Party Services

Projects may depend on third-party services such as:

* Hosting providers
* Domain providers
* Database platforms
* Email providers
* Payment gateways
* Authentication providers
* Cloud services
* APIs
* Software libraries

Third-party service availability, pricing, policies and technical limitations are outside our direct control.

Customers may be required to maintain their own third-party accounts and subscriptions where applicable.

Third-party charges are generally separate from Fusion Forge Creation development charges unless explicitly included in the quotation.

---

## 11. Hosting and Domain Services

Where Fusion Forge Creation assists with hosting or deployment, the specific hosting provider and service arrangement will depend on the project.

Hosting, domain registration, SSL certificates, email services and other third-party services may have separate charges and renewal requirements.

We are not responsible for service interruptions caused solely by third-party providers.

---

## 12. Development Timeline

Estimated project timelines are based on the agreed scope and information available at the time of estimation.

Timelines may change because of:

* Scope changes
* Delayed approvals
* Delayed customer feedback
* Missing content
* Third-party service problems
* Technical dependencies
* Unforeseen development issues
* Changes requested by the customer

Unless a project agreement specifically states otherwise, an estimated timeline should not be treated as an unconditional delivery guarantee.

---

## 13. Testing and Acceptance

Before final delivery, reasonable testing may be performed according to the agreed project scope.

Customers should review the delivered software and report material issues related to the agreed scope.

Issues caused by:

* New requirements
* Customer modifications
* Third-party changes
* Unsupported environments
* Incorrect customer configuration
* Unauthorized code modifications

may be treated separately from defects in the originally agreed implementation.

---

## 14. Payments

Payment terms will be specified in the applicable quotation, proposal or project agreement.

Depending on the project, payments may be structured around:

* Project initiation
* Development milestones
* Testing
* Final delivery

The exact payment schedule will be agreed before or during project commencement.

Work may be paused where agreed payments remain overdue.

---

## 15. Taxes and Government Charges

Applicable taxes, duties or government charges, if any, will be handled according to the applicable legal requirements and the terms stated in the relevant quotation or invoice.

Fusion Forge Creation does not represent itself as a tax advisor.

Customers remain responsible for obtaining their own professional tax advice where required.

---

## 16. Intellectual Property

Unless otherwise agreed in writing, ownership and usage rights for project deliverables will be governed by the applicable quotation, proposal or project agreement.

Depending on the agreement, the customer may receive rights to use or own specific custom-developed deliverables after the applicable payment obligations have been fulfilled.

Third-party libraries, frameworks, open-source software, fonts, icons, APIs and other third-party materials remain subject to their respective licenses.

Transfer of a project does not automatically transfer ownership of third-party software or services.

---

## 17. Pre-Existing Materials

Fusion Forge Creation may use:

* Existing software components
* Frameworks
* Libraries
* Reusable development techniques
* General-purpose code
* Development tools
* Open-source software

These may remain part of Fusion Forge Creation's or third-party intellectual property unless specifically transferred under a written agreement.

---

## 18. Customer Content

The customer remains responsible for content, documents, images, logos, trademarks, product information and other materials supplied to Fusion Forge Creation.

The customer represents that it has the necessary rights or permissions to provide such materials for use in the project.

Fusion Forge Creation is not responsible for disputes arising from unauthorized customer-supplied content.

---

## 19. Confidential Information

Both parties may receive confidential information during a project.

Confidential information should be used only for legitimate project or business purposes.

Where a project requires stronger confidentiality obligations, the parties may enter into a separate Non-Disclosure Agreement or confidentiality agreement.

---

## 20. Credentials and Access

Customers may need to provide access to:

* Hosting
* Domains
* Databases
* APIs
* Email systems
* Existing applications
* Other technical services

Customers should provide credentials through secure methods wherever possible.

Customers are responsible for ensuring that they have authority to provide the requested access.

Fusion Forge Creation should not be provided with unnecessary credentials or access unrelated to the project.

---

## 21. Security

We take reasonable measures to develop and maintain applications according to the agreed requirements.

However, no software or internet service can be guaranteed to be completely immune from:

* Security vulnerabilities
* Cyberattacks
* Third-party failures
* Configuration errors
* Data loss
* Unauthorized access

Security requirements that are particularly important to a project should be specifically identified and included in the project scope.

---

## 22. Backups

Where a project includes database or hosting management, backup arrangements should be clearly defined in the applicable project agreement.

Customers should maintain appropriate backups of critical business information.

Unless expressly agreed in writing, Fusion Forge Creation does not guarantee indefinite retention or recovery of all customer data.

---

## 23. Support and Maintenance

Support and maintenance may be provided according to the applicable project agreement.

Support may include:

* Bug corrections
* Minor adjustments
* Technical assistance
* Configuration assistance
* Feature modifications

New functionality or substantial changes may be treated as additional development work.

The exact support period and scope should be specified in the applicable quotation or agreement.

---

## 24. Software Modifications by Third Parties

If a customer or another developer modifies the delivered application without authorization or outside the agreed development process, Fusion Forge Creation may not be responsible for problems caused by those modifications.

Further support may require an assessment of the modified application.

---

## 25. Project Cancellation

Cancellation terms will depend on the applicable quotation or project agreement.

Work already performed, approved expenses, third-party charges and other non-refundable costs may remain payable according to the agreed terms.

Where no separate cancellation terms have been agreed, the parties should discuss the status of work completed and outstanding obligations before termination.

---

## 26. Refunds

Refunds, where applicable, will be governed by the applicable quotation or project agreement.

Development work that has already been completed, delivered or approved may not automatically qualify for a refund.

Third-party charges may also be non-refundable where the provider does not offer a refund.

---

## 27. Portfolio and Project Display

Fusion Forge Creation may display selected completed projects in its portfolio only where appropriate and where the relevant customer, project or contractual terms permit such display.

Customer confidentiality and contractual restrictions will take precedence.

A project should not be represented publicly as a customer project if it is only a demo, concept or internal project.

---

## 28. No Guarantee of Business Results

Software and websites are developed to support business objectives, but Fusion Forge Creation does not guarantee specific business results such as:

* Increased sales
* Increased profits
* Search-engine ranking
* Customer growth
* Guaranteed leads
* Guaranteed website traffic
* Guaranteed return on investment

Results depend on many factors outside the control of the developer.

---

## 29. Website Information

We attempt to keep information on our website reasonably accurate.

However, service descriptions, technologies, project information, prices and other website content may change as our services develop.

Website information should not be interpreted as a binding project quotation unless specifically stated otherwise.

---

## 30. Third-Party Links

Our website may contain links to external websites.

These links are provided for convenience or reference.

Fusion Forge Creation does not control third-party websites and is not responsible for their content, availability, security or policies.

---

## 31. Limitation of Liability

To the extent permitted by applicable law, Fusion Forge Creation will not be responsible for indirect, incidental, special or consequential losses arising from the use of a website, software application or service, including losses resulting from:

* Business interruption
* Loss of anticipated profits
* Loss caused by third-party services
* Loss caused by customer-provided information
* Unauthorized customer modifications
* External attacks or security incidents
* Hosting failures outside our control

Any project-specific liability limitations may be defined separately in the applicable written agreement.

Nothing in these Terms is intended to exclude liability that cannot lawfully be excluded under applicable law.

---

## 32. Customer Responsibility

Customers are responsible for:

* Providing accurate requirements
* Providing lawful content
* Maintaining ownership or permission for supplied materials
* Providing timely feedback
* Reviewing delivered software
* Maintaining their own third-party accounts
* Keeping their credentials secure
* Complying with laws applicable to their business

Customers are also responsible for ensuring that their use of developed software complies with laws and regulations applicable to their particular industry.

---

## 33. Healthcare, Medical and Other Regulated Applications

Fusion Forge Creation may develop software for industries such as healthcare, medical retail, engineering, manufacturing and other businesses.

Development of software does not mean that Fusion Forge Creation is providing:

* Medical advice
* Legal advice
* Tax advice
* Financial advice
* Regulatory certification

Customers remain responsible for ensuring that their business processes and use of software comply with applicable industry requirements.

Where special regulatory or compliance requirements are necessary, they should be explicitly identified during project planning.

---

## 34. Changes to These Terms

We may update these Terms from time to time.

The updated version will be published on this page with a revised "Last Updated" date.

Continued use of the website after an update may constitute acceptance of the revised Terms to the extent permitted by applicable law.

---

## 35. Governing Law

These Terms shall be interpreted in accordance with applicable laws of India.

Subject to applicable law and any specific agreement between the parties, disputes may be subject to the jurisdiction of the appropriate courts having jurisdiction over the relevant location.

---

## 36. Contact

For questions regarding these Terms, please contact:

**Fusion Forge Creation**

**Email:** [admin@fusionforgecreation.com](mailto:admin@fusionforgecreation.com)  
**Phone:** +91 63588 55524

**Address:**  
Yogi Milan,  
Near Ring Road, Amli,  
Silvassa, Dadra & Nagar Haveli – 396230, India

---

## 37. Acceptance

By using the Fusion Forge Creation website, submitting an enquiry or entering into a project agreement with Fusion Forge Creation, you acknowledge that these Terms apply to the extent relevant to your interaction with our website or services.

For paid projects, the specific quotation, proposal, work order or service agreement should be reviewed carefully before work begins.`,
    jurisdiction: 'Courts having jurisdiction over Silvassa, Dadra & Nagar Haveli, India',
    applicableLaw: 'Indian Contract Act, 1872 & Information Technology Act, 2000',
    createdBy: 'Fusion Forge Creation',
    createdByEmail: 'admin@fusionforgecreation.com',
    lastModifiedBy: 'Fusion Forge Creation',
    lastModifiedByEmail: 'admin@fusionforgecreation.com',
    lastModifiedByRole: 'Admin',
    changeSummary: 'Published comprehensive 37-section Terms & Conditions governing website use, enquiries, quotations, custom development scopes, IP, and client responsibilities as of 25 August 2026.',
    versionHistoryCount: 3,
    created_at: '2026-01-15T00:00:00Z',
    updated_at: '2026-08-25T00:00:00Z'
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
- **Registered GSTIN**: Under Registration / Provided on Official Tax Invoices
- **Permanent Account Number (PAN)**: Available on Request / Disclosed on Invoices
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
    createdBy: 'Super Admin',
    createdByEmail: 'admin@fusionforgecreation.com',
    lastModifiedBy: 'Super Admin',
    lastModifiedByEmail: 'admin@fusionforgecreation.com',
    lastModifiedByRole: 'Super Admin',
    changeSummary: 'Verified SAC 998314 IT software classification and documented GSTR-1 Table 9B credit note filing protocols.',
    versionHistoryCount: 2,
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-08-14T09:45:00Z'
  }
];

export const INITIAL_LEGAL_HISTORY: LegalDocumentHistoryItem[] = [
  {
    id: 'hist_privacy_v3_0',
    documentId: 'legal_doc_privacy',
    documentSlug: 'privacy-policy',
    version: 'v3.0',
    title: 'Privacy Policy',
    summary: 'Official Privacy Policy of Fusion Forge Creation explaining our practices on collecting, using, storing, and protecting visitor, client, project enquiry, business, account, and technical information.',
    content: INITIAL_LEGAL_DOCUMENTS[0].content,
    effectiveDate: '2026-08-25',
    status: 'active',
    changedBy: 'Fusion Forge Creation',
    changedByEmail: 'admin@fusionforgecreation.com',
    changedByRole: 'Admin',
    changeSummary: 'Published comprehensive 21-section Privacy Policy covering project enquiries, business information handling, security safeguards, and data rights as of 25 August 2026.',
    created_at: '2026-08-25T00:00:00Z'
  },
  {
    id: 'hist_privacy_v2_1',
    documentId: 'legal_doc_privacy',
    documentSlug: 'privacy-policy',
    version: 'v2.1',
    title: 'Privacy Policy & Data Protection Charter',
    summary: 'Comprehensive privacy policy detailing data minimization, zero-third-party tracking sale, client credential encryption, and compliance with the Digital Personal Data Protection (DPDP) Act, 2023.',
    content: `# Privacy Policy & Data Protection Charter\n**Fusion Forge Creation** ("we", "us", or "our") is dedicated to protecting the privacy, confidentiality, and sovereign data rights of our clients, prospects, and visitors.\n1. Data Minimization Principle.\n2. DPDP Act 2023 & IT Act 2000 compliance.\n3. Zero-sale guarantee.`,
    effectiveDate: '2026-08-01',
    status: 'archived',
    changedBy: 'Super Admin',
    changedByEmail: 'admin@fusionforgecreation.com',
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
    changedBy: 'Super Admin',
    changedByEmail: 'admin@fusionforgecreation.com',
    changedByRole: 'Super Admin',
    changeSummary: 'Initial comprehensive revision from v1.0 standard terms.',
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 'hist_terms_v3_0',
    documentId: 'legal_doc_terms',
    documentSlug: 'terms-and-conditions',
    version: 'v3.0',
    title: 'Terms & Conditions',
    summary: 'Official Terms & Conditions governing website use, enquiries, quotations, custom software development, third-party services, intellectual property, payments, and client responsibilities.',
    content: INITIAL_LEGAL_DOCUMENTS[1].content,
    effectiveDate: '2026-08-25',
    status: 'active',
    changedBy: 'Fusion Forge Creation',
    changedByEmail: 'admin@fusionforgecreation.com',
    changedByRole: 'Admin',
    changeSummary: 'Published comprehensive 37-section Terms & Conditions governing website use, enquiries, quotations, custom development scopes, IP, and client responsibilities as of 25 August 2026.',
    created_at: '2026-08-25T00:00:00Z'
  },
  {
    id: 'hist_terms_v2_0',
    documentId: 'legal_doc_terms',
    documentSlug: 'terms-of-engagement',
    version: 'v2.0',
    title: 'Master Terms of Engagement & Commercial Services Agreement',
    summary: 'Standard contractual framework governing project scoping, milestone payments, intellectual property transfer, deliverables acceptance criteria, and limitation of liability.',
    content: `# Master Terms of Engagement & Commercial Services Agreement\n1. Project Scoping & Formal Quotations (SAC 998314).\n2. Commercial Terms (40-40-20 payment milestones).\n3. IP Transfer upon 100% full invoice settlement.`,
    effectiveDate: '2026-07-15',
    status: 'archived',
    changedBy: 'Super Admin',
    changedByEmail: 'admin@fusionforgecreation.com',
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
    changedBy: 'Super Admin',
    changedByEmail: 'admin@fusionforgecreation.com',
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
    changedBy: 'Super Admin',
    changedByEmail: 'admin@fusionforgecreation.com',
    changedByRole: 'Super Admin',
    changeSummary: 'Verified SAC 998314 IT software classification and documented GSTR-1 Table 9B credit note filing protocols.',
    created_at: '2026-08-14T09:45:00Z'
  }
];

export const INITIAL_VISITOR_EVENTS: VisitorEvent[] = [];


