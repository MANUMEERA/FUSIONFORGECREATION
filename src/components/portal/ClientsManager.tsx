import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Eye, 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Copy, 
  Check, 
  Receipt, 
  DollarSign, 
  ArrowUpRight, 
  Filter, 
  LayoutList, 
  LayoutGrid, 
  ShieldAlert,
  Info,
  ExternalLink,
  ChevronDown,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client, Quotation, Invoice } from '../../types';
import { 
  INDIAN_STATES, 
  getStateCodeByName, 
  getStateNameByCode, 
  formatPlaceOfSupply, 
  validateAndDeriveGstin 
} from '../../data/indianStates';

export const ClientsManager: React.FC = () => {
  const { 
    clients, 
    addClient, 
    updateClient, 
    deleteClient, 
    softDeleteClient, 
    restoreClient,
    quotations,
    invoices,
    payments,
    setActiveTab
  } = useApp();

  // View & Filter states
  const [activeTabFilter, setActiveTabFilter] = useState<'active' | 'trash'>('active');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gstFilter, setGstFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'billed_desc' | 'created_desc'>('name_asc');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [deleteConfirmClient, setDeleteConfirmClient] = useState<{ client: Client; isPermanent: boolean } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const initialFormState = {
    companyName: '',
    name: '', // contact person
    email: '',
    phone: '',
    // Billing Details
    address: '',
    city: '',
    state: 'Gujarat',
    stateCode: '24',
    pincode: '',
    gstin: '',
    pan: '',
    placeOfSupply: '24-Gujarat',
    placeOfSupplyCode: '24',
    // Shipping Details
    sameAsBilling: true,
    shippingName: '',
    shippingCompany: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: 'Gujarat',
    shippingStateCode: '24',
    shippingPincode: '',
    shippingGstin: '',
    status: 'active' as 'active' | 'disabled',
    notes: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  // Derived GST validation status for live feedback
  const gstValidation = useMemo(() => {
    return validateAndDeriveGstin(form.gstin);
  }, [form.gstin]);

  // Handle Billing State selection change and auto-fill state code and place of supply
  const handleStateChange = (selectedState: string) => {
    const code = getStateCodeByName(selectedState);
    const pos = formatPlaceOfSupply(selectedState, code);
    setForm(prev => ({
      ...prev,
      state: selectedState,
      stateCode: code,
      placeOfSupply: pos,
      placeOfSupplyCode: code,
      // If shipping is same as billing, update shipping state too
      ...(prev.sameAsBilling ? { shippingState: selectedState, shippingStateCode: code } : {})
    }));
  };

  // Handle Shipping State selection change
  const handleShippingStateChange = (selectedState: string) => {
    const code = getStateCodeByName(selectedState);
    setForm(prev => ({
      ...prev,
      shippingState: selectedState,
      shippingStateCode: code
    }));
  };

  // Handle GSTIN change with auto state code, place of supply, and PAN extraction
  const handleGstinChange = (gstinInput: string) => {
    const upperGstin = gstinInput.toUpperCase().trim();
    const result = validateAndDeriveGstin(upperGstin);

    if (upperGstin === '' || result.isUrp) {
      // GSTIN removed or URP: keep current state/address intact (do not overwrite valid manual entries)
      setForm(prev => ({
        ...prev,
        gstin: upperGstin
      }));
      return;
    }

    if (result.stateName && result.stateCode) {
      // Auto populate Place of Supply, Place of Supply Code, State, State Code, and PAN
      setForm(prev => ({
        ...prev,
        gstin: upperGstin,
        state: result.stateName,
        stateCode: result.stateCode,
        placeOfSupply: result.placeOfSupply,
        placeOfSupplyCode: result.stateCode,
        pan: result.pan || prev.pan,
        // If same as billing, also mirror shipping state
        ...(prev.sameAsBilling ? { shippingState: result.stateName, shippingStateCode: result.stateCode } : {})
      }));
    } else {
      setForm(prev => ({
        ...prev,
        gstin: upperGstin,
        pan: upperGstin.length >= 12 ? upperGstin.substring(2, 12) : prev.pan
      }));
    }
  };

  // Open Edit modal with prefilled data
  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    const clientState = client.state || client.billingAddress?.state || 'Gujarat';
    const clientStateCode = client.stateCode || client.billingAddress?.stateCode || getStateCodeByName(clientState) || '24';
    const sameAsBilling = client.sameAsBilling !== false;

    setForm({
      companyName: client.companyName || '',
      name: client.name || client.contactPerson || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || client.billingAddress?.street || '',
      city: client.city || client.billingAddress?.city || '',
      state: clientState,
      stateCode: clientStateCode,
      pincode: client.pincode || client.postalCode || client.billingAddress?.postalCode || '',
      gstin: client.gstin || '',
      pan: client.pan || (client.gstin && client.gstin.length >= 12 ? client.gstin.substring(2, 12) : ''),
      placeOfSupply: client.placeOfSupply || formatPlaceOfSupply(clientState, clientStateCode),
      placeOfSupplyCode: client.placeOfSupplyCode || clientStateCode,
      sameAsBilling,
      shippingName: client.shippingName || client.contactPerson || client.name || '',
      shippingCompany: client.shippingCompany || client.companyName || '',
      shippingPhone: client.shippingPhone || client.phone || '',
      shippingAddress: client.shippingAddress || client.address || client.billingAddress?.street || '',
      shippingCity: client.shippingCity || client.city || client.billingAddress?.city || '',
      shippingState: client.shippingState || clientState,
      shippingStateCode: client.shippingStateCode || clientStateCode,
      shippingPincode: client.shippingPincode || client.pincode || client.postalCode || '',
      shippingGstin: client.shippingGstin || client.gstin || '',
      status: client.status === 'disabled' ? 'disabled' : 'active',
      notes: client.notes || ''
    });
    setFormError('');
    setShowAddModal(true);
  };

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingClient(null);
    setForm(initialFormState);
    setFormError('');
    setShowAddModal(true);
  };

  // Handle Save (Add or Update)
  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      setFormError('Company name is required.');
      return;
    }

    const isGstRegistered = Boolean(form.gstin.trim() && form.gstin.trim().length === 15);
    const isUrp = !form.gstin.trim() || form.gstin.trim().toUpperCase() === 'URP';

    const clientPayload = {
      name: form.name.trim() || form.companyName.trim(),
      contactPerson: form.name.trim() || undefined,
      companyName: form.companyName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      stateCode: form.stateCode.trim(),
      pincode: form.pincode.trim(),
      postalCode: form.pincode.trim(),
      gstin: form.gstin.trim() || undefined,
      pan: form.pan.trim() || (form.gstin.trim().length >= 12 ? form.gstin.trim().substring(2, 12) : undefined),
      placeOfSupply: form.placeOfSupply.trim() || (form.state ? formatPlaceOfSupply(form.state, form.stateCode) : undefined),
      placeOfSupplyCode: form.placeOfSupplyCode.trim() || form.stateCode.trim() || undefined,
      isGstRegistered,
      isUrp,
      billingAddress: {
        street: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        stateCode: form.stateCode.trim(),
        postalCode: form.pincode.trim(),
        country: 'India'
      },
      sameAsBilling: form.sameAsBilling,
      shippingName: form.sameAsBilling ? (form.name.trim() || form.companyName.trim()) : (form.shippingName.trim() || form.name.trim() || form.companyName.trim()),
      shippingCompany: form.sameAsBilling ? form.companyName.trim() : (form.shippingCompany.trim() || form.companyName.trim()),
      shippingPhone: form.sameAsBilling ? form.phone.trim() : form.shippingPhone.trim(),
      shippingAddress: form.sameAsBilling ? form.address.trim() : form.shippingAddress.trim(),
      shippingCity: form.sameAsBilling ? form.city.trim() : form.shippingCity.trim(),
      shippingState: form.sameAsBilling ? form.state.trim() : form.shippingState.trim(),
      shippingStateCode: form.sameAsBilling ? form.stateCode.trim() : form.shippingStateCode.trim(),
      shippingPincode: form.sameAsBilling ? form.pincode.trim() : form.shippingPincode.trim(),
      shippingGstin: form.sameAsBilling ? form.gstin.trim() : form.shippingGstin.trim(),
      currency: 'INR' as const,
      status: form.status,
      isDeleted: false,
      notes: form.notes.trim()
    };

    if (editingClient) {
      updateClient(editingClient.id, clientPayload);
      if (viewingClient && viewingClient.id === editingClient.id) {
        setViewingClient({ ...viewingClient, ...clientPayload });
      }
    } else {
      addClient(clientPayload);
    }

    setShowAddModal(false);
    setEditingClient(null);
    setForm(initialFormState);
  };

  // Toggle client status (Active vs Disabled)
  const handleToggleStatus = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextStatus = client.status === 'active' ? 'disabled' : 'active';
    updateClient(client.id, { status: nextStatus });
    if (viewingClient && viewingClient.id === client.id) {
      setViewingClient({ ...viewingClient, status: nextStatus });
    }
  };

  // Soft delete client
  const handleSoftDelete = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteConfirmClient({ client, isPermanent: false });
  };

  // Permanent delete client
  const handlePermanentDelete = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeleteConfirmClient({ client, isPermanent: true });
  };

  // Execute Delete
  const confirmDeleteAction = () => {
    if (!deleteConfirmClient) return;
    const { client, isPermanent } = deleteConfirmClient;

    if (isPermanent) {
      deleteClient(client.id);
    } else {
      softDeleteClient(client.id);
    }

    if (viewingClient && viewingClient.id === client.id) {
      setViewingClient(null);
    }
    setDeleteConfirmClient(null);
  };

  // Restore client from trash
  const handleRestore = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    restoreClient(client.id);
  };

  // Copy text helper
  const copyToClipboard = (text: string, fieldId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered and Sorted Clients
  const filteredClients = useMemo(() => {
    return clients
      .filter(client => {
        // Trash vs Active tab
        const isClientDeleted = client.isDeleted || client.status === 'deleted';
        if (activeTabFilter === 'trash') {
          if (!isClientDeleted) return false;
        } else {
          if (isClientDeleted) return false;
        }

        // Search Term (Company, Contact person, Email, Phone, GSTIN, State, City)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchCompany = client.companyName?.toLowerCase().includes(term);
          const matchName = client.name?.toLowerCase().includes(term);
          const matchContact = client.contactPerson?.toLowerCase().includes(term);
          const matchEmail = client.email?.toLowerCase().includes(term);
          const matchPhone = client.phone?.toLowerCase().includes(term);
          const matchGstin = client.gstin?.toLowerCase().includes(term);
          const matchState = (client.state || client.billingAddress?.state)?.toLowerCase().includes(term);
          const matchCity = (client.city || client.billingAddress?.city)?.toLowerCase().includes(term);
          const matchPos = client.placeOfSupply?.toLowerCase().includes(term);

          if (!matchCompany && !matchName && !matchContact && !matchEmail && !matchPhone && !matchGstin && !matchState && !matchCity && !matchPos) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'active' && client.status !== 'active') return false;
          if (statusFilter === 'disabled' && client.status !== 'disabled') return false;
        }

        // State Filter
        if (stateFilter !== 'all') {
          const clientState = client.state || client.billingAddress?.state;
          if (clientState !== stateFilter) return false;
        }

        // GST Filter
        if (gstFilter !== 'all') {
          const hasGst = Boolean(client.gstin && client.gstin.trim() !== '');
          if (gstFilter === 'registered' && !hasGst) return false;
          if (gstFilter === 'unregistered' && hasGst) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.companyName.localeCompare(b.companyName);
        if (sortBy === 'name_desc') return b.companyName.localeCompare(a.companyName);
        if (sortBy === 'billed_desc') return (b.totalBilled || 0) - (a.totalBilled || 0);
        if (sortBy === 'created_desc') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        return 0;
      });
  }, [clients, activeTabFilter, searchTerm, statusFilter, stateFilter, gstFilter, sortBy]);

  // Compute Metrics
  const activeClientsCount = clients.filter(c => !c.isDeleted && c.status === 'active').length;
  const disabledClientsCount = clients.filter(c => !c.isDeleted && c.status === 'disabled').length;
  const gstRegisteredCount = clients.filter(c => !c.isDeleted && Boolean(c.gstin && c.gstin.trim())).length;
  const trashCount = clients.filter(c => c.isDeleted || c.status === 'deleted').length;

  // Extract unique states for filter
  const availableStates = useMemo(() => {
    const statesSet = new Set<string>();
    clients.forEach(c => {
      const st = c.state || c.billingAddress?.state;
      if (st) statesSet.add(st);
    });
    return Array.from(statesSet).sort();
  }, [clients]);

  // Client's linked quotations, invoices & payments
  const clientQuotations = useMemo(() => {
    if (!viewingClient) return [];
    return quotations.filter(q => q.clientId === viewingClient.id || q.clientCompany === viewingClient.companyName);
  }, [viewingClient, quotations]);

  const clientInvoices = useMemo(() => {
    if (!viewingClient) return [];
    return invoices.filter(i => i.clientId === viewingClient.id || i.clientCompany === viewingClient.companyName);
  }, [viewingClient, invoices]);

  const clientPayments = useMemo(() => {
    if (!viewingClient) return [];
    const clientInvoiceIds = new Set(clientInvoices.map(i => i.id));
    return payments.filter(p => clientInvoiceIds.has(p.invoiceId) || p.clientName === viewingClient.companyName);
  }, [viewingClient, clientInvoices, payments]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#0d1c44]/95 via-[#091535]/95 to-[#050b1a]/95 p-5 rounded-2xl border border-blue-500/25 shadow-xl">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-white shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Client Management</h2>
              <p className="text-xs text-slate-300">
                Client Master Database, GSTIN records, Place of Supply compliance, and billing ledgers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Add Client button */}
          <button
            onClick={handleOpenAdd}
            id="btn-add-client"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/25 active:scale-95 cursor-pointer border border-blue-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c183a]/90 via-[#0e214d]/90 to-[#071330]/90 border border-emerald-500/25 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Active Clients</p>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">{activeClientsCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c183a]/90 via-[#0e214d]/90 to-[#071330]/90 border border-amber-500/25 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Disabled Clients</p>
            <p className="text-lg font-bold text-amber-400 mt-0.5">{disabledClientsCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <XCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c183a]/90 via-[#0e214d]/90 to-[#071330]/90 border border-cyan-500/25 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">GST Registered</p>
            <p className="text-lg font-bold text-cyan-400 mt-0.5">{gstRegisteredCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Receipt className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c183a]/90 via-[#0e214d]/90 to-[#071330]/90 border border-blue-500/25 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Archived / Trash</p>
            <p className="text-lg font-bold text-slate-300 mt-0.5">{trashCount}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Container with Tabs, Search & Filters */}
      <div className="bg-gradient-to-b from-[#0a1533]/90 via-[#060e22]/90 to-[#040817]/90 border border-blue-500/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
        {/* Header Tabs: Active Directory vs Trash */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 pt-4 pb-3 border-b border-blue-500/20 gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTabFilter('active')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTabFilter === 'active'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 border border-blue-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>All Clients ({clients.filter(c => !c.isDeleted && c.status !== 'deleted').length})</span>
            </button>

            <button
              onClick={() => setActiveTabFilter('trash')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTabFilter === 'trash'
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trash ({trashCount})</span>
            </button>
          </div>

          {/* View Mode Toggle (Table / Grid) */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <div className="flex items-center bg-[#091129] border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-1.5 rounded-md text-xs transition-all ${
                  viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
                className={`p-1.5 rounded-md text-xs transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-700/80 bg-[#091129]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, contact, GSTIN, state, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#091129] border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091129] border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="disabled">Disabled Only</option>
            </select>
          </div>

          {/* State Filter */}
          <div className="lg:col-span-2">
            <select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091129] border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All States</option>
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* GST Filter */}
          <div className="lg:col-span-2">
            <select
              value={gstFilter}
              onChange={e => setGstFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#091129] border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
            >
              <option value="all">All GST Types</option>
              <option value="registered">Registered (GSTIN)</option>
              <option value="unregistered">Unregistered (—)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-[#091129] border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
            >
              <option value="name_asc">Company (A to Z)</option>
              <option value="name_desc">Company (Z to A)</option>
              <option value="billed_desc">Highest Billed</option>
              <option value="created_desc">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Content Area: Table vs Grid */}
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No Clients Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {activeTabFilter === 'trash'
                ? 'The trash bin is currently empty.'
                : 'No clients match your search criteria. You can create a new client profile or adjust your filters.'}
            </p>
            {activeTabFilter !== 'trash' && (
              <button
                onClick={handleOpenAdd}
                className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold inline-flex items-center space-x-2 transition-all shadow-md shadow-blue-500/25"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Client</span>
              </button>
            )}
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/80 bg-[#091129] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredClients.map(client => {
                  const clientState = client.state || client.billingAddress?.state || '—';
                  const clientStateCode = client.stateCode || client.billingAddress?.stateCode;
                  const contactName = client.contactPerson || client.name;
                  const hasContactInfo = Boolean(client.email || client.phone || (contactName && contactName !== client.companyName));
                  const isDeleted = client.isDeleted || client.status === 'deleted';
                  const isJPModatex = client.companyName.toLowerCase().includes('jp modatex');

                  return (
                    <tr 
                      key={client.id}
                      onClick={() => setViewingClient(client)}
                      className={`hover:bg-[#132252]/50 transition-colors cursor-pointer group ${
                        client.status === 'disabled' ? 'opacity-60 bg-[#091129]/30' : ''
                      } ${isJPModatex ? 'bg-blue-950/25' : ''}`}
                    >
                      {/* 1. Client Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            client.status === 'disabled'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : isJPModatex
                              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                              : 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40'
                          }`}>
                            {client.companyName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center space-x-1.5">
                              <span className="truncate">{client.companyName}</span>
                              {isJPModatex && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                  Primary
                                </span>
                              )}
                            </div>
                            {contactName && contactName !== client.companyName && (
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {contactName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. GSTIN Column */}
                      <td className="py-3.5 px-4">
                        {client.gstin && client.gstin.trim() !== '' ? (
                          <div className="flex items-center space-x-1.5 font-mono text-[11px] text-cyan-400 font-semibold">
                            <span>{client.gstin}</span>
                            <button
                              onClick={(e) => copyToClipboard(client.gstin!, `gst_${client.id}`, e)}
                              title="Copy GSTIN"
                              className="text-slate-500 hover:text-cyan-300 p-0.5 transition-colors cursor-pointer"
                            >
                              {copiedField === `gst_${client.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-semibold">—</span>
                        )}
                      </td>

                      {/* 3. State Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-300 font-medium">{clientState}</span>
                          {clientStateCode && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                              {clientStateCode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. Contact Column */}
                      <td className="py-3.5 px-4">
                        {hasContactInfo ? (
                          <div className="space-y-0.5 text-[11px] text-slate-300">
                            {client.email && (
                              <div className="flex items-center space-x-1 truncate max-w-[200px]">
                                <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                                <span className="truncate">{client.email}</span>
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center space-x-1 truncate">
                                <Phone className="w-3 h-3 text-blue-400 shrink-0" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 font-semibold">—</span>
                        )}
                      </td>

                      {/* 5. Status Column */}
                      <td className="py-3.5 px-4">
                        {isDeleted ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            Deleted
                          </span>
                        ) : (
                          <button
                            onClick={(e) => handleToggleStatus(client, e)}
                            title={`Click to ${client.status === 'active' ? 'Disable' : 'Activate'}`}
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                              client.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${client.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            <span className="capitalize">{client.status}</span>
                          </button>
                        )}
                      </td>

                      {/* 6. Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5" onClick={e => e.stopPropagation()}>
                          {isDeleted ? (
                            <>
                              <button
                                onClick={(e) => handleRestore(client, e)}
                                title="Restore Client"
                                className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Restore</span>
                              </button>
                              <button
                                onClick={(e) => handlePermanentDelete(client, e)}
                                title="Permanently Delete"
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setViewingClient(client)}
                                title="View Details"
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </button>

                              <button
                                onClick={() => handleOpenEdit(client)}
                                title="Edit Client Master"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={(e) => handleToggleStatus(client, e)}
                                title={client.status === 'active' ? 'Disable Client' : 'Enable Client'}
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  client.status === 'active'
                                    ? 'bg-slate-800 hover:bg-amber-500/30 text-slate-400 hover:text-amber-300 border-slate-700'
                                    : 'bg-slate-800 hover:bg-emerald-500/30 text-slate-400 hover:text-emerald-300 border-slate-700'
                                }`}
                              >
                                {client.status === 'active' ? (
                                  <XCircle className="w-3.5 h-3.5" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <button
                                onClick={(e) => handleSoftDelete(client, e)}
                                title="Move to Trash"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/30 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => {
              const isDeleted = client.isDeleted || client.status === 'deleted';
              const clientState = client.state || client.billingAddress?.state || '—';

              return (
                <div
                  key={client.id}
                  onClick={() => setViewingClient(client)}
                  className={`p-5 rounded-2xl bg-gradient-to-b from-[#111e47]/90 to-[#0a1330]/90 border border-slate-700/80 hover:border-blue-500/60 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group shadow-lg ${
                    client.status === 'disabled' ? 'opacity-60 bg-[#0a122e]' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                        {client.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isDeleted 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : client.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {isDeleted ? 'Deleted' : client.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-3 truncate group-hover:text-blue-400 transition-colors">
                      {client.companyName}
                    </h3>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {client.contactPerson || client.name}
                    </p>

                    <div className="mt-4 space-y-1.5 text-[11px] text-slate-300 border-t border-slate-700/80 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">State:</span>
                        <span className="text-slate-200 font-medium">{clientState}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">GSTIN:</span>
                        <span className="font-mono text-cyan-400 font-semibold">{client.gstin || '—'}</span>
                      </div>
                      {client.email && (
                        <div className="flex items-center space-x-1.5 truncate text-slate-300 pt-1">
                          <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-700/80 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Billed</span>
                    <span className="font-bold text-white">
                      ₹{(client.totalBilled || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-slate-700/80 bg-[#091129] flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
          <span>Showing {filteredClients.length} of {clients.length} clients</span>
          <span className="text-slate-400 font-medium">GSTIN verification enabled • SAC 998314 Compliance ready</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT CLIENT MASTER MODAL */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-[#111e47] to-[#0a122e] border border-slate-700/90 rounded-2xl w-full max-w-2xl p-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700/80 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingClient ? 'Edit Client Master Profile' : 'Add New Client Master'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter legal business information, GSTIN, place of supply, and contact coordinates.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveClient} className="space-y-5">
              {/* ========================================================= */}
              {/* SECTION 1: BILLED TO / LEGAL ENTITY & GST COMPLIANCE */}
              {/* ========================================================= */}
              <div className="p-4 rounded-xl bg-[#091129] border border-slate-700/80 space-y-3.5">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Billed To / Legal Entity & Compliance
                  </h4>
                </div>

                {/* Row 1: Company Name & Contact Person */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Company Name * <span className="text-slate-400 font-normal">(e.g. JP MODATEX LLP)</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Legal Entity Name"
                      value={form.companyName}
                      onChange={e => setForm({ ...form, companyName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Contact Person <span className="text-slate-400 font-normal">(Primary Liaison)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name (e.g. Manoj Satapathy)"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Official Email <span className="text-slate-400 font-normal">(Invoicing & Notices)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        placeholder="billing@company.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Phone Number <span className="text-slate-400 font-normal">(Mobile / Landline)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="+91 98765 00112"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Billing Address & City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Billing Address <span className="text-slate-400 font-normal">(Street / Premises)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Building, Street, Industrial Area..."
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Surat, Mumbai"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 4: GSTIN & Place of Supply (Auto-derived) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      GSTIN <span className="text-slate-400 font-normal">(Leave blank if URP)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="e.g. 24AABCA1234F1ZM"
                      value={form.gstin}
                      onChange={e => handleGstinChange(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-cyan-400 placeholder-slate-500 outline-none focus:border-blue-500 font-mono uppercase font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Place of Supply <span className="text-emerald-400 font-normal">(Auto-derived)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="e.g. 24-Gujarat"
                      value={form.placeOfSupply}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#060c1e] border border-slate-700/70 text-xs text-emerald-300 outline-none font-medium cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      PAN <span className="text-slate-400 font-normal">(Auto-extracted)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AABCA1234F"
                      value={form.pan}
                      onChange={e => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 font-mono uppercase"
                    />
                  </div>
                </div>

                {/* GSTIN Live Validation Badge */}
                <div className="px-3 py-1.5 rounded-lg bg-[#060e24] border border-slate-800 text-[11px] flex items-center space-x-2">
                  {gstValidation.isValid ? (
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Valid GSTIN • State: {form.state} (Code: {form.stateCode}) • Place of Supply: {form.placeOfSupply}</span>
                    </div>
                  ) : form.gstin.trim().length > 0 && form.gstin.trim().length < 15 ? (
                    <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>Auto-detected State: {form.state} ({form.stateCode}) • Entering GSTIN ({form.gstin.trim().length}/15 chars)</span>
                    </div>
                  ) : form.gstin.trim().length >= 15 && !gstValidation.isValid ? (
                    <div className="flex items-center space-x-1.5 text-rose-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Invalid GSTIN format or unrecognized State Code</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Info className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                      <span>Non-GST / Unregistered Person (URP) workflow active. State and Place of Supply derived from state selection.</span>
                    </div>
                  )}
                </div>

                {/* Row 5: State (Dropdown) & State Code & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Billing State / UT</label>
                    <select
                      value={form.state}
                      onChange={e => handleStateChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st.code} value={st.name}>
                          {st.name} ({st.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      State Code <span className="text-emerald-400 font-normal">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="e.g. 24"
                      value={form.stateCode}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#060c1e] border border-slate-700/70 text-xs text-cyan-300 outline-none font-mono font-bold cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 394230"
                      value={form.pincode}
                      onChange={e => setForm({ ...form, pincode: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 6: Account Status */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Account Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
                  >
                    <option value="active">Active (Permits Quotations & Invoices)</option>
                    <option value="disabled">Disabled (Archived / Inactive)</option>
                  </select>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 2: SHIPPED TO / DELIVERY DESTINATION */}
              {/* ========================================================= */}
              <div className="p-4 rounded-xl bg-[#091129] border border-slate-700/80 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Shipped To / Delivery Destination
                    </h4>
                  </div>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-cyan-300 cursor-pointer bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.sameAsBilling}
                      onChange={e => {
                        const same = e.target.checked;
                        setForm(prev => ({
                          ...prev,
                          sameAsBilling: same,
                          ...(same ? {
                            shippingName: prev.name || prev.companyName,
                            shippingCompany: prev.companyName,
                            shippingPhone: prev.phone,
                            shippingAddress: prev.address,
                            shippingCity: prev.city,
                            shippingState: prev.state,
                            shippingStateCode: prev.stateCode,
                            shippingPincode: prev.pincode,
                            shippingGstin: prev.gstin
                          } : {})
                        }));
                      }}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-400 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Shipped To Same as Billed To</span>
                  </label>
                </div>

                {form.sameAsBilling ? (
                  <div className="p-3 rounded-lg bg-[#060e24] border border-slate-800 text-xs text-slate-300 flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Shipping destination automatically mirrors legal billing address: <strong className="text-white">{form.companyName || 'Client'}</strong>, {form.city || form.address ? `${form.city || ''} (${form.state})` : form.state}.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-1">
                    {/* Different Shipping Address Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Shipping Attention / Recipient Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Gurdeep Singh (Logistics Manager)"
                          value={form.shippingName}
                          onChange={e => setForm({ ...form, shippingName: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Shipping Company / Unit / Hub Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ludhiana Hosiery Dispatch Centre"
                          value={form.shippingCompany}
                          onChange={e => setForm({ ...form, shippingCompany: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Shipping Contact Phone
                        </label>
                        <input
                          type="text"
                          placeholder="+91 98140 99887"
                          value={form.shippingPhone}
                          onChange={e => setForm({ ...form, shippingPhone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Shipping / Branch GSTIN <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          maxLength={15}
                          placeholder="e.g. 03AABCL5544K1Z8"
                          value={form.shippingGstin}
                          onChange={e => setForm({ ...form, shippingGstin: e.target.value.toUpperCase() })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-cyan-400 placeholder-slate-500 outline-none focus:border-blue-500 font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Shipping Address <span className="text-slate-400 font-normal">(Delivery Premises)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Warehouse #, Plot / Street, Industrial Phase..."
                          value={form.shippingAddress}
                          onChange={e => setForm({ ...form, shippingAddress: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Shipping City</label>
                        <input
                          type="text"
                          placeholder="e.g. Jalandhar, Pune"
                          value={form.shippingCity}
                          onChange={e => setForm({ ...form, shippingCity: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Shipping State</label>
                        <select
                          value={form.shippingState}
                          onChange={e => handleShippingStateChange(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white focus:border-blue-500 outline-none"
                        >
                          {INDIAN_STATES.map(st => (
                            <option key={st.code} value={st.name}>
                              {st.name} ({st.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Shipping State Code <span className="text-emerald-400 font-normal">(Auto)</span>
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={form.shippingStateCode}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#060c1e] border border-slate-700/70 text-xs text-cyan-300 outline-none font-mono font-bold cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Shipping Pincode</label>
                        <input
                          type="text"
                          placeholder="e.g. 144001"
                          value={form.shippingPincode}
                          onChange={e => setForm({ ...form, shippingPincode: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#0c1633] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Notes / Terms</label>
                <textarea
                  rows={2}
                  placeholder="Special client requirements, billing cycles, key contacts, or tax remarks..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#091129] border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white transition-all shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  {editingClient ? 'Save Changes' : 'Create Client Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 360° CLIENT MASTER VIEW MODAL */}
      {/* ========================================================================= */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-[#111e47] to-[#0a122e] border border-slate-700/90 rounded-2xl w-full max-w-3xl p-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-700/80 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-base">
                  {viewingClient.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{viewingClient.companyName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      viewingClient.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {viewingClient.status}
                    </span>
                    {viewingClient.gstin ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        GST Registered
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-700 text-slate-300">
                        URP (Non-GST)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Contact: <span className="text-slate-200 font-medium">{viewingClient.contactPerson || viewingClient.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    handleOpenEdit(viewingClient);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setViewingClient(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Client Master Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Box 1: Compliance & GST Info */}
              <div className="p-4 rounded-xl bg-[#091129] border border-slate-700/80 space-y-2.5">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Tax & Compliance</span>
                </h4>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">GSTIN:</span>
                    {viewingClient.gstin ? (
                      <span className="font-mono text-cyan-400 font-semibold">{viewingClient.gstin}</span>
                    ) : (
                      <span className="text-slate-500 font-semibold">— (URP)</span>
                    )}
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Place of Supply:</span>
                    <span className="text-emerald-300 font-medium">
                      {viewingClient.placeOfSupply || formatPlaceOfSupply(viewingClient.state || viewingClient.billingAddress?.state || '', viewingClient.stateCode)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">State & Code:</span>
                    <span className="text-slate-200 font-medium">
                      {viewingClient.state || viewingClient.billingAddress?.state || '—'} {viewingClient.stateCode ? `(${viewingClient.stateCode})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">PAN:</span>
                    <span className="font-mono text-slate-300">{viewingClient.pan || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Billed To Details */}
              <div className="p-4 rounded-xl bg-[#091129] border border-slate-700/80 space-y-2.5">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Billed To (Legal)</span>
                </h4>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-slate-200 truncate max-w-[130px]">{viewingClient.email || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Phone:</span>
                    <span className="text-slate-200">{viewingClient.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">City / Pin:</span>
                    <span className="text-slate-200">
                      {viewingClient.city || viewingClient.billingAddress?.city || '—'} {viewingClient.pincode || viewingClient.postalCode ? `- ${viewingClient.pincode || viewingClient.postalCode}` : ''}
                    </span>
                  </div>
                  <div className="py-1">
                    <span className="text-slate-400 block mb-0.5">Address:</span>
                    <p className="text-slate-300 text-[11px] line-clamp-2">
                      {viewingClient.address || viewingClient.billingAddress?.street || '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 3: Shipped To / Delivery Destination */}
              <div className="p-4 rounded-xl bg-[#091129] border border-slate-700/80 space-y-2.5">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Shipped To (Delivery)</span>
                </h4>

                {viewingClient.sameAsBilling !== false ? (
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Same as Billing Address</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1">
                      <p className="font-semibold text-white">{viewingClient.companyName}</p>
                      <p>{viewingClient.address || viewingClient.billingAddress?.street || '—'}</p>
                      <p>{viewingClient.city || viewingClient.billingAddress?.city || '—'}, {viewingClient.state || viewingClient.billingAddress?.state || '—'} - {viewingClient.pincode || viewingClient.postalCode || ''}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Recipient:</span>
                      <span className="text-slate-200 truncate max-w-[130px]">{viewingClient.shippingName || viewingClient.shippingCompany || '—'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Ship City/State:</span>
                      <span className="text-slate-200">{viewingClient.shippingCity || '—'}, {viewingClient.shippingState || '—'} ({viewingClient.shippingStateCode || '—'})</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Ship Pincode:</span>
                      <span className="text-slate-200">{viewingClient.shippingPincode || '—'}</span>
                    </div>
                    <div className="py-1">
                      <span className="text-slate-400 block mb-0.5">Ship Address:</span>
                      <p className="text-slate-300 text-[11px] line-clamp-2">
                        {viewingClient.shippingAddress || '—'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes if any */}
            {viewingClient.notes && (
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-slate-300 mb-6 flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Notes & Terms: </span>
                  <span>{viewingClient.notes}</span>
                </div>
              </div>
            )}

            {/* Linked Documents & Invoices */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Associated Financial Records ({clientInvoices.length} Invoices, {clientQuotations.length} Quotations)
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setViewingClient(null);
                      setActiveTab('quotations');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Quotation</span>
                  </button>
                  <button
                    onClick={() => {
                      setViewingClient(null);
                      setActiveTab('invoices');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </div>

              {/* Invoices List */}
              {clientInvoices.length > 0 ? (
                <div className="bg-[#091129] rounded-xl border border-slate-700/80 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#0c1633] text-[10px] font-semibold text-slate-400 uppercase border-b border-slate-700/80">
                        <th className="py-2 px-3">Invoice #</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Amount</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {clientInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-[#132252]/40">
                          <td className="py-2 px-3 font-mono text-blue-400 font-semibold">{inv.invoiceNumber}</td>
                          <td className="py-2 px-3 text-slate-400">{inv.issueDate}</td>
                          <td className="py-2 px-3 font-semibold text-white">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#091129] border border-slate-700/80 text-center text-xs text-slate-400">
                  No invoices created for this client yet.
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex justify-between items-center pt-5 mt-6 border-t border-slate-700/80">
              <button
                onClick={() => handleToggleStatus(viewingClient)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  viewingClient.status === 'active'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {viewingClient.status === 'active' ? 'Disable Account' : 'Activate Account'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSoftDelete(viewingClient)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Client</span>
                </button>
                <button
                  onClick={() => setViewingClient(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors border border-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE / SOFT-DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {deleteConfirmClient && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#111e47] to-[#0a122e] border border-slate-700/90 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white text-center">
              {deleteConfirmClient.isPermanent ? 'Permanently Delete Client?' : 'Move Client to Trash?'}
            </h3>
            <p className="text-xs text-slate-300 text-center mt-2 leading-relaxed">
              {deleteConfirmClient.isPermanent ? (
                <>
                  Are you sure you want to permanently erase <strong className="text-white">{deleteConfirmClient.client.companyName}</strong>? This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to disable and move <strong className="text-white">{deleteConfirmClient.client.companyName}</strong> to Trash? You can restore it anytime from the Trash tab.
                </>
              )}
            </p>

            <div className="flex items-center justify-center space-x-3 mt-6">
              <button
                onClick={() => setDeleteConfirmClient(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-xs font-semibold text-white transition-all shadow-md shadow-rose-600/25 cursor-pointer"
              >
                {deleteConfirmClient.isPermanent ? 'Delete Forever' : 'Move to Trash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
