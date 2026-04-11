'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import { 
  Heart, Search, Filter, BedDouble, Bath, Scaling, 
  Map as MapIcon, ChevronDown, List, X, House, Wifi, Car 
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
  },
  {
    id: '2',
    name: 'Cluster Premium Colomadu',
    location: 'Colomadu, Solo',
    price: 'Rp 875 Juta',
    specs: { beds: 3, baths: 2, size: 120 },
    badge: 'Populer',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '3',
    name: 'Vila Tropis Ungaran',
    location: 'Ungaran, Semarang',
    price: 'Rp 2,1 Miliar',
    specs: { beds: 5, baths: 4, size: 350 },
    badge: 'Eksklusif',
    image: 'https://images.unsplash.com/photo-1600607687931-cebf10c2c31e?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '4',
    name: 'Griya Asri Premiere',
    location: 'Purwokerto Utara',
    price: 'Rp 350 Juta',
    specs: { beds: 3, baths: 2, size: 90 },
    badge: 'Promo',
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '5',
    name: 'Cilacap Bay View',
    location: 'Cilacap Tengah',
    price: 'Rp 420 Juta',
    specs: { beds: 2, baths: 1, size: 70 },
    badge: 'Baru',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '6',
    name: 'Taman Sari Solo Baru',
    location: 'Solo Baru, Sukoharjo',
    price: 'Rp 1,1 Miliar',
    specs: { beds: 3, baths: 2, size: 140 },
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=600&h=400',
  },
];

