import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  ChevronDown, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FaqItem } from '../../types';

export const FaqsManager: React.FC = () => {
  const { faqs, addFaq, updateFaq, deleteFaq } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<FaqItem['category']>('General');
  const [isPublished, setIsPublished] = useState(true);

  const openCreateModal = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: FaqItem) => {
    setEditingId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setCategory(item.category);
    setIsPublished(item.isPublished);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateFaq(editingId, {
        question,
        answer,
        category,
        isPublished
      });
    } else {
      addFaq({
        question,
        answer,
        category,
        order: faqs.length + 1,
        isPublished
      });
    }
    setIsModalOpen(false);
  };

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  const filteredFaqs = faqs.filter(f => {
    const matchesSearch = 
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-blue-400" />
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-sm text-slate-400">
            Manage agency questions, engagement protocols, pricing clarifications, and deliverables.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer keywords..."
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

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.map(faq => (
          <div
            key={faq.id}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {faq.category}
                </span>
                <h3 className="font-bold text-white text-sm">{faq.question}</h3>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  faq.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {faq.isPublished ? 'Published' : 'Draft'}
                </span>
                <button
                  onClick={() => openEditModal(faq)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete FAQ "${faq.question}"?`)) {
                      deleteFaq(faq.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pl-1">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
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
              <HelpCircle className="w-5 h-5 text-blue-400" />
              {editingId ? 'Edit FAQ' : 'Add FAQ'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Provide clear answers to common inquiries and service expectations.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Pricing & GST">Pricing & GST</option>
                  <option value="Technical">Technical</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How does Fusion Forge Creation structure milestones?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide comprehensive details and terms..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-slate-300 font-medium">Publish on Public Website FAQ Section</span>
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
                  {editingId ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
