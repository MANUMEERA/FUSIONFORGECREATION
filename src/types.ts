export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'editor' 
  | 'accountant' 
  | 'staff' 
  | 'project_manager' 
  | 'client'
  | string;

export interface PermissionDefinition {
  code: string;
  name: string;
  category: 'Core' | 'Financials' | 'Content' | 'System' | 'Security';
  description: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  isSystem: boolean;
  permissions: string[]; // list of permission codes
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  name?: string; // alias for full_name for backward compatibility
  role: UserRole;
  phone?: string;
  is_active: boolean;
  mfa_enabled?: boolean;
  two_factor_secret?: string;
  two_factor_confirmed?: boolean;
  two_factor_auth_type?: 'google_authenticator' | 'totp' | 'sms';
  recovery_codes?: string[];
  clientId?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface StateUtMasterItem {
  id?: string;
  code: string;
  name: string;
  is_ut_without_legislature: boolean;
  is_union_territory: boolean;
  selectable: boolean;
  is_legacy: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SocialChannelItem {
  id: string;
  platform: 'linkedin' | 'github' | 'whatsapp' | 'twitter' | 'instagram' | 'youtube' | 'facebook' | 'discord' | 'telegram' | 'medium' | 'twitch' | 'custom' | string;
  name: string;
  url: string;
  active: boolean;
  color?: string;
  customIcon?: string;
}

export interface WebsiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
  support_hours: string;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  social_channels?: SocialChannelItem[];
  maintenance_mode: boolean;
  updated_at: string;
}

export interface ServicePricePreset {
  id: string;
  service_name: string;
  name?: string; // alias for service_name
  description: string;
  sac_code?: string;
  sacCode?: string;
  default_price: number;
  rate?: number; // alias for default_price
  gst_applicable: boolean;
  gst_rate: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentTermItem {
  id: string;
  name: string;
  description?: string;
  is_default?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentNumberConfig {
  document_type: 'invoice' | 'quotation' | 'credit_note' | 'debit_note';
  prefix: string; // e.g. "INV" | "QTN" | "CN" | "DN"
  company_code: string; // e.g. "FFC"
  include_year: boolean;
  year_format: 'YYYY' | 'YY' | 'YYYY-YY' | 'FY';
  starting_sequence: number; // e.g. 10001 or 1
  current_sequence: number; // e.g. 10001
  separator: string; // e.g. "/" or "-"
  style: 'standard' | 'shorter' | 'custom' | 'fiscal' | 'compact' | 'sequential';
  custom_pattern?: string;
}

export interface SellerProfile {
  id?: string;
  company_name: string;
  tagline: string;
  website_url?: string;
  website?: string;
  websiteUrl?: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  state_code: string;
  jurisdiction: string;
  logo_url: string;
  signature_url: string;
  stamp_url?: string;
  stampUrl?: string;
  msme_number?: string;
  msmeNumber?: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  terms_conditions: string;
  quotation_terms?: string | string[];
  invoice_terms?: string | string[];
  delay_interest_clause?: string;
  delayInterestClause?: string;
  payment_delay_interest_rate?: number;
  reverse_charge_default?: 'Yes' | 'No' | string;
  default_quotation_validity_days?: number;
  upi_id?: string;
  upiId?: string;
  gst_compliance_active?: boolean;
  gstComplianceActive?: boolean;
  
  // Phase 11: LUT & SEZ Compliance Config
  lut_arn?: string;
  lutArn?: string;
  lutNumber?: string;
  lut_number?: string;
  lutFinancialYear?: string;
  lut_financial_year?: string;
  lutDate?: string;
  lut_date?: string;
  lutExpiryDate?: string;
  lut_expiry_date?: string;
  default_invoice_type?: string;
  defaultInvoiceType?: string;

  payment_terms?: PaymentTermItem[];
  numbering_configs?: {
    invoice: DocumentNumberConfig;
    quotation: DocumentNumberConfig;
    credit_note?: DocumentNumberConfig;
    debit_note?: DocumentNumberConfig;
  };

  // Compatibility & metadata fields
  name?: string;
  legal_name?: string;
  legalName?: string;
  trade_name?: string;
  pan?: string;
  state_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  pincode?: string;
  sac_code?: string;
  sacCode?: string;
  terms?: string[];
  social_channels?: SocialChannelItem[];
  socialChannels?: SocialChannelItem[];
  social_links?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    facebook?: string;
    discord?: string;
    telegram?: string;
    medium?: string;
    [key: string]: string | undefined;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    facebook?: string;
    discord?: string;
    telegram?: string;
    medium?: string;
    [key: string]: string | undefined;
  };
  bankDetails?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
  default_bank_account?: {
    account_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
    branch: string;
    upi_id: string;
  };
  created_at?: string;
  updated_at?: string;
}

export type AgencyConfig = SellerProfile;

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  user_role: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE' | 'RESTORE' | 'PAYMENT_RECORD' | 'AUTH_LOGIN' | 'CALCULATE_GST' | 'ROLE_CHANGE' | 'PERMISSION_CHANGE' | 'STATUS_CHANGE' | 'FINANCIAL_CHANGE' | 'EMAIL_DISPATCH' | 'DOCUMENT_GENERATE' | 'EXPORT_DATA' | string;
  table_name: string;
  record_id: string;
  details: string;
  ip_address?: string;
  created_at: string;
}

export interface Client {
  id: string;
  name: string; // Contact person name
  contactPerson?: string;
  companyName: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  pincode?: string;
  postalCode?: string;
  gstin?: string;
  pan?: string;
  placeOfSupply?: string;
  placeOfSupplyCode?: string;
  isGstRegistered?: boolean;
  isUrp?: boolean;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    stateCode?: string;
  };
  // Shipping Address Details
  sameAsBilling?: boolean;
  shippingName?: string;
  shippingCompany?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingStateCode?: string;
  shippingPincode?: string;
  shippingGstin?: string;
  currency: 'INR' | 'USD' | 'EUR';
  status: 'active' | 'disabled' | 'inactive' | 'lead' | 'deleted';
  isDeleted?: boolean;
  deletedAt?: string;
  totalBilled: number;
  totalPaid: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ItemCategoryType = 
  | 'Hardware & Office Equipment' 
  | 'Cloud Infrastructure & Servers' 
  | 'Software Licenses & Subscriptions' 
  | 'Networking & Telecom' 
  | 'Office Supplies & Consumables' 
  | 'Professional Services' 
  | 'Contract Labor' 
  | string;

export interface LineItem {
  id: string;
  invoice_id?: string;
  goodsItemId?: string;
  description: string;
  sacCode?: string;
  hsnSacCode?: string;
  unit?: string;
  quantity: number;
  rate: number;
  unit_price?: number;
  gstRate?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  amount: number;
  totalAmount?: number;
  total_price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sac_code?: string;
  created_at: string;
  updated_at: string;
}

export type GSTType = 'cgst_sgst' | 'cgst_utgst' | 'igst' | 'none';
export type QuoteStatus = 
  | 'draft' 
  | 'sent' 
  | 'pending'
  | 'order_received' 
  | 'approved' 
  | 'converted' 
  | 'rejected' 
  | 'cancelled' 
  | 'closed'
  | 'Draft' 
  | 'Sent' 
  | 'Pending' 
  | 'Order Received' 
  | 'Approved' 
  | 'Converted' 
  | 'Rejected' 
  | 'Cancelled' 
  | 'Closed';

export interface Quotation {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAddress?: string;
  clientGstin?: string;
  sellerStateCode?: string;
  buyerStateCode?: string;
  placeOfSupply?: string;
  sameAsBilling?: boolean;
  shippingName?: string;
  shippingCompany?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingStateCode?: string;
  shippingPincode?: string;
  shippingGstin?: string;
  supplyType?: 'INTRA_STATE' | 'INTER_STATE' | 'EXEMPT';
  taxLabel?: string;
  title: string;
  projectScope: string;
  issueDate: string;
  validUntil: string;
  currency: 'INR' | 'USD' | 'EUR';
  items: LineItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxableAmount: number;
  gstType: GSTType;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  utgstAmount?: number;
  igstAmount: number;
  totalAmount: number;
  notes: string;
  termsAndConditions: string[];
  paymentTerms?: string;
  gstApplicable?: boolean;
  emailSentAt?: string;
  emailSentBy?: string;
  status: QuoteStatus;
  convertedInvoiceId?: string;
  isIncompleteLeadDraft?: boolean;
  sourceEnquiryId?: string;
  sourceLeadName?: string;
  sourceLeadBudget?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  // DB Schema Column Parity
  quotation_number?: string;
  client_id?: string;
  issue_date?: string;
  valid_until?: string;
  discount?: number;
  tax_rate?: number;
  gst_applicable?: boolean;
  taxable_amount?: number;
  tax_amount?: number;
  grand_total?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export type InvoiceStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  quoteId?: string;
  quoteNumber?: string;
  projectId?: string;
  projectTitle?: string;
  projectStatusAtBilling?: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientGstin?: string;
  clientAddress: string;
  
