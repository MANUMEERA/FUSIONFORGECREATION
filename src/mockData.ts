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
  EmailLog
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
    phone: '+91 98765 00112',
    is_active: true,
    company: 'Fusion Forge Creation',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-08-14T10:00:00Z'
  },
  {
    id: 'user_admin',
    full_name: 'Debashis Panda',
    name: 'Debashis Panda',
    email: 'operations@fusionforgecreation.com',
    role: 'admin',
    phone: '+91 98765 43210',
    is_active: true,
    company: 'Fusion Forge Creation',
    created_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-08-10T12:00:00Z'
  },
  {
    id: 'user_editor',
    full_name: 'Priya Sharma',
    name: 'Priya Sharma',
    email: 'priya.sharma@fusionforgecreation.com',
    role: 'editor',
    phone: '+91 98765 22334',
    is_active: true,
    company: 'Fusion Forge Creation',
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-08-05T15:00:00Z'
  },
  {
    id: 'user_accountant',
    full_name: 'Rohan Verma',
    name: 'Rohan Verma',
    email: 'finance@fusionforgecreation.com',
    role: 'accountant',
    phone: '+91 98765 55667',
    is_active: true,
    company: 'Fusion Forge Creation',
    created_at: '2026-02-10T11:00:00Z',
    updated_at: '2026-08-12T14:30:00Z'
  },
  {
    id: 'user_staff',
    full_name: 'Ananya Mishra',
    name: 'Ananya Mishra',
    email: 'staff@fusionforgecreation.com',
    role: 'staff',
    phone: '+91 98765 88990',
    is_active: true,
    company: 'Fusion Forge Creation',
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-08-01T16:00:00Z'
  },
  {
    id: 'user_client',
    full_name: 'Arvind Kapoor',
    name: 'Arvind Kapoor',
    email: 'arvind@apexfintech.io',
    role: 'client',
    phone: '+91 98765 11223',
    is_active: true,
    clientId: 'client_1',
    company: 'Apex Fintech Solutions',
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-08-01T10:00:00Z'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client_0',
    name: 'Manoj Satapathy',
    contactPerson: 'Manoj Satapathy',
    companyName: 'JP MODATEX LLP',
    email: 'contact@jpmodatex.com',
    phone: '+91 98765 00112',
    address: 'Survey No. 42, GIDC Industrial Estate, Sachin',
    city: 'Surat',
    state: 'Gujarat',
    stateCode: '24',
    pincode: '394230',
    postalCode: '394230',
    gstin: '24AABFJ1234K1ZM',
    pan: 'AABFJ1234K',
    placeOfSupply: '24-Gujarat',
    placeOfSupplyCode: '24',
    isGstRegistered: true,
    isUrp: false,
    billingAddress: {
      street: 'Survey No. 42, GIDC Industrial Estate, Sachin',
      city: 'Surat',
      state: 'Gujarat',
      stateCode: '24',
      postalCode: '394230',
      country: 'India'
    },
    sameAsBilling: true,
    shippingName: 'Manoj Satapathy',
    shippingCompany: 'JP MODATEX LLP - Warehouse 1',
    shippingAddress: 'Survey No. 42, GIDC Industrial Estate, Sachin',
    shippingCity: 'Surat',
    shippingState: 'Gujarat',
    shippingStateCode: '24',
    shippingPincode: '394230',
    shippingGstin: '24AABFJ1234K1ZM',
    currency: 'INR',
    status: 'active',
    totalBilled: 180000,
    totalPaid: 180000,
    notes: 'Textile manufacturing process ERP and inventory automation client.',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 'client_punjab',
    name: 'Harpreet Singh',
    contactPerson: 'Harpreet Singh',
    companyName: 'Ludhiana Hosiery & Knitwear Hub',
    email: 'harpreet@ludhianahosiery.in',
    phone: '+91 98140 33445',
    address: 'Plot 88, Focal Point Phase V',
    city: 'Ludhiana',
    state: 'Punjab',
    stateCode: '03',
    pincode: '141010',
    postalCode: '141010',
    gstin: '03AABCL5544K1Z8',
    pan: 'AABCL5544K',
    placeOfSupply: '03-Punjab',
    placeOfSupplyCode: '03',
    isGstRegistered: true,
    isUrp: false,
    billingAddress: {
      street: 'Plot 88, Focal Point Phase V',
      city: 'Ludhiana',
      state: 'Punjab',
      stateCode: '03',
      postalCode: '141010',
      country: 'India'
    },
    sameAsBilling: false,
    shippingName: 'Gurdeep Singh (Logistics Manager)',
    shippingCompany: 'Ludhiana Hosiery Dispatch Centre',
    shippingPhone: '+91 98140 99887',
    shippingAddress: 'GT Road Industrial Area, Near Transport Nagar',
    shippingCity: 'Jalandhar',
    shippingState: 'Punjab',
    shippingStateCode: '03',
    shippingPincode: '144001',
    shippingGstin: '03AABCL5544K1Z8',
    currency: 'INR',
    status: 'active',
    totalBilled: 350000,
    totalPaid: 350000,
    notes: 'Garment manufacturing automation & e-commerce portal integration in Punjab.',
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-08-14T11:00:00Z'
  },
  {
    id: 'client_odisha',
    name: 'Sunita Rao',
    contactPerson: 'Sunita Rao',
    companyName: 'Quantum Logistics & Freight',
    email: 'sunita@quantumfreight.in',
    phone: '+91 97333 88990',
    address: 'Plot 24, Infocity Avenue, Chandrasekharpur',
    city: 'Bhubaneswar',
    state: 'Odisha',
    stateCode: '21',
    pincode: '751024',
    postalCode: '751024',
    gstin: '21AABPQ9988C1Z2',
    pan: 'AABPQ9988C',
    placeOfSupply: '21-Odisha',
    placeOfSupplyCode: '21',
    isGstRegistered: true,
    isUrp: false,
    billingAddress: {
      street: 'Plot 24, Infocity Avenue, Chandrasekharpur',
      city: 'Bhubaneswar',
      state: 'Odisha',
      stateCode: '21',
      postalCode: '751024',
      country: 'India'
    },
    sameAsBilling: true,
    shippingName: 'Sunita Rao',
    shippingCompany: 'Quantum Logistics & Freight - Hub Bhubaneswar',
    shippingAddress: 'Plot 24, Infocity Avenue, Chandrasekharpur',
    shippingCity: 'Bhubaneswar',
    shippingState: 'Odisha',
    shippingStateCode: '21',
    shippingPincode: '751024',
    shippingGstin: '21AABPQ9988C1Z2',
    currency: 'INR',
    status: 'active',
    totalBilled: 295000,
    totalPaid: 295000,
    notes: 'Fleet tracking & GPS telematics ERP in Odisha.',
    createdAt: '2026-05-02T16:00:00Z',
    updatedAt: '2026-07-28T12:00:00Z'
  },
  {
    id: 'client_urp',
    name: 'Rajesh Varma',
    contactPerson: 'Rajesh Varma',
    companyName: 'Artisan Woodcraft & Décor (URP)',
    email: 'rajesh@woodcraftdecor.in',
    phone: '+91 98250 11998',
    address: 'Heritage Artisan Lane, Old City',
    city: 'Ahmedabad',
    state: 'Gujarat',
    stateCode: '24',
    pincode: '380001',
    postalCode: '380001',
    gstin: '',
    pan: 'AABPV7766M',
    placeOfSupply: '24-Gujarat',
    placeOfSupplyCode: '24',
    isGstRegistered: false,
    isUrp: true,
    billingAddress: {
      street: 'Heritage Artisan Lane, Old City',
      city: 'Ahmedabad',
      state: 'Gujarat',
      stateCode: '24',
      postalCode: '380001',
      country: 'India'
    },
    sameAsBilling: false,
    shippingName: 'Devang Varma (Workshop Supervisor)',
    shippingCompany: 'Artisan Woodcraft Workshop Unit 2',
    shippingPhone: '+91 98250 44332',
    shippingAddress: 'Sarkhej Craft Village, SG Highway',
    shippingCity: 'Ahmedabad',
    shippingState: 'Gujarat',
    shippingStateCode: '24',
    shippingPincode: '382210',
    shippingGstin: '',
    currency: 'INR',
    status: 'active',
    totalBilled: 85000,
    totalPaid: 85000,
    notes: 'Unregistered person (URP) client. Handcrafted wooden artifacts & retail design studio.',
    createdAt: '2026-06-15T11:00:00Z',
    updatedAt: '2026-08-10T15:00:00Z'
  },
  {
    id: 'client_1',
    name: 'Arvind Kapoor',
    contactPerson: 'Arvind Kapoor',
    companyName: 'Apex Fintech Solutions Pvt. Ltd.',
    email: 'arvind@apexfintech.io',
    phone: '+91 98111 22334',
    address: 'Tower B, 14th Floor, BKC',
    city: 'Mumbai',
    state: 'Maharashtra',
    stateCode: '27',
    pincode: '400051',
    postalCode: '400051',
    gstin: '27AABCA1234F1ZM',
    pan: 'AABCA1234F',
    placeOfSupply: '27-Maharashtra',
    placeOfSupplyCode: '27',
    isGstRegistered: true,
    isUrp: false,
    billingAddress: {
      street: 'Tower B, 14th Floor, BKC',
      city: 'Mumbai',
      state: 'Maharashtra',
      stateCode: '27',
      postalCode: '400051',
      country: 'India'
    },
    sameAsBilling: true,
    currency: 'INR',
    status: 'active',
    totalBilled: 649000,
    totalPaid: 649000,
    notes: 'Enterprise fintech dashboard & real-time analytics portal client.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-08-01T14:30:00Z'
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quote_1',
    quoteNumber: 'QTN-2026-0001',
    clientId: 'client_1',
    clientName: 'Arvind Kapoor',
    clientCompany: 'Apex Fintech Solutions Pvt. Ltd.',
    clientEmail: 'arvind@apexfintech.io',
    title: 'Website Design & Hosting Infrastructure',
    projectScope: 'Custom corporate web presence, responsive UI/UX, and cloud hosting architecture.',
    issueDate: '2026-08-14',
    validUntil: '2026-09-14',
    currency: 'INR',
    items: [
      { id: '1', description: 'Website Design', sacCode: '998314', quantity: 1, rate: 50000, amount: 50000 },
      { id: '2', description: 'Hosting', sacCode: '998314', quantity: 1, rate: 10000, amount: 10000 }
    ],
    subtotal: 60000,
    discountType: 'fixed',
    discountValue: 5000,
    discountAmount: 5000,
    taxableAmount: 55000,
    gstType: 'igst',
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 9900,
    totalAmount: 64900,
    notes: 'Includes high-speed cloud hosting, SSL, and responsive design.',
    termsAndConditions: AGENCY_CONFIG.terms,
    status: 'sent',
    createdBy: 'Manoj Satapathy',
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-14T10:00:00Z'
  },
  {
    id: 'quote_2',
    quoteNumber: 'QTN-2026-0002',
    clientId: 'client_2',
    clientName: 'Dr. Sameer Sen',
    clientCompany: 'Nexus HealthTech India',
    clientEmail: 'sameer@nexushealth.co',
    title: 'Telemedicine Mobile App Suite (iOS & Android)',
    projectScope: 'Cross-platform mobile application development for doctors and patients.',
    issueDate: '2026-07-10',
    validUntil: '2026-08-10',
    currency: 'INR',
    items: [
      { id: '1', description: 'Patient & Doctor Mobile App (iOS & Android)', sacCode: '998314', quantity: 1, rate: 250000, amount: 250000 },
      { id: '2', description: 'Backend API & PostgreSQL Database Cluster', sacCode: '998314', quantity: 1, rate: 100000, amount: 100000 }
    ],
    subtotal: 350000,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxableAmount: 350000,
    gstType: 'igst',
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 63000,
    totalAmount: 413000,
    notes: 'Complies with Indian Digital Health standards.',
    termsAndConditions: AGENCY_CONFIG.terms,
    status: 'converted',
    convertedInvoiceId: 'inv_2',
    createdBy: 'Manoj Satapathy',
    createdAt: '2026-07-10T11:00:00Z',
    updatedAt: '2026-07-12T16:00:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_3',
    invoiceNumber: 'FFC-2026-0003',
    quoteId: undefined,
    quoteNumber: undefined,
    clientId: 'client_0',
    clientName: 'Manoj Satapathy',
    clientCompany: 'JP MODATEX LLP',
    clientEmail: 'contact@jpmodatex.com',
    clientGstin: '',
    clientAddress: 'Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230',
    
    // Seller Details
    sellerName: 'Fusion Forge Creation',
    sellerAddress: 'H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230',
    sellerGstin: '26AALFF1234F1Z5',
    sellerState: 'Dadra & Nagar Haveli',
    sellerStateCode: '26',

    // Buyer Details
    buyerCompany: 'JP MODATEX LLP',
    buyerName: 'Manoj Satapathy',
    buyerAddress: 'Survey No. 42, GIDC Industrial Estate, Sachin, Surat, Gujarat - 394230',
    buyerGstin: '—',
    buyerState: 'Gujarat',
    buyerStateCode: '24',

    title: 'Textile ERP Workflow Automation & Inventory Engine',
    issueDate: '2026-08-14',
    dueDate: '2026-08-29',
    currency: 'INR',
    items: [
      { id: '1', description: 'Enterprise Textile Production ERP Module', sacCode: '998314', quantity: 1, rate: 120000, amount: 120000 },
      { id: '2', description: 'Yarn & Fabric Inventory Automation Engine', sacCode: '998314', quantity: 1, rate: 40000, amount: 40000 },
      { id: '3', description: 'Cloud Deployment, SSL & PostgreSQL Database Setup', sacCode: '998314', quantity: 1, rate: 20000, amount: 20000 }
    ],
    subtotal: 180000,
    discountType: 'fixed',
    discountValue: 10000,
    discountAmount: 10000,
    taxableAmount: 170000,
    gstType: 'igst',
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 30600,
    totalAmount: 200600,
    amountInWords: 'Indian Rupees Two Lakh Six Hundred Only',
    paidAmount: 200600,
    balanceDue: 0,
    status: 'paid',
    paymentTerms: '100% Payment received with thanks via NEFT transfer.',
    bankDetails: AGENCY_CONFIG.bankDetails,
    notes: 'SAC 998314 - Information Technology software design, programming and cloud configuration services. Inter-State Supply (Odisha to Gujarat) attracted to IGST @ 18%.',
    createdAt: '2026-08-14T09:30:00Z',
    updatedAt: '2026-08-14T11:00:00Z'
  },
  {
    id: 'inv_1',
    invoiceNumber: 'FFC-2026-0001',
    quoteId: 'quote_1',
    quoteNumber: 'QTN-2026-0001',
    clientId: 'client_1',
    clientName: 'Arvind Kapoor',
    clientCompany: 'Apex Fintech Solutions Pvt. Ltd.',
    clientEmail: 'arvind@apexfintech.io',
    clientGstin: '27AABCA1234F1ZM',
    clientAddress: 'Tower B, 14th Floor, BKC, Mumbai, Maharashtra 400051',
    sellerName: 'Fusion Forge Creation',
    sellerAddress: 'H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230',
    sellerGstin: '26AALFF1234F1Z5',
    sellerState: 'Dadra & Nagar Haveli',
    sellerStateCode: '26',
    buyerCompany: 'Apex Fintech Solutions Pvt. Ltd.',
    buyerName: 'Arvind Kapoor',
    buyerAddress: 'Tower B, 14th Floor, BKC, Mumbai, Maharashtra 400051',
    buyerGstin: '27AABCA1234F1ZM',
    buyerState: 'Maharashtra',
    buyerStateCode: '27',
    title: 'Website Design & Hosting Infrastructure',
    issueDate: '2026-08-14',
    dueDate: '2026-08-29',
    currency: 'INR',
    items: [
      { id: '1', description: 'Website Design', sacCode: '998314', quantity: 1, rate: 50000, amount: 50000 },
      { id: '2', description: 'Hosting', sacCode: '998314', quantity: 1, rate: 10000, amount: 10000 }
    ],
    subtotal: 60000,
    discountType: 'fixed',
    discountValue: 5000,
    discountAmount: 5000,
    taxableAmount: 55000,
    gstType: 'igst',
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 9900,
    totalAmount: 64900,
    amountInWords: 'Indian Rupees Sixty Four Thousand Nine Hundred Only',
    paidAmount: 64900,
    balanceDue: 0,
    status: 'paid',
    paymentTerms: 'Payment received in full via NEFT.',
    bankDetails: AGENCY_CONFIG.bankDetails,
    notes: 'Thank you for partnering with Fusion Forge Creation.',
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-14T15:00:00Z'
  },
  {
    id: 'inv_2',
    invoiceNumber: 'FFC-2026-0002',
    quoteId: 'quote_2',
    quoteNumber: 'QTN-2026-0002',
    clientId: 'client_2',
    clientName: 'Dr. Sameer Sen',
    clientCompany: 'Nexus HealthTech India',
    clientEmail: 'sameer@nexushealth.co',
    clientGstin: '29AAACN8877K1Z3',
    clientAddress: '45 Koramangala 5th Block, Bengaluru, Karnataka 560095',
    sellerName: 'Fusion Forge Creation',
    sellerAddress: 'H2/203, Yogi Milan, Near Ring Road, Silvassa, Dadra & Nagar Haveli - 396230',
    sellerGstin: '26AALFF1234F1Z5',
    sellerState: 'Dadra & Nagar Haveli',
    sellerStateCode: '26',
    buyerCompany: 'Nexus HealthTech India',
    buyerName: 'Dr. Sameer Sen',
    buyerAddress: '45 Koramangala 5th Block, Bengaluru, Karnataka 560095',
    buyerGstin: '29AAACN8877K1Z3',
    buyerState: 'Karnataka',
    buyerStateCode: '29',
    title: 'Telemedicine Mobile App Suite (Milestone 1)',
    issueDate: '2026-07-15',
    dueDate: '2026-08-30',
    currency: 'INR',
    items: [
      { id: '1', description: 'Patient & Doctor Mobile App (iOS & Android)', sacCode: '998314', quantity: 1, rate: 250000, amount: 250000 },
      { id: '2', description: 'Backend API & PostgreSQL Database Cluster', sacCode: '998314', quantity: 1, rate: 100000, amount: 100000 }
    ],
    subtotal: 350000,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    taxableAmount: 350000,
    gstType: 'igst',
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 63000,
    totalAmount: 413000,
    amountInWords: 'Indian Rupees Four Lakh Thirteen Thousand Only',
    paidAmount: 200000,
    balanceDue: 213000,
    status: 'partially_paid',
    paymentTerms: 'Initial advance paid. Balance ₹2,13,000 due upon beta sign-off.',
    bankDetails: AGENCY_CONFIG.bankDetails,
    notes: 'IGST 18% charged for inter-state service.',
    createdAt: '2026-07-15T11:00:00Z',
    updatedAt: '2026-07-20T12:00:00Z'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    receiptNumber: 'REC-2026-0001',
    invoiceId: 'inv_1',
    invoiceNumber: 'INV-2026-0001',
    clientId: 'client_1',
    clientName: 'Apex Fintech Solutions Pvt. Ltd.',
    amount: 64900,
    currency: 'INR',
    paymentDate: '2026-08-14',
    paymentMethod: 'bank_transfer',
    transactionReference: 'NEFT/HDFC/99281726351',
    recordedBy: 'Rohan Verma',
    createdAt: '2026-08-14T15:00:00Z'
  },
  {
    id: 'pay_2',
    receiptNumber: 'REC-2026-0002',
    invoiceId: 'inv_2',
    invoiceNumber: 'INV-2026-0002',
    clientId: 'client_2',
    clientName: 'Nexus HealthTech India',
    amount: 200000,
    currency: 'INR',
    paymentDate: '2026-07-20',
    paymentMethod: 'upi',
    transactionReference: 'UPI/AXIS/482910492817',
    recordedBy: 'Rohan Verma',
    createdAt: '2026-07-20T12:00:00Z'
  }
];

