'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import MapContainer from '@/components/maps/MapContainer';
import { 
  Heart, Search, Filter, BedDouble, Bath, Scaling, 
  Map as MapIcon, ChevronDown, List, X, House, Wifi, Car,
  Bookmark, Star 
} from 'lucide-react';

const MOCK_PROPERTIES = [
  {
    id: '1',
    name: 'Rumah Modern Minimalis BSB',
    location: 'BSB City, Semarang',
    price: 'Rp 1,25 Miliar',
    specs: { beds: 4, baths: 3, size: 180 },
    badge: 'Baru',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600&h=400',
    coords: { lat: -7.025, lng: 110.320 },
  },
  {
    id: '2',
    name: 'Cluster Premium Colomadu',
    location: 'Colomadu, Solo',
    price: 'Rp 875 Juta',
    specs: { beds: 3, baths: 2, size: 120 },
    badge: 'Populer',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600&h=400',
    coords: { lat: -7.535, lng: 110.780 },
  },
  {
    id: '3',
    name: 'Vila Tropis Ungaran',
    location: 'Ungaran, Semarang',
    price: 'Rp 2,1 Miliar',
    specs: { beds: 5, baths: 4, size: 350 },
    badge: 'Eksklusif',
    image: 'https://images.unsplash.com/photo-1600607687931-cebf10c2c31e?auto=format&fit=crop&q=80&w=600&h=400',
    coords: { lat: -7.140, lng: 110.400 },
  },
  {
    id: '4',
    name: 'Griya Asri Premiere',
    location: 'Purwokerto Utara',
    price: 'Rp 350 Juta',
    specs: { beds: 3, baths: 2, size: 90 },
    badge: 'Promo',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=600&h=400',
    coords: { lat: -7.400, lng: 109.240 },
  },
  {
    id: '5',
    name: 'Cilacap Bay View',
    location: 'Cilacap Tengah',
    price: 'Rp 420 Juta',
    specs: { beds: 2, baths: 1, size: 70 },
    badge: 'Baru',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600&h=400',
    coords: { lat: -7.710, lng: 109.020 },
  },
  {
    id: '6',
    name: 'Taman Sari Solo Baru',
    location: 'Solo Baru, Sukoharjo',
    price: 'Rp 1,1 Miliar',
    specs: { beds: 3, baths: 2, size: 140 },
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=600&h=400',
    coords: { lat: -7.595, lng: 110.815 },
  },
];

