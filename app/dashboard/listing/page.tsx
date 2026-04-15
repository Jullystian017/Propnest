'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  MoreVertical, 
  ChevronDown,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ListingPage() {
  const supabase = createClient();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Logic to fetch properties
  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Mock data for demonstration if empty
  const displayProperties = properties.length > 0 ? properties : [
    {
      id: '1',
      title: 'Vila Tropis Ungaran',
      location: 'Ungaran, Semarang',
      price: 2500000000,
      type: 'Vila',
      status: 'Aktif',
      bedrooms: 3,
      bathrooms: 2,
      land_area: 200,
      building_area: 150,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '2',
      title: 'Modern Minimalis Tembalang',
      location: 'Tembalang, Semarang',
      price: 1200000000,
      type: 'Rumah',
      status: 'Terjual',
      bedrooms: 2,
      bathrooms: 1,
      land_area: 120,
      building_area: 90,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']
    },
    {
      id: '3',
      title: 'Ruko Sentra Bisnis',
      location: 'Banyumanik, Semarang',
      price: 3500000000,
      type: 'Ruko',
      status: 'Aktif',
      bedrooms: 0,
      bathrooms: 2,
      land_area: 100,
      building_area: 180,
      images: ['https://images.unsplash.com/photo-1582034951913-a66f1ed124c0?auto=format&fit=crop&w=800&q=80']
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">Manajemen Properti</h1>
          <p className="text-sm font-normal text-text-gray/50">Kelola dan pantau semua unit properti Anda di sini.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-surface-gray/50 p-1 rounded-2xl border border-border-line/10">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white-pure text-brand-blue shadow-sm' : 'text-text-gray/40 hover:text-text-gray'}`}
                >
                  <LayoutGrid size={18} strokeWidth={1.5} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white-pure text-brand-blue shadow-sm' : 'text-text-gray/40 hover:text-text-gray'}`}
                >
                  <List size={18} strokeWidth={1.5} />
                </button>
            </div>
            <button className="px-5 py-3 bg-brand-blue text-white-pure rounded-2xl text-sm font-medium shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all flex items-center gap-2 active:scale-95">
              <Plus size={18} strokeWidth={1.5} />
              Tambah Unit Baru
            </button>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Listing', value: '24 Unit', icon: Building2, bg: 'bg-blue-50 text-blue-600' },
          { label: 'Listing Aktif', value: '18 Unit', icon: Clock, bg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Unit Terjual', value: '6 Unit', icon: CheckCircle2, bg: 'bg-indigo-50 text-indigo-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white-pure p-6 rounded-[2rem] border border-border-line/20 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon size={22} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-text-gray/40 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-medium text-text-dark">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white-pure p-4 rounded-3xl border border-border-line/20 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={18} strokeWidth={1.5} />
            <input 
                type="text" 
                placeholder="Cari nama properti atau lokasi..."
                className="w-full bg-surface-gray/30 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-normal focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-text-gray/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-5 py-3 bg-white-pure border border-border-line/10 rounded-2xl text-sm font-medium text-text-gray hover:text-text-dark transition-all">
                <Filter size={18} strokeWidth={1.5} />
                Filter
                <ChevronDown size={14} className="text-text-gray/40" />
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-white-pure border border-border-line/10 rounded-2xl text-sm font-medium text-text-gray hover:text-text-dark transition-all">
                <ArrowUpDown size={18} strokeWidth={1.5} />
                Urutkan
            </button>
        </div>
      </div>

      {/* Properties Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((prop) => (
            <Link
              key={prop.id}
              href={`/properti/${prop.id}`}
              className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft group-hover:shadow-md transition-all duration-700">
                <img 
                  src={prop.images?.[0] || 'https://via.placeholder.com/400x300'} 
                  alt={prop.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]"
                />

                {/* Status Badge (Top Left) */}
                <div className="absolute top-4 left-4 backdrop-blur-md bg-white-pure/90 px-3 py-1.5 rounded-full shadow-premium border border-white/20 text-[10px] font-medium flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${prop.status === 'Aktif' ? 'bg-emerald-500' : 'bg-brand-blue'}`}></span>
                  <span className={prop.status === 'Aktif' ? 'text-emerald-600' : 'text-brand-blue'}>
                    {prop.status}
                  </span>
                </div>

                {/* Type Badge (Top Right) */}
                <div className="absolute top-4 right-4 backdrop-blur-md bg-white-pure/90 px-3 py-1.5 rounded-full shadow-premium border border-white/20 text-[9px] font-medium text-text-gray/60 uppercase tracking-widest">
                  {prop.type}
                </div>
              </div>

              {/* Floating Content Box */}
              <div className="relative -mt-14 mx-3 bg-white-pure rounded-[1.5rem] p-5 shadow-premium border border-border-line/20 group-hover:border-brand-blue/30 transition-all duration-500 z-10">
                <div className="flex justify-between items-start mb-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium text-text-dark group-hover:text-brand-blue transition-colors truncate">
                      {prop.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-[11px] text-text-gray/50 font-normal mt-0.5">
                      <MapPin size={12} className="text-brand-blue" strokeWidth={1.5} />
                      <span className="truncate">{prop.location}</span>
                    </p>
                  </div>

                  <div className="p-2.5 bg-surface-gray/50 text-text-gray/40 rounded-full hover:bg-brand-blue hover:text-white-pure transition-all duration-300 active:scale-95">
                    <MoreVertical size={16} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="my-3 border-t border-border-line/5 w-full"></div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-text-dark tracking-tight">
                    {formatPrice(prop.price).replace('Rp', 'Rp ')}
                  </p>
                </div>

                {/* Quick Specs (Compact) */}
                <div className="mt-4 pt-4 border-t border-border-line/5 flex items-center justify-between text-[10px] font-medium text-text-gray/40">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Bed size={14} strokeWidth={1.5} className="text-brand-blue/40" /> {prop.bedrooms} KT</span>
                    <span className="flex items-center gap-1.5"><Bath size={14} strokeWidth={1.5} className="text-brand-blue/40" /> {prop.bathrooms} KM</span>
                    <span className="flex items-center gap-1.5"><Maximize size={14} strokeWidth={1.5} className="text-brand-blue/40" /> {prop.land_area}m²</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-brand-blue hover:text-brand-blue-deep transition-colors flex items-center gap-1.5">
                    Lihat Detail <ExternalLink size={10} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      ) : (
        /* List View Mode */
        <div className="bg-white-pure rounded-[2rem] border border-border-line/20 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface-gray/20 text-[10px] font-medium text-text-gray/40 uppercase tracking-widest border-b border-border-line/5">
                        <th className="p-6 pl-10">Data Properti</th>
                        <th className="p-6">Lokasi & Tipe</th>
                        <th className="p-6">Spek Unit</th>
                        <th className="p-6">Harga</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 pr-10">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-line/5 text-sm">
                    {displayProperties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-surface-gray/10 transition-all group">
                            <td className="p-6 pl-10">
                                <Link href={`/properti/${prop.id}`} className="flex items-center gap-4 hover:translate-x-1 transition-all group/cell">
                                    <div className="w-16 h-12 rounded-xl overflow-hidden border border-border-line/10 flex-none group-hover/cell:border-brand-blue/30">
                                        <img src={prop.images?.[0]} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="font-medium text-text-dark group-hover/cell:text-brand-blue transition-colors">{prop.title}</div>
                                </Link>
                            </td>
                            <td className="p-6">
                                <div className="text-xs text-text-dark/80">{prop.location}</div>
                                <div className="text-[10px] text-brand-blue uppercase tracking-widest mt-0.5">{prop.type}</div>
                            </td>
                            <td className="p-6">
                                <div className="text-xs text-text-gray/60">{prop.bedrooms}KT • {prop.bathrooms}KM • {prop.land_area}m²</div>
                            </td>
                            <td className="p-6">
                                <div className="font-medium text-text-dark text-xs">{formatPrice(prop.price)}</div>
                            </td>
                            <td className="p-6">
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-medium border ${
                                    prop.status === 'Aktif' 
                                      ? 'bg-emerald-50 text-emerald-600 border-emerald-600/10' 
                                      : 'bg-brand-blue/5 text-brand-blue border-brand-blue/10'
                                }`}>
                                    {prop.status}
                                </span>
                            </td>
                            <td className="p-6 pr-10">
                                <button className="p-2 hover:bg-surface-gray rounded-xl transition-all">
                                    <MoreVertical size={16} strokeWidth={1.5} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl border border-border-line/10 flex items-center justify-center text-text-gray/40 hover:bg-white-pure transition-all">1</button>
              <button className="w-10 h-10 rounded-xl border border-border-line/10 flex items-center justify-center text-text-gray/40 hover:bg-white-pure transition-all">2</button>
              <button className="w-10 h-10 rounded-xl border border-border-line/10 flex items-center justify-center text-text-gray/40 hover:bg-white-pure transition-all">3</button>
          </div>
      </div>

    </div>
  );
}
