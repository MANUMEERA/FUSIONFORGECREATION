import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  History, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  RotateCcw, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Save, 
  X,
  FileCode,
  Scale,
  Building2,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LegalDocument, LegalDocumentHistoryItem, LegalDocumentStatus } from '../../types';

export const LegalDocsManager: React.FC = () => {
  const { 
    legalDocuments, 
    legalHistory, 
    updateLegalDocument, 
    createLegalDocumentRevision, 
    restoreLegalDocumentVersion, 
    currentUser,
    checkPermission,
    setCurrentView
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState<string>(legalDocuments[0]?.id || 'legal_doc_privacy');
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'history' | 'preview'>('editor');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Form state for updating document
  const selectedDoc = legalDocuments.find(d => d.id === selectedDocId) || legalDocuments[0];
  
  const [formData, setFormData] = useState<{
    title: string;
    version: string;
    effectiveDate: string;
    status: LegalDocumentStatus;
    summary: string;
    content: string;
    jurisdiction: string;
    applicableLaw: string;
    changeSummary: string;
  }>({
    title: selectedDoc?.title || '',
    version: selectedDoc?.version || '',
    effectiveDate: selectedDoc?.effectiveDate || '',
    status: selectedDoc?.status || 'active',
    summary: selectedDoc?.summary || '',
    content: selectedDoc?.content || '',
    jurisdiction: selectedDoc?.jurisdiction || '',
    applicableLaw: selectedDoc?.applicableLaw || '',
    changeSummary: ''
  });

  // When selected doc changes, refresh form state
  const handleSelectDoc = (doc: LegalDocument) => {
    setSelectedDocId(doc.id);
    setFormData({
      title: doc.title,
      version: doc.version,
      effectiveDate: doc.effectiveDate,
      status: doc.status,
      summary: doc.summary,
      content: doc.content,
      jurisdiction: doc.jurisdiction,
      applicableLaw: doc.applicableLaw,
      changeSummary: ''
    });
    setIsEditing(false);
    setSaveSuccessMessage(null);
  };

  const isSuperAdmin = currentUser.role === 'super_admin';
  const canManage = isSuperAdmin || checkPermission('module.documents');

  const docHistory = legalHistory.filter(h => h.documentId === selectedDoc?.id || h.documentSlug === selectedDoc?.slug);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !canManage) return;

    const summaryText = formData.changeSummary.trim() || `Updated ${selectedDoc.title} specifications`;

    await updateLegalDocument(
      selectedDoc.id,
      {
        title: formData.title,
        version: formData.version,
        effectiveDate: formData.effectiveDate,
        status: formData.status,
        summary: formData.summary,
        content: formData.content,
        jurisdiction: formData.jurisdiction,
        applicableLaw: formData.applicableLaw
      },
      summaryText
    );

    setIsEditing(false);
    setSaveSuccessMessage(`Successfully published version ${formData.version} with audit logging.`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleRestore = async (historyItem: LegalDocumentHistoryItem) => {
    if (!window.confirm(`Are you sure you want to rollback to revision ${historyItem.version} (published on ${new Date(historyItem.created_at).toLocaleDateString()})?`)) {
      return;
    }

    const success = await restoreLegalDocumentVersion(selectedDoc.id, historyItem.id);
    if (success) {
      setSaveSuccessMessage(`Successfully restored to revision ${historyItem.version}.`);
      setActiveSubTab('editor');
      setIsEditing(false);
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    }
  };

  const handleCopyMarkdown = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'privacy_policy':
        return <ShieldCheck className="w-5 h-5 text-[#8E2D9D]" />;
      case 'terms_of_engagement':
        return <Scale className="w-5 h-5 text-[#6F42C1]" />;
      case 'gst_compliance':
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <FileText className="w-5 h-5 text-[#8E2D9D]" />;
    }
  };

  const getStatusBadge = (status: LegalDocumentStatus) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Active / Enforced</span>;
      case 'in_review':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">In Legal Review</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#8E2D9D] border border-purple-200">Draft Revision</span>;
      case 'archived':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-[#5F5A72] border border-[#E8E0F0]">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E8E0F0] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Scale className="w-48 h-48 text-[#8E2D9D]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F3E8FF] border border-[#C084FC]/50 rounded-xl text-[#8E2D9D]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1E1B2E] tracking-tight flex items-center gap-2">
                  Legal Document Monitoring & Compliance
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40">
                    SUPER ADMIN CONTROL
                  </span>
                </h1>
                <p className="text-sm text-[#5F5A72] mt-1">
                  Manage versions, publish dates, active statuses, and immutable audit trails for Privacy Policy, Terms of Engagement & GST Compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('public')}
              className="px-4 py-2.5 bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] rounded-xl text-sm font-semibold transition border border-[#E8E0F0] flex items-center gap-2 shadow-xs cursor-pointer"
              title="Preview public legal documents on the website"
            >
              <ExternalLink className="w-4 h-4" />
              View Public Website
            </button>
          </div>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3 Core Legal Document Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {legalDocuments.map(doc => {
          const isSelected = doc.id === selectedDoc?.id;
          return (
            <button
              key={doc.id}
              onClick={() => handleSelectDoc(doc)}
              className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? 'bg-white border-[#8E2D9D] ring-2 ring-[#8E2D9D]/20 shadow-md' 
                  : 'bg-white border-[#E8E0F0] hover:border-[#C084FC] hover:bg-[#FAF5FF]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#F3E8FF] border border-[#C084FC]/50' : 'bg-[#FAF8FF] border border-[#E8E0F0]'}`}>
                    {getDocIcon(doc.documentType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E1B2E] text-base leading-snug">{doc.title.split('&')[0].trim()}</h3>
                    <span className="text-xs text-[#817B91] font-mono">/{doc.slug}</span>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E0F0] flex items-center justify-between text-xs text-[#5F5A72]">
                <span className="font-mono bg-[#FAF5FF] border border-[#E8E0F0] px-2 py-0.5 rounded text-[#8E2D9D] font-bold">
                  {doc.version}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#817B91]" />
                  Updated: {doc.lastUpdatedDate}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace for Selected Document */}
      {selectedDoc && (
        <div className="bg-white border border-[#E8E0F0] rounded-2xl shadow-sm overflow-hidden">
          {/* Action & Tab Toolbar */}
          <div className="p-4 sm:p-6 border-b border-[#E8E0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8FF]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-[#E8E0F0] rounded-xl shadow-xs">
                {getDocIcon(selectedDoc.documentType)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E] flex items-center gap-2">
                  {selectedDoc.title}
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC]/40">
                    {selectedDoc.version}
                  </span>
                </h2>
                <p className="text-xs text-[#5F5A72] mt-0.5 flex items-center gap-3">
                  <span>Author: <strong className="text-[#1E1B2E]">{selectedDoc.lastModifiedBy}</strong> ({selectedDoc.lastModifiedByRole})</span>
                  <span>•</span>
                  <span>Effective: <strong className="text-[#1E1B2E]">{selectedDoc.effectiveDate}</strong></span>
                </p>
              </div>
            </div>

            {/* Sub-tabs & Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-white p-1 rounded-xl border border-[#E8E0F0] text-xs shadow-xs">
                <button
                  onClick={() => setActiveSubTab('editor')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'editor' ? 'bg-[#8E2D9D] text-white shadow-xs' : 'text-[#5F5A72] hover:text-[#1E1B2E]'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Management & Edit
                </button>
                <button
                  onClick={() => setActiveSubTab('preview')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'preview' ? 'bg-[#8E2D9D] text-white shadow-xs' : 'text-[#5F5A72] hover:text-[#1E1B2E]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Live Preview
                </button>
                <button
                  onClick={() => setActiveSubTab('history')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'history' ? 'bg-[#8E2D9D] text-white shadow-xs' : 'text-[#5F5A72] hover:text-[#1E1B2E]'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Audit History ({docHistory.length})
                </button>
              </div>

              <button
                onClick={() => handleCopyMarkdown(selectedDoc.content, selectedDoc.id)}
                className="p-2 bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] rounded-xl border border-[#E8E0F0] transition shadow-xs cursor-pointer"
                title="Copy Markdown Source"
              >
                {copiedId === selectedDoc.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SubTab 1: Document Editor & Metadata Management */}
          {activeSubTab === 'editor' && (
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Document Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#FAF8FF] border border-[#E8E0F0] rounded-2xl">
                  <div>
                    <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider mb-1.5">
                      Document Title
                    </label>
                    <input
                      type="text"
                      disabled={!canManage}
                      value={formData.title}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, title: e.target.value }));
                        setIsEditing(true);
                      }}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-sm text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider mb-1.5">
                      Version String
                    </label>
                    <input
                      type="text"
                      disabled={!canManage}
                      value={formData.version}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, version: e.target.value }));
                        setIsEditing(true);
                      }}
                      placeholder="e.g. v2.2"
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-sm text-[#1E1B2E] font-mono focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider mb-1.5">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      disabled={!canManage}
                      value={formData.effectiveDate}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, effectiveDate: e.target.value }));
                        setIsEditing(true);
                      }}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-sm text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider mb-1.5">
                      Active Status
                    </label>
                    <select
                      disabled={!canManage}
                      value={formData.status}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, status: e.target.value as LegalDocumentStatus }));
                        setIsEditing(true);
                      }}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-sm text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50 cursor-pointer"
                    >
                      <option value="active">Active / Enforced</option>
                      <option value="in_review">In Legal Review</option>
                      <option value="draft">Draft Revision</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider mb-1.5">
                      Statutory Jurisdiction
                    </label>
                    <input
                      type="text"
                      disabled={!canManage}
                      value={formData.jurisdiction}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, jurisdiction: e.target.value }));
                        setIsEditing(true);
                      }}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-sm text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider mb-1.5">
                      Applicable Statutory Laws
                    </label>
                    <input
                      type="text"
                      disabled={!canManage}
                      value={formData.applicableLaw}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, applicableLaw: e.target.value }));
                        setIsEditing(true);
                      }}
                      className="w-full bg-white border border-[#E8E0F0] rounded-xl px-3 py-2 text-sm text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Brief Summary */}
                <div>
                  <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider mb-1.5">
                    Executive Summary / Public Teaser
                  </label>
                  <textarea
                    rows={2}
                    disabled={!canManage}
                    value={formData.summary}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, summary: e.target.value }));
                      setIsEditing(true);
                    }}
                    className="w-full bg-white border border-[#E8E0F0] rounded-xl p-3 text-sm text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50"
                  />
                </div>

                {/* Markdown Source Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#5F5A72] uppercase tracking-wider">
                      Authoritative Document Text (Markdown Format)
                    </label>
                    <span className="text-xs text-[#817B91] font-mono">
                      {formData.content.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={16}
                    disabled={!canManage}
                    value={formData.content}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, content: e.target.value }));
                      setIsEditing(true);
                    }}
                    className="w-full bg-[#FAF8FF] border border-[#E8E0F0] rounded-2xl p-4 text-sm text-[#1E1B2E] font-mono focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50 leading-relaxed resize-y"
                    placeholder="Enter authoritative legal clauses in Markdown..."
                    required
                  />
                </div>

                {/* Change Summary for Audit Trail */}
                <div className="p-4 bg-[#F3E8FF]/60 border border-[#C084FC]/40 rounded-2xl">
                  <label className="block text-xs font-bold text-[#8E2D9D] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    Required Change Summary for Version Audit Trail
                  </label>
                  <input
                    type="text"
                    disabled={!canManage}
                    value={formData.changeSummary}
                    onChange={e => setFormData(prev => ({ ...prev, changeSummary: e.target.value }))}
                    placeholder="e.g. Updated Section 2 to reflect DPDP Act 2023 consent mandate and 18% GST intra-state rules."
                    className="w-full bg-white border border-[#C084FC]/50 rounded-xl px-3 py-2 text-sm text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 disabled:opacity-50"
                  />
                  <p className="text-xs text-[#5F5A72] mt-1">
                    This note will be permanently recorded in Supabase <code>legal_document_history</code> along with your identity (<strong className="text-[#1E1B2E]">{currentUser.name}</strong> - {currentUser.role}).
                  </p>
                </div>

                {/* Save & Publish Controls */}
                {canManage ? (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E0F0]">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleSelectDoc(selectedDoc)}
                        className="px-4 py-2.5 bg-white hover:bg-[#FAF5FF] text-[#5F5A72] rounded-xl text-sm font-semibold transition border border-[#E8E0F0] cursor-pointer"
                      >
                        Reset Changes
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#8E2D9D] hover:bg-[#6F42C1] text-white rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-md shadow-[#8E2D9D]/20 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Publish & Record Version in Supabase
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FAF8FF] border border-[#E8E0F0] rounded-xl text-xs text-[#5F5A72] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#817B91]" />
                    Viewing in read-only mode. Only Super Admin or authorized compliance managers may publish revisions.
                  </div>
                )}
              </form>
            </div>
          )}

          {/* SubTab 2: Live Formatted Preview */}
          {activeSubTab === 'preview' && (
            <div className="p-8 max-w-4xl mx-auto bg-white rounded-b-2xl">
              <div className="p-6 bg-[#FAF8FF] border border-[#E8E0F0] rounded-2xl mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#8E2D9D] font-bold tracking-wider">Fusion Forge Creation Legal Charter</span>
                  <h2 className="text-xl font-bold text-[#1E1B2E] mt-1">{formData.title}</h2>
                  <p className="text-xs text-[#5F5A72] mt-1">{formData.summary}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-[#8E2D9D]">{formData.version}</div>
                  <div className="text-xs text-[#817B91] mt-0.5">Effective: {formData.effectiveDate}</div>
                </div>
              </div>

              {/* Rendered content */}
              <div className="prose max-w-none prose-headings:text-[#1E1B2E] prose-p:text-[#5F5A72] prose-li:text-[#5F5A72] prose-hr:border-[#E8E0F0] prose-strong:text-[#1E1B2E]">
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#1E1B2E] space-y-4">
                  {formData.content}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E8E0F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#5F5A72]">
                <div>Jurisdiction: <strong className="text-[#1E1B2E]">{formData.jurisdiction}</strong></div>
                <div>Applicable Law: <strong className="text-[#1E1B2E]">{formData.applicableLaw}</strong></div>
              </div>
            </div>
          )}

          {/* SubTab 3: Comprehensive Audit History Log */}
          {activeSubTab === 'history' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
                    <History className="w-4 h-4 text-[#8E2D9D]" />
                    Historical Revisions & Rollback Point
                  </h3>
                  <p className="text-xs text-[#5F5A72]">
                    Immutable history stored in Supabase table <code>legal_document_history</code>.
                  </p>
                </div>
                <span className="text-xs text-[#8E2D9D] font-mono bg-[#F3E8FF] px-3 py-1 rounded-full border border-[#C084FC]/40 font-bold">
                  {docHistory.length} Total Revisions Logged
                </span>
              </div>

              {docHistory.length === 0 ? (
                <div className="text-center py-12 text-[#817B91] bg-[#FAF8FF] rounded-2xl border border-[#E8E0F0]">
                  No previous revisions logged for this document yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {docHistory.map((item, index) => {
                    const isLatest = index === 0;
                    return (
                      <div 
                        key={item.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isLatest 
                            ? 'bg-white border-[#8E2D9D] ring-2 ring-[#8E2D9D]/15 shadow-sm' 
                            : 'bg-white border-[#E8E0F0]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E0F0]">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold px-2.5 py-1 bg-[#FAF5FF] border border-[#E8E0F0] rounded text-[#8E2D9D]">
                              {item.version}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-[#1E1B2E]">{item.title}</h4>
                              <p className="text-xs text-[#5F5A72] flex items-center gap-2 mt-0.5">
                                <span>Changed by <strong className="text-[#1E1B2E]">{item.changedBy}</strong> ({item.changedByRole})</span>
                                <span>•</span>
                                <span>{new Date(item.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(item.status)}
                            {canManage && !isLatest && (
                              <button
                                onClick={() => handleRestore(item)}
                                className="px-3 py-1.5 bg-[#8E2D9D] hover:bg-[#6F42C1] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                                title="Rollback to this version"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Rollback
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="text-xs text-[#1E1B2E] bg-[#FAF8FF] p-3 rounded-xl border border-[#E8E0F0]">
                            <strong className="text-[#5F5A72] uppercase tracking-wider text-[10px] block mb-1 font-bold">Change Summary:</strong>
                            {item.changeSummary || 'Baseline system revision.'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
