'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X, Send, User, Bot, Loader2, Minus, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { trackChatbotClick } from '@/hooks/useTrackChatbotClick';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SuggestionChip {
  label: string;
  text: string;
}

export interface AIPageContext {
  page: 'dashboard' | 'properti' | 'public';
  property?: {
    title?: string;
    name?: string;
    location?: string;
    price?: number | string;
    type?: string;
    badge?: string;
    bedrooms?: number;
    bathrooms?: number;
    land_area?: number;
    building_area?: number;
    specs?: { beds?: number; baths?: number; size?: number };
  };
  lat?: number | null;
  lng?: number | null;
  developer_id?: string | null;  // user_id of the property owner
}

// Context-aware suggestion chips
const CHIPS_BY_CONTEXT: Record<string, SuggestionChip[]> = {
  dashboard: [
    { label: '🏠 Listing Aktif', text: 'Ada berapa listing properti saya dan berapa total nilai portofolionya?' },
    { label: '👥 Leads Terbaru', text: 'Siapa saja leads yang paling baru masuk? Urutkan dari yang terbaru.' },
    { label: '💰 Ringkasan Deals', text: 'Tampilkan ringkasan pipeline deals saya per tahapan.' },
    { label: '✍️ Caption IG', text: 'Buatkan caption Instagram yang menarik untuk properti terbaru saya.' },
    { label: '📞 Draft Follow-up', text: 'Bantu saya buat pesan WhatsApp follow-up yang persuasif untuk leads yang belum direspons.' },
    { label: '📊 Performa Bisnis', text: 'Berikan analisis singkat performa bisnis properti saya berdasarkan data yang ada.' },
  ],
  properti: [
    { label: '💰 Hitung Cicilan KPR', text: 'Hitung estimasi cicilan KPR properti ini dengan DP 20% tenor 15 tahun.' },
    { label: '📍 Fasilitas Terdekat', text: 'Apa saja fasilitas terdekat dari properti ini? Sekolah, rumah sakit, atau pusat perbelanjaan?' },
    { label: '📈 Nilai Investasi', text: 'Mengapa properti ini menarik sebagai investasi? Jelaskan potensi kenaikan nilainya.' },
    { label: '🏡 Keunggulan Properti', text: 'Ceritakan keunggulan utama dari properti ini dibanding properti lain di area yang sama.' },
    { label: '🚗 Akses Transportasi', text: 'Bagaimana akses transportasi dan kemudahan mobilitas dari lokasi properti ini?' },
  ],
  public: [
    { label: '🏡 Rekomendasi Rumah', text: 'Rekomendasikan properti yang tersedia untuk keluarga muda dengan budget 1 miliar.' },
    { label: '💳 Simulasi KPR', text: 'Hitung simulasi cicilan KPR untuk properti seharga 1 miliar dengan DP 20%.' },
    { label: '📍 Daerah Terbaik', text: 'Di daerah mana saja properti tersedia? Mana yang paling strategis?' },
    { label: '📈 Pilih yang Tepat', text: 'Apa tips memilih properti yang tepat sebagai hunian sekaligus investasi?' },
  ],
};

function getContext(pathname: string): AIPageContext['page'] {
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  if (pathname.startsWith('/properti')) return 'properti';
  return 'public';
}

function getWelcomeMessage(context: AIPageContext['page']): string {
  switch (context) {
    case 'dashboard':
      return '👋 Halo! Saya **NusaEstate AI**, asisten bisnis Anda.\n\nSaya terhubung ke database properti, leads, dan deals Anda secara real-time. Tanyakan apa saja — dari analisis performa hingga draft pesan follow-up!';
    case 'properti':
      return '👋 Halo! Saya **NusaEstate AI**, agen properti digital Anda.\n\nSaya tahu detail properti ini dan fasilitas di sekitarnya. Ingin tahu estimasi cicilan KPR, keunggulan lokasi, atau nilai investasinya? Tanya saja!';
    default:
      return '👋 Halo! Saya **NusaEstate AI**.\n\nSaya bisa bantu Anda menemukan properti impian, menghitung simulasi KPR, atau menjawab pertanyaan seputar properti. Mulai dari mana?';
  }
}

interface NusaEstateAIProps {
  pageContext?: AIPageContext;
}