  // Explicit Seller details
  sellerName?: string;
  sellerAddress?: string;
  sellerGstin?: string;
  sellerState?: string;
  sellerStateCode?: string;

  // Explicit Buyer details
  buyerCompany?: string;
  buyerName?: string;
  buyerAddress?: string;
  buyerGstin?: string;
  buyerState?: string;
  buyerStateCode?: string;

  // Shipping details
  sameAsBilling?: boolean;
  shippingName?: string;
  shippingCompany?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingStateCode?: string;
  shippingPincode?: string;
  shippingGstin?: string;

  // Reverse Charge (RCM)
  reverseCharge?: 'Yes' | 'No' | boolean;
  reverse_charge?: 'Yes' | 'No' | boolean;

  // Phase 11: Statutory Invoice Type & LUT Details
  invoiceType?: 'Regular' | 'SEZ Supply with Tax' | 'SEZ Supply without Tax' | 'Deemed Exports';
  invoice_type?: string;
  lutArn?: string;
  lut_arn?: string;
  lutFinancialYear?: string;
  lut_financial_year?: string;

  // Linked Credit / Debit Notes
  creditNoteIds?: string[];
  debitNoteIds?: string[];

  // E-Invoice Statutory Fields
  arn?: string;
  ackNo?: string;
  acknowledgement_number?: string;
  ackDate?: string;
  acknowledgement_date?: string;
  irn?: string;
  signedQrData?: string;
  qrCodeUrl?: string;

