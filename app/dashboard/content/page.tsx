'use client';

import { useState, useEffect, useTransition } from 'react';
import { ContentTemplate, ContentTone, ContentPlatform } from '@/lib/types';
import { saveToQueue, approvePost, deletePost, getDeveloperProperties, getContentQueue, publishNow } from '@/lib/content/actions';
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

export default function ContentStudioPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [tone, setTone] = useState<ContentTone>('profesional');
  const [template, setTemplate] = useState<ContentTemplate>('grand_launching');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlatform, setActivePlatform] = useState<ContentPlatform>('instagram');
  const [captions, setCaptions] = useState<Partial<Record<ContentPlatform, string>>>({});
  const [queue, setQueue] = useState<any[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [isSaving, startSaveTransition] = useTransition();
  const [isApproving, startApproveTransition] = useTransition();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoadingQueue(true);
      const [props, queueData] = await Promise.all([
        getDeveloperProperties(),
        getContentQueue()
      ]);
      setProperties(props);
      if (props.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(props[0].id);
      }
      setQueue(queueData);
      setIsLoadingQueue(false);
    }
    loadData();
  }, []);

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  const handleGenerate = async () => {
    if (!selectedProperty) {
      showToast('Pilih properti terlebih dahulu!');
      return;
    }
    setIsGenerating(true);
    try {
      // Map real property data to Listing format
      const listing: any = {
        name: selectedProperty.title,
        type: selectedProperty.type || 'rumah',
        price_min: selectedProperty.price || 0,
        price_max: null,
        location_city: selectedProperty.location_city || 'Indonesia',
        location_address: selectedProperty.address || '',
        specs: {
          kamar_tidur: selectedProperty.specs?.bedrooms || selectedProperty.specs?.kamar_tidur,
          kamar_mandi: selectedProperty.specs?.bathrooms || selectedProperty.specs?.kamar_mandi,
          luas_tanah: selectedProperty.specs?.land_area || selectedProperty.specs?.luas_tanah,
          luas_bangunan: selectedProperty.specs?.building_area || selectedProperty.specs?.luas_bangunan,
        },
        facilities: selectedProperty.facilities || [],
        description: selectedProperty.description || ''
      };

      const result = await generatePropertyCaption({
        listing,
        template,
        tone,
        platforms: ['instagram', 'facebook', 'tiktok'],
        language: 'indonesia'
      });
      
      setCaptions(result);
      showToast('✨ Caption berhasil digenerate!');
    } catch (error) {
      console.error('Failed to generate:', error);
      showToast('Gagal generate caption. Coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addToQueue = (platform: ContentPlatform) => {
    const caption = captions[platform];
    if (!caption || !selectedPropertyId) return;

    startSaveTransition(async () => {
      try {
        await saveToQueue({
          propertyId: selectedPropertyId,
          platform,
          caption,
          tone,
          template,
          scheduledAt: null,
        });
        // Optimistic update
        setQueue(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          property_id: selectedPropertyId,
          properties: selectedProperty,
          platform,
          caption,
          tone,
          template,
          status: 'waiting',
          created_at: new Date().toISOString(),
        }, ...prev]);
        showToast('✅ Berhasil masuk ke antrean!');
      } catch (e: any) {
        showToast(e.message || 'Gagal menyimpan.');
      }
    });
  };

  const approveItem = (id: string) => {
    startApproveTransition(async () => {
      try {
        await approvePost(id);
        setQueue(prev => prev.map(item =>
          item.id === id ? { ...item, status: 'scheduled' } : item
        ));
        showToast('✅ Post dijadwalkan!');
      } catch (e: any) {
        showToast(e.message || 'Gagal menyetujui.');
      }
    });
  };

  const removeItem = (id: string) => {
    startSaveTransition(async () => {
      try {
        await deletePost(id);
        setQueue(prev => prev.filter(item => item.id !== id));
        showToast('🗑️ Post dihapus.');
      } catch (e: any) {
        showToast(e.message || 'Gagal menghapus.');
      }
    });
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-text-dark text-white-pure px-6 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">
            Studio Konten AI
          </h1>
          <p className="text-sm font-normal text-text-gray/50">Buat konten marketing & jadwalkan iklan dengan AI</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-xl bg-white-pure border border-border-line/10 text-text-gray hover:text-brand-blue transition-colors shadow-sm">
            <Settings size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Stats - Premium Summary Design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Konten Terjadwal', value: queue.filter(i => i.status === 'scheduled').length, change: '+4', isPos: true, icon: CalendarDays, color: 'text-brand-blue', bg: 'bg-brand-blue/5', gradient: 'from-blue-500/10 to-transparent' },
          { label: 'Menunggu Approval', value: queue.filter(i => i.status === 'waiting').length, change: 'Urgent', isPos: false, icon: Clock3, color: 'text-orange-600', bg: 'bg-orange-50', gradient: 'from-orange-500/10 to-transparent' },
          { label: 'Berhasil Diposting', value: queue.filter(i => i.status === 'published').length, change: '+12%', isPos: true, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
          { label: 'Kesehatan AI', value: '98%', change: 'Optimum', isPos: true, icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50', gradient: 'from-purple-500/10 to-transparent' },
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
                  <p className="text-white/60 text-xs">Generator Konten AI</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Select Property */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-gray uppercase tracking-widest pl-1">Pilih Properti</label>
                <div className="grid grid-cols-1 gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {properties.length === 0 ? (
                    <div className="text-center py-6 text-text-gray/40 text-sm">
                      <p>Belum ada properti aktif.</p>
                      <a href="/dashboard/listing" className="text-brand-blue font-bold text-xs mt-1 block">+ Tambah Listing</a>
                    </div>
                  ) : properties.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setSelectedPropertyId(p.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                        selectedPropertyId === p.id 
                          ? 'bg-brand-blue/5 border-brand-blue/20 ring-1 ring-brand-blue/10' 
                          : 'bg-surface-gray/50 border-transparent hover:bg-surface-gray'
                      }`}
                    >
                      {p.images?.[0] ? (
                        <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt={p.title} />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                          <Sparkles size={16} className="text-brand-blue" />
                        </div>
                      )}
                      <div className="text-left overflow-hidden">
                        <p className={`text-sm font-bold truncate ${selectedPropertyId === p.id ? 'text-brand-blue' : 'text-text-dark'}`}>{p.title}</p>
                        <p className="text-[10px] text-text-gray font-medium truncate">{p.type || 'Properti'}</p>
                      </div>
                      {selectedPropertyId === p.id && <CheckCircle2 size={16} className="text-brand-blue ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone & Template */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-text-gray uppercase tracking-widest pl-1">Nuansa / Gaya</label>
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
                    <div className="aspect-square bg-surface-gray flex items-center justify-center">
                      {selectedProperty?.images?.[0] ? (
                        <img src={selectedProperty.images[0]} className="w-full h-full object-cover" alt="prev" />
                      ) : (
                        <Sparkles size={40} className="text-brand-blue/20" />
                      )}
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
                      <span className="flex items-center gap-3">
                        <div className="w-1 h-4 bg-brand-blue rounded-full"></div>
                        Editor Caption
                      </span>
                      <span className="bg-surface-gray px-2 py-0.5 rounded text-[10px] text-text-gray/60 font-medium">Tersimpan Otomatis</span>
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
                  <button 
                    onClick={() => {
                      const caption = captions[activePlatform];
                      if (!caption || !selectedPropertyId) return;
                      startSaveTransition(async () => {
                        try {
                          await publishNow({
                            propertyId: selectedPropertyId,
                            platform: activePlatform,
                            caption,
                            tone,
                            template,
                          });
                          showToast('🚀 Konten Berhasil Diposting!');
                          // Refresh queue
                          const queueData = await getContentQueue();
                          setQueue(queueData);
                        } catch (e: any) {
                          showToast(e.message);
                        }
                      });
                    }}
                    disabled={!captions[activePlatform] || isSaving}
                    className="w-full py-4 bg-brand-blue text-white-pure rounded-full font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                  >
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
        <div className="p-8 border-b border-border-line/5 bg-surface-gray/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-3">
              <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
              Antrean Otomatisasi Konten
            </h2>
            <p className="text-sm text-text-gray mt-1">Kelola dan jadwalkan publikasi konten ke media sosial</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black tracking-wider uppercase">AUTOPILOT AKTIF</span>
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
              {isLoadingQueue ? (
                <tr><td colSpan={5} className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin mx-auto"></div>
                </td></tr>
              ) : queue.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-text-gray/40 text-sm">
                  Belum ada konten di antrean. Generate caption lalu masukkan ke antrean!
                </td></tr>
              ) : queue.map((item) => {
                const propName = item.properties?.title || item.property?.name || 'Properti';
                const propImg = item.properties?.images?.[0] || item.property?.image || null;
                const scheduledTime = item.scheduled_at
                  ? new Date(item.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                  : item.suggestedTime?.replace('AI Suggestion: ', '') || 'Belum dijadwalkan';
                const isAISuggestion = !item.scheduled_at;
                return (
                <tr key={item.id} className="hover:bg-surface-gray/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {propImg ? (
                          <img src={propImg} className="w-14 h-14 rounded-xl object-cover shadow-md" alt="p" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                            <Sparkles size={20} className="text-brand-blue" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Sparkles size={12} className="text-brand-blue" />
                        </div>
                      </div>
                      <div className="max-w-[300px]">
                        <p className="font-bold text-text-dark truncate">{propName}</p>
                        <p className="text-xs text-text-gray mt-1 line-clamp-1">{item.caption}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       {item.platform === 'instagram' && <InstagramIcon size={16} className="text-[#E4405F]" />}
                       {item.platform === 'facebook' && <FacebookIcon size={16} className="text-[#1877F2]" />}
                       {item.platform === 'tiktok' && <TikTokIcon size={16} className="text-black" />}
                       {item.platform === 'whatsapp' && <span className="text-green-500 font-bold text-xs">WA</span>}
                       <span className="text-sm font-semibold text-text-dark capitalize">{item.platform}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-dark">{scheduledTime}</span>
                      {isAISuggestion && (
                        <span className="text-[10px] text-brand-blue font-black tracking-wider uppercase mt-0.5">Disarankan AI</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {item.status === 'waiting' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">
                        <Clock size={12} strokeWidth={2.5} />
                        Menunggu Persetujuan
                      </span>
                    ) : item.status === 'scheduled' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                        <CalendarDays size={12} strokeWidth={2.5} />
                        Dijadwalkan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        Dipublikasi
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {item.status === 'waiting' ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => approveItem(item.id)}
                          disabled={isApproving}
                          className="w-10 h-10 rounded-xl bg-emerald-500 text-white-pure flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all hover:scale-110 disabled:opacity-50"
                          title="Setujui & Jadwalkan"
                        >
                          <Check size={20} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          disabled={isSaving}
                          className="w-10 h-10 rounded-xl bg-white-pure border border-border-line/10 text-text-gray hover:text-red-500 transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
                          title="Hapus"
                        >
                          <X size={20} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-text-gray/30 hover:text-red-400 transition-colors"
                        title="Hapus"
                      >
                        <X size={18} strokeWidth={2} />
                      </button>
                    )}
                  </td>
                </tr>
              )})}
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
