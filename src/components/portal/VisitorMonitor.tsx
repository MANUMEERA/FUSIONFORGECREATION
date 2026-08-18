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
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
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
    if (!window.confirm('CRITICAL ACTION: Are you sure you want to purge all visitor telemetry logs from Supabase? This action is permanent.')) {
      return;
    }
    setIsPurging(true);
    await clearVisitorEvents();
    setIsPurging(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner with Privacy Compliance Badge */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Activity className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Privacy-Conscious Visitor Telemetry & Analytics
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    DPDP ACT 2023 COMPLIANT
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
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
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition"
              title="Refresh telemetry from Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExportCSV}
              disabled={visitorEvents.length === 0}
              className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-sm font-medium transition border border-zinc-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            {isSuperAdmin && (
              <>
                <button
                  onClick={toggleVisitorTracking}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 border shadow-sm ${
                    isVisitorTrackingEnabled 
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                  }`}
                  title="Super Admin Master Switch for Visitor Telemetry"
                >
                  <Power className={`w-4 h-4 ${isVisitorTrackingEnabled ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  {isVisitorTrackingEnabled ? 'Telemetry: Active' : 'Telemetry: Disabled'}
                </button>

                <button
                  onClick={handleClearLogs}
                  disabled={isPurging || visitorEvents.length === 0}
                  className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition flex items-center gap-1.5 disabled:opacity-50"
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
      <div className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl flex items-start gap-3 text-xs text-zinc-400">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-zinc-200">Zero-PII Sovereign Privacy Policy Guarantee:</strong>
          <p>
            Visitor telemetry aggregates purely anonymized session identifiers, high-level device types, browser families, and section dwell durations. We <strong>never</strong> capture keystrokes, personal names, phone numbers, or passwords via this stream. All records are managed exclusively by Super Admins.
          </p>
        </div>
      </div>

      {/* KPI Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Total Recorded Events</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2 font-mono">
            {visitorSummary.totalVisits}
          </div>
          <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
            <span>Persisted in Supabase</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Unique Sessions</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2 font-mono">
            {visitorSummary.uniqueSessions}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Distinct visitor sessions
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Today's Visits</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2 font-mono">
            {visitorSummary.todayVisits}
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Current calendar day traffic
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Avg Section Dwell</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2 font-mono">
            {visitorSummary.averageDurationSeconds}s
          </div>
          <div className="text-xs text-zinc-500 mt-1">
            Time engaged per view
          </div>
        </div>
      </div>

      {/* Aggregate Distributions (Page / Section + Device + Browser + Referrer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sections Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-indigo-400" />
            Website Page & Section Interactions
          </h3>

          <div className="space-y-3">
            {visitorSummary.sectionBreakdown.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">No section events recorded.</div>
            ) : (
              visitorSummary.sectionBreakdown.slice(0, 7).map((item, idx) => {
                const maxCount = visitorSummary.sectionBreakdown[0]?.visitCount || 1;
                const percentage = Math.round((item.visitCount / maxCount) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-zinc-300 font-semibold">{item.section}</span>
                      <span className="text-zinc-400 font-mono">
                        {item.visitCount} visits <span className="text-zinc-500">({item.uniqueVisitors} unique, avg {item.avgDurationSeconds}s)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500" 
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-emerald-400" />
              Device & Browser Distribution
            </h3>

            {/* Device Pills */}
            <div className="mb-6">
              <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider block mb-2">Device Hardware</span>
              <div className="grid grid-cols-3 gap-3">
                {visitorSummary.deviceBreakdown.map((dev, idx) => (
                  <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                    <div className="flex justify-center mb-1 text-zinc-400">
                      {dev.device === 'mobile' ? <Smartphone className="w-4 h-4 text-indigo-400" /> : <Monitor className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-xs capitalize font-medium text-white">{dev.device}</div>
                    <div className="text-xs text-zinc-400 font-mono font-bold">{dev.count} <span className="text-zinc-500 font-normal">({dev.percentage}%)</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Breakdown */}
            <div>
              <span className="text-xs uppercase font-semibold text-zinc-400 tracking-wider block mb-2">Browser Engines</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {visitorSummary.browserBreakdown.slice(0, 4).map((b, idx) => (
                  <div key={idx} className="bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-zinc-300 truncate">{b.browser}</span>
                    <span className="font-mono text-zinc-400 font-bold ml-1">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Referral Channel Summary */}
          <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>Top Referrers:</span>
            <div className="flex items-center gap-2">
              {visitorSummary.referrerBreakdown.slice(0, 3).map((r, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                  {r.referrer} ({r.count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Visitor Events Log Stream */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900/50">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              Live Telemetry Event Log
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {filteredEvents.length} Events Showing
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Individual privacy-sanitized events captured in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter by section, browser..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
              />
            </div>

            {/* Event Type Filter */}
            <select
              value={selectedEventType}
              onChange={e => setSelectedEventType(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
              className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
            <thead className="bg-zinc-950/70 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
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
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500 font-sans">
                    No visitor events found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredEvents.map(event => (
                  <tr key={event.id} className="hover:bg-zinc-800/40 transition">
                    <td className="px-6 py-3.5 text-zinc-300 whitespace-nowrap">
                      {new Date(event.created_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      <div className="text-[10px] text-zinc-500 font-sans">
                        {new Date(event.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-sans font-medium ${
                        event.eventType === 'quote_request' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        event.eventType === 'legal_doc_view' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        event.eventType === 'estimator_use' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-zinc-800 text-zinc-300'
                      }`}>
                        {event.eventType}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-white font-semibold">
                      {event.sectionId || event.pagePath}
                    </td>

                    <td className="px-6 py-3.5 text-zinc-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="text-[11px] font-mono text-zinc-400">{event.sessionId.substring(0, 10)}...</span>
                        <span className="text-zinc-500">•</span>
                        <span className="capitalize text-zinc-300 text-[11px]">{event.deviceType}</span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-zinc-300 whitespace-nowrap font-sans">
                      {event.browser} <span className="text-zinc-500">({event.os})</span>
                    </td>

                    <td className="px-6 py-3.5 text-zinc-400 whitespace-nowrap">
                      {event.referrer || 'direct'}
                    </td>

                    <td className="px-6 py-3.5 text-zinc-300 whitespace-nowrap">
                      {event.durationSeconds ? `${event.durationSeconds}s` : '10s'}
                    </td>

                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedEventForDetail(event)}
                        className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-indigo-400 hover:text-indigo-300 rounded-lg text-xs font-sans transition"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Visitor Event Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Event ID</span>
                <span className="font-mono text-zinc-200">{selectedEventForDetail.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Session ID (Anonymized)</span>
                <span className="font-mono text-zinc-200">{selectedEventForDetail.sessionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Timestamp</span>
                <span className="text-zinc-200">{selectedEventForDetail.created_at}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Event Type</span>
                <span className="text-indigo-400 font-semibold">{selectedEventForDetail.eventType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Page / Section</span>
                <span className="text-zinc-200 font-semibold">{selectedEventForDetail.sectionId || selectedEventForDetail.pagePath}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Device Hardware</span>
                <span className="text-zinc-200 capitalize">{selectedEventForDetail.deviceType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Browser & OS</span>
                <span className="text-zinc-200">{selectedEventForDetail.browser} on {selectedEventForDetail.os}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Referrer Domain</span>
                <span className="text-zinc-200">{selectedEventForDetail.referrer}</span>
              </div>
              
              {/* Extra non-sensitive metadata JSON */}
              <div className="pt-2">
                <span className="text-zinc-400 block mb-1">Non-Sensitive Telemetry Payload:</span>
                <pre className="p-3 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-300 overflow-x-auto border border-zinc-800">
                  {JSON.stringify(selectedEventForDetail.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedEventForDetail(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
