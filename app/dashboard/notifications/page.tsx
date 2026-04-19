'use client';

import React, { useState } from 'react';
import { 
  Users, Sparkles, Home, MessageSquare, Search, 
  Trash2, CheckCircle2, MoreHorizontal, Bell,
  ChevronRight, Filter, Calendar, Clock
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  date: string;
  type: 'lead' | 'ai' | 'status' | 'system';
  unread: boolean;
  category: string;
}

const ALL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Lead Baru Masuk',
    desc: 'Budi Santoso tertarik dengan unit "Emerald Residence" dan ingin menjadwalkan kunjungan lapangan.',
    time: '09:45 AM',
    date: '19 Apr 2026',
    type: 'lead',
    unread: true,
    category: 'Leads'
  },
  {
    id: '2',
    title: 'AI Chatbot Report',
    desc: 'Rangkuman aktivitas: AI baru saja membantu 5 calon pembeli hari ini dengan tingkat kepuasan 95%.',
    time: '08:00 AM',
    date: '19 Apr 2026',
    type: 'ai',
    unread: true,
    category: 'AI Assistant'
  },
  {
    id: '3',
    title: 'Listing Disetujui',
    desc: 'Selamat! Unit "Cluster Akasia" sekarang sudah tayang publik dan siap menerima leads.',
    time: '16:20 PM',
    date: '18 Apr 2026',
    type: 'status',
    unread: false,
    category: 'Listing'
  },
  {
    id: '4',
    title: 'Update Sistem',
    desc: 'PropNest baru saja melakukan pembaruan pada dashboard untuk meningkatkan kecepatan akses data.',
    time: '14:00 PM',
    date: '18 Apr 2026',
    type: 'system',
    unread: false,
    category: 'Sistem'
  },
  {
    id: '5',
    title: 'Pesan dari Calon Pembeli',
    desc: 'Siti Aminah menanyakan tentang opsi cicilan KPR untuk unit "Modern Minimalist Cibubur".',
    time: '11:15 AM',
    date: '18 Apr 2026',
    type: 'lead',
    unread: false,
    category: 'Leads'
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = ['Semua', 'Belum Dibaca', 'Leads', 'AI Assistant', 'Listing'];

  const filtered = ALL_NOTIFICATIONS.filter(n => {
    const matchesTab = activeTab === 'Semua' || 
                      (activeTab === 'Belum Dibaca' ? n.unread : n.category === activeTab);
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <Bell size={20} />
            </div>
            <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">Pusat Notifikasi</h1>
          </div>
          <p className="text-sm font-normal text-text-gray/50">Pantau semua aktivitas terbaru dari properti dan leads Anda.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            suppressHydrationWarning
            className="flex items-center gap-2 px-4 py-2.5 bg-white-pure border border-border-line/10 rounded-2xl text-xs font-bold text-text-gray/60 hover:text-brand-blue hover:border-brand-blue/30 transition-all"
          >
            <CheckCircle2 size={16} />
            Tandai Semua Dibaca
          </button>
          <button 
            suppressHydrationWarning
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-2xl text-xs font-bold hover:bg-red-500 hover:text-white-pure transition-all"
          >
            <Trash2 size={16} />
            Hapus Semua
          </button>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white-pure rounded-[2.5rem] p-4 shadow-sm border border-border-line/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
            {tabs.map(tab => (
              <button
                key={tab}
                suppressHydrationWarning
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-brand-blue text-white-pure shadow-lg shadow-brand-blue/10'
                    : 'text-text-gray/50 hover:bg-surface-gray hover:text-text-dark'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
            <input 
              type="text"
              suppressHydrationWarning
              placeholder="Cari notifikasi..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-gray/30 border-none rounded-2xl py-2.5 pl-12 pr-4 text-xs font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((notif) => (
            <div 
              key={notif.id}
              className={`group bg-white-pure rounded-[2rem] p-6 border transition-all duration-300 hover:shadow-premium hover:-translate-y-1 ${
                notif.unread ? 'border-brand-blue/20 shadow-soft' : 'border-border-line/10'
              }`}
            >
              <div className="flex gap-6">
                {/* Icon Wrapper */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative ${
                  notif.type === 'lead' ? 'bg-emerald-50 text-emerald-500' :
                  notif.type === 'ai' ? 'bg-brand-blue/5 text-brand-blue' :
                  notif.type === 'status' ? 'bg-orange-50 text-orange-500' :
                  'bg-surface-gray text-text-gray/60'
                }`}>
                  {notif.type === 'lead' && <Users size={24} />}
                  {notif.type === 'ai' && <Sparkles size={24} />}
                  {notif.type === 'status' && <Home size={24} />}
                  {notif.type === 'system' && <MessageSquare size={24} />}
                  
                  {notif.unread && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-blue rounded-full border-2 border-white-pure animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        notif.type === 'lead' ? 'bg-emerald-50 text-emerald-600' :
                        notif.type === 'ai' ? 'bg-brand-blue/5 text-brand-blue' :
                        notif.type === 'status' ? 'bg-orange-50 text-orange-600' :
                        'bg-surface-gray text-text-gray/60'
                      }`}>
                        {notif.category}
                      </span>
                      <h3 className={`text-base font-bold transition-colors ${notif.unread ? 'text-text-dark' : 'text-text-dark/80 group-hover:text-brand-blue'}`}>
                        {notif.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-text-gray/40 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {notif.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {notif.date}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-gray/60 leading-relaxed mb-4">
                    {notif.desc}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border-line/5">
                    <div className="flex items-center gap-2">
                      <button 
                        suppressHydrationWarning
                        className="text-[11px] font-bold text-brand-blue hover:text-brand-blue-deep transition-all flex items-center gap-1"
                      >
                        Lihat Detail <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        suppressHydrationWarning
                        className="p-2 text-text-gray/30 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all" 
                        title="Archive"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button 
                        suppressHydrationWarning
                        className="p-2 text-text-gray/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        suppressHydrationWarning
                        className="p-2 text-text-gray/30 hover:text-text-dark hover:bg-surface-gray rounded-xl transition-all"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white-pure rounded-[2.5rem] py-20 border border-border-line/10 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 bg-surface-gray rounded-full flex items-center justify-center text-text-gray/20 mb-6">
                <Bell size={40} />
             </div>
             <h3 className="text-lg font-medium text-text-dark">Tidak ada notifikasi</h3>
             <p className="text-sm text-text-gray/40 mt-2">Coba ganti filter atau kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>

    </div>
  );
}
