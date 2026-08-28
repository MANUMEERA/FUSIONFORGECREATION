import React, { createContext, useContext, useState } from 'react';
import { 
  UserProfile, 
  UserRole,
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
  AgencyService,
  TechnologyItem,
  TestimonialItem,
  FaqItem,
  ServicePricePreset,
  PaymentTermItem,
  Purchase,
  Expense,
  StaffMember,
  SalaryRecord,
  AppNotification,
  NotificationCategory,
  EmailLog,
  LegalDocument,
  LegalDocumentHistoryItem,
  VisitorEvent,
  SupplierVendor,
  UnitMasterItem,
  HsnMasterItem,
  GoodsItem,
  DocumentNumberConfig,
  QuoteStatus
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CLIENTS, 
  INITIAL_QUOTATIONS, 
  INITIAL_INVOICES, 
  INITIAL_PAYMENTS, 
  INITIAL_CREDIT_DEBIT_NOTES,
  INITIAL_ENQUIRIES, 
  INITIAL_PORTFOLIO, 
  INITIAL_SERVICES, 
  INITIAL_TECHNOLOGIES, 
  INITIAL_TESTIMONIALS, 
  INITIAL_FAQS, 
  AGENCY_CONFIG, 
  INITIAL_PRICE_PRESETS, 
  INITIAL_PAYMENT_TERMS, 
  INITIAL_CHATBOT_SETTINGS,
  INITIAL_CHATBOT_QA,
  INITIAL_UNITS,
  INITIAL_HSN_CODES,
  INITIAL_LEGAL_DOCUMENTS,
  INITIAL_VISITOR_EVENTS
} from '../mockData';
import { 
  DEFAULT_INVOICE_NUMBERING, 
  DEFAULT_QUOTATION_NUMBERING,
  DEFAULT_CREDIT_NOTE_NUMBERING,
  DEFAULT_DEBIT_NOTE_NUMBERING 
} from '../utils/documentNumbering';
import { sendProjectScopeEnquiryEmailsBackend } from '../utils/emailService';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentView: 'public' | 'portal';
  setCurrentView: (view: 'public' | 'portal') => void;

  isLoading: boolean;
  dbConnected: boolean;
  lastSyncedAt: string;
  syncFromDatabase: () => Promise<void>;

  latestLeadAlert: ProjectEnquiry | null;
  clearLeadAlert: () => void;
  isBuzzerMuted: boolean;
  toggleBuzzerMute: () => boolean;
  isLeadMonitoringActive: boolean;
  toggleLeadMonitoring: () => boolean;
  setLeadMonitoringActive: (active: boolean) => void;
  testBuzzerSound: () => void;
  triggerSimulatedLeadAlert: () => ProjectEnquiry | null;
  clearAllEnquiries: () => Promise<void>;

  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'created_at' | 'is_read'> & { is_read?: boolean }) => Promise<AppNotification | undefined>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (category?: NotificationCategory) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  emailLogs: EmailLog[];
  addEmailLog: (log: Omit<EmailLog, 'id' | 'created_at'>) => Promise<EmailLog>;
  sendInvoiceEmail: (invoiceId: string, customRecipient?: string, customNotes?: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendQuotationEmail: (quotationId: string, customRecipient?: string, customNotes?: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendPaymentReceiptEmail: (paymentId: string, customRecipient?: string, customNotes?: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;

  clients: Client[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: Payment[];
  creditDebitNotes: CreditDebitNote[];
  creditNotes: CreditDebitNote[];
  purchases: Purchase[];
  expenses: Expense[];
  staff: StaffMember[];
  salaries: SalaryRecord[];
  enquiries: ProjectEnquiry[];
  portfolio: PortfolioProject[];
  managedProjects: ManagedProject[];
  completedWork: CompletedWorkRecord[];
  chatbotQAs: ChatbotQAItem[];
  chatbotSettings: ChatbotSettings;
  services: AgencyService[];
  technologies: TechnologyItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  users: UserProfile[];
  agencyConfig: typeof AGENCY_CONFIG;
  pricePresets: ServicePricePreset[];
  paymentTerms: PaymentTermItem[];
  legalDocuments: LegalDocument[];
  visitorEvents: VisitorEvent[];
  suppliers: SupplierVendor[];
  unitMaster: UnitMasterItem[];
  hsnMaster: HsnMasterItem[];
  goodsItems: GoodsItem[];

  invoiceNumbering: DocumentNumberConfig;
  quotationNumbering: DocumentNumberConfig;
  creditNoteNumbering: DocumentNumberConfig;
  debitNoteNumbering: DocumentNumberConfig;
  updateInvoiceNumbering: (settings: Partial<DocumentNumberConfig>) => void;
  updateQuotationNumbering: (settings: Partial<DocumentNumberConfig>) => void;
  updateCreditNoteNumbering: (settings: Partial<DocumentNumberConfig>) => void;
  updateDebitNoteNumbering: (settings: Partial<DocumentNumberConfig>) => void;

  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Client>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Quotation>;
  updateQuotation: (id: string, quotation: Partial<Quotation>) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  acceptQuotation: (id: string) => Promise<void>;

  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Payment>;
  deletePayment: (id: string) => Promise<void>;

  addCreditDebitNote: (note: Omit<CreditDebitNote, 'id' | 'created_at' | 'updated_at'>) => Promise<CreditDebitNote>;
  updateCreditDebitNote: (id: string, note: Partial<CreditDebitNote>) => Promise<void>;
  deleteCreditDebitNote: (id: string) => Promise<void>;

  addPurchase: (purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => Promise<Purchase>;
  updatePurchase: (id: string, purchase: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;

  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<Expense>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addStaff: (staff: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>) => Promise<StaffMember>;
  updateStaff: (id: string, staff: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;

  addSalary: (salary: Omit<SalaryRecord, 'id' | 'created_at' | 'updated_at'>) => Promise<SalaryRecord>;
  updateSalary: (id: string, salary: Partial<SalaryRecord>) => Promise<void>;
  deleteSalary: (id: string) => Promise<void>;

  addEnquiry: (enquiry: Omit<ProjectEnquiry, 'id' | 'createdAt' | 'created_at' | 'status'> & { status?: ProjectEnquiry['status'] }) => Promise<{ success: boolean; enquiry: ProjectEnquiry; error?: string }>;
  updateEnquiryStatus: (id: string, status: ProjectEnquiry['status']) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  addPortfolioProject: (project: Omit<PortfolioProject, 'id'>) => Promise<PortfolioProject>;
  updatePortfolioProject: (id: string, project: Partial<PortfolioProject>) => Promise<void>;
  deletePortfolioProject: (id: string) => Promise<void>;

  addManagedProject: (project: Omit<ManagedProject, 'id' | 'created_at' | 'updated_at'>) => Promise<ManagedProject>;
  updateManagedProject: (id: string, project: Partial<ManagedProject>) => Promise<void>;
  deleteManagedProject: (id: string) => Promise<void>;

  addCompletedWork: (work: Omit<CompletedWorkRecord, 'id'>) => Promise<CompletedWorkRecord>;
  updateCompletedWork: (id: string, work: Partial<CompletedWorkRecord>) => Promise<void>;
  deleteCompletedWork: (id: string) => Promise<void>;

  addChatbotQA: (qa: Omit<ChatbotQAItem, 'id'>) => Promise<ChatbotQAItem>;
  updateChatbotQA: (id: string, qa: Partial<ChatbotQAItem>) => Promise<void>;
  deleteChatbotQA: (id: string) => Promise<void>;
  updateChatbotSettings: (settings: Partial<ChatbotSettings>) => Promise<void>;

  addService: (service: Omit<AgencyService, 'id'>) => Promise<AgencyService>;
  updateService: (id: string, service: Partial<AgencyService>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  addTechnology: (tech: Omit<TechnologyItem, 'id'>) => Promise<TechnologyItem>;
  updateTechnology: (id: string, tech: Partial<TechnologyItem>) => Promise<void>;
  deleteTechnology: (id: string) => Promise<void>;

  addTestimonial: (testimonial: Omit<TestimonialItem, 'id'>) => Promise<TestimonialItem>;
  updateTestimonial: (id: string, testimonial: Partial<TestimonialItem>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  addFaq: (faq: Omit<FaqItem, 'id'>) => Promise<FaqItem>;
  updateFaq: (id: string, faq: Partial<FaqItem>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;

  updateAgencyConfig: (config: Partial<typeof AGENCY_CONFIG>) => Promise<void>;

  addPricePreset: (preset: Omit<ServicePricePreset, 'id' | 'created_at' | 'updated_at'>) => Promise<ServicePricePreset>;
  updatePricePreset: (id: string, preset: Partial<ServicePricePreset>) => Promise<void>;
  deletePricePreset: (id: string) => Promise<void>;

  addPaymentTerm: (term: Omit<PaymentTermItem, 'id' | 'created_at' | 'updated_at'>) => Promise<PaymentTermItem>;
  updatePaymentTerm: (id: string, term: Partial<PaymentTermItem>) => Promise<void>;
  deletePaymentTerm: (id: string) => Promise<void>;

  addUser: (user: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => Promise<UserProfile>;
  updateUser: (id: string, user: Partial<UserProfile>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  updateLegalDocument: (id: string, document: Partial<LegalDocument>) => Promise<void>;
  restoreLegalDocumentVersion: (documentId: string, historyItem: LegalDocumentHistoryItem) => Promise<void>;

  trackVisitorEvent: (eventData: Partial<VisitorEvent> & { eventType: string }) => Promise<void>;

  addSupplier: (supplier: Omit<SupplierVendor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SupplierVendor>;
  updateSupplier: (id: string, supplier: Partial<SupplierVendor>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  addUnit: (unit: Omit<UnitMasterItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<UnitMasterItem>;
  updateUnit: (id: string, unit: Partial<UnitMasterItem>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;

  addHsn: (hsn: Omit<HsnMasterItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<HsnMasterItem>;
  updateHsn: (id: string, hsn: Partial<HsnMasterItem>) => Promise<void>;
  deleteHsn: (id: string) => Promise<void>;

  addGoodsItem: (item: Omit<GoodsItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<GoodsItem>;
  updateGoodsItem: (id: string, item: Partial<GoodsItem>) => Promise<void>;
  deleteGoodsItem: (id: string) => Promise<void>;

  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentView, setCurrentView] = useState<'public' | 'portal'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);
  const [dbConnected] = useState<boolean>(false);
  const [lastSyncedAt] = useState<string>(new Date().toISOString());

  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [creditDebitNotes, setCreditDebitNotes] = useState<CreditDebitNote[]>(INITIAL_CREDIT_DEBIT_NOTES);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>(INITIAL_ENQUIRIES);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [completedWork, setCompletedWork] = useState<CompletedWorkRecord[]>([]);
  const [chatbotQAs, setChatbotQAs] = useState<ChatbotQAItem[]>(INITIAL_CHATBOT_QA);
  const [chatbotSettings, setChatbotSettings] = useState<ChatbotSettings>(INITIAL_CHATBOT_SETTINGS);
  const [services, setServices] = useState<AgencyService[]>(INITIAL_SERVICES);
  const [technologies, setTechnologies] = useState<TechnologyItem[]>(INITIAL_TECHNOLOGIES);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [agencyConfig, setAgencyConfig] = useState<typeof AGENCY_CONFIG>(AGENCY_CONFIG);
  const [pricePresets, setPricePresets] = useState<ServicePricePreset[]>(INITIAL_PRICE_PRESETS);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermItem[]>(INITIAL_PAYMENT_TERMS);
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>(INITIAL_LEGAL_DOCUMENTS);
  const [visitorEvents, setVisitorEvents] = useState<VisitorEvent[]>(INITIAL_VISITOR_EVENTS);
  const [suppliers, setSuppliers] = useState<SupplierVendor[]>([]);
  const [unitMaster, setUnitMaster] = useState<UnitMasterItem[]>(INITIAL_UNITS);
  const [hsnMaster, setHsnMaster] = useState<HsnMasterItem[]>(INITIAL_HSN_CODES);
  const [goodsItems, setGoodsItems] = useState<GoodsItem[]>([]);

  const [invoiceNumbering, setInvoiceNumbering] = useState<DocumentNumberConfig>(DEFAULT_INVOICE_NUMBERING);
  const [quotationNumbering, setQuotationNumbering] = useState<DocumentNumberConfig>(DEFAULT_QUOTATION_NUMBERING);
  const [creditNoteNumbering, setCreditNoteNumbering] = useState<DocumentNumberConfig>(DEFAULT_CREDIT_NOTE_NUMBERING);
  const [debitNoteNumbering, setDebitNoteNumbering] = useState<DocumentNumberConfig>(DEFAULT_DEBIT_NOTE_NUMBERING);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [latestLeadAlert, setLatestLeadAlert] = useState<ProjectEnquiry | null>(null);
  const [isBuzzerMuted, setIsBuzzerMuted] = useState<boolean>(false);
  const [isLeadMonitoringActive, setIsLeadMonitoringActive] = useState<boolean>(false);

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  const syncFromDatabase = async () => {};

  const switchRole = (role: UserRole) => {
    const foundUser = users.find(u => u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
    } else {
      setCurrentUser({
        ...currentUser,
        role
      });
    }
  };

  const clearLeadAlert = () => setLatestLeadAlert(null);
  const toggleBuzzerMute = () => {
    setIsBuzzerMuted(prev => !prev);
    return !isBuzzerMuted;
  };
  const toggleLeadMonitoring = () => {
    setIsLeadMonitoringActive(prev => !prev);
    return !isLeadMonitoringActive;
  };
  const testBuzzerSound = () => {};
  const triggerSimulatedLeadAlert = () => null;
  const clearAllEnquiries = async () => setEnquiries([]);

  const addNotification = async (notif: Omit<AppNotification, 'id' | 'created_at' | 'is_read'> & { is_read?: boolean }): Promise<AppNotification> => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...notif,
      is_read: notif.is_read ?? false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsRead = async (category?: NotificationCategory) => {
    setNotifications(prev => prev.map(n => (!category || n.category === category) ? { ...n, is_read: true } : n));
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
  };

  const addEmailLog = async (log: Omit<EmailLog, 'id' | 'created_at'>): Promise<EmailLog> => {
    const newLog: EmailLog = {
      id: `email_${Date.now()}`,
      ...log,
      created_at: new Date().toISOString()
    };
    setEmailLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  const sendInvoiceEmail = async () => ({ success: true, messageId: `inv_${Date.now()}` });
  const sendQuotationEmail = async () => ({ success: true, messageId: `quote_${Date.now()}` });
  const sendPaymentReceiptEmail = async () => ({ success: true, messageId: `pay_${Date.now()}` });

  const updateInvoiceNumbering = (s: Partial<DocumentNumberConfig>) => setInvoiceNumbering(prev => ({ ...prev, ...s }));
  const updateQuotationNumbering = (s: Partial<DocumentNumberConfig>) => setQuotationNumbering(prev => ({ ...prev, ...s }));
  const updateCreditNoteNumbering = (s: Partial<DocumentNumberConfig>) => setCreditNoteNumbering(prev => ({ ...prev, ...s }));
  const updateDebitNoteNumbering = (s: Partial<DocumentNumberConfig>) => setDebitNoteNumbering(prev => ({ ...prev, ...s }));

  const addClient = async (c: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    const newClient: Client = { ...c, id: `client_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };
  const updateClient = async (id: string, c: Partial<Client>) => {
    setClients(prev => prev.map(item => item.id === id ? { ...item, ...c, updatedAt: new Date().toISOString() } : item));
  };
  const deleteClient = async (id: string) => setClients(prev => prev.filter(i => i.id !== id));

  const addQuotation = async (q: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quotation> => {
    const newQ: Quotation = { ...q, id: `quote_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setQuotations(prev => [newQ, ...prev]);
    return newQ;
  };
  const updateQuotation = async (id: string, q: Partial<Quotation>) => {
    setQuotations(prev => prev.map(item => item.id === id ? { ...item, ...q, updatedAt: new Date().toISOString() } : item));
  };
  const deleteQuotation = async (id: string) => setQuotations(prev => prev.filter(i => i.id !== id));
  const acceptQuotation = async (id: string) => {
    setQuotations(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' as QuoteStatus, updatedAt: new Date().toISOString() } : i));
  };

  const addInvoice = async (inv: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
    const newInv: Invoice = { ...inv, id: `inv_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setInvoices(prev => [newInv, ...prev]);
    return newInv;
  };
  const updateInvoice = async (id: string, inv: Partial<Invoice>) => {
    setInvoices(prev => prev.map(item => item.id === id ? { ...item, ...inv, updatedAt: new Date().toISOString() } : item));
  };
  const deleteInvoice = async (id: string) => setInvoices(prev => prev.filter(i => i.id !== id));

  const addPayment = async (p: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> => {
    const newPay: Payment = { ...p, id: `pay_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setPayments(prev => [newPay, ...prev]);
    return newPay;
  };
  const deletePayment = async (id: string) => setPayments(prev => prev.filter(i => i.id !== id));

  const addCreditDebitNote = async (cdn: Omit<CreditDebitNote, 'id' | 'created_at' | 'updated_at'>): Promise<CreditDebitNote> => {
    const newNote: CreditDebitNote = { ...cdn, id: `cdn_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setCreditDebitNotes(prev => [newNote, ...prev]);
    return newNote;
  };
  const updateCreditDebitNote = async (id: string, cdn: Partial<CreditDebitNote>) => {
    setCreditDebitNotes(prev => prev.map(item => item.id === id ? { ...item, ...cdn, updated_at: new Date().toISOString() } : item));
  };
  const deleteCreditDebitNote = async (id: string) => setCreditDebitNotes(prev => prev.filter(i => i.id !== id));

  const addPurchase = async (p: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>): Promise<Purchase> => {
    const newP: Purchase = { ...p, id: `pur_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setPurchases(prev => [newP, ...prev]);
    return newP;
  };
  const updatePurchase = async (id: string, p: Partial<Purchase>) => {
    setPurchases(prev => prev.map(item => item.id === id ? { ...item, ...p, updated_at: new Date().toISOString() } : item));
  };
  const deletePurchase = async (id: string) => setPurchases(prev => prev.filter(i => i.id !== id));

  const addExpense = async (e: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> => {
    const newE: Expense = { ...e, id: `exp_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setExpenses(prev => [newE, ...prev]);
    return newE;
  };
  const updateExpense = async (id: string, e: Partial<Expense>) => {
    setExpenses(prev => prev.map(item => item.id === id ? { ...item, ...e, updated_at: new Date().toISOString() } : item));
  };
  const deleteExpense = async (id: string) => setExpenses(prev => prev.filter(i => i.id !== id));

  const addStaff = async (s: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>): Promise<StaffMember> => {
    const newS: StaffMember = { ...s, id: `staff_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setStaff(prev => [newS, ...prev]);
    return newS;
  };
  const updateStaff = async (id: string, s: Partial<StaffMember>) => {
    setStaff(prev => prev.map(item => item.id === id ? { ...item, ...s, updated_at: new Date().toISOString() } : item));
  };
  const deleteStaff = async (id: string) => setStaff(prev => prev.filter(i => i.id !== id));

  const addSalary = async (sal: Omit<SalaryRecord, 'id' | 'created_at' | 'updated_at'>): Promise<SalaryRecord> => {
    const newSal: SalaryRecord = { ...sal, id: `sal_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setSalaries(prev => [newSal, ...prev]);
    return newSal;
  };
  const updateSalary = async (id: string, sal: Partial<SalaryRecord>) => {
    setSalaries(prev => prev.map(item => item.id === id ? { ...item, ...sal, updated_at: new Date().toISOString() } : item));
  };
  const deleteSalary = async (id: string) => setSalaries(prev => prev.filter(i => i.id !== id));

  const addEnquiry = async (
    enq: Omit<ProjectEnquiry, 'id' | 'createdAt' | 'created_at' | 'status'> & { status?: ProjectEnquiry['status'] }
  ): Promise<{ success: boolean; enquiry: ProjectEnquiry; error?: string }> => {
    const newEnq: ProjectEnquiry = {
      ...enq,
      id: `enq_${Date.now()}`,
      status: enq.status || 'new',
      createdAt: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Dispatch emails via Hostinger PHP endpoint
    const result = await sendProjectScopeEnquiryEmailsBackend(newEnq, agencyConfig);

    if (result.success) {
      setEnquiries(prev => [newEnq, ...prev]);
      setLatestLeadAlert(newEnq);
      return { success: true, enquiry: newEnq };
    } else {
      return { 
        success: false, 
        enquiry: newEnq, 
        error: result.error || 'Failed to dispatch enquiry notification emails.' 
      };
    }
  };
  const updateEnquiryStatus = async (id: string, status: ProjectEnquiry['status']) => {
    setEnquiries(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };
  const deleteEnquiry = async (id: string) => setEnquiries(prev => prev.filter(i => i.id !== id));

  const addPortfolioProject = async (proj: Omit<PortfolioProject, 'id'>): Promise<PortfolioProject> => {
    const newP: PortfolioProject = { ...proj, id: `port_${Date.now()}` };
    setPortfolio(prev => [newP, ...prev]);
    return newP;
  };
  const updatePortfolioProject = async (id: string, proj: Partial<PortfolioProject>) => {
    setPortfolio(prev => prev.map(item => item.id === id ? { ...item, ...proj } : item));
  };
  const deletePortfolioProject = async (id: string) => setPortfolio(prev => prev.filter(i => i.id !== id));

  const addManagedProject = async (proj: Omit<ManagedProject, 'id' | 'created_at' | 'updated_at'>): Promise<ManagedProject> => {
    const newP: ManagedProject = { ...proj, id: `proj_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setManagedProjects(prev => [newP, ...prev]);
    return newP;
  };
  const updateManagedProject = async (id: string, proj: Partial<ManagedProject>) => {
    setManagedProjects(prev => prev.map(item => item.id === id ? { ...item, ...proj, updated_at: new Date().toISOString() } : item));
  };
  const deleteManagedProject = async (id: string) => setManagedProjects(prev => prev.filter(i => i.id !== id));

  const addCompletedWork = async (w: Omit<CompletedWorkRecord, 'id'>): Promise<CompletedWorkRecord> => {
    const newW: CompletedWorkRecord = { ...w, id: `work_${Date.now()}` };
    setCompletedWork(prev => [newW, ...prev]);
    return newW;
  };
  const updateCompletedWork = async (id: string, w: Partial<CompletedWorkRecord>) => {
    setCompletedWork(prev => prev.map(item => item.id === id ? { ...item, ...w } : item));
  };
  const deleteCompletedWork = async (id: string) => setCompletedWork(prev => prev.filter(i => i.id !== id));

  const addChatbotQA = async (qa: Omit<ChatbotQAItem, 'id'>): Promise<ChatbotQAItem> => {
    const newQA: ChatbotQAItem = { ...qa, id: `qa_${Date.now()}` };
    setChatbotQAs(prev => [newQA, ...prev]);
    return newQA;
  };
  const updateChatbotQA = async (id: string, qa: Partial<ChatbotQAItem>) => {
    setChatbotQAs(prev => prev.map(item => item.id === id ? { ...item, ...qa } : item));
  };
  const deleteChatbotQA = async (id: string) => setChatbotQAs(prev => prev.filter(i => i.id !== id));
  const updateChatbotSettings = async (settings: Partial<ChatbotSettings>) => {
    setChatbotSettings(prev => ({ ...prev, ...settings }));
  };

  const addService = async (s: Omit<AgencyService, 'id'>): Promise<AgencyService> => {
    const newS: AgencyService = { ...s, id: `serv_${Date.now()}` };
    setServices(prev => [newS, ...prev]);
    return newS;
  };
  const updateService = async (id: string, s: Partial<AgencyService>) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
  };
  const deleteService = async (id: string) => setServices(prev => prev.filter(i => i.id !== id));

  const addTechnology = async (t: Omit<TechnologyItem, 'id'>): Promise<TechnologyItem> => {
    const newT: TechnologyItem = { ...t, id: `tech_${Date.now()}` };
    setTechnologies(prev => [newT, ...prev]);
    return newT;
  };
  const updateTechnology = async (id: string, t: Partial<TechnologyItem>) => {
    setTechnologies(prev => prev.map(item => item.id === id ? { ...item, ...t } : item));
  };
  const deleteTechnology = async (id: string) => setTechnologies(prev => prev.filter(i => i.id !== id));

  const addTestimonial = async (test: Omit<TestimonialItem, 'id'>): Promise<TestimonialItem> => {
    const newTest: TestimonialItem = { ...test, id: `test_${Date.now()}` };
    setTestimonials(prev => [newTest, ...prev]);
    return newTest;
  };
  const updateTestimonial = async (id: string, test: Partial<TestimonialItem>) => {
    setTestimonials(prev => prev.map(item => item.id === id ? { ...item, ...test } : item));
  };
  const deleteTestimonial = async (id: string) => setTestimonials(prev => prev.filter(i => i.id !== id));

  const addFaq = async (f: Omit<FaqItem, 'id'>): Promise<FaqItem> => {
    const newF: FaqItem = { ...f, id: `faq_${Date.now()}` };
    setFaqs(prev => [newF, ...prev]);
    return newF;
  };
  const updateFaq = async (id: string, f: Partial<FaqItem>) => {
    setFaqs(prev => prev.map(item => item.id === id ? { ...item, ...f } : item));
  };
  const deleteFaq = async (id: string) => setFaqs(prev => prev.filter(i => i.id !== id));

  const updateAgencyConfig = async (cfg: Partial<typeof AGENCY_CONFIG>) => {
    setAgencyConfig(prev => ({ ...prev, ...cfg }));
  };

  const addPricePreset = async (p: Omit<ServicePricePreset, 'id' | 'created_at' | 'updated_at'>): Promise<ServicePricePreset> => {
    const newP: ServicePricePreset = { ...p, id: `preset_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setPricePresets(prev => [newP, ...prev]);
    return newP;
  };
  const updatePricePreset = async (id: string, p: Partial<ServicePricePreset>) => {
    setPricePresets(prev => prev.map(item => item.id === id ? { ...item, ...p, updated_at: new Date().toISOString() } : item));
  };
  const deletePricePreset = async (id: string) => setPricePresets(prev => prev.filter(i => i.id !== id));

  const addPaymentTerm = async (term: Omit<PaymentTermItem, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentTermItem> => {
    const newT: PaymentTermItem = { ...term, id: `pt_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setPaymentTerms(prev => [newT, ...prev]);
    return newT;
  };
  const updatePaymentTerm = async (id: string, term: Partial<PaymentTermItem>) => {
    setPaymentTerms(prev => prev.map(item => item.id === id ? { ...item, ...term, updated_at: new Date().toISOString() } : item));
  };
  const deletePaymentTerm = async (id: string) => setPaymentTerms(prev => prev.filter(i => i.id !== id));

  const addUser = async (u: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> => {
    const newU: UserProfile = { ...u, id: `user_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    setUsers(prev => [newU, ...prev]);
    return newU;
  };
  const updateUser = async (id: string, u: Partial<UserProfile>) => {
    setUsers(prev => prev.map(item => item.id === id ? { ...item, ...u, updated_at: new Date().toISOString() } : item));
  };
  const deleteUser = async (id: string) => setUsers(prev => prev.filter(i => i.id !== id));

  const updateLegalDocument = async (id: string, doc: Partial<LegalDocument>) => {
    setLegalDocuments(prev => prev.map(item => item.id === id ? { ...item, ...doc, lastUpdated: new Date().toISOString() } : item));
  };
  const restoreLegalDocumentVersion = async (documentId: string, historyItem: LegalDocumentHistoryItem) => {
    setLegalDocuments(prev => prev.map(item => item.id === documentId ? { ...item, content: historyItem.content, version: historyItem.version, lastUpdated: new Date().toISOString() } : item));
  };

  const trackVisitorEvent = async (eventData: Partial<VisitorEvent> & { eventType: string }) => {
    const newEv: VisitorEvent = {
      id: `ev_${Date.now()}`,
      sessionId: eventData.sessionId || 'session_default',
      eventType: eventData.eventType,
      pagePath: eventData.pagePath || '/',
      sectionId: eventData.sectionId,
      deviceType: eventData.deviceType || 'desktop',
      browser: eventData.browser || 'Web Browser',
      os: eventData.os || 'Unknown OS',
      created_at: new Date().toISOString()
    };
    setVisitorEvents(prev => [newEv, ...prev]);
  };

  const addSupplier = async (s: Omit<SupplierVendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<SupplierVendor> => {
    const newS: SupplierVendor = { ...s, id: `supp_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setSuppliers(prev => [newS, ...prev]);
    return newS;
  };
  const updateSupplier = async (id: string, s: Partial<SupplierVendor>) => {
    setSuppliers(prev => prev.map(item => item.id === id ? { ...item, ...s, updatedAt: new Date().toISOString() } : item));
  };
  const deleteSupplier = async (id: string) => setSuppliers(prev => prev.filter(i => i.id !== id));

  const addUnit = async (u: Omit<UnitMasterItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<UnitMasterItem> => {
    const newU: UnitMasterItem = { ...u, id: `unit_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setUnitMaster(prev => [newU, ...prev]);
    return newU;
  };
  const updateUnit = async (id: string, u: Partial<UnitMasterItem>) => {
    setUnitMaster(prev => prev.map(item => item.id === id ? { ...item, ...u, updatedAt: new Date().toISOString() } : item));
  };
  const deleteUnit = async (id: string) => setUnitMaster(prev => prev.filter(i => i.id !== id));

  const addHsn = async (h: Omit<HsnMasterItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<HsnMasterItem> => {
    const newH: HsnMasterItem = { ...h, id: `hsn_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setHsnMaster(prev => [newH, ...prev]);
    return newH;
  };
  const updateHsn = async (id: string, h: Partial<HsnMasterItem>) => {
    setHsnMaster(prev => prev.map(item => item.id === id ? { ...item, ...h, updatedAt: new Date().toISOString() } : item));
  };
  const deleteHsn = async (id: string) => setHsnMaster(prev => prev.filter(i => i.id !== id));

  const addGoodsItem = async (item: Omit<GoodsItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GoodsItem> => {
    const newG: GoodsItem = { ...item, id: `goods_${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setGoodsItems(prev => [newG, ...prev]);
    return newG;
  };
  const updateGoodsItem = async (id: string, item: Partial<GoodsItem>) => {
    setGoodsItems(prev => prev.map(i => i.id === id ? ({ ...i, ...item, updatedAt: new Date().toISOString() } as GoodsItem) : i));
  };
  const deleteGoodsItem = async (id: string) => setGoodsItems(prev => prev.filter(i => i.id !== id));

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentView('public');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        activeTab,
        setActiveTab,
        currentView,
        setCurrentView,
        isLoading,
        dbConnected,
        lastSyncedAt,
        syncFromDatabase,

        latestLeadAlert,
        clearLeadAlert,
        isBuzzerMuted,
        toggleBuzzerMute,
        isLeadMonitoringActive,
        toggleLeadMonitoring,
        setLeadMonitoringActive: (active: boolean) => setIsLeadMonitoringActive(active),
        testBuzzerSound,
        triggerSimulatedLeadAlert,
        clearAllEnquiries,

        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        clearAllNotifications,
        emailLogs,
        addEmailLog,
        sendInvoiceEmail,
        sendQuotationEmail,
        sendPaymentReceiptEmail,

        clients,
        quotations,
        invoices,
        payments,
        creditDebitNotes,
        creditNotes: creditDebitNotes,
        purchases,
        expenses,
        staff,
        salaries,
        enquiries,
        portfolio,
        managedProjects,
        completedWork,
        chatbotQAs,
        chatbotSettings,
        services,
        technologies,
        testimonials,
        faqs,
        users,
        agencyConfig,
        pricePresets,
        paymentTerms,
        legalDocuments,
        visitorEvents,
        suppliers,
        unitMaster,
        hsnMaster,
        goodsItems,

        invoiceNumbering,
        quotationNumbering,
        creditNoteNumbering,
        debitNoteNumbering,
        updateInvoiceNumbering,
        updateQuotationNumbering,
        updateCreditNoteNumbering,
        updateDebitNoteNumbering,

        addClient,
        updateClient,
        deleteClient,

        addQuotation,
        updateQuotation,
        deleteQuotation,
        acceptQuotation,

        addInvoice,
        updateInvoice,
        deleteInvoice,

        addPayment,
        deletePayment,

        addCreditDebitNote,
        updateCreditDebitNote,
        deleteCreditDebitNote,

        addPurchase,
        updatePurchase,
        deletePurchase,

        addExpense,
        updateExpense,
        deleteExpense,

        addStaff,
        updateStaff,
        deleteStaff,

        addSalary,
        updateSalary,
        deleteSalary,

        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,

        addPortfolioProject,
        updatePortfolioProject,
        deletePortfolioProject,

        addManagedProject,
        updateManagedProject,
        deleteManagedProject,

        addCompletedWork,
        updateCompletedWork,
        deleteCompletedWork,

        addChatbotQA,
        updateChatbotQA,
        deleteChatbotQA,
        updateChatbotSettings,

        addService,
        updateService,
        deleteService,

        addTechnology,
        updateTechnology,
        deleteTechnology,

        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        addFaq,
        updateFaq,
        deleteFaq,

        updateAgencyConfig,

        addPricePreset,
        updatePricePreset,
        deletePricePreset,

        addPaymentTerm,
        updatePaymentTerm,
        deletePaymentTerm,

        addUser,
        updateUser,
        deleteUser,

        updateLegalDocument,
        restoreLegalDocumentVersion,

        trackVisitorEvent,

        addSupplier,
        updateSupplier,
        deleteSupplier,

        addUnit,
        updateUnit,
        deleteUnit,

        addHsn,
        updateHsn,
        deleteHsn,

        addGoodsItem,
        updateGoodsItem,
        deleteGoodsItem,

        isAuthenticated,
        setIsAuthenticated,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
