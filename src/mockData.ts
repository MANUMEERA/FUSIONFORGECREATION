import { 
  UserProfile, 
  Client, 
  Quotation, 
  Invoice, 
  Payment, 
  ProjectEnquiry, 
  PortfolioProject 
} from './types';

export const AGENCY_CONFIG = {
  name: 'Fusion Forge Creation',
  legalName: 'Fusion Forge Creation',
  company_name: 'Fusion Forge Creation',
  tagline: 'Where Ideas Fuse With Technology',
  motto: 'INNOVATE • BUILD • AUTOMATE • GROW',
  email: 'contact@fusionforge.io',
  phone: '+91 90040 77126',
  address: 'Survey No. 274, Athal Village, Silvassa, Dadra & Nagar Haveli - 396230',
  city: 'Silvassa',
  state: 'Dadra and Nagar Haveli and Daman and Diu',
  state_code: '26',
  postalCode: '396230',
  gstin: '26AALFF1234F1Z5',
  pan: 'AALFF1234F',
  jurisdiction: 'Silvassa Jurisdiction',
  sacCode: '998314',
  logo_url: '/logo.svg',
  signature_url: '/signatures/authorized_signatory.png',
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
    gstin: '',
    pan: 'AABFJ1234K',
    placeOfSupply: '24-Gujarat',
    billingAddress: {
      street: 'Survey No. 42, GIDC Industrial Estate, Sachin',
      city: 'Surat',
      state: 'Gujarat',
      stateCode: '24',
      postalCode: '394230',
      country: 'India'
    },
    currency: 'INR',
    status: 'active',
    totalBilled: 180000,
    totalPaid: 180000,
    notes: 'Textile manufacturing process ERP and inventory automation client.',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-08-12T14:30:00Z'
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
    billingAddress: {
      street: 'Tower B, 14th Floor, BKC',
      city: 'Mumbai',
      state: 'Maharashtra',
      stateCode: '27',
      postalCode: '400051',
      country: 'India'
    },
    currency: 'INR',
    status: 'active',
    totalBilled: 649000,
    totalPaid: 649000,
    notes: 'Enterprise fintech dashboard & real-time analytics portal client.',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-08-01T14:30:00Z'
  },
  {
    id: 'client_2',
    name: 'Dr. Sameer Sen',
    contactPerson: 'Dr. Sameer Sen',
    companyName: 'Nexus HealthTech India',
    email: 'sameer@nexushealth.co',
    phone: '+91 99222 44556',
    address: '45 Koramangala 5th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    pincode: '560095',
    postalCode: '560095',
    gstin: '29AAACN8877K1Z3',
    pan: 'AAACN8877K',
    placeOfSupply: '29-Karnataka',
    billingAddress: {
      street: '45 Koramangala 5th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      stateCode: '29',
      postalCode: '560095',
      country: 'India'
    },
    currency: 'INR',
    status: 'active',
    totalBilled: 413000,
    totalPaid: 200000,
    notes: 'Telemedicine mobile app suite.',
    createdAt: '2026-03-15T11:20:00Z',
    updatedAt: '2026-08-10T09:15:00Z'
  },
  {
    id: 'client_3',
    name: 'Sunita Rao',
    contactPerson: 'Sunita Rao',
    companyName: 'Quantum Logistics & Freight',
    email: 'sunita@quantumfreight.in',
    phone: '+91 97333 88990',
    address: 'Plot 24, Infocity Avenue',
    city: 'Bhubaneswar',
    state: 'Odisha',
    stateCode: '21',
    pincode: '751024',
    postalCode: '751024',
    gstin: '21AABPQ9988C1Z2',
    pan: 'AABPQ9988C',
    placeOfSupply: '21-Odisha',
    billingAddress: {
      street: 'Plot 24, Infocity Avenue',
      city: 'Bhubaneswar',
      state: 'Odisha',
      stateCode: '21',
      postalCode: '751024',
      country: 'India'
    },
    currency: 'INR',
    status: 'active',
    totalBilled: 295000,
    totalPaid: 295000,
    notes: 'Fleet tracking & GPS telematics.',
    createdAt: '2026-05-02T16:00:00Z',
    updatedAt: '2026-07-28T12:00:00Z'
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
    sellerAddress: 'Suite 504, Tech Park Cyber City, Patia, Bhubaneswar, Odisha - 751024',
    sellerGstin: '21AAACF9876B1Z5',
    sellerState: 'Odisha',
    sellerStateCode: '21',

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
    sellerAddress: 'Suite 504, Tech Park Cyber City, Patia, Bhubaneswar, Odisha - 751024',
    sellerGstin: '21AAACF9876B1Z5',
    sellerState: 'Odisha',
    sellerStateCode: '21',
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
    sellerAddress: 'Suite 504, Tech Park Cyber City, Patia, Bhubaneswar, Odisha - 751024',
    sellerGstin: '21AAACF9876B1Z5',
    sellerState: 'Odisha',
    sellerStateCode: '21',
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

export const INITIAL_MANAGED_PROJECTS = [
  {
    id: 'proj_1',
    title: 'Apex Financial Intelligence Platform',
    clientId: 'client_1',
    clientName: 'Apex Fintech Solutions Pvt. Ltd.',
    category: 'Web Application',
    status: 'completed' as const,
    startDate: '2026-01-15',
    deadline: '2026-04-30',
    budget: 649000,
    progressPercentage: 100,
    techStack: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    deliverables: ['Design System', 'Analytics Engine', 'WebSocket Live Feed', 'Admin Dashboard'],
    isPublic: true,
    notes: 'Delivered ahead of schedule. 100% IP code handed over.'
  },
  {
    id: 'proj_2',
    title: 'Nexus Telehealth Consultation Suite',
    clientId: 'client_2',
    clientName: 'Nexus HealthTech India',
    category: 'Mobile App',
    status: 'in_progress' as const,
    startDate: '2026-03-20',
    deadline: '2026-09-15',
    budget: 413000,
    progressPercentage: 75,
    techStack: ['React Native', 'Node.js', 'WebRTC', 'Supabase', 'PostgreSQL'],
    deliverables: ['Doctor Portal', 'Patient Mobile App', 'WebRTC Telehealth Room', 'Prescription PDF Generator'],
    isPublic: true,
    notes: 'Beta milestone 1 released and approved.'
  },
  {
    id: 'proj_3',
    title: 'Quantum Fleet Telematics & IoT Engine',
    clientId: 'client_3',
    clientName: 'Quantum Logistics & Freight',
    category: 'Enterprise Cloud',
    status: 'completed' as const,
    startDate: '2026-05-10',
    deadline: '2026-07-25',
    budget: 295000,
    progressPercentage: 100,
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets'],
    deliverables: ['Live GPS Tracking', 'Driver Telematics App', 'Automated GST Dispatch Invoices'],
    isPublic: true,
    notes: 'Deployed with auto-scaling container infrastructure.'
  },
  {
    id: 'proj_4',
    title: 'Aura EcoLiving D2C Headless Commerce',
    clientId: 'client_1',
    clientName: 'Aura EcoLiving Ltd.',
    category: 'Web Application',
    status: 'planning' as const,
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
*/

