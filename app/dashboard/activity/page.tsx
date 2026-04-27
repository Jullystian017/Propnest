'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Search, Filter, ArrowUpRight, 
  Users, TrendingUp, Home, ArrowLeft, 
  ChevronRight, Calendar, Bell, Sparkles,
  Loader2, AlertCircle, MessageSquare, Trash2, CheckCircle2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'lead' | 'deal' | 'property';
  title: string;
  description: string;
  status: string;
  timestamp: string;
  fullDate: string;
  rawDate: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'lead' | 'ai' | 'status' | 'system';
  is_read: boolean;
  created_at: string;
}

export default function CombinedActivityPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'notif' | 'log'>('notif');
  const [loading, setLoading] = useState(true);
  
  // States for Log Aktivitas
  const [activities, setActivities] = useState<Activity[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('Semua');

  // States for Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifSearch, setNotifSearch] = useState('');

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
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Log Data
      const [leadsRes, propsRes, dealsRes, notifRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('properties').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('deals').select('*').order('created_at', { ascending: false }).limit(20),
        supabase.from('notifications').select('*').order('created_at', { ascending: false })
      ]);

      const combinedLog: Activity[] = [];
      (leadsRes.data || []).forEach((l: any) => {
        combinedLog.push({
          id: `lead-${l.id}`,
          type: 'lead',
          title: 'Prospek Baru',
          description: `${l.name || 'Anonim'} tertarik pada ${l.intent || 'Listing'}`,
          status: l.status || 'Baru',
          timestamp: formatRelativeTime(l.created_at),
          fullDate: new Date(l.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          rawDate: l.created_at
        });
      });
      (propsRes.data || []).forEach((p: any) => {
        combinedLog.push({
          id: `prop-${p.id}`,
          type: 'property',
          title: 'Listing Update',
          description: `Unit ${p.title} telah diperbarui di listing.`,
          status: p.status || 'Aktif',
          timestamp: formatRelativeTime(p.created_at),
          fullDate: new Date(p.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          rawDate: p.created_at
        });
      });
      (dealsRes.data || []).forEach((d: any) => {
        combinedLog.push({
          id: `deal-${d.id}`,
          type: 'deal',
          title: 'Pipeline Change',
          description: `Klien ${d.client_name || 'Klien'} pindah ke tahap ${d.status}.`,
          status: d.priority || 'Medium',
          timestamp: formatRelativeTime(d.created_at || new Date().toISOString()),
          fullDate: new Date(d.created_at || new Date().toISOString()).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
          rawDate: d.created_at || new Date().toISOString()
        });
      });

      setActivities(combinedLog.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()));
      setNotifications(notifRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time notifications
    const channel = supabase
      .channel('combined-activity')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredLog = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = act.title.toLowerCase().includes(logSearch.toLowerCase()) || 
                           act.description.toLowerCase().includes(logSearch.toLowerCase());
      const matchesType = logTypeFilter === 'Semua' || 
                         (logTypeFilter === 'Leads' && act.type === 'lead') ||
                         (logTypeFilter === 'Pipeline' && act.type === 'deal') ||
                         (logTypeFilter === 'Listing' && act.type === 'property');
      return matchesSearch && matchesType;
    });
  }, [activities, logSearch, logTypeFilter]);

  const filteredNotif = useMemo(() => {
    return notifications.filter(n => 
      n.title.toLowerCase().includes(notifSearch.toLowerCase()) || 
      n.description.toLowerCase().includes(notifSearch.toLowerCase())
    );
  }, [notifications, notifSearch]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false);
    fetchData();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-medium text-brand-blue hover:gap-3 transition-all mb-4">
            <ArrowLeft size={14} /> Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-display font-medium text-text-dark tracking-tight">Notifikasi & Aktivitas</h1>
          <p className="text-sm font-normal text-text-gray/50">Pusat pemantauan real-time untuk seluruh kegiatan NusaEstate Anda.</p>
        </div>
        
        {activeTab === 'notif' && unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white-pure rounded-2xl text-xs font-bold shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all"
          >
            <CheckCircle2 size={16} /> Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Main Tabs */}
      <div className="bg-white-pure p-1.5 rounded-[2rem] border border-border-line/10 shadow-sm flex items-center max-w-md">
        <button
          onClick={() => setActiveTab('notif')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.7rem] text-sm font-semibold transition-all ${
            activeTab === 'notif' ? 'bg-brand-blue text-white-pure shadow-lg shadow-brand-blue/10' : 'text-text-gray/50 hover:text-text-dark'
          }`}
        >
          <Bell size={18} />
          Notifikasi
          {unreadCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'notif' ? 'bg-white-pure text-brand-blue' : 'bg-brand-blue text-white-pure'}`}>
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.7rem] text-sm font-semibold transition-all ${
            activeTab === 'log' ? 'bg-brand-blue text-white-pure shadow-lg shadow-brand-blue/10' : 'text-text-gray/50 hover:text-text-dark'
          }`}
        >
          <Clock size={18} />
          Log Aktivitas
        </button>
      </div>

      {/* Filters Area */}
      <div className="bg-white-pure p-4 rounded-3xl border border-border-line/20 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={18} strokeWidth={1.5} />
          <input
            type="text"
            placeholder={activeTab === 'notif' ? "Cari notifikasi..." : "Cari di log aktivitas..."}
            className="w-full bg-surface-gray/30 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-normal focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-text-gray/30"
            value={activeTab === 'notif' ? notifSearch : logSearch}
            onChange={e => activeTab === 'notif' ? setNotifSearch(e.target.value) : setLogSearch(e.target.value)}
          />
        </div>
        {activeTab === 'log' && (
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {['Semua', 'Leads', 'Pipeline', 'Listing'].map(t => (
              <button
                key={t}
                onClick={() => setLogTypeFilter(t)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all border whitespace-nowrap ${
                  logTypeFilter === t ? 'bg-brand-blue text-white-pure border-brand-blue shadow-sm' : 'bg-white-pure border-border-line/20 text-text-gray/60 hover:border-brand-blue/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-text-gray/40">
            <Loader2 size={32} className="animate-spin mb-4 text-brand-blue" />
            <p className="text-sm font-medium tracking-wide">Menyelaraskan data...</p>
          </div>
        ) : activeTab === 'notif' ? (
          // NOTIFICATIONS LIST
          filteredNotif.length === 0 ? (
            <div className="text-center py-24 bg-surface-gray/10 rounded-[3rem] border border-dashed border-border-line/20">
              <div className="w-20 h-20 bg-white-pure rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Bell size={32} className="text-text-gray/20" />
              </div>
              <h3 className="text-xl font-medium text-text-dark">Pusat Notifikasi Kosong</h3>
              <p className="text-sm text-text-gray/40">Anda sedang up-to-date! Belum ada pengingat baru.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotif.map(n => (
                <div key={n.id} className={`group bg-white-pure rounded-[2rem] p-7 border transition-all duration-500 hover:shadow-premium ${!n.is_read ? 'border-brand-blue/20 shadow-soft bg-brand-blue/[0.01]' : 'border-border-line/10'}`}>
                  <div className="flex gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative ${
                      n.type === 'lead' ? 'bg-emerald-50 text-emerald-500' : n.type === 'ai' ? 'bg-brand-blue/5 text-brand-blue' : 'bg-surface-gray text-text-gray/60'
                    }`}>
                      {n.type === 'lead' ? <Users size={24} /> : n.type === 'ai' ? <Sparkles size={24} /> : <Bell size={24} />}
                      {!n.is_read && <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-blue rounded-full border-2 border-white-pure animate-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-base font-bold ${!n.is_read ? 'text-text-dark' : 'text-text-dark/80'}`}>{n.title}</h3>
                        <span className="text-[10px] font-bold text-text-gray/30 uppercase tracking-widest">{formatRelativeTime(n.created_at)}</span>
                      </div>
                      <p className="text-sm text-text-gray/60 leading-relaxed">{n.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // LOG AKTIVITAS LIST
          <div className="relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-blue/20 via-brand-blue/10 to-transparent rounded-full hidden md:block"></div>
            <div className="space-y-8">
              {filteredLog.length === 0 ? (
                <div className="text-center py-24 bg-surface-gray/10 rounded-[3rem] border border-dashed border-border-line/20">
                   <h3 className="text-xl font-medium text-text-dark">Belum ada riwayat aktivitas</h3>
                </div>
              ) : (
                filteredLog.map(act => (
                  <div key={act.id} className="relative md:pl-16 group">
                    <div className={`absolute left-0 top-0 w-14 h-14 rounded-2xl border border-border-line/10 bg-white-pure flex items-center justify-center z-10 transition-all duration-500 group-hover:scale-110 shadow-sm text-text-gray/40 group-hover:text-brand-blue group-hover:border-brand-blue/20`}>
                      {act.type === 'lead' ? <Users size={20} /> : act.type === 'deal' ? <TrendingUp size={20} /> : <Home size={20} />}
                    </div>
                    <div className="bg-white-pure p-7 rounded-[2rem] border border-border-line/10 shadow-sm group-hover:shadow-premium transition-all duration-500">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium text-text-dark group-hover:text-brand-blue transition-colors">{act.title}</h3>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-surface-gray/50 text-text-gray/50 border border-border-line/5">{act.type}</span>
                          </div>
                          <p className="text-sm text-text-gray/60 leading-relaxed font-normal">{act.description}</p>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-xs font-semibold text-text-dark/80">{act.timestamp}</span>
                          <span className="text-[10px] text-text-gray/30 uppercase tracking-widest mt-1">{act.fullDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
