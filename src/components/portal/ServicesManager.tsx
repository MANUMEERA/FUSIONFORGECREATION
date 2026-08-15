import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Star, 
  X, 
  Sparkles,
  Layers,
  IndianRupee
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgencyService } from '../../types';

export const ServicesManager: React.FC = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState<number>(50000);
  const [sacCode, setSacCode] = useState('998314');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);

  const openCreateModal = () => {
    setEditingServiceId(null);
    setTitle('');
    setCategory('Engineering');
    setDescription('');
    setStartingPrice(50000);
    setSacCode('998314');
    setDeliverablesInput('Custom Architecture, Responsive UI/UX, Automated Testing');
    setActive(true);
    setFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (service: AgencyService) => {
    setEditingServiceId(service.id);
    setTitle(service.title);
    setCategory(service.category);
    setDescription(service.description);
    setStartingPrice(service.startingPrice);
    setSacCode(service.sacCode);
    setDeliverablesInput(service.deliverables.join(', '));
    setActive(service.active);
    setFeatured(service.featured);
    setIsModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const deliverables = deliverablesInput
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    if (editingServiceId) {
      updateService(editingServiceId, {
        title,
        category,
        description,
        startingPrice: Number(startingPrice),
        sacCode,
        deliverables,
        active,
        featured
      });
    } else {
      addService({
        title,
        category,
        description,
        startingPrice: Number(startingPrice),
        sacCode,
        deliverables,
        active,
        featured
      });
    }

    setIsModalOpen(false);
  };

  const filteredServices = services.filter(srv => {
    const matchesSearch = 
      srv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || srv.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(services.map(s => s.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-blue-400" />
            Services & Offerings
          </h1>
          <p className="text-sm text-slate-400">
            Manage your agency service capabilities, deliverables, SAC tax codes, and pricing tiers.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search services by title, technology, or scope..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map(srv => (
          <div
            key={srv.id}
            className={`p-5 rounded-2xl bg-slate-900/60 border transition-all flex flex-col justify-between ${
              srv.active ? 'border-slate-800/80 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {srv.category}
                </span>
                <div className="flex items-center space-x-1.5">
                  {srv.featured && (
                    <span className="p-1 rounded bg-amber-500/10 text-amber-400" title="Featured on Website">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    srv.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {srv.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-white text-base mb-1.5">{srv.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.description}</p>

              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Key Deliverables</div>
                <div className="flex flex-wrap gap-1.5">
                  {srv.deliverables.map((del, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                      {del}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 font-mono">SAC: {srv.sacCode}</div>
                <div className="font-bold text-white text-sm">
                  From ₹{srv.startingPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(srv)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit Service"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete service "${srv.title}"?`)) {
                      deleteService(srv.id);
                    }
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
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
              <Boxes className="w-5 h-5 text-blue-400" />
              {editingServiceId ? 'Edit Service Capability' : 'Add New Service'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Define pricing tiers, GST classification, and customer deliverables.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud Engineering"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Database">Database</option>
                    <option value="Design">Design</option>
                    <option value="Automation">Automation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={startingPrice}
                    onChange={e => setStartingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe technical capabilities and business value..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deliverables (comma separated)</label>
                <input
                  type="text"
                  placeholder="React 19, API Gateway, Docker Setup, SLA Warranty"
                  value={deliverablesInput}
                  onChange={e => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={e => setActive(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Service Active</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={e => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Featured on Home</span>
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
                  {editingServiceId ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
