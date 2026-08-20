import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Users, 
  Eye, 
  Smartphone, 
  Monitor, 
  Globe, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  Filter, 
  Download, 
  Search, 
  Sparkles, 
  Power, 
  RefreshCw,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { VisitorEvent } from '../../types';

export const VisitorMonitor: React.FC = () => {
  const { 
    visitorEvents, 
    visitorSummary, 
    isVisitorTrackingEnabled, 
    toggleVisitorTracking, 
    clearVisitorEvents, 
    syncFromDatabase,
    currentUser,
    isLoading
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<VisitorEvent | null>(null);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);

  const { success } = useToast();

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Filter events based on criteria
  const filteredEvents = useMemo(() => {
    return visitorEvents.filter(ev => {
      // Event type filter
      if (selectedEventType !== 'all' && ev.eventType !== selectedEventType) return false;
      // Device filter
      if (selectedDevice !== 'all' && ev.deviceType !== selectedDevice) return false;
      // Search query across section, browser, referrer, and region
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          (ev.sectionId?.toLowerCase().includes(q)) ||
          (ev.pagePath?.toLowerCase().includes(q)) ||
          (ev.browser?.toLowerCase().includes(q)) ||
          (ev.referrer?.toLowerCase().includes(q)) ||
          (ev.region?.toLowerCase().includes(q)) ||
          (ev.sessionId?.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [visitorEvents, selectedEventType, selectedDevice, searchQuery]);

  const handleExportCSV = () => {
    if (visitorEvents.length === 0) return;

    const headers = ['Event ID', 'Timestamp', 'Session ID', 'Event Type', 'Page Path', 'Section', 'Device', 'Browser', 'OS', 'Referrer', 'Region', 'Duration (s)'];
    const rows = visitorEvents.map(e => [
      e.id,
      e.created_at,
      e.sessionId,
      e.eventType,
      e.pagePath,
      e.sectionId || 'N/A',
      e.deviceType,
      e.browser,
      e.os,
      e.referrer,
      e.region || 'India',
      e.durationSeconds || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fusion_forge_visitor_telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLogs = async () => {
    setShowPurgeModal(true);
  };

  const confirmPurge = async () => {
    setShowPurgeModal(false);
    setIsPurging(true);
    await clearVisitorEvents();
    setIsPurging(false);
    success('Logs Purged', 'All visitor telemetry logs have been cleared.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner with Privacy Compliance Badge */}
      <div className="bg-white border border-[#E8E0F0] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Activity className="w-48 h-48 text-[#8E2D9D]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1E1B2E] tracking-tight flex items-center gap-2">
                  Privacy-Conscious Visitor Telemetry & Analytics
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    DPDP ACT 2023 COMPLIANT
                  </span>
                </h1>
                <p className="text-sm text-[#5F5A72] mt-1">
                  Real-time visitor event tracking stored authoritatively in Supabase. Zero PII collection guarantee.
                </p>
              </div>
            </div>
          </div>

          {/* Super Admin Control Master Switch */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => syncFromDatabase()}
              disabled={isLoading}
              className="p-2.5 bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] rounded-xl border border-[#E8E0F0] transition shadow-xs cursor-pointer"
              title="Refresh telemetry from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExportCSV}
              disabled={visitorEvents.length === 0}
              className="px-3.5 py-2.5 bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] rounded-xl text-sm font-semibold transition border border-[#E8E0F0] flex items-center gap-2 disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            {isSuperAdmin && (
              <>
                <button
                  onClick={toggleVisitorTracking}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 border shadow-xs cursor-pointer ${
                    isVisitorTrackingEnabled 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-white text-[#817B91] border-[#E8E0F0] hover:bg-[#FAF5FF]'
                  }`}
                  title="Super Admin Master Switch for Visitor Telemetry"
                >
                  <Power className={`w-4 h-4 ${isVisitorTrackingEnabled ? 'text-emerald-600' : 'text-[#817B91]'}`} />
                  {isVisitorTrackingEnabled ? 'Telemetry: Active' : 'Telemetry: Disabled'}
                </button>

                <button
                  onClick={handleClearLogs}
                  disabled={isPurging || visitorEvents.length === 0}
                  className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  title="Purge logs from Supabase"
                >
                  <Trash2 className="w-4 h-4" />
                  Purge Logs
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="p-4 bg-white border border-[#E8E0F0] rounded-2xl flex items-start gap-3 text-xs text-[#5F5A72] shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#1E1B2E]">Zero-PII Sovereign Privacy Policy Guarantee:</strong>
          <p>
            Visitor telemetry aggregates purely anonymized session identifiers, high-level device types, browser families, and section dwell durations. We <strong>never</strong> capture keystrokes, personal names, phone numbers, or passwords via this stream. All records are managed exclusively by Super Admins.
          </p>
        </div>
      </div>

      {/* KPI Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E0F0] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#5F5A72]">
            <span className="text-xs uppercase font-bold tracking-wider">Total Recorded Events</span>
            <div className="p-2 bg-[#F3E8FF] text-[#8E2D9D] rounded-xl border border-[#C084FC]/30">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1E1B2E] mt-2 font-mono">
            {visitorSummary.totalVisits}
          </div>
          <div className="text-xs text-[#817B91] mt-1 flex items-center gap-1">
            <span>Persisted in Supabase</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E0F0] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#5F5A72]">
            <span className="text-xs uppercase font-bold tracking-wider">Unique Sessions</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1E1B2E] mt-2 font-mono">
            {visitorSummary.uniqueSessions}
          </div>
          <div className="text-xs text-[#817B91] mt-1">
            Distinct visitor sessions
          </div>
        </div>

        <div className="bg-white border border-[#E8E0F0] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#5F5A72]">
            <span className="text-xs uppercase font-bold tracking-wider">Today's Visits</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1E1B2E] mt-2 font-mono">
            {visitorSummary.todayVisits}
          </div>
          <div className="text-xs text-[#817B91] mt-1">
            Current calendar day traffic
          </div>
        </div>

        <div className="bg-white border border-[#E8E0F0] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#5F5A72]">
            <span className="text-xs uppercase font-bold tracking-wider">Avg Section Dwell</span>
            <div className="p-2 bg-purple-50 text-[#8E2D9D] rounded-xl border border-purple-200">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#1E1B2E] mt-2 font-mono">
            {visitorSummary.averageDurationSeconds}s
          </div>
          <div className="text-xs text-[#817B91] mt-1">
            Time engaged per view
          </div>
        </div>
      </div>

      {/* Aggregate Distributions (Page / Section + Device + Browser + Referrer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sections Breakdown */}
        <div className="bg-white border border-[#E8E0F0] rounded-2xl p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#1E1B2E] flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-[#8E2D9D]" />
            Website Page & Section Interactions
          </h3>

          <div className="space-y-3">
            {visitorSummary.sectionBreakdown.length === 0 ? (
              <div className="text-center py-6 text-[#817B91] text-xs">No section events recorded.</div>
            ) : (
              visitorSummary.sectionBreakdown.slice(0, 7).map((item, idx) => {
                const maxCount = visitorSummary.sectionBreakdown[0]?.visitCount || 1;
                const percentage = Math.round((item.visitCount / maxCount) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#1E1B2E] font-bold">{item.section}</span>
                      <span className="text-[#5F5A72] font-mono">
                        {item.visitCount} visits <span className="text-[#817B91]">({item.uniqueVisitors} unique, avg {item.avgDurationSeconds}s)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8E2D9D] to-[#6F42C1] rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Device & Browser Distribution */}
        <div className="bg-white border border-[#E8E0F0] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-base font-bold text-[#1E1B2E] flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-[#8E2D9D]" />
              Device & Browser Distribution
            </h3>

            {/* Device Pills */}
            <div className="mb-6">
              <span className="text-xs uppercase font-bold text-[#5F5A72] tracking-wider block mb-2">Device Hardware</span>
              <div className="grid grid-cols-3 gap-3">
                {visitorSummary.deviceBreakdown.map((dev, idx) => (
                  <div key={idx} className="bg-[#FAF8FF] p-3 rounded-xl border border-[#E8E0F0] text-center">
                    <div className="flex justify-center mb-1 text-[#5F5A72]">
                      {dev.device === 'mobile' ? <Smartphone className="w-4 h-4 text-[#8E2D9D]" /> : <Monitor className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div className="text-xs capitalize font-bold text-[#1E1B2E]">{dev.device}</div>
                    <div className="text-xs text-[#5F5A72] font-mono font-bold">{dev.count} <span className="text-[#817B91] font-normal">({dev.percentage}%)</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Breakdown */}
            <div>
              <span className="text-xs uppercase font-bold text-[#5F5A72] tracking-wider block mb-2">Browser Engines</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {visitorSummary.browserBreakdown.slice(0, 4).map((b, idx) => (
                  <div key={idx} className="bg-[#FAF8FF] px-3 py-2 rounded-xl border border-[#E8E0F0] flex items-center justify-between text-xs">
                    <span className="text-[#1E1B2E] font-medium truncate">{b.browser}</span>
                    <span className="font-mono text-[#8E2D9D] font-bold ml-1">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Channel Summary */}
          <div className="mt-4 pt-4 border-t border-[#E8E0F0] flex items-center justify-between text-xs text-[#5F5A72]">
            <span className="font-bold">Top Referrers:</span>
            <div className="flex items-center gap-2">
              {visitorSummary.referrerBreakdown.slice(0, 3).map((r, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-[#FAF5FF] border border-[#E8E0F0] text-[#8E2D9D] font-mono font-bold">
                  {r.referrer} ({r.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Visitor Events Log Stream */}
      <div className="bg-white border border-[#E8E0F0] rounded-2xl shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 sm:p-6 border-b border-[#E8E0F0] flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#FAF8FF]">
          <div>
            <h3 className="text-lg font-bold text-[#1E1B2E] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#8E2D9D]" />
              Live Telemetry Event Log
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40">
                {filteredEvents.length} Events Showing
              </span>
            </h3>
            <p className="text-xs text-[#5F5A72] mt-0.5">
              Individual privacy-sanitized events captured in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#817B91]" />
              <input
                type="text"
                placeholder="Filter by section, browser..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white border border-[#E8E0F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 w-48 sm:w-60 shadow-xs"
              />
            </div>

            {/* Event Type Filter */}
            <select
              value={selectedEventType}
              onChange={e => setSelectedEventType(e.target.value)}
              className="bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 shadow-xs cursor-pointer"
            >
              <option value="all">All Event Types</option>
              <option value="page_view">Page Views</option>
              <option value="section_view">Section Views</option>
              <option value="legal_doc_view">Legal Policy Views</option>
              <option value="estimator_use">Estimator Interactions</option>
              <option value="quote_request">Quote Submissions</option>
              <option value="chat_open">Chatbot Interactions</option>
              <option value="client_portal_open">Client Portal Queries</option>
            </select>

            {/* Device Filter */}
            <select
              value={selectedDevice}
              onChange={e => setSelectedDevice(e.target.value)}
              className="bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 shadow-xs cursor-pointer"
            >
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8FF] border-b border-[#E8E0F0] text-[#5F5A72] uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">Event Type</th>
                <th className="px-6 py-3.5">Section / Target</th>
                <th className="px-6 py-3.5">Session / Device</th>
                <th className="px-6 py-3.5">Browser & OS</th>
                <th className="px-6 py-3.5">Referrer</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0F0] font-mono">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#817B91] font-sans">
                    No visitor events found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredEvents.map(event => (
                  <tr key={event.id} className="hover:bg-[#FAF5FF] transition">
                    <td className="px-6 py-3.5 text-[#1E1B2E] whitespace-nowrap">
                      {new Date(event.created_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      <div className="text-[10px] text-[#817B91] font-sans">
                        {new Date(event.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-sans font-bold ${
                        event.eventType === 'quote_request' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        event.eventType === 'legal_doc_view' ? 'bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40' :
                        event.eventType === 'estimator_use' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-slate-100 text-[#5F5A72] border border-[#E8E0F0]'
                      }`}>
                        {event.eventType}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-[#1E1B2E] font-bold">
                      {event.sectionId || event.pagePath}
                    </td>

                    <td className="px-6 py-3.5 text-[#5F5A72] whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="text-[11px] font-mono text-[#5F5A72]">{event.sessionId.substring(0, 10)}...</span>
                        <span className="text-[#817B91]">•</span>
                        <span className="capitalize text-[#1E1B2E] font-semibold text-[11px]">{event.deviceType}</span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-[#5F5A72] whitespace-nowrap font-sans">
                      <span className="text-[#1E1B2E] font-medium">{event.browser}</span> <span className="text-[#817B91]">({event.os})</span>
                    </td>

                    <td className="px-6 py-3.5 text-[#5F5A72] whitespace-nowrap">
                      {event.referrer || 'direct'}
                    </td>

                    <td className="px-6 py-3.5 text-[#1E1B2E] font-semibold whitespace-nowrap">
                      {event.durationSeconds ? `${event.durationSeconds}s` : '10s'}
                    </td>

                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedEventForDetail(event)}
                        className="px-2.5 py-1 bg-white hover:bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0] rounded-lg text-xs font-sans font-bold transition shadow-xs cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Non-Sensitive Metadata Inspection Modal */}
      {selectedEventForDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E0F0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0F0]">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#8E2D9D]" />
                <h3 className="font-bold text-[#1E1B2E] text-base">Visitor Event Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Event ID</span>
                <span className="font-mono text-[#1E1B2E]">{selectedEventForDetail.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Session ID (Anonymized)</span>
                <span className="font-mono text-[#1E1B2E]">{selectedEventForDetail.sessionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Timestamp</span>
                <span className="text-[#1E1B2E]">{selectedEventForDetail.created_at}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Event Type</span>
                <span className="text-[#8E2D9D] font-bold">{selectedEventForDetail.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Page / Section</span>
                <span className="text-[#1E1B2E] font-bold">{selectedEventForDetail.sectionId || selectedEventForDetail.pagePath}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Device Hardware</span>
                <span className="text-[#1E1B2E] capitalize font-bold">{selectedEventForDetail.deviceType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Browser & OS</span>
                <span className="text-[#1E1B2E]">{selectedEventForDetail.browser} on {selectedEventForDetail.os}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0F0]">
                <span className="text-[#5F5A72] font-semibold">Referrer Domain</span>
                <span className="text-[#1E1B2E]">{selectedEventForDetail.referrer}</span>
              </div>
              
              {/* Extra non-sensitive metadata JSON */}
              <div className="pt-2">
                <span className="text-[#5F5A72] font-bold block mb-1">Non-Sensitive Telemetry Payload:</span>
                <pre className="p-3 bg-[#FAF8FF] rounded-xl font-mono text-[11px] text-[#1E1B2E] overflow-x-auto border border-[#E8E0F0]">
                  {JSON.stringify(selectedEventForDetail.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="px-4 py-2 bg-[#8E2D9D] hover:bg-[#6F42C1] text-white rounded-xl text-xs font-bold shadow-md shadow-[#8E2D9D]/20 cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purge Telemetry Confirmation Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Purge Telemetry Logs</h2>
                <p className="text-xs text-red-600 font-semibold">Critical permanent action</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to purge all visitor telemetry logs? This will permanently delete all session histories, event timestamps, and country metrics.
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPurge}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge All Logs</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
