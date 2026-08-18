import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  UserProfile, 
  UserRole,
  Client, 
  Quotation, 
  Invoice, 
  Payment, 
  ProjectEnquiry, 
  PortfolioProject,
  AgencyService,
  ManagedProject,
  ProjectStatus,
  ProjectStatusHistoryItem,
  CompletedWorkRecord,
  TechnologyItem,
  TestimonialItem,
  FaqItem,
  ChatbotQAItem,
  ChatbotSettings,
  AuditLog,
  RoleDefinition,
  PermissionDefinition,
  ServicePricePreset,
  PaymentTermItem,
  DocumentNumberConfig,
  Purchase,
  Expense,
  StaffMember,
  SalaryRecord,
  CreditDebitNote,
  AccountingReportFilter,
  AppNotification,
  NotificationCategory,
  EmailLog,
  LegalDocument,
  LegalDocumentHistoryItem,
  VisitorEvent,
  VisitorEventType,
  VisitorMonitoringSummary,
  LegalDocumentStatus
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
  INITIAL_MANAGED_PROJECTS,
  INITIAL_COMPLETED_WORKS,
  INITIAL_TECHNOLOGIES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_CHATBOT_QA,
  INITIAL_CHATBOT_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SOCIAL_CHANNELS,
  INITIAL_PRICE_PRESETS,
  INITIAL_PAYMENT_TERMS,
  INITIAL_PURCHASES,
  INITIAL_EXPENSES,
  INITIAL_STAFF_MEMBERS,
  INITIAL_SALARY_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_EMAIL_LOGS,
  INITIAL_LEGAL_DOCUMENTS,
  INITIAL_LEGAL_HISTORY,
  INITIAL_VISITOR_EVENTS,
  AGENCY_CONFIG 
} from '../mockData';
import { DEFAULT_INVOICE_NUMBERING, DEFAULT_QUOTATION_NUMBERING } from '../utils/documentNumbering';
import { INITIAL_SYSTEM_ROLES, SYSTEM_PERMISSIONS, hasPermission } from '../lib/permissions';
import { calculateGstInvoiceTotals } from '../utils/gstEngine';
import { getOrCreateSessionId, detectDeviceType, detectBrowser, detectOS, getSanitizedReferrer, buildPrivacySafeMetadata } from '../utils/visitorTracker';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { logAuditEvent } from '../utils/auditLogger';
import { buzzerEngine } from '../utils/buzzerSound';
import { 
  sendProjectStatusEmailBackend, 
  sendQuotationEmailBackend, 
  sendPaymentReceiptEmailBackend, 
  sendInvoiceEmailBackend,
  sendGenericEmailBackend 
} from '../utils/emailService';
import { 
  filterNotificationsByRole, 
  playNotificationChime, 
  isDuplicateEvent 
} from '../utils/notificationEngine';

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

  // Buzzer & Lead Notifications
  latestLeadAlert: ProjectEnquiry | null;
  clearLeadAlert: () => void;
  isBuzzerMuted: boolean;
  toggleBuzzerMute: () => boolean;
  testBuzzerSound: () => void;
  triggerSimulatedLeadAlert: () => ProjectEnquiry;

  // Phase 12: Central Notification & Email System
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
  staffMembers: StaffMember[];
  salaryRecords: SalaryRecord[];
  enquiries: ProjectEnquiry[];
  portfolio: PortfolioProject[];
  services: AgencyService[];
  managedProjects: ManagedProject[];
  completedWorks: CompletedWorkRecord[];
  technologies: TechnologyItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  chatbotQAs: ChatbotQAItem[];
  chatbotSettings: ChatbotSettings;
  users: UserProfile[];
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'created_at'>) => void;

  // Phase 11: Credit & Debit Note Management (GSTR-1 CDNR Statutory Compliance)
  addCreditDebitNote: (note: Omit<CreditDebitNote, 'id' | 'created_at' | 'updated_at'>) => Promise<CreditDebitNote>;
  updateCreditDebitNote: (id: string, data: Partial<CreditDebitNote>) => Promise<void>;
  deleteCreditDebitNote: (id: string) => Promise<void>;
  generateNoteNumber: (type: 'credit' | 'debit') => string;

  // Phase 10: Purchases, Expenses, Staff & Salary Operations
  addPurchase: (purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => Promise<Purchase>;
  updatePurchase: (id: string, data: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
  markPurchasePaid: (id: string, paymentMode?: string, paymentRef?: string, paymentDate?: string) => Promise<void>;

  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<Expense>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addStaffMember: (staff: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>) => Promise<StaffMember>;
  updateStaffMember: (id: string, data: Partial<StaffMember>) => Promise<void>;
  deleteStaffMember: (id: string) => Promise<void>;

  addSalaryRecord: (record: Omit<SalaryRecord, 'id' | 'created_at' | 'updated_at'>) => Promise<SalaryRecord>;
  updateSalaryRecord: (id: string, data: Partial<SalaryRecord>) => Promise<void>;
  deleteSalaryRecord: (id: string) => Promise<void>;
  generateMonthlyPayroll: (periodMonth: string, periodYear: number) => Promise<{ count: number; message: string }>;
  markSalaryPaid: (id: string, paymentMode?: string, transactionRef?: string, paymentDate?: string) => Promise<void>;

  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'totalBilled' | 'totalPaid'>) => Client;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  softDeleteClient: (id: string) => void;
  restoreClient: (id: string) => void;
  
  addQuotation: (quote: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'> & { quoteNumber?: string }) => Quotation;
  updateQuotation: (id: string, data: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;
  convertQuoteToInvoice: (quoteId: string) => Invoice | null;
  
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'> & { invoiceNumber?: string }) => Invoice;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  softDeleteInvoice: (id: string) => void;
  restoreInvoice: (id: string) => void;
  createInvoiceFromProject: (projectId: string, overrideDuplicateWarning?: boolean) => { success: boolean; invoice?: Invoice; message?: string; alreadyInvoiced?: boolean; existingInvoiceNumber?: string };
  
  recordPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'receiptNumber'>) => Payment;
  updatePayment: (id: string, data: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  
  addEnquiry: (enquiry: Omit<ProjectEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'priority'>) => ProjectEnquiry;
  updateEnquiryStatus: (id: string, status: ProjectEnquiry['status']) => void;
  convertEnquiryToClient: (enquiryId: string) => Client | null;
  deleteEnquiry: (id: string) => void;

  addService: (service: Omit<AgencyService, 'id'>) => AgencyService;
  updateService: (id: string, data: Partial<AgencyService>) => void;
  deleteService: (id: string) => void;

  addManagedProject: (project: Omit<ManagedProject, 'id'>) => ManagedProject;
  updateManagedProject: (id: string, data: Partial<ManagedProject>, sendEmailNotification?: boolean, emailSubject?: string, emailNotes?: string) => Promise<ManagedProject | undefined>;
  deleteManagedProject: (id: string) => void;
  sendProjectStatusEmail: (projectId: string, newStatus: ProjectStatus | string, customNotes?: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;

  // Phase 9: Completed Work Record System (Internal Company Portfolio & History)
  addCompletedWork: (data: Omit<CompletedWorkRecord, 'id' | 'createdAt' | 'updatedAt'>) => CompletedWorkRecord;
  updateCompletedWork: (id: string, data: Partial<CompletedWorkRecord>) => void;
  deleteCompletedWork: (id: string) => void;
  archiveProjectToCompletedWork: (projectId: string) => CompletedWorkRecord | null;

  addTechnology: (tech: Omit<TechnologyItem, 'id'>) => TechnologyItem;
  updateTechnology: (id: string, data: Partial<TechnologyItem>) => void;
  deleteTechnology: (id: string) => void;

  addTestimonial: (testi: Omit<TestimonialItem, 'id'>) => TestimonialItem;
  updateTestimonial: (id: string, data: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;

  addFaq: (faq: Omit<FaqItem, 'id'>) => FaqItem;
  updateFaq: (id: string, data: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;

  addChatbotQA: (qa: Omit<ChatbotQAItem, 'id' | 'createdAt' | 'updatedAt'>) => ChatbotQAItem;
  updateChatbotQA: (id: string, data: Partial<ChatbotQAItem>) => void;
  deleteChatbotQA: (id: string) => void;
  updateChatbotSettings: (data: Partial<ChatbotSettings>) => void;

  addUser: (user: Omit<UserProfile, 'id'>) => UserProfile;
  updateUser: (id: string, data: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;

  // Custom Roles & Permissions Management
  roles: RoleDefinition[];
  permissions: PermissionDefinition[];
  addRole: (role: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt'>) => RoleDefinition | null;
  updateRole: (id: string, data: Partial<RoleDefinition>) => boolean;
  deleteRole: (id: string) => boolean;
  assignUserRole: (userId: string, roleCode: string) => void;
  checkPermission: (permissionCode: string) => boolean;

  // Phase 5: Service Price Presets
  pricePresets: ServicePricePreset[];
  addPricePreset: (preset: Omit<ServicePricePreset, 'id' | 'created_at' | 'updated_at'>) => ServicePricePreset;
  updatePricePreset: (id: string, data: Partial<ServicePricePreset>) => void;
  deletePricePreset: (id: string) => void;
  togglePricePresetActive: (id: string) => void;

  // Phase 5: Payment Terms Management
  paymentTerms: PaymentTermItem[];
  addPaymentTerm: (term: Omit<PaymentTermItem, 'id' | 'created_at' | 'updated_at'>) => PaymentTermItem;
  updatePaymentTerm: (id: string, data: Partial<PaymentTermItem>) => void;
  deletePaymentTerm: (id: string) => void;
  setDefaultPaymentTerm: (id: string) => void;

  // Phase 5: Document Numbering Configuration
  updateDocumentNumberConfig: (type: 'invoice' | 'quotation', config: Partial<DocumentNumberConfig>) => void;

  updateAgencyConfig: (data: Partial<Omit<typeof AGENCY_CONFIG, 'social_links' | 'socialLinks'> & { social_links?: Record<string, string>; socialLinks?: Record<string, string> }>) => void;
  agencyConfig: typeof AGENCY_CONFIG;

  // Phase 16: Legal Document Monitoring & Public Policies (Super Admin)
  legalDocuments: LegalDocument[];
  legalHistory: LegalDocumentHistoryItem[];
  updateLegalDocument: (id: string, updates: Partial<LegalDocument>, changeSummary?: string) => Promise<LegalDocument | undefined>;
  createLegalDocumentRevision: (id: string, newVersion: string, content: string, changeSummary: string, newStatus?: LegalDocumentStatus) => Promise<LegalDocument | undefined>;
  restoreLegalDocumentVersion: (documentId: string, historyId: string) => Promise<boolean>;

  // Phase 16: Privacy-Conscious Visitor Monitoring (Super Admin)
  visitorEvents: VisitorEvent[];
  trackVisitorEvent: (eventData: Partial<Omit<VisitorEvent, 'id' | 'created_at'>> & { eventType: VisitorEventType | string }) => Promise<VisitorEvent | undefined>;
  isVisitorTrackingEnabled: boolean;
  toggleVisitorTracking: () => boolean;
  clearVisitorEvents: () => Promise<void>;
  visitorSummary: VisitorMonitoringSummary;

  // Supabase Auth & Role-Based Access State
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [currentView, setCurrentView] = useState<'public' | 'portal'>('public');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fusion_forge_auth_session') === 'true';
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dbConnected, setDbConnected] = useState<boolean>(isSupabaseConfigured);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => new Date().toLocaleTimeString());

  // Real-time Lead Notification & Audio Buzzer Alert State
  const [latestLeadAlert, setLatestLeadAlert] = useState<ProjectEnquiry | null>(null);
  const [isBuzzerMuted, setIsBuzzerMuted] = useState<boolean>(() => buzzerEngine.isSoundMuted());

  const clearLeadAlert = useCallback(() => {
    setLatestLeadAlert(null);
  }, []);

  const toggleBuzzerMute = useCallback(() => {
    const muted = buzzerEngine.toggleMute();
    setIsBuzzerMuted(muted);
    return muted;
  }, []);

  const testBuzzerSound = useCallback(() => {
    buzzerEngine.playTestBuzzer();
  }, []);

  // In-Memory & Real-time Database State (Authoritatively Synced with Supabase PostgreSQL)
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_PURCHASES);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(INITIAL_SALARY_RECORDS);
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>(INITIAL_ENQUIRIES);
  const [services, setServices] = useState<AgencyService[]>(INITIAL_SERVICES);
  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>(INITIAL_MANAGED_PROJECTS);
  const [completedWorks, setCompletedWorks] = useState<CompletedWorkRecord[]>(INITIAL_COMPLETED_WORKS);
  const [technologies, setTechnologies] = useState<TechnologyItem[]>(INITIAL_TECHNOLOGIES);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [chatbotQAs, setChatbotQAs] = useState<ChatbotQAItem[]>(INITIAL_CHATBOT_QA);
  const [chatbotSettings, setChatbotSettings] = useState<ChatbotSettings>(INITIAL_CHATBOT_SETTINGS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_SYSTEM_ROLES);
  const [permissions] = useState<PermissionDefinition[]>(SYSTEM_PERMISSIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [pricePresets, setPricePresets] = useState<ServicePricePreset[]>(INITIAL_PRICE_PRESETS);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermItem[]>(INITIAL_PAYMENT_TERMS);
  const [creditDebitNotes, setCreditDebitNotes] = useState<CreditDebitNote[]>(INITIAL_CREDIT_DEBIT_NOTES);
  const [agencyConfig, setAgencyConfig] = useState<typeof AGENCY_CONFIG>(AGENCY_CONFIG);

  // Phase 12: Central Notification & Email State (Persisted in Supabase, NOT localStorage)
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(INITIAL_EMAIL_LOGS);

  const addNotification = useCallback(async (notifData: Omit<AppNotification, 'id' | 'created_at' | 'is_read'> & { is_read?: boolean }): Promise<AppNotification | undefined> => {
    // Deduplication check
    if (isDuplicateEvent(notifications, notifData.event_key, notifData.type, notifData.entity_id)) {
      return undefined;
    }

    const newId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();
    const fullNotif: AppNotification = {
      id: newId,
      created_at: timestamp,
      is_read: notifData.is_read ?? false,
      priority: notifData.priority || 'normal',
      category: notifData.category || 'system',
      target_role: notifData.target_role || 'all',
      metadata: notifData.metadata || {},
      ...notifData
    };

    setNotifications(prev => [fullNotif, ...prev]);

    // System audio chime
    playNotificationChime(fullNotif.priority);

    // Sync to Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').insert([{
          id: fullNotif.id,
          type: fullNotif.type,
          category: fullNotif.category,
          title: fullNotif.title,
          message: fullNotif.message,
          link: fullNotif.link || null,
          entity_type: fullNotif.entity_type || null,
          entity_id: fullNotif.entity_id || null,
          priority: fullNotif.priority,
          is_read: false,
          created_at: fullNotif.created_at,
          target_role: fullNotif.target_role,
          target_user_id: fullNotif.target_user_id || null,
          target_client_id: fullNotif.target_client_id || null,
          metadata: fullNotif.metadata,
          event_key: fullNotif.event_key || null
        }]);
      } catch (e) {
        console.warn('[Supabase Notification Insert] Handled fallback:', e);
      }
    }

    return fullNotif;
  }, [notifications]);

  const markNotificationRead = useCallback(async (id: string) => {
    const timestamp = new Date().toISOString();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: timestamp } : n));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').update({
          is_read: true,
          read_at: timestamp
        }).eq('id', id);
      } catch (e) {
        console.warn('[Supabase Notification Mark Read] Error:', e);
      }
    }
  }, []);

  const markAllNotificationsRead = useCallback(async (category?: NotificationCategory) => {
    const timestamp = new Date().toISOString();
    setNotifications(prev => prev.map(n => {
      if (!category || category === 'all' || n.category === category) {
        return { ...n, is_read: true, read_at: timestamp };
      }
      return n;
    }));

    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('notifications').update({
          is_read: true,
          read_at: timestamp
        });
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        await query;
      } catch (e) {
        console.warn('[Supabase Notification Mark All Read] Error:', e);
      }
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').delete().eq('id', id);
      } catch (e) {
        console.warn('[Supabase Notification Delete] Error:', e);
      }
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    setNotifications([]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').delete().neq('id', '');
      } catch (e) {
        console.warn('[Supabase Notifications Clear] Error:', e);
      }
    }
  }, []);

  const addEmailLog = useCallback(async (logData: Omit<EmailLog, 'id' | 'created_at'>): Promise<EmailLog> => {
    const newId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();
    const fullLog: EmailLog = {
      id: newId,
      created_at: timestamp,
      sender: logData.sender || 'admin@fusionforgecreation.com',
      ...logData
    };

    setEmailLogs(prev => [fullLog, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('email_logs').insert([{
          id: fullLog.id,
          recipient: fullLog.recipient,
          sender: fullLog.sender,
          subject: fullLog.subject,
          category: fullLog.category,
          status: fullLog.status,
          message_id: fullLog.message_id || null,
          error_message: fullLog.error_message || null,
          entity_type: fullLog.entity_type || null,
          entity_id: fullLog.entity_id || null,
          metadata: fullLog.metadata || {},
          created_at: fullLog.created_at
        }]);
      } catch (e) {
        console.warn('[Supabase Email Log Insert] Error:', e);
      }
    }

    return fullLog;
  }, []);

  // Phase 16: Legal Document Monitoring & Visitor Telemetry State (Synced with Supabase PostgreSQL)
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>(INITIAL_LEGAL_DOCUMENTS);
  const [legalHistory, setLegalHistory] = useState<LegalDocumentHistoryItem[]>(INITIAL_LEGAL_HISTORY);
  const [visitorEvents, setVisitorEvents] = useState<VisitorEvent[]>(INITIAL_VISITOR_EVENTS);
  const [isVisitorTrackingEnabled, setIsVisitorTrackingEnabled] = useState<boolean>(true);

  // Privacy-Conscious Visitor Telemetry Summary Calculator
  const visitorSummary: VisitorMonitoringSummary = useMemo(() => {
    const totalVisits = visitorEvents.length;
    const uniqueSessionSet = new Set(visitorEvents.map(e => e.sessionId));
    const uniqueSessions = uniqueSessionSet.size;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisits = visitorEvents.filter(e => e.created_at.startsWith(todayStr)).length;

    // Breakdown by Section / Page
    const sectionMap = new Map<string, { count: number; uniqueSessions: Set<string>; totalDuration: number }>();
    visitorEvents.forEach(e => {
      const key = e.sectionId || e.pagePath || '#home';
      const existing = sectionMap.get(key) || { count: 0, uniqueSessions: new Set(), totalDuration: 0 };
      existing.count += 1;
      existing.uniqueSessions.add(e.sessionId);
      existing.totalDuration += e.durationSeconds || 0;
      sectionMap.set(key, existing);
    });

    const sectionBreakdown = Array.from(sectionMap.entries()).map(([section, data]) => ({
      section,
      count: data.count,
      visitCount: data.count,
      uniqueVisitors: data.uniqueSessions.size,
      avgDurationSeconds: data.count > 0 ? Math.round(data.totalDuration / data.count) : 0
    })).sort((a, b) => b.count - a.count);

    // Breakdown by Device
    const deviceMap = new Map<string, number>();
    visitorEvents.forEach(e => {
      const key = e.deviceType || 'desktop';
      deviceMap.set(key, (deviceMap.get(key) || 0) + 1);
    });
    const deviceBreakdown = Array.from(deviceMap.entries()).map(([device, count]) => ({
      device,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Breakdown by Browser
    const browserMap = new Map<string, number>();
    visitorEvents.forEach(e => {
      const key = e.browser || 'Unknown';
      browserMap.set(key, (browserMap.get(key) || 0) + 1);
    });
    const browserBreakdown = Array.from(browserMap.entries()).map(([browser, count]) => ({
      browser,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Breakdown by Referrer
    const referrerMap = new Map<string, number>();
    visitorEvents.forEach(e => {
      const key = e.referrer || 'direct';
      referrerMap.set(key, (referrerMap.get(key) || 0) + 1);
    });
    const referrerBreakdown = Array.from(referrerMap.entries()).map(([referrer, count]) => ({
      referrer,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Average duration across all recorded sessions
    const totalDuration = visitorEvents.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    const averageDurationSeconds = totalVisits > 0 ? Math.round(totalDuration / totalVisits) : 0;

    return {
      totalVisits,
      uniqueSessions,
      todayVisits,
      sectionBreakdown,
      deviceBreakdown,
      browserBreakdown,
      referrerBreakdown,
      averageDurationSeconds,
      recentEvents: visitorEvents.slice(0, 50)
    };
  }, [visitorEvents]);

  // Sync state from Supabase PostgreSQL tables according to authoritative schema
  const syncFromDatabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLastSyncedAt(new Date().toLocaleTimeString());
      return;
    }

    try {
      setIsLoading(true);

      // 1. Fetch Clients (columns: id, name, company, email, phone, address, city, state, state_code, pincode, tax_number, gstin, pan, place_of_supply, place_of_supply_code, same_as_billing, shipping_name, shipping_company, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_state_code, shipping_pincode, shipping_gstin, notes, enquiry_id, created_at, updated_at)
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsData && clientsData.length > 0) {
        const mappedClients: Client[] = clientsData.map((c: any) => {
          const rawGstin = c.gstin || c.tax_number || '';
          const pos = c.place_of_supply || (c.state ? `${c.state_code ? `${c.state_code}-` : ''}${c.state}` : '');
          const sameAsBilling = c.same_as_billing !== false;
          return {
            id: c.id,
            name: c.name || '',
            contactPerson: c.contact_person || c.name || '',
            companyName: c.company || c.name || 'Client',
            email: c.email || '',
            phone: c.phone || '',
            address: c.address || '',
            city: c.city || '',
            state: c.state || '',
            stateCode: c.state_code || '',
            pincode: c.pincode || c.postal_code || '',
            postalCode: c.pincode || c.postal_code || '',
            gstin: rawGstin,
            pan: c.pan || (rawGstin.length >= 12 ? rawGstin.substring(2, 12) : ''),
            placeOfSupply: pos,
            placeOfSupplyCode: c.place_of_supply_code || c.state_code || '',
            isGstRegistered: Boolean(rawGstin && rawGstin.length === 15),
            isUrp: !rawGstin || rawGstin.toUpperCase() === 'URP',
            billingAddress: {
              street: c.address || '',
              city: c.city || '',
              state: c.state || '',
              stateCode: c.state_code || '',
              postalCode: c.pincode || c.postal_code || '',
              country: 'India'
            },
            sameAsBilling,
            shippingName: c.shipping_name || '',
            shippingCompany: c.shipping_company || '',
            shippingPhone: c.shipping_phone || '',
            shippingAddress: c.shipping_address || '',
            shippingCity: c.shipping_city || '',
            shippingState: c.shipping_state || '',
            shippingStateCode: c.shipping_state_code || '',
            shippingPincode: c.shipping_pincode || '',
            shippingGstin: c.shipping_gstin || '',
            currency: 'INR',
            status: c.status || 'active',
            isDeleted: c.is_deleted || false,
            deletedAt: c.deleted_at || undefined,
            totalBilled: 0,
            totalPaid: 0,
            notes: c.notes || '',
            createdAt: c.created_at,
            updatedAt: c.updated_at
          };
        });
        setClients(mappedClients);
      }

      // 2. Fetch Invoices with Items & calculate client links
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (*)
        `)
        .order('created_at', { ascending: false });

      if (invoicesData && invoicesData.length > 0) {
        const mappedInvoices: Invoice[] = invoicesData.map((inv: any) => {
          const client = clientsData?.find((c: any) => c.id === inv.client_id) || clients.find(c => c.id === inv.client_id);
          const rawItems = inv.invoice_items || [];
          const items = rawItems.map((item: any) => ({
            id: item.id,
            description: item.description,
            quantity: Number(item.quantity) || 1,
            rate: Number(item.unit_price) || 0,
            amount: Number(item.total_price) || (Number(item.quantity) * Number(item.unit_price))
          }));

          const statusMap: Record<string, Invoice['status']> = {
            'Draft': 'draft',
            'Sent': 'issued',
            'Partially Paid': 'partially_paid',
            'Paid': 'paid',
            'Overdue': 'overdue',
            'Cancelled': 'cancelled'
          };

          return {
            id: inv.id,
            invoiceNumber: inv.invoice_number,
            clientId: inv.client_id,
            clientName: client?.name || 'Client',
            clientCompany: client?.company || client?.name || 'Company',
            clientEmail: client?.email || '',
            clientAddress: client?.address || '',
            clientGstin: inv.buyer_gstin || client?.tax_number || '',
            sellerName: agencyConfig.name,
            sellerAddress: agencyConfig.address,
            sellerGstin: inv.seller_gstin || agencyConfig.gstin,
            sellerState: agencyConfig.state,
            sellerStateCode: inv.seller_state_code || '26',
            buyerCompany: client?.company || client?.name || '',
            buyerName: client?.name || '',
            buyerAddress: client?.address || '',
            buyerGstin: inv.buyer_gstin || client?.tax_number || '',
            buyerState: '',
            buyerStateCode: inv.buyer_state_code || '',
            supplyType: (inv.cgst_amount > 0 || inv.utgst_amount > 0 || inv.sgst_amount > 0) ? 'INTRA_STATE' : 'INTER_STATE',
            taxLabel: inv.gst_applicable ? 'GST 18%' : 'None',
            title: `Tax Invoice ${inv.invoice_number}`,
            issueDate: inv.issue_date,
            dueDate: inv.due_date,
            currency: 'INR',
            items,
            subtotal: Number(inv.subtotal) || 0,
            discountType: 'fixed',
            discountValue: Number(inv.discount) || 0,
            discountAmount: Number(inv.discount) || 0,
            taxableAmount: Number(inv.taxable_amount) || 0,
            gstType: inv.gst_applicable ? (inv.igst_amount > 0 ? 'igst' : (inv.utgst_amount > 0 ? 'cgst_utgst' : 'cgst_sgst')) : 'none',
            gstRate: Number(inv.tax_rate) || 18,
            cgstAmount: Number(inv.cgst_amount) || 0,
            sgstAmount: Number(inv.sgst_amount) || 0,
            utgstAmount: Number(inv.utgst_amount) || 0,
            igstAmount: Number(inv.igst_amount) || 0,
            totalAmount: Number(inv.grand_total) || 0,
            paidAmount: Number(inv.paid_amount) || 0,
            balanceDue: Math.max(0, (Number(inv.grand_total) || 0) - (Number(inv.paid_amount) || 0)),
            status: statusMap[inv.status] || 'issued',
            isDeleted: inv.is_deleted || false,
            deletedAt: inv.deleted_at || undefined,
            notes: inv.notes || '',
            paymentTerms: inv.terms || 'Payment terms: Due within 15 days of issue date.',
            createdAt: inv.created_at,
            updatedAt: inv.updated_at
          };
        });
        setInvoices(mappedInvoices);
      }

      // 3. Fetch Payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsData && paymentsData.length > 0) {
        const mappedPayments: Payment[] = paymentsData.map((p: any) => {
          const inv = invoicesData?.find((i: any) => i.id === p.invoice_id);
          const client = clientsData?.find((c: any) => c.id === inv?.client_id);
          return {
            id: p.id,
            receiptNumber: `REC-${p.id.substring(0, 8).toUpperCase()}`,
            invoiceId: p.invoice_id,
            invoiceNumber: inv?.invoice_number || 'INV',
            clientId: inv?.client_id || '',
            clientCompany: client?.company || client?.name || 'Client',
            clientName: client?.name || 'Client',
            amount: Number(p.amount) || 0,
            currency: 'INR',
            paymentDate: p.payment_date,
            paymentMethod: p.payment_method || 'Bank Transfer',
            transactionRef: p.transaction_ref || '',
            notes: p.notes || '',
            createdAt: p.created_at
          };
        });
        setPayments(mappedPayments);
      }

      // 4. Fetch Enquiries (columns: id, name, company, email, phone, project_type, budget, timeline, message, status, created_at, updated_at)
      const { data: enquiriesData } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (enquiriesData && enquiriesData.length > 0) {
        const statusMap: Record<string, ProjectEnquiry['status']> = {
          'New': 'new',
          'Contacted': 'contacted',
          'Discussion': 'in_discussion',
          'Proposal': 'proposal_sent',
          'Won': 'won',
          'Lost': 'lost'
        };

        const mappedEnquiries: ProjectEnquiry[] = enquiriesData.map((e: any) => ({
          id: e.id,
          name: e.name,
          company: e.company || '',
          email: e.email,
          phone: e.phone || '',
          gstin: e.gstin || e.gst_number || '',
          address: e.address || '',
          service: e.project_type || 'Custom Solution',
          serviceCategory: e.project_type || 'Custom Solution',
          budgetRange: e.budget || 'Custom',
          timeline: e.timeline || 'Immediate',
          projectDescription: e.message || '',
          status: statusMap[e.status] || 'new',
          priority: 'high',
          source: 'Website Contact Form',
          createdAt: e.created_at,
          updatedAt: e.updated_at
        }));
        setEnquiries(mappedEnquiries);
      }

      // 5. Fetch Services
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });

      if (servicesData && servicesData.length > 0) {
        const mappedServices: AgencyService[] = servicesData.map((s: any) => ({
          id: s.id,
          title: s.title,
          slug: s.slug,
          description: s.description,
          icon: s.icon || 'Code',
          features: s.features || [],
          orderIndex: s.order_index || 0,
          isActive: s.is_active ?? true
        }));
        setServices(mappedServices);
      }

      // 6. Fetch Projects (Portfolio)
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsData && projectsData.length > 0) {
        const mappedProjects: PortfolioProject[] = projectsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          clientName: p.client_name || 'Enterprise Client',
          category: 'Full-Stack Software',
          summary: p.description,
          deliverables: [
            'Architectural blueprint & security audit',
            'Full source code transfer & deployment'
          ],
          techStack: p.technologies || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
          bannerImage: p.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
          featured: p.featured ?? false,
          liveUrl: p.live_url || ''
        }));
        setPortfolio(mappedProjects);
      }

      // 7. Fetch Technologies
      const { data: techData } = await supabase
        .from('technologies')
        .select('*')
        .order('created_at', { ascending: true });

      if (techData && techData.length > 0) {
        const mappedTech: TechnologyItem[] = techData.map((t: any) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          logoUrl: t.logo_url || '',
          isActive: t.is_active ?? true
        }));
        setTechnologies(mappedTech);
      }

      // 8. Fetch Testimonials
      const { data: testiData } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (testiData && testiData.length > 0) {
        const mappedTestimonials: TestimonialItem[] = testiData.map((t: any) => ({
          id: t.id,
          name: t.client_name,
          role: t.client_title || 'Client',
          company: t.company,
          avatar: t.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          rating: t.rating || 5,
          content: t.content,
          isFeatured: t.is_featured ?? true
        }));
        setTestimonials(mappedTestimonials);
      }

      // 9. Fetch FAQs
      const { data: faqsData } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (faqsData && faqsData.length > 0) {
        const mappedFaqs: FaqItem[] = faqsData.map((f: any) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: f.category || 'General',
          orderIndex: f.order_index || 0,
          isActive: f.is_active ?? true
        }));
        setFaqs(mappedFaqs);
      }

      // 9B. Fetch Completed Works (Phase 9 Internal History System)
      try {
        const { data: cwData } = await supabase
          .from('completed_works')
          .select('*')
          .order('completion_date', { ascending: false });

        if (cwData && cwData.length > 0) {
          const mappedCW: CompletedWorkRecord[] = cwData.map((cw: any) => ({
            id: cw.id,
            clientName: cw.client_name,
            projectTitle: cw.project_title,
            workCategory: cw.work_category,
            completionDate: cw.completion_date,
            technologyType: cw.technology_type || [],
            publicUrl: cw.public_url || undefined,
            webAppUrl: cw.web_app_url || undefined,
            softwareUrl: cw.software_url || undefined,
            mobileAppInfo: cw.mobile_app_info || undefined,
            shortDescription: cw.short_description || '',
            deliverablesSummary: cw.deliverables_summary || [],
            sourceProjectId: cw.source_project_id || undefined,
            isVerified: cw.is_verified ?? true,
            createdAt: cw.created_at || new Date().toISOString(),
            updatedAt: cw.updated_at || new Date().toISOString()
          }));
          setCompletedWorks(mappedCW);
        }
      } catch (cwErr) {
        console.warn('Completed works table not yet migrated in Supabase, using initial seed data.', cwErr);
      }

      // 10. Fetch Seller Profile
      const { data: sellerData } = await supabase
        .from('seller_profile')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (sellerData) {
        setAgencyConfig(prev => ({
          ...prev,
          name: sellerData.company_name || prev.name,
          company_name: sellerData.company_name || prev.company_name,
          tagline: sellerData.tagline || prev.tagline,
          email: sellerData.email || prev.email,
          phone: sellerData.phone || prev.phone,
          address: sellerData.address || prev.address,
          gstin: sellerData.gstin || prev.gstin,
          state_code: sellerData.state_code || prev.state_code,
          msme_number: sellerData.msme_number || prev.msme_number,
          msmeNumber: sellerData.msme_number || prev.msmeNumber,
          stamp_url: sellerData.stamp_url || prev.stamp_url,
          stampUrl: sellerData.stamp_url || prev.stampUrl,
          signature_url: sellerData.signature_url || prev.signature_url,
          logo_url: sellerData.logo_url || prev.logo_url,
          default_quotation_validity_days: sellerData.default_quotation_validity_days ?? prev.default_quotation_validity_days,
          quotation_terms: sellerData.quotation_terms || prev.quotation_terms,
          invoice_terms: sellerData.invoice_terms || prev.invoice_terms,
          numbering_configs: sellerData.numbering_configs ? {
            invoice: { ...DEFAULT_INVOICE_NUMBERING, ...(sellerData.numbering_configs.invoice || {}) },
            quotation: { ...DEFAULT_QUOTATION_NUMBERING, ...(sellerData.numbering_configs.quotation || {}) }
          } : prev.numbering_configs,
          bank_name: sellerData.bank_name || prev.bank_name,
          account_name: sellerData.account_name || prev.account_name,
          account_number: sellerData.account_number || prev.account_number,
          ifsc_code: sellerData.ifsc_code || prev.ifsc_code,
          branch_name: sellerData.branch_name || prev.branch_name,
          terms_conditions: sellerData.terms_conditions || prev.terms_conditions,
          bankDetails: {
            bankName: sellerData.bank_name || prev.bankDetails.bankName,
            accountName: sellerData.account_name || prev.bankDetails.accountName,
            accountNumber: sellerData.account_number || prev.bankDetails.accountNumber,
            ifscCode: sellerData.ifsc_code || prev.bankDetails.ifscCode,
            branch: sellerData.branch_name || prev.bankDetails.branch,
            upiId: prev.bankDetails.upiId
          }
        }));
      }

      // 10B. Fetch Service Price Presets from Supabase
      try {
        const { data: presetsData } = await supabase
          .from('service_price_presets')
          .select('*')
          .order('created_at', { ascending: true });

        if (presetsData && presetsData.length > 0) {
          const mappedPresets: ServicePricePreset[] = presetsData.map((p: any) => ({
            id: p.id,
            service_name: p.service_name,
            name: p.service_name,
            description: p.description || '',
            sac_code: p.sac_code || '998314',
            sacCode: p.sac_code || '998314',
            default_price: Number(p.default_price) || 0,
            rate: Number(p.default_price) || 0,
            gst_applicable: p.gst_applicable ?? true,
            gst_rate: Number(p.gst_rate) || 18,
            is_active: p.is_active ?? true,
            created_at: p.created_at,
            updated_at: p.updated_at
          }));
          setPricePresets(mappedPresets);
        }
      } catch (err) {
        console.warn('[Supabase Presets Fetch] Handled non-critical error:', err);
      }

      // 10C. Fetch Payment Terms from Supabase
      try {
        const { data: termsData } = await supabase
          .from('payment_terms')
          .select('*')
          .order('sort_order', { ascending: true });

        if (termsData && termsData.length > 0) {
          const mappedTerms: PaymentTermItem[] = termsData.map((t: any) => ({
            id: t.id,
            name: t.name,
            description: t.description || '',
            is_default: t.is_default ?? false,
            sort_order: t.sort_order || 0,
            created_at: t.created_at,
            updated_at: t.updated_at
          }));
          setPaymentTerms(mappedTerms);
        }
      } catch (err) {
        console.warn('[Supabase Payment Terms Fetch] Handled non-critical error:', err);
      }

      // 11. Fetch Profiles
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*');

      if (profilesData && profilesData.length > 0) {
        const mappedUsers: UserProfile[] = profilesData.map((p: any) => ({
          id: p.id,
          name: p.full_name || p.email?.split('@')[0] || 'User',
          full_name: p.full_name || p.email?.split('@')[0] || 'User',
          email: p.email,
          role: p.role as UserRole,
          is_active: true,
          company: 'Fusion Forge Creation',
          created_at: p.created_at,
          updated_at: p.updated_at
        }));
        setUsers(mappedUsers);
      }

      // 12. Fetch Purchases (Phase 10 Supabase Database Integration)
      try {
        const { data: purchasesData } = await supabase
          .from('purchases')
          .select('*')
          .order('purchase_date', { ascending: false });

        if (purchasesData && purchasesData.length > 0) {
          const mappedPurchases: Purchase[] = purchasesData.map((p: any) => ({
            id: p.id,
            supplierName: p.supplier_name,
            supplierGstin: p.supplier_gstin || undefined,
            supplierEmail: p.supplier_email || undefined,
            supplierPhone: p.supplier_phone || undefined,
            supplierAddress: p.supplier_address || undefined,
            supplierStateCode: p.supplier_state_code || undefined,
            billNumber: p.bill_number,
            purchaseDate: p.purchase_date,
            dueDate: p.due_date || undefined,
            description: p.description,
            hsnSacCode: p.hsn_sac_code || undefined,
            category: p.category || undefined,
            taxableAmount: Number(p.taxable_amount) || 0,
            gstRate: Number(p.gst_rate) || 0,
            cgstAmount: Number(p.cgst_amount) || 0,
            sgstAmount: Number(p.sgst_amount) || 0,
            utgstAmount: Number(p.utgst_amount) || 0,
            igstAmount: Number(p.igst_amount) || 0,
            totalAmount: Number(p.total_amount) || 0,
            paymentStatus: p.payment_status || 'pending',
            paymentMode: p.payment_mode || undefined,
            paymentDate: p.payment_date || undefined,
            paymentRef: p.payment_ref || undefined,
            attachmentUrl: p.attachment_url || undefined,
            attachmentName: p.attachment_name || undefined,
            notes: p.notes || undefined,
            isItcClaimable: p.is_itc_claimable ?? true,
            isReverseCharge: p.is_reverse_charge ?? false,
            created_at: p.created_at,
            updated_at: p.updated_at
          }));
          setPurchases(mappedPurchases);
        }
      } catch (purErr) {
        console.warn('[Supabase Purchases Sync] Non-critical fallback:', purErr);
      }

      // 13. Fetch Expenses (Phase 10 Supabase Database Integration)
      try {
        const { data: expensesData } = await supabase
          .from('expenses')
          .select('*')
          .order('expense_date', { ascending: false });

        if (expensesData && expensesData.length > 0) {
          const mappedExpenses: Expense[] = expensesData.map((e: any) => ({
            id: e.id,
            expenseDate: e.expense_date,
            category: e.category,
            description: e.description,
            vendorName: e.vendor_name,
            vendorGstin: e.vendor_gstin || undefined,
            amount: Number(e.amount) || 0,
            gstApplicable: e.gst_applicable ?? false,
            taxableAmount: Number(e.taxable_amount) || undefined,
            gstRate: Number(e.gst_rate) || undefined,
            gstAmount: Number(e.gst_amount) || undefined,
            cgstAmount: Number(e.cgst_amount) || undefined,
            sgstAmount: Number(e.sgst_amount) || undefined,
            igstAmount: Number(e.igst_amount) || undefined,
            isItcEligible: e.is_itc_eligible ?? true,
            paymentMode: e.payment_mode || 'UPI',
            referenceNumber: e.reference_number || undefined,
            attachmentUrl: e.attachment_url || undefined,
            attachmentName: e.attachment_name || undefined,
            paidBy: e.paid_by || undefined,
            status: e.status || 'paid',
            notes: e.notes || undefined,
            created_at: e.created_at,
            updated_at: e.updated_at
          }));
          setExpenses(mappedExpenses);
        }
      } catch (expErr) {
        console.warn('[Supabase Expenses Sync] Non-critical fallback:', expErr);
      }

      // 14. Fetch Staff Members (Phase 10 Supabase Database Integration)
      try {
        const { data: staffData } = await supabase
          .from('staff_members')
          .select('*')
          .order('employee_id', { ascending: true });

        if (staffData && staffData.length > 0) {
          const mappedStaff: StaffMember[] = staffData.map((s: any) => ({
            id: s.id,
            employeeId: s.employee_id,
            fullName: s.full_name,
            email: s.email,
            phone: s.phone || undefined,
            designation: s.designation,
            department: s.department,
            joiningDate: s.joining_date,
            panNumber: s.pan_number || undefined,
            bankAccountName: s.bank_account_name || undefined,
            bankName: s.bank_name || undefined,
            bankAccountNumber: s.bank_account_number || undefined,
            bankIfsc: s.bank_ifsc || undefined,
            baseSalary: Number(s.base_salary) || 0,
            hraAllowance: Number(s.hra_allowance) || 0,
            specialAllowance: Number(s.special_allowance) || 0,
            pfApplicable: s.pf_applicable ?? true,
            esiApplicable: s.esi_applicable ?? false,
            tdsApplicable: s.tds_applicable ?? true,
            isActive: s.is_active ?? true,
            created_at: s.created_at,
            updated_at: s.updated_at
          }));
          setStaffMembers(mappedStaff);
        }
      } catch (stfErr) {
        console.warn('[Supabase Staff Sync] Non-critical fallback:', stfErr);
      }

      // 15. Fetch Salary Records (Phase 10 Supabase Database Integration)
      try {
        const { data: salaryData } = await supabase
          .from('salary_records')
          .select('*')
          .order('period_year', { ascending: false })
          .order('period_month', { ascending: false });

        if (salaryData && salaryData.length > 0) {
          const mappedSalary: SalaryRecord[] = salaryData.map((sal: any) => ({
            id: sal.id,
            employeeId: sal.employee_id,
            employeeName: sal.employee_name,
            employeeCode: sal.employee_code || undefined,
            designation: sal.designation || undefined,
            department: sal.department || undefined,
            period: sal.period,
            periodMonth: sal.period_month,
            periodYear: Number(sal.period_year),
            basicSalary: Number(sal.basic_salary) || 0,
            hra: Number(sal.hra) || 0,
            specialAllowance: Number(sal.special_allowance) || 0,
            bonusOrIncentive: Number(sal.bonus_or_incentive) || 0,
            grossSalary: Number(sal.gross_salary) || 0,
            providentFund: Number(sal.provident_fund) || 0,
            esi: Number(sal.esi) || 0,
            professionalTax: Number(sal.professional_tax) || 0,
            tdsDeduction: Number(sal.tds_deduction) || 0,
            advanceDeduction: Number(sal.advance_deduction) || 0,
            totalDeductions: Number(sal.total_deductions) || 0,
            netSalary: Number(sal.net_salary) || 0,
            paymentDate: sal.payment_date || undefined,
            paymentStatus: sal.payment_status || 'processing',
            paymentMode: sal.payment_mode || undefined,
            transactionReference: sal.transaction_reference || undefined,
            payslipGenerated: sal.payslip_generated ?? true,
            payslipNumber: sal.payslip_number || undefined,
            notes: sal.notes || undefined,
            created_at: sal.created_at,
            updated_at: sal.updated_at
          }));
          setSalaryRecords(mappedSalary);
        }
      } catch (salErr) {
        console.warn('[Supabase Salary Sync] Non-critical fallback:', salErr);
      }

      // 16. Fetch Credit/Debit Notes (Phase 11 GSTR-1 CDNR Statutory Compliance)
      try {
        const { data: cdnData } = await supabase
          .from('credit_debit_notes')
          .select('*')
          .order('issue_date', { ascending: false });

        if (cdnData && cdnData.length > 0) {
          const mappedNotes: CreditDebitNote[] = cdnData.map((cdn: any) => ({
            id: cdn.id,
            noteNumber: cdn.note_number,
            noteType: cdn.note_type || 'credit',
            invoiceId: cdn.invoice_id,
            invoiceNumber: cdn.invoice_number,
            invoiceDate: cdn.invoice_date,
            clientId: cdn.client_id,
            clientName: cdn.client_name,
            clientCompany: cdn.client_company,
            clientGstin: cdn.client_gstin || '',
            clientAddress: cdn.client_address || '',
            sellerName: cdn.seller_name || agencyConfig.company_name,
            sellerGstin: cdn.seller_gstin || agencyConfig.gstin,
            sellerState: cdn.seller_state || agencyConfig.state,
            sellerStateCode: cdn.seller_state_code || agencyConfig.state_code,
            buyerState: cdn.buyer_state || '',
            buyerStateCode: cdn.buyer_state_code || '',
            placeOfSupply: cdn.place_of_supply || '',
            issueDate: cdn.issue_date,
            reason: cdn.reason || '02-Post Sale Discount',
            reasonNotes: cdn.reason_notes || '',
            reverseCharge: cdn.reverse_charge || 'No',
            items: cdn.items || [
              {
                id: '1',
                description: 'Statutory Credit Adjustment on Services',
                sacCode: '998314',
                quantity: 1,
                rate: Number(cdn.taxable_amount) || 0,
                amount: Number(cdn.taxable_amount) || 0
              }
            ],
            subtotal: Number(cdn.subtotal) || Number(cdn.taxable_amount) || 0,
            taxableAmount: Number(cdn.taxable_amount) || 0,
            gstType: cdn.gst_type || (Number(cdn.igst_amount) > 0 ? 'igst' : 'cgst_utgst'),
            gstRate: Number(cdn.gst_rate) || 18,
            cgstAmount: Number(cdn.cgst_amount) || 0,
            sgstAmount: Number(cdn.sgst_amount) || 0,
            utgstAmount: Number(cdn.utgst_amount) || 0,
            igstAmount: Number(cdn.igst_amount) || 0,
            totalTax: Number(cdn.total_tax) || (Number(cdn.cgst_amount) || 0) + (Number(cdn.sgst_amount) || 0) + (Number(cdn.utgst_amount) || 0) + (Number(cdn.igst_amount) || 0),
            totalAmount: Number(cdn.total_amount) || 0,
            amountInWords: cdn.amount_in_words || '',
            status: cdn.status || 'issued',
            createdBy: cdn.created_by || 'Fusion Forge Creation',
            created_at: cdn.created_at,
            updated_at: cdn.updated_at
          }));
          setCreditDebitNotes(mappedNotes);
        }
      } catch (cdnErr) {
        console.warn('[Supabase Credit Debit Notes Sync] Non-critical fallback:', cdnErr);
      }

      // 17. Fetch Notifications (Phase 12 Central Notification & Email System)
      try {
        const { data: notifsData } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (notifsData && notifsData.length > 0) {
          const mappedNotifs: AppNotification[] = notifsData.map((n: any) => ({
            id: n.id,
            type: n.type,
            category: n.category || 'system',
            title: n.title,
            message: n.message,
            link: n.link || undefined,
            entity_type: n.entity_type || undefined,
            entity_id: n.entity_id || undefined,
            priority: n.priority || 'normal',
            is_read: n.is_read ?? false,
            read_at: n.read_at || undefined,
            created_at: n.created_at,
            target_role: n.target_role || 'all',
            target_user_id: n.target_user_id || undefined,
            target_client_id: n.target_client_id || undefined,
            metadata: n.metadata || {},
            event_key: n.event_key || undefined
          }));
          setNotifications(mappedNotifs);
        }
      } catch (notifErr) {
        console.warn('[Supabase Notifications Sync] Non-critical fallback:', notifErr);
      }

      // 18. Fetch Email Logs (Phase 12 Central Notification & Email System)
      try {
        const { data: emailLogsData } = await supabase
          .from('email_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (emailLogsData && emailLogsData.length > 0) {
          const mappedLogs: EmailLog[] = emailLogsData.map((e: any) => ({
            id: e.id,
            recipient: e.recipient,
            sender: e.sender || 'admin@fusionforgecreation.com',
            subject: e.subject,
            category: e.category || 'general',
            status: e.status || 'sent',
            message_id: e.message_id || undefined,
            error_message: e.error_message || undefined,
            entity_type: e.entity_type || undefined,
            entity_id: e.entity_id || undefined,
            metadata: e.metadata || {},
            created_at: e.created_at
          }));
          setEmailLogs(mappedLogs);
        }
      } catch (emlErr) {
        console.warn('[Supabase Email Logs Sync] Non-critical fallback:', emlErr);
      }

      // 19. Fetch Legal Documents (Phase 16 Legal Document Monitoring)
      try {
        const { data: legalData } = await supabase
          .from('legal_documents')
          .select('*')
          .order('created_at', { ascending: true });

        if (legalData && legalData.length > 0) {
          const mappedLegal: LegalDocument[] = legalData.map((d: any) => ({
            id: d.id,
            slug: d.slug,
            title: d.title,
            documentType: d.document_type,
            version: d.version,
            effectiveDate: d.effective_date,
            lastUpdatedDate: d.last_updated_date || d.updated_at,
            status: d.status || 'active',
            summary: d.summary || '',
            content: d.content || '',
            jurisdiction: d.jurisdiction || 'Dadra and Nagar Haveli and Daman and Diu, India',
            applicableLaw: d.applicable_law || 'DPDP Act, 2023 & IT Act, 2000',
            createdBy: d.created_by || 'Manoj Satapathy',
            createdByEmail: d.created_by_email || 'manojsatapathy.jp@gmail.com',
            lastModifiedBy: d.last_modified_by || 'Manoj Satapathy',
            lastModifiedByEmail: d.last_modified_by_email || 'manojsatapathy.jp@gmail.com',
            lastModifiedByRole: d.last_modified_by_role || 'Super Admin',
            changeSummary: d.change_summary || '',
            versionHistoryCount: d.version_history_count || 1,
            created_at: d.created_at,
            updated_at: d.updated_at
          }));
          setLegalDocuments(mappedLegal);
        }
      } catch (legalErr) {
        console.warn('[Supabase Legal Documents Sync] Non-critical fallback:', legalErr);
      }

      // 20. Fetch Legal Document History (Phase 16 Audit Tracking)
      try {
        const { data: historyData } = await supabase
          .from('legal_document_history')
          .select('*')
          .order('created_at', { ascending: false });

        if (historyData && historyData.length > 0) {
          const mappedHistory: LegalDocumentHistoryItem[] = historyData.map((h: any) => ({
            id: h.id,
            documentId: h.document_id,
            documentSlug: h.document_slug,
            version: h.version,
            title: h.title,
            summary: h.summary,
            content: h.content,
            effectiveDate: h.effective_date,
            status: h.status,
            changedBy: h.changed_by,
            changedByEmail: h.changed_by_email,
            changedByRole: h.changed_by_role,
            changeSummary: h.change_summary,
            created_at: h.created_at
          }));
          setLegalHistory(mappedHistory);
        }
      } catch (histErr) {
        console.warn('[Supabase Legal History Sync] Non-critical fallback:', histErr);
      }

      // 21. Fetch Privacy-Conscious Visitor Telemetry Events (Phase 16)
      try {
        const { data: visitorData } = await supabase
          .from('visitor_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(300);

        if (visitorData && visitorData.length > 0) {
          const mappedVisitor: VisitorEvent[] = visitorData.map((v: any) => ({
            id: v.id,
            sessionId: v.session_id,
            eventType: v.event_type || 'page_view',
            pagePath: v.page_path || '/',
            sectionId: v.section_id || undefined,
            referrer: v.referrer || 'direct',
            deviceType: v.device_type || 'desktop',
            browser: v.browser || 'Unknown',
            os: v.os || 'Unknown',
            region: v.region || undefined,
            durationSeconds: v.duration_seconds || undefined,
            metadata: v.metadata || {},
            created_at: v.created_at
          }));
          setVisitorEvents(mappedVisitor);
        }
      } catch (visErr) {
        console.warn('[Supabase Visitor Events Sync] Non-critical fallback:', visErr);
      }

      setDbConnected(true);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('[Supabase Production Sync] Handled error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [agencyConfig]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[Supabase Auth] Sign out notice:', err);
      }
    }
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('fusion_forge_auth_session');
    } catch {}
    setCurrentView('public');
    setActiveTab('dashboard');
  }, []);

  // Initial Database Load & Supabase Auth Listener
  useEffect(() => {
    syncFromDatabase();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userProfile = users.find(u => u.email === session.user.email) || {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as UserRole) || 'super_admin',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        // Strict role check: client accounts are not granted administrative portal access
        if (userProfile.role !== 'client') {
          setCurrentUser(userProfile);
          setIsAuthenticated(true);
          try {
            localStorage.setItem('fusion_forge_auth_session', 'true');
          } catch {}
        } else {
          setIsAuthenticated(false);
          try {
            localStorage.removeItem('fusion_forge_auth_session');
          } catch {}
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        try {
          localStorage.removeItem('fusion_forge_auth_session');
        } catch {}
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [syncFromDatabase, users]);

  const addAuditLog = async (logData: Omit<AuditLog, 'id' | 'created_at'>) => {
    const newLog = await logAuditEvent({
      user: currentUser,
      action: logData.action,
      tableName: logData.table_name,
      recordId: logData.record_id,
      details: logData.details,
      ipAddress: logData.ip_address
    });
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const user = users.find(u => u.role === role) || {
      id: `user_${role}`,
      name: `${role.toUpperCase()} User`,
      full_name: `${role.toUpperCase()} User`,
      email: `${role}@fusionforgecreation.com`,
      role,
      company: 'Fusion Forge Creation',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCurrentUser(user);

    addAuditLog({
      user_id: user.id,
      user_email: user.email,
      user_role: role,
      action: 'ROLE_CHANGE',
      table_name: 'profiles',
      record_id: user.id,
      details: `Switched active session role to ${role}`
    });
  };

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'totalBilled' | 'totalPaid'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `client_${Date.now()}`,
      totalBilled: 0,
      totalPaid: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClients(prev => [newClient, ...prev]);

    // Authoritative Supabase Insert into 'clients' table
    if (isSupabaseConfigured) {
      supabase.from('clients').insert({
        id: newClient.id,
        name: newClient.name,
        contact_person: newClient.contactPerson || newClient.name,
        company: newClient.companyName,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address || newClient.billingAddress?.street || '',
        city: newClient.city || newClient.billingAddress?.city || '',
        state: newClient.state || newClient.billingAddress?.state || '',
        state_code: newClient.stateCode || newClient.billingAddress?.stateCode || '',
        pincode: newClient.pincode || newClient.postalCode || newClient.billingAddress?.postalCode || '',
        postal_code: newClient.pincode || newClient.postalCode || '',
        place_of_supply: newClient.placeOfSupply || '',
        place_of_supply_code: newClient.placeOfSupplyCode || newClient.stateCode || '',
        tax_number: newClient.gstin || '',
        gstin: newClient.gstin || '',
        pan: newClient.pan || '',
        same_as_billing: newClient.sameAsBilling !== false,
        shipping_name: newClient.shippingName || '',
        shipping_company: newClient.shippingCompany || '',
        shipping_phone: newClient.shippingPhone || '',
        shipping_address: newClient.shippingAddress || '',
        shipping_city: newClient.shippingCity || '',
        shipping_state: newClient.shippingState || '',
        shipping_state_code: newClient.shippingStateCode || '',
        shipping_pincode: newClient.shippingPincode || '',
        shipping_gstin: newClient.shippingGstin || '',
        notes: newClient.notes || ''
      }).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'clients',
      record_id: newClient.id,
      details: `Created new client: ${newClient.companyName} (${newClient.name})`
    });

    return newClient;
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c));

    if (isSupabaseConfigured) {
      supabase.from('clients').update({
        ...(data.companyName !== undefined ? { company: data.companyName } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.contactPerson !== undefined ? { contact_person: data.contactPerson } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.state !== undefined ? { state: data.state } : {}),
        ...(data.stateCode !== undefined ? { state_code: data.stateCode } : {}),
        ...(data.pincode !== undefined ? { pincode: data.pincode, postal_code: data.pincode } : {}),
        ...(data.placeOfSupply !== undefined ? { place_of_supply: data.placeOfSupply } : {}),
        ...(data.placeOfSupplyCode !== undefined ? { place_of_supply_code: data.placeOfSupplyCode } : {}),
        ...(data.gstin !== undefined ? { tax_number: data.gstin, gstin: data.gstin } : {}),
        ...(data.pan !== undefined ? { pan: data.pan } : {}),
        ...(data.sameAsBilling !== undefined ? { same_as_billing: data.sameAsBilling } : {}),
        ...(data.shippingName !== undefined ? { shipping_name: data.shippingName } : {}),
        ...(data.shippingCompany !== undefined ? { shipping_company: data.shippingCompany } : {}),
        ...(data.shippingPhone !== undefined ? { shipping_phone: data.shippingPhone } : {}),
        ...(data.shippingAddress !== undefined ? { shipping_address: data.shippingAddress } : {}),
        ...(data.shippingCity !== undefined ? { shipping_city: data.shippingCity } : {}),
        ...(data.shippingState !== undefined ? { shipping_state: data.shippingState } : {}),
        ...(data.shippingStateCode !== undefined ? { shipping_state_code: data.shippingStateCode } : {}),
        ...(data.shippingPincode !== undefined ? { shipping_pincode: data.shippingPincode } : {}),
        ...(data.shippingGstin !== undefined ? { shipping_gstin: data.shippingGstin } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'clients',
      record_id: id,
      details: `Updated client record: ${data.companyName || id}`
    });
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('clients').delete().eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'clients',
      record_id: id,
      details: `Hard deleted client: ${client?.companyName || id}`
    });
  };

  const softDeleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.map(c => c.id === id ? { 
      ...c, 
      isDeleted: true, 
      status: 'deleted' as const, 
      deletedAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    } : c));

    if (isSupabaseConfigured) {
      supabase.from('clients').delete().eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'SOFT_DELETE',
      table_name: 'clients',
      record_id: id,
      details: `Soft-deleted client: ${client?.companyName || id}`
    });
  };

  const restoreClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.map(c => c.id === id ? { 
      ...c, 
      isDeleted: false, 
      status: 'active' as const, 
      deletedAt: undefined, 
      updatedAt: new Date().toISOString() 
    } : c));

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'RESTORE',
      table_name: 'clients',
      record_id: id,
      details: `Restored client: ${client?.companyName || id}`
    });
  };

  const addQuotation = (quoteData: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'> & { quoteNumber?: string }): Quotation => {
    const quoteNum = quoteData.quoteNumber || `QTN-2026-${String(quotations.length + 1).padStart(4, '0')}`;
    
    // Run Authoritative GST Engine
    const client = clients.find(c => c.id === quoteData.clientId);
    const sellerCode = quoteData.sellerStateCode || '21';
    const buyerCode = quoteData.buyerStateCode || client?.stateCode || '24';
    
    const gstCalc = calculateGstInvoiceTotals({
      sellerStateCode: sellerCode,
      buyerStateCode: buyerCode,
      items: quoteData.items,
      discountType: quoteData.discountType,
      discountValue: quoteData.discountValue,
      gstRate: quoteData.gstRate ?? 18,
      currency: quoteData.currency || 'INR',
      overrideGstType: quoteData.gstType === 'none' ? 'none' : undefined
    });

    const newQuote: Quotation = {
      ...quoteData,
      id: `quote_${Date.now()}`,
      quoteNumber: quoteNum,
      sellerStateCode: sellerCode,
      buyerStateCode: buyerCode,
      supplyType: gstCalc.supplyType,
      taxLabel: gstCalc.taxLabel,
      subtotal: gstCalc.subtotal,
      discountAmount: gstCalc.discountAmount,
      taxableAmount: gstCalc.taxableAmount,
      gstType: gstCalc.gstType,
      gstRate: gstCalc.gstRate,
      cgstAmount: gstCalc.cgstAmount,
      sgstAmount: gstCalc.sgstAmount,
      utgstAmount: gstCalc.utgstAmount,
      igstAmount: gstCalc.igstAmount,
      totalAmount: gstCalc.grandTotal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setQuotations(prev => [newQuote, ...prev]);

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'quotations',
      record_id: newQuote.id,
      details: `Generated Quotation ${newQuote.quoteNumber} for ${newQuote.clientCompany} (Total: ₹ ${newQuote.totalAmount.toLocaleString('en-IN')})`
    });

    addNotification({
      type: 'quotation_created',
      category: 'financials',
      title: '📄 Commercial Quotation Created',
      message: `Quotation ${newQuote.quoteNumber} prepared for ${newQuote.clientCompany || newQuote.clientName} (Total: ₹${newQuote.totalAmount.toLocaleString('en-IN')}).`,
      link: 'quotations',
      entity_type: 'quotation',
      entity_id: newQuote.id,
      priority: 'normal',
      metadata: {
        quotationNumber: newQuote.quoteNumber,
        clientCompany: newQuote.clientCompany,
        amount: newQuote.totalAmount
      },
      event_key: `quote_${newQuote.id}`
    });

    return newQuote;
  };

  const updateQuotation = (id: string, data: Partial<Quotation>) => {
    setQuotations(prev => prev.map(q => {
      if (q.id !== id) return q;
      const merged = { ...q, ...data };
      const gstCalc = calculateGstInvoiceTotals({
        sellerStateCode: merged.sellerStateCode || '21',
        buyerStateCode: merged.buyerStateCode || '24',
        items: merged.items || [],
        discountType: merged.discountType,
        discountValue: merged.discountValue,
        gstRate: merged.gstRate ?? 18,
        currency: merged.currency || 'INR',
        overrideGstType: merged.gstType === 'none' ? 'none' : undefined
      });

      return {
        ...merged,
        subtotal: gstCalc.subtotal,
        discountAmount: gstCalc.discountAmount,
        taxableAmount: gstCalc.taxableAmount,
        gstType: gstCalc.gstType,
        supplyType: gstCalc.supplyType,
        taxLabel: gstCalc.taxLabel,
        cgstAmount: gstCalc.cgstAmount,
        sgstAmount: gstCalc.sgstAmount,
        utgstAmount: gstCalc.utgstAmount,
        igstAmount: gstCalc.igstAmount,
        totalAmount: gstCalc.grandTotal,
        updatedAt: new Date().toISOString()
      };
    }));

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'quotations',
      record_id: id,
      details: `Updated quotation ${id}`
    });
  };

  const deleteQuotation = (id: string) => {
    setQuotations(prev => prev.filter(q => q.id !== id));

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'quotations',
      record_id: id,
      details: `Deleted quotation ${id}`
    });
  };

  const convertQuoteToInvoice = (quoteId: string): Invoice | null => {
    const quote = quotations.find(q => q.id === quoteId);
    if (!quote) return null;

    // Idempotency: Prevent duplicate invoices if already converted
    if (quote.convertedInvoiceId) {
      const existingInv = invoices.find(i => i.id === quote.convertedInvoiceId || i.quoteId === quote.id);
      if (existingInv) {
        return existingInv;
      }
    }

    const invNum = `FFC-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    const client = clients.find(c => c.id === quote.clientId);
    
    const sellerCode = quote.sellerStateCode || '21';
    const buyerCode = quote.buyerStateCode || client?.stateCode || '24';
    const isGstExplicitlyDisabled = quote.gstApplicable === false || quote.gstType === 'none';
    
    const gstCalc = calculateGstInvoiceTotals({
      sellerStateCode: sellerCode,
      buyerStateCode: buyerCode,
      items: quote.items,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      gstRate: isGstExplicitlyDisabled ? 0 : (quote.gstRate ?? 18),
      currency: quote.currency || 'INR',
      overrideGstType: isGstExplicitlyDisabled ? 'none' : undefined
    });

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: invNum,
      quoteId: quote.id,
      quoteNumber: quote.quoteNumber,
      clientId: quote.clientId,
      clientName: quote.clientName,
      clientCompany: quote.clientCompany,
      clientEmail: quote.clientEmail,
      clientAddress: client?.address || quote.clientAddress || '',
      clientGstin: client?.gstin || quote.clientGstin || '',
      sellerName: agencyConfig.name,
      sellerAddress: `${agencyConfig.address}, ${agencyConfig.city}, ${agencyConfig.state} - ${agencyConfig.postalCode}`,
      sellerGstin: agencyConfig.gstin,
      sellerState: agencyConfig.state,
      sellerStateCode: sellerCode,
      buyerCompany: quote.clientCompany,
      buyerName: quote.clientName,
      buyerAddress: client?.address || quote.clientAddress || '',
      buyerGstin: client?.gstin || quote.clientGstin || '—',
      buyerState: client?.state || '',
      buyerStateCode: buyerCode,
      supplyType: gstCalc.supplyType,
      taxLabel: gstCalc.taxLabel,
      title: quote.title,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      currency: quote.currency,
      items: quote.items,
      subtotal: gstCalc.subtotal,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      discountAmount: gstCalc.discountAmount,
      taxableAmount: gstCalc.taxableAmount,
      gstType: isGstExplicitlyDisabled ? 'none' : gstCalc.gstType,
      gstRate: isGstExplicitlyDisabled ? 0 : gstCalc.gstRate,
      cgstAmount: isGstExplicitlyDisabled ? 0 : gstCalc.cgstAmount,
      sgstAmount: isGstExplicitlyDisabled ? 0 : gstCalc.sgstAmount,
      utgstAmount: isGstExplicitlyDisabled ? 0 : gstCalc.utgstAmount,
      igstAmount: isGstExplicitlyDisabled ? 0 : gstCalc.igstAmount,
      totalAmount: isGstExplicitlyDisabled ? gstCalc.taxableAmount : gstCalc.grandTotal,
      amountInWords: gstCalc.amountInWords,
      paidAmount: 0,
      balanceDue: isGstExplicitlyDisabled ? gstCalc.taxableAmount : gstCalc.grandTotal,
      status: 'issued',
      paymentTerms: quote.paymentTerms || 'Payment due within 15 days.',
      bankDetails: agencyConfig.bankDetails,
      notes: quote.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    updateQuotation(quote.id, { 
      status: 'converted', 
      convertedInvoiceId: newInvoice.id,
      updatedAt: new Date().toISOString()
    });

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'invoices',
      record_id: newInvoice.id,
      details: `SEND FOR INVOICE action completed: Quotation ${quote.quoteNumber} converted to Tax Invoice ${newInvoice.invoiceNumber} (Total: ₹ ${newInvoice.totalAmount.toLocaleString('en-IN')})`
    });

    addNotification({
      type: 'quotation_converted',
      category: 'financials',
      title: '🔄 Quotation Converted to Tax Invoice',
      message: `Quotation ${quote.quoteNumber} converted to Tax Invoice ${newInvoice.invoiceNumber} (₹${newInvoice.totalAmount.toLocaleString('en-IN')}).`,
      link: 'invoices',
      entity_type: 'invoice',
      entity_id: newInvoice.id,
      priority: 'high',
      metadata: {
        quoteNumber: quote.quoteNumber,
        invoiceNumber: newInvoice.invoiceNumber,
        amount: newInvoice.totalAmount
      },
      event_key: `convert_quote_${quote.id}`
    });

    return newInvoice;
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'> & { invoiceNumber?: string }): Invoice => {
    const invNum = invoiceData.invoiceNumber || `FFC-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    const sellerCode = invoiceData.sellerStateCode || '21';
    const buyerCode = invoiceData.buyerStateCode || '24';
    
    // Authoritative calculation layer
    const gstCalc = calculateGstInvoiceTotals({
      sellerStateCode: sellerCode,
      buyerStateCode: buyerCode,
      items: invoiceData.items,
      discountType: invoiceData.discountType,
      discountValue: invoiceData.discountValue,
      gstRate: invoiceData.gstRate ?? 18,
      currency: invoiceData.currency || 'INR',
      overrideGstType: invoiceData.gstType === 'none' ? 'none' : undefined
    });

    const paidAmt = Number(invoiceData.paidAmount) || 0;
    const balance = Math.max(0, gstCalc.grandTotal - paidAmt);

    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      invoiceNumber: invNum,
      sellerName: invoiceData.sellerName || agencyConfig.name,
      sellerAddress: invoiceData.sellerAddress || `${agencyConfig.address}, ${agencyConfig.city}, ${agencyConfig.state} - ${agencyConfig.postalCode}`,
      sellerGstin: invoiceData.sellerGstin || agencyConfig.gstin,
      sellerState: invoiceData.sellerState || agencyConfig.state,
      sellerStateCode: sellerCode,
      buyerStateCode: buyerCode,
      supplyType: gstCalc.supplyType,
      taxLabel: gstCalc.taxLabel,
      subtotal: gstCalc.subtotal,
      discountAmount: gstCalc.discountAmount,
      taxableAmount: gstCalc.taxableAmount,
      gstType: gstCalc.gstType,
      gstRate: gstCalc.gstRate,
      cgstAmount: gstCalc.cgstAmount,
      sgstAmount: gstCalc.sgstAmount,
      utgstAmount: gstCalc.utgstAmount,
      igstAmount: gstCalc.igstAmount,
      totalAmount: gstCalc.grandTotal,
      amountInWords: gstCalc.amountInWords,
      paidAmount: paidAmt,
      balanceDue: balance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Authoritative Supabase Insert into 'invoices' & 'invoice_items'
    if (isSupabaseConfigured) {
      const dbStatusMap: Record<string, string> = {
        'draft': 'Draft',
        'issued': 'Sent',
        'partially_paid': 'Partially Paid',
        'paid': 'Paid',
        'overdue': 'Overdue',
        'cancelled': 'Cancelled'
      };

      supabase.from('invoices').insert({
        id: newInvoice.id,
        invoice_number: newInvoice.invoiceNumber,
        client_id: newInvoice.clientId,
        status: dbStatusMap[newInvoice.status] || 'Sent',
        issue_date: newInvoice.issueDate,
        due_date: newInvoice.dueDate,
        subtotal: newInvoice.subtotal,
        discount: newInvoice.discountAmount,
        tax_rate: newInvoice.gstRate,
        tax_amount: (newInvoice.cgstAmount || 0) + (newInvoice.sgstAmount || 0) + (newInvoice.utgstAmount || 0) + (newInvoice.igstAmount || 0),
        grand_total: newInvoice.totalAmount,
        paid_amount: newInvoice.paidAmount,
        taxable_amount: newInvoice.taxableAmount,
        gst_applicable: newInvoice.gstType !== 'none',
        seller_gstin: newInvoice.sellerGstin,
        seller_state_code: newInvoice.sellerStateCode,
        buyer_gstin: newInvoice.buyerGstin,
        buyer_state_code: newInvoice.buyerStateCode,
        place_of_supply: newInvoice.buyerState || newInvoice.placeOfSupply || '24-Gujarat',
        cgst_amount: newInvoice.cgstAmount || 0,
        sgst_amount: newInvoice.sgstAmount || 0,
        utgst_amount: newInvoice.utgstAmount || 0,
        igst_amount: newInvoice.igstAmount || 0,
        is_deleted: false,
        notes: newInvoice.notes || '',
        terms: newInvoice.paymentTerms || ''
      }).then(async () => {
        if (newInvoice.items && newInvoice.items.length > 0) {
          const itemsPayload = newInvoice.items.map(item => ({
            invoice_id: newInvoice.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.rate,
            total_price: item.amount
          }));
          await supabase.from('invoice_items').insert(itemsPayload);
        }
      });
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'invoices',
      record_id: newInvoice.id,
      details: `Generated Tax Invoice ${newInvoice.invoiceNumber} for ${newInvoice.buyerCompany || newInvoice.clientCompany} (Amount: ₹ ${newInvoice.totalAmount.toLocaleString('en-IN')})`
    });

    addNotification({
      type: 'invoice_created',
      category: 'financials',
      title: `🧾 Tax Invoice ${newInvoice.invoiceNumber} Generated`,
      message: `Tax Invoice issued for ${newInvoice.buyerCompany || newInvoice.clientCompany} (Total: ₹${newInvoice.totalAmount.toLocaleString('en-IN')}).`,
      link: 'invoices',
      entity_type: 'invoice',
      entity_id: newInvoice.id,
      priority: 'normal',
      metadata: {
        invoiceNumber: newInvoice.invoiceNumber,
        buyerCompany: newInvoice.buyerCompany,
        amount: newInvoice.totalAmount
      },
      event_key: `inv_${newInvoice.id}`
    });

    return newInvoice;
  };

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== id) return inv;
      const merged = { ...inv, ...data };
      const sellerCode = merged.sellerStateCode || '21';
      const buyerCode = merged.buyerStateCode || '24';
      
      const gstCalc = calculateGstInvoiceTotals({
        sellerStateCode: sellerCode,
        buyerStateCode: buyerCode,
        items: merged.items,
        discountType: merged.discountType,
        discountValue: merged.discountValue,
        gstRate: merged.gstRate ?? 18,
        currency: merged.currency || 'INR',
        overrideGstType: merged.gstType === 'none' ? 'none' : undefined
      });

      const paidAmt = Number(merged.paidAmount) || 0;
      const balance = Math.max(0, gstCalc.grandTotal - paidAmt);

      return {
        ...merged,
        sellerStateCode: sellerCode,
        buyerStateCode: buyerCode,
        supplyType: gstCalc.supplyType,
        taxLabel: gstCalc.taxLabel,
        subtotal: gstCalc.subtotal,
        discountAmount: gstCalc.discountAmount,
        taxableAmount: gstCalc.taxableAmount,
        gstType: gstCalc.gstType,
        gstRate: gstCalc.gstRate,
        cgstAmount: gstCalc.cgstAmount,
        sgstAmount: gstCalc.sgstAmount,
        utgstAmount: gstCalc.utgstAmount,
        igstAmount: gstCalc.igstAmount,
        totalAmount: gstCalc.grandTotal,
        amountInWords: gstCalc.amountInWords,
        balanceDue: balance,
        updatedAt: new Date().toISOString()
      };
    }));

    if (isSupabaseConfigured) {
      const dbStatusMap: Record<string, string> = {
        'draft': 'Draft',
        'issued': 'Sent',
        'partially_paid': 'Partially Paid',
        'paid': 'Paid',
        'overdue': 'Overdue',
        'cancelled': 'Cancelled'
      };

      supabase.from('invoices').update({
        ...(data.status ? { status: dbStatusMap[data.status] || data.status } : {}),
        ...(data.paidAmount !== undefined ? { paid_amount: data.paidAmount } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.paymentTerms !== undefined ? { terms: data.paymentTerms } : {}),
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'invoices',
      record_id: id,
      details: `Modified Tax Invoice ${id}`
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('invoices').delete().eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'invoices',
      record_id: id,
      details: `Permanently deleted Invoice ${id}`
    });
  };

  const softDeleteInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? {
      ...inv,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } : inv));

    if (isSupabaseConfigured) {
      supabase.from('invoices').update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'SOFT_DELETE',
      table_name: 'invoices',
      record_id: id,
      details: `Soft deleted Tax Invoice ${id}`
    });
  };

  const restoreInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? {
      ...inv,
      isDeleted: false,
      deletedAt: undefined,
      updatedAt: new Date().toISOString()
    } : inv));

    if (isSupabaseConfigured) {
      supabase.from('invoices').update({
        is_deleted: false,
        deleted_at: null,
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'RESTORE',
      table_name: 'invoices',
      record_id: id,
      details: `Restored Tax Invoice ${id}`
    });
  };

  const recordPayment = (paymentData: Omit<Payment, 'id' | 'createdAt' | 'receiptNumber'>): Payment => {
    const recNum = `FFC/REC/2026/${String(payments.length + 16).padStart(3, '0')}`;
    const newPayment: Payment = {
      ...paymentData,
      id: `pay_${Date.now()}`,
      receiptNumber: recNum,
      createdAt: new Date().toISOString()
    };
    setPayments(prev => [newPayment, ...prev]);

    const inv = invoices.find(i => i.id === paymentData.invoiceId);
    if (inv) {
      const newPaid = inv.paidAmount + paymentData.amount;
      const newBalance = Math.max(0, inv.totalAmount - newPaid);
      const newStatus = newBalance === 0 ? 'paid' : 'partially_paid';
      updateInvoice(inv.id, {
        paidAmount: newPaid,
        balanceDue: newBalance,
        status: newStatus
      });
    }

    if (isSupabaseConfigured) {
      supabase.from('payments').insert({
        id: newPayment.id,
        invoice_id: newPayment.invoiceId,
        amount: newPayment.amount,
        payment_date: newPayment.paymentDate,
        payment_method: newPayment.paymentMethod,
        transaction_ref: newPayment.transactionRef,
        notes: newPayment.notes
      }).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'PAYMENT_RECORD',
      table_name: 'payments',
      record_id: newPayment.id,
      details: `Recorded payment of ₹ ${paymentData.amount.toLocaleString('en-IN')} (${paymentData.paymentMethod.toUpperCase()}) for Invoice ${paymentData.invoiceNumber}`
    });

    addNotification({
      type: 'payment_received',
      category: 'financials',
      title: '💰 Payment Settlement Recorded',
      message: `Received payment of ₹${paymentData.amount.toLocaleString('en-IN')} (${paymentData.paymentMethod.toUpperCase()}) for Invoice ${paymentData.invoiceNumber}.`,
      link: 'payments',
      entity_type: 'payment',
      entity_id: newPayment.id,
      priority: 'high',
      metadata: {
        receiptNumber: newPayment.receiptNumber,
        invoiceNumber: paymentData.invoiceNumber,
        amount: paymentData.amount,
        method: paymentData.paymentMethod
      },
      event_key: `pay_${newPayment.id}`
    });

    return newPayment;
  };

  const updatePayment = (id: string, data: Partial<Payment>) => {
    setPayments(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...data,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    if (isSupabaseConfigured) {
      const dbUpdates: any = {
        updated_at: new Date().toISOString()
      };
      if (data.emailStatus) {
        dbUpdates.email_status = data.emailStatus.status;
        dbUpdates.email_sent_at = data.emailStatus.sent_at || data.emailStatus.sentAt;
        dbUpdates.email_recipient = data.emailStatus.recipient;
        dbUpdates.email_error = data.emailStatus.error;
        dbUpdates.email_message_id = data.emailStatus.messageId;
      }
      if (data.email_status) dbUpdates.email_status = data.email_status;
      if (data.email_sent_at) dbUpdates.email_sent_at = data.email_sent_at;
      if (data.email_recipient) dbUpdates.email_recipient = data.email_recipient;
      if (data.email_error) dbUpdates.email_error = data.email_error;
      if (data.notes !== undefined) dbUpdates.notes = data.notes;

      supabase.from('payments').update(dbUpdates).eq('id', id).then();
    }
  };

  // Phase 12: Computed unread notification count based on user permissions
  const unreadNotificationsCount = useMemo(() => {
    const roleFiltered = filterNotificationsByRole(notifications, currentUser);
    return roleFiltered.filter(n => !n.is_read).length;
  }, [notifications, currentUser]);

  // Phase 12: Centralized Official Email Dispatch Methods from admin@fusionforgecreation.com
  const sendInvoiceEmail = useCallback(async (
    invoiceId: string,
    customRecipient?: string,
    customNotes?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return { success: false, error: 'Invoice not found.' };

    const recipient = customRecipient || inv.clientEmail || '';
    const res = await sendInvoiceEmailBackend(inv, recipient, undefined, customNotes, agencyConfig);

    if (res.success) {
      updateInvoice(inv.id, {
        status: inv.status === 'draft' ? 'issued' : inv.status
      });

      await addEmailLog({
        recipient: res.recipient,
        sender: res.sender,
        subject: `Tax Invoice: ${inv.invoiceNumber} - Fusion Forge Creation`,
        category: 'invoice',
        status: 'sent',
        message_id: res.messageId,
        entity_type: 'invoice',
        entity_id: inv.id,
        metadata: {
          invoiceNumber: inv.invoiceNumber,
          totalAmount: inv.totalAmount,
          clientCompany: inv.clientCompany
        }
      });

      await addNotification({
        type: 'invoice_sent',
        category: 'financials',
        title: '🧾 Tax Invoice Email Dispatched',
        message: `Tax Invoice ${inv.invoiceNumber} (₹${inv.totalAmount.toLocaleString('en-IN')}) dispatched from admin@fusionforgecreation.com to ${res.recipient}.`,
        link: 'invoices',
        entity_type: 'invoice',
        entity_id: inv.id,
        priority: 'normal',
        metadata: {
          invoiceNumber: inv.invoiceNumber,
          recipient: res.recipient,
          amount: inv.totalAmount
        },
        event_key: `email_inv_${inv.id}_${Date.now()}`
      });
    }

    return res;
  }, [invoices, agencyConfig, updateInvoice, addEmailLog, addNotification]);

  const sendQuotationEmail = useCallback(async (
    quotationId: string,
    customRecipient?: string,
    customNotes?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    const quote = quotations.find(q => q.id === quotationId);
    if (!quote) return { success: false, error: 'Quotation not found.' };

    const recipient = customRecipient || quote.clientEmail || '';
    const res = await sendQuotationEmailBackend(quote, recipient, undefined, customNotes, agencyConfig);

    if (res.success) {
      updateQuotation(quote.id, {
        status: quote.status === 'draft' ? 'sent' : quote.status
      });

      await addEmailLog({
        recipient: res.recipient,
        sender: res.sender,
        subject: `Commercial Quotation: ${quote.quoteNumber} - ${quote.title}`,
        category: 'quotation',
        status: 'sent',
        message_id: res.messageId,
        entity_type: 'quotation',
        entity_id: quote.id,
        metadata: {
          quotationNumber: quote.quoteNumber,
          totalAmount: quote.totalAmount,
          clientCompany: quote.clientCompany
        }
      });

      await addNotification({
        type: 'quotation_sent',
        category: 'financials',
        title: '📄 Commercial Quotation Dispatched',
        message: `Quotation ${quote.quoteNumber} (₹${quote.totalAmount.toLocaleString('en-IN')}) dispatched from admin@fusionforgecreation.com to ${res.recipient}.`,
        link: 'quotations',
        entity_type: 'quotation',
        entity_id: quote.id,
        priority: 'normal',
        metadata: {
          quotationNumber: quote.quoteNumber,
          recipient: res.recipient,
          amount: quote.totalAmount
        },
        event_key: `email_quote_${quote.id}_${Date.now()}`
      });
    }

    return res;
  }, [quotations, agencyConfig, updateQuotation, addEmailLog, addNotification]);

  const sendPaymentReceiptEmail = useCallback(async (
    paymentId: string,
    customRecipient?: string,
    customNotes?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    const pay = payments.find(p => p.id === paymentId);
    if (!pay) return { success: false, error: 'Payment receipt not found.' };

    const inv = invoices.find(i => i.id === pay.invoiceId);
    const recipient = customRecipient || pay.clientEmail || inv?.clientEmail || '';
    const res = await sendPaymentReceiptEmailBackend(pay, inv, recipient, undefined, customNotes, agencyConfig);

    if (res.success) {
      updatePayment(pay.id, {
        emailStatus: {
          status: 'sent',
          sentAt: new Date().toISOString(),
          recipient: res.recipient,
          messageId: res.messageId
        }
      });

      await addEmailLog({
        recipient: res.recipient,
        sender: res.sender,
        subject: `Payment Receipt: ${pay.receiptNumber} for Invoice ${pay.invoiceNumber}`,
        category: 'payment_receipt',
        status: 'sent',
        message_id: res.messageId,
        entity_type: 'payment',
        entity_id: pay.id,
        metadata: {
          receiptNumber: pay.receiptNumber,
          invoiceNumber: pay.invoiceNumber,
          amount: pay.amount,
          paymentMethod: pay.paymentMethod
        }
      });

      await addNotification({
        type: 'payment_receipt_sent',
        category: 'financials',
        title: '✉️ Payment Receipt Dispatched',
        message: `Official Payment Receipt ${pay.receiptNumber} (₹${pay.amount.toLocaleString('en-IN')}) dispatched from admin@fusionforgecreation.com to ${res.recipient}.`,
        link: 'payments',
        entity_type: 'payment',
        entity_id: pay.id,
        priority: 'normal',
        metadata: {
          receiptNumber: pay.receiptNumber,
          recipient: res.recipient,
          amount: pay.amount
        },
        event_key: `email_receipt_${pay.id}_${Date.now()}`
      });
    }

    return res;
  }, [payments, invoices, agencyConfig, updatePayment, addEmailLog, addNotification]);

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('payments').delete().eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'payments',
      record_id: id,
      details: `Deleted payment receipt ${id}`
    });
  };

  const addEnquiry = (enqData: Omit<ProjectEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'priority'>): ProjectEnquiry => {
    const newEnq: ProjectEnquiry = {
      ...enqData,
      id: `enq_${Date.now()}`,
      status: 'new',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEnquiries(prev => [newEnq, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from('enquiries').insert({
        id: newEnq.id,
        name: newEnq.name,
        company: newEnq.company || '',
        email: newEnq.email,
        phone: newEnq.phone || '',
        gstin: newEnq.gstin || '',
        gst_number: newEnq.gstin || '',
        address: newEnq.address || '',
        project_type: newEnq.service || newEnq.serviceCategory || 'Custom Solution',
        budget: newEnq.budgetRange || 'Custom',
        timeline: newEnq.timeline || 'Immediate',
        message: newEnq.projectDescription || '',
        status: 'New'
      }).then(({ error }) => {
        if (error) {
          console.warn('[Supabase Enquiry Insert] Database column fallback:', error.message);
          // Fallback if specific column names vary
          supabase.from('enquiries').insert({
            id: newEnq.id,
            name: newEnq.name,
            company: newEnq.company || '',
            email: newEnq.email,
            phone: newEnq.phone || '',
            project_type: newEnq.service || newEnq.serviceCategory || 'Custom Solution',
            budget: newEnq.budgetRange || 'Custom',
            timeline: newEnq.timeline || 'Immediate',
            message: `${newEnq.projectDescription || ''}${newEnq.gstin ? ` | GSTIN: ${newEnq.gstin}` : ''}${newEnq.address ? ` | Address: ${newEnq.address}` : ''}`,
            status: 'New'
          }).then();
        }
      });
    }

    addAuditLog({
      user_id: 'public_lead',
      user_email: enqData.email,
      user_role: 'public' as any,
      action: 'CREATE',
      table_name: 'enquiries',
      record_id: newEnq.id,
      details: `Project Scope Submission by ${enqData.name} (${enqData.company || 'Direct'}) for ${enqData.service || enqData.serviceCategory || 'Custom Solution'}${enqData.gstin ? ` [GSTIN: ${enqData.gstin}]` : ''}`
    });

    // Authoritatively notify logged-in Admin user with visual alert and sound buzzer
    setLatestLeadAlert(newEnq);
    buzzerEngine.playLeadBuzzer();

    addNotification({
      type: 'lead_received',
      category: 'leads',
      title: '🚨 New Project Scope Submission Received',
      message: `${newEnq.name} from ${newEnq.company || 'Direct'}${newEnq.gstin ? ` (GSTIN: ${newEnq.gstin})` : ''} submitted a project scope for "${newEnq.service || newEnq.serviceCategory || 'Custom Solution'}" (Budget: ${newEnq.budgetRange || 'Custom'}).`,
      link: 'enquiries',
      entity_type: 'enquiry',
      entity_id: newEnq.id,
      priority: 'urgent',
      metadata: {
        clientName: newEnq.name,
        company: newEnq.company,
        email: newEnq.email,
        phone: newEnq.phone,
        gstin: newEnq.gstin,
        address: newEnq.address,
        service: newEnq.service || newEnq.serviceCategory,
        budget: newEnq.budgetRange
      },
      event_key: `lead_${newEnq.id}`
    });

    return newEnq;
  };

  const triggerSimulatedLeadAlert = (): ProjectEnquiry => {
    const sampleLeads = [
      {
        name: 'Dr. Vikram Malhotra',
        company: 'Apex Healthtech AI Ltd',
        email: 'v.malhotra@apexhealthtech.io',
        phone: '+91 98450 12890',
        gstin: '27AAACH1234D1Z9',
        address: 'Suite 902, Godrej One, Pirojshanagar, Vikhroli, Mumbai, Maharashtra - 400079',
        service: 'Full-Stack Enterprise AI App',
        serviceCategory: 'web_development' as const,
        budgetRange: '₹4,50,000 - ₹8,00,000',
        projectDescription: 'We require a HIPAA/GST compliant clinical dashboard with real-time patient analytics and doctor appointment scheduling.',
        source: 'Website Estimator'
      },
      {
        name: 'Priyanka Sharma',
        company: 'Zenith Logistics Hub',
        email: 'priyanka@zenithlogistics.in',
        phone: '+91 91234 56780',
        gstin: '24AABCS5432E1Z3',
        address: 'Survey 112, GIDC Phase 3, Naroda, Ahmedabad, Gujarat - 382330',
        service: 'Supply Chain & Fleet Tracking Web Platform',
        serviceCategory: 'enterprise_portal' as const,
        budgetRange: '₹3,00,000 - ₹6,00,000',
        projectDescription: 'Looking for a custom multi-tenant freight billing system with automatic SAC 998314 invoice generation and live GPS telematics.',
        source: 'Public Portal Contact'
      },
      {
        name: 'Rohan Deshmukh',
        company: 'CloudNova Fintech',
        email: 'rohan.d@cloudnovafin.com',
        phone: '+91 99887 76655',
        gstin: '29AABCC9988H1ZM',
        address: 'Tower 4, Electronic City Phase 1, Bengaluru, Karnataka - 560100',
        service: 'Fintech Payment Gateway & Client Portal',
        serviceCategory: 'mobile_app' as const,
        budgetRange: '₹5,00,000 - ₹10,00,000',
        projectDescription: 'Immediate requirement for cross-platform iOS & Android mobile application with automated UPI/e-mandate subscription billing.',
        source: 'AI Chatbot Recommendation'
      }
    ];

    const pick = sampleLeads[Math.floor(Math.random() * sampleLeads.length)];
    return addEnquiry(pick);
  };

  const updateEnquiryStatus = (id: string, status: ProjectEnquiry['status']) => {
    const enq = enquiries.find(e => e.id === id);
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e));

    if (isSupabaseConfigured) {
      const dbStatusMap: Record<string, string> = {
        'new': 'New',
        'contacted': 'Contacted',
        'in_discussion': 'Discussion',
        'proposal_sent': 'Proposal',
        'won': 'Won',
        'lost': 'Lost'
      };
      supabase.from('enquiries').update({
        status: dbStatusMap[status] || status,
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'enquiries',
      record_id: id,
      details: `Updated enquiry status to ${status}`
    });

    addNotification({
      type: 'lead_status_changed',
      category: 'leads',
      title: '📋 Lead Status Updated',
      message: `Enquiry from "${enq?.name || 'Client'}" changed status to "${status.toUpperCase()}".`,
      link: 'enquiries',
      entity_type: 'enquiry',
      entity_id: id,
      priority: 'normal',
      metadata: {
        enquiryId: id,
        newStatus: status,
        name: enq?.name
      },
      event_key: `lead_status_${id}_${status}`
    });
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('enquiries').delete().eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'enquiries',
      record_id: id,
      details: `Deleted enquiry ${id}`
    });
  };

  const convertEnquiryToClient = (enquiryId: string): Client | null => {
    const enq = enquiries.find(e => e.id === enquiryId);
    if (!enq) return null;
    const client = addClient({
      name: enq.name,
      companyName: enq.company || `${enq.name} Ventures`,
      email: enq.email,
      phone: enq.phone,
      gstin: enq.gstin || '',
      pan: enq.gstin && enq.gstin.length === 15 ? enq.gstin.substring(2, 12) : undefined,
      isGstRegistered: Boolean(enq.gstin && enq.gstin.trim().length === 15),
      isUrp: !Boolean(enq.gstin && enq.gstin.trim().length === 15),
      address: enq.address || 'Commercial Office',
      billingAddress: {
        street: enq.address || 'Commercial Office',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        postalCode: '400001',
        country: 'India'
      },
      currency: 'INR',
      status: 'active',
      notes: `Requirements: ${enq.projectDescription || ''}${enq.gstin ? ` | GSTIN: ${enq.gstin}` : ''}`
    });
    updateEnquiryStatus(enquiryId, 'won');
    return client;
  };

  // CRUD for Services
  const addService = (srv: Omit<AgencyService, 'id'>): AgencyService => {
    const newSrv: AgencyService = { ...srv, id: `srv_${Date.now()}` };
    setServices(prev => [newSrv, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from('services').insert({
        id: newSrv.id,
        title: newSrv.title,
        slug: newSrv.slug || newSrv.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newSrv.description,
        icon: newSrv.icon,
        features: newSrv.features || [],
        order_index: newSrv.orderIndex || 0,
        is_active: newSrv.isActive ?? true
      }).then();
    }

    return newSrv;
  };

  const updateService = (id: string, data: Partial<AgencyService>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));

    if (isSupabaseConfigured) {
      supabase.from('services').update({
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.icon !== undefined ? { icon: data.icon } : {}),
        ...(data.features !== undefined ? { features: data.features } : {}),
        ...(data.orderIndex !== undefined ? { order_index: data.orderIndex } : {}),
        ...(data.isActive !== undefined ? { is_active: data.isActive } : {})
      }).eq('id', id).then();
    }
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('services').delete().eq('id', id).then();
    }
  };

  // CRUD for Managed Projects
  const addManagedProject = (proj: Omit<ManagedProject, 'id'>): ManagedProject => {
    const isCompleted = proj.status === 'completed';
    const completionDate = isCompleted ? (proj.completionDate || new Date().toISOString().split('T')[0]) : proj.completionDate;
    const progress = isCompleted ? 100 : (proj.progressPercentage ?? 0);

    const initialHistory: ProjectStatusHistoryItem[] = [
      {
        id: `hist_${Date.now()}_init`,
        projectId: `proj_${Date.now()}`,
        previousStatus: undefined,
        newStatus: proj.status,
        changedBy: currentUser.name || 'Super Admin',
        changedByEmail: currentUser.email || 'admin@fusionforgecreation.com',
        notes: `Project engagement initiated in ${proj.status} status.`,
        emailSentToClient: false,
        timestamp: new Date().toISOString()
      }
    ];

    const newProj: ManagedProject = {
      ...proj,
      id: `proj_${Date.now()}`,
      progressPercentage: progress,
      completionDate,
      statusHistory: proj.statusHistory || initialHistory
    };

    setManagedProjects(prev => [newProj, ...prev]);

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'projects',
      record_id: newProj.id,
      details: `Created Project: "${newProj.title}" for ${newProj.clientName} (Budget: ₹ ${newProj.budget?.toLocaleString('en-IN') || 0}, Status: ${newProj.status})`
    });

    if (isSupabaseConfigured) {
      supabase.from('projects').insert({
        id: newProj.id,
        title: newProj.title,
        slug: newProj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        client_name: newProj.clientName,
        description: newProj.notes || newProj.title,
        technologies: newProj.techStack || [],
        live_url: newProj.publicUrl || newProj.webAppUrl || ''
      }).then();
    }

    return newProj;
  };

  const sendProjectStatusEmail = async (
    projectId: string,
    newStatus: ProjectStatus | string,
    customNotes?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    const project = managedProjects.find(p => p.id === projectId);
    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    const client = clients.find(c => c.id === project.clientId || c.name === project.clientName);
    const recipientEmail = project.clientEmail || client?.email;
    const recipientName = project.clientName || client?.name || 'Valued Client';

    if (!recipientEmail) {
      return { success: false, error: 'No client email address associated with this project.' };
    }

    const emailResult = await sendProjectStatusEmailBackend(
      project,
      newStatus,
      project.status,
      recipientEmail,
      undefined,
      customNotes,
      agencyConfig
    );

    // Update status history on the project
    const historyItem: ProjectStatusHistoryItem = {
      id: `hist_${Date.now()}`,
      projectId: project.id,
      previousStatus: project.status,
      newStatus: newStatus as ProjectStatus,
      changedBy: currentUser.name || 'Super Admin',
      changedByEmail: currentUser.email || 'admin@fusionforgecreation.com',
      notes: customNotes || `Status updated to ${newStatus}.`,
      emailSentToClient: emailResult.success,
      clientEmail: recipientEmail,
      timestamp: new Date().toISOString(),
      messageId: emailResult.messageId
    };

    setManagedProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const history = [...(p.statusHistory || []), historyItem];
        return {
          ...p,
          lastEmailSentAt: new Date().toISOString(),
          lastEmailStatus: emailResult.success ? 'sent' : 'failed',
          lastEmailError: emailResult.error,
          statusHistory: history
        };
      }
      return p;
    }));

    if (isSupabaseConfigured) {
      supabase.from('project_status_history').insert({
        project_id: project.id,
        previous_status: project.status,
        new_status: newStatus,
        changed_by: currentUser.email || 'admin@fusionforgecreation.com',
        notes: customNotes || '',
        email_sent: emailResult.success,
        email_recipient: recipientEmail,
        message_id: emailResult.messageId || null
      }).then();
    }

    return emailResult;
  };

  const updateManagedProject = async (
    id: string,
    data: Partial<ManagedProject>,
    sendEmailNotification: boolean = false,
    emailSubject?: string,
    emailNotes?: string
  ): Promise<ManagedProject | undefined> => {
    const existing = managedProjects.find(p => p.id === id);
    if (!existing) return undefined;

    const statusChanged = data.status && data.status !== existing.status;
    const isNowCompleted = data.status === 'completed';

    const updatedData: Partial<ManagedProject> = { ...data };

    if (isNowCompleted) {
      if (updatedData.progressPercentage === undefined) {
        updatedData.progressPercentage = 100;
      }
      if (!updatedData.completionDate) {
        updatedData.completionDate = new Date().toISOString().split('T')[0];
      }
    }

    let historyItem: ProjectStatusHistoryItem | null = null;
    let emailOutcome: { success: boolean; messageId?: string; error?: string } | null = null;

    // Send email if requested or if status changed and project has client email
    const client = clients.find(c => c.id === existing.clientId || c.name === existing.clientName);
    const targetEmail = data.clientEmail || existing.clientEmail || client?.email;
    const targetName = data.clientName || existing.clientName || client?.name || 'Valued Client';

    if (statusChanged || sendEmailNotification) {
      if (sendEmailNotification && targetEmail) {
        emailOutcome = await sendProjectStatusEmailBackend(
          { ...existing, ...updatedData },
          data.status || existing.status,
          existing.status,
          targetEmail,
          emailSubject,
          emailNotes || data.notes || existing.notes,
          agencyConfig
        );
      }

      historyItem = {
        id: `hist_${Date.now()}`,
        projectId: id,
        previousStatus: existing.status,
        newStatus: (data.status || existing.status) as ProjectStatus,
        changedBy: currentUser.name || 'Super Admin',
        changedByEmail: currentUser.email || 'admin@fusionforgecreation.com',
        notes: emailNotes || (isNowCompleted ? 'Project marked Completed with deliverables verified.' : `Status updated to ${data.status || existing.status}`),
        emailSentToClient: emailOutcome ? emailOutcome.success : false,
        clientEmail: targetEmail,
        timestamp: new Date().toISOString(),
        messageId: emailOutcome?.messageId
      };
    }

    let updatedProject: ManagedProject | undefined;

    setManagedProjects(prev => prev.map(p => {
      if (p.id === id) {
        const history = historyItem ? [...(p.statusHistory || []), historyItem] : (p.statusHistory || []);
        updatedProject = {
          ...p,
          ...updatedData,
          statusHistory: history,
          ...(emailOutcome ? {
            lastEmailSentAt: new Date().toISOString(),
            lastEmailStatus: emailOutcome.success ? 'sent' : 'failed',
            lastEmailError: emailOutcome.error
          } : {})
        };
        return updatedProject;
      }
      return p;
    }));

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'projects',
      record_id: id,
      details: isNowCompleted 
        ? `Project "${data.title || existing.title}" completed. (Email notified: ${emailOutcome?.success ? 'Yes' : 'No'} to ${targetEmail || 'N/A'})`
        : `Updated Project "${data.title || existing.title}" status to ${data.status || existing.status}`
    });

    if (isSupabaseConfigured) {
      if (historyItem) {
        supabase.from('project_status_history').insert({
          project_id: id,
          previous_status: existing.status,
          new_status: data.status || existing.status,
          changed_by: currentUser.email || 'admin@fusionforgecreation.com',
          notes: historyItem.notes,
          email_sent: historyItem.emailSentToClient,
          email_recipient: targetEmail || null,
          message_id: historyItem.messageId || null
        }).then();
      }

      supabase.from('projects').update({
        title: data.title || existing.title,
        description: data.notes || existing.notes || '',
        technologies: data.techStack || existing.techStack || [],
        live_url: data.publicUrl || data.webAppUrl || existing.publicUrl || ''
      }).eq('id', id).then();
    }

    if (statusChanged) {
      if (isNowCompleted) {
        addNotification({
          type: 'project_completed',
          category: 'projects',
          title: '🎉 Project Milestone Completed',
          message: `Project "${existing.title}" for ${existing.clientName || 'Client'} has been marked COMPLETED. It is now eligible for final invoice generation and showcase archive.`,
          link: 'projects',
          entity_type: 'project',
          entity_id: id,
          priority: 'high',
          metadata: {
            projectId: id,
            title: existing.title,
            clientName: existing.clientName,
            status: 'completed'
          },
          event_key: `proj_comp_${id}`
        });
      } else {
        addNotification({
          type: 'project_status_changed',
          category: 'projects',
          title: '🚀 Project Status Changed',
          message: `Project "${existing.title}" status changed from ${(existing.status || '').toUpperCase()} to ${(data.status || '').toUpperCase()}.`,
          link: 'projects',
          entity_type: 'project',
          entity_id: id,
          priority: 'normal',
          metadata: {
            projectId: id,
            title: existing.title,
            previousStatus: existing.status,
            newStatus: data.status
          },
          event_key: `proj_status_${id}_${data.status}`
        });
      }
    }

    return updatedProject;
  };

  const deleteManagedProject = (id: string) => {
    const proj = managedProjects.find(p => p.id === id);
    setManagedProjects(prev => prev.filter(p => p.id !== id));

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'projects',
      record_id: id,
      details: `Deleted project: ${proj?.title || id}`
    });

    if (isSupabaseConfigured) {
      supabase.from('projects').delete().eq('id', id).then();
    }
  };

  // Phase 9: Completed Work Record System (Company Historical Work Portfolio)
  const addCompletedWork = (data: Omit<CompletedWorkRecord, 'id' | 'createdAt' | 'updatedAt'>): CompletedWorkRecord => {
    const newRecord: CompletedWorkRecord = {
      ...data,
      id: `cw_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCompletedWorks(prev => [newRecord, ...prev]);

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'completed_works',
      record_id: newRecord.id,
      details: `Archived completed work: "${newRecord.projectTitle}" for ${newRecord.clientName} (${newRecord.workCategory})`
    });

    if (isSupabaseConfigured) {
      supabase.from('completed_works').insert({
        id: newRecord.id,
        client_name: newRecord.clientName,
        project_title: newRecord.projectTitle,
        work_category: newRecord.workCategory,
        completion_date: newRecord.completionDate,
        technology_type: newRecord.technologyType,
        public_url: newRecord.publicUrl || null,
        web_app_url: newRecord.webAppUrl || null,
        software_url: newRecord.softwareUrl || null,
        mobile_app_info: newRecord.mobileAppInfo || null,
        short_description: newRecord.shortDescription,
        deliverables_summary: newRecord.deliverablesSummary,
        source_project_id: newRecord.sourceProjectId || null,
        is_verified: newRecord.isVerified
      }).then();
    }

    return newRecord;
  };

  const updateCompletedWork = (id: string, data: Partial<CompletedWorkRecord>) => {
    setCompletedWorks(prev => prev.map(cw => cw.id === id ? { ...cw, ...data, updatedAt: new Date().toISOString() } : cw));

    if (isSupabaseConfigured) {
      supabase.from('completed_works').update({
        ...(data.clientName !== undefined ? { client_name: data.clientName } : {}),
        ...(data.projectTitle !== undefined ? { project_title: data.projectTitle } : {}),
        ...(data.workCategory !== undefined ? { work_category: data.workCategory } : {}),
        ...(data.completionDate !== undefined ? { completion_date: data.completionDate } : {}),
        ...(data.technologyType !== undefined ? { technology_type: data.technologyType } : {}),
        ...(data.publicUrl !== undefined ? { public_url: data.publicUrl } : {}),
        ...(data.webAppUrl !== undefined ? { web_app_url: data.webAppUrl } : {}),
        ...(data.softwareUrl !== undefined ? { software_url: data.softwareUrl } : {}),
        ...(data.mobileAppInfo !== undefined ? { mobile_app_info: data.mobileAppInfo } : {}),
        ...(data.shortDescription !== undefined ? { short_description: data.shortDescription } : {}),
        ...(data.deliverablesSummary !== undefined ? { deliverables_summary: data.deliverablesSummary } : {}),
        ...(data.isVerified !== undefined ? { is_verified: data.isVerified } : {}),
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }
  };

  const deleteCompletedWork = (id: string) => {
    setCompletedWorks(prev => prev.filter(cw => cw.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('completed_works').delete().eq('id', id).then();
    }
  };

  const archiveProjectToCompletedWork = (projectId: string): CompletedWorkRecord | null => {
    const proj = managedProjects.find(p => p.id === projectId);
    if (!proj) return null;

    // Check if already archived
    const existing = completedWorks.find(cw => cw.sourceProjectId === projectId);
    if (existing) return existing;

    const newRecord = addCompletedWork({
      clientName: proj.clientName || 'Valued Client',
      projectTitle: proj.title,
      workCategory: proj.category || 'Software Engineering',
      completionDate: proj.completionDate || new Date().toISOString().split('T')[0],
      technologyType: proj.techStack && proj.techStack.length > 0 ? proj.techStack : ['Full-Stack Engine', 'Cloud Services'],
      publicUrl: proj.publicUrl,
      webAppUrl: proj.webAppUrl,
      softwareUrl: proj.softwareUrl,
      mobileAppInfo: proj.mobileAppInfo,
      shortDescription: proj.notes || `Successfully completed commercial engineering milestone for ${proj.clientName}.`,
      deliverablesSummary: proj.deliverables && proj.deliverables.length > 0 ? proj.deliverables : ['Architectural Blueprint', 'Production Release', 'Documentation Transfer'],
      sourceProjectId: proj.id,
      isVerified: true
    });

    return newRecord;
  };

  // Phase 9: Seamless Invoicing from Project Engagement with duplicate protection & eligibility check
  const createInvoiceFromProject = (
    projectId: string,
    overrideDuplicateWarning: boolean = false
  ): { success: boolean; invoice?: Invoice; message?: string; alreadyInvoiced?: boolean; existingInvoiceNumber?: string } => {
    const project = managedProjects.find(p => p.id === projectId);
    if (!project) {
      return { success: false, message: 'Project engagement not found.' };
    }

    // Eligibility check
    if ((project.status as string) === 'cancelled' || (project.status as string) === 'on_hold') {
      return {
        success: false,
        message: `Cannot generate an invoice for a project engagement with status "${project.status}".`
      };
    }

    // Duplicate Prevention Check
    const existingInvoice = invoices.find(
      inv => !inv.is_deleted && (
        inv.projectId === projectId || 
        (project.invoicedIds && project.invoicedIds.includes(inv.id))
      )
    );

    if (existingInvoice && !overrideDuplicateWarning) {
      return {
        success: false,
        alreadyInvoiced: true,
        existingInvoiceNumber: existingInvoice.invoiceNumber,
        invoice: existingInvoice,
        message: `An invoice (${existingInvoice.invoiceNumber}) already exists for "${project.title}".`
      };
    }

    // Match client
    const client = clients.find(c => c.id === project.clientId || c.name.toLowerCase() === (project.clientName || '').toLowerCase());
    const clientId = client?.id || project.clientId || (clients.length > 0 ? clients[0].id : 'client_1');
    const clientName = client?.name || project.clientName || 'Valued Client';
    const clientCompany = client?.companyName || project.clientName || clientName;
    const clientEmail = project.clientEmail || client?.email || '';

    // Create itemized deliverable lines
    const deliverablesList = project.deliverables && project.deliverables.length > 0 
      ? project.deliverables 
      : [`Full-cycle software engineering: ${project.title}`];

    const totalBudget = project.budget || 50000;
    const perItemPrice = deliverablesList.length > 1 
      ? Math.round(totalBudget / deliverablesList.length) 
      : totalBudget;

    const items = deliverablesList.map((deliv, idx) => ({
      id: `item_proj_${Date.now()}_${idx}`,
      description: `${deliv} - ${project.title} (${project.category || 'Software'})`,
      quantity: 1,
      rate: idx === deliverablesList.length - 1 ? (totalBudget - (perItemPrice * (deliverablesList.length - 1))) : perItemPrice,
      amount: idx === deliverablesList.length - 1 ? (totalBudget - (perItemPrice * (deliverablesList.length - 1))) : perItemPrice,
      sac_code: '998314',
      taxable_amount: idx === deliverablesList.length - 1 ? (totalBudget - (perItemPrice * (deliverablesList.length - 1))) : perItemPrice,
      gst_rate: 18
    }));

    const todayStr = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const sellerCode = agencyConfig.state_code || '21';
    const buyerCode = client?.stateCode || '24';

    const gstCalc = calculateGstInvoiceTotals({
      sellerStateCode: sellerCode,
      buyerStateCode: buyerCode,
      items,
      discountType: 'percentage',
      discountValue: 0,
      gstRate: 18,
      currency: 'INR'
    });

    const invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber'> = {
      clientId,
      clientName,
      clientCompany,
      clientEmail,
      clientAddress: client?.address || '',
      clientGstin: client?.gstin || '',
      sellerName: agencyConfig.name,
      sellerAddress: `${agencyConfig.address}, ${agencyConfig.city}, ${agencyConfig.state} - ${agencyConfig.postalCode}`,
      sellerGstin: agencyConfig.gstin,
      sellerState: agencyConfig.state,
      sellerStateCode: sellerCode,
      buyerCompany: clientCompany,
      buyerName: clientName,
      buyerAddress: client?.address || '',
      buyerGstin: client?.gstin || '—',
      buyerState: client?.state || '',
      buyerStateCode: buyerCode,
      supplyType: gstCalc.supplyType,
      taxLabel: gstCalc.taxLabel,
      title: `${project.title} - Professional Engineering Deliverables`,
      projectId: project.id,
      projectTitle: project.title,
      projectStatusAtBilling: project.status,
      issueDate: todayStr,
      dueDate,
      currency: 'INR',
      items,
      subtotal: gstCalc.subtotal,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      taxableAmount: gstCalc.taxableAmount,
      gstType: gstCalc.gstType,
      gstRate: 18,
      cgstAmount: gstCalc.cgstAmount,
      sgstAmount: gstCalc.sgstAmount,
      utgstAmount: gstCalc.utgstAmount,
      igstAmount: gstCalc.igstAmount,
      totalAmount: gstCalc.grandTotal,
      amountInWords: gstCalc.amountInWords,
      paidAmount: 0,
      balanceDue: gstCalc.grandTotal,
      notes: `Tax invoice for completed deliverables under engagement: ${project.title} (${project.category || 'Software'}). Status at billing: ${project.status.toUpperCase()}.`,
      paymentTerms: 'Payment is due within 15 calendar days from the invoice issue date. GST billed under SAC 998314.',
      bankDetails: agencyConfig.bankDetails,
      status: 'issued'
    };

    const newInvoice = addInvoice(invoiceData);

    // Update project with invoiced metadata
    const newInvoicedAmount = (project.invoicedAmount || 0) + newInvoice.totalAmount;
    const newInvoicedIds = [...(project.invoicedIds || []), newInvoice.id];

    setManagedProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          invoicedAmount: newInvoicedAmount,
          invoicedIds: newInvoicedIds
        };
      }
      return p;
    }));

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'invoices',
      record_id: newInvoice.id,
      details: `Generated Tax Invoice ${newInvoice.invoiceNumber} from Project "${project.title}" (Total: ₹ ${newInvoice.totalAmount.toLocaleString('en-IN')})`
    });

    return {
      success: true,
      invoice: newInvoice,
      message: `Tax Invoice ${newInvoice.invoiceNumber} created and linked to "${project.title}".`
    };
  };

  // CRUD for Technologies
  const addTechnology = (tech: Omit<TechnologyItem, 'id'>): TechnologyItem => {
    const newTech: TechnologyItem = { ...tech, id: `tech_${Date.now()}` };
    setTechnologies(prev => [newTech, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from('technologies').insert({
        id: newTech.id,
        name: newTech.name,
        category: newTech.category,
        logo_url: newTech.logoUrl || '',
        is_active: newTech.isActive ?? true
      }).then();
    }

    return newTech;
  };

  const updateTechnology = (id: string, data: Partial<TechnologyItem>) => {
    setTechnologies(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));

    if (isSupabaseConfigured) {
      supabase.from('technologies').update({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.logoUrl !== undefined ? { logo_url: data.logoUrl } : {}),
        ...(data.isActive !== undefined ? { is_active: data.isActive } : {})
      }).eq('id', id).then();
    }
  };

  const deleteTechnology = (id: string) => {
    setTechnologies(prev => prev.filter(t => t.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('technologies').delete().eq('id', id).then();
    }
  };

  // CRUD for Testimonials
  const addTestimonial = (testi: Omit<TestimonialItem, 'id'>): TestimonialItem => {
    const newTesti: TestimonialItem = { ...testi, id: `testi_${Date.now()}` };
    setTestimonials(prev => [newTesti, ...prev]);

    if (isSupabaseConfigured) {
      supabase.from('testimonials').insert({
        id: newTesti.id,
        client_name: newTesti.name,
        client_title: newTesti.role,
        company: newTesti.company,
        avatar_url: newTesti.avatar,
        content: newTesti.content,
        rating: newTesti.rating,
        is_featured: newTesti.isFeatured ?? true
      }).then();
    }

    return newTesti;
  };

  const updateTestimonial = (id: string, data: Partial<TestimonialItem>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));

    if (isSupabaseConfigured) {
      supabase.from('testimonials').update({
        ...(data.name !== undefined ? { client_name: data.name } : {}),
        ...(data.role !== undefined ? { client_title: data.role } : {}),
        ...(data.company !== undefined ? { company: data.company } : {}),
        ...(data.avatar !== undefined ? { avatar_url: data.avatar } : {}),
        ...(data.content !== undefined ? { content: data.content } : {}),
        ...(data.rating !== undefined ? { rating: data.rating } : {}),
        ...(data.isFeatured !== undefined ? { is_featured: data.isFeatured } : {})
      }).eq('id', id).then();
    }
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('testimonials').delete().eq('id', id).then();
    }
  };

  // CRUD for FAQs
  const addFaq = (faq: Omit<FaqItem, 'id'>): FaqItem => {
    const newFaq: FaqItem = { ...faq, id: `faq_${Date.now()}` };
    setFaqs(prev => [...prev, newFaq]);

    if (isSupabaseConfigured) {
      supabase.from('faqs').insert({
        id: newFaq.id,
        question: newFaq.question,
        answer: newFaq.answer,
        category: newFaq.category,
        order_index: newFaq.orderIndex || 0,
        is_active: newFaq.isActive ?? true
      }).then();
    }

    return newFaq;
  };

  const updateFaq = (id: string, data: Partial<FaqItem>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));

    if (isSupabaseConfigured) {
      supabase.from('faqs').update({
        ...(data.question !== undefined ? { question: data.question } : {}),
        ...(data.answer !== undefined ? { answer: data.answer } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.orderIndex !== undefined ? { order_index: data.orderIndex } : {}),
        ...(data.isActive !== undefined ? { is_active: data.isActive } : {})
      }).eq('id', id).then();
    }
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('faqs').delete().eq('id', id).then();
    }
  };

  // CRUD for Chatbot Q&A Knowledge Base
  const addChatbotQA = (qa: Omit<ChatbotQAItem, 'id' | 'createdAt' | 'updatedAt'>): ChatbotQAItem => {
    const newQA: ChatbotQAItem = {
      ...qa,
      id: `cqa_${Date.now()}`,
      matchCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setChatbotQAs(prev => [newQA, ...prev]);
    return newQA;
  };

  const updateChatbotQA = (id: string, data: Partial<ChatbotQAItem>) => {
    setChatbotQAs(prev => prev.map(item => item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item));
  };

  const deleteChatbotQA = (id: string) => {
    setChatbotQAs(prev => prev.filter(item => item.id !== id));
  };

  const updateChatbotSettings = (data: Partial<ChatbotSettings>) => {
    setChatbotSettings(prev => ({ ...prev, ...data, updatedAt: new Date().toISOString() }));
  };

  // CRUD for Users
  const addUser = (usr: Omit<UserProfile, 'id'>): UserProfile => {
    const newUsr: UserProfile = { ...usr, id: `user_${Date.now()}` };
    setUsers(prev => [...prev, newUsr]);
    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'profiles',
      record_id: newUsr.id,
      details: `Created new authenticated user profile: ${newUsr.email} (${newUsr.role})`
    });

    addNotification({
      type: 'new_user',
      category: 'users',
      title: '👤 New User Registered',
      message: `User ${newUsr.name || newUsr.email} registered with initial role [${newUsr.role.toUpperCase()}].`,
      link: 'users',
      entity_type: 'user',
      entity_id: newUsr.id,
      priority: 'normal',
      metadata: {
        userId: newUsr.id,
        email: newUsr.email,
        role: newUsr.role
      },
      event_key: `user_new_${newUsr.id}`
    });

    return newUsr;
  };

  const updateUser = (id: string, data: Partial<UserProfile>) => {
    const existing = users.find(u => u.id === id);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'profiles',
      record_id: id,
      details: `Updated user profile ${id}`
    });

    if (data.role && data.role !== existing?.role) {
      addNotification({
        type: 'role_changed',
        category: 'users',
        title: '🛡️ User Role Updated',
        message: `Role for ${existing?.name || existing?.email || id} changed to [${data.role.toUpperCase()}].`,
        link: 'users',
        entity_type: 'user',
        entity_id: id,
        priority: 'high',
        metadata: {
          userId: id,
          newRole: data.role,
          previousRole: existing?.role
        },
        event_key: `user_role_${id}_${data.role}`
      });
    }
  };

  const deleteUser = (id: string) => {
    // Only super_admin can delete records
    if (currentUser.role !== 'super_admin') {
      console.warn('[Security Violation] Deletion attempt denied: Super Admin authority required.');
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'profiles',
      record_id: id,
      details: `Deleted user profile ${id}`
    });
  };

  // Custom Roles & Permissions Management (Super Admin only)
  const addRole = (roleData: Omit<RoleDefinition, 'id' | 'createdAt' | 'updatedAt'>): RoleDefinition | null => {
    if (currentUser.role !== 'super_admin') {
      console.warn('[Security Violation] Unauthorized attempt to create role: Super Admin authority required.');
      return null;
    }

    const cleanCode = roleData.code.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
    const existing = roles.find(r => r.code === cleanCode);
    if (existing) {
      console.warn('[Role Management] Role code already exists:', cleanCode);
      return null;
    }

    const newRole: RoleDefinition = {
      ...roleData,
      id: `role_${Date.now()}`,
      code: cleanCode,
      isSystem: false,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    try {
      localStorage.setItem('fusion_forge_roles', JSON.stringify(updatedRoles));
    } catch (e) {
      console.warn('Failed to save roles:', e);
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'roles',
      record_id: newRole.id,
      details: `Created new custom RBAC role: ${newRole.name} [${newRole.code}] with ${newRole.permissions.length} permissions`
    });

    return newRole;
  };

  const updateRole = (id: string, data: Partial<RoleDefinition>): boolean => {
    if (currentUser.role !== 'super_admin') {
      console.warn('[Security Violation] Unauthorized attempt to modify role: Super Admin authority required.');
      return false;
    }

    let modifiedRoleName = '';
    const updatedRoles = roles.map(r => {
      if (r.id === id) {
        modifiedRoleName = r.name;
        return { ...r, ...data, updatedAt: new Date().toISOString() };
      }
      return r;
    });

    setRoles(updatedRoles);
    try {
      localStorage.setItem('fusion_forge_roles', JSON.stringify(updatedRoles));
    } catch (e) {
      console.warn('Failed to update roles in localStorage:', e);
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'roles',
      record_id: id,
      details: `Modified RBAC role permissions & definition: ${modifiedRoleName} (${data.permissions ? data.permissions.length + ' permissions' : 'metadata'})`
    });

    return true;
  };

  const deleteRole = (id: string): boolean => {
    if (currentUser.role !== 'super_admin') {
      console.warn('[Security Violation] Unauthorized attempt to delete role: Super Admin authority required.');
      return false;
    }

    const targetRole = roles.find(r => r.id === id);
    if (!targetRole) return false;

    if (targetRole.isSystem) {
      console.warn('[Role Management] System built-in roles cannot be deleted.');
      return false;
    }

    const updatedRoles = roles.filter(r => r.id !== id);
    setRoles(updatedRoles);
    try {
      localStorage.setItem('fusion_forge_roles', JSON.stringify(updatedRoles));
    } catch (e) {
      console.warn('Failed to delete role:', e);
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'roles',
      record_id: id,
      details: `Deleted custom RBAC role: ${targetRole.name} [${targetRole.code}]`
    });

    return true;
  };

  const assignUserRole = (userId: string, roleCode: string) => {
    if (currentUser.role !== 'super_admin') {
      console.warn('[Security Violation] Unauthorized role assignment attempt.');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role: roleCode as any, updated_at: new Date().toISOString() };
      }
      return u;
    }));

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: roleCode as any }));
    }

    const targetUser = users.find(u => u.id === userId);
    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'ROLE_CHANGE',
      table_name: 'profiles',
      record_id: userId,
      details: `Assigned new role [${roleCode}] to user ${userId}`
    });

    addNotification({
      type: 'role_changed',
      category: 'users',
      title: '🛡️ Role Permission Assigned',
      message: `User ${targetUser?.name || targetUser?.email || userId} was assigned authority role [${roleCode.toUpperCase()}].`,
      link: 'users',
      entity_type: 'user',
      entity_id: userId,
      priority: 'high',
      metadata: {
        userId,
        newRole: roleCode,
        assignedBy: currentUser.email
      },
      event_key: `assign_role_${userId}_${roleCode}_${Date.now()}`
    });
  };

  const checkPermission = (permissionCode: string): boolean => {
    return hasPermission(currentUser.role, permissionCode, roles);
  };

  // Phase 5: Service Price Presets Handlers
  const addPricePreset = (presetData: Omit<ServicePricePreset, 'id' | 'created_at' | 'updated_at'>): ServicePricePreset => {
    const newId = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newPreset: ServicePricePreset = {
      ...presetData,
      id: newId,
      name: presetData.service_name,
      rate: presetData.default_price,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setPricePresets(prev => [...prev, newPreset]);

    if (isSupabaseConfigured) {
      supabase.from('service_price_presets').insert({
        service_name: newPreset.service_name,
        description: newPreset.description,
        sac_code: newPreset.sac_code || '998314',
        default_price: newPreset.default_price,
        gst_applicable: newPreset.gst_applicable,
        gst_rate: newPreset.gst_rate,
        is_active: newPreset.is_active
      }).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'service_price_presets',
      record_id: newId,
      details: `Created new price preset: ${newPreset.service_name} (₹${newPreset.default_price.toLocaleString('en-IN')})`
    });

    return newPreset;
  };

  const updatePricePreset = (id: string, data: Partial<ServicePricePreset>) => {
    let presetName = '';
    setPricePresets(prev => prev.map(p => {
      if (p.id === id) {
        presetName = data.service_name || p.service_name;
        return {
          ...p,
          ...data,
          name: data.service_name || p.service_name,
          rate: data.default_price !== undefined ? data.default_price : p.default_price,
          updated_at: new Date().toISOString()
        };
      }
      return p;
    }));

    if (isSupabaseConfigured) {
      supabase.from('service_price_presets').update({
        ...(data.service_name !== undefined ? { service_name: data.service_name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.sac_code !== undefined ? { sac_code: data.sac_code } : (data.sacCode !== undefined ? { sac_code: data.sacCode } : {})),
        ...(data.default_price !== undefined ? { default_price: data.default_price } : (data.rate !== undefined ? { default_price: data.rate } : {})),
        ...(data.gst_applicable !== undefined ? { gst_applicable: data.gst_applicable } : {}),
        ...(data.gst_rate !== undefined ? { gst_rate: data.gst_rate } : {}),
        ...(data.is_active !== undefined ? { is_active: data.is_active } : {}),
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'service_price_presets',
      record_id: id,
      details: `Modified price preset: ${presetName || id}`
    });
  };

  const deletePricePreset = (id: string) => {
    const target = pricePresets.find(p => p.id === id);
    setPricePresets(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('service_price_presets').delete().eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'service_price_presets',
      record_id: id,
      details: `Deleted price preset: ${target?.service_name || id}`
    });
  };

  const togglePricePresetActive = (id: string) => {
    const target = pricePresets.find(p => p.id === id);
    if (!target) return;
    const nextState = !target.is_active;

    updatePricePreset(id, { is_active: nextState });
  };

  // Phase 5: Payment Terms Handlers
  const addPaymentTerm = (termData: Omit<PaymentTermItem, 'id' | 'created_at' | 'updated_at'>): PaymentTermItem => {
    const newId = `pt_${Date.now()}`;
    const newTerm: PaymentTermItem = {
      ...termData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setPaymentTerms(prev => {
      // If this term is set as default, unset previous defaults
      const updated = newTerm.is_default
        ? prev.map(t => ({ ...t, is_default: false }))
        : prev;
      return [...updated, newTerm];
    });

    if (isSupabaseConfigured) {
      supabase.from('payment_terms').insert({
        name: newTerm.name,
        description: newTerm.description || '',
        is_default: newTerm.is_default || false,
        sort_order: newTerm.sort_order || 0
      }).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'payment_terms',
      record_id: newId,
      details: `Created payment term: ${newTerm.name}`
    });

    return newTerm;
  };

  const updatePaymentTerm = (id: string, data: Partial<PaymentTermItem>) => {
    setPaymentTerms(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...data, updated_at: new Date().toISOString() };
      }
      if (data.is_default && t.id !== id) {
        return { ...t, is_default: false };
      }
      return t;
    }));

    if (isSupabaseConfigured) {
      supabase.from('payment_terms').update({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.is_default !== undefined ? { is_default: data.is_default } : {}),
        ...(data.sort_order !== undefined ? { sort_order: data.sort_order } : {}),
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'payment_terms',
      record_id: id,
      details: `Updated payment term: ${data.name || id}`
    });
  };

  const deletePaymentTerm = (id: string) => {
    const target = paymentTerms.find(t => t.id === id);
    setPaymentTerms(prev => prev.filter(t => t.id !== id));

    if (isSupabaseConfigured) {
      supabase.from('payment_terms').delete().eq('id', id).then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'payment_terms',
      record_id: id,
      details: `Deleted payment term: ${target?.name || id}`
    });
  };

  const setDefaultPaymentTerm = (id: string) => {
    setPaymentTerms(prev => prev.map(t => ({
      ...t,
      is_default: t.id === id,
      updated_at: new Date().toISOString()
    })));

    if (isSupabaseConfigured) {
      supabase.from('payment_terms').update({ is_default: false }).neq('id', id).then(() => {
        supabase.from('payment_terms').update({ is_default: true }).eq('id', id).then();
      });
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'payment_terms',
      record_id: id,
      details: `Set default payment term to: ${paymentTerms.find(t => t.id === id)?.name || id}`
    });
  };

  // Phase 5: Document Numbering Configuration
  const updateDocumentNumberConfig = (type: 'invoice' | 'quotation', configUpdate: Partial<DocumentNumberConfig>) => {
    setAgencyConfig(prev => {
      const currentConfigs = prev.numbering_configs || {
        invoice: DEFAULT_INVOICE_NUMBERING,
        quotation: DEFAULT_QUOTATION_NUMBERING
      };

      const updatedNumbering = {
        ...currentConfigs,
        [type]: {
          ...currentConfigs[type],
          ...configUpdate
        }
      };

      const updated = {
        ...prev,
        numbering_configs: updatedNumbering
      };

      if (isSupabaseConfigured) {
        supabase.from('seller_profile').update({
          numbering_configs: updatedNumbering,
          updated_at: new Date().toISOString()
        }).neq('id', '00000000-0000-0000-0000-000000000000').then();
      }

      return updated;
    });

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'numbering_configs',
      record_id: type,
      details: `Super Admin reconfigured ${type} document numbering pattern (Prefix: ${configUpdate.prefix || 'N/A'}, Style: ${configUpdate.style || 'N/A'}, Seq: ${configUpdate.starting_sequence || configUpdate.current_sequence || 'N/A'})`
    });
  };

  // ==========================================
  // PHASE 10: PURCHASES, EXPENSES, STAFF & SALARY CRUD
  // ==========================================

  const addPurchase = async (purchaseData: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>): Promise<Purchase> => {
    const newId = `pur_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();
    
    const newPurchase: Purchase = {
      ...purchaseData,
      id: newId,
      created_at: nowIso,
      updated_at: nowIso
    };

    setPurchases(prev => [newPurchase, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('purchases').insert([{
          id: newPurchase.id,
          supplier_name: newPurchase.supplierName,
          supplier_gstin: newPurchase.supplierGstin || null,
          supplier_email: newPurchase.supplierEmail || null,
          supplier_phone: newPurchase.supplierPhone || null,
          supplier_address: newPurchase.supplierAddress || null,
          supplier_state_code: newPurchase.supplierStateCode || null,
          bill_number: newPurchase.billNumber,
          purchase_date: newPurchase.purchaseDate,
          due_date: newPurchase.dueDate || null,
          description: newPurchase.description,
          hsn_sac_code: newPurchase.hsnSacCode || null,
          category: newPurchase.category || null,
          taxable_amount: newPurchase.taxableAmount,
          gst_rate: newPurchase.gstRate,
          cgst_amount: newPurchase.cgstAmount,
          sgst_amount: newPurchase.sgstAmount,
          utgst_amount: newPurchase.utgstAmount,
          igst_amount: newPurchase.igstAmount,
          total_amount: newPurchase.totalAmount,
          payment_status: newPurchase.paymentStatus,
          payment_mode: newPurchase.paymentMode || null,
          payment_date: newPurchase.paymentDate || null,
          payment_ref: newPurchase.paymentRef || null,
          attachment_url: newPurchase.attachmentUrl || null,
          attachment_name: newPurchase.attachmentName || null,
          notes: newPurchase.notes || null,
          is_itc_claimable: newPurchase.isItcClaimable,
          is_reverse_charge: newPurchase.isReverseCharge
        }]);
      } catch (err) {
        console.warn('[Supabase Purchase Insert] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'purchases',
      record_id: newPurchase.id,
      details: `Recorded purchase bill #${newPurchase.billNumber} from ${newPurchase.supplierName} (Total: ₹ ${newPurchase.totalAmount.toLocaleString('en-IN')})`
    });

    return newPurchase;
  };

  const updatePurchase = async (id: string, data: Partial<Purchase>) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p));

    if (isSupabaseConfigured) {
      try {
        const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (data.supplierName !== undefined) updatePayload.supplier_name = data.supplierName;
        if (data.supplierGstin !== undefined) updatePayload.supplier_gstin = data.supplierGstin;
        if (data.supplierEmail !== undefined) updatePayload.supplier_email = data.supplierEmail;
        if (data.supplierPhone !== undefined) updatePayload.supplier_phone = data.supplierPhone;
        if (data.supplierAddress !== undefined) updatePayload.supplier_address = data.supplierAddress;
        if (data.supplierStateCode !== undefined) updatePayload.supplier_state_code = data.supplierStateCode;
        if (data.billNumber !== undefined) updatePayload.bill_number = data.billNumber;
        if (data.purchaseDate !== undefined) updatePayload.purchase_date = data.purchaseDate;
        if (data.dueDate !== undefined) updatePayload.due_date = data.dueDate;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.hsnSacCode !== undefined) updatePayload.hsn_sac_code = data.hsnSacCode;
        if (data.category !== undefined) updatePayload.category = data.category;
        if (data.taxableAmount !== undefined) updatePayload.taxable_amount = data.taxableAmount;
        if (data.gstRate !== undefined) updatePayload.gst_rate = data.gstRate;
        if (data.cgstAmount !== undefined) updatePayload.cgst_amount = data.cgstAmount;
        if (data.sgstAmount !== undefined) updatePayload.sgst_amount = data.sgstAmount;
        if (data.utgstAmount !== undefined) updatePayload.utgst_amount = data.utgstAmount;
        if (data.igstAmount !== undefined) updatePayload.igst_amount = data.igstAmount;
        if (data.totalAmount !== undefined) updatePayload.total_amount = data.totalAmount;
        if (data.paymentStatus !== undefined) updatePayload.payment_status = data.paymentStatus;
        if (data.paymentMode !== undefined) updatePayload.payment_mode = data.paymentMode;
        if (data.paymentDate !== undefined) updatePayload.payment_date = data.paymentDate;
        if (data.paymentRef !== undefined) updatePayload.payment_ref = data.paymentRef;
        if (data.attachmentUrl !== undefined) updatePayload.attachment_url = data.attachmentUrl;
        if (data.attachmentName !== undefined) updatePayload.attachment_name = data.attachmentName;
        if (data.notes !== undefined) updatePayload.notes = data.notes;
        if (data.isItcClaimable !== undefined) updatePayload.is_itc_claimable = data.isItcClaimable;
        if (data.isReverseCharge !== undefined) updatePayload.is_reverse_charge = data.isReverseCharge;

        await supabase.from('purchases').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('[Supabase Purchase Update] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'purchases',
      record_id: id,
      details: `Updated purchase record ${id}`
    });
  };

  const deletePurchase = async (id: string) => {
    const target = purchases.find(p => p.id === id);
    setPurchases(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('purchases').delete().eq('id', id);
      } catch (err) {
        console.warn('[Supabase Purchase Delete] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'purchases',
      record_id: id,
      details: `Deleted purchase bill #${target?.billNumber || id} from ${target?.supplierName || 'vendor'}`
    });
  };

  const markPurchasePaid = async (id: string, paymentMode = 'Bank Transfer', paymentRef = '', paymentDate = new Date().toISOString().split('T')[0]) => {
    await updatePurchase(id, {
      paymentStatus: 'paid',
      paymentMode,
      paymentRef,
      paymentDate
    });
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> => {
    const newId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newExpense: Expense = {
      ...expenseData,
      id: newId,
      created_at: nowIso,
      updated_at: nowIso
    };

    setExpenses(prev => [newExpense, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('expenses').insert([{
          id: newExpense.id,
          expense_date: newExpense.expenseDate,
          category: newExpense.category,
          description: newExpense.description,
          vendor_name: newExpense.vendorName,
          vendor_gstin: newExpense.vendorGstin || null,
          amount: newExpense.amount,
          gst_applicable: newExpense.gstApplicable,
          taxable_amount: newExpense.taxableAmount || null,
          gst_rate: newExpense.gstRate || null,
          gst_amount: newExpense.gstAmount || null,
          cgst_amount: newExpense.cgstAmount || null,
          sgst_amount: newExpense.sgstAmount || null,
          igst_amount: newExpense.igstAmount || null,
          is_itc_eligible: newExpense.isItcEligible,
          payment_mode: newExpense.paymentMode,
          reference_number: newExpense.referenceNumber || null,
          attachment_url: newExpense.attachmentUrl || null,
          attachment_name: newExpense.attachmentName || null,
          paid_by: newExpense.paidBy || null,
          status: newExpense.status,
          notes: newExpense.notes || null
        }]);
      } catch (err) {
        console.warn('[Supabase Expense Insert] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'expenses',
      record_id: newExpense.id,
      details: `Logged expense: ${newExpense.category} - ${newExpense.description} (₹ ${newExpense.amount.toLocaleString('en-IN')})`
    });

    return newExpense;
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data, updated_at: new Date().toISOString() } : e));

    if (isSupabaseConfigured) {
      try {
        const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (data.expenseDate !== undefined) updatePayload.expense_date = data.expenseDate;
        if (data.category !== undefined) updatePayload.category = data.category;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.vendorName !== undefined) updatePayload.vendor_name = data.vendorName;
        if (data.vendorGstin !== undefined) updatePayload.vendor_gstin = data.vendorGstin;
        if (data.amount !== undefined) updatePayload.amount = data.amount;
        if (data.gstApplicable !== undefined) updatePayload.gst_applicable = data.gstApplicable;
        if (data.taxableAmount !== undefined) updatePayload.taxable_amount = data.taxableAmount;
        if (data.gstRate !== undefined) updatePayload.gst_rate = data.gstRate;
        if (data.gstAmount !== undefined) updatePayload.gst_amount = data.gstAmount;
        if (data.cgstAmount !== undefined) updatePayload.cgst_amount = data.cgstAmount;
        if (data.sgstAmount !== undefined) updatePayload.sgst_amount = data.sgstAmount;
        if (data.igstAmount !== undefined) updatePayload.igst_amount = data.igstAmount;
        if (data.isItcEligible !== undefined) updatePayload.is_itc_eligible = data.isItcEligible;
        if (data.paymentMode !== undefined) updatePayload.payment_mode = data.paymentMode;
        if (data.referenceNumber !== undefined) updatePayload.reference_number = data.referenceNumber;
        if (data.attachmentUrl !== undefined) updatePayload.attachment_url = data.attachmentUrl;
        if (data.attachmentName !== undefined) updatePayload.attachment_name = data.attachmentName;
        if (data.paidBy !== undefined) updatePayload.paid_by = data.paidBy;
        if (data.status !== undefined) updatePayload.status = data.status;
        if (data.notes !== undefined) updatePayload.notes = data.notes;

        await supabase.from('expenses').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('[Supabase Expense Update] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'expenses',
      record_id: id,
      details: `Updated expense record ${id}`
    });
  };

  const deleteExpense = async (id: string) => {
    const target = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('expenses').delete().eq('id', id);
      } catch (err) {
        console.warn('[Supabase Expense Delete] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'expenses',
      record_id: id,
      details: `Deleted expense "${target?.description || id}" (₹ ${target?.amount.toLocaleString('en-IN')})`
    });
  };

  const addStaffMember = async (staffData: Omit<StaffMember, 'id' | 'created_at' | 'updated_at'>): Promise<StaffMember> => {
    const newId = `stf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newStaff: StaffMember = {
      ...staffData,
      id: newId,
      created_at: nowIso,
      updated_at: nowIso
    };

    setStaffMembers(prev => [...prev, newStaff]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('staff_members').insert([{
          id: newStaff.id,
          employee_id: newStaff.employeeId,
          full_name: newStaff.fullName,
          email: newStaff.email,
          phone: newStaff.phone || null,
          designation: newStaff.designation,
          department: newStaff.department,
          joining_date: newStaff.joiningDate,
          pan_number: newStaff.panNumber || null,
          bank_account_name: newStaff.bankAccountName || null,
          bank_name: newStaff.bankName || null,
          bank_account_number: newStaff.bankAccountNumber || null,
          bank_ifsc: newStaff.bankIfsc || null,
          base_salary: newStaff.baseSalary,
          hra_allowance: newStaff.hraAllowance,
          special_allowance: newStaff.specialAllowance,
          pf_applicable: newStaff.pfApplicable,
          esi_applicable: newStaff.esiApplicable,
          tds_applicable: newStaff.tdsApplicable,
          is_active: newStaff.isActive
        }]);
      } catch (err) {
        console.warn('[Supabase Staff Insert] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'staff_members',
      record_id: newStaff.id,
      details: `Onboarded employee: ${newStaff.fullName} (${newStaff.employeeId}) - ${newStaff.designation}`
    });

    return newStaff;
  };

  const updateStaffMember = async (id: string, data: Partial<StaffMember>) => {
    setStaffMembers(prev => prev.map(s => s.id === id ? { ...s, ...data, updated_at: new Date().toISOString() } : s));

    if (isSupabaseConfigured) {
      try {
        const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (data.employeeId !== undefined) updatePayload.employee_id = data.employeeId;
        if (data.fullName !== undefined) updatePayload.full_name = data.fullName;
        if (data.email !== undefined) updatePayload.email = data.email;
        if (data.phone !== undefined) updatePayload.phone = data.phone;
        if (data.designation !== undefined) updatePayload.designation = data.designation;
        if (data.department !== undefined) updatePayload.department = data.department;
        if (data.joiningDate !== undefined) updatePayload.joining_date = data.joiningDate;
        if (data.panNumber !== undefined) updatePayload.pan_number = data.panNumber;
        if (data.bankAccountName !== undefined) updatePayload.bank_account_name = data.bankAccountName;
        if (data.bankName !== undefined) updatePayload.bank_name = data.bankName;
        if (data.bankAccountNumber !== undefined) updatePayload.bank_account_number = data.bankAccountNumber;
        if (data.bankIfsc !== undefined) updatePayload.bank_ifsc = data.bankIfsc;
        if (data.baseSalary !== undefined) updatePayload.base_salary = data.baseSalary;
        if (data.hraAllowance !== undefined) updatePayload.hra_allowance = data.hraAllowance;
        if (data.specialAllowance !== undefined) updatePayload.special_allowance = data.specialAllowance;
        if (data.pfApplicable !== undefined) updatePayload.pf_applicable = data.pfApplicable;
        if (data.esiApplicable !== undefined) updatePayload.esi_applicable = data.esiApplicable;
        if (data.tdsApplicable !== undefined) updatePayload.tds_applicable = data.tdsApplicable;
        if (data.isActive !== undefined) updatePayload.is_active = data.isActive;

        await supabase.from('staff_members').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('[Supabase Staff Update] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'staff_members',
      record_id: id,
      details: `Updated employee profile ${id}`
    });
  };

  const deleteStaffMember = async (id: string) => {
    const target = staffMembers.find(s => s.id === id);
    setStaffMembers(prev => prev.filter(s => s.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('staff_members').delete().eq('id', id);
      } catch (err) {
        console.warn('[Supabase Staff Delete] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'staff_members',
      record_id: id,
      details: `Removed staff record: ${target?.fullName || id} (${target?.employeeId || ''})`
    });
  };

  const addSalaryRecord = async (salaryData: Omit<SalaryRecord, 'id' | 'created_at' | 'updated_at'>): Promise<SalaryRecord> => {
    const newId = `sal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const newSalary: SalaryRecord = {
      ...salaryData,
      id: newId,
      created_at: nowIso,
      updated_at: nowIso
    };

    setSalaryRecords(prev => [newSalary, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('salary_records').insert([{
          id: newSalary.id,
          employee_id: newSalary.employeeId,
          employee_name: newSalary.employeeName,
          employee_code: newSalary.employeeCode || null,
          designation: newSalary.designation || null,
          department: newSalary.department || null,
          period: newSalary.period,
          period_month: newSalary.periodMonth,
          period_year: newSalary.periodYear,
          basic_salary: newSalary.basicSalary,
          hra: newSalary.hra,
          special_allowance: newSalary.specialAllowance,
          bonus_or_incentive: newSalary.bonusOrIncentive,
          gross_salary: newSalary.grossSalary,
          provident_fund: newSalary.providentFund,
          esi: newSalary.esi,
          professional_tax: newSalary.professionalTax,
          tds_deduction: newSalary.tdsDeduction,
          advance_deduction: newSalary.advanceDeduction,
          total_deductions: newSalary.totalDeductions,
          net_salary: newSalary.netSalary,
          payment_date: newSalary.paymentDate || null,
          payment_status: newSalary.paymentStatus,
          payment_mode: newSalary.paymentMode || null,
          transaction_reference: newSalary.transactionReference || null,
          payslip_generated: newSalary.payslipGenerated,
          payslip_number: newSalary.payslipNumber || null,
          notes: newSalary.notes || null
        }]);
      } catch (err) {
        console.warn('[Supabase Salary Insert] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'salary_records',
      record_id: newSalary.id,
      details: `Generated payroll record for ${newSalary.employeeName} - ${newSalary.period} (Net: ₹ ${newSalary.netSalary.toLocaleString('en-IN')})`
    });

    return newSalary;
  };

  const updateSalaryRecord = async (id: string, data: Partial<SalaryRecord>) => {
    setSalaryRecords(prev => prev.map(sal => sal.id === id ? { ...sal, ...data, updated_at: new Date().toISOString() } : sal));

    if (isSupabaseConfigured) {
      try {
        const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (data.employeeId !== undefined) updatePayload.employee_id = data.employeeId;
        if (data.employeeName !== undefined) updatePayload.employee_name = data.employeeName;
        if (data.employeeCode !== undefined) updatePayload.employee_code = data.employeeCode;
        if (data.designation !== undefined) updatePayload.designation = data.designation;
        if (data.department !== undefined) updatePayload.department = data.department;
        if (data.period !== undefined) updatePayload.period = data.period;
        if (data.periodMonth !== undefined) updatePayload.period_month = data.periodMonth;
        if (data.periodYear !== undefined) updatePayload.period_year = data.periodYear;
        if (data.basicSalary !== undefined) updatePayload.basic_salary = data.basicSalary;
        if (data.hra !== undefined) updatePayload.hra = data.hra;
        if (data.specialAllowance !== undefined) updatePayload.special_allowance = data.specialAllowance;
        if (data.bonusOrIncentive !== undefined) updatePayload.bonus_or_incentive = data.bonusOrIncentive;
        if (data.grossSalary !== undefined) updatePayload.gross_salary = data.grossSalary;
        if (data.providentFund !== undefined) updatePayload.provident_fund = data.providentFund;
        if (data.esi !== undefined) updatePayload.esi = data.esi;
        if (data.professionalTax !== undefined) updatePayload.professional_tax = data.professionalTax;
        if (data.tdsDeduction !== undefined) updatePayload.tds_deduction = data.tdsDeduction;
        if (data.advanceDeduction !== undefined) updatePayload.advance_deduction = data.advanceDeduction;
        if (data.totalDeductions !== undefined) updatePayload.total_deductions = data.totalDeductions;
        if (data.netSalary !== undefined) updatePayload.net_salary = data.netSalary;
        if (data.paymentDate !== undefined) updatePayload.payment_date = data.paymentDate;
        if (data.paymentStatus !== undefined) updatePayload.payment_status = data.paymentStatus;
        if (data.paymentMode !== undefined) updatePayload.payment_mode = data.paymentMode;
        if (data.transactionReference !== undefined) updatePayload.transaction_reference = data.transactionReference;
        if (data.payslipGenerated !== undefined) updatePayload.payslip_generated = data.payslipGenerated;
        if (data.payslipNumber !== undefined) updatePayload.payslip_number = data.payslipNumber;
        if (data.notes !== undefined) updatePayload.notes = data.notes;

        await supabase.from('salary_records').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('[Supabase Salary Update] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'salary_records',
      record_id: id,
      details: `Updated salary disbursement record ${id}`
    });
  };

  const deleteSalaryRecord = async (id: string) => {
    const target = salaryRecords.find(s => s.id === id);
    setSalaryRecords(prev => prev.filter(s => s.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('salary_records').delete().eq('id', id);
      } catch (err) {
        console.warn('[Supabase Salary Delete] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'salary_records',
      record_id: id,
      details: `Deleted salary record for ${target?.employeeName || id} (${target?.period || ''})`
    });
  };

  const markSalaryPaid = async (id: string, paymentMode = 'NEFT/RTGS', transactionRef = '', paymentDate = new Date().toISOString().split('T')[0]) => {
    await updateSalaryRecord(id, {
      paymentStatus: 'paid',
      paymentMode,
      transactionReference: transactionRef,
      paymentDate
    });
  };

  const generateMonthlyPayroll = async (periodMonth: string, periodYear: number): Promise<{ count: number; message: string }> => {
    const activeStaff = staffMembers.filter(s => s.isActive);
    let createdCount = 0;
    const periodLabel = `${periodMonth} ${periodYear}`;
    const monthNum = ('0' + (new Date(`${periodMonth} 1, ${periodYear}`).getMonth() + 1)).slice(-2);

    for (const staff of activeStaff) {
      // Check if already generated
      const existing = salaryRecords.find(r => r.employeeId === staff.id && r.periodMonth === periodMonth && r.periodYear === periodYear);
      if (existing) continue;

      const basic = staff.baseSalary;
      const hra = staff.hraAllowance;
      const special = staff.specialAllowance;
      const gross = basic + hra + special;

      const pf = staff.pfApplicable ? Math.round(basic * 0.12) : 0;
      const esi = staff.esiApplicable ? Math.round(gross * 0.0075) : 0;
      const pt = gross > 15000 ? 200 : 0;
      const tds = staff.tdsApplicable ? Math.round(gross * 0.05) : 0;
      const totalDeductions = pf + esi + pt + tds;
      const net = gross - totalDeductions;

      const payslipNumber = `PS-${periodYear}${monthNum}-${staff.employeeId}`;

      await addSalaryRecord({
        employeeId: staff.id,
        employeeName: staff.fullName,
        employeeCode: staff.employeeId,
        designation: staff.designation,
        department: staff.department,
        period: periodLabel,
        periodMonth,
        periodYear,
        basicSalary: basic,
        hra,
        specialAllowance: special,
        bonusOrIncentive: 0,
        grossSalary: gross,
        providentFund: pf,
        esi,
        professionalTax: pt,
        tdsDeduction: tds,
        advanceDeduction: 0,
        totalDeductions,
        netSalary: net,
        paymentStatus: 'processing',
        payslipGenerated: true,
        payslipNumber,
        notes: `Auto-generated payroll cycle for ${periodLabel}`
      });

      createdCount++;
    }

    return {
      count: createdCount,
      message: `Generated ${createdCount} payroll records for ${periodLabel}.`
    };
  };

  // Phase 11: Credit & Debit Note Management (GSTR-1 CDNR Statutory Compliance)
  const generateNoteNumber = useCallback((type: 'credit' | 'debit'): string => {
    const prefix = type === 'credit' ? 'CN-2026-' : 'DN-2026-';
    const matchingNotes = creditDebitNotes.filter(n => n.noteType === type);
    const nextNum = String(matchingNotes.length + 1).padStart(4, '0');
    return `${prefix}${nextNum}`;
  }, [creditDebitNotes]);

  const addCreditDebitNote = async (noteData: Omit<CreditDebitNote, 'id' | 'created_at' | 'updated_at'>): Promise<CreditDebitNote> => {
    const id = `cdn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const noteNumber = noteData.noteNumber || generateNoteNumber(noteData.noteType);

    const newNote: CreditDebitNote = {
      ...noteData,
      id,
      noteNumber,
      created_at: now,
      updated_at: now
    };

    setCreditDebitNotes(prev => [newNote, ...prev]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('credit_debit_notes').insert([{
          id: newNote.id,
          note_number: newNote.noteNumber,
          note_type: newNote.noteType,
          invoice_id: newNote.invoiceId,
          invoice_number: newNote.invoiceNumber,
          invoice_date: newNote.invoiceDate,
          client_id: newNote.clientId,
          client_name: newNote.clientName,
          client_company: newNote.clientCompany,
          client_gstin: newNote.clientGstin || null,
          client_address: newNote.clientAddress || null,
          seller_name: newNote.sellerName,
          seller_gstin: newNote.sellerGstin,
          seller_state: newNote.sellerState,
          seller_state_code: newNote.sellerStateCode,
          buyer_state: newNote.buyerState,
          buyer_state_code: newNote.buyerStateCode,
          place_of_supply: newNote.placeOfSupply,
          issue_date: newNote.issueDate,
          reason: newNote.reason,
          reason_notes: newNote.reasonNotes || null,
          reverse_charge: newNote.reverseCharge,
          items: newNote.items,
          subtotal: newNote.subtotal,
          taxable_amount: newNote.taxableAmount,
          gst_type: newNote.gstType,
          gst_rate: newNote.gstRate,
          cgst_amount: newNote.cgstAmount,
          sgst_amount: newNote.sgstAmount,
          utgst_amount: newNote.utgstAmount,
          igst_amount: newNote.igstAmount,
          total_tax: newNote.totalTax,
          total_amount: newNote.totalAmount,
          amount_in_words: newNote.amountInWords || null,
          status: newNote.status,
          created_by: currentUser.name || 'Fusion Forge Creation'
        }]);
      } catch (err) {
        console.warn('[Supabase Credit Debit Note Insert] Non-critical fallback:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'credit_debit_notes',
      record_id: newNote.id,
      details: `Created ${newNote.noteType.toUpperCase()} NOTE ${newNote.noteNumber} against Invoice ${newNote.invoiceNumber} for ${newNote.clientCompany} (₹ ${newNote.totalAmount.toLocaleString('en-IN')})`
    });

    addNotification({
      type: 'gst_report_generated',
      category: 'financials',
      title: `📑 ${newNote.noteType === 'credit' ? 'Credit' : 'Debit'} Note ${newNote.noteNumber} Issued`,
      message: `${newNote.noteType === 'credit' ? 'Credit Note' : 'Debit Note'} issued against Invoice ${newNote.invoiceNumber} for ${newNote.clientCompany} (₹${newNote.totalAmount.toLocaleString('en-IN')}).`,
      link: 'credit_debit_notes',
      entity_type: 'credit_debit_note',
      entity_id: newNote.id,
      priority: 'high',
      metadata: {
        noteNumber: newNote.noteNumber,
        noteType: newNote.noteType,
        invoiceNumber: newNote.invoiceNumber,
        amount: newNote.totalAmount
      },
      event_key: `cdn_${newNote.id}`
    });

    return newNote;
  };

  const updateCreditDebitNote = async (id: string, data: Partial<CreditDebitNote>) => {
    setCreditDebitNotes(prev => prev.map(cdn => cdn.id === id ? { ...cdn, ...data, updated_at: new Date().toISOString() } : cdn));

    if (isSupabaseConfigured) {
      try {
        const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
        if (data.noteNumber !== undefined) updatePayload.note_number = data.noteNumber;
        if (data.noteType !== undefined) updatePayload.note_type = data.noteType;
        if (data.invoiceNumber !== undefined) updatePayload.invoice_number = data.invoiceNumber;
        if (data.invoiceDate !== undefined) updatePayload.invoice_date = data.invoiceDate;
        if (data.clientCompany !== undefined) updatePayload.client_company = data.clientCompany;
        if (data.clientGstin !== undefined) updatePayload.client_gstin = data.clientGstin;
        if (data.placeOfSupply !== undefined) updatePayload.place_of_supply = data.placeOfSupply;
        if (data.issueDate !== undefined) updatePayload.issue_date = data.issueDate;
        if (data.reason !== undefined) updatePayload.reason = data.reason;
        if (data.reasonNotes !== undefined) updatePayload.reason_notes = data.reasonNotes;
        if (data.reverseCharge !== undefined) updatePayload.reverse_charge = data.reverseCharge;
        if (data.items !== undefined) updatePayload.items = data.items;
        if (data.taxableAmount !== undefined) updatePayload.taxable_amount = data.taxableAmount;
        if (data.cgstAmount !== undefined) updatePayload.cgst_amount = data.cgstAmount;
        if (data.sgstAmount !== undefined) updatePayload.sgst_amount = data.sgstAmount;
        if (data.utgstAmount !== undefined) updatePayload.utgst_amount = data.utgstAmount;
        if (data.igstAmount !== undefined) updatePayload.igst_amount = data.igstAmount;
        if (data.totalTax !== undefined) updatePayload.total_tax = data.totalTax;
        if (data.totalAmount !== undefined) updatePayload.total_amount = data.totalAmount;
        if (data.status !== undefined) updatePayload.status = data.status;

        await supabase.from('credit_debit_notes').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('[Supabase Credit Debit Note Update] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'credit_debit_notes',
      record_id: id,
      details: `Updated Credit/Debit note ${id}`
    });
  };

  const deleteCreditDebitNote = async (id: string) => {
    const target = creditDebitNotes.find(c => c.id === id);
    setCreditDebitNotes(prev => prev.filter(c => c.id !== id));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('credit_debit_notes').delete().eq('id', id);
      } catch (err) {
        console.warn('[Supabase Credit Debit Note Delete] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'credit_debit_notes',
      record_id: id,
      details: `Deleted ${target?.noteType || 'Note'} ${target?.noteNumber || id} for ${target?.clientCompany || ''}`
    });
  };

  const updateAgencyConfig = (data: Partial<typeof AGENCY_CONFIG>) => {
    setAgencyConfig(prev => ({ ...prev, ...data }));

    if (isSupabaseConfigured) {
      supabase.from('seller_profile').update({
        ...(data.company_name !== undefined ? { company_name: data.company_name } : (data.name !== undefined ? { company_name: data.name } : {})),
        ...(data.tagline !== undefined ? { tagline: data.tagline } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.gstin !== undefined ? { gstin: data.gstin } : {}),
        ...(data.state_code !== undefined ? { state_code: data.state_code } : {}),
        ...(data.msme_number !== undefined ? { msme_number: data.msme_number } : (data.msmeNumber !== undefined ? { msme_number: data.msmeNumber } : {})),
        ...(data.stamp_url !== undefined ? { stamp_url: data.stamp_url } : (data.stampUrl !== undefined ? { stamp_url: data.stampUrl } : {})),
        ...(data.signature_url !== undefined ? { signature_url: data.signature_url } : {}),
        ...(data.logo_url !== undefined ? { logo_url: data.logo_url } : {}),
        ...(data.default_quotation_validity_days !== undefined ? { default_quotation_validity_days: data.default_quotation_validity_days } : {}),
        ...(data.quotation_terms !== undefined ? { quotation_terms: data.quotation_terms } : {}),
        ...(data.invoice_terms !== undefined ? { invoice_terms: data.invoice_terms } : {}),
        ...(data.numbering_configs !== undefined ? { numbering_configs: data.numbering_configs } : {}),
        ...(data.bank_name !== undefined ? { bank_name: data.bank_name } : (data.bankDetails?.bankName !== undefined ? { bank_name: data.bankDetails.bankName } : {})),
        ...(data.account_name !== undefined ? { account_name: data.account_name } : (data.bankDetails?.accountName !== undefined ? { account_name: data.bankDetails.accountName } : {})),
        ...(data.account_number !== undefined ? { account_number: data.account_number } : (data.bankDetails?.accountNumber !== undefined ? { account_number: data.bankDetails.accountNumber } : {})),
        ...(data.ifsc_code !== undefined ? { ifsc_code: data.ifsc_code } : (data.bankDetails?.ifscCode !== undefined ? { ifsc_code: data.bankDetails.ifscCode } : {})),
        ...(data.branch_name !== undefined ? { branch_name: data.branch_name } : (data.bankDetails?.branch !== undefined ? { branch_name: data.bankDetails.branch } : {})),
        ...(data.terms_conditions !== undefined ? { terms_conditions: data.terms_conditions } : {}),
        updated_at: new Date().toISOString()
      }).neq('id', '00000000-0000-0000-0000-000000000000').then();
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'seller_profile',
      record_id: 'master_seller_profile',
      details: `Updated master seller profile: ${data.company_name || data.name || 'Fusion Forge Creation'}`
    });
  };

  // ===========================================================================
  // PHASE 16: LEGAL DOCUMENT MONITORING & VERSION CONTROL (SUPER ADMIN)
  // ===========================================================================
  const updateLegalDocument = async (
    id: string, 
    updates: Partial<LegalDocument>, 
    changeSummary: string = 'Updated legal document contents'
  ): Promise<LegalDocument | undefined> => {
    const existing = legalDocuments.find(d => d.id === id || d.slug === id);
    if (!existing) return undefined;

    const timestamp = new Date().toISOString();
    const updatedDoc: LegalDocument = {
      ...existing,
      ...updates,
      lastUpdatedDate: timestamp.split('T')[0],
      lastModifiedBy: currentUser.full_name || currentUser.name,
      lastModifiedByEmail: currentUser.email,
      lastModifiedByRole: currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role,
      changeSummary: changeSummary || updates.changeSummary || existing.changeSummary,
      updated_at: timestamp
    };

    // Create a new revision history snapshot
    const historyId = `hist_${existing.slug}_${Date.now()}`;
    const newHistoryItem: LegalDocumentHistoryItem = {
      id: historyId,
      documentId: existing.id,
      documentSlug: existing.slug,
      version: updatedDoc.version,
      title: updatedDoc.title,
      summary: updatedDoc.summary,
      content: updatedDoc.content,
      effectiveDate: updatedDoc.effectiveDate,
      status: updatedDoc.status,
      changedBy: currentUser.full_name || currentUser.name,
      changedByEmail: currentUser.email,
      changedByRole: currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role,
      changeSummary: changeSummary,
      created_at: timestamp
    };

    setLegalDocuments(prev => prev.map(d => (d.id === existing.id ? updatedDoc : d)));
    setLegalHistory(prev => [newHistoryItem, ...prev]);

    // Persist authoritatively in Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('legal_documents').update({
          title: updatedDoc.title,
          version: updatedDoc.version,
          effective_date: updatedDoc.effectiveDate,
          last_updated_date: updatedDoc.lastUpdatedDate,
          status: updatedDoc.status,
          summary: updatedDoc.summary,
          content: updatedDoc.content,
          jurisdiction: updatedDoc.jurisdiction,
          applicable_law: updatedDoc.applicableLaw,
          last_modified_by: updatedDoc.lastModifiedBy,
          last_modified_by_email: updatedDoc.lastModifiedByEmail,
          last_modified_by_role: updatedDoc.lastModifiedByRole,
          change_summary: updatedDoc.changeSummary,
          version_history_count: (existing.versionHistoryCount || 1) + 1,
          updated_at: timestamp
        }).eq('id', existing.id);

        await supabase.from('legal_document_history').insert([{
          id: newHistoryItem.id,
          document_id: newHistoryItem.documentId,
          document_slug: newHistoryItem.documentSlug,
          version: newHistoryItem.version,
          title: newHistoryItem.title,
          summary: newHistoryItem.summary,
          content: newHistoryItem.content,
          effective_date: newHistoryItem.effectiveDate,
          status: newHistoryItem.status,
          changed_by: newHistoryItem.changedBy,
          changed_by_email: newHistoryItem.changedByEmail,
          changed_by_role: newHistoryItem.changedByRole,
          change_summary: newHistoryItem.changeSummary,
          created_at: timestamp
        }]);
      } catch (err) {
        console.warn('[Supabase Legal Document Update] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'legal_documents',
      record_id: existing.id,
      details: `Updated legal document "${existing.title}" to ${updatedDoc.version} (${updatedDoc.status}). Summary: ${changeSummary}`
    });

    addNotification({
      type: 'system_alert',
      category: 'compliance',
      title: `Legal Document Updated: ${existing.title}`,
      message: `Version ${updatedDoc.version} published by ${currentUser.name} (${currentUser.role}). Status: ${updatedDoc.status.toUpperCase()}`,
      priority: 'high',
      target_role: 'admin',
      entity_type: 'legal_document',
      entity_id: existing.id,
      metadata: { slug: existing.slug, version: updatedDoc.version, changeSummary }
    });

    return updatedDoc;
  };

  const createLegalDocumentRevision = async (
    id: string,
    newVersion: string,
    content: string,
    changeSummary: string,
    newStatus: LegalDocumentStatus = 'active'
  ): Promise<LegalDocument | undefined> => {
    return updateLegalDocument(id, { version: newVersion, content, status: newStatus }, changeSummary);
  };

  const restoreLegalDocumentVersion = async (documentId: string, historyId: string): Promise<boolean> => {
    const hist = legalHistory.find(h => h.id === historyId);
    if (!hist) return false;

    const doc = legalDocuments.find(d => d.id === documentId || d.slug === hist.documentSlug);
    if (!doc) return false;

    await updateLegalDocument(
      doc.id,
      {
        content: hist.content,
        title: hist.title,
        summary: hist.summary,
        version: `${hist.version}-restored`,
        status: 'active'
      },
      `Rollback & restored content from historical revision ${hist.version} (originally authored by ${hist.changedBy})`
    );

    return true;
  };

  // ===========================================================================
  // PHASE 16: PRIVACY-CONSCIOUS VISITOR TELEMETRY (SUPER ADMIN MONITORING)
  // ===========================================================================
  const trackVisitorEvent = async (
    eventData: Partial<Omit<VisitorEvent, 'id' | 'created_at'>> & { eventType: VisitorEventType | string }
  ): Promise<VisitorEvent | undefined> => {
    if (!isVisitorTrackingEnabled) return undefined;

    const eventId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    const fullEvent: VisitorEvent = {
      id: eventId,
      created_at: timestamp,
      sessionId: eventData.sessionId || getOrCreateSessionId(),
      eventType: eventData.eventType || 'page_view',
      pagePath: eventData.pagePath || '/',
      sectionId: eventData.sectionId,
      referrer: eventData.referrer || getSanitizedReferrer(),
      deviceType: eventData.deviceType || detectDeviceType(),
      browser: eventData.browser || detectBrowser(),
      os: eventData.os || detectOS(),
      region: eventData.region || 'India',
      durationSeconds: eventData.durationSeconds || 10,
      metadata: buildPrivacySafeMetadata(eventData.metadata)
    };

    setVisitorEvents(prev => [fullEvent, ...prev.slice(0, 499)]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('visitor_events').insert([{
          id: fullEvent.id,
          session_id: fullEvent.sessionId,
          event_type: fullEvent.eventType,
          page_path: fullEvent.pagePath,
          section_id: fullEvent.sectionId || null,
          referrer: fullEvent.referrer,
          device_type: fullEvent.deviceType,
          browser: fullEvent.browser,
          os: fullEvent.os,
          region: fullEvent.region || null,
          duration_seconds: fullEvent.durationSeconds || null,
          metadata: fullEvent.metadata || {},
          created_at: fullEvent.created_at
        }]);
      } catch (err) {
        console.warn('[Supabase Visitor Event Tracking] Handled error:', err);
      }
    }

    return fullEvent;
  };

  const toggleVisitorTracking = (): boolean => {
    const newState = !isVisitorTrackingEnabled;
    setIsVisitorTrackingEnabled(newState);

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'UPDATE',
      table_name: 'visitor_events',
      record_id: 'telemetry_config',
      details: `${newState ? 'Enabled' : 'Disabled'} privacy-conscious visitor telemetry monitoring.`
    });

    return newState;
  };

  const clearVisitorEvents = async (): Promise<void> => {
    setVisitorEvents([]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('visitor_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (err) {
        console.warn('[Supabase Clear Visitor Logs] Error:', err);
      }
    }

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'DELETE',
      table_name: 'visitor_events',
      record_id: 'all_records',
      details: 'Purged historical visitor analytics logs pursuant to Super Admin privacy maintenance.'
    });
  };

  return (
    <AppContext.Provider value={{
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
      testBuzzerSound,
      triggerSimulatedLeadAlert,
      clients,
      quotations,
      invoices,
      payments,
      creditDebitNotes,
      creditNotes: creditDebitNotes,
      purchases,
      expenses,
      staffMembers,
      salaryRecords,
      enquiries,
      portfolio,
      services,
      managedProjects,
      completedWorks,
      technologies,
      testimonials,
      faqs,
      chatbotQAs,
      chatbotSettings,
      users,
      addCreditDebitNote,
      updateCreditDebitNote,
      deleteCreditDebitNote,
      generateNoteNumber,
      addPurchase,
      updatePurchase,
      deletePurchase,
      markPurchasePaid,
      addExpense,
      updateExpense,
      deleteExpense,
      addStaffMember,
      updateStaffMember,
      deleteStaffMember,
      addSalaryRecord,
      updateSalaryRecord,
      deleteSalaryRecord,
      generateMonthlyPayroll,
      markSalaryPaid,
      addClient,
      updateClient,
      deleteClient,
      softDeleteClient,
      restoreClient,
      addQuotation,
      updateQuotation,
      deleteQuotation,
      convertQuoteToInvoice,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      softDeleteInvoice,
      restoreInvoice,
      createInvoiceFromProject,
      recordPayment,
      updatePayment,
      deletePayment,
      addEnquiry,
      updateEnquiryStatus,
      convertEnquiryToClient,
      deleteEnquiry,
      addService,
      updateService,
      deleteService,
      addManagedProject,
      updateManagedProject,
      deleteManagedProject,
      sendProjectStatusEmail,
      addCompletedWork,
      updateCompletedWork,
      deleteCompletedWork,
      archiveProjectToCompletedWork,
      addTechnology,
      updateTechnology,
      deleteTechnology,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      addFaq,
      updateFaq,
      deleteFaq,
      addChatbotQA,
      updateChatbotQA,
      deleteChatbotQA,
      updateChatbotSettings,
      addUser,
      updateUser,
      deleteUser,
      roles,
      permissions,
      addRole,
      updateRole,
      deleteRole,
      assignUserRole,
      checkPermission,
      auditLogs,
      addAuditLog,
      // Phase 12: Central Notification & Email Dispatch System
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
      // Phase 16: Legal Document Monitoring & Visitor Monitoring
      legalDocuments,
      legalHistory,
      updateLegalDocument,
      createLegalDocumentRevision,
      restoreLegalDocumentVersion,
      visitorEvents,
      trackVisitorEvent,
      isVisitorTrackingEnabled,
      toggleVisitorTracking,
      clearVisitorEvents,
      visitorSummary,
      pricePresets,
      addPricePreset,
      updatePricePreset,
      deletePricePreset,
      togglePricePresetActive,
      paymentTerms,
      addPaymentTerm,
      updatePaymentTerm,
      deletePaymentTerm,
      setDefaultPaymentTerm,
      updateDocumentNumberConfig,
      updateAgencyConfig,
      agencyConfig,
      isAuthenticated,
      setIsAuthenticated,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