export const INITIAL_CREDIT_DEBIT_NOTES: CreditDebitNote[] = [
  {
    id: 'cn_1',
    noteNumber: 'CN-2026-0001',
    noteType: 'credit',
    invoiceId: 'inv_1',
    invoiceNumber: 'FFC-2026-0001',
    invoiceDate: '2026-08-14',
    clientId: 'client_1',
    clientName: 'Arvind Kapoor',
    clientCompany: 'Apex Fintech Solutions Pvt. Ltd.',
    clientGstin: '27AABCA1234F1ZM',
    clientAddress: 'Tower B, 14th Floor, BKC, Mumbai, Maharashtra 400051',
    sellerName: 'Fusion Forge Creation',
    sellerGstin: '26AALFF1234F1Z5',
    sellerState: 'Dadra & Nagar Haveli',
    sellerStateCode: '26',
    buyerState: 'Maharashtra',
    buyerStateCode: '27',
    placeOfSupply: '27-Maharashtra',
    issueDate: '2026-08-16',
    reason: '02-Post Sale Discount',
    reasonNotes: 'Special volume rebate credit issued for corporate annual partnership agreement.',
    reverseCharge: 'No',
    items: [
      {
        id: 'cn_item_1',
        description: 'Post-Sale Commercial Rebate on Website Architecture & Cloud Hosting',
        sacCode: '998314',
        quantity: 1,
        rate: 5000,
        amount: 5000
      }
    ],
    subtotal: 5000,
    taxableAmount: 5000,
    gstType: 'igst',
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    utgstAmount: 0,
    igstAmount: 900,
    totalTax: 900,
    totalAmount: 5900,
    amountInWords: 'Indian Rupees Five Thousand Nine Hundred Only',
    status: 'issued',
    createdBy: 'Manoj Satapathy',
    created_at: '2026-08-16T10:00:00Z',
    updated_at: '2026-08-16T10:00:00Z'
  },
  {
    id: 'cn_2',
    noteNumber: 'CN-2026-0002',
    noteType: 'credit',
    invoiceId: 'inv_3',
    invoiceNumber: 'FFC-2026-0003',
    invoiceDate: '2026-07-28',
    clientId: 'client_3',
    clientName: 'Debabrata Mohanty',
    clientCompany: 'Kalinga Logistics & Freight Systems',
    clientGstin: '21AABCK4321D1ZQ',
    clientAddress: 'Plot 104, Rasulgarh Industrial Estate, Bhubaneswar, Odisha - 751010',
    sellerName: 'Fusion Forge Creation',
    sellerGstin: '26AALFF1234F1Z5',
    sellerState: 'Dadra & Nagar Haveli',
    sellerStateCode: '26',
    buyerState: 'Odisha',
    buyerStateCode: '21',
    placeOfSupply: '21-Odisha',
    issueDate: '2026-08-05',
    reason: '03-Deficiency in Services',
    reasonNotes: 'Adjusted milestone credit due to scope reduction on legacy GPS hardware sync module.',
    reverseCharge: 'No',
    items: [
      {
        id: 'cn_item_2',
        description: 'Scope Adjustment Credit - De-scoped Custom Hardware Telemetry Driver',
        sacCode: '998314',
        quantity: 1,
        rate: 15000,
        amount: 15000
      }
    ],
    subtotal: 15000,
    taxableAmount: 15000,
    gstType: 'igst',
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    utgstAmount: 0,
    igstAmount: 2700,
    totalTax: 2700,
    totalAmount: 17700,
    amountInWords: 'Indian Rupees Seventeen Thousand Seven Hundred Only',
    status: 'issued',
    createdBy: 'Manoj Satapathy',
    created_at: '2026-08-05T14:30:00Z',
    updated_at: '2026-08-05T14:30:00Z'
  },
  {
    id: 'dn_1',
    noteNumber: 'DN-2026-0001',
    noteType: 'debit',
    invoiceId: 'inv_4',
    invoiceNumber: 'FFC-2026-0004',
    invoiceDate: '2026-08-02',
    clientId: 'client_4',
    clientName: 'Priyanka Patel',
    clientCompany: 'Silvassa Smart Solutions Pvt. Ltd.',
    clientGstin: '26AABCS5566G1ZW',
    clientAddress: 'Office 402, Royal Complex, Naroli Road, Silvassa, Dadra & Nagar Haveli - 396230',
    sellerName: 'Fusion Forge Creation',
    sellerGstin: '26AALFF1234F1Z5',
    sellerState: 'Dadra & Nagar Haveli',
    sellerStateCode: '26',
    buyerState: 'Dadra & Nagar Haveli',
    buyerStateCode: '26',
    placeOfSupply: '26-Dadra and Nagar Haveli and Daman and Diu',
    issueDate: '2026-08-10',
    reason: '06-Final Price Hike / Adjustment',
    reasonNotes: 'Debit note issued for additional emergency weekend server migration compute hours.',
    reverseCharge: 'No',
    items: [
      {
        id: 'dn_item_1',
        description: 'Supplementary High-Availability Cloud Server Re-provisioning & DB Tuning',
        sacCode: '998314',
        quantity: 1,
        rate: 8000,
        amount: 8000
      }
    ],
    subtotal: 8000,
    taxableAmount: 8000,
    gstType: 'cgst_utgst',
    gstRate: 18,
    cgstAmount: 720,
    sgstAmount: 0,
    utgstAmount: 720,
    igstAmount: 0,
    totalTax: 1440,
    totalAmount: 9440,
    amountInWords: 'Indian Rupees Nine Thousand Four Hundred Forty Only',
    status: 'issued',
    createdBy: 'Manoj Satapathy',
    created_at: '2026-08-10T16:00:00Z',
    updated_at: '2026-08-10T16:00:00Z'
  }
];

