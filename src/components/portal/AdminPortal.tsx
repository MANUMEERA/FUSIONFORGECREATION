import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Receipt, 
  CreditCard, 
  Calculator, 
  MessageSquare, 
  Boxes, 
  FolderKanban, 
  Cpu, 
  MessageSquareQuote, 
  HelpCircle, 
  ShieldCheck, 
  Settings, 
  Globe, 
  LogOut,
  Database,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  ExternalLink,
  Plus,
  Layers,
  Sparkles
} from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { ClientsManager } from './ClientsManager';
import { QuotationsManager } from './QuotationsManager';
import { InvoicesManager } from './InvoicesManager';
import { PaymentsManager } from './PaymentsManager';
import { AccountingManager } from './AccountingManager';
import { EnquiriesManager } from './EnquiriesManager';
import { ServicesManager } from './ServicesManager';
import { ProjectsManager } from './ProjectsManager';
import { TechnologiesManager } from './TechnologiesManager';
import { TestimonialsManager } from './TestimonialsManager';
import { FaqsManager } from './FaqsManager';
import { UsersManager } from './UsersManager';
import { SupabaseArchitecture } from './SupabaseArchitecture';
import { SettingsManager } from './SettingsManager';
import { UserRole } from '../../types';
import { BrandLogo } from '../BrandLogo';
import { SupabaseStatusBanner } from '../common/SupabaseStatusBanner';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { AuthGuard } from '../common/AuthGuard';
import { useToast } from '../../context/ToastContext';

