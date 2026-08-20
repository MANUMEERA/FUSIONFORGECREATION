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
import { useToast } from '../../context/ToastContext';

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

  const { success } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'completed_works'>('projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // In-app Delete Confirmation Modals
  const [projectToDelete, setProjectToDelete] = useState<ManagedProject | null>(null);
  const [cwToDelete, setCwToDelete] = useState<CompletedWorkRecord | null>(null);

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
          <h1 className="text-2xl font-bold text-[#1E1B2E] flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-[#8E2D9D]" />
            Projects, Engagements & Historical Works
          </h1>
          <p className="text-xs text-[#5F5A72] mt-0.5">
            Track client delivery sprints, manage status transitions with automated email dispatch, generate tax invoices, and archive historical records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'projects' ? (
            <button
              id="btn_new_project"
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          ) : (
            <button
              id="btn_new_completed_work"
              onClick={openCreateCwModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Historical Work Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E8E0F0] pb-3">
        <button
          id="tab_active_projects"
          onClick={() => setActiveSubTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'projects'
              ? 'bg-[#F3E8FF] text-[#8E2D9D] border border-[#C084FC] shadow-xs'
              : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#FAF5FF]'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Active & Managed Engagements ({managedProjects.length})</span>
        </button>

        <button
          id="tab_completed_works"
          onClick={() => setActiveSubTab('completed_works')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'completed_works'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
              : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-[#FAF5FF]'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Completed Works Portfolio & History ({completedWorks.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
          <input
            type="text"
            placeholder={
              activeSubTab === 'projects' 
                ? 'Search active projects by name, client, tech stack...' 
                : 'Search historical work records by client, title, technology...'
            }
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder-[#817B91] focus:outline-none focus:border-[#8E2D9D] focus:ring-2 focus:ring-[#8E2D9D]/15 transition-all shadow-xs"
          />
        </div>
        
        {activeSubTab === 'projects' && (
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] cursor-pointer shadow-xs"
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
                className={`p-5 rounded-2xl border transition-all space-y-4 bg-white shadow-sm ${
                  isCompleted 
                    ? 'border-emerald-300 hover:border-emerald-400' 
                    : 'border-[#E8E0F0] hover:border-[#C084FC]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E2D9D]">
                        {proj.category}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified Complete
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-[#1E1B2E] text-base mt-1">{proj.title}</h3>
                    
                    <div className="text-xs text-[#5F5A72] flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#817B91]" />
                        <span className="font-medium text-[#1E1B2E]">{proj.clientName}</span>
                      </div>
                      {proj.clientEmail && (
                        <div className="flex items-center gap-1 text-[11px] text-[#817B91]">
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
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : proj.status === 'in_progress'
                        ? 'bg-[#F3E8FF] text-[#8E2D9D] border-[#E8E0F0]'
                        : proj.status === 'planning'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : proj.status === 'review'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-[#FAF5FF] text-[#5F5A72] border-[#E8E0F0]'
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
                    <span className="text-[#5F5A72] font-medium">Milestone Completion</span>
                    <span className="font-bold text-[#1E1B2E] font-mono">{proj.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF5FF] border border-[#E8E0F0] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        proj.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#8E2D9D] to-[#6F42C1]'
                      }`}
                      style={{ width: `${proj.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Deliverables summary */}
                {proj.deliverables && proj.deliverables.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#817B91] flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-[#8E2D9D]" />
                      <span>Deliverables Checklist</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.deliverables.map((deliv, idx) => (
                        <span key={idx} className="text-[11px] text-[#1E1B2E] bg-white px-2 py-0.5 rounded border border-[#E8E0F0] flex items-center gap-1 shadow-2xs">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
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
                      <a href={proj.publicUrl} target="_blank" rel="noopener noreferrer" className="text-[#8E2D9D] hover:underline flex items-center gap-1 bg-[#F3E8FF] px-2 py-1 rounded-lg border border-[#E8E0F0]">
                        <Globe className="w-3 h-3" />
                        <span>Live Portal</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    )}
                    {proj.webAppUrl && (
                      <a href={proj.webAppUrl} target="_blank" rel="noopener noreferrer" className="text-[#6F42C1] hover:underline flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>Web App</span>
                      </a>
                    )}
                    {proj.softwareUrl && (
                      <a href={proj.softwareUrl} target="_blank" rel="noopener noreferrer" className="text-[#8E2D9D] hover:underline flex items-center gap-1 bg-[#FAF5FF] px-2 py-1 rounded-lg border border-[#E8E0F0]">
                        <Code2 className="w-3 h-3" />
                        <span>Software Repo</span>
                      </a>
                    )}
                    {proj.mobileAppInfo && (
                      <span className="text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        <Smartphone className="w-3 h-3" />
                        <span>{proj.mobileAppInfo}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#FAF5FF] border border-[#E8E0F0] text-[10px] font-medium text-[#5F5A72]">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Invoicing Status Banner */}
                {hasInvoice && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      Tax Invoiced: ₹{proj.invoicedAmount?.toLocaleString('en-IN') || proj.budget.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Linked to Accounting</span>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-[#E8E0F0] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-[#817B91] font-medium uppercase tracking-wider">Contract Value</div>
                    <div className="font-bold text-[#1E1B2E] font-mono text-sm">₹{proj.budget.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5">
                    {/* Raise Invoice Button */}
                    <button
                      id={`btn_invoice_${proj.id}`}
                      onClick={() => handleRaiseInvoice(proj)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        hasInvoice
                          ? 'bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] border border-[#E8E0F0]'
                          : 'bg-[#8E2D9D] hover:bg-[#6F42C1] text-white shadow-sm'
                      }`}
                      title={hasInvoice ? 'Invoice already issued for this engagement' : 'Generate Tax Invoice from this project'}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{hasInvoice ? 'Invoice Ready' : 'Raise Invoice'}</span>
                    </button>

                    {/* Status / Email Button */}
                    <button
                      onClick={() => handleOpenStatusModal(proj)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Update status and dispatch email to customer"
                    >
                      <Send className="w-3 h-3 text-[#8E2D9D]" />
                      <span>Notify</span>
                    </button>

                    {/* Status History */}
                    <button
                      onClick={() => setHistoryDrawerProject(proj)}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] cursor-pointer transition-colors shadow-2xs"
                      title="View Status History & Audit Trail"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>

                    {/* Archive to Historical Works */}
                    {isCompleted && (
                      <button
                        onClick={() => handleArchiveToCompletedWork(proj)}
                        className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-pointer transition-colors shadow-2xs"
                        title="Archive to Company Historical Portfolio"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] cursor-pointer transition-colors shadow-2xs"
                      title="Edit project details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setProjectToDelete(proj)}
                      className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#817B91] hover:text-rose-600 border border-[#E8E0F0] cursor-pointer transition-colors shadow-2xs"
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
          <div className="p-4 rounded-2xl bg-white border border-[#E8E0F0] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#1E1B2E] text-sm">Internal Company Historical Portfolio</h3>
                <p className="text-xs text-[#5F5A72]">
                  Standardized internal work repository holding verified past engagements, tech classifications, deployment links, and deliverables milestones.
                </p>
              </div>
            </div>
            <button
              onClick={openCreateCwModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
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
                className="p-5 rounded-2xl bg-white border border-[#E8E0F0] hover:border-emerald-400 transition-all space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        {cw.workCategory}
                      </span>
                      {cw.isVerified && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Audited Record
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-[#1E1B2E] text-base mt-1">{cw.projectTitle}</h3>
                    <div className="text-xs text-[#5F5A72] flex items-center gap-2 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-[#817B91]" />
                      <span className="font-medium text-[#1E1B2E]">{cw.clientName}</span>
                      <span className="text-[#817B91]">•</span>
                      <Calendar className="w-3.5 h-3.5 text-[#817B91]" />
                      <span>Completed: {cw.completionDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditCwModal(cw)}
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] hover:text-[#1E1B2E] border border-[#E8E0F0] cursor-pointer transition-colors shadow-2xs"
                      title="Edit Historical Record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCwToDelete(cw)}
                      className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#817B91] hover:text-rose-600 border border-[#E8E0F0] cursor-pointer transition-colors shadow-2xs"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#5F5A72] leading-relaxed bg-[#FAF5FF] p-3 rounded-xl border border-[#E8E0F0]">
                  {cw.shortDescription}
                </p>

                {/* Deliverables summary */}
                {cw.deliverablesSummary && cw.deliverablesSummary.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-[#817B91]">Delivered Components:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cw.deliverablesSummary.map((d, i) => (
                        <span key={i} className="text-[11px] text-[#1E1B2E] bg-white px-2 py-0.5 rounded border border-[#E8E0F0] flex items-center gap-1 shadow-2xs">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5">
                  {cw.technologyType.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#FAF5FF] text-[10px] font-medium text-[#5F5A72] border border-[#E8E0F0]">
                      {t}
                    </span>
                  ))}
                </div>

                {/* URLs */}
                <div className="pt-2 border-t border-[#E8E0F0] flex flex-wrap gap-2 text-xs">
                  {cw.publicUrl && (
                    <a href={cw.publicUrl} target="_blank" rel="noopener noreferrer" className="text-[#8E2D9D] hover:underline flex items-center gap-1 bg-[#F3E8FF] px-2.5 py-1 rounded-lg border border-[#E8E0F0]">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                  {cw.webAppUrl && (
                    <a href={cw.webAppUrl} target="_blank" rel="noopener noreferrer" className="text-[#6F42C1] hover:underline flex items-center gap-1 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Web App</span>
                    </a>
                  )}
                  {cw.softwareUrl && (
                    <a href={cw.softwareUrl} target="_blank" rel="noopener noreferrer" className="text-[#8E2D9D] hover:underline flex items-center gap-1 bg-[#FAF5FF] px-2.5 py-1 rounded-lg border border-[#E8E0F0]">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Software</span>
                    </a>
                  )}
                  {cw.mobileAppInfo && (
                    <span className="text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-[#1E1B2E]">
            <button
              onClick={() => setStatusModalProject(null)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0]">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E1B2E]">Update Status & Notify Client</h2>
                <p className="text-xs text-[#5F5A72]">{statusModalProject.title}</p>
              </div>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] space-y-2">
                <div className="text-[#5F5A72] flex justify-between">
                  <span>Current Status:</span>
                  <span className="font-bold text-[#1E1B2E] uppercase">{statusModalProject.status}</span>
                </div>
                <div className="text-[#5F5A72] flex justify-between">
                  <span>Recipient Client:</span>
                  <span className="font-medium text-[#8E2D9D]">{statusModalProject.clientEmail || statusModalProject.clientName}</span>
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">New Project Status</label>
                <select
                  value={newStatusSelect}
                  onChange={e => setNewStatusSelect(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-semibold"
                >
                  <option value="planning">PLANNING</option>
                  <option value="in_progress">IN PROGRESS</option>
                  <option value="review">IN REVIEW (UAT)</option>
                  <option value="completed">COMPLETED (100% Milestone Handover)</option>
                  <option value="on_hold">ON HOLD</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Custom Notes / Progress Summary</label>
                <textarea
                  rows={3}
                  value={emailNotes}
                  onChange={e => setEmailNotes(e.target.value)}
                  placeholder="Notes regarding deliverables, test environments, or completion handover..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0]">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailCheck}
                    onChange={e => setSendEmailCheck(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E8E0F0] text-[#8E2D9D] focus:ring-0 accent-[#8E2D9D]"
                  />
                  <div>
                    <span className="text-[#1E1B2E] font-medium block">Dispatch Official Project Email Notification</span>
                    <span className="text-[11px] text-[#5F5A72] block">Sends formal status transition email to {statusModalProject.clientEmail || 'client'} from admin@fusionforgecreation.com</span>
                  </div>
                </label>
              </div>

              {statusSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{statusSuccessMsg}</span>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setStatusModalProject(null)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] border border-[#E8E0F0] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingStatus}
                  onClick={handleExecuteStatusChange}
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] disabled:opacity-50 text-white font-semibold flex items-center gap-2 shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-[#1E1B2E] space-y-4">
            <button
              onClick={() => setHistoryDrawerProject(null)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0]">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E1B2E]">Project Status History & Email Trail</h2>
                <p className="text-xs text-[#5F5A72]">{historyDrawerProject.title} ({historyDrawerProject.clientName})</p>
              </div>
            </div>

            <div className="space-y-3">
              {historyDrawerProject.statusHistory && historyDrawerProject.statusHistory.length > 0 ? (
                historyDrawerProject.statusHistory.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F3E8FF] text-[#8E2D9D] border border-[#E8E0F0]">
                          {item.newStatus}
                        </span>
                        {item.previousStatus && (
                          <span className="text-[#5F5A72] text-[11px]">from {item.previousStatus}</span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#817B91] font-mono">
                        {new Date(item.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <p className="text-[#1E1B2E]">{item.notes}</p>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#E8E0F0] text-[#5F5A72]">
                      <span>Changed by: {item.changedBy}</span>
                      {item.emailSentToClient ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-medium">
                          <Check className="w-3 h-3" />
                          Email sent to {item.clientEmail || 'client'}
                        </span>
                      ) : (
                        <span className="text-[#817B91]">No email sent</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#FAF5FF] text-center text-xs text-[#817B91] border border-[#E8E0F0]">
                  No previous transition records logged yet.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setHistoryDrawerProject(null)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] border border-[#E8E0F0] text-xs font-semibold cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE GENERATION FEEDBACK & DUPLICATE WARNING */}
      {invoicePromptProject && invoiceFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative text-[#1E1B2E] space-y-4">
            <button
              onClick={() => {
                setInvoicePromptProject(null);
                setInvoiceFeedback(null);
              }}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                invoiceFeedback.success 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {invoiceFeedback.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-bold text-[#1E1B2E] text-base">
                  {invoiceFeedback.success ? 'Tax Invoice Generated' : 'Invoice Notice'}
                </h3>
                <p className="text-xs text-[#5F5A72]">{invoicePromptProject.title}</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] leading-relaxed bg-[#FAF5FF] p-3 rounded-xl border border-[#E8E0F0]">
              {invoiceFeedback.message}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              {!invoiceFeedback.success && (
                <button
                  onClick={() => handleRaiseInvoice(invoicePromptProject, true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
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
                className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-[#1E1B2E]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#8E2D9D]" />
              {editingProjectId ? 'Edit Project Engagement' : 'Create Managed Project'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Set project timelines, client link, deliverables, and progress tracking.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Financial Intelligence Platform"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Associated Client</label>
                  <select
                    value={clientId}
                    onChange={e => {
                      setClientId(e.target.value);
                      const matched = clients.find(c => c.id === e.target.value);
                      if (matched?.email) setClientEmail(matched.email);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName || c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Client Email Address</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  >
                    <option value="Web Application">Web Application</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Enterprise Cloud">Enterprise Cloud</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Enterprise ERP">Enterprise ERP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Status</label>
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
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-semibold"
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
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Contract Budget (₹)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Completion % ({progressPercentage}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercentage}
                    onChange={e => setProgressPercentage(Number(e.target.value))}
                    className="w-full mt-2 accent-[#8E2D9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              {status === 'completed' && (
                <div>
                  <label className="block text-emerald-700 font-semibold mb-1">Actual Completion Date</label>
                  <input
                    type="date"
                    value={completionDate || new Date().toISOString().split('T')[0]}
                    onChange={e => setCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-emerald-300 text-[#1E1B2E] outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="React 19, TypeScript, Node.js, PostgreSQL"
                  value={techStackInput}
                  onChange={e => setTechStackInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Deliverables List (comma separated)</label>
                <input
                  type="text"
                  placeholder="Doctor Portal, Patient App, WebRTC Telehealth, SAC 998314 Invoicing"
                  value={deliverablesInput}
                  onChange={e => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Public URL / Live Link</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={publicUrl}
                    onChange={e => setPublicUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Web App / Portal URL</label>
                  <input
                    type="url"
                    placeholder="https://app.example.com"
                    value={webAppUrl}
                    onChange={e => setWebAppUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Software / Code URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={softwareUrl}
                    onChange={e => setSoftwareUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Mobile App Information</label>
                  <input
                    type="text"
                    placeholder="e.g. Play Store APK / iOS TestFlight"
                    value={mobileAppInfo}
                    onChange={e => setMobileAppInfo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Notes & Scope Details</label>
                <textarea
                  rows={2}
                  placeholder="Scope details, architectural milestones..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E8E0F0] text-[#8E2D9D] focus:ring-0 accent-[#8E2D9D]"
                  />
                  <span className="text-[#1E1B2E] font-medium">Show in Public Agency Showcase</span>
                </label>

                {editingProjectId && (
                  <label className="flex items-center space-x-2 cursor-pointer text-[#8E2D9D]">
                    <input
                      type="checkbox"
                      checked={notifyClientOnSave}
                      onChange={e => setNotifyClientOnSave(e.target.checked)}
                      className="w-4 h-4 rounded border-[#E8E0F0] text-[#8E2D9D] focus:ring-0 accent-[#8E2D9D]"
                    />
                    <span className="font-medium">Send project update notification email to {clientEmail || 'client'} on save</span>
                  </label>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] border border-[#E8E0F0] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-semibold shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-[#1E1B2E]">
            <button
              onClick={() => setIsCwModalOpen(false)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1 flex items-center gap-2">
              <Archive className="w-5 h-5 text-emerald-600" />
              {editingCwId ? 'Edit Historical Completed Work' : 'Add Historical Completed Work'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Archive confidential-safe project details to the company's internal portfolio history.
            </p>

            <form onSubmit={handleSaveCompletedWork} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Party / Client Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Fintech Solutions Pvt. Ltd."
                  value={cwClientName}
                  onChange={e => setCwClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Project / Work Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Financial Intelligence Platform"
                  value={cwProjectTitle}
                  onChange={e => setCwProjectTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Work Category</label>
                  <select
                    value={cwCategory}
                    onChange={e => setCwCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                  >
                    <option value="Web Application & Real-time Trading">Web Application & Real-time Trading</option>
                    <option value="Enterprise Cloud & IoT Telematics">Enterprise Cloud & IoT Telematics</option>
                    <option value="Enterprise ERP & Inventory Automation">Enterprise ERP & Inventory Automation</option>
                    <option value="B2B E-Commerce & Wholesale Distribution">B2B E-Commerce & Wholesale Distribution</option>
                    <option value="Mobile App & Healthcare Telemedicine">Mobile App & Healthcare Telemedicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Completion Date</label>
                  <input
                    type="date"
                    required
                    value={cwCompletionDate}
                    onChange={e => setCwCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Technology / Type (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="React 19, TypeScript, PostgreSQL, Tailwind CSS"
                  value={cwTechInput}
                  onChange={e => setCwTechInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Short Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of engineering achievements, architecture, and production impact..."
                  value={cwDescription}
                  onChange={e => setCwDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Deliverables Summary (comma separated)</label>
                <input
                  type="text"
                  placeholder="High-throughput MQTT ingestion, Live map clustering, Mobile App APK"
                  value={cwDeliverablesInput}
                  onChange={e => setCwDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Public URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={cwPublicUrl}
                    onChange={e => setCwPublicUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Web Application URL</label>
                  <input
                    type="url"
                    placeholder="https://app.example.com"
                    value={cwWebAppUrl}
                    onChange={e => setCwWebAppUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Software URL / Repo</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={cwSoftwareUrl}
                    onChange={e => setCwSoftwareUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Mobile App Information</label>
                  <input
                    type="text"
                    placeholder="e.g. Driver Android GPS Telematics App"
                    value={cwMobileAppInfo}
                    onChange={e => setCwMobileAppInfo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF5FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setIsCwModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF5FF] text-[#5F5A72] border border-[#E8E0F0] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  {editingCwId ? 'Update Record' : 'Save to Historical Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Project Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete Project</h2>
                <p className="text-xs text-red-600 font-semibold">Confirm permanent removal</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to permanently delete managed project <strong className="text-[#1E1B2E]">"{projectToDelete.title}"</strong>?
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteManagedProject(projectToDelete.id);
                  success('Project Deleted', `"${projectToDelete.title}" was deleted.`);
                  setProjectToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Completed Work Modal */}
      {cwToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete Historical Record</h2>
                <p className="text-xs text-red-600 font-semibold">Confirm permanent removal</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to delete historical portfolio entry <strong className="text-[#1E1B2E]">"{cwToDelete.projectTitle}"</strong>?
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setCwToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCompletedWork(cwToDelete.id);
                  success('Record Deleted', `"${cwToDelete.projectTitle}" removed from archive.`);
                  setCwToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