export const INITIAL_ENQUIRIES: ProjectEnquiry[] = [
  {
    id: 'enq_1',
    name: 'Vikramaditya Bose',
    email: 'vikram@hypercloud.ai',
    phone: '+91 98450 11223',
    company: 'HyperCloud AI',
    serviceCategory: 'full_stack_enterprise',
    budgetRange: '₹3,00,000 - ₹5,00,000',
    estimatedTimeline: '6-8 Weeks',
    projectDescription: 'Next-gen AI agent workflow platform with responsive React UI and Node backend.',
    featuresRequired: ['Auth & Security', 'Database Storage', 'Real-time WebSockets'],
    source: 'cost_estimator',
    status: 'new',
    priority: 'urgent',
    createdAt: '2026-08-14T09:30:00Z',
    updatedAt: '2026-08-14T09:30:00Z'
  },
  {
    id: 'enq_2',
    name: 'Ananya Deshmukh',
    email: 'ananya@auraecoliving.com',
    phone: '+91 97110 55443',
    company: 'Aura EcoLiving',
    serviceCategory: 'web_development',
    budgetRange: '₹1,50,000 - ₹2,50,000',
    estimatedTimeline: '3-4 Weeks',
    projectDescription: 'Premium direct-to-consumer e-commerce portal with custom UI/UX.',
    featuresRequired: ['Auth & Security', 'Payment Gateway'],
    source: 'website_form',
    status: 'contacted',
    priority: 'high',
    createdAt: '2026-08-12T14:15:00Z',
    updatedAt: '2026-08-13T10:00:00Z'
  }
];

export const INITIAL_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'port_1',
    title: 'Apex Financial Intelligence Platform',
    clientName: 'Apex Fintech Solutions',
    category: 'Web Application',
    summary: 'High-frequency market analytics dashboard with sub-second WebSocket updates and interactive charts.',
    deliverables: ['Custom Design System', 'React 19 Frontend', 'Microservices API'],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    bannerGradient: 'from-blue-600 to-indigo-900'
  },
  {
    id: 'port_2',
    title: 'Nexus Telehealth Consultation Suite',
    clientName: 'Nexus HealthTech India',
    category: 'Mobile App',
    summary: 'Cross-platform iOS & Android application enabling instant video consultations and prescription tracking.',
    deliverables: ['iOS & Android Apps', 'WebRTC Video Streamer', 'HIPAA Secure DB'],
    techStack: ['React Native', 'Node.js', 'WebRTC', 'Supabase'],
    bannerGradient: 'from-cyan-600 to-blue-900'
  }
];

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

