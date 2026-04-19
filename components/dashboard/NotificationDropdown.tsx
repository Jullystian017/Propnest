'use client';

import React from 'react';
import { 
  Users, Sparkles, Home, Bell, Check, 
  ChevronRight, Circle, Clock, MessageSquare 
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'lead' | 'ai' | 'status' | 'system';
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Lead Baru Masuk',
    desc: 'Budi Santoso tertarik dengan unit "Emerald Residence"',
    time: '2 menit yang lalu',
    type: 'lead',
    unread: true
  },
  {
    id: '2',
    title: 'AI Chatbot Report',
    desc: 'AI baru saja membantu 5 calon pembeli hari ini',
    time: '1 jam yang lalu',
    type: 'ai',
    unread: true
  },
  {
    id: '3',
    title: 'Listing Disetujui',
    desc: 'Unit "Cluster Akasia" sekarang sudah tayang publik',
    time: '3 jam yang lalu',
    type: 'status',
    unread: false
  },
  {
    id: '4',
    title: 'Pesan Baru',
    desc: 'Anda mendapat pesan baru dari Tim Support PropNest',
    time: 'Yesterday',
    type: 'system',
    unread: false
  }
];

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-full right-0 mt-3 w-[380px] bg-white-pure rounded-[2rem] shadow-premium border border-border-line/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
      {/* Header */}
      <div className="p-6 border-b border-border-line/5 flex items-center justify-between bg-surface-gray/10">
        <div>
          <h3 className="text-sm font-bold text-text-dark">Notifikasi</h3>
          <p className="text-[10px] text-text-gray/40 font-medium uppercase tracking-widest mt-0.5">Terbaru</p>
        </div>
        <button className="text-[10px] font-bold text-brand-blue hover:underline">
          Tandai Semua Dibaca
        </button>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto no-scrollbar">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id}
            className={`p-5 flex gap-4 hover:bg-surface-gray/30 transition-all cursor-pointer border-b border-border-line/5 group relative ${notif.unread ? 'bg-brand-blue/[0.02]' : ''}`}
          >
            {notif.unread && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Circle size={6} className="fill-brand-blue text-brand-blue" />
              </div>
            )}
            
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              notif.type === 'lead' ? 'bg-emerald-50 text-emerald-500' :
              notif.type === 'ai' ? 'bg-brand-blue/5 text-brand-blue' :
              notif.type === 'status' ? 'bg-orange-50 text-orange-500' :
              'bg-surface-gray text-text-gray/60'
            }`}>
              {notif.type === 'lead' && <Users size={18} />}
              {notif.type === 'ai' && <Sparkles size={18} />}
              {notif.type === 'status' && <Home size={18} />}
              {notif.type === 'system' && <MessageSquare size={18} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-bold text-text-dark truncate pr-2">{notif.title}</p>
                <span className="text-[10px] text-text-gray/30 whitespace-nowrap">{notif.time}</span>
              </div>
              <p className="text-xs text-text-gray/60 line-clamp-2 leading-relaxed">{notif.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Link 
        href="/dashboard/notifications" 
        onClick={onClose}
        className="p-4 bg-surface-gray/10 flex items-center justify-center gap-2 text-[11px] font-bold text-text-gray/60 hover:text-brand-blue hover:bg-brand-blue/5 transition-all"
      >
        Lihat Semua Notifikasi
        <ChevronRight size={14} />
      </Link>
    </div>
  );
}
