'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, ChevronRight, Filter, AlertCircle, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';

const MOCK_SCHEDULES = [
  {
    id: 's1',
    property: 'Rumah Modern Minimalis BSB',
    location: 'BSB City, Semarang',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800&h=600',
    date: '15 Okt 2026',
    time: '10:00 - 11:00 WIB',
    agent: 'Budi Santoso',
    agentPhone: '0812-3456-7890',
    status: 'Menunggu Konfirmasi', // Menunggu Konfirmasi, Disetujui, Selesai, Dibatalkan
    notes: 'Mohon info detail mengenai tipe pembayaran KPR sebelum survei.'
  },
  {
    id: 's2',
    property: 'Cluster Premium Colomadu',
    location: 'Colomadu, Solo',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=600',
    date: '10 Okt 2026',
    time: '14:30 - 15:30 WIB',
    agent: 'Sari Indah',
    agentPhone: '0898-7654-3210',
    status: 'Selesai',
    notes: ''
  }
];

export default function JadwalKunjunganPage() {
  const [filter, setFilter] = useState('Semua');

  const filteredSchedules = MOCK_SCHEDULES.filter(s => {
    if (filter === 'Semua') return true;
    return s.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disetujui': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Menunggu Konfirmasi': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Selesai': return 'text-brand-blue bg-blue-50 border-blue-200';
      case 'Dibatalkan': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disetujui': return <CheckCircle2 size={14} className="mr-1.5" />;
      case 'Menunggu Konfirmasi': return <Clock size={14} className="mr-1.5" />;
      case 'Selesai': return <CheckCircle2 size={14} className="mr-1.5" />;
      case 'Dibatalkan': return <AlertCircle size={14} className="mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-dark mb-1">Jadwal Kunjungan</h2>
          <p className="text-sm text-text-gray font-medium">Pantau jadwal survei properti yang telah Anda ajukan.</p>
        </div>
        
        <div className="flex bg-surface-gray p-1 rounded-xl">
          {['Semua', 'Menunggu Konfirmasi', 'Selesai'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                filter === f 
                  ? 'bg-white-pure text-brand-blue shadow-sm' 
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredSchedules.length > 0 ? (
        <div className="space-y-4">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="bg-white-pure rounded-3xl p-5 border border-border-line/30 shadow-sm hover:shadow-premium transition-all duration-300 group flex flex-col md:flex-row gap-6">
              
              <div className="w-full md:w-[200px] aspect-[4/3] rounded-2xl overflow-hidden shrink-0 relative">
                <img src={schedule.image} alt={schedule.property} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold rounded-full border shadow-sm flex items-center backdrop-blur-md bg-white-pure/90 ${getStatusColor(schedule.status)}`}>
                  {getStatusIcon(schedule.status)}
                  {schedule.status}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text-dark mb-1 group-hover:text-brand-blue transition-colors">{schedule.property}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-text-gray font-medium mb-4">
                    <MapPin size={14} className="text-brand-blue/70" /> {schedule.location}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 bg-surface-gray/40 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-text-gray uppercase tracking-wider mb-0.5">Waktu Survei</p>
                        <p className="text-sm font-semibold text-text-dark">{schedule.date}</p>
                        <p className="text-xs font-medium text-text-gray/80">{schedule.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-surface-gray/40 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-text-gray uppercase tracking-wider mb-0.5">Agen Pendamping</p>
                        <p className="text-sm font-semibold text-text-dark">{schedule.agent}</p>
                        <p className="text-xs font-medium text-text-gray/80">{schedule.agentPhone}</p>
                      </div>
                    </div>
                  </div>
                  
                  {schedule.notes && (
                    <div className="mt-4 text-xs bg-amber-50/50 border border-amber-100 p-3 rounded-xl text-text-dark/80 italic flex items-start gap-2">
                      <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      Catatan Anda: "{schedule.notes}"
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border-line/20">
                  {schedule.status === 'Menunggu Konfirmasi' && (
                    <>
                      <button className="px-4 py-2 text-xs font-semibold text-brand-blue bg-blue-50 hover:bg-brand-blue hover:text-white-pure rounded-xl transition-all">
                        Hubungi Agen
                      </button>
                      <button className="px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        Batalkan Jadwal
                      </button>
                    </>
                  )}
                  {schedule.status === 'Selesai' && (
                    <>
                      <button className="px-4 py-2 text-xs font-semibold text-brand-blue bg-brand-blue/10 hover:bg-brand-blue hover:text-white-pure rounded-xl transition-all">
                        Beri Ulasan
                      </button>
                      <Link href="/profil/kpr" className="px-4 py-2 text-xs font-semibold text-text-gray hover:text-text-dark hover:bg-surface-gray rounded-xl transition-all">
                        Lanjut Ajukan KPR
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white-pure rounded-3xl p-12 border border-dashed border-border-line flex flex-col items-center justify-center text-center mt-8">
          <div className="w-16 h-16 bg-surface-gray rounded-full flex items-center justify-center text-text-gray/40 mb-4">
            <Calendar size={24} />
          </div>
          <h3 className="font-semibold text-text-dark text-lg mb-2">Tidak ada jadwal survei</h3>
          <p className="text-sm text-text-gray max-w-sm mb-6">Anda belum memiliki jadwal kunjungan {filter !== 'Semua' && `dengan status ${filter}`}.</p>
          <Link href="/cari" className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white-pure text-sm font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md">
            <Search size={16} /> Cari Properti
          </Link>
        </div>
      )}

    </div>
  );
}
