'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
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
  ArrowUpDown,
  X,
  Plus as PlusSmall,
  Hash,
  Briefcase
} from 'lucide-react';
import { MOCK_DEALS, Deal } from '@/lib/deals-mock';

export default function DealsPipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<null | 'new' | 'filter' | 'sort'>(null);
  
  // States for Filter/Sort
  const [sortConfig, setSortConfig] = useState<{key: keyof Deal | 'none', direction: 'asc' | 'desc'}>({key: 'none', direction: 'desc'});
  const [filterPriority, setFilterPriority] = useState<string>('Semua');

  // Drag and Drop State
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price).replace('Rp', 'Rp ');
  };

  const columns = [
    { title: 'Jadwal Survey', status: 'Survey', color: 'bg-amber-500' },
    { title: 'Negosiasi', status: 'Negosiasi', color: 'bg-blue-500' },
    { title: 'Legalitas & Dok', status: 'Legalitas', color: 'bg-emerald-500' },
  ];

  // Logic: Search + Filter + Sort
  const processedDeals = useMemo(() => {
    let result = [...deals];
    
    if (searchQuery) {
      result = result.filter(d => 
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriority !== 'Semua') {
      result = result.filter(d => d.priority === filterPriority);
    }

    if (sortConfig.key !== 'none') {
      result.sort((a, b) => {
        const valA = a[sortConfig.key as keyof Deal];
        const valB = b[sortConfig.key as keyof Deal];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
    }

    return result;
  }, [deals, searchQuery, filterPriority, sortConfig]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50';
      case 'Medium': return 'text-amber-500 bg-amber-50';
      default: return 'text-indigo-400 bg-indigo-50';
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    const dealId = e.dataTransfer.getData('dealId');
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: newStatus as any } : d));
    setDraggedDealId(null);
  };

  return (
    <div className="max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 relative">
      
      {/* Top Stats Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Value */}
        <div className="bg-white-pure p-8 rounded-[2rem] border border-border-line/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6 font-display">
            <h3 className="text-sm font-medium text-text-gray/60 flex items-center gap-2"> Pipeline Value <TrendingUp size={14} className="text-text-gray/30" /></h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Volume Asset</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">Rp 24.5M</h4>
               <p className="text-[10px] text-green-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 14%
               </p>
            </div>
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Komisi</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">Rp 490jt</h4>
               <p className="text-[10px] text-green-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 5%
               </p>
            </div>
          </div>
        </div>

        {/* Deal Activity */}
        <div className="bg-white-pure p-8 rounded-[2rem] border border-border-line/20 shadow-sm flex flex-col justify-between font-display">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-text-gray/60 flex items-center gap-2"> Deal Activity <Clock size={14} className="text-text-gray/30" /></h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Visit Terjadwal</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">20</h4>
               <p className="text-[10px] text-green-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 12%
               </p>
            </div>
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Penawaran</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">5</h4>
               <p className="text-[10px] text-amber-500 font-medium flex items-center gap-0.5 mt-1">
                 <ArrowUpRight size={10} /> 20%
               </p>
            </div>
          </div>
        </div>

        {/* Conversion & Speed */}
        <div className="bg-white-pure p-8 rounded-[2rem] border border-border-line/20 shadow-sm flex flex-col justify-between font-display">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-medium text-text-gray/60 flex items-center gap-2"> Conversion <CheckCircle2 size={14} className="text-text-gray/30" /></h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Avg. Closing</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">42 Hari</h4>
            </div>
            <div>
               <p className="text-[10px] font-semibold text-text-gray/30 uppercase tracking-widest mb-2">Win Rate</p>
               <h4 className="text-xl font-medium text-text-dark tracking-tight">12%</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white-pure/50 backdrop-blur-md p-4 rounded-[2.5rem] border border-border-line/10 shadow-sm sticky top-4 z-20">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setActiveModal('new')}
            className="group relative px-6 py-3.5 bg-brand-blue text-white-pure rounded-full text-sm font-semibold shadow-xl shadow-brand-blue/20 hover:bg-brand-blue-deep hover:shadow-brand-blue/30 transition-all duration-300 flex items-center gap-2.5 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <PlusCircle size={20} strokeWidth={2} />
            <span>Buat Deal Baru</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30 group-focus-within:text-brand-blue transition-colors" size={18} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Cari deal, properti, atau klien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-gray/40 border border-transparent rounded-full py-3.5 pl-12 pr-4 text-sm focus:bg-white-pure focus:border-brand-blue/20 outline-none transition-all shadow-inner"
            />
          </div>
          
          <div className="h-10 w-[1px] bg-border-line/10 mx-1 hidden md:block"></div>

          <button 
            onClick={() => setActiveModal('sort')}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-white-pure border border-border-line/20 rounded-full text-sm font-medium text-text-dark hover:bg-surface-gray hover:border-brand-blue/10 transition-all duration-300 shadow-sm active:scale-95"
          >
              <ArrowUpDown size={18} strokeWidth={1.5} className="text-text-gray/40" />
              <span>Urutkan</span>
              <ChevronDown size={14} className="text-text-gray/20" />
          </button>
          
          <button 
            onClick={() => setActiveModal('filter')}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-white-pure border border-border-line/20 rounded-full text-sm font-medium text-text-dark hover:bg-surface-gray hover:border-brand-blue/10 transition-all duration-300 shadow-sm active:scale-95"
          >
              <FilterIcon size={18} strokeWidth={1.5} className="text-text-gray/40" />
              <span>Filter</span>
              {filterPriority !== 'Semua' && (
                <div className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] flex items-center justify-center font-bold">1</div>
              )}
          </button>
        </div>
      </div>

      {/* Kanban Board - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[700px]">
        {columns.map((col, idx) => {
          const columnDeals = processedDeals.filter(d => d.status === col.status);
          return (
            <div 
              key={idx} 
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.status)}
              className="flex flex-col space-y-4 min-w-0"
            >
              {/* Column Header */}
              <div className={`p-4 rounded-2xl border-l-[6px] border ${col.color.replace('bg-', 'border-')} bg-white-pure shadow-sm flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                  <h3 className="text-sm font-semibold text-text-dark">{col.title}</h3>
                  <span className="text-xs text-text-gray/40 font-medium">{columnDeals.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 hover:bg-surface-gray rounded-lg transition-all text-text-gray/40"><Plus size={14} /></button>
                  <button className="p-1.5 hover:bg-surface-gray rounded-lg transition-all text-text-gray/40"><MoreHorizontal size={14} /></button>
                </div>
              </div>

              {/* Column Content */}
              <div className="space-y-4 pb-10 flex-1 rounded-3xl transition-colors duration-300">
                {columnDeals.map(deal => (
                  <div 
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className={`bg-white-pure rounded-[2rem] p-5 border border-border-line/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-grab active:cursor-grabbing ring-1 ring-inset ring-transparent hover:ring-brand-blue/10 ${draggedDealId === deal.id ? 'opacity-40 animate-pulse' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-medium text-text-gray/40 tracking-wider">#{deal.id}</span>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-widest ${getPriorityColor(deal.priority)}`}>
                        {deal.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-5 h-28 pointer-events-none">
                      <div className="rounded-xl overflow-hidden border border-border-line/5 bg-surface-gray">
                        <img src={deal.floorPlan} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Floorplan" />
                      </div>
                      <div className="rounded-xl overflow-hidden border border-border-line/5 bg-surface-gray">
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
                
                <button className="w-full py-4 border-2 border-dashed border-border-line/20 rounded-[2rem] flex flex-col items-center justify-center text-text-gray/20 hover:border-brand-blue/20 hover:text-brand-blue/30 transition-all group">
                  <PlusCircle size={24} strokeWidth={1.5} className="mb-1" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Tambah Deal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:pb-32 lg:pb-4">
          <div className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm animate-in fade-in transition-opacity" onClick={() => setActiveModal(null)}></div>
          
          <div className="bg-white-pure w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 pb-4 flex justify-between items-center bg-surface-gray/30">
              <h2 className="text-xl font-display font-medium text-text-dark flex items-center gap-3">
                {activeModal === 'new' && <><PlusCircle className="text-brand-blue" /> Buat Deal Baru</>}
                {activeModal === 'sort' && <><ArrowUpDown className="text-brand-blue" /> Urutkan Pipeline</>}
                {activeModal === 'filter' && <><FilterIcon className="text-brand-blue" /> Filter Properti</>}
              </h2>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2.5 hover:bg-white-pure rounded-full transition-all text-text-gray/40 hover:text-text-dark shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 pt-6 space-y-6">
              {activeModal === 'new' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-gray/60 flex items-center gap-2"><Briefcase size={14} /> Nama Deal / Unit</label>
                    <input type="text" placeholder="Contoh: Modern House Unit A1" className="w-full bg-surface-gray/50 border border-border-line/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-gray/60 flex items-center gap-2"><User size={14} /> Klien</label>
                      <input type="text" placeholder="Nama Klien" className="w-full bg-surface-gray/50 border border-border-line/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-text-gray/60 flex items-center gap-2"><Hash size={14} /> Harga (Rp)</label>
                      <input type="number" placeholder="1.200.000.000" className="w-full bg-surface-gray/50 border border-border-line/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-brand-blue/10 outline-none" />
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-brand-blue text-white-pure rounded-2xl font-semibold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all mt-4">Simpan Deal</button>
                </div>
              )}

              {activeModal === 'sort' && (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Terbaru', key: 'id', dir: 'desc' },
                    { label: 'Harga Tertinggi', key: 'price', dir: 'desc' },
                    { label: 'Harga Terendah', key: 'price', dir: 'asc' },
                    { label: 'Alphabet Klien (A-Z)', key: 'client', dir: 'asc' }
                  ].map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setSortConfig({key: opt.key as any, direction: opt.dir as any});
                        setActiveModal(null);
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${sortConfig.key === opt.key && sortConfig.direction === opt.dir ? 'bg-brand-blue/5 border-brand-blue text-brand-blue' : 'bg-surface-gray/30 border-transparent hover:bg-surface-gray hover:border-border-line/20'}`}
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      {sortConfig.key === opt.key && sortConfig.direction === opt.dir && <CheckCircle2 size={18} />}
                    </button>
                  ))}
                </div>
              )}

              {activeModal === 'filter' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-text-gray/60">Prioritas Deal</label>
                    <div className="flex flex-wrap gap-2">
                      {['Semua', 'High', 'Medium', 'Low'].map((p) => (
                        <button 
                          key={p}
                          onClick={() => setFilterPriority(p)}
                          className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${filterPriority === p ? 'bg-brand-blue text-white-pure' : 'bg-surface-gray hover:bg-surface-gray/80 text-text-gray'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-brand-blue text-white-pure rounded-2xl font-semibold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all mt-4 text-sm">Terapkan Filter</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
