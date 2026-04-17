'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter as FilterIcon, 
  Calendar,
  User,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  MoreHorizontal,
  PlusCircle,
  Building2,
  MapPin,
  ArrowUpDown
} from 'lucide-react';
import { MOCK_DEALS, PIPELINE_STATS, Deal } from '@/lib/deals-mock';

export default function DealsPipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price).replace('Rp', 'Rp ');
  };

  const columns = [
    { title: 'Terpilih', status: 'Baru', color: 'bg-indigo-500', count: deals.filter(d => d.status === 'Baru').length },
    { title: 'Jadwal Survey', status: 'Survey', color: 'bg-amber-500', count: deals.filter(d => d.status === 'Survey').length },
    { title: 'Negosiasi', status: 'Negosiasi', color: 'bg-blue-500', count: deals.filter(d => d.status === 'Negosiasi').length },
    { title: 'Legalitas & Dok', status: 'Legalitas', color: 'bg-emerald-500', count: deals.filter(d => d.status === 'Legalitas').length },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50';
      case 'Medium': return 'text-amber-500 bg-amber-50';
      default: return 'text-indigo-400 bg-indigo-50';
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Value */}
        <div className="bg-white-pure p-8 rounded-[2rem] border border-border-line/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-text-gray/60 flex items-center gap-2"> Pipeline Value <TrendingUp size={14} className="text-text-gray/30" /></h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Volume Asset</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">Rp 24.5M</h4>
               <p className="text-[10px] text-green-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 14% vs bulan lalu
               </p>
            </div>
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Komisi</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">Rp 490jt</h4>
               <p className="text-[10px] text-green-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 5% vs bulan lalu
               </p>
            </div>
          </div>
        </div>

        {/* Deal Activity */}
        <div className="bg-white-pure p-8 rounded-[2rem] border border-border-line/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-text-gray/60 flex items-center gap-2"> Deal Activity <Clock size={14} className="text-text-gray/30" /></h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Visit Terjadwal</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">20</h4>
               <p className="text-[10px] text-green-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 12% vs bulan lalu
               </p>
            </div>
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Penawaran Keluar</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">5</h4>
               <p className="text-[10px] text-amber-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 20% vs bulan lalu
               </p>
            </div>
          </div>
        </div>

        {/* Conversion & Speed */}
        <div className="bg-white-pure p-8 rounded-[2rem] border border-border-line/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-text-gray/60 flex items-center gap-2"> Conversion & Speed <CheckCircle2 size={14} className="text-text-gray/30" /></h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Rata-rata Closing</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">42 Hari</h4>
               <p className="text-[10px] text-amber-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 5% vs bulan lalu
               </p>
            </div>
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Win Rate</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">12%</h4>
               <p className="text-[10px] text-green-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 2% vs bulan lalu
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="px-5 py-3 bg-brand-blue text-white-pure rounded-2xl text-sm font-medium shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap">
            <Plus size={18} strokeWidth={1.5} />
            Buat Deal Baru
          </button>
          <div className="flex items-center bg-surface-gray/50 p-1 rounded-2xl border border-border-line/10">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-white-pure text-brand-blue shadow-sm' : 'text-text-gray/40'}`}
              >
                <LayoutGrid size={18} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white-pure text-brand-blue shadow-sm' : 'text-text-gray/40'}`}
              >
                <List size={18} strokeWidth={1.5} />
              </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
            <input 
              type="text" 
              placeholder="Cari deal atau klien..."
              className="w-full bg-white-pure border border-border-line/20 rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white-pure border border-border-line/20 rounded-2xl text-xs font-medium text-text-dark hover:bg-surface-gray transition-all shadow-sm">
              <ArrowUpDown size={16} strokeWidth={1.5} />
              Urutkan
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white-pure border border-border-line/20 rounded-2xl text-xs font-medium text-text-dark hover:bg-surface-gray transition-all shadow-sm">
              <FilterIcon size={16} strokeWidth={1.5} />
              Filter
          </button>
        </div>
      </div>

      {/* Kanban Board - Now using Responsive Grid to avoid horizontal scrolling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[700px]">
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col space-y-4 min-w-0">
            {/* Column Header */}
            <div className={`p-4 rounded-2xl border-l-[6px] border ${col.color.replace('bg-', 'border-')} bg-white-pure shadow-sm flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                <h3 className="text-sm font-semibold text-text-dark">{col.title}</h3>
                <span className="text-xs text-text-gray/40 font-medium">{col.count}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-surface-gray rounded-lg transition-all text-text-gray/40"><Plus size={14} /></button>
                <button className="p-1.5 hover:bg-surface-gray rounded-lg transition-all text-text-gray/40"><MoreHorizontal size={14} /></button>
              </div>
            </div>

            {/* Column Content */}
            <div className="space-y-4 pb-10">
              {deals.filter(d => d.status === col.status).map(deal => (
                <div 
                  key={deal.id}
                  className="bg-white-pure rounded-[2rem] p-5 border border-border-line/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer ring-1 ring-inset ring-transparent hover:ring-brand-blue/10"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-medium text-text-gray/40 tracking-wider">#{deal.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest ${getPriorityColor(deal.priority)}`}>
                      {deal.priority}
                    </span>
                  </div>

                  {/* Dual Image Layout */}
                  <div className="grid grid-cols-2 gap-2 mb-5 h-28">
                    <div className="rounded-xl overflow-hidden border border-border-line/5">
                      <img src={deal.floorPlan} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Floorplan" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-border-line/5">
                      <img src={deal.propertyImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Property" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-text-dark group-hover:text-brand-blue transition-colors line-clamp-1 truncate">{deal.title}</h4>
                      <p className="text-base font-semibold text-text-dark">{formatPrice(deal.price)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-line/5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] text-text-gray/40 font-medium">
                          <Calendar size={12} className="text-text-gray/30" /> {deal.reservationDate}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-text-gray/40 font-medium truncate">
                          <User size={12} className="text-text-gray/30" /> {deal.client}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-text-gray/40 font-medium truncate">
                           <MapPin size={12} className="text-text-gray/30" /> {deal.source}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex -space-x-1.5">
                          {deal.members.map((m, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white-pure bg-brand-blue/10 flex items-center justify-center text-[8px] font-bold text-brand-blue ring-1 ring-brand-blue/5">
                              {m.name}
                            </div>
                          ))}
                          <div className="w-6 h-6 rounded-full border-2 border-white-pure bg-surface-gray text-[8px] font-bold text-text-gray/40 flex items-center justify-center">
                            +2
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-text-gray/30">
                          <div className="flex items-center gap-1">
                            <MessageSquare size={12} /> <span className="text-[10px] font-medium">{deal.commentsCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText size={12} /> <span className="text-[10px] font-medium">{deal.filesCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Lead Visual Placeholder */}
              <button className="w-full py-4 border-2 border-dashed border-border-line/20 rounded-[2rem] flex flex-col items-center justify-center text-text-gray/20 hover:border-brand-blue/20 hover:text-brand-blue/30 transition-all group">
                <PlusCircle size={24} strokeWidth={1.5} className="mb-1" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">Tambah Deal</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
