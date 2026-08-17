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
  Sparkles,
  Bot,
  ShoppingBag
} from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { ClientsManager } from './ClientsManager';
import { QuotationsManager } from './QuotationsManager';
import { InvoicesManager } from './InvoicesManager';
import { PaymentsManager } from './PaymentsManager';
import { AccountingManager } from './AccountingManager';
import { PurchasesSection } from './accounting/PurchasesSection';
import { ExpensesSection } from './accounting/ExpensesSection';
import { SalarySection } from './accounting/SalarySection';
import { EnquiriesManager } from './EnquiriesManager';
import { ServicesManager } from './ServicesManager';
import { ProjectsManager } from './ProjectsManager';
import { TechnologiesManager } from './TechnologiesManager';
import { TestimonialsManager } from './TestimonialsManager';
import { FaqsManager } from './FaqsManager';
import { ChatbotManager } from './ChatbotManager';
import { UsersManager } from './UsersManager';
import { SupabaseArchitecture } from './SupabaseArchitecture';
import { SettingsManager } from './SettingsManager';
import { AdminClockWidget } from './AdminClockWidget';
import { LeadBuzzerAlertModal } from './LeadBuzzerAlertModal';
import { UserRole } from '../../types';
import { BrandLogo } from '../BrandLogo';
import { SupabaseStatusBanner } from '../common/SupabaseStatusBanner';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { AuthGuard } from '../common/AuthGuard';
import { useToast } from '../../context/ToastContext';
import { Volume2, VolumeX } from 'lucide-react';

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
    dbConnected,
    isBuzzerMuted,
    toggleBuzzerMute,
    testBuzzerSound
  } = useApp();

  const { info } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const newLeads = enquiries.filter(e => e.status === 'new');
  const newLeadsCount = newLeads.length;

  const { roles, checkPermission } = useApp();

  // Categorized Navigation Items with granular RBAC permissions mapping
  const navSections = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, perm: 'module.dashboard' },
        { id: 'enquiries', label: 'Lead Enquiries', icon: MessageSquare, badge: newLeadsCount, perm: 'module.enquiries' },
        { id: 'clients', label: 'Client Accounts', icon: Users, perm: 'module.clients' }
      ]
    },
    {
      title: 'Financials & GST',
      items: [
        { id: 'accounting', label: 'Financials & P&L', icon: Calculator, perm: 'module.accounting' },
        { id: 'invoices', label: 'Tax Invoices', icon: Receipt, perm: 'module.invoices' },
        { id: 'quotations', label: 'Quotations & Scopes', icon: FileText, perm: 'module.quotations' },
        { id: 'payments', label: 'Payment Receipts', icon: CreditCard, perm: 'module.payments' },
        { id: 'purchases', label: 'Purchases & Bills', icon: ShoppingBag, perm: 'module.purchases' },
        { id: 'expenses', label: 'Operating Expenses', icon: CreditCard, perm: 'module.expenses' },
        { id: 'salary', label: 'Staff & Payroll', icon: Users, perm: 'module.salary' }
      ]
    },
    {
      title: 'Content & CMS',
      items: [
        { id: 'services', label: 'Services Catalog', icon: Boxes, perm: 'module.services' },
        { id: 'projects', label: 'Project Portfolio', icon: FolderKanban, perm: 'module.projects' },
        { id: 'technologies', label: 'Technology Stack', icon: Cpu, perm: 'module.technologies' },
        { id: 'testimonials', label: 'Client Reviews', icon: MessageSquareQuote, perm: 'module.testimonials' },
        { id: 'faqs', label: 'Knowledge Base & FAQs', icon: HelpCircle, perm: 'module.faqs' },
        { id: 'chatbot', label: 'Chatbot & Q&A Base', icon: Bot, perm: 'module.chatbot' }
      ]
    },
    {
      title: 'System & Governance',
      items: [
        { id: 'users', label: 'Users & Roles', icon: ShieldCheck, perm: 'module.users' },
        { id: 'settings', label: 'Agency Settings', icon: Settings, perm: 'module.settings' },
        { id: 'database', label: 'Supabase & RLS', icon: Database, perm: 'module.database' }
      ]
    }
  ];

  // Permitted items based on checkPermission
  const allowedNavItems = navSections.flatMap(s => s.items).filter(item => checkPermission ? checkPermission(item.perm) : true);
  const allowedTabs = allowedNavItems.map(item => item.id);

  // Auto-switch to dashboard or first allowed tab if current activeTab is not permitted for the role
  const effectiveActiveTab = allowedTabs.includes(activeTab) ? activeTab : (allowedTabs[0] || 'dashboard');

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
      (checkPermission ? checkPermission(item.perm) : true) &&
      (searchQuery === '' || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040817] via-[#08122c] to-[#0c1a3b] text-slate-100 flex flex-col md:flex-row antialiased relative">
      {/* Realtime Incoming Lead Enquiry Buzzer & Alert Notification */}
      <LeadBuzzerAlertModal />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#081026] via-[#0b1738] to-[#050b1a] border-r border-blue-500/20 shadow-2xl flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div className="p-4 border-b border-blue-500/20 flex items-center justify-between bg-gradient-to-r from-[#081026]/95 via-[#0d1c44]/95 to-[#081026]/95 backdrop-blur-md">
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
              <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick navigate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0d193d] to-[#09122c] border border-blue-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-[10px]"
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
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40 font-bold' 
                          : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-[#11204d]/80 hover:to-[#0c1738]/80'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full shadow-sm ${
                          isActive ? 'bg-white text-blue-900' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
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
          <div className="p-3 border-t border-blue-500/20 bg-gradient-to-b from-[#08112b] to-[#040817] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
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
                  className="p-1.5 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700 shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentView('public');
                    info('Logged Out', 'Returned to public website preview.');
                  }}
                  title="Logout"
                  className="p-1.5 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 hover:from-rose-950 hover:to-rose-900 text-slate-400 hover:text-rose-300 transition-all cursor-pointer border border-slate-700 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div className="pt-1.5 border-t border-blue-500/20">
              <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Active Permission Role
              </label>
              <select
                value={currentUser.role}
                onChange={e => switchRole(e.target.value as UserRole)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0e1b40] to-[#0a1430] border border-blue-500/30 text-[11px] text-slate-200 outline-none cursor-pointer font-medium hover:border-cyan-400 transition-colors shadow-inner capitalize"
              >
                {roles && roles.length > 0 ? (
                  roles.map(r => (
                    <option key={r.id} value={r.code}>
                      Role: {r.name} {r.code === 'super_admin' ? '(Super Admin)' : ''}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="super_admin">Role: Super Admin (Full Control)</option>
                    <option value="admin">Role: Admin (Operations & Financials)</option>
                    <option value="editor">Role: Editor (Content & Showcase)</option>
                    <option value="accountant">Role: Accountant (Financials Only)</option>
                    <option value="staff">Role: Staff (Operational Duties)</option>
                    <option value="project_manager">Role: Project Manager</option>
                    <option value="client">Role: Client (Customer Portal)</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-gradient-to-r from-[#081026]/95 via-[#0d1c44]/95 to-[#081026]/95 border-b border-blue-500/20 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
              <span className="text-white font-bold tracking-tight bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                {getTabLabel(effectiveActiveTab)}
              </span>
            </div>
          </div>

          {/* Center / Date & Time Monospace Capsule Widget */}
          <div className="hidden md:flex items-center justify-center">
            <AdminClockWidget />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Clock display */}
            <div className="md:hidden">
              <AdminClockWidget />
            </div>

            {/* Quick Public Switch */}
            <button
              onClick={() => setCurrentView('public')}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-200 hover:text-white text-xs font-semibold transition-all border border-slate-700 shadow-sm cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>

            {/* Buzzer Sound Quick Toggle & Test */}
            <div className="relative flex items-center bg-slate-900/90 border border-blue-500/25 rounded-xl p-0.5 shadow-sm">
              <button
                onClick={toggleBuzzerMute}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1 ${
                  isBuzzerMuted 
                    ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/20' 
                    : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20'
                }`}
                title={isBuzzerMuted ? 'Lead Alert Buzzer: MUTED (Click to Unmute)' : 'Lead Alert Buzzer: ACTIVE (Click to Mute)'}
              >
                {isBuzzerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider">
                  {isBuzzerMuted ? 'Muted' : 'Buzzer'}
                </span>
              </button>
              <button
                onClick={() => {
                  testBuzzerSound();
                  info('🔔 Buzzer sound test triggered');
                }}
                className="hidden xl:inline-flex px-1.5 py-0.5 text-[9px] font-mono text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer border-l border-slate-800"
                title="Test Buzzer Chime"
              >
                Test
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-sm transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {newLeadsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse shadow-xs">
                    {newLeadsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-[#0f1d47] to-[#081028] border border-blue-500/30 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
                    <span className="text-xs font-bold text-white">Lead Notifications</span>
                    <span className="text-[10px] text-cyan-400 font-semibold">{newLeadsCount} new</span>
                  </div>
                  <div className="py-2 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {newLeads.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">No unread lead enquiries.</p>
                    ) : (
                      newLeads.map(lead => (
                        <div
                          key={lead.id}
                          onClick={() => {
                            setActiveTab('enquiries');
                            setShowNotifications(false);
                          }}
                          className="p-2 rounded-xl bg-gradient-to-r from-[#12214c] to-[#0d1838] hover:from-[#182c66] hover:to-[#12224e] border border-blue-500/20 text-xs cursor-pointer transition-all space-y-0.5 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white truncate">{lead.name}</span>
                            <span className="text-[10px] text-cyan-400 font-bold">New</span>
                          </div>
                          <p className="text-[11px] text-slate-300 truncate">{lead.company || lead.email}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Chip */}
            <div className="flex items-center space-x-2 pl-2 border-l border-blue-500/20">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-md">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-cyan-400 capitalize font-medium">{currentUser.role.replace('_', ' ')}</div>
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
            {effectiveActiveTab === 'purchases' && <PurchasesSection />}
            {effectiveActiveTab === 'expenses' && <ExpensesSection />}
            {effectiveActiveTab === 'salary' && <SalarySection />}
            {effectiveActiveTab === 'accounting' && <AccountingManager />}
            {effectiveActiveTab === 'services' && <ServicesManager />}
            {effectiveActiveTab === 'projects' && <ProjectsManager />}
            {effectiveActiveTab === 'technologies' && <TechnologiesManager />}
            {effectiveActiveTab === 'testimonials' && <TestimonialsManager />}
            {effectiveActiveTab === 'faqs' && <FaqsManager />}
            {effectiveActiveTab === 'chatbot' && <ChatbotManager />}
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