export const INITIAL_MANAGED_PROJECTS: ManagedProject[] = [
  {
    id: 'proj_1',
    title: 'Apex Financial Intelligence Platform',
    clientId: 'client_1',
    clientName: 'Apex Fintech Solutions Pvt. Ltd.',
    clientEmail: 'billing@apexfintech.io',
    category: 'Web Application',
    status: 'completed',
    startDate: '2026-01-15',
    deadline: '2026-04-30',
    completionDate: '2026-04-28',
    budget: 649000,
    progressPercentage: 100,
    techStack: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    deliverables: ['Design System', 'Analytics Engine', 'WebSocket Live Feed', 'Admin Dashboard'],
    isPublic: true,
    publicUrl: 'https://apexfintech.io',
    webAppUrl: 'https://app.apexfintech.io',
    softwareUrl: 'https://github.com/fusion-forge/apex-engine',
    mobileAppInfo: 'Web PWA + Responsive Portal',
    notes: 'Delivered ahead of schedule. 100% IP code handed over.',
    invoicedAmount: 649000,
    invoicedIds: ['inv_1'],
    statusHistory: [
      {
        id: 'hist_1_1',
        projectId: 'proj_1',
        previousStatus: 'planning',
        newStatus: 'in_progress',
        changedBy: 'Super Admin',
        changedByEmail: 'admin@fusionforgecreation.com',
        notes: 'Project kicked off following advance payment confirmation.',
        emailSentToClient: true,
        clientEmail: 'billing@apexfintech.io',
        timestamp: '2026-01-16T10:00:00Z',
        messageId: 'proj_msg_101'
      },
      {
        id: 'hist_1_2',
        projectId: 'proj_1',
        previousStatus: 'in_progress',
        newStatus: 'review',
        changedBy: 'Lead Architect',
        changedByEmail: 'admin@fusionforgecreation.com',
        notes: 'UAT testing completed with zero major defects.',
        emailSentToClient: true,
        clientEmail: 'billing@apexfintech.io',
        timestamp: '2026-04-20T14:30:00Z',
        messageId: 'proj_msg_102'
      },
      {
        id: 'hist_1_3',
        projectId: 'proj_1',
        previousStatus: 'review',
        newStatus: 'completed',
        changedBy: 'Super Admin',
        changedByEmail: 'admin@fusionforgecreation.com',
        notes: 'Final deployment signoff received. Full source code and documentation handed over.',
        emailSentToClient: true,
        clientEmail: 'billing@apexfintech.io',
        timestamp: '2026-04-28T16:00:00Z',
        messageId: 'proj_msg_103'
      }
    ]
  },
  {
    id: 'proj_2',
    title: 'Nexus Telehealth Consultation Suite',
    clientId: 'client_2',
    clientName: 'Nexus HealthTech India',
    clientEmail: 'sameer@nexushealth.co',
    category: 'Mobile App',
    status: 'in_progress',
    startDate: '2026-03-20',
    deadline: '2026-09-15',
    budget: 413000,
    progressPercentage: 75,
    techStack: ['React Native', 'Node.js', 'WebRTC', 'Supabase', 'PostgreSQL'],
    deliverables: ['Doctor Portal', 'Patient Mobile App', 'WebRTC Telehealth Room', 'Prescription PDF Generator'],
    isPublic: true,
    publicUrl: 'https://nexushealth.co',
    webAppUrl: 'https://portal.nexushealth.co',
    mobileAppInfo: 'iOS TestFlight v1.2 & Android Beta APK',
    notes: 'Beta milestone 1 released and approved.',
    invoicedAmount: 413000,
    invoicedIds: ['inv_2'],
    statusHistory: [
      {
        id: 'hist_2_1',
        projectId: 'proj_2',
        previousStatus: 'planning',
        newStatus: 'in_progress',
        changedBy: 'Super Admin',
        changedByEmail: 'admin@fusionforgecreation.com',
        notes: 'Sprint 1 commenced for WebRTC real-time consultation module.',
        emailSentToClient: true,
        clientEmail: 'sameer@nexushealth.co',
        timestamp: '2026-03-22T09:00:00Z',
        messageId: 'proj_msg_201'
      }
    ]
  },
  {
    id: 'proj_3',
    title: 'Quantum Fleet Telematics & IoT Engine',
    clientId: 'client_odisha',
    clientName: 'Quantum Logistics & Freight',
    clientEmail: 'sunita@quantumfreight.in',
    category: 'Enterprise Cloud',
    status: 'completed',
    startDate: '2026-05-10',
    deadline: '2026-07-25',
    completionDate: '2026-07-24',
    budget: 295000,
    progressPercentage: 100,
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets'],
    deliverables: ['Live GPS Tracking', 'Driver Telematics App', 'Automated GST Dispatch Invoices'],
    isPublic: true,
    publicUrl: 'https://quantumfreight.in',
    webAppUrl: 'https://telematics.quantumfreight.in',
    softwareUrl: 'https://cloud.quantumfreight.in',
    mobileAppInfo: 'Driver Android GPS Telematics App (Play Store Private Distribution)',
    notes: 'Deployed with auto-scaling container infrastructure.',
    statusHistory: [
      {
        id: 'hist_3_1',
        projectId: 'proj_3',
        previousStatus: 'planning',
        newStatus: 'in_progress',
        changedBy: 'Super Admin',
        changedByEmail: 'admin@fusionforgecreation.com',
        notes: 'Architecture blueprint finalized with MQTT IoT telematics pipelines.',
        emailSentToClient: true,
        clientEmail: 'sunita@quantumfreight.in',
        timestamp: '2026-05-12T11:00:00Z',
        messageId: 'proj_msg_301'
      },
      {
        id: 'hist_3_2',
        projectId: 'proj_3',
        previousStatus: 'in_progress',
        newStatus: 'completed',
        changedBy: 'Super Admin',
        changedByEmail: 'admin@fusionforgecreation.com',
        notes: 'Live fleet deployed across 500+ GPS vehicle units in Odisha & Eastern India.',
        emailSentToClient: true,
        clientEmail: 'sunita@quantumfreight.in',
        timestamp: '2026-07-24T17:00:00Z',
        messageId: 'proj_msg_302'
      }
    ]
  },
  {
    id: 'proj_4',
    title: 'Aura EcoLiving D2C Headless Commerce',
    clientId: 'client_surat',
    clientName: 'Aura EcoLiving Ltd.',
    clientEmail: 'ananya@auraecoliving.com',
    category: 'Web Application',
    status: 'planning',
    startDate: '2026-08-20',
    deadline: '2026-10-30',
    budget: 250000,
    progressPercentage: 15,
    techStack: ['React 19', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Razorpay'],
    deliverables: ['Headless Storefront', 'Admin Order Desk', 'Razorpay Payment Flow'],
    isPublic: true,
    notes: 'Initial UX wireframes currently in review with client.'
  }
];

export const INITIAL_COMPLETED_WORKS: CompletedWorkRecord[] = [
  {
    id: 'cw_01',
    clientName: 'Apex Fintech Solutions Pvt. Ltd.',
    projectTitle: 'Apex Financial Intelligence & Trading Analytics Platform',
    workCategory: 'Web Application & Real-time Trading',
    completionDate: '2026-04-28',
    technologyType: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'],
    publicUrl: 'https://apexfintech.io',
    webAppUrl: 'https://app.apexfintech.io',
    softwareUrl: 'https://github.com/fusion-forge/apex-engine',
    mobileAppInfo: 'Progressive Web Application (PWA) with push alerts',
    shortDescription: 'Enterprise high-frequency market analytics dashboard featuring sub-second WebSocket updates, interactive Candlestick charts, and automated P&L reporting.',
    deliverablesSummary: [
      'Interactive reactive financial dashboard',
      'Real-time WebSocket streaming feed',
      'Admin telemetry and client user desk',
      'Automated SAC 998314 billing integration'
    ],
    sourceProjectId: 'proj_1',
    isVerified: true,
    createdAt: '2026-04-28T16:30:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'cw_02',
    clientName: 'Quantum Logistics & Freight',
    projectTitle: 'Quantum Fleet Telematics & Live GPS IoT Engine',
    workCategory: 'Enterprise Cloud & IoT Telematics',
    completionDate: '2026-07-24',
    technologyType: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MQTT', 'Docker'],
    publicUrl: 'https://quantumfreight.in',
    webAppUrl: 'https://telematics.quantumfreight.in',
    softwareUrl: 'https://cloud.quantumfreight.in',
    mobileAppInfo: 'Driver Android GPS Telematics App (Private Distribution)',
    shortDescription: 'Multi-tenant freight dispatch platform integrating real-time GPS telemetry from 500+ commercial fleet vehicles, automated route optimization, and e-way bill generation.',
    deliverablesSummary: [
      'High-throughput MQTT GPS telemetry ingestion',
      'Live map clustering & route playback',
      'Automated dispatch documentation & proof of delivery',
      'Driver mobile application APK'
    ],
    sourceProjectId: 'proj_3',
    isVerified: true,
    createdAt: '2026-07-24T17:30:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'cw_03',
    clientName: 'JP MODATEX LLP',
    projectTitle: 'Modatex Textile ERP & Production Workflow Engine',
    workCategory: 'Enterprise ERP & Inventory Automation',
    completionDate: '2026-06-18',
    technologyType: ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Node.js'],
    publicUrl: 'https://jpmodatex.com',
    webAppUrl: 'https://erp.jpmodatex.com',
    softwareUrl: 'https://internal.jpmodatex.com/portal',
    mobileAppInfo: 'Inventory Barcode Scanner Web App for floor supervisors',
    shortDescription: 'End-to-end textile manufacturing ERP supporting loom scheduling, yarn batch tracking, inventory dispatch, and statutory GST e-invoicing.',
    deliverablesSummary: [
      'Yarn and fabric inventory tracking system',
      'Production batch scheduling calendar',
      'Automated inter-state IGST billing engine',
      'Warehouse barcode scanning module'
    ],
    isVerified: true,
    createdAt: '2026-06-18T14:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'cw_04',
    clientName: 'Ludhiana Hosiery & Knitwear Hub',
    projectTitle: 'Ludhiana Hosiery B2B Wholesale Portal & Order Desk',
    workCategory: 'B2B E-Commerce & Wholesale Distribution',
    completionDate: '2026-07-10',
    technologyType: ['React 19', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'Razorpay'],
    publicUrl: 'https://ludhianahosiery.in',
    webAppUrl: 'https://b2b.ludhianahosiery.in',
    mobileAppInfo: 'Retailer Mobile Catalogue & Quick Order App',
    shortDescription: 'Digital wholesale ordering platform serving 1,200+ apparel retailers across India with real-time stock levels, tiered bulk discounts, and transport dispatch manifests.',
    deliverablesSummary: [
      'B2B wholesale pricing & volume discount engine',
      'Distributor ordering desk & ledger sync',
      'Transport LR & dispatch manifest generator',
      'Cross-browser responsive UI'
    ],
    isVerified: true,
    createdAt: '2026-07-10T12:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  }
];

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

export const INITIAL_TESTIMONIALS = [
  {
    id: 'testi_1',
    clientName: 'Arvind Kapoor',
    role: 'Chief Executive Officer',
    company: 'Apex Fintech Solutions Pvt. Ltd.',
    quote: 'Fusion Forge Creation engineered our real-time financial trading analytics platform with exceptional speed and reliability. Sub-second data updates and pristine UI made all the difference.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    projectName: 'Apex Financial Intelligence Platform',
    isApproved: true
  },
  {
    id: 'testi_2',
    clientName: 'Dr. Sameer Sen',
    role: 'Head of Digital Products',
    company: 'Nexus HealthTech India',
    quote: 'Their technical execution on our cross-platform telemedicine suite was world-class. From HIPAA-compliant data encryption to crystal-clear WebRTC video streaming, they delivered ahead of schedule.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    projectName: 'Nexus Telehealth Consultation Suite',
    isApproved: true
  },
  {
    id: 'testi_3',
    clientName: 'Sunita Rao',
    role: 'VP Operations',
    company: 'Quantum Logistics & Freight',
    quote: 'The team transformed our logistics dispatch workflow with automated GPS telematics and GST-ready billing. The investment paid for itself within the first quarter.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    projectName: 'Quantum Fleet Telematics Engine',
    isApproved: true
  }
];

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
    answer: 'Our project investments are transparent and milestone-based:\n\n• MVP / Rapid Prototypes: ₹50,000 – ₹1,50,000\n• Standard Web & Mobile Applications: ₹1,50,000 – ₹3,00,000\n• Enterprise Cloud Platforms & Multi-User Portals: ₹3,00,000 – ₹6,00,000+\n• High-Scale Distributed Systems: Custom Scope.\n\nAll estimates include 18% GST with formal SAC 998314 Tax Invoices. You can use our interactive ballpark estimator below!',
    category: 'Pricing & Quotes',
    keywords: ['price', 'pricing', 'cost', 'budget', 'rate', 'quote', 'quotation', 'how much', 'fee', 'charge', 'expensive', 'inr', 'rupees'],
    suggestedFollowUps: ['Open Ballpark Cost Estimator', 'Are your invoices GST compliant?', 'How to get a formal quotation?'],
    actionLink: '#contact',
    actionLabel: 'Calculate Instant Ballpark Estimate',
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
export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'pur_1',
    supplierName: 'Amazon Web Services India Pvt Ltd',
    supplierGstin: '27AABCA9008R1ZM',
    supplierEmail: 'billing@aws-india.in',
    supplierPhone: '+91 22 6789 5000',
    supplierAddress: 'BKC Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    supplierStateCode: '27',
    billNumber: 'AWS-IN-2026-8941',
    purchaseDate: '2026-08-02',
    dueDate: '2026-08-17',
    description: 'Cloud compute EC2, RDS PostgreSQL multi-AZ instance, S3 object storage & CloudFront CDN bandwidth',
    hsnSacCode: '998313',
    category: 'Cloud Infrastructure & Servers',
    taxableAmount: 35000,
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    utgstAmount: 0,
    igstAmount: 6300,
    totalAmount: 41300,
    paymentStatus: 'paid',
    paymentMode: 'Credit Card',
    paymentDate: '2026-08-02',
    paymentRef: 'TXN-AWS-992014',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'AWS_Tax_Invoice_Aug2026.pdf',
    isItcClaimable: true,
    created_at: '2026-08-02T10:00:00Z',
    updated_at: '2026-08-02T10:00:00Z'
  },
  {
    id: 'pur_2',
    supplierName: 'DigitalOcean Cloud India Pvt Ltd',
    supplierGstin: '29AABCD1234F1Z2',
    supplierEmail: 'invoices@digitalocean.com',
    supplierPhone: '+91 80 4455 6677',
    supplierAddress: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
    supplierStateCode: '29',
    billNumber: 'DO-INV-2026-0771',
    purchaseDate: '2026-08-01',
    dueDate: '2026-08-15',
    description: 'Managed Kubernetes cluster & Redis cache cluster for staging environments',
    hsnSacCode: '998313',
    category: 'Cloud Infrastructure & Servers',
    taxableAmount: 18000,
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    utgstAmount: 0,
    igstAmount: 3240,
    totalAmount: 21240,
    paymentStatus: 'paid',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    paymentDate: '2026-08-01',
    paymentRef: 'HDFC-NEFT-DO-9921',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'DO_Cloud_Invoice_Aug2026.pdf',
    isItcClaimable: true,
    created_at: '2026-08-01T11:00:00Z',
    updated_at: '2026-08-01T11:00:00Z'
  },
  {
    id: 'pur_3',
    supplierName: 'Dell Technologies India Pvt Ltd',
    supplierGstin: '29AABCD5544E1Z8',
    supplierEmail: 'b2b-sales@dell.com',
    supplierPhone: '+91 80 2500 0000',
    supplierAddress: 'Divyasree Greens, Koramangala, Bengaluru 560071',
    supplierStateCode: '29',
    billNumber: 'DELL-CORP-44910',
    purchaseDate: '2026-07-15',
    dueDate: '2026-07-30',
    description: '2x Dell UltraSharp 32-inch 4K USB-C Hub Monitors for Design & Development Workstations',
    hsnSacCode: '847130',
    category: 'Hardware & Workstations',
    taxableAmount: 85000,
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    utgstAmount: 0,
    igstAmount: 15300,
    totalAmount: 100300,
    paymentStatus: 'paid',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    paymentDate: '2026-07-16',
    paymentRef: 'HDFC-RTGS-DELL-5521',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'Dell_Hardware_TaxInvoice.pdf',
    isItcClaimable: true,
    created_at: '2026-07-15T09:30:00Z',
    updated_at: '2026-07-16T14:20:00Z'
  },
  {
    id: 'pur_4',
    supplierName: 'JetBrains s.r.o. / Commercial Tools',
    supplierGstin: '07AABCB9900F1Z4',
    supplierEmail: 'sales@jetbrains.com',
    supplierPhone: '+91 11 4050 6070',
    supplierAddress: 'Barakhamba Road, Connaught Place, New Delhi 110001',
    supplierStateCode: '07',
    billNumber: 'JB-CORP-2026-118',
    purchaseDate: '2026-08-10',
    dueDate: '2026-08-25',
    description: 'All Products Pack Commercial Annual Team Subscriptions (WebStorm, GoLand, DataGrip, CLion)',
    hsnSacCode: '998314',
    category: 'Software Tools & IDEs',
    taxableAmount: 48000,
    gstRate: 18,
    cgstAmount: 0,
    sgstAmount: 0,
    utgstAmount: 0,
    igstAmount: 8640,
    totalAmount: 56640,
    paymentStatus: 'pending',
    paymentMode: 'Credit Card',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'JetBrains_Commercial_Invoice.pdf',
    isItcClaimable: true,
    created_at: '2026-08-10T15:00:00Z',
    updated_at: '2026-08-10T15:00:00Z'
  }
];

