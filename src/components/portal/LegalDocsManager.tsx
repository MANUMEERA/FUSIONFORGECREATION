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
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'terms_of_engagement':
        return <Scale className="w-5 h-5 text-amber-400" />;
      case 'gst_compliance':
        return <Building2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusBadge = (status: LegalDocumentStatus) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active / Enforced</span>;
      case 'in_review':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">In Legal Review</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Draft Revision</span>;
      case 'archived':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">Archived</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Scale className="w-48 h-48 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Legal Document Monitoring & Compliance
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    SUPER ADMIN CONTROL
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Manage versions, publish dates, active statuses, and immutable audit trails for Privacy Policy, Terms of Engagement & GST Compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('public')}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-sm font-medium transition border border-zinc-700 flex items-center gap-2 shadow-sm"
              title="Preview public legal documents on the website"
            >
              <ExternalLink className="w-4 h-4" />
              View Public Website
            </button>
          </div>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-400 hover:text-white">
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
              className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected 
                  ? 'bg-zinc-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg' 
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-zinc-800'}`}>
                    {getDocIcon(doc.documentType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base leading-snug">{doc.title.split('&')[0].trim()}</h3>
                    <span className="text-xs text-zinc-400 font-mono">/{doc.slug}</span>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                  {doc.version}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  Updated: {doc.lastUpdatedDate}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace for Selected Document */}
      {selectedDoc && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Action & Tab Toolbar */}
          <div className="p-4 sm:p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-xl">
                {getDocIcon(selectedDoc.documentType)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  {selectedDoc.title}
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {selectedDoc.version}
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-3">
                  <span>Author: <strong className="text-zinc-300">{selectedDoc.lastModifiedBy}</strong> ({selectedDoc.lastModifiedByRole})</span>
                  <span>•</span>
                  <span>Effective: <strong className="text-zinc-300">{selectedDoc.effectiveDate}</strong></span>
                </p>
              </div>
            </div>

            {/* Sub-tabs & Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex bg-zinc-800 p-1 rounded-xl border border-zinc-700/60 text-xs">
                <button
                  onClick={() => setActiveSubTab('editor')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeSubTab === 'editor' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Management & Edit
                </button>
                <button
                  onClick={() => setActiveSubTab('preview')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeSubTab === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Live Preview
                </button>
                <button
                  onClick={() => setActiveSubTab('history')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    activeSubTab === 'history' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Audit History ({docHistory.length})
                </button>
              </div>

              <button
                onClick={() => handleCopyMarkdown(selectedDoc.content, selectedDoc.id)}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition"
                title="Copy Markdown Source"
              >
                {copiedId === selectedDoc.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SubTab 1: Document Editor & Metadata Management */}
          {activeSubTab === 'editor' && (
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Document Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Active Status
                    </label>
                    <select
                      disabled={!canManage}
                      value={formData.status}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, status: e.target.value as LegalDocumentStatus }));
                        setIsEditing(true);
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    >
                      <option value="active">Active / Enforced</option>
                      <option value="in_review">In Legal Review</option>
                      <option value="draft">Draft Revision</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Brief Summary */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
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
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>

                {/* Markdown Source Editor */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Authoritative Document Text (Markdown Format)
                    </label>
                    <span className="text-xs text-zinc-500 font-mono">
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
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-50 leading-relaxed resize-y"
                    placeholder="Enter authoritative legal clauses in Markdown..."
                    required
                  />
                </div>

                {/* Change Summary for Audit Trail */}
                <div className="p-4 bg-indigo-950/20 border border-indigo-800/40 rounded-xl">
                  <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    Required Change Summary for Version Audit Trail
                  </label>
                  <input
                    type="text"
                    disabled={!canManage}
                    value={formData.changeSummary}
                    onChange={e => setFormData(prev => ({ ...prev, changeSummary: e.target.value }))}
                    placeholder="e.g. Updated Section 2 to reflect DPDP Act 2023 consent mandate and 18% GST intra-state rules."
                    className="w-full bg-zinc-900 border border-indigo-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400 disabled:opacity-50"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    This note will be permanently recorded in Supabase <code>legal_document_history</code> along with your identity (<strong className="text-zinc-400">{currentUser.name}</strong> - {currentUser.role}).
                  </p>
                </div>

                {/* Save & Publish Controls */}
                {canManage ? (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleSelectDoc(selectedDoc)}
                        className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition"
                      >
                        Reset Changes
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                    >
                      <Save className="w-4 h-4" />
                      Publish & Record Version in Supabase
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-800/60 rounded-xl text-xs text-zinc-400 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-zinc-500" />
                    Viewing in read-only mode. Only Super Admin or authorized compliance managers may publish revisions.
                  </div>
                )}
              </form>
            </div>
          )}

          {/* SubTab 2: Live Formatted Preview */}
          {activeSubTab === 'preview' && (
            <div className="p-8 max-w-4xl mx-auto bg-zinc-950 rounded-b-2xl">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-indigo-400 tracking-wider">Fusion Forge Creation Legal Charter</span>
                  <h2 className="text-xl font-bold text-white mt-1">{formData.title}</h2>
                  <p className="text-xs text-zinc-400 mt-1">{formData.summary}</p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-indigo-400">{formData.version}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Effective: {formData.effectiveDate}</div>
                </div>
              </div>

              {/* Rendered content */}
              <div className="prose prose-invert max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-hr:border-zinc-800 prose-strong:text-white">
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300 space-y-4">
                  {formData.content}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-500">
                <div>Jurisdiction: <strong className="text-zinc-400">{formData.jurisdiction}</strong></div>
                <div>Applicable Law: <strong className="text-zinc-400">{formData.applicableLaw}</strong></div>
              </div>
            </div>
          )}

          {/* SubTab 3: Comprehensive Audit History Log */}
          {activeSubTab === 'history' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    Historical Revisions & Rollback Point
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Immutable history stored in Supabase table <code>legal_document_history</code>.
                  </p>
                </div>
                <span className="text-xs text-zinc-400 font-mono bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                  {docHistory.length} Total Revisions Logged
                </span>
              </div>

              {docHistory.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800">
                  No previous revisions logged for this document yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {docHistory.map((item, index) => {
                    const isLatest = index === 0;
                    return (
                      <div 
                        key={item.id}
                        className={`p-5 rounded-xl border transition-all ${
                          isLatest 
                            ? 'bg-zinc-950 border-indigo-500/40 ring-1 ring-indigo-500/20' 
                            : 'bg-zinc-950/60 border-zinc-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-bold px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded text-indigo-300">
                              {item.version}
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                              <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                                <span>Changed by <strong className="text-zinc-300">{item.changedBy}</strong> ({item.changedByRole})</span>
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
                                className="px-3 py-1.5 bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-zinc-700"
                                title="Rollback to this version"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Rollback
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="text-xs text-zinc-300 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800/80">
                            <strong className="text-zinc-400 uppercase tracking-wider text-[10px] block mb-1">Change Summary:</strong>
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
