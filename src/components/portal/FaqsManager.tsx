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
  Layers,
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FaqItem } from '../../types';
import { useToast } from '../../context/ToastContext';

export const FaqsManager: React.FC = () => {
  const { faqs, addFaq, updateFaq, deleteFaq } = useApp();
  const { success } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

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
          <h1 className="text-2xl font-bold text-[#1E1B2E] flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-[#8E2D9D]" />
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-sm text-[#5F5A72]">
            Manage agency questions, engagement protocols, pricing clarifications, and deliverables.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-semibold text-xs flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer keywords..."
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

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.map(faq => (
          <div
            key={faq.id}
            className="p-4 rounded-2xl bg-white border border-[#E8E0F0] hover:border-[#8E2D9D]/40 transition-all space-y-2 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
                  {faq.category}
                </span>
                <h3 className="font-bold text-[#1E1B2E] text-sm">{faq.question}</h3>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  faq.isPublished ? 'bg-emerald-50 text-[#059669] border border-emerald-200' : 'bg-slate-100 text-[#817B91] border border-slate-200'
                }`}>
                  {faq.isPublished ? 'Published' : 'Draft'}
                </span>
                <button
                  onClick={() => openEditModal(faq)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#5F5A72] hover:text-[#1E1B2E] transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFaqToDelete(faq)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-[#817B91] hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] leading-relaxed pl-1">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {faqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete FAQ</h2>
                <p className="text-xs text-red-600 font-semibold">Confirm removal</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#1E1B2E]">"{faqToDelete.question}"</strong>?
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setFaqToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFaq(faqToDelete.id);
                  success('FAQ Deleted', 'The question was removed.');
                  setFaqToDelete(null);
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

      {/* Modal */}
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
              <HelpCircle className="w-5 h-5 text-[#8E2D9D]" />
              {editingId ? 'Edit FAQ' : 'Add FAQ'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Provide clear answers to common inquiries and service expectations.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Pricing & GST">Pricing & GST</option>
                  <option value="Technical">Technical</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How does Fusion Forge Creation structure milestones?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide comprehensive details and terms..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#8E2D9D] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[#1E1B2E] font-medium">Publish on Public Website FAQ Section</span>
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