// =============================================================================
// PHASE 10: INITIAL OPERATING EXPENSES (OPEX & OFFICE EXPENDITURES)
// =============================================================================
export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    expenseDate: '2026-08-01',
    category: 'Office Rent & Workspace',
    description: 'Monthly Office Workspace Rent & Maintenance for Silvassa Tech Studio Suite 203',
    vendorName: 'Yogi Milan Commercial Towers Property Trust',
    vendorGstin: '26AAATY1234A1Z9',
    amount: 45000,
    gstApplicable: true,
    taxableAmount: 38135.59,
    gstRate: 18,
    gstAmount: 6864.41,
    cgstAmount: 3432.20,
    sgstAmount: 3432.20,
    igstAmount: 0,
    isItcEligible: true,
    paymentMode: 'Net Banking',
    referenceNumber: 'HDFC-NEFT-RENT-AUG26',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'Rent_Receipt_Aug2026.pdf',
    status: 'paid',
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z'
  },
  {
    id: 'exp_2',
    expenseDate: '2026-08-05',
    category: 'Software Licenses & Subscriptions',
    description: 'Figma Organization & Design Systems 5-seat Team Subscription',
    vendorName: 'Figma Inc. / Software Services',
    amount: 12500,
    gstApplicable: true,
    taxableAmount: 10593.22,
    gstRate: 18,
    gstAmount: 1906.78,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 1906.78,
    isItcEligible: true,
    paymentMode: 'Credit Card',
    referenceNumber: 'TXN-FIGMA-88412',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'Figma_Monthly_Receipt.pdf',
    status: 'paid',
    created_at: '2026-08-05T12:00:00Z',
    updated_at: '2026-08-05T12:00:00Z'
  },
  {
    id: 'exp_3',
    expenseDate: '2026-08-03',
    category: 'Utilities & High-Speed Internet',
    description: '1 Gbps Dedicated Symmetrical Leased Line Fiber Broadband',
    vendorName: 'Tata Tele Business Services Ltd',
    vendorGstin: '26AAACT2727Q1ZG',
    amount: 8850,
    gstApplicable: true,
    taxableAmount: 7500,
    gstRate: 18,
    gstAmount: 1350,
    cgstAmount: 675,
    sgstAmount: 675,
    igstAmount: 0,
    isItcEligible: true,
    paymentMode: 'UPI',
    referenceNumber: 'UPI-TATA-774029',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'Tata_Broadband_TaxBill.pdf',
    status: 'paid',
    created_at: '2026-08-03T14:30:00Z',
    updated_at: '2026-08-03T14:30:00Z'
  },
  {
    id: 'exp_4',
    expenseDate: '2026-08-08',
    category: 'Legal, Accounting & Audit Fees',
    description: 'Chartered Accountant GST Retainer & Monthly GSTR-1/3B Compliance Filing Fee',
    vendorName: 'K. S. Joshi & Associates Chartered Accountants',
    vendorGstin: '26AABFK8821F1ZX',
    amount: 15000,
    gstApplicable: true,
    taxableAmount: 12711.86,
    gstRate: 18,
    gstAmount: 2288.14,
    cgstAmount: 1144.07,
    sgstAmount: 1144.07,
    igstAmount: 0,
    isItcEligible: true,
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    referenceNumber: 'HDFC-NEFT-CA-99214',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'CA_Retainer_Bill.pdf',
    status: 'paid',
    created_at: '2026-08-08T16:00:00Z',
    updated_at: '2026-08-08T16:00:00Z'
  },
  {
    id: 'exp_5',
    expenseDate: '2026-08-12',
    category: 'Marketing & Digital Advertising',
    description: 'Google Ads & LinkedIn B2B Developer Lead Generation Campaigns',
    vendorName: 'Google India Digital Services Pvt Ltd',
    vendorGstin: '07AAACG9616D1ZY',
    amount: 25000,
    gstApplicable: true,
    taxableAmount: 21186.44,
    gstRate: 18,
    gstAmount: 3813.56,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 3813.56,
    isItcEligible: true,
    paymentMode: 'Credit Card',
    referenceNumber: 'TXN-GOOG-ADS-6629',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'Google_Ads_GST_Invoice.pdf',
    status: 'paid',
    created_at: '2026-08-12T11:20:00Z',
    updated_at: '2026-08-12T11:20:00Z'
  },
  {
    id: 'exp_6',
    expenseDate: '2026-08-14',
    category: 'Staff Welfare, Meals & Refreshments',
    description: 'Bi-weekly sprint retrospective team lunch and pantry coffee/refreshments',
    vendorName: 'Cafe Coffee Day & Silver Springs Pantry',
    amount: 4850,
    gstApplicable: true,
    taxableAmount: 4619.05,
    gstRate: 5,
    gstAmount: 230.95,
    cgstAmount: 115.48,
    sgstAmount: 115.48,
    igstAmount: 0,
    isItcEligible: false,
    paymentMode: 'UPI',
    referenceNumber: 'UPI-CCD-990145',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'Pantry_Refreshments_Receipt.pdf',
    status: 'paid',
    created_at: '2026-08-14T17:00:00Z',
    updated_at: '2026-08-14T17:00:00Z'
  },
  {
    id: 'exp_7',
    expenseDate: '2026-07-28',
    category: 'Bank Charges & Payment Gateway Fees',
    description: 'Razorpay PG Settlement Fees & GST for July 2026 Inbound Client Invoices',
    vendorName: 'Razorpay Software Pvt Ltd',
    vendorGstin: '29AAACR3716A1ZV',
    amount: 4130,
    gstApplicable: true,
    taxableAmount: 3500,
    gstRate: 18,
    gstAmount: 630,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 630,
    isItcEligible: true,
    paymentMode: 'Net Banking',
    referenceNumber: 'RZP-SETTLE-JUL26-01',
    attachmentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    attachmentName: 'Razorpay_GST_Invoice_Jul.pdf',
    status: 'paid',
    created_at: '2026-07-28T18:00:00Z',
    updated_at: '2026-07-28T18:00:00Z'
  }
];

