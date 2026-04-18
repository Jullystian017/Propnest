'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, LayoutGrid, List, MapPin, Bed, Bath, Maximize,
  Building2, CheckCircle2, Clock, ArrowUpDown, ExternalLink,
  Map as MapIcon, ArrowUpRight, Pencil, Trash2, ChevronDown,
  Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useMyProperties, Property } from '@/hooks/useProperties';
import PropertyFormModal from '@/components/listing/PropertyFormModal';
import DeleteConfirmModal from '@/components/listing/DeleteConfirmModal';
import MapContainer from '@/components/maps/MapContainer';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

export default function ListingPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<Property | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  const { data: properties = [], isLoading, isError } = useMyProperties();

  const filtered = useMemo(() => {
    let list = properties;
    if (statusFilter !== 'Semua') list = list.filter(p => p.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
    }
    return list;
  }, [properties, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: properties.length,
    aktif: properties.filter(p => p.status === 'Aktif').length,
    terjual: properties.filter(p => p.status === 'Terjual').length,
  }), [properties]);

  const mapData = filtered.map(p => ({
    ...p,
    name: p.title,
    image: p.images?.[0],
    coords: p.lat && p.lng ? { lat: p.lat, lng: p.lng } : { lat: -7.025, lng: 110.320 },
    price: formatPrice(p.price).replace('Rp', 'Rp '),
  }));

  const handleAddNew = () => { setEditData(null); setIsFormOpen(true); };
  const handleEdit = (prop: Property) => { setEditData(prop); setIsFormOpen(true); };
  const handleDelete = (prop: Property) => setDeleteTarget(prop);
  const handleCloseForm = () => { setIsFormOpen(false); setEditData(null); };

  return (
    <>
      <PropertyFormModal isOpen={isFormOpen} onClose={handleCloseForm} editData={editData} />
      <DeleteConfirmModal property={deleteTarget} onClose={() => setDeleteTarget(null)} />

      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">Manajemen Properti</h1>
            <p className="text-sm font-normal text-text-gray/50">Kelola dan pantau semua unit properti Anda di sini.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-surface-gray/50 p-1 rounded-2xl border border-border-line/10">
              {(['grid', 'list', 'map'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-xl transition-all ${viewMode === mode ? 'bg-white-pure text-brand-blue shadow-sm' : 'text-text-gray/40 hover:text-text-gray'}`}
                >
                  {mode === 'grid' && <LayoutGrid size={18} strokeWidth={1.5} />}
                  {mode === 'list' && <List size={18} strokeWidth={1.5} />}
                  {mode === 'map' && <MapIcon size={18} strokeWidth={1.5} />}
                </button>
              ))}
            </div>
            <button
              onClick={handleAddNew}
              className="px-5 py-3 bg-brand-blue text-white-pure rounded-2xl text-sm font-medium shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={18} strokeWidth={1.5} />
              Tambah Unit Baru
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Portfolio Listing', value: `${stats.total} Unit`, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-500/10 to-transparent' },
            { label: 'Listing Aktif', value: `${stats.aktif} Unit`, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
            { label: 'Unit Tidak Aktif', value: `${stats.terjual} Unit`, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50', gradient: 'from-indigo-500/10 to-transparent' },
          ].map((stat, i) => (
            <div key={i} className="bg-white-pure p-6 rounded-[2.2rem] border border-border-line/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon size={22} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-current/5">
                    <ArrowUpRight size={10} />Live
                  </div>
                </div>
                <p className="text-[10px] uppercase font-semibold text-text-gray/50 tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-medium text-text-dark mt-1 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white-pure p-4 rounded-3xl border border-border-line/20 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={18} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Cari nama properti atau lokasi..."
              className="w-full bg-surface-gray/30 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-normal focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-text-gray/30"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {['Semua', 'Aktif', 'Nonaktif'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all border ${
                  statusFilter === s
                    ? 'bg-brand-blue text-white-pure border-brand-blue shadow-sm'
                    : 'bg-white-pure border-border-line/20 text-text-gray/60 hover:border-brand-blue/30'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-text-gray/40">
            <Loader2 size={36} className="animate-spin mb-4 text-brand-blue/40" />
            <p className="text-sm font-medium">Memuat data properti...</p>
          </div>
        )}
        {isError && (
          <div className="flex items-center gap-3 p-5 bg-red-50/50 border border-red-100/50 rounded-2xl">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-500">Gagal memuat properti. Pastikan Anda sudah login.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-brand-blue/5 rounded-3xl flex items-center justify-center mb-5">
              <Building2 size={32} className="text-brand-blue/40" />
            </div>
            <h3 className="text-lg font-display font-medium text-text-dark mb-2">
              {searchQuery || statusFilter !== 'Semua' ? 'Properti tidak ditemukan' : 'Belum ada properti'}
            </h3>
            <p className="text-sm text-text-gray/40 mb-6 max-w-xs">
              {searchQuery || statusFilter !== 'Semua' ? 'Coba ubah filter atau kata kunci pencarian Anda.' : 'Mulai tambahkan properti pertama Anda untuk dipublikasikan.'}
            </p>
            {!searchQuery && statusFilter === 'Semua' && (
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-brand-blue text-white-pure rounded-2xl text-sm font-medium shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                Tambah Properti Pertama
              </button>
            )}
          </div>
        )}

        {/* Grid View */}
        {!isLoading && viewMode === 'grid' && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(prop => (
              <div key={prop.id} className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft group-hover:shadow-md transition-all duration-700">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
                    alt={prop.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                  />
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-white-pure/90 px-3 py-1.5 rounded-full shadow-premium border border-white/20 text-[10px] font-medium flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${prop.status === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    <span className={prop.status === 'Aktif' ? 'text-emerald-600' : 'text-text-gray/60'}>{prop.status}</span>
                  </div>
                  <div className="absolute top-4 right-4 backdrop-blur-md bg-white-pure/90 px-3 py-1.5 rounded-full shadow-premium border border-white/20 text-[9px] font-medium text-text-gray/60 uppercase tracking-widest">
                    {prop.type}
                  </div>
                </div>
                
                <div className="relative -mt-14 mx-3 bg-white-pure rounded-[1.5rem] p-5 shadow-premium border border-border-line/20 group-hover:border-brand-blue/30 transition-all duration-500 z-10">
                  <div className="flex justify-between items-start mb-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-medium text-text-dark group-hover:text-brand-blue transition-colors truncate">{prop.title}</h3>
                      <p className="flex items-center gap-1.5 text-[11px] text-text-gray/50 font-normal mt-0.5">
                        <MapPin size={12} className="text-brand-blue" strokeWidth={1.5} />
                        <span className="truncate">{prop.location}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="my-3 border-t border-border-line/5 w-full" />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-text-dark tracking-tight">
                      {formatPrice(prop.price).replace('Rp', 'Rp ')}
                    </p>
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-brand-blue/60 bg-brand-blue/5 px-2 py-1 rounded-full">
                      {prop.price_type}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border-line/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-medium text-text-gray/40">
                      <span className="flex items-center gap-1.5"><Bed size={14} strokeWidth={1.5} className="text-brand-blue/40" /> {prop.bedrooms}</span>
                      <span className="flex items-center gap-1.5"><Bath size={14} strokeWidth={1.5} className="text-brand-blue/40" /> {prop.bathrooms}</span>
                      <span className="flex items-center gap-1.5"><Maximize size={14} strokeWidth={1.5} className="text-brand-blue/40" /> {prop.land_area}m²</span>
                    </div>
                    
                    {/* Action Buttons - Always Visible */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.preventDefault(); handleEdit(prop); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue/5 text-brand-blue rounded-xl text-[10px] font-bold hover:bg-brand-blue hover:text-white-pure transition-all active:scale-95"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); handleDelete(prop); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold hover:bg-red-500 hover:text-white-pure transition-all active:scale-95"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!isLoading && viewMode === 'list' && filtered.length > 0 && (
          <div className="bg-white-pure rounded-[2rem] border border-border-line/20 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-gray/20 text-[10px] font-medium text-text-gray/40 uppercase tracking-widest border-b border-border-line/5">
                  <th className="p-6 pl-10">Data Properti</th>
                  <th className="p-6">Lokasi & Tipe</th>
                  <th className="p-6">Spek</th>
                  <th className="p-6">Harga</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 pr-10">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-line/5 text-sm">
                {filtered.map(prop => (
                  <tr key={prop.id} className="hover:bg-surface-gray/10 transition-all group">
                    <td className="p-6 pl-10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl overflow-hidden border border-border-line/10 flex-none">
                          <img
                            src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=60'}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="font-medium text-text-dark text-sm">{prop.title}</div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="text-xs text-text-dark/80">{prop.location}</div>
                      <div className="text-[10px] text-brand-blue uppercase tracking-widest mt-0.5">{prop.type}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-xs text-text-gray/60">{prop.bedrooms}KT · {prop.bathrooms}KM · {prop.land_area}m²</div>
                    </td>
                    <td className="p-6">
                      <div className="font-medium text-text-dark text-xs">{formatPrice(prop.price).replace('Rp', 'Rp ')}</div>
                      <div className="text-[9px] text-brand-blue/60 mt-0.5">{prop.price_type}</div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-medium border ${
                        prop.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-600/10'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-6 pr-10">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(prop)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue/5 text-brand-blue rounded-xl text-xs font-bold hover:bg-brand-blue hover:text-white-pure transition-all active:scale-95"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prop)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white-pure transition-all active:scale-95"
                        >
                          <Trash2 size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Map View */}
        {!isLoading && viewMode === 'map' && (
          <div className="bg-white-pure rounded-[2rem] border border-border-line/20 shadow-sm overflow-hidden h-[600px] flex animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full md:w-[350px] lg:w-[400px] flex-none border-r border-border-line/10 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border-line/10">
                <div className="text-sm font-medium text-text-dark">{filtered.length} Unit Ditemukan</div>
                <div className="text-[10px] text-text-gray/40 font-normal mt-0.5">Gulir untuk melihat daftar lengkap</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {filtered.map(prop => (
                  <div key={prop.id} className="flex gap-4 p-3 rounded-2xl border border-border-line/10 hover:border-brand-blue/30 transition-all group">
                    <div className="w-24 h-20 rounded-xl overflow-hidden flex-none shadow-sm">
                      <img
                        src={prop.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=60'}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <div className="min-w-0 py-1 flex-1">
                      <h4 className="text-sm font-medium text-text-dark truncate">{prop.title}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-text-gray/50 mt-1 truncate">
                        <MapPin size={10} className="text-brand-blue" /> {prop.location}
                      </div>
                      <div className="text-xs font-medium text-brand-blue mt-2">{formatPrice(prop.price).replace('Rp', 'Rp ')}</div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center">
                      <button onClick={() => handleEdit(prop)} className="w-7 h-7 rounded-xl bg-brand-blue/5 text-brand-blue hover:bg-brand-blue hover:text-white-pure transition-all flex items-center justify-center">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDelete(prop)} className="w-7 h-7 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white-pure transition-all flex items-center justify-center">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 h-full relative">
              <MapContainer properties={mapData} />
            </div>
          </div>
        )}

      </div>
    </>
  );
}