export default function CariPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'list'>('split');

  return (
    <div className="bg-white-pure min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* ────── HEADER SEARCH BAR (STICKY) ────── */}
      <div className="sticky top-0 z-40 bg-white-pure border-b border-border-line/50">
        <div className="container-standard py-3 flex flex-wrap items-center gap-3">
          
          {/* Main Search Input */}
          <div className="flex-1 min-w-[200px] relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={18} />
            <input 
              type="text" 
              placeholder="Cari lokasi, perumahan..." 
              className="w-full pl-10 pr-4 py-2.5 bg-surface-gray border-none rounded-full text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            />
          </div>

          {/* Quick Filters - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border-line rounded-full text-sm font-medium hover:bg-surface-gray transition-colors">
              Harga <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border-line rounded-full text-sm font-medium hover:bg-surface-gray transition-colors">
              Tipe <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border-line rounded-full text-sm font-medium hover:bg-surface-gray transition-colors">
              Kamar <ChevronDown size={14} />
            </button>
          </div>

          <div className="h-6 w-px bg-border-line/60 hidden lg:block"></div>

          {/* More Filters Toggle */}
          <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-border-line rounded-full text-sm font-semibold hover:border-brand-blue transition-colors group"
          >
            <Filter size={16} className="group-hover:text-brand-blue" /> 
            <span className="hidden sm:inline">Filter</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-surface-gray p-1 rounded-full border border-border-line/50">
            <button 
               onClick={() => setViewMode('split')}
               className={`p-1.5 rounded-full transition-all ${viewMode === 'split' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray'}`}
            >
              <MapIcon size={18} />
            </button>
            <button 
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white-pure shadow-sm text-brand-blue' : 'text-text-gray'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ────── MAIN SPLIT CONTENT ────── */}
      <div className="flex-1 flex min-h-0">
        
        {/* LEFT: LISTING AREA */}
        <div className={`flex-1 overflow-y-auto ${viewMode === 'split' ? 'lg:w-[60%] xl:w-[55%]' : 'w-full'}`}>
          <div className="p-4 md:p-6 lg:p-10 max-w-[1200px] mx-auto">
            
            {/* Results Info */}
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-xl font-semibold text-text-dark">Properti di Jawa Tengah</h1>
                  <p className="text-sm text-text-gray">Menampilkan 1-6 dari 145 hasil</p>
               </div>
               <div className="flex items-center gap-2 text-sm text-text-gray font-medium">
                  Urutkan: <span className="text-text-dark cursor-pointer flex items-center gap-1 hover:text-brand-blue transition-colors">Terbaru <ChevronDown size={14}/></span>
               </div>
            </div>

            {/* PRODUCT GRID - 3 Columns on Large screens */}
            <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
              {MOCK_PROPERTIES.map((item) => (
                <Link key={item.id} href={`/properti/${item.id}`} className="flex flex-col group cursor-pointer">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-dim mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                     <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${item.image})` }}></div>
                     
                     <div className="absolute top-3 left-3 bg-white-pure/95 backdrop-blur-sm text-[10px] font-bold text-text-dark px-2.5 py-1 rounded-md shadow-sm border border-white/20">
                       {item.badge}
                     </div>
                     <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white-pure/90 flex items-center justify-center text-text-gray hover:text-red-500 transition-colors shadow-sm focus:outline-none">
                       <Heart size={16} />
                     </button>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-text-dark group-hover:text-brand-blue transition-colors truncate pr-2">{item.name}</h3>
                      <span className="text-xs font-medium text-brand-orange whitespace-nowrap">{item.price}</span>
                    </div>
                    <p className="text-xs text-text-gray flex items-center gap-1">
                      <MapIcon size={12} className="shrink-0" /> {item.location}
                    </p>
                    <div className="pt-2 flex items-center gap-3 text-[11px] font-medium text-text-gray">
                       <span className="flex items-center gap-1"><BedDouble size={14} className="text-brand-blue/70" /> {item.specs.beds}</span>
                       <span className="flex items-center gap-1"><Bath size={14} className="text-brand-blue/70" /> {item.specs.baths}</span>
                       <span className="flex items-center gap-1"><Scaling size={14} className="text-brand-blue/70" /> {item.specs.size}m²</span>
                    </div>
                  </div>
                </Link>
              ))}
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
          <div className="hidden lg:block lg:w-[40%] xl:w-[45%] h-[calc(100vh-64px)] sticky top-[64px] border-l border-border-line/40 bg-surface-dim">
            <div className="relative w-full h-full">
               {/* Map Background/Iframe Mockup */}
               <div className="absolute inset-0 bg-[#e5e3df] overflow-hidden">
                  {/* Decorative Elements for Map look */}
                  <div className="absolute top-1/4 left-1/3 w-full h-1 bg-white-pure/50 rotate-12"></div>
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-white-pure/50 -rotate-6"></div>
                  <div className="absolute top-0 left-1/2 w-1 h-full bg-white-pure/50 rotate-3"></div>
                  
                  {/* Markers Mockup */}
                  {[
                    {t: '40%', l: '30%', p: '1.25M'},
                    {t: '55%', l: '60%', p: '875Jt'},
                    {t: '30%', l: '70%', p: '2.1M'},
                    {t: '70%', l: '40%', p: '350Jt'},
                    {t: '65%', l: '15%', p: '420Jt'},
                  ].map((m, i) => (
                    <div key={i} className="absolute transition-all hover:scale-110 cursor-pointer shadow-md" style={{ top: m.t, left: m.l }}>
                       <div className="bg-white-pure px-2 py-1 rounded-full text-[10px] font-bold text-text-dark border-2 border-brand-blue">
                         {m.p}
                       </div>
                    </div>
                  ))}
               </div>
               
               {/* Map Controls */}
               <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="flex flex-col bg-white-pure rounded-lg shadow-md border border-border-line overflow-hidden">
                    <button className="p-2 hover:bg-surface-gray border-b border-border-line text-lg font-bold">+</button>
                    <button className="p-2 hover:bg-surface-gray text-lg font-bold">−</button>
                  </div>
               </div>

               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white-pure/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 text-xs font-semibold text-brand-blue flex items-center gap-2">
                 <MapIcon size={14} /> Sinkronisasi dengan daftar
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
                <button onClick={() => setShowFilters(false)} className="bg-brand-orange hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-soft">
                  Tampilkan 145 Properti
                </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
