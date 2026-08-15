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
  INITIAL_AUDIT_LOGS,
  AGENCY_CONFIG 
} from '../mockData';
import { calculateGstInvoiceTotals } from '../utils/gstEngine';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { logAuditEvent } from '../utils/auditLogger';

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

  // In-Memory Database State (Authoritatively Synced with Supabase PostgreSQL)
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
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [portfolio] = useState<PortfolioProject[]>(INITIAL_PORTFOLIO);
  const [agencyConfig, setAgencyConfig] = useState<typeof AGENCY_CONFIG>(AGENCY_CONFIG);

  // Sync state from Supabase PostgreSQL tables
  const syncFromDatabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLastSyncedAt(new Date().toLocaleTimeString());
      return;
    }

    try {
      setIsLoading(true);
      // Fetch Clients
      const { data: clientsData, error: clientsErr } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (!clientsErr && clientsData && clientsData.length > 0) {
        const mappedClients: Client[] = clientsData.map((c: any) => ({
          id: c.id,
          name: c.name,
          companyName: c.company_name,
          email: c.email,
          phone: c.phone || '',
          address: c.address || '',
          city: c.city || '',
          state: c.state || '',
          stateCode: c.state_code || '',
          pincode: c.pincode || '',
          gstin: c.gstin || '',
          pan: c.pan || '',
          billingAddress: c.billing_address || {
            street: c.address || '',
            city: c.city || '',
            state: c.state || '',
            stateCode: c.state_code || '',
            postalCode: c.pincode || '',
            country: 'India'
          },
          currency: c.currency || 'INR',
          status: c.status || 'active',
          isDeleted: c.is_deleted || false,
          deletedAt: c.deleted_at || undefined,
          totalBilled: Number(c.total_billed) || 0,
          totalPaid: Number(c.total_paid) || 0,
          notes: c.notes || '',
          createdAt: c.created_at,
          updatedAt: c.updated_at
        }));
        setClients(mappedClients);
      }

      // Fetch Audit Logs
      const { data: auditData, error: auditErr } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!auditErr && auditData && auditData.length > 0) {
        setAuditLogs(auditData as AuditLog[]);
      }

      setDbConnected(true);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('[Supabase Sync] Background query status:', err);
    } finally {
      setIsLoading(false);
    }
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

    // Authoritative Supabase Insert
    if (isSupabaseConfigured) {
      supabase.from('clients').insert({
        id: newClient.id,
        name: newClient.name,
        company_name: newClient.companyName,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        city: newClient.city,
        state: newClient.state,
        state_code: newClient.stateCode,
        pincode: newClient.pincode,
        gstin: newClient.gstin,
        pan: newClient.pan,
        billing_address: newClient.billingAddress,
        currency: newClient.currency,
        status: newClient.status,
        is_deleted: false,
        total_billed: 0,
        total_paid: 0,
        notes: newClient.notes
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
        ...(data.companyName ? { company_name: data.companyName } : {}),
        ...(data.name ? { name: data.name } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
        ...(data.status ? { status: data.status } : {}),
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
      supabase.from('clients').update({
        is_deleted: true,
        status: 'deleted',
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
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

    if (isSupabaseConfigured) {
      supabase.from('clients').update({
        is_deleted: false,
        status: 'active',
        deleted_at: null,
        updated_at: new Date().toISOString()
      }).eq('id', id).then();
    }

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

    addAuditLog({
      user_id: 'public_lead',
      user_email: enqData.email,
      user_role: 'public' as any,
      action: 'CREATE',
      table_name: 'enquiries',
      record_id: newEnq.id,
      details: `Public enquiry submitted by ${enqData.name} (${enqData.company || 'Direct'}) for ${enqData.service || enqData.serviceCategory || 'Custom Solution'}`
    });

    return newEnq;
  };

  const updateEnquiryStatus = (id: string, status: ProjectEnquiry['status']) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status, updatedAt: new Date().toISOString() } : e));
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
    return newSrv;
  };
  const updateService = (id: string, data: Partial<AgencyService>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };
  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
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
    return newTech;
  };
  const updateTechnology = (id: string, data: Partial<TechnologyItem>) => {
    setTechnologies(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };
  const deleteTechnology = (id: string) => {
    setTechnologies(prev => prev.filter(t => t.id !== id));
  };

  // CRUD for Testimonials
  const addTestimonial = (testi: Omit<TestimonialItem, 'id'>): TestimonialItem => {
    const newTesti: TestimonialItem = { ...testi, id: `testi_${Date.now()}` };
    setTestimonials(prev => [newTesti, ...prev]);
    return newTesti;
  };
  const updateTestimonial = (id: string, data: Partial<TestimonialItem>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };
  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // CRUD for FAQs
  const addFaq = (faq: Omit<FaqItem, 'id'>): FaqItem => {
    const newFaq: FaqItem = { ...faq, id: `faq_${Date.now()}` };
    setFaqs(prev => [...prev, newFaq]);
    return newFaq;
  };
  const updateFaq = (id: string, data: Partial<FaqItem>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };
  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
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