// =============================================================================
// PHASE 10: INITIAL STAFF MASTER (EMPLOYEE PROFILES)
// =============================================================================
export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'emp_1',
    employeeId: 'FFC-EMP-001',
    fullName: 'Manoj Satapathy',
    email: 'manoj@fusionforge.io',
    phone: '+91 90040 77126',
    designation: 'Engineering Director & Principal Architect',
    department: 'Engineering',
    joiningDate: '2024-01-01',
    panNumber: 'AALFF1234F',
    bankAccountName: 'Manoj Satapathy',
    bankName: 'HDFC Bank Ltd',
    bankAccountNumber: '50100455881234',
    bankIfsc: 'HDFC0001234',
    baseSalary: 120000,
    hraAllowance: 40000,
    specialAllowance: 20000,
    pfApplicable: true,
    esiApplicable: false,
    tdsApplicable: true,
    isActive: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 'emp_2',
    employeeId: 'FFC-EMP-002',
    fullName: 'Amit Sharma',
    email: 'amit.sharma@fusionforge.io',
    phone: '+91 98230 44551',
    designation: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    joiningDate: '2024-06-15',
    panNumber: 'BKPPS9901A',
    bankAccountName: 'Amit Sharma',
    bankName: 'ICICI Bank',
    bankAccountNumber: '002101556677',
    bankIfsc: 'ICIC0000021',
    baseSalary: 75000,
    hraAllowance: 25000,
    specialAllowance: 10000,
    pfApplicable: true,
    esiApplicable: false,
    tdsApplicable: true,
    isActive: true,
    created_at: '2024-06-15T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 'emp_3',
    employeeId: 'FFC-EMP-003',
    fullName: 'Priya Patel',
    email: 'priya.patel@fusionforge.io',
    phone: '+91 97245 66778',
    designation: 'Lead UI/UX & Product Designer',
    department: 'Design & UI/UX',
    joiningDate: '2025-01-10',
    panNumber: 'CDEPP4455B',
    bankAccountName: 'Priya Patel',
    bankName: 'State Bank of India',
    bankAccountNumber: '33889911223',
    bankIfsc: 'SBIN0001234',
    baseSalary: 60000,
    hraAllowance: 20000,
    specialAllowance: 8000,
    pfApplicable: true,
    esiApplicable: false,
    tdsApplicable: true,
    isActive: true,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 'emp_4',
    employeeId: 'FFC-EMP-004',
    fullName: 'Rakesh Verma',
    email: 'rakesh.verma@fusionforge.io',
    phone: '+91 91556 77889',
    designation: 'DevOps & Cloud Systems Engineer',
    department: 'DevOps & Cloud',
    joiningDate: '2025-04-01',
    panNumber: 'DFGVR1122C',
    bankAccountName: 'Rakesh Verma',
    bankName: 'Axis Bank',
    bankAccountNumber: '9180200445566',
    bankIfsc: 'UTIB0000123',
    baseSalary: 55000,
    hraAllowance: 18000,
    specialAllowance: 7000,
    pfApplicable: true,
    esiApplicable: false,
    tdsApplicable: true,
    isActive: true,
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z'
  },
  {
    id: 'emp_5',
    employeeId: 'FFC-EMP-005',
    fullName: 'Sneha Mohanty',
    email: 'sneha.mohanty@fusionforge.io',
    phone: '+91 94370 12345',
    designation: 'QA Automation & Release Engineer',
    department: 'Engineering',
    joiningDate: '2025-07-01',
    panNumber: 'EGHMH3344D',
    bankAccountName: 'Sneha Mohanty',
    bankName: 'HDFC Bank Ltd',
    bankAccountNumber: '5010099887766',
    bankIfsc: 'HDFC0001234',
    baseSalary: 45000,
    hraAllowance: 15000,
    specialAllowance: 5000,
    pfApplicable: true,
    esiApplicable: false,
    tdsApplicable: false,
    isActive: true,
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z'
  }
];

