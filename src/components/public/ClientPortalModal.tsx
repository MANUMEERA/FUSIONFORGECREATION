import React, { useState } from 'react';
import { 
  X, 
  FolderLock, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Mail,
  AlertCircle,
  Building,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose
}) => {
  const { managedProjects, invoices, agencyConfig } = useApp();
  const { info } = useToast();

  const [searchRef, setSearchRef] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundProject, setFoundProject] = useState<any>(null);
  const [foundInvoices, setFoundInvoices] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    const cleanRef = searchRef.trim().toLowerCase();
    const cleanEmail = clientEmail.trim().toLowerCase();

    // Look for matching client projects
    const project = managedProjects.find(p => 
      (cleanRef && (
        p.id.toLowerCase().includes(cleanRef) ||
        p.title.toLowerCase().includes(cleanRef) ||
        p.clientName.toLowerCase().includes(cleanRef)
      )) ||
      (cleanEmail && p.clientEmail && p.clientEmail.toLowerCase() === cleanEmail)
    );

    // Look for matching invoices
    const matchingInvoices = invoices.filter(inv => 
      (cleanRef && (
        inv.invoiceNumber.toLowerCase().includes(cleanRef) ||
        inv.clientName.toLowerCase().includes(cleanRef) ||
        inv.clientCompany.toLowerCase().includes(cleanRef)
      )) ||
      (cleanEmail && inv.clientEmail && inv.clientEmail.toLowerCase() === cleanEmail)
    );

    setFoundProject(project || null);
    setFoundInvoices(matchingInvoices);
  };

  const resetLookup = () => {
    setSearchRef('');
    setClientEmail('');
    setSearched(false);
    setFoundProject(null);
    setFoundInvoices([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#0e1838] via-[#09122c] to-[#050b1a] border border-blue-500/30 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 border border-cyan-400/40 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-cyan-500/20">
            <FolderLock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Client Project & Deliverable Portal</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Secure client workspace partitioned from internal administration. Track live development milestones and GST tax documentation.
          </p>
        </div>

        {/* Notice of Separation */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 flex items-start space-x-3 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-cyan-300">Strict Data Segregation:</span> Client accounts are isolated from internal staff & administrative modules. To access your project deliverables, verify your project reference or contact your assigned account lead.
          </div>
        </div>

        {/* Project & Document Lookup Form */}
        {!searched ? (
          <form onSubmit={handleLookup} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Project Reference, Title, or Invoice Number
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Apex Fintech / QTN-2026-0001 / FFC-2026-0001"
                  value={searchRef}
                  onChange={e => setSearchRef(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Authorized Client Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. client@company.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-blue-500/30 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Client Deliverables & Status</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center text-slate-400">
              <p className="text-[11px]">
                Need dedicated portal access credentials? Email us at{' '}
                <a href={`mailto:${agencyConfig.email}`} className="text-cyan-400 hover:underline">
                  {agencyConfig.email}
                </a>
              </p>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Search Results */}
            {foundProject || foundInvoices.length > 0 ? (
              <div className="space-y-4">
                {foundProject && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900/60 border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-full">
                        Live Project Status
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {foundProject.progressPercentage || 85}% Complete
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{foundProject.title}</h4>
                    <div className="text-slate-300 text-[11px]">
                      Client: <strong>{foundProject.clientName}</strong> ({foundProject.clientCompany})
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                        style={{ width: `${foundProject.progressPercentage || 85}%` }}
                      />
                    </div>
                    <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Status: <strong className="text-white capitalize">{foundProject.status?.replace('_', ' ') || 'In Progress'}</strong></span>
                      {foundProject.stagingUrl && (
                        <a 
                          href={foundProject.stagingUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>Staging Preview</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {foundInvoices.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Associated Tax Documents:
                    </div>
                    <div className="space-y-1.5">
                      {foundInvoices.map((inv: any) => (
                        <div key={inv.id} className="p-2 rounded-xl bg-slate-800/60 flex items-center justify-between text-[11px]">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-semibold text-white">{inv.invoiceNumber}</span>
                            <span className="text-slate-400 font-mono">₹{inv.totalAmount?.toLocaleString('en-IN')}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            inv.status === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/40' : 'bg-amber-950 text-amber-400 border border-amber-700/40'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Matching Deliverables Found</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  We could not find active records for &quot;{searchRef || clientEmail}&quot;. Please ensure you have entered the exact project ID, email, or invoice number.
                </p>
              </div>
            )}

            <button
              onClick={resetLookup}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
            >
              Search Another Reference
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
