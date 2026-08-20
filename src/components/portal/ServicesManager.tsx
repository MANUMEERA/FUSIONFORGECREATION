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
  IndianRupee,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgencyService } from '../../types';
import { useToast } from '../../context/ToastContext';

export const ServicesManager: React.FC = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<AgencyService | null>(null);

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
          <h1 className="text-2xl font-bold text-[#1E1B2E] flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-[#8E2D9D]" />
            Services & Offerings
          </h1>
          <p className="text-sm text-[#5F5A72]">
            Manage your agency service capabilities, deliverables, SAC tax codes, and pricing tiers.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
          <input
            type="text"
            placeholder="Search services by title, technology, or scope..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#5F5A72] focus:outline-none focus:border-[#8E2D9D] cursor-pointer"
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
            className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-xs ${
              srv.active ? 'border-[#E8E0F0] hover:border-[#8E2D9D]/40' : 'border-[#E8E0F0]/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
                  {srv.category}
                </span>
                <div className="flex items-center space-x-1.5">
                  {srv.featured && (
                    <span className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-200" title="Featured on Website">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    srv.active ? 'bg-emerald-50 text-[#059669] border border-emerald-200' : 'bg-slate-100 text-[#817B91] border border-slate-200'
                  }`}>
                    {srv.active ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-[#1E1B2E] text-base mb-1.5">{srv.title}</h3>
              <p className="text-xs text-[#5F5A72] leading-relaxed mb-4">{srv.description}</p>

              <div className="space-y-1.5 mb-4">
                <div className="text-[10px] uppercase font-bold text-[#817B91] tracking-wider">Key Deliverables</div>
                <div className="flex flex-wrap gap-1.5">
                  {srv.deliverables.map((del, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#FAF5FF] border border-[#E8E0F0] text-[11px] text-[#5F5A72]">
                      {del}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E0F0] flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#817B91] font-mono">SAC: {srv.sacCode}</div>
                <div className="font-bold text-[#1E1B2E] text-sm">
                  From ₹{srv.startingPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(srv)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#5F5A72] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                  title="Edit Service"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setServiceToDelete(srv)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete Service</h2>
                <p className="text-xs text-red-600 font-semibold">Confirm permanent removal</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to permanently delete service <strong className="text-[#1E1B2E]">"{serviceToDelete.title}"</strong>?
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteService(serviceToDelete.id);
                  success('Service Deleted', `"${serviceToDelete.title}" has been deleted.`);
                  setServiceToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Service</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto text-[#1E1B2E]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#8E2D9D]" />
              {editingServiceId ? 'Edit Service Capability' : 'Add New Service'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Define pricing tiers, GST classification, and customer deliverables.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Cloud Engineering"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Database">Database</option>
                    <option value="Design">Design</option>
                    <option value="Automation">Automation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={startingPrice}
                    onChange={e => setStartingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Service Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe technical capabilities and business value..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Deliverables (comma separated)</label>
                <input
                  type="text"
                  placeholder="React 19, API Gateway, Docker Setup, SLA Warranty"
                  value={deliverablesInput}
                  onChange={e => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={e => setActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8E2D9D] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[#1E1B2E] font-medium">Service Active</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={e => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8E2D9D] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[#1E1B2E] font-medium">Featured on Home</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-semibold shadow-xs cursor-pointer"
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
