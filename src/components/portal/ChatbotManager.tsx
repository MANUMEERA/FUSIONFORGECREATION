import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Send, 
  Sliders, 
  HelpCircle, 
  Tag, 
  ExternalLink, 
  CornerDownRight, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatbotQAItem, ChatbotSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const ChatbotManager: React.FC = () => {
  const { 
    chatbotQAs, 
    chatbotSettings, 
    addChatbotQA, 
    updateChatbotQA, 
    deleteChatbotQA, 
    updateChatbotSettings 
  } = useApp();

  const { success } = useToast();

  const [activeTab, setActiveTab] = useState<'qa_list' | 'simulator' | 'settings'>('qa_list');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qaToDelete, setQaToDelete] = useState<ChatbotQAItem | null>(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<string>('General');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);
  const [followUpInput, setFollowUpInput] = useState('');
  const [actionLink, setActionLink] = useState('');
  const [actionLabel, setActionLabel] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Settings local state
  const [settingsForm, setSettingsForm] = useState<ChatbotSettings>(chatbotSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const [newQuickPrompt, setNewQuickPrompt] = useState('');

  // Simulator State
  interface SimMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    matchedQAId?: string;
    matchedCategory?: string;
    actionLink?: string;
    actionLabel?: string;
    followUps?: string[];
    timestamp: string;
  }

  const [simMessages, setSimMessages] = useState<SimMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: chatbotSettings.welcomeMessage || 'Hello! How can I assist you with your software development requirements today?',
      followUps: chatbotSettings.quickPrompts || [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [simInput, setSimInput] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setKeywords([]);
    setKeywordInput('');
    setSuggestedFollowUps([]);
    setFollowUpInput('');
    setActionLink('#contact');
    setActionLabel('Get Instant Project Estimate');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ChatbotQAItem) => {
    setEditingId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setCategory(item.category || 'General');
    setKeywords(item.keywords || []);
    setKeywordInput('');
    setSuggestedFollowUps(item.suggestedFollowUps || []);
    setFollowUpInput('');
    setActionLink(item.actionLink || '');
    setActionLabel(item.actionLabel || '');
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords(prev => [...prev, trimmed]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(prev => prev.filter(k => k !== kw));
  };

  const handleAddFollowUp = () => {
    const trimmed = followUpInput.trim();
    if (trimmed && !suggestedFollowUps.includes(trimmed)) {
      setSuggestedFollowUps(prev => [...prev, trimmed]);
      setFollowUpInput('');
    }
  };

  const handleRemoveFollowUp = (fu: string) => {
    setSuggestedFollowUps(prev => prev.filter(f => f !== fu));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateChatbotQA(editingId, {
        question,
        answer,
        category,
        keywords,
        suggestedFollowUps,
        actionLink: actionLink || undefined,
        actionLabel: actionLabel || undefined,
        isActive,
        updatedAt: new Date().toISOString()
      });
    } else {
      addChatbotQA({
        question,
        answer,
        category,
        keywords,
        suggestedFollowUps,
        actionLink: actionLink || undefined,
        actionLabel: actionLabel || undefined,
        isActive,
        matchCount: 0,
        orderIndex: chatbotQAs.length + 1
      });
    }
    setIsModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateChatbotSettings(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const handleAddQuickPrompt = () => {
    const trimmed = newQuickPrompt.trim();
    if (trimmed) {
      setSettingsForm(prev => ({
        ...prev,
        quickPrompts: [...(prev.quickPrompts || []), trimmed]
      }));
      setNewQuickPrompt('');
    }
  };

  const handleRemoveQuickPrompt = (idx: number) => {
    setSettingsForm(prev => ({
      ...prev,
      quickPrompts: (prev.quickPrompts || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSimSend = (queryText?: string) => {
    const query = (queryText || simInput).trim();
    if (!query) return;

    const userMsg: SimMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSimMessages(prev => [...prev, userMsg]);
    if (!queryText) setSimInput('');

    // Match against active chatbot Q&As
    setTimeout(() => {
      const qLower = query.toLowerCase();
      const activeQAs = chatbotQAs.filter(q => q.isActive);

      let bestMatch: ChatbotQAItem | null = null;
      let highestScore = 0;

      for (const qa of activeQAs) {
        let score = 0;

        // Exact match with question
        if (qa.question.toLowerCase() === qLower) {
          score += 100;
        } else if (qa.question.toLowerCase().includes(qLower) || qLower.includes(qa.question.toLowerCase())) {
          score += 40;
        }

        // Keywords check
        for (const kw of qa.keywords || []) {
          const kwLower = kw.toLowerCase();
          if (qLower === kwLower) {
            score += 50;
          } else if (qLower.includes(kwLower)) {
            score += 25;
          }
        }

        // Token intersection
        const userTokens = qLower.split(/\s+/).filter(t => t.length > 2);
        for (const token of userTokens) {
          if (qa.question.toLowerCase().includes(token)) score += 10;
          if (qa.answer.toLowerCase().includes(token)) score += 5;
          for (const kw of qa.keywords || []) {
            if (kw.toLowerCase().includes(token)) score += 15;
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = qa;
        }
      }

      if (bestMatch && highestScore >= 15) {
        updateChatbotQA(bestMatch.id, { matchCount: (bestMatch.matchCount || 0) + 1 });

        const botMsg: SimMessage = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: bestMatch.answer,
          matchedQAId: bestMatch.id,
          matchedCategory: bestMatch.category,
          actionLink: bestMatch.actionLink,
          actionLabel: bestMatch.actionLabel,
          followUps: bestMatch.suggestedFollowUps,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSimMessages(prev => [...prev, botMsg]);
      } else {
        const fallbackMsg: SimMessage = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: chatbotSettings.fallbackMessage || "I couldn't find an exact match in our knowledge base. Would you like to submit a quick project enquiry or speak with our technical team?",
          followUps: ['What services do you offer?', 'How much does a web app cost?', 'Where are you located?'],
          actionLink: '#contact',
          actionLabel: 'Submit Project Enquiry',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setSimMessages(prev => [...prev, fallbackMsg]);
      }
    }, 300);
  };

  const categories = Array.from(new Set(chatbotQAs.map(q => q.category || 'General')));

  const filteredQAs = chatbotQAs.filter(qa => {
    const qText = qa.question.toLowerCase();
    const aText = qa.answer.toLowerCase();
    const kwText = (qa.keywords || []).join(' ').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = qText.includes(searchLower) || aText.includes(searchLower) || kwText.includes(searchLower);
    const matchesCat = categoryFilter === 'all' || qa.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? qa.isActive : !qa.isActive);

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E0F0] shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-[#FAF5FF] border border-[#C084FC]/30 text-[#8E2D9D] shadow-xs">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-[#1E1B2E] tracking-tight">
                Chatbot & Q&A Knowledge Base
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                chatbotSettings.enableBot ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {chatbotSettings.enableBot ? '● Bot Live on Website' : '○ Bot Disabled'}
              </span>
            </div>
            <p className="text-xs text-[#5F5A72] mt-1 max-w-2xl">
              Control the public website assistant with automated Q&A matching, keyword trigger tags, contextual CTA buttons, and custom response flows.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'simulator' 
                ? 'bg-[#8E2D9D] text-white shadow-xs' 
                : 'bg-white hover:bg-[#FAF8FF] text-[#5F5A72] border border-[#E8E0F0]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Q&A Entry</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('qa_list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'qa_list'
                ? 'bg-[#8E2D9D] text-white shadow-sm'
                : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-white border border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Q&A Repository ({chatbotQAs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-[#8E2D9D] text-white shadow-sm'
                : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-white border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Live Bot Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#8E2D9D] text-white shadow-sm'
                : 'text-[#5F5A72] hover:text-[#1E1B2E] hover:bg-white border border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Bot Configuration</span>
          </button>
        </div>

        <div className="text-xs text-[#5F5A72]">
          <span className="text-[#8E2D9D] font-bold">{chatbotQAs.filter(q => q.isActive).length}</span> Active Answers
        </div>
      </div>

      {/* TAB 1: Q&A Repository */}
      {activeTab === 'qa_list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#817B91]" />
              <input
                type="text"
                placeholder="Search questions, answers, keywords, or triggers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D] transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#817B91] hover:text-[#1E1B2E]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
            >
              <option value="all">All Categories ({chatbotQAs.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({chatbotQAs.filter(q => q.category === cat).length})
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E0F0] text-xs text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only ({chatbotQAs.filter(q => q.isActive).length})</option>
              <option value="inactive">Inactive Only ({chatbotQAs.filter(q => !q.isActive).length})</option>
            </select>
          </div>

          {/* Q&A Cards List */}
          {filteredQAs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-[#E8E0F0] space-y-3">
              <Bot className="w-10 h-10 text-[#817B91] mx-auto" />
              <h3 className="text-base font-bold text-[#1E1B2E]">No Chatbot Q&A Items Found</h3>
              <p className="text-xs text-[#5F5A72] max-w-md mx-auto">
                No questions match your current search query or category filters. Try resetting the filters or create a new Q&A item.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQAs.map(item => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-white border transition-all ${
                    item.isActive
                      ? 'border-[#E8E0F0] hover:border-[#C084FC] shadow-sm'
                      : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Content */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30">
                          {item.category || 'General'}
                        </span>
                        <span className="text-[11px] text-[#5F5A72] font-mono">
                          Triggered: <strong className="text-[#1E1B2E]">{item.matchCount || 0} times</strong>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#8E2D9D] shrink-0" />
                        <span>{item.question}</span>
                      </h3>

                      <div className="text-xs text-[#5F5A72] whitespace-pre-line leading-relaxed pl-6 border-l-2 border-[#E8E0F0]">
                        {item.answer}
                      </div>

                      {/* Keywords / Trigger Tags */}
                      {item.keywords && item.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-[#5F5A72] flex items-center gap-1 mr-1">
                            <Tag className="w-3 h-3 text-[#8E2D9D]" /> Triggers:
                          </span>
                          {item.keywords.map(kw => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded-md bg-[#FAF8FF] text-[#1E1B2E] text-[10px] font-mono border border-[#E8E0F0]"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Link & Follow Ups */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                        {item.actionLabel && item.actionLink && (
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#FAF5FF] border border-[#C084FC]/30 text-[#8E2D9D]">
                            <ExternalLink className="w-3 h-3" />
                            <span className="font-semibold">{item.actionLabel}</span>
                            <span className="text-[#5F5A72] font-mono text-[10px]">({item.actionLink})</span>
                          </div>
                        )}

                        {item.suggestedFollowUps && item.suggestedFollowUps.length > 0 && (
                          <div className="flex items-center space-x-1 text-[#5F5A72]">
                            <CornerDownRight className="w-3 h-3 text-[#8E2D9D]" />
                            <span>Follow-ups:</span>
                            <span className="text-[#1E1B2E] font-medium">{item.suggestedFollowUps.join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 shrink-0 self-end lg:self-start pt-2 lg:pt-0">
                      <button
                        onClick={() => updateChatbotQA(item.id, { isActive: !item.isActive })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 border cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Toggle Active/Inactive"
                      >
                        {item.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>{item.isActive ? 'Active' : 'Enable'}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl bg-[#FAF8FF] hover:bg-[#FAF5FF] border border-[#E8E0F0] text-[#5F5A72] hover:text-[#8E2D9D] transition-all cursor-pointer"
                        title="Edit Q&A"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setQaToDelete(item)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all cursor-pointer"
                        title="Delete Q&A"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Interactive Simulator */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Window Mockup */}
          <div className="lg:col-span-2 bg-white border border-[#E8E0F0] rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
            {/* Simulator Header */}
            <div className="p-4 bg-[#FAF8FF] border-b border-[#E8E0F0] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8E2D9D] to-[#6F42C1] flex items-center justify-center text-white shadow-xs font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center gap-1.5">
                    {chatbotSettings.botName}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </h3>
                  <p className="text-[11px] text-[#8E2D9D] font-semibold">{chatbotSettings.botSubtitle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSimMessages([
                      {
                        id: 'm1',
                        sender: 'bot',
                        text: chatbotSettings.welcomeMessage || 'Hello! How can I assist you with your software development requirements today?',
                        followUps: chatbotSettings.quickPrompts || [],
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#5F5A72] border border-[#E8E0F0] text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Chat</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#FAF8FF]/40">
              {simMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#8E2D9D] text-white font-medium rounded-tr-none'
                        : 'bg-white text-[#1E1B2E] border border-[#E8E0F0] rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {msg.actionLink && msg.actionLabel && (
                      <div className="mt-3 pt-2.5 border-t border-[#E8E0F0]">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30 font-bold text-xs">
                          <span>{msg.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-[#817B91] mt-1 px-1">{msg.timestamp}</span>

                  {/* Follow-up suggestions */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.followUps.map(fu => (
                        <button
                          key={fu}
                          onClick={() => handleSimSend(fu)}
                          className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF5FF] text-[#8E2D9D] border border-[#E8E0F0] hover:border-[#C084FC] text-[11px] font-medium transition-all text-left cursor-pointer"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#E8E0F0] flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask anything (e.g. 'how much for web app', 'sac 998314', 'contact manoj')..."
                value={simInput}
                onChange={e => setSimInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSimSend();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-xs text-[#1E1B2E] placeholder:text-[#817B91] focus:outline-none focus:border-[#8E2D9D]"
              />
              <button
                onClick={() => handleSimSend()}
                disabled={!simInput.trim()}
                className="p-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] disabled:opacity-40 text-white font-bold transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Simulator Guidance & Quick Trigger Tester */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-[#1E1B2E] flex items-center space-x-2">
                <Info className="w-4 h-4 text-[#8E2D9D]" />
                <span>How Q&A Matching Works</span>
              </h3>
              <p className="text-xs text-[#5F5A72] leading-relaxed">
                The frontend virtual assistant parses queries using three levels of semantic matching:
              </p>
              <ul className="text-xs text-[#5F5A72] space-y-2 list-disc pl-4">
                <li><strong className="text-[#1E1B2E]">Exact Question Match:</strong> Highest priority matching on direct intent.</li>
                <li><strong className="text-[#1E1B2E]">Trigger Keywords:</strong> Fast token match against any configured keyword tags.</li>
                <li><strong className="text-[#1E1B2E]">Contextual Tokens:</strong> Word intersection across answer text and follow-ups.</li>
                <li><strong className="text-[#1E1B2E]">Fallback Handling:</strong> If no intent exceeds threshold, directs user to the Project Scope form and contact details.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E8E0F0] space-y-3 shadow-sm">
              <h3 className="text-sm font-bold text-[#1E1B2E]">Test Sample Inquiries</h3>
              <div className="flex flex-col gap-2">
                {[
                  'What services do you offer?',
                  'How much does a React web app cost?',
                  'What is your SAC Code and GST number?',
                  'Do we get full copyright and source code?',
                  'How long does development take?',
                  'Where is Manoj Satapathy located?'
                ].map(sample => (
                  <button
                    key={sample}
                    onClick={() => handleSimSend(sample)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#FAF8FF] hover:bg-[#FAF5FF] text-xs text-[#5F5A72] hover:text-[#8E2D9D] border border-[#E8E0F0] transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{sample}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Bot Configuration */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl bg-white border border-[#E8E0F0] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E0F0] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1E1B2E] flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#8E2D9D]" />
                <span>Virtual Assistant Configuration</span>
              </h2>
              <p className="text-xs text-[#5F5A72]">
                Customize the identity, greeting messages, quick starter prompt chips, and availability of the public website bot.
              </p>
            </div>

            {settingsSavedToast && (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings Saved!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            {/* Master Bot Switch */}
            <div className="p-4 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#1E1B2E] text-sm">Enable Frontend Chatbot Widget</h4>
                <p className="text-[#5F5A72] text-xs">When enabled, the floating conversational assistant appears on the public agency website.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.enableBot}
                  onChange={e => setSettingsForm(prev => ({ ...prev, enableBot: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8E2D9D]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Bot Display Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.botName}
                  onChange={e => setSettingsForm(prev => ({ ...prev, botName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Bot Subtitle / Agency Role</label>
                <input
                  type="text"
                  value={settingsForm.botSubtitle}
                  onChange={e => setSettingsForm(prev => ({ ...prev, botSubtitle: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#1E1B2E] font-semibold mb-1">Welcome Greeting Message</label>
              <textarea
                rows={3}
                required
                value={settingsForm.welcomeMessage}
                onChange={e => setSettingsForm(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[#1E1B2E] font-semibold mb-1">Fallback / Unrecognized Intent Message</label>
              <textarea
                rows={3}
                required
                value={settingsForm.fallbackMessage}
                onChange={e => setSettingsForm(prev => ({ ...prev, fallbackMessage: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D] leading-relaxed"
              />
            </div>

            {/* Quick Starter Prompts */}
            <div className="space-y-2">
              <label className="block text-[#1E1B2E] font-semibold">Quick Starter Prompt Chips (Welcome Screen)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(settingsForm.quickPrompts || []).map((prompt, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FAF5FF] text-[#8E2D9D] border border-[#C084FC]/30 text-xs"
                  >
                    <span>{prompt}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuickPrompt(idx)}
                      className="text-[#5F5A72] hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type new starter prompt and click Add (e.g. 'What services do you offer?')..."
                  value={newQuickPrompt}
                  onChange={e => setNewQuickPrompt(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddQuickPrompt();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                />
                <button
                  type="button"
                  onClick={handleAddQuickPrompt}
                  className="px-4 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold cursor-pointer"
                >
                  Add Prompt
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Direct Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail || ''}
                  onChange={e => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">Direct Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  value={settingsForm.contactPhone || ''}
                  onChange={e => setSettingsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] focus:outline-none focus:border-[#8E2D9D]"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end border-t border-[#E8E0F0]">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE / EDIT Q&A MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-[#E8E0F0] rounded-2xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto text-[#1E1B2E]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#5F5A72] hover:text-[#1E1B2E] p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[#1E1B2E] mb-1 flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#8E2D9D]" />
              {editingId ? 'Modify Chatbot Q&A Item' : 'Add New Chatbot Q&A Item'}
            </h2>
            <p className="text-xs text-[#5F5A72] mb-5">
              Specify user question intent, detailed answer, trigger keywords, and action call-to-action link.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  >
                    <option value="General">General</option>
                    <option value="Services">Services & Offerings</option>
                    <option value="Pricing & Quotes">Pricing & Estimator</option>
                    <option value="Tech Stack">Tech Stack & Frameworks</option>
                    <option value="GST & Invoicing">GST & Invoicing (SAC 998314)</option>
                    <option value="Contact & Support">Contact & Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">Status</label>
                  <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={e => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded bg-white border-[#E8E0F0] text-[#8E2D9D] focus:ring-0"
                      />
                      <span className="text-[#1E1B2E] font-medium">Active (Visible to Bot)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">
                  User Question / Primary Intent <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How much does building a custom web application cost?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                />
              </div>

              <div>
                <label className="block text-[#1E1B2E] font-semibold mb-1">
                  Answer Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide precise details, pricing breakdowns, milestone expectations, or direct answers..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] leading-relaxed font-mono text-xs"
                />
              </div>

              {/* Keywords Tag Input */}
              <div className="space-y-1.5">
                <label className="block text-[#1E1B2E] font-semibold">
                  Trigger Keywords & Synonyms (hit Enter or Add)
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0]">
                  {keywords.map(kw => (
                    <span
                      key={kw}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#FAF5FF] text-[#8E2D9D] text-[11px] font-mono border border-[#C084FC]/30"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-[#5F5A72] hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type keyword and press Enter..."
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    className="flex-1 bg-transparent text-[#1E1B2E] placeholder:text-[#817B91] text-xs focus:outline-none min-w-[150px]"
                  />
                </div>
                <p className="text-[10px] text-[#5F5A72]">
                  Example keywords: <code>price</code>, <code>cost</code>, <code>budget</code>, <code>quote</code>, <code>estimate</code>
                </p>
              </div>

              {/* Suggested Follow-ups */}
              <div className="space-y-1.5">
                <label className="block text-[#1E1B2E] font-semibold">
                  Suggested Follow-up Quick Reply Chips
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0]">
                  {suggestedFollowUps.map(fu => (
                    <span
                      key={fu}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#FAF5FF] text-[#8E2D9D] text-[11px] border border-[#C084FC]/30"
                    >
                      <span>{fu}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFollowUp(fu)}
                        className="text-[#5F5A72] hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add follow-up prompt and press Enter..."
                    value={followUpInput}
                    onChange={e => setFollowUpInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFollowUp();
                      }
                    }}
                    className="flex-1 bg-transparent text-[#1E1B2E] placeholder:text-[#817B91] text-xs focus:outline-none min-w-[180px]"
                  />
                </div>
              </div>

              {/* Action Link & CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">
                    Action Link / Section Anchor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #contact, #services, #tech-stack, #projects"
                    value={actionLink}
                    onChange={e => setActionLink(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#1E1B2E] font-semibold mb-1">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Get Instant Ballpark Quote"
                    value={actionLabel}
                    onChange={e => setActionLabel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8FF] border border-[#E8E0F0] text-[#1E1B2E] outline-none focus:border-[#8E2D9D]"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-[#8E2D9D] hover:bg-[#732280] text-white font-bold shadow-xs cursor-pointer"
                >
                  {editingId ? 'Update Q&A Item' : 'Save Q&A Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete QA Item Modal */}
      {qaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-red-200 rounded-3xl shadow-2xl p-6 relative text-[#1E1B2E]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E1B2E]">Delete Q&A Item</h2>
                <p className="text-xs text-red-600 font-semibold">Confirm removal</p>
              </div>
            </div>

            <p className="text-xs text-[#5F5A72] mb-4 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#1E1B2E]">"{qaToDelete.question}"</strong> from the chatbot knowledge base?
            </p>

            <div className="pt-3 border-t border-[#E8E0F0] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setQaToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#5F5A72] font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteChatbotQA(qaToDelete.id);
                  success('Q&A Item Deleted', `"${qaToDelete.question}" was removed.`);
                  setQaToDelete(null);
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
