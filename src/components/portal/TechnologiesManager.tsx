import React, { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  X, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Database, 
  Cloud 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TechnologyItem } from '../../types';

export const TechnologiesManager: React.FC = () => {
  const { technologies, addTechnology, updateTechnology, deleteTechnology } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechId, setEditingTechId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TechnologyItem['category']>('Frontend & UI');
  const [description, setDescription] = useState('');
  const [proficiency, setProficiency] = useState<number>(95);
  const [isFeatured, setIsFeatured] = useState(true);

  const openCreateModal = () => {
    setEditingTechId(null);
    setName('');
    setCategory('Frontend & UI');
    setDescription('');
    setProficiency(95);
    setIsFeatured(true);
    setIsModalOpen(true);
  };

  const openEditModal = (tech: TechnologyItem) => {
    setEditingTechId(tech.id);
    setName(tech.name);
    setCategory(tech.category);
    setDescription(tech.description);
    setProficiency(tech.proficiency);
    setIsFeatured(tech.isFeatured);
    setIsModalOpen(true);
  };

  const handleSaveTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTechId) {
      updateTechnology(editingTechId, {
        name,
        category,
        description,
        proficiency: Number(proficiency),
        isFeatured
      });
    } else {
      addTechnology({
        name,
        category,
        description,
        proficiency: Number(proficiency),
        isFeatured
      });
    }
    setIsModalOpen(false);
  };

  const filteredTechs = technologies.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1B2E] flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-[#8E2D9D]" />
            Technologies & Stack Catalog
          </h1>
          <p className="text-sm text-[#5F5A72]">
            Manage your engineering toolset, stack proficiencies, and website presentation highlights.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technology</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
          <input
            type="text"
            placeholder="Search technologies, libraries, databases..."
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
          <option value="Frontend & UI">Frontend & UI</option>
          <option value="Backend & APIs">Backend & APIs</option>
          <option value="Databases & Storage">Databases & Storage</option>
          <option value="Cloud, DevOps & Tools">Cloud, DevOps & Tools</option>
        </select>
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechs.map(tech => (
          <div
            key={tech.id}
            className="p-4 rounded-2xl bg-white border border-[#E8E0F0] hover:border-[#8E2D9D]/40 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
                  {tech.category}
                </span>
                {tech.isFeatured && (
                  <span className="p-1 rounded bg-amber-50 text-amber-600 border border-amber-200" title="Featured">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  </span>
                )}
              </div>

              <h3 className="font-bold text-[#1E1B2E] text-base mb-1">{tech.name}</h3>
              <p className="text-xs text-[#5F5A72] leading-relaxed mb-3">{tech.description}</p>
            </div>

            <div className="pt-3 border-t border-[#E8E0F0] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5F5A72]">Mastery Level</span>
                <span className="font-mono font-bold text-[#8E2D9D]">{tech.proficiency}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-[#8E2D9D] rounded-full"
                  style={{ width: `${tech.proficiency}%` }}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  onClick={() => openEditModal(tech)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#5F5A72] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete technology "${tech.name}"?`)) {
                      deleteTechnology(tech.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Technology Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-[#E8E0F0] rounded-2xl shadow-xl p-6 relative text-[#1E1B2E]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#8E2D9D]" />
              {editingTechId ? 'Edit Technology' : 'Add Technology'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Specify stack metadata, proficiency rating, and public visibility.
            </p>

            <form onSubmit={handleSaveTech} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Technology Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React 19 & Next.js"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] cursor-pointer"
                >
                  <option value="Frontend & UI">Frontend & UI</option>
                  <option value="Backend & APIs">Backend & APIs</option>
                  <option value="Databases & Storage">Databases & Storage</option>
                  <option value="Cloud, DevOps & Tools">Cloud, DevOps & Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Description / Use Case</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-throughput microservices & real-time streaming"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Proficiency ({proficiency}%)</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={proficiency}
                  onChange={e => setProficiency(Number(e.target.value))}
                  className="w-full accent-[#8E2D9D] cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8E2D9D] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[#1E1B2E] font-medium">Show in Tech Stack Highlights</span>
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
                  {editingTechId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
