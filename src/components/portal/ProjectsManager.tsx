import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Globe, 
  X, 
  Building2, 
  Calendar,
  Layers,
  ArrowUpRight,
  Send,
  Receipt,
  History,
  Archive,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Code2,
  FileCheck,
  AlertTriangle,
  Mail,
  Check,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedProject, ProjectStatus, CompletedWorkRecord } from '../../types';

export const ProjectsManager: React.FC = () => {
  const { 
    managedProjects, 
    completedWorks,
    clients, 
    addManagedProject, 
    updateManagedProject, 
    deleteManagedProject,
    sendProjectStatusEmail,
    addCompletedWork,
    updateCompletedWork,
    deleteCompletedWork,
    archiveProjectToCompletedWork,
    createInvoiceFromProject,
    setActiveTab: setAppActiveTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'completed_works'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Status & Email Dispatch Modal
  const [statusModalProject, setStatusModalProject] = useState<ManagedProject | null>(null);
  const [newStatusSelect, setNewStatusSelect] = useState<ProjectStatus>('completed');
  const [emailNotes, setEmailNotes] = useState('');
  const [sendEmailCheck, setSendEmailCheck] = useState(true);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState('');

  // Status History Drawer
  const [historyDrawerProject, setHistoryDrawerProject] = useState<ManagedProject | null>(null);

  // Invoice Generation Dialog / Alert
  const [invoicePromptProject, setInvoicePromptProject] = useState<ManagedProject | null>(null);
  const [invoiceFeedback, setInvoiceFeedback] = useState<{ success: boolean; message: string; invoiceId?: string; invoiceNumber?: string } | null>(null);

  // Completed Work Modal State
  const [isCwModalOpen, setIsCwModalOpen] = useState(false);
  const [editingCwId, setEditingCwId] = useState<string | null>(null);
  const [cwClientName, setCwClientName] = useState('');
  const [cwProjectTitle, setCwProjectTitle] = useState('');
  const [cwCategory, setCwCategory] = useState('Web Application');
  const [cwCompletionDate, setCwCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [cwTechInput, setCwTechInput] = useState('React 19, TypeScript, PostgreSQL, Tailwind CSS');
  const [cwPublicUrl, setCwPublicUrl] = useState('');
  const [cwWebAppUrl, setCwWebAppUrl] = useState('');
  const [cwSoftwareUrl, setCwSoftwareUrl] = useState('');
  const [cwMobileAppInfo, setCwMobileAppInfo] = useState('');
  const [cwDescription, setCwDescription] = useState('');
  const [cwDeliverablesInput, setCwDeliverablesInput] = useState('Production Core, Architecture, Database Migrations');

  // Project Form State
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [category, setCategory] = useState('Web Application');
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
  const [completionDate, setCompletionDate] = useState('');
  const [budget, setBudget] = useState<number>(250000);
  const [progressPercentage, setProgressPercentage] = useState<number>(50);
  const [techStackInput, setTechStackInput] = useState('React 19, TypeScript, PostgreSQL, Tailwind CSS');
  const [deliverablesInput, setDeliverablesInput] = useState('Frontend UI, Backend API, Database Schema, Testing');
  const [publicUrl, setPublicUrl] = useState('');
  const [webAppUrl, setWebAppUrl] = useState('');
  const [softwareUrl, setSoftwareUrl] = useState('');
  const [mobileAppInfo, setMobileAppInfo] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [notes, setNotes] = useState('');
  const [notifyClientOnSave, setNotifyClientOnSave] = useState(false);

  const openCreateModal = () => {
    setEditingProjectId(null);
    setTitle('');
    const defaultClient = clients[0];
    setClientId(defaultClient?.id || '');
    setClientEmail(defaultClient?.email || '');
    setCategory('Web Application');
    setStatus('in_progress');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDeadline(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
    setCompletionDate('');
    setBudget(250000);
    setProgressPercentage(25);
    setTechStackInput('React 19, TypeScript, Node.js, PostgreSQL');
    setDeliverablesInput('Architecture, Frontend Dashboard, REST APIs, Documentation');
    setPublicUrl('');
    setWebAppUrl('');
    setSoftwareUrl('');
    setMobileAppInfo('');
    setIsPublic(true);
    setNotes('');
    setNotifyClientOnSave(false);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: ManagedProject) => {
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setClientId(proj.clientId || '');
    setClientEmail(proj.clientEmail || '');
    setCategory(proj.category || 'Web Application');
    setStatus(proj.status);
    setStartDate(proj.startDate || new Date().toISOString().split('T')[0]);
    setDeadline(proj.deadline || new Date().toISOString().split('T')[0]);
    setCompletionDate(proj.completionDate || '');
    setBudget(proj.budget || 0);
    setProgressPercentage(proj.progressPercentage || 0);
    setTechStackInput((proj.techStack || []).join(', '));
    setDeliverablesInput((proj.deliverables || []).join(', '));
    setPublicUrl(proj.publicUrl || '');
    setWebAppUrl(proj.webAppUrl || '');
    setSoftwareUrl(proj.softwareUrl || '');
    setMobileAppInfo(proj.mobileAppInfo || '');
    setIsPublic(proj.isPublic ?? true);
    setNotes(proj.notes || '');
    setNotifyClientOnSave(false);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId);
    const clientName = client ? (client.companyName || client.name) : 'Direct Client';
    const emailToUse = clientEmail || client?.email || '';

    const techStack = techStackInput.split(',').map(t => t.trim()).filter(Boolean);
    const deliverables = deliverablesInput.split(',').map(d => d.trim()).filter(Boolean);

    const calculatedProgress = status === 'completed' ? 100 : progressPercentage;
    const finalCompletionDate = status === 'completed' ? (completionDate || new Date().toISOString().split('T')[0]) : completionDate;

    if (editingProjectId) {
      await updateManagedProject(
        editingProjectId,
        {
          title,
          clientId,
          clientName,
          clientEmail: emailToUse,
          category,
          status,
          startDate,
          deadline,
          completionDate: finalCompletionDate,
          budget: Number(budget),
          progressPercentage: calculatedProgress,
          techStack,
          deliverables,
          publicUrl,
          webAppUrl,
          softwareUrl,
          mobileAppInfo,
          isPublic,
          notes
        },
        notifyClientOnSave,
        `Project Update: ${title} (${status.toUpperCase()}) - Fusion Forge Creation`,
        notes || `Project updated to status ${status.toUpperCase()} with progress ${calculatedProgress}%.`
      );
    } else {
      addManagedProject({
        title,
        clientId,
        clientName,
        clientEmail: emailToUse,
        category,
        status,
        startDate,
        deadline,
        completionDate: finalCompletionDate,
        budget: Number(budget),
        progressPercentage: calculatedProgress,
        techStack,
        deliverables,
        publicUrl,
        webAppUrl,
        softwareUrl,
        mobileAppInfo,
        isPublic,
        notes
      });
    }

    setIsModalOpen(false);
  };

  const handleOpenStatusModal = (proj: ManagedProject) => {
    setStatusModalProject(proj);
    setNewStatusSelect(proj.status === 'completed' ? 'in_progress' : 'completed');
    setEmailNotes(proj.status === 'completed' ? '' : 'All agreed milestones, source codes, and documentation have been tested and successfully verified.');
    setSendEmailCheck(true);
    setStatusSuccessMsg('');
  };

  const handleExecuteStatusChange = async () => {
    if (!statusModalProject) return;
    setIsSubmittingStatus(true);
    setStatusSuccessMsg('');

    try {
      const res = await updateManagedProject(
        statusModalProject.id,
        {
          status: newStatusSelect,
          progressPercentage: newStatusSelect === 'completed' ? 100 : statusModalProject.progressPercentage,
          completionDate: newStatusSelect === 'completed' ? (statusModalProject.completionDate || new Date().toISOString().split('T')[0]) : statusModalProject.completionDate
        },
        sendEmailCheck,
        `Official Notification: ${statusModalProject.title} is now ${newStatusSelect.toUpperCase()} - Fusion Forge Creation`,
        emailNotes
      );

      setStatusSuccessMsg(`Project transitioned to ${newStatusSelect.toUpperCase()}! ${sendEmailCheck ? 'Email dispatched to client.' : ''}`);
      setTimeout(() => {
        setStatusModalProject(null);
        setIsSubmittingStatus(false);
      }, 1400);
    } catch (err: any) {
      alert(`Status update error: ${err.message}`);
      setIsSubmittingStatus(false);
    }
  };

  const handleRaiseInvoice = (proj: ManagedProject, overrideWarning = false) => {
    const result = createInvoiceFromProject(proj.id, overrideWarning);
    setInvoicePromptProject(proj);
    setInvoiceFeedback({
      success: result.success,
      message: result.message || '',
      invoiceId: result.invoice?.id,
      invoiceNumber: result.invoice?.invoiceNumber || result.existingInvoiceNumber
    });
  };

  const handleArchiveToCompletedWork = (proj: ManagedProject) => {
    const record = archiveProjectToCompletedWork(proj.id);
    if (record) {
      alert(`Project "${proj.title}" successfully archived to Company Historical Works Portfolio!`);
      setActiveSubTab('completed_works');
    }
  };

  // Completed Work Modal handlers
  const openCreateCwModal = () => {
    setEditingCwId(null);
    setCwClientName('');
    setCwProjectTitle('');
    setCwCategory('Web Application');
    setCwCompletionDate(new Date().toISOString().split('T')[0]);
    setCwTechInput('React 19, TypeScript, Node.js, PostgreSQL');
    setCwPublicUrl('');
    setCwWebAppUrl('');
    setCwSoftwareUrl('');
    setCwMobileAppInfo('');
    setCwDescription('');
    setCwDeliverablesInput('Production Deployment, Code Handover, API Documentation');
    setIsCwModalOpen(true);
  };

  const openEditCwModal = (cw: CompletedWorkRecord) => {
    setEditingCwId(cw.id);
    setCwClientName(cw.clientName);
    setCwProjectTitle(cw.projectTitle);
    setCwCategory(cw.workCategory);
    setCwCompletionDate(cw.completionDate);
    setCwTechInput(cw.technologyType.join(', '));
    setCwPublicUrl(cw.publicUrl || '');
    setCwWebAppUrl(cw.webAppUrl || '');
    setCwSoftwareUrl(cw.softwareUrl || '');
    setCwMobileAppInfo(cw.mobileAppInfo || '');
    setCwDescription(cw.shortDescription);
    setCwDeliverablesInput((cw.deliverablesSummary || []).join(', '));
    setIsCwModalOpen(true);
  };

  const handleSaveCompletedWork = (e: React.FormEvent) => {
    e.preventDefault();
    const tech = cwTechInput.split(',').map(t => t.trim()).filter(Boolean);
    const delivs = cwDeliverablesInput.split(',').map(d => d.trim()).filter(Boolean);

    if (editingCwId) {
      updateCompletedWork(editingCwId, {
        clientName: cwClientName,
        projectTitle: cwProjectTitle,
        workCategory: cwCategory,
        completionDate: cwCompletionDate,
        technologyType: tech,
        publicUrl: cwPublicUrl || undefined,
        webAppUrl: cwWebAppUrl || undefined,
        softwareUrl: cwSoftwareUrl || undefined,
        mobileAppInfo: cwMobileAppInfo || undefined,
        shortDescription: cwDescription,
        deliverablesSummary: delivs
      });
    } else {
      addCompletedWork({
        clientName: cwClientName,
        projectTitle: cwProjectTitle,
        workCategory: cwCategory,
        completionDate: cwCompletionDate,
        technologyType: tech,
        publicUrl: cwPublicUrl || undefined,
        webAppUrl: cwWebAppUrl || undefined,
        softwareUrl: cwSoftwareUrl || undefined,
        mobileAppInfo: cwMobileAppInfo || undefined,
        shortDescription: cwDescription,
        deliverablesSummary: delivs,
        isVerified: true
      });
    }
    setIsCwModalOpen(false);
  };

  const filteredProjects = managedProjects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCompletedWorks = completedWorks.filter(cw => {
    return (
      cw.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cw.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cw.workCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cw.technologyType.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-blue-400" />
            Projects, Engagements & Historical Works
          </h1>
          <p className="text-sm text-slate-400">
            Track client delivery sprints, manage status transitions with automated email dispatch, generate tax invoices, and archive historical records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'projects' ? (
            <button
              id="btn_new_project"
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          ) : (
            <button
              id="btn_new_completed_work"
              onClick={openCreateCwModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>New Historical Work Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          id="tab_active_projects"
          onClick={() => setActiveSubTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'projects'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-900/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Active & Managed Engagements ({managedProjects.length})</span>
        </button>

        <button
          id="tab_completed_works"
          onClick={() => setActiveSubTab('completed_works')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'completed_works'
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-900/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Completed Works Portfolio & History ({completedWorks.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'projects' 
                ? 'Search active projects by name, client, tech stack...' 
                : 'Search historical work records by client, title, technology...'
            }
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {activeSubTab === 'projects' && (
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        )}
      </div>

      {/* SUB-TAB 1: MANAGED PROJECTS */}
      {activeSubTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProjects.map(proj => {
            const isCompleted = proj.status === 'completed';
            const hasInvoice = (proj.invoicedIds && proj.invoicedIds.length > 0) || (proj.invoicedAmount && proj.invoicedAmount > 0);

            return (
              <div
                key={proj.id}
                id={`project_card_${proj.id}`}
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isCompleted 
                    ? 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-950/20' 
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        {proj.category}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Complete
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-white text-base mt-1">{proj.title}</h3>
                    
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-medium text-slate-300">{proj.clientName}</span>
                      </div>
                      {proj.clientEmail && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Mail className="w-3 h-3" />
                          <span>{proj.clientEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenStatusModal(proj)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 ${
                      proj.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                        : proj.status === 'in_progress'
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/40'
                        : proj.status === 'planning'
                        ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
                        : proj.status === 'review'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Click to change status or send notification email"
                  >
                    <span>{proj.status.replace('_', ' ').toUpperCase()}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </button>
                </div>

                {/* Progress Bar & Milestone */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Milestone Completion</span>
                    <span className="font-bold text-white font-mono">{proj.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        proj.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${proj.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Deliverables summary */}
                {proj.deliverables && proj.deliverables.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-cyan-400" />
                      <span>Deliverables Checklist</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.deliverables.map((deliv, idx) => (
                        <span key={idx} className="text-[11px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          {deliv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* URLs / Deployment Links */}
                {(proj.publicUrl || proj.webAppUrl || proj.softwareUrl || proj.mobileAppInfo) && (
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {proj.publicUrl && (
                      <a href={proj.publicUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-800/40">
                        <Globe className="w-3 h-3" />
                        <span>Live Portal</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}
                    {proj.webAppUrl && (
                      <a href={proj.webAppUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 bg-blue-950/30 px-2 py-1 rounded border border-blue-800/40">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>Web App</span>
                      </a>
                    )}
                    {proj.softwareUrl && (
                      <a href={proj.softwareUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-1 bg-purple-950/30 px-2 py-1 rounded border border-purple-800/40">
                        <Code2 className="w-3 h-3" />
                        <span>Software Repo</span>
                      </a>
                    )}
                    {proj.mobileAppInfo && (
                      <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-800/40">
                        <Smartphone className="w-3 h-3" />
                        <span>{proj.mobileAppInfo}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Invoicing Status Banner */}
                {hasInvoice && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      Tax Invoiced: ₹{proj.invoicedAmount?.toLocaleString('en-IN') || proj.budget.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">Linked to Accounting</span>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Contract Value</div>
                    <div className="font-bold text-white font-mono">₹{proj.budget.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5">
                    {/* Raise Invoice Button */}
                    <button
                      id={`btn_invoice_${proj.id}`}
                      onClick={() => handleRaiseInvoice(proj)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        hasInvoice
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/30'
                      }`}
                      title={hasInvoice ? 'Invoice already issued for this engagement' : 'Generate Tax Invoice from this project'}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{hasInvoice ? 'Invoice Ready' : 'Raise Invoice'}</span>
                    </button>

                    {/* Status / Email Button */}
                    <button
                      onClick={() => handleOpenStatusModal(proj)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
                      title="Update status and dispatch email to customer"
                    >
                      <Send className="w-3 h-3 text-blue-400" />
                      <span>Notify</span>
                    </button>

                    {/* Status History */}
                    <button
                      onClick={() => setHistoryDrawerProject(proj)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="View Status History & Audit Trail"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>

                    {/* Archive to Historical Works */}
                    {isCompleted && (
                      <button
                        onClick={() => handleArchiveToCompletedWork(proj)}
                        className="p-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/50"
                        title="Archive to Company Historical Portfolio"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Edit project details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${proj.title}"?`)) {
                          deleteManagedProject(proj.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: COMPLETED WORKS PORTFOLIO & HISTORICAL SYSTEM */}
      {activeSubTab === 'completed_works' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Internal Company Historical Portfolio</h3>
                <p className="text-xs text-slate-400">
                  Standardized internal work repository holding verified past engagements, tech classifications, deployment links, and deliverables milestones.
                </p>
              </div>
            </div>
            <button
              onClick={openCreateCwModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCompletedWorks.map(cw => (
              <div
                key={cw.id}
                id={`cw_card_${cw.id}`}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-4 shadow-lg shadow-slate-950/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        {cw.workCategory}
                      </span>
                      {cw.isVerified && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Audited Record
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white text-base mt-1">{cw.projectTitle}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium text-slate-300">{cw.clientName}</span>
                      <span className="text-slate-600">•</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Completed: {cw.completionDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditCwModal(cw)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Edit Historical Record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete historical work record "${cw.projectTitle}"?`)) {
                          deleteCompletedWork(cw.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  {cw.shortDescription}
                </p>

                {/* Deliverables summary */}
                {cw.deliverablesSummary && cw.deliverablesSummary.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Delivered Components:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cw.deliverablesSummary.map((d, i) => (
                        <span key={i} className="text-[11px] text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5">
                  {cw.technologyType.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700/60">
                      {t}
                    </span>
                  ))}
                </div>

                {/* URLs */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
                  {cw.publicUrl && (
                    <a href={cw.publicUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 bg-cyan-950/30 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                  {cw.webAppUrl && (
                    <a href={cw.webAppUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 bg-blue-950/30 px-2.5 py-1 rounded-lg border border-blue-800/40">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Web App</span>
                    </a>
                  )}
                  {cw.softwareUrl && (
                    <a href={cw.softwareUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-1 bg-purple-950/30 px-2.5 py-1 rounded-lg border border-purple-800/40">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Software</span>
                    </a>
                  )}
                  {cw.mobileAppInfo && (
                    <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{cw.mobileAppInfo}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: STATUS CHANGE & EMAIL NOTIFICATION DISPATCH */}
      {statusModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0d1527] border border-blue-500/30 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setStatusModalProject(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Update Status & Notify Client</h2>
                <p className="text-xs text-slate-400">{statusModalProject.title}</p>
              </div>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-slate-400 flex justify-between">
                  <span>Current Status:</span>
                  <span className="font-bold text-white uppercase">{statusModalProject.status}</span>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>Recipient Client:</span>
                  <span className="font-medium text-blue-400">{statusModalProject.clientEmail || statusModalProject.clientName}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Project Status</label>
                <select
                  value={newStatusSelect}
                  onChange={e => setNewStatusSelect(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="planning">PLANNING</option>
                  <option value="in_progress">IN PROGRESS</option>
                  <option value="review">IN REVIEW (UAT)</option>
                  <option value="completed">COMPLETED (100% Milestone Handover)</option>
                  <option value="on_hold">ON HOLD</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Custom Notes / Progress Summary</label>
                <textarea
                  rows={3}
                  value={emailNotes}
                  onChange={e => setEmailNotes(e.target.value)}
                  placeholder="Notes regarding deliverables, test environments, or completion handover..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailCheck}
                    onChange={e => setSendEmailCheck(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-slate-200 font-medium block">Dispatch Official Project Email Notification</span>
                    <span className="text-[11px] text-slate-400 block">Sends formal status transition email to {statusModalProject.clientEmail || 'client'} from admin@fusionforgecreation.com</span>
                  </div>
                </label>
              </div>

              {statusSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{statusSuccessMsg}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStatusModalProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingStatus}
                  onClick={handleExecuteStatusChange}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingStatus ? 'Updating & Sending...' : 'Apply Status & Notify'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STATUS HISTORY & EMAIL AUDIT DRAWER */}
      {historyDrawerProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0d1527] border border-slate-700 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-slate-100 space-y-4">
            <button
              onClick={() => setHistoryDrawerProject(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Project Status History & Email Trail</h2>
                <p className="text-xs text-slate-400">{historyDrawerProject.title} ({historyDrawerProject.clientName})</p>
              </div>
            </div>

            <div className="space-y-3">
              {historyDrawerProject.statusHistory && historyDrawerProject.statusHistory.length > 0 ? (
                historyDrawerProject.statusHistory.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {item.newStatus}
                        </span>
                        {item.previousStatus && (
                          <span className="text-slate-500 text-[11px]">from {item.previousStatus}</span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-slate-300">{item.notes}</p>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/80 text-slate-400">
                      <span>Changed by: {item.changedBy}</span>
                      {item.emailSentToClient ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <Check className="w-3 h-3" />
                          Email sent to {item.clientEmail || 'client'}
                        </span>
                      ) : (
                        <span className="text-slate-500">No email sent</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-500">
                  No previous transition records logged yet.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setHistoryDrawerProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE GENERATION FEEDBACK & DUPLICATE WARNING */}
      {invoicePromptProject && invoiceFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0d1527] border border-blue-500/30 rounded-2xl shadow-2xl p-6 relative text-slate-100 space-y-4">
            <button
              onClick={() => {
                setInvoicePromptProject(null);
                setInvoiceFeedback(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                invoiceFeedback.success 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {invoiceFeedback.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {invoiceFeedback.success ? 'Tax Invoice Generated' : 'Invoice Notice'}
                </h3>
                <p className="text-xs text-slate-400">{invoicePromptProject.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              {invoiceFeedback.message}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              {!invoiceFeedback.success && (
                <button
                  onClick={() => handleRaiseInvoice(invoicePromptProject, true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
                >
                  Generate Additional Invoice
                </button>
              )}
              <button
                onClick={() => {
                  setInvoicePromptProject(null);
                  setInvoiceFeedback(null);
                  setAppActiveTab('invoices');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-900/30"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Go to Invoices Desk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT MANAGED PROJECT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0d1527] border border-slate-700 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-400" />
              {editingProjectId ? 'Edit Project Engagement' : 'Create Managed Project'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Set project timelines, client link, deliverables, and progress tracking.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Financial Intelligence Platform"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Associated Client</label>
                  <select
                    value={clientId}
                    onChange={e => {
                      setClientId(e.target.value);
                      const matched = clients.find(c => c.id === e.target.value);
                      if (matched?.email) setClientEmail(matched.email);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName || c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Email Address</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    <option value="Web Application">Web Application</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Enterprise Cloud">Enterprise Cloud</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Enterprise ERP">Enterprise ERP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => {
                      const newSt = e.target.value as ProjectStatus;
                      setStatus(newSt);
                      if (newSt === 'completed') {
                        setProgressPercentage(100);
                        if (!completionDate) setCompletionDate(new Date().toISOString().split('T')[0]);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed (100%)</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contract Budget (₹)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Completion % ({progressPercentage}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={e => setProgressPercentage(Number(e.target.value))}
                    className="w-full mt-2 accent-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {status === 'completed' && (
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Actual Completion Date</label>
                  <input
                    type="date"
                    value={completionDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/50 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="React 19, TypeScript, Node.js, PostgreSQL"
                  value={techStackInput}
                  onChange={e => setTechStackInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deliverables List (comma separated)</label>
                <input
                  type="text"
                  placeholder="Doctor Portal, Patient App, WebRTC Telehealth, SAC 998314 Invoicing"
                  value={deliverablesInput}
                  onChange={e => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Public URL / Live Link</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={publicUrl}
                    onChange={e => setPublicUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Web App / Portal URL</label>
                  <input
                    type="url"
                    placeholder="https://app.example.com"
                    value={webAppUrl}
                    onChange={e => setWebAppUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Software / Code URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={softwareUrl}
                    onChange={e => setSoftwareUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile App Information</label>
                  <input
                    type="text"
                    placeholder="e.g. Play Store APK / iOS TestFlight"
                    value={mobileAppInfo}
                    onChange={e => setMobileAppInfo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes & Scope Details</label>
                <textarea
                  rows={2}
                  placeholder="Scope details, architectural milestones..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Show in Public Agency Showcase</span>
                </label>

                {editingProjectId && (
                  <label className="flex items-center space-x-2 cursor-pointer text-blue-400">
                    <input
                      type="checkbox"
                      checked={notifyClientOnSave}
                      onChange={e => setNotifyClientOnSave(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span className="font-medium">Send project update notification email to {clientEmail || 'client'} on save</span>
                  </label>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
                >
                  {editingProjectId ? 'Update Engagement' : 'Create Engagement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD / EDIT HISTORICAL COMPLETED WORK */}
      {isCwModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0d1527] border border-emerald-500/30 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setIsCwModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Archive className="w-5 h-5 text-emerald-400" />
              {editingCwId ? 'Edit Historical Completed Work' : 'Add Historical Completed Work'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Archive confidential-safe project details to the company's internal portfolio history.
            </p>

            <form onSubmit={handleSaveCompletedWork} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Party / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Fintech Solutions Pvt. Ltd."
                  value={cwClientName}
                  onChange={e => setCwClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project / Work Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Financial Intelligence Platform"
                  value={cwProjectTitle}
                  onChange={e => setCwProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Work Category</label>
                  <select
                    value={cwCategory}
                    onChange={e => setCwCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Web Application & Real-time Trading">Web Application & Real-time Trading</option>
                    <option value="Enterprise Cloud & IoT Telematics">Enterprise Cloud & IoT Telematics</option>
                    <option value="Enterprise ERP & Inventory Automation">Enterprise ERP & Inventory Automation</option>
                    <option value="B2B E-Commerce & Wholesale Distribution">B2B E-Commerce & Wholesale Distribution</option>
                    <option value="Mobile App & Healthcare Telemedicine">Mobile App & Healthcare Telemedicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Completion Date</label>
                  <input
                    type="date"
                    required
                    value={cwCompletionDate}
                    onChange={e => setCwCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technology / Type (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="React 19, TypeScript, PostgreSQL, Tailwind CSS"
                  value={cwTechInput}
                  onChange={e => setCwTechInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of engineering achievements, architecture, and production impact..."
                  value={cwDescription}
                  onChange={e => setCwDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deliverables Summary (comma separated)</label>
                <input
                  type="text"
                  placeholder="High-throughput MQTT ingestion, Live map clustering, Mobile App APK"
                  value={cwDeliverablesInput}
                  onChange={e => setCwDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Public URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={cwPublicUrl}
                    onChange={e => setCwPublicUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Web Application URL</label>
                  <input
                    type="url"
                    placeholder="https://app.example.com"
                    value={cwWebAppUrl}
                    onChange={e => setCwWebAppUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Software URL / Repo</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={cwSoftwareUrl}
                    onChange={e => setCwSoftwareUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile App Information</label>
                  <input
                    type="text"
                    placeholder="e.g. Driver Android GPS Telematics App"
                    value={cwMobileAppInfo}
                    onChange={e => setCwMobileAppInfo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCwModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/30"
                >
                  {editingCwId ? 'Update Record' : 'Save to Historical Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
