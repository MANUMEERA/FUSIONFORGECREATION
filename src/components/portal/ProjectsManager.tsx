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
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ManagedProject } from '../../types';

export const ProjectsManager: React.FC = () => {
  const { managedProjects, clients, addManagedProject, updateManagedProject, deleteManagedProject } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [category, setCategory] = useState('Web Application');
  const [status, setStatus] = useState<ManagedProject['status']>('in_progress');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
  const [budget, setBudget] = useState<number>(250000);
  const [progressPercentage, setProgressPercentage] = useState<number>(50);
  const [techStackInput, setTechStackInput] = useState('React 19, TypeScript, PostgreSQL, Tailwind CSS');
  const [deliverablesInput, setDeliverablesInput] = useState('Frontend UI, Backend API, Database Schema, Testing');
  const [isPublic, setIsPublic] = useState(true);
  const [notes, setNotes] = useState('');

  const openCreateModal = () => {
    setEditingProjectId(null);
    setTitle('');
    setClientId(clients[0]?.id || '');
    setCategory('Web Application');
    setStatus('in_progress');
    setStartDate(new Date().toISOString().split('T')[0]);
    setDeadline(new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]);
    setBudget(250000);
    setProgressPercentage(25);
    setTechStackInput('React 19, TypeScript, Node.js, PostgreSQL');
    setDeliverablesInput('Architecture, Frontend Dashboard, REST APIs, Documentation');
    setIsPublic(true);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (proj: ManagedProject) => {
    setEditingProjectId(proj.id);
    setTitle(proj.title);
    setClientId(proj.clientId);
    setCategory(proj.category);
    setStatus(proj.status);
    setStartDate(proj.startDate);
    setDeadline(proj.deadline);
    setBudget(proj.budget);
    setProgressPercentage(proj.progressPercentage);
    setTechStackInput(proj.techStack.join(', '));
    setDeliverablesInput(proj.deliverables.join(', '));
    setIsPublic(proj.isPublic);
    setNotes(proj.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId);
    const clientName = client ? client.companyName || client.name : 'Direct Client';

    const techStack = techStackInput.split(',').map(t => t.trim()).filter(Boolean);
    const deliverables = deliverablesInput.split(',').map(d => d.trim()).filter(Boolean);

    if (editingProjectId) {
      updateManagedProject(editingProjectId, {
        title,
        clientId,
        clientName,
        category,
        status,
        startDate,
        deadline,
        budget: Number(budget),
        progressPercentage: Number(progressPercentage),
        techStack,
        deliverables,
        isPublic,
        notes
      });
    } else {
      addManagedProject({
        title,
        clientId,
        clientName,
        category,
        status,
        startDate,
        deadline,
        budget: Number(budget),
        progressPercentage: Number(progressPercentage),
        techStack,
        deliverables,
        isPublic,
        notes
      });
    }

    setIsModalOpen(false);
  };

  const filteredProjects = managedProjects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-blue-400" />
            Projects & Engagements
          </h1>
          <p className="text-sm text-slate-400">
            Track active client deliverables, sprint milestones, budgets, and public portfolio case studies.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name, client, tech stack..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
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
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map(proj => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {proj.category}
                </span>
                <h3 className="font-bold text-white text-base mt-0.5">{proj.title}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{proj.clientName}</span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                proj.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : proj.status === 'in_progress'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : proj.status === 'planning'
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {proj.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Progress Bar */}
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

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-1.5">
              {proj.techStack.map((tech, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300">
                  {tech}
                </span>
              ))}
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-slate-500">Contract Value</div>
                <div className="font-bold text-white font-mono">₹{proj.budget.toLocaleString('en-IN')}</div>
              </div>

              <div className="flex items-center space-x-2">
                {proj.isPublic && (
                  <span className="p-1.5 rounded bg-cyan-500/10 text-cyan-400" title="Visible on Public Portfolio">
                    <Globe className="w-3.5 h-3.5" />
                  </span>
                )}
                <button
                  onClick={() => openEditModal(proj)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete project "${proj.title}"?`)) {
                      deleteManagedProject(proj.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Modal */}
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
              {editingProjectId ? 'Edit Project' : 'Create Managed Project'}
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
                    onChange={e => setClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName || c.name}</option>
                    ))}
                  </select>
                </div>

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
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
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
                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Show in Public Portfolio Showcase</span>
                </label>
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
                  {editingProjectId ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