// =============================================================================
// PHASE 10: INITIAL SALARY & PAYROLL RECORDS (MONTHLY PAYSLIPS)
// =============================================================================
export const INITIAL_SALARY_RECORDS: SalaryRecord[] = [
  // August 2026 Payroll (Current Month)
  {
    id: 'sal_2026_08_01',
    employeeId: 'emp_1',
    employeeName: 'Manoj Satapathy',
    employeeCode: 'FFC-EMP-001',
    designation: 'Engineering Director & Principal Architect',
    department: 'Engineering',
    period: 'August 2026',
    periodMonth: '08',
    periodYear: 2026,
    basicSalary: 120000,
    hra: 40000,
    specialAllowance: 20000,
    bonusOrIncentive: 10000,
    grossSalary: 190000,
    providentFund: 14400,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 15000,
    advanceDeduction: 0,
    totalDeductions: 29600,
    netSalary: 160400,
    paymentDate: '2026-08-31',
    paymentStatus: 'processing',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'NEFT-SAL-AUG26-001',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-08-001',
    notes: 'August 2026 monthly payroll with Q2 sprint leadership incentive.',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'sal_2026_08_02',
    employeeId: 'emp_2',
    employeeName: 'Amit Sharma',
    employeeCode: 'FFC-EMP-002',
    designation: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    period: 'August 2026',
    periodMonth: '08',
    periodYear: 2026,
    basicSalary: 75000,
    hra: 25000,
    specialAllowance: 10000,
    bonusOrIncentive: 5000,
    grossSalary: 115000,
    providentFund: 9000,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 6500,
    advanceDeduction: 0,
    totalDeductions: 15700,
    netSalary: 99300,
    paymentDate: '2026-08-31',
    paymentStatus: 'processing',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'NEFT-SAL-AUG26-002',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-08-002',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'sal_2026_08_03',
    employeeId: 'emp_3',
    employeeName: 'Priya Patel',
    employeeCode: 'FFC-EMP-003',
    designation: 'Lead UI/UX & Product Designer',
    department: 'Design & UI/UX',
    period: 'August 2026',
    periodMonth: '08',
    periodYear: 2026,
    basicSalary: 60000,
    hra: 20000,
    specialAllowance: 8000,
    bonusOrIncentive: 4000,
    grossSalary: 92000,
    providentFund: 7200,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 4500,
    advanceDeduction: 0,
    totalDeductions: 11900,
    netSalary: 80100,
    paymentDate: '2026-08-31',
    paymentStatus: 'processing',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'NEFT-SAL-AUG26-003',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-08-003',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'sal_2026_08_04',
    employeeId: 'emp_4',
    employeeName: 'Rakesh Verma',
    employeeCode: 'FFC-EMP-004',
    designation: 'DevOps & Cloud Systems Engineer',
    department: 'DevOps & Cloud',
    period: 'August 2026',
    periodMonth: '08',
    periodYear: 2026,
    basicSalary: 55000,
    hra: 18000,
    specialAllowance: 7000,
    bonusOrIncentive: 3000,
    grossSalary: 83000,
    providentFund: 6600,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 3500,
    advanceDeduction: 0,
    totalDeductions: 10300,
    netSalary: 72700,
    paymentDate: '2026-08-31',
    paymentStatus: 'processing',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'NEFT-SAL-AUG26-004',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-08-004',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },
  {
    id: 'sal_2026_08_05',
    employeeId: 'emp_5',
    employeeName: 'Sneha Mohanty',
    employeeCode: 'FFC-EMP-005',
    designation: 'QA Automation & Release Engineer',
    department: 'Engineering',
    period: 'August 2026',
    periodMonth: '08',
    periodYear: 2026,
    basicSalary: 45000,
    hra: 15000,
    specialAllowance: 5000,
    bonusOrIncentive: 0,
    grossSalary: 65000,
    providentFund: 5400,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 1500,
    advanceDeduction: 0,
    totalDeductions: 7100,
    netSalary: 57900,
    paymentDate: '2026-08-31',
    paymentStatus: 'processing',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'NEFT-SAL-AUG26-005',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-08-005',
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z'
  },

  // July 2026 Payroll (Settled & Paid Month)
  {
    id: 'sal_2026_07_01',
    employeeId: 'emp_1',
    employeeName: 'Manoj Satapathy',
    employeeCode: 'FFC-EMP-001',
    designation: 'Engineering Director & Principal Architect',
    department: 'Engineering',
    period: 'July 2026',
    periodMonth: '07',
    periodYear: 2026,
    basicSalary: 120000,
    hra: 40000,
    specialAllowance: 20000,
    bonusOrIncentive: 0,
    grossSalary: 180000,
    providentFund: 14400,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 14000,
    advanceDeduction: 0,
    totalDeductions: 28600,
    netSalary: 151400,
    paymentDate: '2026-07-31',
    paymentStatus: 'paid',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'HDFC-SAL-JUL26-001',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-07-001',
    created_at: '2026-07-31T17:00:00Z',
    updated_at: '2026-07-31T17:00:00Z'
  },
  {
    id: 'sal_2026_07_02',
    employeeId: 'emp_2',
    employeeName: 'Amit Sharma',
    employeeCode: 'FFC-EMP-002',
    designation: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    period: 'July 2026',
    periodMonth: '07',
    periodYear: 2026,
    basicSalary: 75000,
    hra: 25000,
    specialAllowance: 10000,
    bonusOrIncentive: 0,
    grossSalary: 110000,
    providentFund: 9000,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 6000,
    advanceDeduction: 0,
    totalDeductions: 15200,
    netSalary: 94800,
    paymentDate: '2026-07-31',
    paymentStatus: 'paid',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'HDFC-SAL-JUL26-002',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-07-002',
    created_at: '2026-07-31T17:00:00Z',
    updated_at: '2026-07-31T17:00:00Z'
  },
  {
    id: 'sal_2026_07_03',
    employeeId: 'emp_3',
    employeeName: 'Priya Patel',
    employeeCode: 'FFC-EMP-003',
    designation: 'Lead UI/UX & Product Designer',
    department: 'Design & UI/UX',
    period: 'July 2026',
    periodMonth: '07',
    periodYear: 2026,
    basicSalary: 60000,
    hra: 20000,
    specialAllowance: 8000,
    bonusOrIncentive: 0,
    grossSalary: 88000,
    providentFund: 7200,
    esi: 0,
    professionalTax: 200,
    tdsDeduction: 4000,
    advanceDeduction: 0,
    totalDeductions: 11400,
    netSalary: 76600,
    paymentDate: '2026-07-31',
    paymentStatus: 'paid',
    paymentMode: 'Bank Transfer (NEFT/RTGS)',
    transactionReference: 'HDFC-SAL-JUL26-003',
    payslipGenerated: true,
    payslipNumber: 'PAYSLIP-2026-07-003',
    created_at: '2026-07-31T17:00:00Z',
    updated_at: '2026-07-31T17:00:00Z'
  }
];

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

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log_01',
    user_id: 'user_super_admin',
    user_email: 'admin@fusionforgecreation.com',
    user_role: 'super_admin',
    action: 'CREATE' as const,
    table_name: 'invoices',
    record_id: 'inv_03',
    details: 'Created Tax Invoice FFC-2026-0003 for JP MODATEX LLP with authoritative IGST (18%) calculation.',
    created_at: '2026-08-10T10:30:00Z'
  },
  {
    id: 'log_02',
    user_id: 'user_accountant',
    user_email: 'finance@fusionforgecreation.com',
    user_role: 'accountant',
    action: 'PAYMENT_RECORD' as const,
    table_name: 'payments',
    record_id: 'pay_01',
    details: 'Recorded NEFT settlement ₹1,80,000 for Invoice FFC-2026-0001 (Apex Fintech Solutions).',
    created_at: '2026-08-12T14:15:00Z'
  },
  {
    id: 'log_03',
    user_id: 'user_admin',
    user_email: 'operations@fusionforgecreation.com',
    user_role: 'admin',
    action: 'CREATE' as const,
    table_name: 'quotations',
    record_id: 'quote_01',
    details: 'Dispatched commercial quotation QTN-2026-0001 to JP MODATEX LLP for ₹64,900.',
    created_at: '2026-08-01T11:00:00Z'
  }
];

