'use client';

import { useState } from 'react';
import { ContentTemplate, ContentTone, ContentPlatform } from '@/lib/types';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { generatePropertyCaption } from '@/lib/groq';
import { 
  Sparkles, 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Plus,
  ArrowRight,
  Settings,
  Clock3,
  BarChart3,
  CalendarDays,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// --- Custom Brand Icons ---
const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

interface QueuedItem {
  id: string;
  property: any;
  platform: ContentPlatform;
  caption: string;
  suggestedTime: string;
  status: 'waiting' | 'scheduled' | 'published';
}

export default function ContentStudioPage() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(MOCK_PROPERTIES[0].id);
  const [tone, setTone] = useState<ContentTone>('profesional');
  const [template, setTemplate] = useState<ContentTemplate>('grand_launching');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlatform, setActivePlatform] = useState<ContentPlatform>('instagram');
  const [captions, setCaptions] = useState<Partial<Record<ContentPlatform, string>>>({});
  const [queue, setQueue] = useState<QueuedItem[]>([
    {
      id: 'q1',
      property: MOCK_PROPERTIES[1],
      platform: 'instagram',
      caption: 'Siap-siap punya rumah sendiri! 🏠✨ Cluster Premium Colomadu unit terakhir sudah tersedia. Lokasi strategis dekat tol dan bandara. Jangan sampai telat! #RumahSolo #InvestasiProperti',
      suggestedTime: 'Sabtu, 19:30 (High Traffic)',
      status: 'waiting'
    },
    {
      id: 'q2',
      property: MOCK_PROPERTIES[2],
      platform: 'facebook',
      caption: 'Promo Spesial Lebaran! Vila Tropis Ungaran diskon s/d 100jt. Udara sejuk, view gunung, kolam renang pribadi. Hubungi kami untuk kunjungan lokasi.',
      suggestedTime: 'Besok, 09:15',
      status: 'scheduled'
    }
  ]);

  const selectedProperty = MOCK_PROPERTIES.find(p => p.id === selectedPropertyId)!;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Map Property to Listing for Groq function
      const listing: any = {
        name: selectedProperty.name,
        type: 'rumah',
        price_min: 1000000000, // Dummy mapping
        location_city: selectedProperty.location,
        specs: {
          kamar_tidur: selectedProperty.specs.beds,
          kamar_mandi: selectedProperty.specs.baths,
          luas_tanah: selectedProperty.specs.size,
        },
        facilities: selectedProperty.features || [],
        description: selectedProperty.description
      };

      const result = await generatePropertyCaption({
        listing,
        template,
        tone,
        platforms: ['instagram', 'facebook', 'tiktok'],
        language: 'indonesia'
      });
      
      setCaptions(result);
    } catch (error) {
      console.error('Failed to generate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const addToQueue = (platform: ContentPlatform) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setQueue(prev => [{
      id: newId,
      property: selectedProperty,
      platform,
      caption: captions[platform] || '',
      suggestedTime: 'AI Suggestion: Besok, 18:00',
      status: 'waiting'
    }, ...prev]);
  };

  const approveItem = (id: string) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'scheduled' } : item
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">Content Studio</h1>
          <p className="text-sm font-normal text-text-gray/50">Buat konten marketing & otomatisasi iklan dengan AI</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-gray overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-blue text-white-pure flex items-center justify-center text-[10px] font-bold shadow-sm">
              +12
            </div>
          </div>
          <div className="h-8 w-[1px] bg-border-line/10"></div>
          <button className="p-2.5 rounded-xl bg-white-pure border border-border-line/10 text-text-gray hover:text-brand-blue transition-colors shadow-sm">
            <Settings size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Stats - Premium Summary Design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Konten di Antrean', value: queue.filter(i => i.status === 'scheduled').length, change: '+4', isPos: true, icon: CalendarDays, color: 'text-brand-blue', bg: 'bg-brand-blue/5', gradient: 'from-blue-500/10 to-transparent' },
          { label: 'Menunggu Approval', value: queue.filter(i => i.status === 'waiting').length, change: 'Urgent', isPos: false, icon: Clock3, color: 'text-orange-600', bg: 'bg-orange-50', gradient: 'from-orange-500/10 to-transparent' },
          { label: 'Posting Berhasil', value: '124', change: '+12%', isPos: true, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
          { label: 'AI Health Status', value: '98%', change: 'Optimum', isPos: true, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50', gradient: 'from-purple-500/10 to-transparent' },
        ].map((stat, i) => (
          <div key={i} className="bg-white-pure p-6 rounded-[2.5rem] border border-border-line/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <stat.icon size={22} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${stat.isPos ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border border-current/5`}>
                  {stat.isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] uppercase font-semibold text-text-gray/50 tracking-wider truncate">{stat.label}</p>
              <h3 className="text-2xl font-medium text-text-dark mt-0.5 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Magic Compose Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white-pure rounded-[2.5rem] border border-border-line/10 shadow-xl overflow-hidden shadow-brand-blue/5">
            <div className="bg-gradient-to-br from-brand-blue to-brand-blue-deep p-6 text-white-pure">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Magic Compose</h3>
                  <p className="text-white/60 text-xs">AI-Powered Content Generator</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Select Property */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-gray uppercase tracking-widest pl-1">Pilih Properti</label>
                <div className="grid grid-cols-1 gap-2">
                  {MOCK_PROPERTIES.slice(0, 3).map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setSelectedPropertyId(p.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${selectedPropertyId === p.id ? 'bg-brand-blue/5 border-brand-blue/20 ring-1 ring-brand-blue/10' : 'bg-surface-gray/50 border-transparent hover:bg-surface-gray'}`}
                    >
                      <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={p.name} />
                      <div className="text-left overflow-hidden">
                        <p className={`text-sm font-bold truncate ${selectedPropertyId === p.id ? 'text-brand-blue' : 'text-text-dark'}`}>{p.name}</p>
                        <p className="text-[10px] text-text-gray font-medium truncate">{p.location}</p>
                      </div>
                      {selectedPropertyId === p.id && <CheckCircle2 size={16} className="text-brand-blue ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone & Template */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-text-gray uppercase tracking-widest pl-1">Vibe / Tone</label>
                  <select 
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full bg-surface-gray/50 border border-border-line/10 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-brand-blue/5 outline-none font-medium text-text-dark appearance-none cursor-pointer"
                  >
                    <option value="profesional">🏛️ Profesional</option>
                    <option value="santai">☕ Santai / Gaul</option>
                    <option value="urgensi">🔥 Urgensi / FOMO</option>
                    <option value="storytelling">📖 Storytelling</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-text-gray uppercase tracking-widest pl-1">Template</label>
                  <select 
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as any)}
                    className="w-full bg-surface-gray/50 border border-border-line/10 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-brand-blue/5 outline-none font-medium text-text-dark appearance-none cursor-pointer"
                  >
                    <option value="grand_launching">🚀 Launching</option>
                    <option value="promo_terbatas">🎁 Promo</option>
                    <option value="unit_terakhir">😱 Unit Terakhir</option>
                    <option value="info_kpr">🏦 Info KPR</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-brand-blue/20 bg-brand-blue text-white-pure hover:bg-brand-blue-deep active:scale-[0.98] ${isGenerating ? 'opacity-80' : ''}`}
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Konten AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-3xl">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white-pure flex items-center justify-center shrink-0">
                <BarChart3 size={20} />
              </div>
              <div>
                <p className="text-emerald-900 font-bold text-sm">Saran AI Hari Ini</p>
                <p className="text-emerald-700/80 text-xs mt-1 leading-relaxed">
                  Postingan bertema <strong>"Storytelling"</strong> di Instagram pada jam 19:00 malam ini diperkirakan akan meningkatkan engagement 40%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white-pure rounded-[2.5rem] border border-border-line/10 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            <div className="p-6 border-bottom border-border-line/5 flex items-center justify-between bg-surface-gray/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className="text-text-gray" />
                <h3 className="font-bold text-text-dark">Live Social Preview</h3>
              </div>
              
              <div className="flex bg-white-pure/80 p-1.5 rounded-full border border-border-line/10 shadow-sm">
                {[
                  { id: 'instagram', icon: InstagramIcon, color: activePlatform === 'instagram' ? 'bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white' : 'text-text-gray hover:bg-surface-gray' },
                  { id: 'facebook', icon: FacebookIcon, color: activePlatform === 'facebook' ? 'bg-[#1877f2] text-white' : 'text-text-gray hover:bg-surface-gray' },
                  { id: 'tiktok', icon: TikTokIcon, color: activePlatform === 'tiktok' ? 'bg-[#000000] text-white' : 'text-text-gray hover:bg-surface-gray' },
                ].map((plat) => (
                  <button 
                    key={plat.id}
                    onClick={() => setActivePlatform(plat.id as any)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${plat.color}`}
                  >
                    <plat.icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Phone Mockup */}
              <div className="flex justify-center">
                <div className="relative w-[280px] h-[580px] bg-black rounded-[3rem] border-8 border-[#1a1a1a] shadow-2xl overflow-hidden">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                  
                  {/* Platform Header */}
                  <div className="bg-white p-4 pt-8 border-b border-border-line/5 flex items-center justify-between">
                    <p className="text-xs font-black tracking-tight">{activePlatform.toUpperCase()}</p>
                    <Plus size={18} />
                  </div>

                  {/* Content Area */}
                  <div className="bg-white h-full overflow-y-auto no-scrollbar">
                    {/* User info */}
                    <div className="flex items-center gap-2 p-3">
                      <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-[10px] font-bold text-brand-blue">PN</div>
                      <p className="text-[10px] font-bold">PropNest Official</p>
                    </div>
                    {/* Image */}
                    <div className="aspect-square bg-surface-gray">
                      <img src={selectedProperty.image} className="w-full h-full object-cover" alt="prev" />
                    </div>
                    {/* Interaction */}
                    <div className="flex items-center gap-3 p-3 text-text-gray">
                      <X className="rotate-45" size={20} />
                      <TikTokIcon size={20} />
                      <Send size={20} />
                    </div>
                    {/* Caption Preview */}
                    <div className="px-3 pb-8">
                      <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                        <span className="font-bold mr-1">propnestofficial</span>
                        {captions[activePlatform] || 'Klik tombol Generate untuk membuat caption otomatis dengan AI Llama 3.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor & Action */}
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-text-gray uppercase tracking-widest flex items-center justify-between">
                      Caption Editor
                      <span className="bg-surface-gray px-2 py-0.5 rounded text-[10px] text-text-gray/60 font-medium">Auto-saved</span>
                    </label>
                    <textarea 
                      value={captions[activePlatform] || ''}
                      onChange={(e) => setCaptions(prev => ({ ...prev, [activePlatform]: e.target.value }))}
                      placeholder="Caption akan muncul di sini..."
                      className="w-full h-[320px] bg-surface-gray/30 border border-border-line/10 rounded-3xl p-5 text-sm focus:ring-4 focus:ring-brand-blue/5 outline-none resize-none font-medium leading-relaxed"
                    />
                  </div>

                  <div className="p-5 bg-brand-blue/[0.03] border border-brand-blue/10 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white-pure shadow-sm flex items-center justify-center text-brand-blue shrink-0">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">AI Suggestion</p>
                        <p className="text-sm font-bold text-brand-blue">Besok, Jam 19:45</p>
                      </div>
                    </div>
                    <button className="text-brand-blue hover:text-brand-blue-deep font-bold text-xs p-2">Ubah</button>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => addToQueue(activePlatform)}
                    disabled={!captions[activePlatform]}
                    className="w-full py-4 bg-white-pure border border-brand-blue/20 text-brand-blue rounded-full font-bold hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale"
                  >
                    <span>Masukkan ke Antrean</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full py-4 bg-brand-blue text-white-pure rounded-full font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                    <Send size={18} />
                    <span>Post Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Queue Section */}
      <div className="bg-white-pure rounded-[2.5rem] border border-border-line/10 shadow-xl overflow-hidden mt-12 mb-20 animate-in slide-in-from-bottom-8 duration-1000">
        <div className="p-8 border-b border-border-line/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Calendar size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-dark">Antrean Konten Otomatis</h3>
              <p className="text-text-gray text-sm font-medium">Kelola dan setujui jadwal publikasi konten Anda</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-surface-gray/50 px-4 py-2 rounded-full border border-border-line/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-text-dark">AUTO-PILOT ACTIVE</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-gray/30 text-left border-b border-border-line/5">
                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Konten / Properti</th>
                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Platform</th>
                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Jadwal Posting</th>
                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-text-gray uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-line/5">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-surface-gray/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={item.property.image} className="w-14 h-14 rounded-xl object-cover shadow-md" alt="p" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Sparkles size={12} className="text-brand-blue" />
                        </div>
                      </div>
                      <div className="max-w-[300px]">
                        <p className="font-bold text-text-dark truncate">{item.property.name}</p>
                        <p className="text-xs text-text-gray mt-1 line-clamp-1">{item.caption}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       {item.platform === 'instagram' && <InstagramIcon size={16} className="text-[#E4405F]" />}
                       {item.platform === 'facebook' && <FacebookIcon size={16} className="text-[#1877F2]" />}
                       {item.platform === 'tiktok' && <TikTokIcon size={16} className="text-black" />}
                       <span className="text-sm font-semibold text-text-dark capitalize">{item.platform}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-dark">{item.suggestedTime.replace('AI Suggestion: ', '')}</span>
                      {item.suggestedTime.includes('AI') && (
                        <span className="text-[10px] text-brand-blue font-black tracking-wider uppercase mt-0.5">Recommended by AI</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {item.status === 'waiting' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                        <Clock size={12} strokeWidth={2.5} />
                        Approval Required
                      </span>
                    ) : item.status === 'scheduled' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                        <CalendarDays size={12} strokeWidth={2.5} />
                        Scheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        Published
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {item.status === 'waiting' ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => approveItem(item.id)}
                          className="w-10 h-10 rounded-xl bg-emerald-500 text-white-pure flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all hover:scale-110"
                          title="Setujui"
                        >
                          <Check size={20} strokeWidth={3} />
                        </button>
                        <button 
                          className="w-10 h-10 rounded-xl bg-white-pure border border-border-line/10 text-text-gray hover:text-red-500 transition-all shadow-sm flex items-center justify-center"
                          title="Tolak"
                        >
                          <X size={20} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <button className="p-2 text-text-gray hover:text-text-dark transition-colors">
                        <MoreVertical size={20} strokeWidth={1.5} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-surface-gray/30 border-t border-border-line/5 text-center">
            <button className="text-sm font-bold text-brand-blue hover:text-brand-blue-deep transition-colors px-6 py-2">
              Lihat Semua Antrean (History)
            </button>
        </div>
      </div>
    </div>
  );
}
