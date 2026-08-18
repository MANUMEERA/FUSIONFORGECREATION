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
import { LegalDocsManager } from './LegalDocsManager';
import { VisitorMonitor } from './VisitorMonitor';
import { AdminClockWidget } from './AdminClockWidget';
import { LeadBuzzerAlertModal } from './LeadBuzzerAlertModal';
import { NotificationCenter } from './notifications/NotificationCenter';
import { EmailLogsManager } from './notifications/EmailLogsManager';
import { UserRole } from '../../types';
import { BrandLogo } from '../BrandLogo';
import { SupabaseStatusBanner } from '../common/SupabaseStatusBanner';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { AuthGuard } from '../common/AuthGuard';
import { SupabaseAuthModal } from './SupabaseAuthModal';
import { useToast } from '../../context/ToastContext';
import { Volume2, VolumeX, Mail, Scale, Activity } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    activeTab, 
    setActiveTab, 
    setCurrentView,
    isAuthenticated,
    logout,
    enquiries,
    notifications,
    unreadNotificationsCount,
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
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);

  // Strict Auth Protection Gate
  if (!isAuthenticated || currentUser?.role === 'client') {
    return (
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1B2E] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-[#E8E0F0] rounded-3xl w-full max-w-md p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#F3E8FF] border border-[#C084FC]/50 flex items-center justify-center text-[#8E2D9D] mx-auto shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E1B2E]">Super Admin & Staff Panel</h2>
            <p className="text-xs text-[#5F5A72] mt-2 leading-relaxed">
              Authentication Required. You must sign in with an authorized administrative account to access system operations.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => setShowAuthGateModal(true)}
              className="w-full py-3 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate with Supabase</span>
            </button>
            <button
              onClick={() => setCurrentView('public')}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-[#FAF5FF] border border-[#E8E0F0] text-[#5F5A72] hover:text-[#1E1B2E] text-xs font-semibold transition-all cursor-pointer"
            >
              Return to Public Website
            </button>
          </div>
        </div>
        <SupabaseAuthModal 
          isOpen={showAuthGateModal} 
          onClose={() => setShowAuthGateModal(false)} 
        />
      </div>
    );
  }

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
        { id: 'legal_docs', label: 'Legal & Compliance', icon: Scale, perm: 'module.documents' },
        { id: 'visitor_monitoring', label: 'Visitor Monitoring', icon: Activity, perm: 'module.visitor_monitoring' },
        { id: 'email_logs', label: 'Email Dispatch Logs', icon: Mail, perm: 'module.settings' },
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
    <div className="min-h-screen bg-[#FAF8FF] text-[#1E1B2E] flex flex-col md:flex-row antialiased relative">
      {/* Realtime Incoming Lead Enquiry Buzzer & Alert Notification */}
      <LeadBuzzerAlertModal />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E8E0F0] shadow-sm flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div className="p-4 border-b border-[#E8E0F0] flex items-center justify-between bg-white">
            <BrandLogo size="sm" variant="full" theme="light" showTagline={false} />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-[#F3E8FF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Sidebar Filter Input */}
          <div className="px-3 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#817B91] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick navigate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder-[#817B91] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#817B91] hover:text-[#1E1B2E] text-[10px]"
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
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#817B91]">
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
                          ? 'bg-[#8E2D9D] text-white shadow-sm font-bold' 
                          : 'text-[#5F5A72] hover:text-[#6F42C1] hover:bg-[#F3E8FF]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#817B91]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                          isActive ? 'bg-white text-[#8E2D9D]' : 'bg-[#F3E8FF] text-[#6F42C1] border border-[#E8E0F0]'
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
          <div className="p-3 border-t border-[#E8E0F0] bg-[#FAF5FF] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-8 h-8 rounded-xl bg-[#8E2D9D] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="truncate max-w-[120px]">
                  <div className="text-xs font-bold text-[#1E1B2E] truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-[#6F42C1] uppercase font-semibold">{currentUser.role.replace('_', ' ')}</div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentView('public')}
                  title="View Public Website"
                  className="p-1.5 rounded-lg bg-white hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#6F42C1] transition-all cursor-pointer border border-[#E8E0F0] shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    info('Logged Out', 'Signed out from administrative session.');
                  }}
                  title="Logout"
                  className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-[#817B91] hover:text-rose-600 transition-all cursor-pointer border border-[#E8E0F0] shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div className="pt-1.5 border-t border-[#E8E0F0]">
              <label className="text-[9px] uppercase tracking-wider text-[#817B91] font-bold block mb-1">
                Active Permission Role
              </label>
              <select
                value={currentUser.role}
                onChange={e => switchRole(e.target.value as UserRole)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#E8E0F0] text-[11px] text-[#1E1B2E] outline-none cursor-pointer font-medium hover:border-[#8E2D9D] focus:border-[#8E2D9D] transition-colors capitalize"
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
        <header className="h-16 bg-white border-b border-[#E8E0F0] px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#F3E8FF] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#817B91] font-medium hidden sm:inline">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#817B91] hidden sm:inline" />
              <span className="text-[#8E2D9D] font-bold tracking-tight bg-[#F3E8FF] border border-[#E8E0F0] px-2.5 py-1 rounded-lg">
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
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#6F42C1] text-xs font-semibold transition-all border border-[#E8E0F0] shadow-xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#8E2D9D]" />
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-[#817B91]" />
            </button>

            {/* Buzzer Sound Quick Toggle & Test */}
            <div className="relative flex items-center bg-white border border-[#E8E0F0] rounded-xl p-0.5 shadow-xs">
              <button
                onClick={toggleBuzzerMute}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center space-x-1 ${
                  isBuzzerMuted 
                    ? 'text-rose-600 hover:bg-rose-50' 
                    : 'text-[#8E2D9D] hover:bg-[#F3E8FF]'
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
                className="hidden xl:inline-flex px-1.5 py-0.5 text-[9px] font-mono text-[#817B91] hover:text-[#1E1B2E] hover:bg-[#F3E8FF] rounded transition-colors cursor-pointer border-l border-[#E8E0F0]"
                title="Test Buzzer Chime"
              >
                Test
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-white hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#6F42C1] border border-[#E8E0F0] shadow-xs transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#8E2D9D] text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95">
                  <NotificationCenter onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>

            {/* User Avatar Chip */}
            <div className="flex items-center space-x-2 pl-2 border-l border-[#E8E0F0]">
              <div className="w-8 h-8 rounded-xl bg-[#8E2D9D] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-[#1E1B2E] leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-[#6F42C1] capitalize font-medium">{currentUser.role.replace('_', ' ')}</div>
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
            {effectiveActiveTab === 'legal_docs' && (
              <AuthGuard userRole={currentUser.role} allowedRoles={['super_admin']}>
                <LegalDocsManager />
              </AuthGuard>
            )}
            {effectiveActiveTab === 'visitor_monitoring' && (
              <AuthGuard userRole={currentUser.role} allowedRoles={['super_admin']}>
                <VisitorMonitor />
              </AuthGuard>
            )}
            {effectiveActiveTab === 'email_logs' && (
              <AuthGuard userRole={currentUser.role} allowedRoles={['super_admin', 'admin', 'accountant']}>
                <EmailLogsManager />
              </AuthGuard>
            )}
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