// =============================================================================
// PHASE 12: INITIAL CENTRAL NOTIFICATIONS & EMAIL DISPATCH LOGS
// =============================================================================

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    type: 'lead_received',
    category: 'leads',
    title: '🚨 New Lead Enquiry Received',
    message: 'Dr. Sameer Sen from Nexus HealthTech India submitted an enterprise enquiry for "Nexus Telehealth Consultation Suite" (Budget: ₹3L - ₹5L).',
    link: 'enquiries',
    entity_type: 'enquiry',
    entity_id: 'enq_02',
    priority: 'urgent',
    is_read: false,
    created_at: '2026-08-16T18:45:00Z',
    target_role: 'all',
    metadata: {
      clientName: 'Dr. Sameer Sen',
      company: 'Nexus HealthTech India',
      email: 'sameer.sen@nexushealth.in',
      serviceCategory: 'mobile_app',
      budgetRange: '₹3,00,000 - ₹5,00,000'
    },
    event_key: 'lead_enq_02'
  },
  {
    id: 'notif_02',
    type: 'payment_received',
    category: 'financials',
    title: '💰 Payment Settlement Received',
    message: 'Recorded NEFT settlement of ₹1,80,000 for Tax Invoice FFC-2026-0001 (Apex Fintech Solutions Pvt. Ltd.).',
    link: 'payments',
    entity_type: 'payment',
    entity_id: 'pay_01',
    priority: 'high',
    is_read: false,
    created_at: '2026-08-16T14:15:00Z',
    target_role: 'all',
    metadata: {
      receiptNumber: 'REC-2026-0001',
      invoiceNumber: 'FFC-2026-0001',
      amount: 180000,
      clientCompany: 'Apex Fintech Solutions Pvt. Ltd.'
    },
    event_key: 'payment_pay_01'
  },
  {
    id: 'notif_03',
    type: 'payment_receipt_sent',
    category: 'financials',
    title: '✉️ Official Payment Receipt Dispatched',
    message: 'Official Payment Receipt REC-2026-0001 dispatched from admin@fusionforgecreation.com to arvind@apexfintech.io.',
    link: 'payments',
    entity_type: 'payment',
    entity_id: 'pay_01',
    priority: 'normal',
    is_read: false,
    created_at: '2026-08-16T14:16:00Z',
    target_role: 'all',
    metadata: {
      recipient: 'arvind@apexfintech.io',
      sender: 'admin@fusionforgecreation.com',
      receiptNumber: 'REC-2026-0001'
    },
    event_key: 'email_receipt_pay_01'
  },
  {
    id: 'notif_04',
    type: 'project_status_changed',
    category: 'projects',
    title: '🚀 Project Milestone Advanced',
    message: 'Project "Quantum Fleet Telematics Engine" status transitioned to "Quality Assurance" (85% Progress).',
    link: 'projects',
    entity_type: 'project',
    entity_id: 'proj_03',
    priority: 'normal',
    is_read: false,
    created_at: '2026-08-15T16:30:00Z',
    target_role: 'all',
    metadata: {
      projectTitle: 'Quantum Fleet Telematics Engine',
      clientCompany: 'Quantum Logistics & Freight',
      newStatus: 'testing_qa',
      progressPercentage: 85
    },
    event_key: 'proj_status_proj_03_testing_qa'
  },
  {
    id: 'notif_05',
    type: 'project_completed',
    category: 'projects',
    title: '🏆 Project Milestone Completed',
    message: 'Project "JP Modatex Textile ERP & Supply Chain Engine" reached 100% completion and signed off by client.',
    link: 'projects',
    entity_type: 'project',
    entity_id: 'proj_01',
    priority: 'high',
    is_read: true,
    read_at: '2026-08-14T11:00:00Z',
    created_at: '2026-08-14T10:00:00Z',
    target_role: 'all',
    metadata: {
      projectTitle: 'JP Modatex Textile ERP & Supply Chain Engine',
      clientCompany: 'JP MODATEX LLP',
      completionDate: '2026-08-14'
    },
    event_key: 'proj_completed_proj_01'
  },
  {
    id: 'notif_06',
    type: 'project_invoice_eligible',
    category: 'financials',
    title: '📋 Project Ready for Final Invoicing',
    message: 'Project "JP Modatex Textile ERP" is completed and eligible for final milestone Tax Invoice generation.',
    link: 'invoices',
    entity_type: 'project',
    entity_id: 'proj_01',
    priority: 'high',
    is_read: true,
    read_at: '2026-08-14T11:05:00Z',
    created_at: '2026-08-14T10:05:00Z',
    target_role: 'all',
    metadata: {
      projectTitle: 'JP Modatex Textile ERP & Supply Chain Engine',
      clientCompany: 'JP MODATEX LLP'
    },
    event_key: 'proj_invoice_eligible_proj_01'
  },
  {
    id: 'notif_07',
    type: 'invoice_created',
    category: 'financials',
    title: '🧾 Tax Invoice FFC-2026-0003 Generated',
    message: 'B2B GST Tax Invoice FFC-2026-0003 issued for JP MODATEX LLP (Total: ₹2,12,400 with 18% IGST under SAC 998314).',
    link: 'invoices',
    entity_type: 'invoice',
    entity_id: 'inv_03',
    priority: 'normal',
    is_read: true,
    read_at: '2026-08-10T12:00:00Z',
    created_at: '2026-08-10T10:30:00Z',
    target_role: 'all',
    metadata: {
      invoiceNumber: 'FFC-2026-0003',
      clientCompany: 'JP MODATEX LLP',
      totalAmount: 212400
    },
    event_key: 'invoice_inv_03'
  },
  {
    id: 'notif_08',
    type: 'quotation_sent',
    category: 'financials',
    title: '📄 Commercial Quotation Dispatched',
    message: 'Commercial Quotation QTN-2026-0001 dispatched from admin@fusionforgecreation.com to contact@jpmodatex.com (Total: ₹64,900).',
    link: 'quotations',
    entity_type: 'quotation',
    entity_id: 'quote_01',
    priority: 'normal',
    is_read: true,
    read_at: '2026-08-02T09:00:00Z',
    created_at: '2026-08-01T11:00:00Z',
    target_role: 'all',
    metadata: {
      quotationNumber: 'QTN-2026-0001',
      clientCompany: 'JP MODATEX LLP',
      recipient: 'contact@jpmodatex.com'
    },
    event_key: 'email_quote_quote_01'
  },
  {
    id: 'notif_09',
    type: 'gst_report_generated',
    category: 'accounting',
    title: '📊 Statutory GSTR-1 Excel Return Generated',
    message: 'Statutory 5-Sheet GSTR-1 Excel Return workbook compiled for Q2 FY 2026-27 (B2B, B2C, CDNR, HSN SAC 998314, DOCS).',
    link: 'accounting',
    entity_type: 'gst_report',
    priority: 'normal',
    is_read: false,
    created_at: '2026-08-16T12:00:00Z',
    target_role: 'all',
    metadata: {
      financialYear: '2026-27',
      period: 'Q2 (Jul - Sep 2026)',
      totalTaxLiability: 57600
    },
    event_key: 'gst_report_gstr1_q2_2026'
  },
  {
    id: 'notif_10',
    type: 'accounting_event',
    category: 'accounting',
    title: '📝 Credit Note CN-2026-0001 Issued',
    message: 'Credit Note CN-2026-0001 issued for JP MODATEX LLP against Invoice FFC-2026-0003 for scope adjustment (₹11,800 incl. IGST).',
    link: 'accounting',
    entity_type: 'credit_debit_note',
    entity_id: 'cdn_01',
    priority: 'normal',
    is_read: true,
    read_at: '2026-08-15T15:00:00Z',
    created_at: '2026-08-15T14:30:00Z',
    target_role: 'all',
    metadata: {
      noteNumber: 'CN-2026-0001',
      invoiceNumber: 'FFC-2026-0003',
      noteType: 'credit',
      totalAmount: 11800
    },
    event_key: 'cdn_cdn_01'
  },
  {
    id: 'notif_11',
    type: 'new_user',
    category: 'users',
    title: '👤 New Staff User Onboarded',
    message: 'Ananya Mishra onboarded as Staff with operational duties and restricted dashboard permissions.',
    link: 'users',
    entity_type: 'user',
    entity_id: 'user_staff',
    priority: 'low',
    is_read: true,
    read_at: '2026-08-02T10:00:00Z',
    created_at: '2026-08-01T09:00:00Z',
    target_role: 'super_admin',
    metadata: {
      userName: 'Ananya Mishra',
      userEmail: 'staff@fusionforgecreation.com',
      role: 'staff'
    },
    event_key: 'new_user_user_staff'
  },
  {
    id: 'notif_12',
    type: 'role_changed',
    category: 'users',
    title: '🛡️ Role Privilege Updated',
    message: 'Debashis Panda elevated to Administrator role with full operations & financials access.',
    link: 'users',
    entity_type: 'user',
    entity_id: 'user_admin',
    priority: 'normal',
    is_read: true,
    read_at: '2026-08-10T14:00:00Z',
    created_at: '2026-08-10T12:00:00Z',
    target_role: 'super_admin',
    metadata: {
      userName: 'Debashis Panda',
      newRole: 'admin',
      previousRole: 'editor'
    },
    event_key: 'role_changed_user_admin'
  }
];

export const INITIAL_EMAIL_LOGS: EmailLog[] = [
  {
    id: 'eml_01',
    recipient: 'contact@jpmodatex.com',
    sender: 'admin@fusionforgecreation.com',
    subject: 'Commercial Quotation: QTN-2026-0001 - JP Modatex Cloud Modernization',
    category: 'quotation',
    status: 'sent',
    message_id: 'msg_qtn_0001_88a91c',
    entity_type: 'quotation',
    entity_id: 'quote_01',
    metadata: {
      quotationNumber: 'QTN-2026-0001',
      totalAmount: 64900,
      clientName: 'Manoj Satapathy'
    },
    created_at: '2026-08-01T11:00:00Z'
  },
  {
    id: 'eml_02',
    recipient: 'contact@jpmodatex.com',
    sender: 'admin@fusionforgecreation.com',
    subject: 'Tax Invoice: FFC-2026-0003 - Fusion Forge Creation',
    category: 'invoice',
    status: 'sent',
    message_id: 'msg_inv_0003_44bf82',
    entity_type: 'invoice',
    entity_id: 'inv_03',
    metadata: {
      invoiceNumber: 'FFC-2026-0003',
      totalAmount: 212400,
      clientName: 'Manoj Satapathy'
    },
    created_at: '2026-08-10T10:35:00Z'
  },
  {
    id: 'eml_03',
    recipient: 'arvind@apexfintech.io',
    sender: 'admin@fusionforgecreation.com',
    subject: 'Payment Receipt: REC-2026-0001 for Invoice FFC-2026-0001 - Fusion Forge Creation',
    category: 'payment_receipt',
    status: 'sent',
    message_id: 'rec_msg_pay_0001_99c3a1',
    entity_type: 'payment',
    entity_id: 'pay_01',
    metadata: {
      receiptNumber: 'REC-2026-0001',
      invoiceNumber: 'FFC-2026-0001',
      amount: 180000,
      paymentMethod: 'bank_transfer'
    },
    created_at: '2026-08-16T14:16:00Z'
  },
  {
    id: 'eml_04',
    recipient: 'arvind@apexfintech.io',
    sender: 'admin@fusionforgecreation.com',
    subject: 'Project Update: Apex Financial Intelligence Platform is now TESTING QA - Fusion Forge Creation',
    category: 'project_status',
    status: 'sent',
    message_id: 'proj_msg_apex_qa_12d45e',
    entity_type: 'project',
    entity_id: 'proj_02',
    metadata: {
      projectTitle: 'Apex Financial Intelligence Platform',
      status: 'testing_qa',
      progressPercentage: 85
    },
    created_at: '2026-08-15T16:30:00Z'
  },
  {
    id: 'eml_05',
    recipient: 'contact@jpmodatex.com',
    sender: 'admin@fusionforgecreation.com',
    subject: 'Project Milestone Handover: JP Modatex Textile ERP & Supply Chain Engine is COMPLETED - Fusion Forge Creation',
    category: 'project_status',
    status: 'sent',
    message_id: 'proj_msg_jp_comp_77f89a',
    entity_type: 'project',
    entity_id: 'proj_01',
    metadata: {
      projectTitle: 'JP Modatex Textile ERP & Supply Chain Engine',
      status: 'completed',
      progressPercentage: 100
    },
    created_at: '2026-08-14T10:05:00Z'
  }
];

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