  supplyType?: 'INTRA_STATE' | 'INTER_STATE' | 'EXEMPT';
  taxLabel?: string;
  title: string;
  issueDate: string;
  dueDate: string;
  currency: 'INR' | 'USD' | 'EUR';
  items: LineItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxableAmount: number;
  totalTaxableValue?: number;
  gstType: GSTType;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  utgstAmount?: number;
  igstAmount: number;
  totalTax?: number;
  totalAmount: number;
  amountInWords?: string;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  
  // Database Column snake_case Parity
  invoice_number?: string;
  client_id?: string;
  issue_date?: string;
  due_date?: string;
  taxable_amount?: number;
  gst_applicable?: boolean;
  tax_rate?: number;
  seller_gstin?: string;
  seller_state_code?: string;
  buyer_gstin?: string;
  buyer_state_code?: string;
  place_of_supply?: string;
  placeOfSupply?: string;
  cgst_amount?: number;
  sgst_amount?: number;
  utgst_amount?: number;
  igst_amount?: number;
  tax_amount?: number;
  grand_total?: number;
  paid_amount?: number;
  is_deleted?: boolean;
  deleted_at?: string;
  deleted_by?: string;
  created_at?: string;
  updated_at?: string;

  paymentTerms?: string;
  bankDetails?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'upi' | 'cheque' | 'credit_card' | 'other';

export interface PaymentEmailStatus {
  sent_at?: string;
  sentAt?: string;
  recipient: string;
  status: 'sent' | 'failed' | 'pending' | 'not_sent';
  error?: string;
  messageId?: string;
  sentBy?: string;
}

export interface Payment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientCompany?: string;
  clientName: string;
  clientEmail?: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: PaymentMethod | string;
  transactionReference?: string;
  transactionRef?: string;
  notes?: string;
  recordedBy?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;

  // Phase 8: Email Receipt tracking & Supabase fields
  emailStatus?: PaymentEmailStatus;
  email_status?: string;
  email_sent_at?: string;
  email_recipient?: string;
  email_error?: string;
  email_message_id?: string;

  // DB snake_case parity
  invoice_id?: string;
  payment_date?: string;
  payment_method?: string;
  reference_number?: string;
  transaction_ref?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed' | 'new' | 'contacted' | 'in_discussion' | 'in_review' | 'quoted' | 'proposal_sent' | 'won' | 'lost' | 'closed';

export interface ProjectEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  company_name?: string;
  gstin?: string;
  gst_number?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  service?: string;
  serviceCategory?: 'web_development' | 'mobile_app' | 'backend_api' | 'database_solutions' | 'ui_ux_design' | 'full_stack_enterprise' | string;
  message?: string;
  budgetRange?: string;
  timeline?: string;
  estimatedTimeline?: string;
  projectDescription?: string;
  featuresRequired?: string[];
  source?: 'website_form' | 'cost_estimator' | string;
  status: EnquiryStatus;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export type Enquiry = ProjectEnquiry;

export interface PortfolioProject {
  id: string;
  title: string;
  slug?: string;
  clientName: string;
  category: string;
  summary: string;
  deliverables: string[];
  techStack: string[];
  bannerGradient?: string;
  bannerImage?: string;
  featured?: boolean;
  liveUrl?: string;
}

export interface AgencyService {
  id: string;
  title: string;
  slug?: string;
  short_description?: string;
  description: string;
  icon?: string;
  image_url?: string;
  features?: string[];
  order_index?: number;
  orderIndex?: number;
  is_active?: boolean;
  isActive?: boolean;
  sort_order?: number;
  category?: string;
  startingPrice?: number;
  sacCode?: string;
  deliverables?: string[];
  active?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';

export interface ProjectStatusHistoryItem {
  id: string;
  projectId: string;
  previousStatus?: string;
  newStatus: ProjectStatus | string;
  changedBy: string;
  changedByEmail?: string;
  notes?: string;
  emailSentToClient?: boolean;
  clientEmail?: string;
  timestamp: string;
  messageId?: string;
}

export interface CompletedWorkRecord {
  id: string;
  clientName: string; // Party / client name
  projectTitle: string; // Project / work title
  workCategory: string; // Work category
  completionDate: string; // Completion date (YYYY-MM-DD)
  technologyType: string[]; // Technology / type
  publicUrl?: string; // Public URL where applicable
  webAppUrl?: string; // Web application URL
  softwareUrl?: string; // Software URL
  mobileAppInfo?: string; // Mobile app information (Play Store / App Store)
  shortDescription: string; // Short description
  deliverablesSummary?: string[]; // Deliverables summary
  sourceProjectId?: string; // Optional link to managed project
  isVerified?: boolean; // Internal verification flag
  createdBy?: string;
  createdAt: string;
  updatedAt: string;