export default function NusaEstateAI({ pageContext }: NusaEstateAIProps) {
  const pathname = usePathname();
  const derivedContext = pageContext?.page || getContext(pathname || '');
  const chips = CHIPS_BY_CONTEXT[derivedContext] || CHIPS_BY_CONTEXT.public;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: getWelcomeMessage(derivedContext) }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const isFirstRender = useRef(true);

  // Reset messages when navigating to a different context
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const ctx = pageContext?.page || getContext(pathname || '');
    setMessages([{ role: 'assistant', content: getWelcomeMessage(ctx) }]);
  }, [pathname, pageContext?.page]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Track message sent (only from public/property pages, not dashboard)
    if (pageContext?.page !== 'dashboard') {
      trackChatbotClick({
        developer_id: pageContext?.developer_id,
        property_id: (pageContext?.property as any)?.id,
        page: pageContext?.page || 'public',
      });
    }

    try {
      const contextToSend: AIPageContext = pageContext || {
        page: getContext(pathname || ''),
      };

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          pageContext: contextToSend,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const contextLabel = derivedContext === 'dashboard'
    ? 'Business Intelligence'
    : derivedContext === 'properti'
    ? 'Property Advisor'
    : 'Property Assistant';

  return (
    <>
      {/* Integrated Floating Action Button */}
      <div 
        className={`fixed bottom-6 right-6 flex items-center z-50 transition-all duration-500 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-105'
        }`}
      >
        <button 
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="hidden md:flex items-center bg-gradient-to-l from-brand-blue to-brand-blue-deep pl-7 pr-12 py-3.5 rounded-l-full -mr-10 shadow-2xl border-y border-l border-white/20 text-[11px] font-bold text-white-pure whitespace-nowrap animate-fade-in-right tracking-wide hover:pr-14 transition-all cursor-pointer"
        >
          Tanya NusaEstate AI
        </button>
        <button
          suppressHydrationWarning
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="w-16 h-16 bg-brand-blue text-white-pure rounded-full shadow-[0_10px_40px_rgba(29,78,216,0.3)] flex items-center justify-center transition-all duration-500 group shrink-0 relative border-2 border-white-pure"
        >
          <Sparkles className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" size={28} />
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed right-6 bottom-6 w-[420px] max-w-[calc(100vw-3rem)] bg-white-pure rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-border-line/20 flex flex-col overflow-hidden transition-all duration-500 ease-in-out z-50 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        } ${isMinimized ? 'h-[72px]' : 'h-[640px] max-h-[85vh]'}`}
      >
        {/* Header */}
        <div className="p-4 bg-brand-blue flex items-center justify-between text-white-pure shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white-pure/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-display font-medium text-sm leading-tight">NusaEstate AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-medium opacity-80 uppercase tracking-widest">{contextLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white-pure/10 rounded-lg transition-all"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white-pure/10 rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages + Chips */}
        {!isMinimized && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FBFBFE]">
              {/* Suggestion Chips */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {chips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chip.text)}
                      className="px-3 py-1.5 bg-white-pure border border-brand-blue/20 rounded-xl text-[10px] font-bold text-brand-blue hover:bg-brand-blue hover:text-white-pure transition-all shadow-sm active:scale-95"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'assistant' ? 'bg-brand-blue text-white-pure' : 'bg-white-pure text-text-gray/40 border border-border-line/20'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'assistant'
                      ? 'bg-white-pure border border-border-line/10 text-text-dark rounded-tl-none'
                      : 'bg-brand-blue text-white-pure rounded-tr-none'
                  }`}>
                    <div className="prose prose-sm max-w-none prose-slate">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-white-pure" />
                  </div>
                  <div className="bg-white-pure border border-border-line/10 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-brand-blue/50 rounded-full animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-2 h-2 bg-brand-blue/50 rounded-full animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-2 h-2 bg-brand-blue/50 rounded-full animate-bounce [animation-delay:300ms]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white-pure border-t border-border-line/10 shrink-0">
              <div className="relative flex items-center">
                <input
                  suppressHydrationWarning
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={
                    derivedContext === 'dashboard'
                      ? 'Tanya tentang properti, leads, atau deals...'
                      : derivedContext === 'properti'
                      ? 'Tanya KPR, fasilitas terdekat, keunggulan...'
                      : 'Cari properti, simulasi KPR, tanya-tanya...'
                  }
                  className="w-full bg-surface-gray/50 border border-transparent rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:bg-white-pure focus:border-brand-blue/20 outline-none transition-all shadow-inner"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 p-2 rounded-xl transition-all ${
                    input.trim() && !isLoading
                      ? 'bg-brand-blue text-white-pure shadow-lg shadow-brand-blue/20 hover:scale-105'
                      : 'text-text-gray/30'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-center text-text-gray/30 mt-2 font-medium uppercase tracking-[0.1em]">
                NusaEstate AI · Powered by Groq
              </p>
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}
