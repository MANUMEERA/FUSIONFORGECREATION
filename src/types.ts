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
  document_type: 'invoice' | 'quotation';
  prefix: string; // e.g. "INV" | "QTN"
  company_code: string; // e.g. "FFC"
  include_year: boolean;
  year_format: 'YYYY' | 'YY' | 'YYYY-YY';
  starting_sequence: number; // e.g. 10001 or 1
  current_sequence: number; // e.g. 10001
  separator: string; // e.g. "/" or "-"
  style: 'standard' | 'shorter' | 'custom';
  custom_pattern?: string;
}

export interface SellerProfile {
  id?: string;
  company_name: string;
  tagline: string;
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
  default_quotation_validity_days?: number;
  payment_terms?: PaymentTermItem[];
  numbering_configs?: {
    invoice: DocumentNumberConfig;
    quotation: DocumentNumberConfig;
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
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE' | 'RESTORE' | 'PAYMENT_RECORD' | 'AUTH_LOGIN' | 'CALCULATE_GST' | 'ROLE_CHANGE';
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

export interface LineItem {
  id: string;
  invoice_id?: string;
  description: string;
  sacCode?: string;
  quantity: number;
  rate: number;
  unit_price?: number;
  amount: number;
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
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingStateCode?: string;
  shippingPincode?: string;
  shippingGstin?: string;

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
  gstType: GSTType;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  utgstAmount?: number;
  igstAmount: number;
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

export interface Payment {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientCompany?: string;
  clientName: string;
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
  category?: string;
  status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  startDate?: string;
  deadline?: string;
  budget?: number;
  progressPercentage?: number;
  techStack?: string[];
  deliverables?: string[];
  isPublic?: boolean;
  notes?: string;
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

