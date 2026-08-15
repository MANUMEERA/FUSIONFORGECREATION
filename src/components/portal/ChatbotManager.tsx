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
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatbotQAItem, ChatbotSettings } from '../../types';

export const ChatbotManager: React.FC = () => {
  const { 
    chatbotQAs, 
    chatbotSettings, 
    addChatbotQA, 
    updateChatbotQA, 
    deleteChatbotQA, 
    updateChatbotSettings 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'qa_list' | 'simulator' | 'settings'>('qa_list');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      setKeywords([...keywords, trimmed]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleAddFollowUp = () => {
    const trimmed = followUpInput.trim();
    if (trimmed && !suggestedFollowUps.includes(trimmed)) {
      setSuggestedFollowUps([...suggestedFollowUps, trimmed]);
      setFollowUpInput('');
    }
  };

  const handleRemoveFollowUp = (fu: string) => {
    setSuggestedFollowUps(suggestedFollowUps.filter(f => f !== fu));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (editingId) {
      updateChatbotQA(editingId, {
        question: question.trim(),
        answer: answer.trim(),
        category,
        keywords,
        suggestedFollowUps,
        actionLink: actionLink.trim() || undefined,
        actionLabel: actionLabel.trim() || undefined,
        isActive
      });
    } else {
      addChatbotQA({
        question: question.trim(),
        answer: answer.trim(),
        category,
        keywords: keywords.length > 0 ? keywords : [question.toLowerCase().slice(0, 20)],
        suggestedFollowUps,
        actionLink: actionLink.trim() || undefined,
        actionLabel: actionLabel.trim() || undefined,
        isActive,
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
    if (newQuickPrompt.trim()) {
      setSettingsForm(prev => ({
        ...prev,
        quickPrompts: [...(prev.quickPrompts || []), newQuickPrompt.trim()]
      }));
      setNewQuickPrompt('');
    }
  };

  const handleRemoveQuickPrompt = (index: number) => {
    setSettingsForm(prev => ({
      ...prev,
      quickPrompts: prev.quickPrompts.filter((_, i) => i !== index)
    }));
  };

  // Simulator search logic
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
        // Increment matchCount locally
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0b1633] to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-white tracking-tight">
                Chatbot & Q&A Knowledge Base
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                chatbotSettings.enableBot ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {chatbotSettings.enableBot ? '● Bot Live on Website' : '○ Bot Disabled'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Control the public website assistant with automated Q&A matching, keyword trigger tags, contextual CTA buttons, and custom response flows.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === 'simulator' 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 font-extrabold' 
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-lg shadow-cyan-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Q&A Entry</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('qa_list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'qa_list'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Q&A Repository ({chatbotQAs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'simulator'
                ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Live Bot Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'settings'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Bot Configuration</span>
          </button>
        </div>

        <div className="text-xs text-slate-400">
          <span className="text-cyan-400 font-semibold">{chatbotQAs.filter(q => q.isActive).length}</span> Active Answers
        </div>
      </div>

      {/* TAB 1: Q&A Repository */}
      {activeTab === 'qa_list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions, answers, keywords, or triggers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
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
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only ({chatbotQAs.filter(q => q.isActive).length})</option>
              <option value="inactive">Inactive Only ({chatbotQAs.filter(q => !q.isActive).length})</option>
            </select>
          </div>

          {/* Q&A Cards List */}
          {filteredQAs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <Bot className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Chatbot Q&A Items Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No questions match your current search query or category filters. Try resetting the filters or create a new Q&A item.
              </p>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5 transition-all shadow-lg shadow-cyan-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Q&A</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredQAs.map(item => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl transition-all border ${
                    item.isActive 
                      ? 'bg-slate-900/70 border-slate-800/90 hover:border-cyan-500/40 shadow-sm' 
                      : 'bg-slate-950/60 border-slate-800/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Question & Answer */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {item.category || 'General'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.isActive 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.isActive ? 'Active in Bot' : 'Disabled'}
                        </span>

                        {item.matchCount !== undefined && item.matchCount > 0 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-400">
                            Triggered {item.matchCount} times
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight flex items-start space-x-2">
                        <span className="text-cyan-400 font-mono text-xs mt-1 font-bold">Q:</span>
                        <span>{item.question}</span>
                      </h3>

                      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                        {item.answer}
                      </div>

                      {/* Keywords / Trigger Tags */}
                      {item.keywords && item.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                            <Tag className="w-3 h-3 text-cyan-400" /> Triggers:
                          </span>
                          {item.keywords.map(kw => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700/60"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Link & Follow Ups */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                        {item.actionLabel && item.actionLink && (
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
                            <ExternalLink className="w-3 h-3" />
                            <span className="font-semibold">{item.actionLabel}</span>
                            <span className="text-slate-400 font-mono text-[10px]">({item.actionLink})</span>
                          </div>
                        )}

                        {item.suggestedFollowUps && item.suggestedFollowUps.length > 0 && (
                          <div className="flex items-center space-x-1 text-slate-400">
                            <CornerDownRight className="w-3 h-3 text-blue-400" />
                            <span>Follow-ups:</span>
                            <span className="text-slate-300 font-medium">{item.suggestedFollowUps.join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-2 shrink-0 self-end lg:self-start pt-2 lg:pt-0">
                      <button
                        onClick={() => updateChatbotQA(item.id, { isActive: !item.isActive })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 border ${
                          item.isActive
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 text-white'
                        }`}
                        title="Toggle Active/Inactive"
                      >
                        {item.isActive ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        <span>{item.isActive ? 'Active' : 'Enable'}</span>
                      </button>

                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600/20 border border-slate-700 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 transition-all"
                        title="Edit Q&A"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete Q&A item "${item.question}"?`)) {
                            deleteChatbotQA(item.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all"
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
          <div className="lg:col-span-2 bg-gradient-to-b from-[#070e24] to-[#040817] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
            {/* Simulator Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {chatbotSettings.botName}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h3>
                  <p className="text-[11px] text-cyan-400/80">{chatbotSettings.botSubtitle}</p>
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
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Chat</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {simMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {msg.actionLink && msg.actionLabel && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs shadow-md">
                          <span>{msg.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>

                  {/* Follow-up suggestions */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.followUps.map(fu => (
                        <button
                          key={fu}
                          onClick={() => handleSimSend(fu)}
                          className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 text-[11px] font-medium transition-all text-left"
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
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
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
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => handleSimSend()}
                disabled={!simInput.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Simulator Guidance & Quick Trigger Tester */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>How Q&A Matching Works</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The frontend virtual assistant parses queries using three levels of semantic matching:
              </p>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                <li><strong className="text-cyan-300">Exact Question Match:</strong> Highest priority matching on direct intent.</li>
                <li><strong className="text-cyan-300">Trigger Keywords:</strong> Fast token match against any configured keyword tags.</li>
                <li><strong className="text-cyan-300">Contextual Tokens:</strong> Word intersection across answer text and follow-ups.</li>
                <li><strong className="text-cyan-300">Fallback Handling:</strong> If no intent exceeds threshold, directs user to the Project Scope form and contact details.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Test Sample Inquiries</h3>
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
                    className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-all flex items-center justify-between"
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
        <div className="max-w-3xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>Virtual Assistant Configuration</span>
              </h2>
              <p className="text-xs text-slate-400">
                Customize the identity, greeting messages, quick starter prompt chips, and availability of the public website bot.
              </p>
            </div>

            {settingsSavedToast && (
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Settings Saved!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            {/* Master Bot Switch */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Enable Frontend Chatbot Widget</h4>
                <p className="text-slate-400 text-xs">When enabled, the floating conversational assistant appears on the public agency website.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.enableBot}
                  onChange={e => setSettingsForm(prev => ({ ...prev, enableBot: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bot Display Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.botName}
                  onChange={e => setSettingsForm(prev => ({ ...prev, botName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bot Subtitle / Agency Role</label>
                <input
                  type="text"
                  value={settingsForm.botSubtitle}
                  onChange={e => setSettingsForm(prev => ({ ...prev, botSubtitle: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Welcome Greeting Message</label>
              <textarea
                rows={3}
                required
                value={settingsForm.welcomeMessage}
                onChange={e => setSettingsForm(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fallback / Unrecognized Intent Message</label>
              <textarea
                rows={3}
                required
                value={settingsForm.fallbackMessage}
                onChange={e => setSettingsForm(prev => ({ ...prev, fallbackMessage: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
              />
            </div>

            {/* Quick Starter Prompts */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">Quick Starter Prompt Chips (Welcome Screen)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(settingsForm.quickPrompts || []).map((prompt, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 text-xs"
                  >
                    <span>{prompt}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuickPrompt(idx)}
                      className="text-slate-400 hover:text-rose-400"
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
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={handleAddQuickPrompt}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  Add Prompt
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Direct Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail || ''}
                  onChange={e => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Direct Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  value={settingsForm.contactPhone || ''}
                  onChange={e => setSettingsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end border-t border-slate-800">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE / EDIT Q&A MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#09122b] border border-slate-700/80 rounded-2xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              {editingId ? 'Modify Chatbot Q&A Item' : 'Add New Chatbot Q&A Item'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Specify user question intent, detailed answer, trigger keywords, and action call-to-action link.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
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
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={e => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span className="text-slate-200 font-medium">Active (Visible to Bot)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  User Question / Primary Intent <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How much does building a custom web application cost?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Answer Content <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide precise details, pricing breakdowns, milestone expectations, or direct answers..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 leading-relaxed font-mono text-xs"
                />
              </div>

              {/* Keywords Tag Input */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  Trigger Keywords & Synonyms (hit Enter or Add)
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-950 border border-slate-700">
                  {keywords.map(kw => (
                    <span
                      key={kw}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 text-[11px] font-mono border border-slate-700"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-400 hover:text-rose-400"
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
                    className="flex-1 bg-transparent text-white placeholder:text-slate-600 text-xs focus:outline-none min-w-[150px]"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Example keywords: <code>price</code>, <code>cost</code>, <code>budget</code>, <code>quote</code>, <code>estimate</code>
                </p>
              </div>

              {/* Suggested Follow-ups */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-semibold">
                  Suggested Follow-up Quick Reply Chips
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-950 border border-slate-700">
                  {suggestedFollowUps.map(fu => (
                    <span
                      key={fu}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-300 text-[11px] border border-blue-800/60"
                    >
                      <span>{fu}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFollowUp(fu)}
                        className="text-slate-400 hover:text-rose-400"
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
                    className="flex-1 bg-transparent text-white placeholder:text-slate-600 text-xs focus:outline-none min-w-[180px]"
                  />
                </div>
              </div>

              {/* Action Link & CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Action Link / Section Anchor
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. #contact, #services, #tech-stack, #projects"
                    value={actionLink}
                    onChange={e => setActionLink(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Get Instant Ballpark Quote"
                    value={actionLabel}
                    onChange={e => setActionLabel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30"
                >
                  {editingId ? 'Update Q&A Item' : 'Save Q&A Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