export const AdminPortal: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    activeTab, 
    setActiveTab, 
    setCurrentView,
    enquiries,
    lastSyncedAt,
    syncFromDatabase,
    dbConnected
  } = useApp();

  const { info } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const newLeads = enquiries.filter(e => e.status === 'new');
  const newLeadsCount = newLeads.length;

  // RBAC Permission Map
  const roleAllowedTabs: Record<UserRole, string[]> = {
    super_admin: ['dashboard', 'enquiries', 'clients', 'quotations', 'invoices', 'payments', 'accounting', 'services', 'projects', 'technologies', 'testimonials', 'faqs', 'users', 'settings', 'database'],
    admin: ['dashboard', 'enquiries', 'clients', 'quotations', 'invoices', 'payments', 'accounting', 'services', 'projects', 'technologies', 'testimonials', 'faqs', 'settings', 'database'],
    editor: ['dashboard', 'enquiries', 'services', 'projects', 'technologies', 'testimonials', 'faqs', 'database'],
    accountant: ['dashboard', 'clients', 'invoices', 'payments', 'accounting', 'database'],
    staff: ['dashboard', 'enquiries', 'quotations', 'invoices', 'projects', 'faqs', 'database'],
    project_manager: ['dashboard', 'enquiries', 'clients', 'quotations', 'invoices', 'projects', 'technologies', 'database'],
    client: ['dashboard', 'quotations', 'invoices', 'payments']
  };

  const allowedTabs = roleAllowedTabs[currentUser.role] || ['dashboard'];

  // Categorized Navigation Items
  const navSections = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'enquiries', label: 'Lead Enquiries', icon: MessageSquare, badge: newLeadsCount },
        { id: 'clients', label: 'Client Accounts', icon: Users }
      ]
    },
    {
      title: 'Financials & GST',
      items: [
        { id: 'quotations', label: 'Quotations & Scopes', icon: FileText },
        { id: 'invoices', label: 'Tax Invoices', icon: Receipt },
        { id: 'payments', label: 'Payment Receipts', icon: CreditCard },
        { id: 'accounting', label: 'GST & Accounting', icon: Calculator }
      ]
    },
    {
      title: 'Content & CMS',
      items: [
        { id: 'services', label: 'Services Catalog', icon: Boxes },
        { id: 'projects', label: 'Project Portfolio', icon: FolderKanban },
        { id: 'technologies', label: 'Technology Stack', icon: Cpu },
        { id: 'testimonials', label: 'Client Reviews', icon: MessageSquareQuote },
        { id: 'faqs', label: 'Knowledge Base & FAQs', icon: HelpCircle }
      ]
    },
    {
      title: 'System & Governance',
      items: [
        { id: 'users', label: 'Users & Roles', icon: ShieldCheck },
        { id: 'settings', label: 'Agency Settings', icon: Settings },
        { id: 'database', label: 'Supabase & RLS', icon: Database }
      ]
    }
  ];

  // Auto-switch to dashboard or first allowed tab if current activeTab is not permitted for the role
  const effectiveActiveTab = allowedTabs.includes(activeTab) ? activeTab : 'dashboard';

  // Get active tab label for breadcrumbs
  const getTabLabel = (id: string) => {
    for (const section of navSections) {
      const found = section.items.find(item => item.id === id);
      if (found) return found.label;
    }
    return 'Dashboard';
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const filteredSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      allowedTabs.includes(item.id) &&
      (searchQuery === '' || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b1220] border-r border-slate-800/80 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <BrandLogo size="sm" variant="full" theme="dark" showTagline={false} />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Sidebar Filter Input */}
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick navigate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-[10px]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links Scrollable */}
          <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto custom-scrollbar">
            {filteredSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {section.title}
                </div>
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = effectiveActiveTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                          isActive ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile & Role Switcher */}
          <div className="p-3 border-t border-slate-800/80 bg-[#080d18]/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate max-w-[120px]">
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-cyan-400 uppercase font-semibold">{currentUser.role.replace('_', ' ')}</div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentView('public')}
                  title="View Public Website"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentView('public');
                    info('Logged Out', 'Returned to public website preview.');
                  }}
                  title="Logout"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div className="pt-1.5 border-t border-slate-800/60">
              <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                Active Permission Role
              </label>
              <select
                value={currentUser.role}
                onChange={e => switchRole(e.target.value as UserRole)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] text-slate-200 outline-none cursor-pointer font-medium hover:border-blue-500 transition-colors"
              >
                <option value="super_admin">Role: Super Admin (Full Control)</option>
                <option value="admin">Role: Admin (Operations & Financials)</option>
                <option value="editor">Role: Editor (Content & Showcase)</option>
                <option value="accountant">Role: Accountant (Financials Only)</option>
                <option value="staff">Role: Staff (Operational Duties)</option>
                <option value="project_manager">Role: Project Manager</option>
                <option value="client">Role: Client (Customer Portal)</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-[#090f1d]/90 border-b border-slate-800/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-medium hidden sm:inline">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
              <span className="text-white font-bold tracking-tight">
                {getTabLabel(effectiveActiveTab)}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick Public Switch */}
            <button
              onClick={() => setCurrentView('public')}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700/60 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {newLeadsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                    {newLeadsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0b1324] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">Lead Notifications</span>
                    <span className="text-[10px] text-blue-400 font-semibold">{newLeadsCount} new</span>
                  </div>
                  <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                    {newLeads.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">No unread lead enquiries.</p>
                    ) : (
                      newLeads.map(lead => (
                        <div
                          key={lead.id}
                          onClick={() => {
                            setActiveTab('enquiries');
                            setShowNotifications(false);
                          }}
                          className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 text-xs cursor-pointer transition-all space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white truncate">{lead.name}</span>
                            <span className="text-[10px] text-blue-400 font-bold">New</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{lead.company || lead.email}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Chip */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{currentUser.role.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] space-y-6">
          {/* Top Database Status Banner */}
          <SupabaseStatusBanner 
            lastSyncedAt={lastSyncedAt} 
            onManualSync={syncFromDatabase} 
          />

          <ErrorBoundary fallbackTitle="Admin Module Error">
            {effectiveActiveTab === 'dashboard' && <DashboardOverview />}
            {effectiveActiveTab === 'enquiries' && <EnquiriesManager />}
            {effectiveActiveTab === 'clients' && <ClientsManager />}
            {effectiveActiveTab === 'quotations' && <QuotationsManager />}
            {effectiveActiveTab === 'invoices' && <InvoicesManager />}
            {effectiveActiveTab === 'payments' && <PaymentsManager />}
            {effectiveActiveTab === 'accounting' && <AccountingManager />}
            {effectiveActiveTab === 'services' && <ServicesManager />}
            {effectiveActiveTab === 'projects' && <ProjectsManager />}
            {effectiveActiveTab === 'technologies' && <TechnologiesManager />}
            {effectiveActiveTab === 'testimonials' && <TestimonialsManager />}
            {effectiveActiveTab === 'faqs' && <FaqsManager />}
            {effectiveActiveTab === 'users' && (
              <AuthGuard userRole={currentUser.role} allowedRoles={['super_admin']}>
                <UsersManager />
              </AuthGuard>
            )}
            {effectiveActiveTab === 'settings' && (
              <AuthGuard userRole={currentUser.role} allowedRoles={['super_admin', 'admin']}>
                <SettingsManager />
              </AuthGuard>
            )}
            {effectiveActiveTab === 'database' && <SupabaseArchitecture />}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
