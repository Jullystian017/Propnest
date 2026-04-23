'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, Users, Home, MousePointerClick, ArrowUpRight, ArrowDownRight, ArrowRight, ChevronDown, Check, Sparkles, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import LeadsChart from '@/components/dashboard/LeadsChart';
import Link from 'next/link';

export default function DashboardPage() {
  const supabase = createClient();
  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [chatbotClicks, setChatbotClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7 Hari');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState('User');
  const router = useRouter();

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Baru saja';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Use getSession for initial check to avoid lock contention
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          setDisplayName(name);
        }

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [leadsRes, propsRes, dealsRes, clicksRes] = await Promise.all([
          supabase.from('leads').select('*').order('created_at', { ascending: false }),
          supabase.from('properties').select('*'),
          supabase.from('deals').select('*'),
          supabase.from('chatbot_clicks').select('clicked_at').gte('clicked_at', sevenDaysAgo),
        ]);
        
        if (leadsRes.error) throw leadsRes.error;
        setLeads(leadsRes.data || []);
        setProperties(propsRes.data || []);
        setDeals(dealsRes.data || []);
        setChatbotClicks(clicksRes.data || []);
      } catch (err) {
        console.debug('Dashboard data sync deferred:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    // Real-time subscription: update chart instantly when someone clicks AI
    const channel = supabase
      .channel('chatbot-clicks-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chatbot_clicks' },
        (payload) => {
          setChatbotClicks(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const activeListings = properties.filter(p => p.status === 'Aktif').length;
  const conversionRate = leads.length > 0 ? ((deals.length / leads.length) * 100).toFixed(1) : '0';
  const totalVolume = deals.reduce((sum, d) => sum + (Number(d.price) || 0), 0);
  
  const formatShortPrice = (price: number) => {
    if (price >= 1_000_000_000) return `Rp ${(price / 1_000_000_000).toFixed(1)}M`;
    if (price >= 1_000_000) return `Rp ${(price / 1_000_000).toFixed(0)}jt`;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price).replace('Rp', 'Rp ');
  };

  const dynamicStats = [
    { label: 'Total Leads', value: leads.length.toString(), change: 'All Time', isPos: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-500/10 to-transparent' },
    { label: 'Listing Aktif', value: activeListings.toString(), change: 'Live', isPos: true, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
    { label: 'Tingkat Konversi', value: `${conversionRate}%`, change: 'Deals/Leads', isPos: true, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50', gradient: 'from-violet-500/10 to-transparent' },
    { label: 'Volume Asset', value: formatShortPrice(totalVolume), change: 'Est. Deal', isPos: true, icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50', gradient: 'from-orange-500/10 to-transparent' },
  ];

  const timeRanges = [
    { label: '7 Hari Terakhir', value: '7 Hari' },
    { label: '30 Hari Terakhir', value: '30 Hari' },
    { label: '3 Bulan Terakhir', value: '3 Bulan' },
  ];

  const chartData = useMemo(() => {
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const result = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      
      // Count leads for this day
      const leadsCount = leads.filter(l => {
        const ld = new Date(l.created_at);
        return ld.getDate() === d.getDate() && ld.getMonth() === d.getMonth();
      }).length;

      // Count REAL chatbot clicks for this day
      const clickCount = chatbotClicks.filter(c => {
        const cd = new Date(c.clicked_at);
        return cd.getDate() === d.getDate() && cd.getMonth() === d.getMonth();
      }).length;
      
      result.push({
        day: dayName,
        leads: leadsCount,
        click: clickCount,
      });
    }
    return result;
  }, [leads, chatbotClicks]);

  const recentActivities = useMemo(() => {
    const activities: { text: string; time: string; timestamp: number }[] = [];
    
    // Prospek Baru
    leads.slice(0, 3).forEach(l => {
      activities.push({
        text: `Prospek baru: ${l.name || 'Anonim'}`,
        time: formatRelativeTime(l.created_at),
        timestamp: new Date(l.created_at).getTime()
      });
    });
    
    // Update Pipeline
    deals.slice(0, 2).forEach(d => {
      activities.push({
        text: `Pipeline updated: ${d.title}`,
        time: formatRelativeTime(d.created_at || new Date().toISOString()),
        timestamp: new Date(d.created_at || new Date().toISOString()).getTime()
      });
    });

    // Sort by newest
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);
  }, [leads, deals]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());
  const formattedDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Header Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">
            {getGreeting()}, <span className="text-brand-blue">{displayName}</span>
          </h1>
          <p className="text-text-gray/80 font-normal text-sm flex items-center gap-2">
            Selamat datang kembali! Ini rangkuman performa Anda hari ini.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Tombol dihapus sesuai request */}
        </div>
      </div>

      {/* Stat Cards - Premium & Light Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, i) => (
          <div key={i} className="bg-white-pure p-7 rounded-[2.5rem] border border-border-line/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${stat.isPos ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border border-current/5`}>
                  {stat.isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] uppercase font-semibold text-text-gray/50 tracking-[0.1em]">{stat.label}</p>
              <h3 className="text-2xl font-medium text-text-dark mt-1 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart Section - Polished & Light */}
      <div className="bg-white-pure p-8 lg:p-10 rounded-[2.5rem] border border-border-line/30 shadow-sm overflow-visible relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text-dark flex items-center gap-3">
              <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
              Performa Marketing
            </h2>
            <p className="text-sm font-normal text-text-gray/60">Tren Leads & Klik Chatbot AI ({timeRange})</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-5 py-3 bg-white-pure border border-border-line/30 rounded-2xl text-sm font-medium text-text-gray hover:text-text-dark hover:border-border-line/60 transition-all min-w-[200px] justify-between group"
            >
              <span>{timeRanges.find(r => r.value === timeRange)?.label}</span>
              <ChevronDown size={18} strokeWidth={1.5} className={`text-text-gray/40 group-hover:text-brand-blue transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-brand-blue' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-[260px] bg-white-pure border border-border-line/30 rounded-[1.5rem] shadow-xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 space-y-1">
                    {timeRanges.map((range) => {
                      const isActive = timeRange === range.value;
                      return (
                        <button
                          key={range.value}
                          onClick={() => {
                            setTimeRange(range.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between w-full px-5 py-3 text-sm font-medium rounded-xl transition-all ${
                            isActive 
                              ? 'bg-brand-blue/5 text-brand-blue shadow-sm' 
                              : 'text-text-gray/70 hover:bg-surface-gray hover:text-text-dark'
                          }`}
                        >
                          {range.label}
                          {isActive && <Check size={16} strokeWidth={2} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="border border-border-line/20 rounded-[2rem] p-6 bg-surface-gray/10">
          <LeadsChart data={chartData} />
        </div>
      </div>

      {/* Main Content Area - Bento Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        
        {/* Recent Leads Table - Super Clean */}
        <div className="lg:col-span-2 bg-white-pure rounded-[2.5rem] border border-border-line/30 shadow-sm flex flex-col overflow-hidden">
            <div className="p-8 border-b border-border-line/10 flex justify-between items-center">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-text-dark flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-brand-blue rounded-full"></div>
                  Leads Terbaru
                </h2>
                <p className="text-xs font-normal text-text-gray/50">Prospek dari AI Chatbot & Inquiry</p>
              </div>
              <Link href="/dashboard/leads" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:gap-2 transition-all">
                Semua <ArrowRight size={18} strokeWidth={1.5} />
              </Link>
            </div>
          
          <div className="flex-1 p-0 overflow-x-auto">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin"></div>
                <p className="text-xs text-text-gray/40 font-medium tracking-widest uppercase">Sinkronisasi...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-surface-gray/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-text-gray/20 border border-border-line/10">
                  <Users size={32} strokeWidth={1} />
                </div>
                <h3 className="text-base font-medium text-text-dark mb-1">Belum Ada Leads</h3>
                <p className="text-sm text-text-gray/40 max-w-xs mx-auto">Listing Anda siap dipromosikan ke publik.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-surface-gray/10 text-[10px] uppercase tracking-widest text-text-gray/40 font-medium border-b border-border-line/5">
                    <th className="p-6 pl-10">Prospek</th>
                    <th className="p-6">Kontak</th>
                    <th className="p-6">Tujuan</th>
                    <th className="p-6 pr-10">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-line/5">
                  {leads.slice(0, 5).map((lead, i) => (
                    <tr key={lead.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="p-6 pl-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-medium text-white-pure shadow-sm group-hover:scale-105 transition-transform ${i % 2 === 0 ? 'bg-brand-blue/70' : 'bg-violet-400'}`}>
                                {lead.name ? lead.name.charAt(0) : 'A'}
                            </div>
                            <div>
                                <div className="font-medium text-text-dark text-sm">{lead.name || 'Anonim'}</div>
                                <div className="text-[10px] font-normal text-text-gray/40 mt-0.5">{new Date(lead.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                            </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="font-medium text-xs text-text-dark/70">{lead.phone || '-'}</div>
                        <div className="text-[10px] text-text-gray/40 font-normal mt-0.5">{lead.email || '-'}</div>
                      </td>
                      <td className="p-6">
                        <div className="inline-flex py-1 px-3 rounded-lg bg-surface-gray/50 text-[10px] font-medium text-text-dark/50 border border-border-line/10">
                          {lead.intent || 'Umum'}
                        </div>
                      </td>
                      <td className="p-6 pr-10">
                        <span className={`inline-flex items-center gap-2 py-1.5 px-3 rounded-full text-[10px] font-medium ${
                          lead.status === 'Closing' ? 'bg-brand-blue/10 text-brand-blue ring-1 ring-brand-blue/10' :
                          lead.status === 'Baru' || lead.status === 'new' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10' :
                          'bg-blue-50 text-blue-600 ring-1 ring-blue-600/10'
                        }`}>
                          {lead.status === 'new' ? 'Baru' : (lead.status || 'Baru')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="p-5 text-center border-t border-border-line/5">
                 <button className="text-[10px] font-medium text-text-gray/40 uppercase tracking-widest hover:text-brand-blue transition-colors">Lihat Leads Lainnya</button>
            </div>
          </div>
        </div>
 
        {/* Right Side Cards */}
        <div className="space-y-8">
          {/* AI Promo Card - Refined Light */}
          <div className="bg-white-pure rounded-[2.5rem] p-10 border border-border-line/30 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-blue/5 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-700"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center border border-brand-blue/10">
                  <Sparkles size={24} strokeWidth={1.5} className="text-brand-blue" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-display font-medium text-text-dark leading-tight">Butuh AI Caption Generator?</h3>
                <p className="text-text-gray/60 text-sm font-normal leading-relaxed">
                  Bikin caption Instagram dalam hitungan detik pakai AI Studio.
                </p>
              </div>
              <Link 
                href="/dashboard/content"
                className="w-full bg-brand-blue text-white-pure py-3.5 rounded-2xl text-xs font-medium shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all flex items-center justify-center"
              >
                BUAT SEKARANG
              </Link>
            </div>
          </div>

          {/* Activity Log - Refined Light */}
          <div className="bg-white-pure rounded-[2.5rem] p-8 border border-border-line/30 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-text-dark flex items-center gap-3">
                  <div className="w-1.5 h-5 bg-brand-blue rounded-full"></div>
                  Aktivitas Terakhir
              </h3>
              <Link href="/dashboard/activity" className="text-[10px] font-bold text-brand-blue hover:underline uppercase tracking-widest">
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-8">
              {loading ? (
                <div className="py-10 flex justify-center">
                  <div className="w-5 h-5 border-2 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin"></div>
                </div>
              ) : recentActivities.length === 0 ? (
                <p className="text-xs text-text-gray/40 text-center py-10 italic">Belum ada aktivitas.</p>
              ) : (
                recentActivities.map((act, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-9 h-9 rounded-xl bg-surface-gray/50 border border-border-line/10 flex items-center justify-center flex-none group-hover:bg-brand-blue/5 group-hover:border-brand-blue/20 transition-all">
                        <Clock size={14} className="text-text-gray/30 group-hover:text-brand-blue transition-colors" />
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-medium text-text-dark/80 group-hover:text-brand-blue transition-colors line-clamp-1">{act.text}</p>
                      <p className="text-[10px] font-normal text-text-gray/40 uppercase tracking-widest mt-1">{act.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
