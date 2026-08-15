import React from 'react';
import { 
  MessageSquare, 
  UserCheck, 
  ArrowRight, 
  Clock, 
  Tag, 
  Building2,
  Mail,
  Phone,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProjectEnquiry } from '../../types';

export const EnquiriesManager: React.FC = () => {
  const { enquiries, updateEnquiryStatus, convertEnquiryToClient, setActiveTab } = useApp();

  const handleConvert = (enqId: string) => {
    convertEnquiryToClient(enqId);
    setActiveTab('clients');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Project Enquiries & Leads</h2>
          <p className="text-xs text-slate-400">Incoming requirements from public estimator and contact inquiries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {enquiries.map(enq => (
          <div 
            key={enq.id}
            className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-white">{enq.name}</span>
                {(enq.company_name || enq.company) && (
                  <span className="text-xs text-slate-400 font-medium">({enq.company_name || enq.company})</span>
                )}
                {enq.service && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {enq.service}
                  </span>
                )}
                {enq.priority && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    enq.priority === 'urgent' 
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }`}>
                    {enq.priority} Priority
                  </span>
                )}
                {enq.source && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300">
                    {enq.source}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{enq.email}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{enq.phone}</span>
                </div>
                {enq.budgetRange && (
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-medium">
                    <span>Budget: {enq.budgetRange}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                {enq.message || enq.projectDescription}
              </p>

              {enq.featuresRequired && enq.featuresRequired.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {enq.featuresRequired.map((feat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">
                      {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex md:flex-col justify-between items-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6">
              <div className="text-right">
                <label className="text-[10px] text-slate-500 block mb-1">Status</label>
                <select
                  value={enq.status}
                  onChange={e => updateEnquiryStatus(enq.id, e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {enq.status !== 'Converted' && enq.status !== 'won' && (
                <button
                  onClick={() => handleConvert(enq.id)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Convert to Client</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