export default function CariPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
  const [activePopover, setActivePopover] = useState<'harga' | 'tipe' | 'kamar' | 'sort' | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Terbaru');

  const togglePopover = (type: 'harga' | 'tipe' | 'kamar' | 'sort') => {
    setActivePopover(activePopover === type ? null : type);
  };

  const closePopovers = () => setActivePopover(null);

  return (
    <div className="bg-white-pure min-h-screen flex flex-col font-sans pt-20">
      <Navbar />

      {/* ────── HEADER SEARCH BAR (STICKY TOP-0) ────── */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-border-line/50 transition-all duration-300">
        <div className="container-standard py-4 flex flex-wrap items-center gap-4">
          
          {/* Main Search Input */}
          <div className="flex-1 min-w-[300px] relative z-[60]">
            <div className={`relative group transition-all duration-300 ${isSearchFocused ? 'scale-[1.01]' : ''}`}>
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-brand-blue' : 'text-text-gray/50'}`} size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Cari lokasi, perumahan, atau area..." 
                className={`w-full pl-14 pr-12 py-3.5 bg-[#F1F1F3] border-none rounded-full text-sm font-medium outline-none transition-all shadow-inner ${isSearchFocused ? 'bg-white-pure shadow-premium ring-4 ring-brand-blue/5' : 'hover:bg-gray-200'}`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-300 rounded-full text-text-gray transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white-pure rounded-[2rem] shadow-premium border border-border-line overflow-hidden animate-in fade-in slide-in-from-top-2 max-w-lg lg:max-w-xl">
                <div className="p-5 max-h-[350px] overflow-y-auto">
                  
                  {/* Category: Locations */}
                  <div className="mb-5">
                    <h4 className="text-[9px] font-bold text-text-gray uppercase tracking-[0.1em] mb-2.5 px-2">Lokasi Populer</h4>
                    <div className="space-y-0.5">
                      {['Semarang Tengah', 'Solo Baru', 'Ungaran Barat', 'BSB City'].map((loc) => (
                        <button 
                          key={loc} 
                          onClick={() => { setSearchQuery(loc); setIsSearchFocused(false); }}
                          className="w-full flex items-center gap-3 p-2.5 hover:bg-surface-gray rounded-xl transition-all group text-left"
                        >
                          <div className="p-1.5 bg-blue-50 text-brand-blue rounded-lg group-hover:bg-brand-blue group-hover:text-white-pure transition-colors">
                            <MapIcon size={12} />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-text-dark">{loc}</span>
                            <span className="block text-[9px] text-text-gray">Jawa Tengah</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category: Projects */}
                  <div>
                    <h4 className="text-[9px] font-bold text-text-gray uppercase tracking-[0.1em] mb-2.5 px-2">Proyek Terbaru</h4>
                    <div className="space-y-1">
                      {['Griya Asri Premiere', 'Cilacap Bay View'].map((proj) => (
                        <button 
                          key={proj} 
                          onClick={() => { setSearchQuery(proj); setIsSearchFocused(false); }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-surface-gray rounded-2xl transition-all group text-left border border-transparent hover:border-border-line/40"
                        >
                          <div className="p-2 bg-blue-50 text-brand-blue rounded-xl group-hover:bg-brand-blue group-hover:text-white-pure transition-colors">
                            <House size={14} />
                          </div>
                          <span className="text-sm font-semibold text-text-dark">{proj}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
                <div className="bg-surface-gray/50 p-3.5 border-t border-border-line flex justify-center">
                   <p className="text-[10px] text-text-gray font-medium italic">Klik lokasi untuk mencari otomatis</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Filters - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2.5 relative">
            
            {/* Harga Filter */}
            <div className="relative">
              <button 
                onClick={() => togglePopover('harga')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${activePopover === 'harga' ? 'bg-brand-blue text-white-pure shadow-soft ring-4 ring-brand-blue/10' : 'bg-[#F1F1F3] text-text-dark/70 hover:bg-gray-200 hover:text-text-dark'}`}
              >
                Harga <ChevronDown size={14} className={`transition-transform duration-300 ${activePopover === 'harga' ? 'rotate-180' : ''}`} />
              </button>
              
              {activePopover === 'harga' && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-white-pure rounded-[2rem] shadow-premium border border-border-line/50 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-bold text-text-gray mb-4 uppercase tracking-widest">Rentang Harga</h4>
                  <div className="space-y-1">
                    {['< 500 Juta', '500jt - 1M', '1M - 2M', '> 2 Miliar'].map((p) => (
                      <label key={p} className="flex items-center gap-3 p-2.5 hover:bg-surface-gray rounded-xl cursor-pointer transition-colors group">
                        <input type="radio" name="harga" className="w-4 h-4 text-brand-blue border-gray-300 focus:ring-brand-blue" />
                        <span className="text-sm font-medium text-text-gray group-hover:text-text-dark">{p}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={closePopovers} className="w-full mt-4 py-2.5 bg-brand-blue text-white-pure text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-soft">Terapkan</button>
                </div>
              )}
            </div>

            {/* Tipe Filter */}
            <div className="relative">
              <button 
                onClick={() => togglePopover('tipe')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${activePopover === 'tipe' ? 'bg-brand-blue text-white-pure shadow-soft ring-4 ring-brand-blue/10' : 'bg-[#F1F1F3] text-text-dark/70 hover:bg-gray-200 hover:text-text-dark'}`}
              >
                Tipe <ChevronDown size={14} className={`transition-transform duration-300 ${activePopover === 'tipe' ? 'rotate-180' : ''}`} />
              </button>

              {activePopover === 'tipe' && (
                <div className="absolute top-full left-0 mt-3 w-60 bg-white-pure rounded-[2rem] shadow-premium border border-border-line/50 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-bold text-text-gray mb-4 uppercase tracking-widest">Tipe Properti</h4>
                  <div className="space-y-1">
                    {['Rumah', 'Apartemen', 'Ruko', 'Vila'].map((t) => (
                      <label key={t} className="flex items-center gap-3 p-2.5 hover:bg-surface-gray rounded-xl cursor-pointer transition-colors group">
                        <input type="checkbox" className="w-4 h-4 rounded text-brand-blue border-gray-300 focus:ring-brand-blue" />
                        <span className="text-sm font-medium text-text-gray group-hover:text-text-dark">{t}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={closePopovers} className="w-full mt-4 py-2.5 bg-brand-blue text-white-pure text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-soft">Terapkan</button>
                </div>
              )}
            </div>

            {/* Kamar Filter */}
            <div className="relative">
              <button 
                onClick={() => togglePopover('kamar')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all ${activePopover === 'kamar' ? 'bg-brand-blue text-white-pure shadow-soft ring-4 ring-brand-blue/10' : 'bg-[#F1F1F3] text-text-dark/70 hover:bg-gray-200 hover:text-text-dark'}`}
              >
                Kamar <ChevronDown size={14} className={`transition-transform duration-300 ${activePopover === 'kamar' ? 'rotate-180' : ''}`} />
              </button>

              {activePopover === 'kamar' && (
                <div className="absolute top-full right-0 lg:left-0 mt-3 w-60 bg-white-pure rounded-[2rem] shadow-premium border border-border-line/50 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-bold text-text-gray mb-4 uppercase tracking-widest">Kamar Tidur</h4>
                  <div className="flex items-center justify-between gap-1 p-1 bg-surface-gray rounded-xl mb-4">
                    {['Semua', '1+', '2+', '3+', '4+'].map((k) => (
                      <button key={k} className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${k === 'Semua' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray hover:text-text-dark'}`}>
                        {k}
                      </button>
                    ))}
                  </div>
                  <button onClick={closePopovers} className="w-full py-2.5 bg-brand-blue text-white-pure text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-soft">Terapkan</button>
                </div>
              )}
            </div>

          </div>

          <div className="h-6 w-px bg-border-line/40 hidden lg:block mx-1"></div>

          {/* More Filters Toggle */}
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2.5 px-6 py-2.5 bg-[#F1F1F3] rounded-full text-[13px] font-bold text-text-dark hover:bg-gray-200 transition-all active:scale-95 group"
          >
            <Filter size={16} className="text-text-gray/70 group-hover:text-brand-blue transition-colors" /> 
            <span className="hidden sm:inline">Filter Lengkap</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-[#F1F1F3] p-1.5 rounded-full">
            <button 
               onClick={() => setViewMode('split')}
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${viewMode === 'split' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray/60 hover:text-text-dark'}`}
            >
              <MapIcon size={14} /> <span className="hidden xl:inline">Peta</span>
            </button>
            <button 
               onClick={() => setViewMode('list')}
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${viewMode === 'list' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray/60 hover:text-text-dark'}`}
            >
              <List size={14} /> <span className="hidden xl:inline">Daftar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ────── MAIN SPLIT CONTENT ────── */}
      <div className="flex-1 flex min-h-0 container-standard gap-x-12">
        
        {/* LEFT: LISTING AREA */}
        <div className={`flex-1 overflow-y-auto lg:pr-8 ${viewMode === 'split' ? 'lg:w-[50%] xl:w-[55%]' : 'w-full'}`}>
          <div className="py-8 px-0 max-w-full">
            
            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-xl font-semibold text-text-dark">Properti di Jawa Tengah</h1>
                  <p className="text-sm text-text-gray">Menampilkan 1-6 dari 145 hasil</p>
               </div>
                <div className="relative">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-gray">
                    Urutkan: 
                    <button 
                      onClick={() => togglePopover('sort')}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all duration-300 ${activePopover === 'sort' ? 'bg-brand-blue text-white-pure shadow-soft' : 'bg-surface-gray border border-border-line/40 text-text-dark hover:border-brand-blue hover:text-brand-blue shadow-inner'}`}
                    >
                      {sortBy} <ChevronDown size={14} className={`transition-transform duration-300 ${activePopover === 'sort' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {activePopover === 'sort' && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white-pure rounded-2xl shadow-premium border border-border-line p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      {[
                        'Terbaru', 
                        'Harga Terendah', 
                        'Harga Tertinggi', 
                        'Paling Populer'
                      ].map((item) => (
                        <button 
                          key={item}
                          onClick={() => { setSortBy(item); setActivePopover(null); }}
                          className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl transition-colors ${sortBy === item ? 'bg-blue-50 text-brand-blue' : 'text-text-gray hover:bg-surface-gray hover:text-text-dark'}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            {/* PRODUCT GRID - 1 Column when split, 3 Columns when list */}
            <div className={`grid gap-x-8 gap-y-12 ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {MOCK_PROPERTIES.map((item) => {
                if (viewMode === 'split') {
                  // STYLE FOR SPLIT VIEW (Original Horizontal Card restored)
                  return (
                    <Link 
                      key={item.id} 
                      href={`/properti/${item.id}`} 
                      className="group flex gap-5 items-start border-b border-border-line/40 pb-6 last:border-0 hover:bg-surface-gray/30 -mx-4 px-4 rounded-xl transition-all duration-300"
                    >
                      <div className="relative w-[180px] sm:w-[240px] aspect-[4/3] shrink-0 rounded-xl overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000" style={{ backgroundImage: `url(${item.image})` }}></div>
                        <div className="absolute top-2 left-2 bg-white-pure/95 backdrop-blur-sm text-[9px] font-bold text-text-dark px-2 py-0.5 rounded shadow-sm border border-white/20">
                          {item.badge}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <h3 className="text-[15px] font-semibold text-text-dark group-hover:text-brand-blue transition-colors pr-2 leading-snug">{item.name}</h3>
                          <span className="text-sm font-extrabold text-text-dark whitespace-nowrap pt-0.5">{item.price}</span>
                        </div>
                        <p className="text-xs text-text-gray flex items-center gap-1 mt-1.5">
                          <MapIcon size={12} className="shrink-0" /> {item.location}
                        </p>
                        <div className="mt-3.5 flex items-center gap-4 text-[11px] font-medium text-text-gray">
                           <span className="flex items-center gap-1"><BedDouble size={15} className="text-brand-blue/70" /> {item.specs.beds} Bed</span>
                           <span className="flex items-center gap-1"><Bath size={15} className="text-brand-blue/70" /> {item.specs.baths} Bath</span>
                           <span className="flex items-center gap-1"><Scaling size={15} className="text-brand-blue/70" /> {item.specs.size}m²</span>
                        </div>
                        <p className="hidden sm:block text-[11px] text-text-gray leading-relaxed pt-2 line-clamp-2">
                          Properti premium dengan desain modern yang terletak di lokasi strategis. Fasilitas lengkap dengan keamanan 24 jam...
                        </p>
                      </div>
                    </Link>
                  );
                }

                // STYLE FOR LIST VIEW (New Premium Floating Card - Precise Version)
                return (
                  <Link 
                    key={item.id} 
                    href={`/properti/${item.id}`} 
                    className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2`}
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft group-hover:shadow-md transition-all duration-700">
                      <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[3s]" style={{ backgroundImage: `url(${item.image})` }}></div>
                      
                      {/* Dynamic Badge */}
                      <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/30 text-[10px] font-extrabold flex items-center gap-1.5
                        ${item.badge === 'Baru' ? 'bg-blue-50/90 text-brand-blue' : 
                          item.badge === 'Populer' ? 'bg-text-dark/90 text-white-pure' : 
                          'bg-white-pure/90 text-brand-blue-deep'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.badge === 'Baru' ? 'bg-brand-blue' : 'bg-brand-blue-light'}`}></span>
                        {item.badge === 'Baru' ? 'Home' : item.badge}
                      </div>
                    </div>

                    {/* Floating Content Box */}
                    <div className="relative -mt-14 mx-3 bg-white-pure rounded-xl p-4 shadow-premium border border-border-line/20 group-hover:border-brand-blue/30 transition-all duration-500 z-10">
                      <div className="flex justify-between items-start mb-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-text-dark group-hover:text-brand-blue transition-colors truncate">
                            {item.name}
                          </h3>
                          <p className="flex items-center gap-1.5 text-[11px] text-text-gray font-medium mt-0.5">
                            <MapIcon size={12} className="text-brand-blue" />
                            <span className="truncate">{item.location}</span>
                          </p>
                        </div>
                        
                        <button className="p-2.5 bg-blue-50/80 text-brand-blue rounded-full hover:bg-brand-blue hover:text-white-pure transition-all duration-300 shadow-sm overflow-hidden active:scale-95 group-hover:shadow-soft">
                          <Bookmark size={16} fill="currentColor" className="fill-transparent hover:fill-current" />
                        </button>
                      </div>

                      <div className="my-2.5 border-t border-border-line/30 w-full"></div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-lg font-extrabold text-text-dark">
                            Rp{item.price.replace('Rp ', '').replace(' Juta', 'jt').replace(' Miliar', 'M')}
                          </p>
                        </div>
                      </div>

                      {/* Quick Specs (Compact) */}
                      <div className="mt-3 pt-3 border-t border-border-line/30 flex items-center gap-4 text-[10px] font-bold text-text-gray/80">
                         <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-brand-blue/60" /> {item.specs.beds} Bed</span>
                         <span className="flex items-center gap-1.5"><Bath size={14} className="text-brand-blue/60" /> {item.specs.baths} Bath</span>
                         <span className="flex items-center gap-1.5"><Scaling size={14} className="text-brand-blue/60" /> {item.specs.size}m²</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-16 pt-8 border-t border-border-line/40 flex justify-center">
               <button className="text-sm font-semibold text-white-pure bg-brand-blue px-8 py-3 rounded-full shadow-soft hover:bg-blue-700 transition-all active:scale-95">
                 Muat Lebih Banyak
               </button>
            </div>
          </div>
        </div>

        {/* RIGHT: MAP AREA (STICKY) */}
        {viewMode === 'split' && (
          <div className="hidden lg:block lg:w-[50%] xl:w-[45%] h-[calc(100vh-64px)] sticky top-[64px] p-4 lg:pr-0">
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-border-line/50 shadow-premium bg-surface-dim">
               <MapContainer properties={MOCK_PROPERTIES} />
               
               {/* Map Info Overlay */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-white-pure/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 text-xs font-semibold text-brand-blue flex items-center gap-2 pointer-events-none">
                 <MapIcon size={14} /> Peta Interaktif Leaflet
               </div>
            </div>
          </div>
        )}
      </div>

      {/* ────── ADVANCED FILTER OVERLAY ────── */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] bg-black-pure/40 flex items-center justify-center p-4">
           <div className="bg-white-pure w-full max-w-2xl rounded-3xl shadow-premium overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-5 border-b border-border-line flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-dark flex items-center gap-2">
                  <Filter size={20} className="text-brand-blue"/> Filter Lengkap
                </h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-surface-gray rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                 {/* Section: Fasilitas */}
                 <div>
                   <h3 className="text-sm font-bold text-text-dark mb-4 uppercase tracking-wider">Fasilitas Properti</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        {n: 'WiFi', i: <Wifi size={18}/>},
                        {n: 'Parkir Luas', i: <Car size={18}/>},
                        {n: 'Keamanan 24J', i: <House size={18}/>},
                        {n: 'Kolam Renang', i: <Scaling size={18}/>},
                        {n: 'Taman Bermain', i: <House size={18}/>},
                        {n: 'Gym Area', i: <Scaling size={18}/>},
                      ].map((f, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 border border-border-line rounded-xl cursor-pointer hover:border-brand-blue transition-all group">
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                          <div className="flex flex-col">
                            <span className="text-xs text-text-gray group-hover:text-brand-blue">{f.i}</span>
                            <span className="text-xs font-semibold text-text-dark pt-1">{f.n}</span>
                          </div>
                        </label>
                      ))}
                   </div>
                 </div>

                 {/* Section: Sertifikat */}
                 <div>
                   <h3 className="text-sm font-bold text-text-dark mb-4 uppercase tracking-wider">Tipe Sertifikat</h3>
                   <div className="flex flex-wrap gap-2">
                      {['SHM', 'HGB', 'Lainnya'].map((s, i) => (
                        <button key={i} className={`px-5 py-2 rounded-full text-xs font-semibold border ${i===0 ? 'bg-brand-blue text-white-pure border-brand-blue' : 'bg-white-pure text-text-gray border-border-line'}`}>
                          {s}
                        </button>
                      ))}
                   </div>
                 </div>
              </div>

              <div className="px-8 py-5 border-t border-border-line bg-surface-gray flex items-center justify-between">
                <button onClick={() => setShowFilters(false)} className="text-sm font-bold text-brand-blue hover:underline">Hapus Semua</button>
                <button onClick={() => setShowFilters(false)} className="bg-brand-blue hover:bg-brand-blue-deep text-white-pure font-bold px-8 py-3 rounded-xl transition-all shadow-soft active:scale-95">
                  Tampilkan 145 Properti
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Background Dim Overlay when searching */}
      {isSearchFocused && (
        <div 
          onClick={() => setIsSearchFocused(false)}
          className="fixed inset-0 z-[55] bg-black-pure/10 animate-in fade-in"
        ></div>
      )}

    </div>
  );
}