  // Supabase snake_case Parity
  client_name?: string;
  project_title?: string;
  work_category?: string;
  completion_date?: string;
  technology_type?: string[];
  public_url?: string;
  web_app_url?: string;
  software_url?: string;
  mobile_app_info?: string;
  short_description?: string;
  deliverables_summary?: string[];
  source_project_id?: string;
  is_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProjectServiceType = 'hostinger' | 'supabase' | 'resend' | 'aws' | 'cloudflare' | 'github' | 'firebase' | 'vercel' | 'custom' | string;

export type ProjectCategory = 'custom_software' | 'web_application' | 'mobile_app' | 'enterprise_erp' | 'ai_integration' | 'ecommerce' | 'cloud_infrastructure' | string;

export interface ProjectServiceCredential {
  id: string;
  serviceName: string; // e.g. 'Hostinger SMTP Mailbox', 'Supabase Database & Auth', 'Resend Transactional'
  serviceType: ProjectServiceType;
  userOrEmail: string; // Email, username, or client account ID
  passwordOrSecret?: string; // Password, secret key, or token
  serverOrHost?: string; // Host/URL (e.g. smtp.hostinger.com:465, https://xxx.supabase.co)
  notes?: string; // Additional documentation, port, or recovery notes
  created_at?: string;
  updated_at?: string;
}

export interface ManagedProject {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  client_name?: string;
  image_url?: string;
  project_url?: string;
  technologies?: string[] | string;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  contactPerson?: string; // Primary contact person
  contactMobile?: string; // Mobile / WhatsApp phone number
  domainName?: string; // Primary domain name / URL
  category?: string;
  status: ProjectStatus;
  startDate?: string;
  deadline?: string;
  completionDate?: string;
  budget?: number;
  progressPercentage?: number;
  techStack: string[];
  deliverables: string[];
  isPublic?: boolean;
  showInPortfolio?: boolean;
  notes?: string;
  publicUrl?: string;
  webAppUrl?: string;
  softwareUrl?: string;
  mobileAppInfo?: string;
  credentialsVault?: ProjectServiceCredential[]; // Secure credentials vault synced to Supabase
  features?: string[]; // Flexible dynamic feature integrations (e.g. Hostinger, Supabase, Resend, Auth, WhatsApp, AI)
  statusHistory?: ProjectStatusHistoryItem[];
  lastEmailSentAt?: string;
  lastEmailStatus?: string;
  invoicedAmount?: number;
  invoicedIds?: string[];
  isCompletedWorkArchived?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TechnologyItem {
  id: string;
  name: string;
  category: string;
  logo_url?: string;
  logoUrl?: string;
  is_active?: boolean;
  isActive?: boolean;
  sort_order?: number;
  description?: string;
  proficiency?: number; // 0 - 100
  isFeatured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TestimonialItem {
  id: string;
  client_name?: string;
  client_title?: string;
  company_name?: string;
  content?: string;
  rating: number;
  image_url?: string;
  is_featured?: boolean;
  isFeatured?: boolean;
  is_active?: boolean;
  name?: string;
  clientName?: string;
  role?: string;
  company?: string;
  quote?: string;
  avatar?: string;
  avatarUrl?: string;
  avatar_url?: string;
  projectName?: string;
  isApproved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  is_active?: boolean;
  isActive?: boolean;
  sort_order?: number;
  order_index?: number;
  orderIndex?: number;
  category?: 'General' | 'Pricing & GST' | 'Technical' | 'Support' | string;
  order?: number;
  isPublished?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ChatbotQAItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Services' | 'Pricing & Quotes' | 'Tech Stack' | 'GST & Invoicing' | 'Contact & Support' | string;
  keywords: string[];
  suggestedFollowUps?: string[];
  actionLink?: string;
  actionLabel?: string;
  isActive: boolean;
  orderIndex: number;
  matchCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatbotSettings {
  botName: string;
  botSubtitle: string;
  avatarUrl?: string;
  welcomeMessage: string;
  fallbackMessage: string;
  quickPrompts: string[];
  enableBot: boolean;
  contactEmail?: string;
  contactPhone?: string;
  updatedAt?: string;
}

// =============================================================================
// PHASE 10: PURCHASES, EXPENSES, MASTERS, SALARY AND ACCOUNTING TYPES
// =============================================================================

export interface SupplierVendor {
  id: string;
  supplierCode?: string; // e.g. "VEN-001"
  name: string; // Trade / Company Name (e.g. "Amazon Web Services India Pvt Ltd")
  legalName?: string;
  contactPerson?: string;
  category?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  stateCode: string; // e.g. "27"
  pincode?: string;
  gstin?: string; // 15-char GSTIN or empty
  pan?: string;
  panNumber?: string;
  isGstRegistered?: boolean;
  isReverseCharge?: boolean;
  msmeNumber?: string;
  msmeRegistrationNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankBranch?: string;
  upiId?: string;
  paymentTerms?: string;
  paymentTermsDays?: number;
  notes?: string;
  status: 'active' | 'inactive';
  isActive?: boolean;
  totalPurchases?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UnitMasterItem {
  id: string;
  code: string; // e.g. "NOS", "PCS", "KGS", "MTR", "BOX", "SET", "HRS", "DAY", "MON", "SQF"
  name: string; // e.g. "Numbers", "Pieces", "Kilograms", "Meters", "Boxes", "Sets", "Hours", "Days", "Months", "Square Feet"
  uqc: string; // GST portal code, e.g. "NOS-NUMBERS", "PCS-PIECES", "KGS-KILOGRAMS", "MTR-METERS", "BOX-BOX", "SET-SETS", "HRS-HOURS", "DAY-DAYS", "MON-MONTHS", "SQF-SQUARE FEET", "OTH-OTHERS"
  symbol?: string; // e.g. "nos", "pcs", "kg", "m", "box", "hrs"
  decimalPlaces: number; // 0 or 2
  isDefault?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HsnMasterItem {
  id: string;
  code: string; // 4, 6, 8 digit HSN/SAC code (e.g. "998313", "847130", "851762")
  description: string; // e.g. "IT Infrastructure & Cloud Services", "Laptops & Portable Computers"
  type: 'goods_hsn' | 'services_sac';
  gstRate: number; // 0, 5, 12, 18, 28
  cgstRate: number; // half rate for intra-state
  sgstRate: number; // half rate for intra-state
  igstRate: number; // full rate for inter-state
  cessRate?: number;
  itcEligibility?: 'Inputs' | 'Capital Goods' | 'Input Services' | 'Ineligible - Section 17(5)' | string;
  defaultUnit?: string; // e.g. "NOS", "PCS", "OTH"
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoodsItem {
  id: string;
  itemCode: string; // SKU e.g. "ITM-SRV-01", "ITM-LAP-02"
  itemName: string; // e.g. "Dell PowerEdge Server 16-Core", "Apple MacBook Pro M3"
  itemType?: 'goods' | 'services' | string;
  category: 'Hardware & Office Equipment' | 'Cloud Infrastructure & Servers' | 'Software Licenses & Subscriptions' | 'Networking & Telecom' | 'Office Supplies & Consumables' | 'Professional Services' | 'Contract Labor' | string;
  hsnSacCode: string; // ref to HSN code
  unitCode?: string; // ref to Unit code
  unit?: string;
  purchasePrice: number;
  salesPrice?: number;
  sellingPrice?: number;
  gstRate: number;
  description?: string;
  currentStock?: number;
  openingStock?: number;
  reorderLevel?: number;
  isItcEligible?: boolean;
  preferredSupplierId?: string;
  preferredSupplierName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PurchasePaymentStatus = 'paid' | 'pending' | 'partially_paid' | 'overdue';

export interface Purchase {
  id: string;
  supplierId?: string; // Reference to SupplierVendor
  supplierName: string;
  supplierGstin?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  supplierAddress?: string;
  supplierStateCode?: string;
  billNumber: string; // Invoice / Bill Number
  purchaseDate: string; // Date (YYYY-MM-DD)
  dueDate?: string;
  description: string;
  hsnSacCode?: string; // HSN / SAC where applicable (e.g. 998313, 998314, 8471)
  category?: string;
  unitCode?: string; // UOM from Unit Master (e.g. NOS, PCS, BOX, HRS)
  quantity?: number;
  unitPrice?: number;
  items?: LineItem[]; // Multiple line items support
  taxableAmount: number;
  gstRate: number; // 0, 5, 12, 18, 28
  cgstAmount: number;
  sgstAmount: number;
  utgstAmount?: number;
  igstAmount: number;
  totalAmount: number;
  paymentStatus: PurchasePaymentStatus;
  paymentMode?: 'Bank Transfer (NEFT/RTGS)' | 'IMPS' | 'UPI' | 'Credit Card' | 'Debit Card' | 'Cheque' | 'Cash' | string;
  paymentDate?: string;
  paymentRef?: string;
  attachmentUrl?: string; // Bill / Invoice receipt attachment
  attachmentName?: string;
  attachmentSize?: number | string;
  attachmentType?: string;
  notes?: string;
  isItcClaimable?: boolean; // Input Tax Credit claimable in GSTR-2B / GSTR-3B
  itcCategory?: 'Inputs' | 'Capital Goods' | 'Input Services' | 'Ineligible';
  isReverseCharge?: boolean;
  creditDebitNoteIds?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export type ExpenseCategory = 
  | 'Office Rent & Workspace'
  | 'Cloud Infrastructure & Hosting'
  | 'Software Licenses & Subscriptions'
  | 'Utilities & High-Speed Internet'
  | 'Marketing & Digital Advertising'
  | 'Legal, Accounting & Audit Fees'
  | 'Hardware & Office Equipment'
  | 'Travel, Conveyance & Lodging'
  | 'Staff Welfare, Meals & Refreshments'
  | 'Bank Charges & Payment Gateway Fees'
  | 'Miscellaneous Operations'
  | string;

export type ExpenseStatus = 'paid' | 'pending' | 'reimbursed' | 'approved';

export interface Expense {
  id: string;
  expenseDate: string; // Date (YYYY-MM-DD)
  category: ExpenseCategory; // Category
  description: string; // Description
  vendorName: string; // Vendor / Payee
  vendorGstin?: string;
  amount: number; // Total Amount Paid
  gstApplicable: boolean; // GST where applicable
  taxableAmount?: number;
  gstRate?: number; // 0, 5, 12, 18, 28
  gstAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  isItcEligible?: boolean;
  paymentMode: 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Cheque' | 'IMPS/NEFT/RTGS' | string;
  referenceNumber?: string; // Reference (Transaction ID, UTR, Cheque No)
  attachmentUrl?: string; // Attachment
  attachmentName?: string;
  paidBy?: string;
  status?: ExpenseStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StaffMember {
  id: string;
  employeeId: string; // e.g. "FFC-EMP-001"
  fullName: string;
  email: string;
  phone?: string;
  designation: string; // e.g. "Senior Full-Stack Engineer"
  department: 'Engineering' | 'Design & UI/UX' | 'DevOps & Cloud' | 'Management' | 'Sales & Marketing' | 'Finance & Admin' | string;
  joiningDate: string;
  panNumber?: string;
  bankAccountName?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  baseSalary: number; // Monthly Base Gross
  hraAllowance?: number;
  specialAllowance?: number;
  pfApplicable?: boolean;
  esiApplicable?: boolean;
  tdsApplicable?: boolean;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SalaryStatus = 'paid' | 'pending' | 'processing' | 'on_hold';
export type SalaryPaymentStatus = SalaryStatus;

export interface SalaryRecord {
  id: string;
  employeeId: string; // Ref to staff ID
  employeeName: string;
  employeeCode?: string; // e.g. "FFC-EMP-001"
  designation?: string;
  department?: string;
  period: string; // e.g. "August 2026", "2026-08"
  periodMonth: string; // "08"
  periodYear: number; // 2026
  
  // Earnings (Gross)
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  bonusOrIncentive: number;
  grossSalary: number; // Total Gross (Basic + HRA + Special + Bonus)
  
  // Deductions where applicable
  providentFund: number; // PF (12% of basic or fixed)
  esi: number; // ESI (0.75% where applicable)
  professionalTax: number; // PT (standard ₹200)
  tdsDeduction: number; // Income Tax / TDS
  advanceDeduction: number; // Loan / Advance repayment
  totalDeductions: number; // Provident Fund + ESI + PT + TDS + Advance
  
  // Net Salary
  netSalary: number; // grossSalary - totalDeductions
  
  paymentDate?: string;
  paymentStatus: SalaryStatus;
  paymentMode?: 'Bank Transfer (NEFT/RTGS)' | 'IMPS' | 'UPI' | 'Cheque' | 'Cash' | string;
  transactionReference?: string; // UTR / Txn Ref
  payslipGenerated?: boolean;
  payslipNumber?: string; // e.g. "PAYSLIP-2026-08-001"
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type AccountingDateRangeType = 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export interface AccountingReportFilter {
  rangeType: AccountingDateRangeType;
  preset: string; // 'this_week' | 'last_week' | 'current_month' | 'last_month' | 'q1' | 'q2' | 'q3' | 'q4' | 'fy_current' | 'fy_prev' | 'all' | 'custom';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

// =============================================================================
// PHASE 11: CREDIT / DEBIT NOTES & GST REPORTING TYPES
// =============================================================================

export type NoteType = 'credit' | 'debit';
export type NoteCategory = 'sales' | 'purchase';
export type NoteStatus = 'issued' | 'applied' | 'cancelled' | 'draft';

export type NoteReason = 
  | '01-Sales Return'
  | '02-Post Sale Discount'
  | '03-Deficiency in Services'
  | '04-Correction in Invoice'
  | '05-Change in POS'
  | '06-Final Price Hike / Adjustment'
  | '07-Purchase Return / Rejection'
  | '08-Post Purchase Rebate / Discount'
  | '09-Purchase Quantity Shortage'
  | '10-Rate Difference in Purchase Bill'
  | string;

export interface CreditDebitNote {
  id: string;
  noteNumber: string; // e.g. "CN-2026-0001", "DN-2026-0001", "PCN-2026-0001", "PDN-2026-0001"
  noteType: NoteType; // 'credit' | 'debit'
  noteCategory?: NoteCategory; // 'sales' | 'purchase' (default: 'sales')
  partyType?: 'client' | 'supplier'; // 'client' for sales, 'supplier' for purchases
  
  // Reference to parent Sales Invoice (for Sales CN/DN)
  invoiceId?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  clientId?: string;
  clientName?: string;
  clientCompany?: string;
  clientGstin?: string;
  clientAddress?: string;

  // Reference to parent Purchase Bill (for Purchase CN/DN)
  purchaseId?: string;
  purchaseBillNumber?: string;
  purchaseBillDate?: string;
  supplierId?: string;
  supplierName?: string;
  supplierGstin?: string;
  supplierAddress?: string;
  supplierStateCode?: string;

  // Seller Details
  sellerName?: string;
  sellerGstin?: string;
  sellerState?: string;
  sellerStateCode?: string;
  buyerState?: string;
  buyerStateCode?: string;
  placeOfSupply?: string; // e.g. "24-Gujarat", "27-Maharashtra", "26-Dadra and Nagar Haveli"
  issueDate: string; // YYYY-MM-DD
  reason: NoteReason;
  reasonNotes?: string;
  reverseCharge?: 'Yes' | 'No' | boolean;
  reverse_charge?: 'Yes' | 'No' | boolean;

  // Statutory Tax & ITC Accounting Impact
  itcImpact?: 'reduce_itc' | 'increase_itc' | 'reduce_output_tax' | 'increase_output_tax';
  gstr3bSection?: '3.1(a)' | '3.1(b)' | '4(A)(5)' | '4(B)(2)' | string;

  items: LineItem[];
  subtotal: number;
  taxableAmount: number;
  gstType: GSTType;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  utgstAmount?: number;
  igstAmount: number;
  totalTax: number;
  totalAmount: number;
  amountInWords?: string;
  status: NoteStatus;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  notes?: string;
  createdBy?: string;
  created_at?: string;
  updated_at?: string;

  // DB snake_case parity
  note_number?: string;
  note_type?: string;
  note_category?: string;
  invoice_id?: string;
  invoice_number?: string;
  invoice_date?: string;
  purchase_id?: string;
  purchase_bill_number?: string;
  client_id?: string;
  supplier_id?: string;
  place_of_supply?: string;
  issue_date?: string;
  taxable_amount?: number;
  cgst_amount?: number;
  sgst_amount?: number;
  utgst_amount?: number;
  igst_amount?: number;
  total_tax?: number;
  total_amount?: number;
}

export interface Gstr1B2BRow {
  'GSTIN/UIN of Recipient': string;
  'Receiver Name': string;
  'Invoice Number': string;
  'Invoice Date': string; // DD-MONTH NAME-YYYY
  'Invoice Value': number;
  'Place Of Supply': string; // e.g. 03-Punjab, 24-Gujarat
  'Reverse Charge': 'Y' | 'N';
  'Invoice Type': string; // Regular / SEZ Supply with Tax / SEZ Supply without Tax
  'Rate': number | string;
  'Taxable Value': number;
  'IGST': number;
  'CGST': number;
  'SGST/UTGST': number;
}

export interface Gstr1B2CRow {
  'Type': string; // OE / Other Than E-Commerce / B2C Small
  'Receiver Name': string;
  'Invoice Number': string;
  'Invoice Date': string;
  'Invoice Value': number;
  'Place Of Supply': string;
  'Rate': number | string;
  'Taxable Value': number;
  'IGST': number;
  'CGST': number;
  'SGST/UTGST': number;
  'Cess Amount': number;
}

export interface Gstr1CdnrRow {
  'GSTIN/UIN of Recipient': string;
  'Receiver Name': string;
  'Note/Voucher Number': string;
  'Note Date': string;
  'Note Type': 'Credit Note' | 'Debit Note' | 'C' | 'D';
  'Original Invoice Number': string;
  'Original Invoice Date': string;
  'Place Of Supply': string;
  'Reverse Charge': 'Y' | 'N';
  'Note Value': number;
  'Rate': number | string;
  'Taxable Value': number;
  'IGST': number;
  'CGST': number;
  'SGST/UTGST': number;
  'Reason for Issuance': string;
}

export interface Gstr1HsnRow {
  'HSN': string; // Or SAC Code
  'Description': string;
  'UQC': string; // e.g. OTH-OTHERS, NA, NOS
  'Total Quantity': number;
  'Total Value': number;
  'Rate': number | string;
  'Taxable Value': number;
  'IGST': number;
  'CGST': number;
  'SGST/UTGST': number;
}

export interface Gstr1DocRow {
  'Nature of Document': string;
  'Sr. No. From': string;
  'Sr. No. To': string;
  'Total Number': number;
  'Cancelled': number;
  'Net Issued': number;
}

// =============================================================================
// PHASE 12: CENTRAL NOTIFICATION AND EMAIL SYSTEM TYPES
// =============================================================================

export type AppNotificationType =
  | 'lead_received'
  | 'lead_assigned'
  | 'lead_status_changed'
  | 'quotation_created'
  | 'quotation_sent'
  | 'order_received'
  | 'quotation_converted'
  | 'invoice_created'
  | 'invoice_sent'
  | 'payment_received'
  | 'payment_pending'
  | 'payment_receipt_sent'
  | 'project_status_changed'
  | 'project_completed'
  | 'project_invoice_eligible'
  | 'new_user'
  | 'role_changed'
  | 'permission_changed'
  | 'gst_report_generated'
  | 'accounting_event'
  | 'system_alert';

export type NotificationCategory =
  | 'all'
  | 'leads'
  | 'financials'
  | 'projects'
  | 'users'
  | 'accounting'
  | 'compliance'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  entity_type?: 'enquiry' | 'quotation' | 'invoice' | 'payment' | 'project' | 'user' | 'credit_debit_note' | 'gst_report' | 'purchase' | 'expense' | 'salary' | 'legal_document' | string;
  entity_id?: string;
  priority: NotificationPriority;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  target_role?: string;
  target_user_id?: string;
  target_client_id?: string;
  metadata?: Record<string, any>;
  event_key?: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  sender: string;
  subject: string;
  category: 'quotation' | 'invoice' | 'payment_receipt' | 'project_status' | 'notification' | 'general' | string;
  status: 'sent' | 'failed' | 'pending';
  message_id?: string;
  error_message?: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// =============================================================================
// PHASE 16: LEGAL DOCUMENT MONITORING AND VISITOR MONITORING
// =============================================================================

export type LegalDocumentType = 'privacy_policy' | 'terms_of_engagement' | 'gst_compliance';
export type LegalDocumentStatus = 'active' | 'draft' | 'archived' | 'in_review';

export interface LegalDocument {
  id: string;
  slug: 'privacy-policy' | 'terms-of-engagement' | 'gst-compliance' | string;
  title: string;
  documentType: LegalDocumentType;
  version: string;
  effectiveDate: string;
  lastUpdatedDate: string;
  status: LegalDocumentStatus;
  summary: string;
  content: string;
  jurisdiction: string;
  applicableLaw: string;
  createdBy: string;
  createdByEmail?: string;
  lastModifiedBy: string;
  lastModifiedByEmail?: string;
  lastModifiedByRole?: string;
  changeSummary?: string;
  versionHistoryCount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LegalDocumentHistoryItem {
  id: string;
  documentId: string;
  documentSlug: string;
  version: string;
  title: string;
  summary: string;
  content: string;
  effectiveDate: string;
  status: LegalDocumentStatus;
  changedBy: string;
  changedByEmail?: string;
  changedByRole?: string;
  changeSummary: string;
  created_at: string;
}

export type VisitorEventType = 
  | 'page_view' 
  | 'section_view' 
  | 'estimator_use' 
  | 'quote_request' 
  | 'legal_doc_view' 
  | 'chat_open' 
  | 'cta_click' 
  | 'client_portal_open';

export interface VisitorEvent {
  id: string;
  sessionId: string;
  eventType: VisitorEventType | string;
  pagePath: string;
  sectionId?: string;
  referrer?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  region?: string;
  durationSeconds?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface VisitorMonitoringSummary {
  totalVisits: number;
  uniqueSessions: number;
  todayVisits: number;
  averageDurationSeconds?: number;
  sectionBreakdown: {
    section: string;
    count: number;
    visitCount?: number;
    uniqueVisitors?: number;
    avgDurationSeconds?: number;
  }[];
  deviceBreakdown: {
    device: string;
    count: number;
    percentage?: number;
  }[];
  browserBreakdown: {
    browser: string;
    count: number;
    percentage?: number;
  }[];
  referrerBreakdown?: {
    referrer: string;
    count: number;
    percentage?: number;
  }[];
  recentEvents: VisitorEvent[];
}


