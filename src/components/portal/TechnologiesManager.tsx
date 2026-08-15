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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-blue-400" />
            Technologies & Stack Catalog
          </h1>
          <p className="text-sm text-slate-400">
            Manage your engineering toolset, stack proficiencies, and website presentation highlights.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Technology</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search technologies, libraries, databases..."
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
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {tech.category}
                </span>
                {tech.isFeatured && (
                  <span className="p-1 rounded bg-amber-500/10 text-amber-400" title="Featured">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-base mb-1">{tech.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{tech.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Mastery Level</span>
                <span className="font-mono font-bold text-cyan-400">{tech.proficiency}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${tech.proficiency}%` }}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  onClick={() => openEditModal(tech)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete technology "${tech.name}"?`)) {
                      deleteTechnology(tech.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d1527] border border-slate-700 rounded-2xl shadow-2xl p-6 relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              {editingTechId ? 'Edit Technology' : 'Add Technology'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Specify stack metadata, proficiency rating, and public visibility.
            </p>

            <form onSubmit={handleSaveTech} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Technology Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React 19 & Next.js"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                >
                  <option value="Frontend & UI">Frontend & UI</option>
                  <option value="Backend & APIs">Backend & APIs</option>
                  <option value="Databases & Storage">Databases & Storage</option>
                  <option value="Cloud, DevOps & Tools">Cloud, DevOps & Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Use Case</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-throughput microservices & real-time streaming"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proficiency ({proficiency}%)</label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={proficiency}
                  onChange={e => setProficiency(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Show in Tech Stack Highlights</span>
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
