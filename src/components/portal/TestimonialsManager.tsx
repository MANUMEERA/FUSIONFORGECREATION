import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  X, 
  CheckCircle2, 
  Building2, 
  User 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TestimonialItem } from '../../types';

export const TestimonialsManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [projectName, setProjectName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [isApproved, setIsApproved] = useState(true);

  const openCreateModal = () => {
    setEditingId(null);
    setClientName('');
    setRole('Chief Technology Officer');
    setCompany('');
    setQuote('');
    setRating(5);
    setProjectName('');
    setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setIsApproved(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingId(item.id);
    setClientName(item.clientName);
    setRole(item.role);
    setCompany(item.company);
    setQuote(item.quote);
    setRating(item.rating);
    setProjectName(item.projectName);
    setAvatarUrl(item.avatarUrl);
    setIsApproved(item.isApproved);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTestimonial(editingId, {
        clientName,
        role,
        company,
        quote,
        rating: Number(rating),
        projectName,
        avatarUrl,
        isApproved
      });
    } else {
      addTestimonial({
        clientName,
        role,
        company,
        quote,
        rating: Number(rating),
        projectName,
        avatarUrl,
        isApproved
      });
    }
    setIsModalOpen(false);
  };

  const filteredTestimonials = testimonials.filter(t => {
    return (
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1B2E] flex items-center gap-2.5">
            <MessageSquareQuote className="w-6 h-6 text-[#8E2D9D]" />
            Client Reviews & Testimonials
          </h1>
          <p className="text-sm text-[#5F5A72]">
            Manage customer feedback, star ratings, and published social proof across the website.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-[#8E2D9D]/25 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
        <input
          type="text"
          placeholder="Search testimonials by client name, company, or quote text..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D2E3] text-xs text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D] shadow-xs"
        />
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTestimonials.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white border border-[#E8E0F0] hover:border-[#C084FC]/60 transition-all flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.isApproved ? 'bg-emerald-50 text-[#059669] border border-emerald-200' : 'bg-[#FAF5FF] text-[#5F5A72] border border-[#E8E0F0]'
                }`}>
                  {item.isApproved ? 'Live on Website' : 'Draft / Hidden'}
                </span>
              </div>

              <p className="text-xs text-[#4F4960] italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-[#E8E0F0] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={item.avatarUrl}
                  alt={item.clientName}
                  className="w-9 h-9 rounded-full object-cover border border-[#E8E0F0]"
                />
                <div>
                  <div className="font-bold text-[#1E1B2E] text-xs">{item.clientName}</div>
                  <div className="text-[10px] text-[#5F5A72]">{item.role}, {item.company}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] hover:text-[#8E2D9D] border border-[#E8E0F0] cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete testimonial from ${item.clientName}?`)) {
                      deleteTestimonial(item.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-[#FAF5FF] hover:bg-rose-50 text-[#5F5A72] hover:text-[#DC2626] border border-[#E8E0F0] cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-[#E8E0F0] rounded-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto text-[#1E1B2E]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#817B91] hover:text-[#1E1B2E] p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1 flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-[#8E2D9D]" />
              {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Enter customer testimonial details and presentation rating.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arvind Kapoor"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Role / Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Executive Officer"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Fintech Solutions"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-bold mb-1">Star Rating (1-5)</label>
                  <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] cursor-pointer"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-bold mb-1">Associated Project</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Financial Intelligence Platform"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-bold mb-1">Review Quote</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write the client's review and feedback..."
                  value={quote}
                  onChange={e => setQuote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9D2E3] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={e => setIsApproved(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D9D2E3] text-[#8E2D9D] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[#1E1B2E] font-semibold">Publish to Public Website Testimonials Section</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#E8E0F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#5F5A72] font-bold border border-[#E8E0F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#6F42C1] text-white font-bold shadow-md shadow-[#8E2D9D]/25 cursor-pointer"
                >
                  {editingId ? 'Update Review' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
