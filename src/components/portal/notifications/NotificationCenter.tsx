import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { AppNotification, NotificationCategory, NotificationPriority } from '../../../types';
import { filterNotificationsByRole } from '../../../utils/notificationEngine';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Filter, 
  Check, 
  Clock, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  X,
  Search,
  MessageSquare,
  Receipt,
  FileText,
  CreditCard,
  FolderKanban,
  ShieldCheck,
  Calculator,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

interface NotificationCenterProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, isModal = false }) => {
  const { 
    notifications, 
    currentUser, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification, 
    clearAllNotifications,
    setActiveTab,
    unreadNotificationsCount,
    triggerSimulatedLeadAlert,
    addNotification
  } = useApp();

  const { success, info } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterReadStatus, setFilterReadStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Role-filtered notifications
  const userNotifications = useMemo(() => {
    return filterNotificationsByRole(notifications, currentUser);
  }, [notifications, currentUser]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return userNotifications.filter(n => {
      // Category filter
      if (selectedCategory !== 'all' && n.category !== selectedCategory) {
        return false;
      }
      // Read/Unread filter
      if (filterReadStatus === 'unread' && n.is_read) return false;
      if (filterReadStatus === 'read' && !n.is_read) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = n.title.toLowerCase().includes(q);
        const msgMatch = n.message.toLowerCase().includes(q);
        const typeMatch = n.type.toLowerCase().includes(q);
        return titleMatch || msgMatch || typeMatch;
      }
      return true;
    });
  }, [userNotifications, selectedCategory, filterReadStatus, searchQuery]);

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.is_read) {
      markNotificationRead(notif.id);
    }
    if (notif.link) {
      setActiveTab(notif.link);
      if (onClose) onClose();
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    success('Notifications Updated', 'All notifications marked as read.');
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications? This will delete all notifications permanently.')) {
      clearAllNotifications();
      info('Notifications Cleared', 'All notifications have been removed.');
    }
  };

  const formatTimeAgo = (isoDate: string) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return `${diffDay}d ago`;
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">URGENT</span>;
      case 'high':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">HIGH</span>;
      case 'low':
        return <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-slate-500/20 text-slate-400 border border-slate-500/30">LOW</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'leads':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'financials':
        return <Receipt className="w-4 h-4 text-cyan-400" />;
      case 'projects':
        return <FolderKanban className="w-4 h-4 text-purple-400" />;
      case 'users':
        return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'accounting':
        return <Calculator className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  // Quick simulation triggers for testing
  const triggerSampleTest = (type: string) => {
    switch (type) {
      case 'lead':
        triggerSimulatedLeadAlert();
        success('Simulated Lead Generated', 'New incoming project enquiry generated with sound alert.');
        break;
      case 'invoice':
        addNotification({
          type: 'invoice_sent',
          category: 'financials',
          title: '📧 Tax Invoice Dispatched',
          message: 'Tax Invoice FFC-2026-0042 dispatched to client accounts team via verified SMTP relay.',
          link: 'invoices',
          priority: 'normal',
          metadata: { invoiceNumber: 'FFC-2026-0042', client: 'Apex Tech' }
        });
        success('Invoice Notification Dispatched', 'Sample invoice notification generated.');
        break;
      case 'payment':
        addNotification({
          type: 'payment_received',
          category: 'financials',
          title: '💰 Direct NEFT Settlement Confirmed',
          message: 'Received ₹1,45,000 via NEFT settlement for Invoice FFC-2026-0038. Payment receipt generated.',
          link: 'payments',
          priority: 'high',
          metadata: { amount: 145000, method: 'NEFT' }
        });
        success('Payment Notification Dispatched', 'Sample payment receipt notification generated.');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex flex-col ${isModal ? 'h-full max-h-[85vh]' : 'w-96 max-h-[580px]'} bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl overflow-hidden text-[#1E1B2E]`}>
      {/* Header */}
      <div className="p-4 border-b border-[#E8E0F0] bg-[#FAF5FF] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#F3E8FF] border border-[#E8E0F0] text-[#8E2D9D]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-[#1E1B2E] tracking-tight">Notification Center</h3>
              {unreadNotificationsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#8E2D9D] text-white">
                  {unreadNotificationsCount} unread
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#5F5A72]">Central Supabase Event Stream</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {unreadNotificationsCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-[#5F5A72] hover:text-[#8E2D9D] hover:bg-[#F3E8FF] transition-colors text-xs flex items-center space-x-1 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-[#8E2D9D]" />
            </button>
          )}
          {userNotifications.length > 0 && (
            <button
              onClick={handleClearAll}
              title="Clear all notifications"
              className="p-1.5 rounded-lg text-[#817B91] hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#817B91] hover:text-[#1E1B2E] hover:bg-[#F3E8FF] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-3 border-b border-[#E8E0F0] bg-white space-y-2 shrink-0">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#817B91] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder-[#817B91] focus:outline-none focus:border-[#8E2D9D] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#817B91] hover:text-[#1E1B2E] text-[10px]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto custom-scrollbar pb-1 text-[11px]">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all' 
                ? 'bg-[#8E2D9D] text-white' 
                : 'bg-[#FAF5FF] text-[#5F5A72] hover:bg-[#F3E8FF] hover:text-[#8E2D9D] border border-[#E8E0F0]'
            }`}
          >
            All ({userNotifications.length})
          </button>
          <button
            onClick={() => setSelectedCategory('leads')}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'leads' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#FAF5FF] text-[#5F5A72] hover:bg-[#F3E8FF] hover:text-emerald-600 border border-[#E8E0F0]'
            }`}
          >
            Leads
          </button>
          <button
            onClick={() => setSelectedCategory('financials')}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'financials' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-[#FAF5FF] text-[#5F5A72] hover:bg-[#F3E8FF] hover:text-cyan-600 border border-[#E8E0F0]'
            }`}
          >
            Financials
          </button>
          <button
            onClick={() => setSelectedCategory('projects')}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'projects' 
                ? 'bg-[#6F42C1] text-white' 
                : 'bg-[#FAF5FF] text-[#5F5A72] hover:bg-[#F3E8FF] hover:text-[#6F42C1] border border-[#E8E0F0]'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setSelectedCategory('users')}
            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'users' 
                ? 'bg-[#8E2D9D] text-white' 
                : 'bg-[#FAF5FF] text-[#5F5A72] hover:bg-[#F3E8FF] hover:text-[#8E2D9D] border border-[#E8E0F0]'
            }`}
          >
            Users
          </button>
        </div>

        {/* Read / Unread toggle */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilterReadStatus('all')}
              className={`px-2 py-0.5 rounded-md ${filterReadStatus === 'all' ? 'text-[#8E2D9D] font-bold bg-[#F3E8FF]' : 'text-[#5F5A72] hover:text-[#1E1B2E]'}`}
            >
              All Status
            </button>
            <span className="text-[#817B91]">•</span>
            <button
              onClick={() => setFilterReadStatus('unread')}
              className={`px-2 py-0.5 rounded-md ${filterReadStatus === 'unread' ? 'text-[#8E2D9D] font-bold bg-[#F3E8FF]' : 'text-[#5F5A72] hover:text-[#1E1B2E]'}`}
            >
              Unread only
            </button>
          </div>
          
          <span className="text-[10px] text-[#817B91]">
            Showing {filteredNotifications.length} items
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar min-h-[220px]">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#817B91] flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6 text-[#817B91]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1E1B2E]">No notifications found</p>
              <p className="text-[11px] text-[#817B91] max-w-[200px] mx-auto mt-1">
                {searchQuery ? 'Try clearing your search query.' : 'New activity alerts will appear here in real time.'}
              </p>
            </div>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                  notif.is_read 
                    ? 'bg-white hover:bg-[#FAF5FF] border-[#E8E0F0] text-[#5F5A72]' 
                    : 'bg-[#FAF5FF] hover:bg-[#F3E8FF] border-[#C084FC] text-[#1E1B2E] shadow-xs'
                }`}
              >
                {/* Unread indicator dot */}
                {!notif.is_read && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#8E2D9D] ring-4 ring-[#8E2D9D]/20" />
                )}

                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-[#E8E0F0] shrink-0 mt-0.5 shadow-xs">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 mb-1">
                      <span className="text-xs font-bold truncate text-[#1E1B2E]">{notif.title}</span>
                      {getPriorityBadge(notif.priority)}
                    </div>

                    <p className="text-[11px] text-[#5F5A72] leading-relaxed break-words">
                      {notif.message}
                    </p>

                    {/* Metadata Pills */}
                    {notif.metadata && Object.keys(notif.metadata).length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                        {notif.metadata.quoteNumber && (
                          <span className="px-1.5 py-0.5 rounded bg-[#F3E8FF] text-[#8E2D9D] font-mono border border-[#E8E0F0]">
                            {notif.metadata.quoteNumber}
                          </span>
                        )}
                        {notif.metadata.invoiceNumber && (
                          <span className="px-1.5 py-0.5 rounded bg-[#F3E8FF] text-[#8E2D9D] font-mono border border-[#E8E0F0]">
                            {notif.metadata.invoiceNumber}
                          </span>
                        )}
                        {notif.metadata.amount !== undefined && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                            ₹{Number(notif.metadata.amount).toLocaleString('en-IN')}
                          </span>
                        )}
                        {notif.metadata.newRole && (
                          <span className="px-1.5 py-0.5 rounded bg-[#F3E8FF] text-[#6F42C1] uppercase font-semibold border border-[#E8E0F0]">
                            {notif.metadata.newRole}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#E8E0F0] text-[10px] text-[#817B91]">
                      <div className="flex items-center space-x-1 font-medium">
                        <Clock className="w-3 h-3 text-[#817B91]" />
                        <span>{formatTimeAgo(notif.created_at)}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {notif.link && (
                          <span className="text-[#8E2D9D] font-semibold hover:underline flex items-center space-x-0.5">
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-600 transition-opacity"
                          title="Delete notification"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer / Developer Simulator Bar */}
      <div className="p-3 border-t border-[#E8E0F0] bg-[#FAF5FF] shrink-0">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center space-x-1 text-[#5F5A72] font-medium">
            <Database className="w-3 h-3 text-[#8E2D9D]" />
            <span>Supabase Cloud Persistence</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-[#817B91]">Simulate:</span>
            <button
              onClick={() => triggerSampleTest('lead')}
              className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors font-medium cursor-pointer"
            >
              +Lead
            </button>
            <button
              onClick={() => triggerSampleTest('invoice')}
              className="px-1.5 py-0.5 rounded bg-[#F3E8FF] border border-[#E8E0F0] text-[#8E2D9D] hover:bg-[#E9D5FF] transition-colors font-medium cursor-pointer"
            >
              +Inv
            </button>
            <button
              onClick={() => triggerSampleTest('payment')}
              className="px-1.5 py-0.5 rounded bg-[#F3E8FF] border border-[#E8E0F0] text-[#6F42C1] hover:bg-[#E9D5FF] transition-colors font-medium cursor-pointer"
            >
              +Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
