'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import MapContainer from '@/components/maps/MapContainer';
import Footer from '@/components/ui/Footer';
import {
  Heart, Search, Filter, BedDouble, Bath, Scaling,
  Map as MapIcon, MapPin, ChevronDown, LayoutGrid, X, House, Wifi, Car,
  Bookmark, Star, ChevronLeft, ChevronRight, Navigation, Loader2, Building2
} from 'lucide-react';
import { usePublicProperties } from '@/hooks/useProperties';

function CariContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list'>('list');
  const [activePopover, setActivePopover] = useState<'harga' | 'tipe' | 'kamar' | 'sort' | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Terbaru');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Sync with query params & load recent searches
  useEffect(() => {
    const q = searchParams.get('lokasi');
    if (q) setSearchQuery(q);

    const saved = localStorage.getItem('nusaestate_recent_searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, [searchParams]);

  const saveSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem('nusaestate_recent_searches', JSON.stringify(updated));
  };

  // Live data from Supabase via TanStack Query
  const { data: liveProperties = [], isLoading: propertiesLoading } = usePublicProperties({
    search: searchQuery,
  });

  const togglePopover = (type: 'harga' | 'tipe' | 'kamar' | 'sort') => {
    setActivePopover(activePopover === type ? null : type);
  };

  const closePopovers = () => setActivePopover(null);

  return (
    <div className="bg-white-pure min-h-screen flex flex-col font-sans pt-[100px]" suppressHydrationWarning>
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
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Cari lokasi, perumahan, atau area..."
                className={`w-full pl-14 pr-12 py-2.5 bg-white border border-border-line/60 rounded-full text-sm font-medium text-text-dark placeholder:text-text-gray focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all duration-300`}
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
                <div className="p-5 max-h-[450px] overflow-y-auto">

                  {/* Category: Current Location */}
                  <div className="mb-5">
                    <button
                      onClick={() => { setSearchQuery('Lokasi Saat Ini'); setIsSearchFocused(false); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-surface-gray rounded-2xl transition-all group text-left border border-transparent hover:border-border-line/40 bg-blue-50/30"
                    >
                      <div className="p-2 bg-brand-blue text-white-pure rounded-xl shadow-md shadow-brand-blue/20">
                        <Navigation size={14} />
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-brand-blue">Lokasi Saat Ini</span>
                        <span className="block text-[10px] text-text-gray/70 italic">Gunakan koordinat GPS Anda</span>
                      </div>
                    </button>
                  </div>

                  {/* Category: Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-[9px] font-medium text-text-gray uppercase tracking-[0.1em] mb-2.5 px-2">Pencarian Terakhir</h4>
                      <div className="space-y-0.5">
                        {recentSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => { setSearchQuery(search); setIsSearchFocused(false); }}
                            className="w-full flex items-center gap-3 p-2.5 hover:bg-surface-gray rounded-xl transition-all group text-left"
                          >
                            <div className="p-1.5 text-text-gray/40 group-hover:text-brand-blue transition-colors">
                              <Search size={14} />
                            </div>
                            <span className="text-sm font-medium text-text-dark group-hover:text-brand-blue transition-colors">{search}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Locations */}
                  <div className="mb-5">
                    <h4 className="text-[9px] font-medium text-text-gray uppercase tracking-[0.1em] mb-2.5 px-2">Lokasi Populer</h4>
                    <div className="space-y-0.5">
                      {['Semarang Tengah', 'Solo Baru', 'Ungaran Barat', 'BSB City'].map((loc) => (
                        <button
                          key={loc}
                          onClick={() => { setSearchQuery(loc); setIsSearchFocused(false); saveSearch(loc); }}
                          className="w-full flex items-center gap-3 p-2.5 hover:bg-surface-gray rounded-xl transition-all group text-left"
                        >
                          <div className="p-1.5 bg-blue-50 text-brand-blue rounded-lg group-hover:bg-brand-blue group-hover:text-white-pure transition-colors">
                            <MapIcon size={12} />
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-text-dark">{loc}</span>
                            <span className="block text-[9px] text-text-gray">Jawa Tengah</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category: Projects */}
                  <div>
                    <h4 className="text-[9px] font-medium text-text-gray uppercase tracking-[0.1em] mb-2.5 px-2">Proyek Terbaru</h4>
                    <div className="space-y-1">
                      {['Griya Asri Premiere', 'Cilacap Bay View'].map((proj) => (
                        <button
                          key={proj}
                          onClick={() => { setSearchQuery(proj); setIsSearchFocused(false); saveSearch(proj); }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-surface-gray rounded-2xl transition-all group text-left border border-transparent hover:border-border-line/40"
                        >
                          <div className="p-2 bg-blue-50 text-brand-blue rounded-xl group-hover:bg-brand-blue group-hover:text-white-pure transition-colors">
                            <House size={14} />
                          </div>
                          <span className="text-sm font-medium text-text-dark">{proj}</span>
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
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${activePopover === 'harga' ? 'bg-brand-blue text-white-pure shadow-md ring-2 ring-brand-blue/20' : 'bg-white border border-border-line/60 text-text-dark hover:bg-surface-dim'}`}
              >
                <span>Harga</span> <ChevronDown size={14} className={activePopover === 'harga' ? 'text-white-pure' : 'text-text-gray'} />
              </button>

              {activePopover === 'harga' && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-white-pure rounded-[2rem] shadow-premium border border-border-line/50 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-medium text-text-gray mb-4 uppercase tracking-widest">Rentang Harga</h4>
                  <div className="space-y-1">
                    {['< 500 Juta', '500jt - 1M', '1M - 2M', '> 2 Miliar'].map((p) => (
                      <label key={p} className="flex items-center gap-3 p-2.5 hover:bg-surface-gray rounded-xl cursor-pointer transition-colors group">
                        <input type="radio" name="harga" className="w-4 h-4 text-brand-blue border-gray-300 focus:ring-brand-blue" />
                        <span className="text-sm font-medium text-text-gray group-hover:text-text-dark">{p}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={closePopovers} className="w-full mt-4 py-2.5 bg-brand-blue text-white-pure text-xs font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-soft">Terapkan</button>
                </div>
              )}
            </div>

            {/* Tipe Filter */}
            <div className="relative">
              <button
                onClick={() => togglePopover('tipe')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${activePopover === 'tipe' ? 'bg-brand-blue text-white-pure shadow-md ring-2 ring-brand-blue/20' : 'bg-white border border-border-line/60 text-text-dark hover:bg-surface-dim'}`}
              >
                <span>Tipe</span> <ChevronDown size={14} className={activePopover === 'tipe' ? 'text-white-pure' : 'text-text-gray'} />
              </button>

              {activePopover === 'tipe' && (
                <div className="absolute top-full left-0 mt-3 w-60 bg-white-pure rounded-[2rem] shadow-premium border border-border-line/50 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-semibold text-text-gray mb-4 uppercase tracking-widest">Tipe Properti</h4>
                  <div className="space-y-1">
                    {['Rumah', 'Apartemen', 'Ruko', 'Vila'].map((t) => (
                      <label key={t} className="flex items-center gap-3 p-2.5 hover:bg-surface-gray rounded-xl cursor-pointer transition-colors group">
                        <input type="checkbox" className="w-4 h-4 rounded text-brand-blue border-gray-300 focus:ring-brand-blue" />
                        <span className="text-sm font-medium text-text-gray group-hover:text-text-dark">{t}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={closePopovers} className="w-full mt-4 py-2.5 bg-brand-blue text-white-pure text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-soft">Terapkan</button>
                </div>
              )}
            </div>

            {/* Kamar Filter */}
            <div className="relative">
              <button
                onClick={() => togglePopover('kamar')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-300 ${activePopover === 'kamar' ? 'bg-brand-blue text-white-pure shadow-md ring-2 ring-brand-blue/20' : 'bg-white border border-border-line/60 text-text-dark hover:bg-surface-dim'}`}
              >
                <span>Kamar</span> <ChevronDown size={14} className={activePopover === 'kamar' ? 'text-white-pure' : 'text-text-gray'} />
              </button>

              {activePopover === 'kamar' && (
                <div className="absolute top-full right-0 lg:left-0 mt-3 w-60 bg-white-pure rounded-[2rem] shadow-premium border border-border-line/50 p-5 z-50 animate-in fade-in slide-in-from-top-2">
                  <h4 className="text-[10px] font-semibold text-text-gray mb-4 uppercase tracking-widest">Kamar Tidur</h4>
                  <div className="flex items-center justify-between gap-1 p-1 bg-surface-gray rounded-xl mb-4">
                    {['Semua', '1+', '2+', '3+', '4+'].map((k) => (
                      <button key={k} className={`flex-1 py-2 text-[11px] font-semibold rounded-lg transition-all ${k === 'Semua' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray hover:text-text-dark'}`}>
                        {k}
                      </button>
                    ))}
                  </div>
                  <button onClick={closePopovers} className="w-full py-2.5 bg-brand-blue text-white-pure text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-soft">Terapkan</button>
                </div>
              )}
            </div>

          </div>

          <div className="h-6 w-px bg-border-line/40 hidden lg:block mx-1"></div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-5 py-1.5 bg-white border border-border-line/60 rounded-full text-[13px] font-semibold text-text-dark hover:bg-surface-dim transition-all active:scale-95 group"
          >
            <Filter size={15} className="text-text-gray/70 group-hover:text-brand-blue transition-colors" />
            <span className="hidden sm:inline">Filter Lengkap</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-white border border-border-line/60 p-1 rounded-full">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${viewMode === 'list' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray/60 hover:text-text-dark'}`}
            >
              <LayoutGrid size={14} /> <span className="hidden xl:inline">Kotak</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${viewMode === 'split' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray/60 hover:text-text-dark'}`}
            >
              <MapIcon size={14} /> <span className="hidden xl:inline">Peta</span>
            </button>
          </div>
        </div>
      </div>

      {/* ────── MAIN SPLIT CONTENT ────── */}
      <div className="flex flex-col lg:flex-row container-standard gap-x-12 mb-20">

        {/* LEFT: LISTING AREA */}
        <div className={`lg:pr-8 ${viewMode === 'split' ? 'lg:w-[50%] xl:w-[55%]' : 'w-full'}`}>
          <div className="py-8 px-0 max-w-full">


            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-xl font-semibold text-text-dark">
                  {searchQuery ? `Hasil untuk "${searchQuery}"` : 'Properti di Jawa Tengah'}
                </h1>
                <p className="text-sm text-text-gray">
                  {propertiesLoading ? 'Memuat...' : `Menampilkan ${liveProperties.length} hasil`}
                </p>
              </div>
              <div className="relative">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-gray">
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
                        className={`w-full text-left px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${sortBy === item ? 'bg-blue-50 text-brand-blue' : 'text-text-gray hover:bg-surface-gray hover:text-text-dark'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT GRID */}
            {propertiesLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-gray/40">
                <Loader2 size={36} className="animate-spin mb-4 text-brand-blue/40" />
                <p className="text-sm font-medium">Memuat properti...</p>
              </div>
            ) : liveProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-brand-blue/5 rounded-3xl flex items-center justify-center mb-5">
                  <Building2 size={32} className="text-brand-blue/30" />
                </div>
                <h3 className="text-lg font-display font-medium text-text-dark mb-2">Belum ada properti</h3>
                <p className="text-sm text-text-gray/50 max-w-xs">
                  {searchQuery ? `Tidak ditemukan properti untuk "${searchQuery}".` : 'Belum ada listing aktif saat ini. Coba lagi nanti.'}
                </p>
              </div>
            ) : (
            <div className={`grid gap-x-8 gap-y-12 ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {liveProperties.map((item) => {
                const formatPrice = (p: number) => {
                  if (p >= 1000000000) return `Rp ${(p / 1000000000).toFixed(1).replace('.0', '')} M`;
                  if (p >= 1000000) return `Rp ${(p / 1000000).toFixed(1).replace('.0', '')} Juta`;
                  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p).replace('Rp', 'Rp ');
                };
                const imageUrl = item.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

                if (viewMode === 'split') {
                  return (
                    <Link
                      key={item.id}
                      href={`/properti/${item.id}`}
                      className="group flex gap-5 items-start border-b border-border-line/40 pb-6 last:border-0 hover:bg-surface-gray/30 -mx-4 px-4 rounded-xl transition-all duration-300"
                    >
                      <div className="relative w-[180px] sm:w-[240px] aspect-[4/3] shrink-0 rounded-xl overflow-hidden shadow-sm">
                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000" style={{ backgroundImage: `url(${imageUrl})` }} />
                        <div className="absolute top-3 left-3 backdrop-blur-md bg-white-pure/90 px-2.5 py-1 rounded-full shadow-premium border border-white/20 text-[9px] font-semibold flex items-center gap-1.5 z-20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-600">{item.type}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <h3 className="text-[15px] font-semibold text-text-dark group-hover:text-brand-blue transition-colors pr-2 leading-snug">{item.title}</h3>
                          <span className="text-sm font-extrabold text-text-dark whitespace-nowrap pt-0.5">{formatPrice(item.price)}</span>
                        </div>
                        <p className="text-xs text-text-gray flex items-center gap-1 mt-1.5">
                          <MapIcon size={12} className="shrink-0" /> {item.location}
                        </p>
                        <div className="mt-3.5 flex items-center gap-4 text-[11px] font-medium text-text-gray">
                          <span className="flex items-center gap-1"><BedDouble size={15} className="text-brand-blue/70" /> {item.bedrooms} K. Tidur</span>
                          <span className="flex items-center gap-1"><Bath size={15} className="text-brand-blue/70" /> {item.bathrooms} K. Mandi</span>
                          <span className="flex items-center gap-1"><Scaling size={15} className="text-brand-blue/70" /> {item.land_area}m²</span>
                        </div>
                        {item.description && (
                          <p className="hidden sm:block text-[11px] text-text-gray leading-relaxed pt-2 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={`/properti/${item.id}`}
                    className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft group-hover:shadow-md transition-all duration-700">
                      <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[3s]" style={{ backgroundImage: `url(${imageUrl})` }} />
                      <div className="absolute top-4 left-4 backdrop-blur-md bg-white-pure/90 px-3 py-1.5 rounded-full shadow-premium border border-white/20 text-[10px] font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500" />
                        <span className="text-emerald-600">{item.type}</span>
                      </div>
                      <div className="absolute top-4 right-4 backdrop-blur-md bg-white-pure/90 px-2.5 py-1 rounded-full text-[9px] font-semibold text-brand-blue uppercase tracking-widest">
                        {item.price_type}
                      </div>
                    </div>
                    <div className="relative -mt-14 mx-3 bg-white-pure rounded-xl p-4 shadow-premium border border-border-line/20 group-hover:border-brand-blue/30 transition-all duration-500 z-10">
                      <div className="flex justify-between items-start mb-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-medium text-text-dark group-hover:text-brand-blue transition-colors truncate">{item.title}</h3>
                          <p className="flex items-center gap-1.5 text-[11px] text-text-gray font-medium mt-0.5">
                            <MapIcon size={12} className="text-brand-blue" />
                            <span className="truncate">{item.location}</span>
                          </p>
                        </div>
                        <button className="p-2.5 bg-blue-50/80 text-brand-blue rounded-full hover:bg-brand-blue hover:text-white-pure transition-all duration-300 shadow-sm active:scale-95">
                          <Bookmark size={16} className="fill-transparent" />
                        </button>
                      </div>

                      <div className="my-2.5 border-t border-border-line/30 w-full"></div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-text-dark">
                          {formatPrice(item.price)}
                        </p>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand-blue/60 bg-brand-blue/5 px-2 py-1 rounded-full">{item.price_type}</span>
                      </div>

                      {/* Quick Specs */}
                      <div className="mt-3 pt-3 border-t border-border-line/30 flex items-center gap-4 text-[10px] font-medium text-text-gray/80">
                        <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-brand-blue/60" /> {item.bedrooms} K. Tidur</span>
                        <span className="flex items-center gap-1.5"><Bath size={14} className="text-brand-blue/60" /> {item.bathrooms} K. Mandi</span>
                        <span className="flex items-center gap-1.5"><Scaling size={14} className="text-brand-blue/60" /> {item.land_area}m²</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            )}

            {/* Pagination */}
            <div className="mt-16 pt-8 border-t border-border-line/40 flex items-center justify-center gap-2">
              <button className="p-2.5 rounded-full border border-border-line/60 hover:border-brand-blue hover:text-brand-blue transition-all disabled:opacity-30 disabled:hover:border-border-line/60 disabled:hover:text-text-gray" disabled>
                <ChevronLeft size={18} />
              </button>
              {[1, 2, 3, '...', 12].map((page, i) => (
                <button
                  key={i}
                  className={`min-w-[42px] h-[42px] flex items-center justify-center rounded-full text-sm font-medium transition-all ${page === 1 ? 'bg-brand-blue text-white-pure shadow-soft' : 'text-text-dark hover:bg-surface-gray'}`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2.5 rounded-full border border-border-line/60 hover:border-brand-blue hover:text-brand-blue transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: MAP AREA (STICKY) */}
        {viewMode === 'split' && (
          <div className="hidden lg:block lg:w-[50%] xl:w-[45%] h-[calc(100vh-80px)] sticky top-[80px] p-4 lg:pr-0 self-start">
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-border-line/50 shadow-premium bg-surface-dim">
              <MapContainer properties={liveProperties.map(p => ({
                ...p,
                name: p.title,
                image: p.images?.[0],
                coords: p.lat && p.lng
                  ? { lat: p.lat, lng: p.lng }
                  : { lat: -7.025 + (Math.random() - 0.5) * 0.1, lng: 110.320 + (Math.random() - 0.5) * 0.1 },
                price: p.price >= 1000000000 
                  ? `Rp ${(p.price / 1000000000).toFixed(1).replace('.0', '')} M` 
                  : p.price >= 1000000 
                    ? `Rp ${(p.price / 1000000).toFixed(1).replace('.0', '')} Juta` 
                    : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price).replace('Rp', 'Rp '),
              }))} />

              {/* Map Info Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-white-pure/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 text-xs font-medium text-brand-blue flex items-center gap-2 pointer-events-none">
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
                <Filter size={20} className="text-brand-blue" /> Filter Lengkap
              </h2>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-surface-gray rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              {/* Section: Fasilitas */}
              <div>
                <h3 className="text-sm font-medium text-text-dark mb-4 uppercase tracking-wider">Fasilitas Properti</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { n: 'WiFi', i: <Wifi size={18} /> },
                    { n: 'Parkir Luas', i: <Car size={18} /> },
                    { n: 'Keamanan 24J', i: <House size={18} /> },
                    { n: 'Kolam Renang', i: <Scaling size={18} /> },
                    { n: 'Taman Bermain', i: <House size={18} /> },
                    { n: 'Gym Area', i: <Scaling size={18} /> },
                  ].map((f, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 border border-border-line rounded-xl cursor-pointer hover:border-brand-blue transition-all group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                      <div className="flex flex-col">
                        <span className="text-xs text-text-gray group-hover:text-brand-blue">{f.i}</span>
                        <span className="text-xs font-medium text-text-dark pt-1">{f.n}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section: Sertifikat */}
              <div>
                <h3 className="text-sm font-medium text-text-dark mb-4 uppercase tracking-wider">Tipe Sertifikat</h3>
                <div className="flex flex-wrap gap-2">
                  {['SHM', 'HGB', 'Lainnya'].map((s, i) => (
                    <button key={i} className={`px-5 py-2 rounded-full text-xs font-medium border ${i === 0 ? 'bg-brand-blue text-white-pure border-brand-blue' : 'bg-white-pure text-text-gray border-border-line'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-border-line bg-surface-gray flex items-center justify-between">
              <button onClick={() => setShowFilters(false)} className="text-sm font-medium text-brand-blue hover:underline">Hapus Semua</button>
              <button onClick={() => setShowFilters(false)} className="bg-brand-blue hover:bg-brand-blue-deep text-white-pure font-medium px-8 py-3 rounded-xl transition-all shadow-soft active:scale-95">
                Tampilkan 145 Properti
              </button>
            </div>
          </div>
        </div>
      )}


      <Footer />
    </div>
  );
}

export default function CariPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white-pure flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>}>
      <CariContent />
    </Suspense>
  );
}
