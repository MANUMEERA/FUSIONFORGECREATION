import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  RotateCcw, 
  ChevronDown, 
  ExternalLink,
  Phone,
  Mail,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatbotQAItem } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  matchedQAId?: string;
  category?: string;
  actionLink?: string;
  actionLabel?: string;
  followUps?: string[];
  timestamp: string;
}

export const FrontendChatbot: React.FC = () => {
  const { chatbotQAs, chatbotSettings, updateChatbotQA } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showCallout, setShowCallout] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome_1',
      sender: 'bot',
      text: chatbotSettings.welcomeMessage || 'Hello! 👋 Welcome to Fusion Forge Creation. I am your instant virtual advisor. Ask me about our software engineering services, tech stack, custom quotes, GST compliance, or timelines!',
      followUps: chatbotSettings.quickPrompts || [
        'What services do you offer?',
        'How much does a web app cost?',
        'What is your tech stack?',
        'Are your invoices GST compliant (SAC 998314)?',
        'How to get a formal Quotation?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // If bot is disabled in admin settings, do not render
  if (!chatbotSettings.enableBot) {
    return null;
  }

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    setHasInteracted(true);
    setShowCallout(false);

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate intelligent bot thinking and search matching
    setTimeout(() => {
      const qLower = query.toLowerCase();
      const activeQAs = chatbotQAs.filter(q => q.isActive);

      let bestMatch: ChatbotQAItem | null = null;
      let highestScore = 0;

      for (const qa of activeQAs) {
        let score = 0;
        const qaQuestionLower = qa.question.toLowerCase();
        const qaAnswerLower = qa.answer.toLowerCase();

        // Exact match
        if (qaQuestionLower === qLower) {
          score += 120;
        } else if (qaQuestionLower.includes(qLower) || qLower.includes(qaQuestionLower)) {
          score += 50;
        }

        // Keywords check
        for (const kw of qa.keywords || []) {
          const kwLower = kw.toLowerCase().trim();
          if (qLower === kwLower) {
            score += 60;
          } else if (qLower.includes(kwLower)) {
            score += 35;
          }
        }

        // Token intersection
        const userTokens = qLower.split(/\s+/).filter(t => t.length > 2);
        for (const token of userTokens) {
          if (qaQuestionLower.includes(token)) score += 12;
          if (qaAnswerLower.includes(token)) score += 6;
          for (const kw of qa.keywords || []) {
            if (kw.toLowerCase().includes(token)) score += 18;
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = qa;
        }
      }

      if (bestMatch && highestScore >= 14) {
        // Increment match count
        try {
          updateChatbotQA(bestMatch.id, { matchCount: (bestMatch.matchCount || 0) + 1 });
        } catch {
          // silently handle
        }

        const botReply: Message = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: bestMatch.answer,
          matchedQAId: bestMatch.id,
          category: bestMatch.category,
          actionLink: bestMatch.actionLink,
          actionLabel: bestMatch.actionLabel,
          followUps: bestMatch.suggestedFollowUps,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botReply]);
      } else {
        // Fallback response
        const fallbackReply: Message = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: chatbotSettings.fallbackMessage || "I couldn't find an exact match in our knowledge base, but our engineering directors can provide specific guidance. Would you like to submit a quick project enquiry or speak directly with our technical team?",
          actionLink: '#contact',
          actionLabel: 'Submit Project Scope Enquiry',
          followUps: [
            'What services do you offer?',
            'How much does a web app cost?',
            'Where are you located?'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackReply]);
      }
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (link?: string) => {
    if (!link) return;
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    } else {
      window.open(link, '_blank');
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: chatbotSettings.welcomeMessage || 'Hello! 👋 How can I assist you with your software development requirements today?',
        followUps: chatbotSettings.quickPrompts || [
          'What services do you offer?',
          'How much does a web app cost?',
          'What is your tech stack?'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button with Tooltip */}
      {!isOpen && (
        <div className="relative flex items-center">
          {/* Greeting Callout Bubble */}
          {showCallout && !hasInteracted && (
            <div className="absolute right-16 mr-3 bg-gradient-to-r from-slate-900/95 to-[#0b1633]/95 text-white text-xs font-semibold px-3.5 py-2 rounded-2xl border border-cyan-500/40 shadow-xl shadow-cyan-950/40 backdrop-blur-md whitespace-nowrap animate-bounce flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Need help? Ask <strong>{chatbotSettings.botName}</strong></span>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowCallout(false); }}
                className="text-slate-400 hover:text-white ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setIsOpen(true);
              setShowCallout(false);
            }}
            aria-label="Open Interactive Chatbot"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-400/60 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20 group"
          >
            <Bot className="w-7 h-7 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[390px] md:w-[420px] h-[580px] max-h-[85vh] bg-gradient-to-b from-[#060c1d] via-[#091536] to-[#040918] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/70 backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900/90 border-b border-cyan-500/20 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
                  {chatbotSettings.botName}
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI ASSISTANT</span>
                </h3>
                <p className="text-[10px] text-cyan-400/90 font-medium">{chatbotSettings.botSubtitle}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleResetChat}
                title="Restart Conversation"
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-md text-xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-tr-sm shadow-cyan-900/30'
                      : 'bg-slate-900/90 text-slate-100 border border-slate-800/90 rounded-tl-sm shadow-black/40'
                  }`}
                >
                  {msg.text}

                  {/* Contextual Action CTA Button */}
                  {msg.actionLink && msg.actionLabel && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800">
                      <button
                        onClick={() => handleActionClick(msg.actionLink)}
                        className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-98"
                      >
                        <span>{msg.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 px-1 font-mono">{msg.timestamp}</span>

                {/* Follow-up Quick Reply Chips */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1 max-w-[95%]">
                    {msg.followUps.map((fu, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(fu)}
                        className="px-2.5 py-1 rounded-xl bg-[#0b1b42]/80 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/60 text-[11px] font-medium transition-all text-left shadow-sm active:scale-95 flex items-center space-x-1"
                      >
                        <span>{fu}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center space-x-1.5 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-cyan-400 w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.3s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Contact Footer Bar */}
          <div className="px-4 py-1.5 bg-[#050b1a] border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Fast Response • GST SAC 998314
            </span>
            <div className="flex items-center space-x-3">
              {chatbotSettings.contactPhone && (
                <a
                  href={`tel:${chatbotSettings.contactPhone}`}
                  className="hover:text-cyan-300 flex items-center gap-1"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call</span>
                </a>
              )}
              {chatbotSettings.contactEmail && (
                <a
                  href={`mailto:${chatbotSettings.contactEmail}`}
                  className="hover:text-cyan-300 flex items-center gap-1"
                >
                  <Mail className="w-2.5 h-2.5" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-950/90 border-t border-cyan-500/20 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Type your inquiry (e.g. quotes, tech stack, SAC code)..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Send message"
                className="p-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <Send className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
