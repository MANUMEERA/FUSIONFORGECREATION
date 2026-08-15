import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  TechnologyItem,
  TestimonialItem,
  FaqItem,
  ChatbotQAItem,
  ChatbotSettings,
  AuditLog
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CLIENTS, 
  INITIAL_QUOTATIONS, 
  INITIAL_INVOICES, 
  INITIAL_PAYMENTS, 
  INITIAL_ENQUIRIES, 
  INITIAL_PORTFOLIO,
  INITIAL_SERVICES,
  INITIAL_MANAGED_PROJECTS,
  INITIAL_TECHNOLOGIES,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_CHATBOT_QA,
  INITIAL_CHATBOT_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SOCIAL_CHANNELS,
  AGENCY_CONFIG 
} from '../mockData';
import { calculateGstInvoiceTotals } from '../utils/gstEngine';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { logAuditEvent } from '../utils/auditLogger';
import { buzzerEngine } from '../utils/buzzerSound';

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

  clients: Client[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: Payment[];
  enquiries: ProjectEnquiry[];
  portfolio: PortfolioProject[];
  services: AgencyService[];
  managedProjects: ManagedProject[];
  technologies: TechnologyItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  chatbotQAs: ChatbotQAItem[];
  chatbotSettings: ChatbotSettings;
  users: UserProfile[];
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'created_at'>) => void;

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
  
  recordPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'receiptNumber'>) => Payment;
  deletePayment: (id: string) => void;
  
  addEnquiry: (enquiry: Omit<ProjectEnquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'priority'>) => ProjectEnquiry;
  updateEnquiryStatus: (id: string, status: ProjectEnquiry['status']) => void;
  convertEnquiryToClient: (enquiryId: string) => Client | null;
  deleteEnquiry: (id: string) => void;

  addService: (service: Omit<AgencyService, 'id'>) => AgencyService;
  updateService: (id: string, data: Partial<AgencyService>) => void;
  deleteService: (id: string) => void;

  addManagedProject: (project: Omit<ManagedProject, 'id'>) => ManagedProject;
  updateManagedProject: (id: string, data: Partial<ManagedProject>) => void;
  deleteManagedProject: (id: string) => void;

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

  updateAgencyConfig: (data: Partial<typeof AGENCY_CONFIG>) => void;
  agencyConfig: typeof AGENCY_CONFIG;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [currentView, setCurrentView] = useState<'public' | 'portal'>('public');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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
  const [enquiries, setEnquiries] = useState<ProjectEnquiry[]>(INITIAL_ENQUIRIES);
  const [services, setServices] = useState<AgencyService[]>(INITIAL_SERVICES);
  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>(INITIAL_MANAGED_PROJECTS);
  const [technologies, setTechnologies] = useState<TechnologyItem[]>(INITIAL_TECHNOLOGIES);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(INITIAL_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [chatbotQAs, setChatbotQAs] = useState<ChatbotQAItem[]>(() => {
    try {
      const saved = localStorage.getItem('fusion_forge_chatbot_qas');
      return saved ? JSON.parse(saved) : INITIAL_CHATBOT_QA;
    } catch {
      return INITIAL_CHATBOT_QA;
    }
  });
  const [chatbotSettings, setChatbotSettings] = useState<ChatbotSettings>(() => {
    try {
      const saved = localStorage.getItem('fusion_forge_chatbot_settings');
      return saved ? JSON.parse(saved) : INITIAL_CHATBOT_SETTINGS;
    } catch {
      return INITIAL_CHATBOT_SETTINGS;
    }
  });
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [agencyConfig, setAgencyConfig] = useState<typeof AGENCY_CONFIG>(() => {
    try {
      const saved = localStorage.getItem('fusion_forge_agency_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        const parsedChannels = parsed.social_channels || parsed.socialChannels || INITIAL_SOCIAL_CHANNELS;
        return { 
          ...AGENCY_CONFIG, 
          ...parsed, 
          social_channels: parsedChannels,
          socialChannels: parsedChannels,
          social_links: { ...AGENCY_CONFIG.social_links, ...(parsed.social_links || parsed.socialLinks || {}) },
          socialLinks: { ...AGENCY_CONFIG.socialLinks, ...(parsed.social_links || parsed.socialLinks || {}) }
        };
      }
      return AGENCY_CONFIG;
    } catch {
      return AGENCY_CONFIG;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fusion_forge_agency_config', JSON.stringify(agencyConfig));
    } catch (e) {
      console.warn('Failed to persist agencyConfig to localStorage', e);
    }
  }, [agencyConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion_forge_chatbot_qas', JSON.stringify(chatbotQAs));
    } catch (e) {
      console.warn('Failed to persist chatbot Q&As to localStorage', e);
    }
  }, [chatbotQAs]);

  useEffect(() => {
    try {
      localStorage.setItem('fusion_forge_chatbot_settings', JSON.stringify(chatbotSettings));
    } catch (e) {
      console.warn('Failed to persist chatbot settings to localStorage', e);
    }
  }, [chatbotSettings]);

  // Sync state from Supabase PostgreSQL tables according to authoritative schema
  const syncFromDatabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLastSyncedAt(new Date().toLocaleTimeString());
      return;
    }

    try {
      setIsLoading(true);

      // 1. Fetch Clients (columns: id, name, company, email, phone, address, tax_number, notes, enquiry_id, state_code, place_of_supply, created_at, updated_at)
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsData && clientsData.length > 0) {
        const mappedClients: Client[] = clientsData.map((c: any) => ({
          id: c.id,
          name: c.name || '',
          companyName: c.company || c.name || 'Client',
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || '',
          stateCode: c.state_code || '',
          placeOfSupply: c.place_of_supply || '',
          gstin: c.tax_number || '',
          pan: c.tax_number ? c.tax_number.substring(2, 12) : '',
          billingAddress: {
            street: c.address || '',
            city: '',
            state: '',
            stateCode: c.state_code || '',
            postalCode: '',
            country: 'India'
          },
          currency: 'INR',
          status: 'active',
          isDeleted: false,
          totalBilled: 0,
          totalPaid: 0,
          notes: c.notes || '',
          createdAt: c.created_at,
          updatedAt: c.updated_at
        }));
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
          bank_name: sellerData.bank_name || prev.bank_name,
          account_name: sellerData.account_name || prev.account_name,
          account_number: sellerData.account_number || prev.account_number,
          ifsc_code: sellerData.ifsc_code || prev.ifsc_code,
          branch_name: sellerData.branch_name || prev.branch_name,
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

      setDbConnected(true);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('[Supabase Production Sync] Handled error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [agencyConfig]);

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
        setCurrentUser(userProfile);
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
        company: newClient.companyName,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address || newClient.billingAddress?.street || '',
        state_code: newClient.stateCode || newClient.billingAddress?.stateCode || '',
        place_of_supply: newClient.placeOfSupply || '',
        tax_number: newClient.gstin || '',
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
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.stateCode !== undefined ? { state_code: data.stateCode } : {}),
        ...(data.placeOfSupply !== undefined ? { place_of_supply: data.placeOfSupply } : {}),
        ...(data.gstin !== undefined ? { tax_number: data.gstin } : {}),
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
    const invNum = `FFC-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    const client = clients.find(c => c.id === quote.clientId);
    
    const sellerCode = quote.sellerStateCode || '21';
    const buyerCode = quote.buyerStateCode || client?.stateCode || '24';
    
    const gstCalc = calculateGstInvoiceTotals({
      sellerStateCode: sellerCode,
      buyerStateCode: buyerCode,
      items: quote.items,
      discountType: quote.discountType,
      discountValue: quote.discountValue,
      gstRate: quote.gstRate ?? 18,
      currency: quote.currency || 'INR',
      overrideGstType: quote.gstType === 'none' ? 'none' : undefined
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
      clientAddress: client?.address || '',
      clientGstin: client?.gstin || '',
      sellerName: agencyConfig.name,
      sellerAddress: `${agencyConfig.address}, ${agencyConfig.city}, ${agencyConfig.state} - ${agencyConfig.postalCode}`,
      sellerGstin: agencyConfig.gstin,
      sellerState: agencyConfig.state,
      sellerStateCode: sellerCode,
      buyerCompany: quote.clientCompany,
      buyerName: quote.clientName,
      buyerAddress: client?.address || '',
      buyerGstin: client?.gstin || '—',
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
      gstType: gstCalc.gstType,
      gstRate: gstCalc.gstRate,
      cgstAmount: gstCalc.cgstAmount,
      sgstAmount: gstCalc.sgstAmount,
      utgstAmount: gstCalc.utgstAmount,
      igstAmount: gstCalc.igstAmount,
      totalAmount: gstCalc.grandTotal,
      amountInWords: gstCalc.amountInWords,
      paidAmount: 0,
      balanceDue: gstCalc.grandTotal,
      status: 'issued',
      paymentTerms: 'Payment due within 15 days.',
      bankDetails: agencyConfig.bankDetails,
      notes: quote.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    updateQuotation(quote.id, { status: 'converted', convertedInvoiceId: newInvoice.id });

    addAuditLog({
      user_id: currentUser.id,
      user_email: currentUser.email,
      user_role: currentUser.role,
      action: 'CREATE',
      table_name: 'invoices',
      record_id: newInvoice.id,
      details: `Converted Quotation ${quote.quoteNumber} into Tax Invoice ${newInvoice.invoiceNumber}`
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

    return newPayment;
  };

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
        project_type: newEnq.service || newEnq.serviceCategory || 'Custom Solution',
        budget: newEnq.budgetRange || 'Custom',
        timeline: newEnq.timeline || 'Immediate',
        message: newEnq.projectDescription || '',
        status: 'New'
      }).then();
    }

    addAuditLog({
      user_id: 'public_lead',
      user_email: enqData.email,
      user_role: 'public' as any,
      action: 'CREATE',
      table_name: 'enquiries',
      record_id: newEnq.id,
      details: `Public enquiry submitted by ${enqData.name} (${enqData.company || 'Direct'}) for ${enqData.service || enqData.serviceCategory || 'Custom Solution'}`
    });

    // Authoritatively notify logged-in Admin user with visual alert and sound buzzer
    setLatestLeadAlert(newEnq);
    buzzerEngine.playLeadBuzzer();

    return newEnq;
  };

  const triggerSimulatedLeadAlert = (): ProjectEnquiry => {
    const sampleLeads = [
      {
        name: 'Dr. Vikram Malhotra',
        company: 'Apex Healthtech AI Ltd',
        email: 'v.malhotra@apexhealthtech.io',
        phone: '+91 98450 12890',
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
      billingAddress: {
        street: 'Commercial Office',
        city: 'Mumbai',
        state: 'Maharashtra',
        stateCode: '27',
        postalCode: '400001',
        country: 'India'
      },
      currency: 'INR',
      status: 'active',
      notes: `Requirements: ${enq.projectDescription}`
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
    const newProj: ManagedProject = { ...proj, id: `proj_${Date.now()}` };
    setManagedProjects(prev => [newProj, ...prev]);
    return newProj;
  };
  const updateManagedProject = (id: string, data: Partial<ManagedProject>) => {
    setManagedProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };
  const deleteManagedProject = (id: string) => {
    setManagedProjects(prev => prev.filter(p => p.id !== id));
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
    return newUsr;
  };

  const updateUser = (id: string, data: Partial<UserProfile>) => {
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
  };

  const deleteUser = (id: string) => {
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
        ...(data.bank_name !== undefined ? { bank_name: data.bank_name } : (data.bankDetails?.bankName !== undefined ? { bank_name: data.bankDetails.bankName } : {})),
        ...(data.account_name !== undefined ? { account_name: data.account_name } : (data.bankDetails?.accountName !== undefined ? { account_name: data.bankDetails.accountName } : {})),
        ...(data.account_number !== undefined ? { account_number: data.account_number } : (data.bankDetails?.accountNumber !== undefined ? { account_number: data.bankDetails.accountNumber } : {})),
        ...(data.ifsc_code !== undefined ? { ifsc_code: data.ifsc_code } : (data.bankDetails?.ifscCode !== undefined ? { ifsc_code: data.bankDetails.ifscCode } : {})),
        ...(data.branch_name !== undefined ? { branch_name: data.branch_name } : (data.bankDetails?.branch !== undefined ? { branch_name: data.bankDetails.branch } : {})),
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
      enquiries,
      portfolio,
      services,
      managedProjects,
      technologies,
      testimonials,
      faqs,
      chatbotQAs,
      chatbotSettings,
      users,
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
      recordPayment,
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
      auditLogs,
      addAuditLog,
      updateAgencyConfig,
      agencyConfig
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
