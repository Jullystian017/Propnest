'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, Home, DollarSign, Search,
  BrainCircuit, Calculator, Map, FileCheck, Zap, TrendingUp,
  Heart, BedDouble, Bath, Scaling, ArrowUpRight, Bookmark,
  ChevronDown, Shield, CheckCircle, Building, Store, ArrowRight
} from 'lucide-react';
import SearchBar from '@/components/home/SearchBar';

import { MOCK_PROPERTIES as RECOMMENDATIONS } from '@/lib/mock-data';


export default function HomePage() {
  return (
    <div className="bg-surface-gray min-h-screen">
      <Navbar />

      {/* ── HERO SECTION (HEARTHAVEN STYLE) ── */}
      <section className="relative h-screen flex flex-col justify-end pb-64">
        {/* Full Image Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1920')" }}
        >
          <div className="absolute inset-0 bg-black-pure/50"></div>
        </div>

        <div className="container-standard relative z-10">

          {/* Big Heading & Search */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] items-end gap-12 mb-20">
            {/* Big Heading */}
            <div className="max-w-3xl">
              <h1 className="font-display font-light text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white-pure drop-shadow-md">
                Temukan Rumah Impian <br className="hidden md:block" />
                Bersama <span className="text-brand-blue font-medium">NusaEstate</span>
              </h1>
            </div>

            {/* Subtext on the right */}
            <div className="hidden lg:block">
              <p className="text-white/60 text-sm leading-relaxed max-w-xs border-l-2 border-brand-blue pl-6">
                Temukan properti paling eksklusif di Jawa Tengah dengan analitik bertenaga AI dan data pasar real-time.
              </p>
            </div>
          </div>


          <SearchBar />
        </div>
      </section>

      {/* ── KEUNGGULAN NUSAESTATE ── */}
      <section className="py-24 bg-white-pure">
        <div className="container-standard">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-brand-blue text-xs font-medium tracking-widest uppercase mb-3">Mengapa NusaEstate</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-text-dark">Standar Baru dalam Pencarian Properti</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-surface-gray border border-border-line/40 hover:border-brand-blue/30 transition-colors group">
              <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-medium text-text-dark mb-3">AI Property Matcher</h3>
              <p className="text-text-gray text-sm leading-relaxed">Algoritma AI kami menganalisis preferensi Anda untuk menemukan properti yang paling cocok, menghemat waktu pencarian hingga 70%.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-surface-gray border border-border-line/40 hover:border-brand-blue/30 transition-colors group">
              <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-medium text-text-dark mb-3">Transaksi Aman</h3>
              <p className="text-text-gray text-sm leading-relaxed">Bekerjasama dengan notaris dan bank terpercaya untuk memastikan setiap transaksi berjalan aman, transparan, dan legal.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-surface-gray border border-border-line/40 hover:border-brand-blue/30 transition-colors group">
              <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-medium text-text-dark mb-3">Listing Terverifikasi</h3>
              <p className="text-text-gray text-sm leading-relaxed">Semua properti melewati proses verifikasi ketat. Apa yang Anda lihat di foto adalah apa yang Anda dapatkan di lokasi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── KATEGORI PROPERTI ── */}
      <section className="py-24 container-standard">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-brand-blue text-xs font-medium tracking-widest uppercase mb-2">Eksplorasi</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-text-dark">Kategori Properti</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <Link href="/cari" className="group relative overflow-hidden rounded-2xl aspect-square">
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
              <div>
                <Home className="text-white-pure/80 mb-2" size={24} />
                <h3 className="text-white-pure font-medium text-lg">Rumah Tapak</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white-pure group-hover:bg-brand-blue transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
          
          <Link href="/cari" className="group relative overflow-hidden rounded-2xl aspect-square">
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
              <div>
                <Building className="text-white-pure/80 mb-2" size={24} />
                <h3 className="text-white-pure font-medium text-lg">Apartemen</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white-pure group-hover:bg-brand-blue transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
          
          <Link href="/cari" className="group relative overflow-hidden rounded-2xl aspect-square">
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?auto=format&fit=crop&q=80&w=800')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
              <div>
                <Store className="text-white-pure/80 mb-2" size={24} />
                <h3 className="text-white-pure font-medium text-lg">Ruko / Komersial</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white-pure group-hover:bg-brand-blue transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
          
          <Link href="/cari" className="group relative overflow-hidden rounded-2xl aspect-square">
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black-pure/80 via-black-pure/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
              <div>
                <Map className="text-white-pure/80 mb-2" size={24} />
                <h3 className="text-white-pure font-medium text-lg">Tanah</h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white-pure group-hover:bg-brand-blue transition-colors">
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── REKOMENDASI PROPERTI ── */}
      <section className="py-24 container-standard border-t border-border-line/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-brand-blue text-xs font-medium tracking-widest uppercase mb-2">Rekomendasi</p>
            <h2 className="text-4xl font-display font-medium text-text-dark">Properti Pilihan</h2>
          </div>
          <Link href="/cari" className="group flex items-center gap-2 text-sm font-medium text-brand-blue">
            Lihat Semua Properti
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {RECOMMENDATIONS.map((item) => (
            <Link
              key={item.id}
              href={`/properti/${item.id}`}
              className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft group-hover:shadow-md transition-all duration-700">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[3s]" style={{ backgroundImage: `url(${item.image})` }}></div>

                {/* Premium White Badge */}
                <div className="absolute top-4 left-4 backdrop-blur-md bg-white-pure/90 px-3 py-1.5 rounded-full shadow-premium border border-white/20 text-[10px] font-semibold flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.badge === 'Baru' ? 'bg-brand-blue' : 'bg-brand-blue-light'}`}></span>
                  <span className={item.badge === 'Baru' ? 'text-brand-blue' : 'text-brand-blue-deep'}>
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Floating Content Box */}
              <div className="relative -mt-14 mx-3 bg-white-pure rounded-xl p-4 shadow-premium border border-border-line/20 group-hover:border-brand-blue/30 transition-all duration-500 z-10">
                <div className="flex justify-between items-start mb-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium text-text-dark group-hover:text-brand-blue transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="flex items-center gap-1.5 text-[11px] text-text-gray font-medium mt-0.5">
                      <MapPin size={12} className="text-brand-blue" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  <button suppressHydrationWarning className="p-2.5 bg-blue-50/80 text-brand-blue rounded-full hover:bg-brand-blue hover:text-white-pure transition-all duration-300 shadow-sm overflow-hidden active:scale-95 group-hover:shadow-soft">
                    <Bookmark size={16} fill="currentColor" className="fill-transparent hover:fill-current" />
                  </button>
                </div>

                <div className="my-2.5 border-t border-border-line/30 w-full"></div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-text-dark">
                    {item.price.replace('Rp ', 'Rp ').replace(' Juta', ' Juta').replace(' Miliar', ' M')}
                  </p>
                </div>

                {/* Quick Specs (Compact) */}
                <div className="mt-3 pt-3 border-t border-border-line/30 flex items-center gap-4 text-[10px] font-medium text-text-gray/80">
                  <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-brand-blue/60" /> {item.specs.beds} Kamar Tidur</span>
                  <span className="flex items-center gap-1.5"><Bath size={14} className="text-brand-blue/60" /> {item.specs.baths} Kamar Mandi</span>
                  <span className="flex items-center gap-1.5"><Scaling size={14} className="text-brand-blue/60" /> {item.specs.size}m²</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CARA KERJA ── */}
      <section className="py-24 bg-white-pure border-t border-border-line/40">
        <div className="container-standard">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-brand-blue text-xs font-medium tracking-widest uppercase mb-3">Proses Mudah</p>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-text-dark">Cara Kerja NusaEstate</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border-line/60 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-surface-gray border-4 border-white-pure shadow-soft flex items-center justify-center text-brand-blue mb-6 relative">
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-brand-blue text-white-pure rounded-full flex items-center justify-center font-bold text-sm shadow-md">1</span>
                <Search size={32} />
              </div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Cari Properti</h3>
              <p className="text-text-gray text-sm">Gunakan AI atau filter pintar kami untuk menemukan properti yang sesuai dengan kebutuhan dan budget Anda.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-24 h-24 rounded-full bg-surface-gray border-4 border-white-pure shadow-soft flex items-center justify-center text-brand-blue mb-6 relative">
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-brand-blue text-white-pure rounded-full flex items-center justify-center font-bold text-sm shadow-md">2</span>
                <MapPin size={32} />
              </div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Kunjungi Lokasi</h3>
              <p className="text-text-gray text-sm">Jadwalkan kunjungan properti secara online. Agen kami akan menemani Anda melihat langsung properti idaman.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-24 h-24 rounded-full bg-surface-gray border-4 border-white-pure shadow-soft flex items-center justify-center text-brand-blue mb-6 relative">
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-brand-blue text-white-pure rounded-full flex items-center justify-center font-bold text-sm shadow-md">3</span>
                <FileCheck size={32} />
              </div>
              <h3 className="text-lg font-medium text-text-dark mb-2">Transaksi Aman</h3>
              <p className="text-text-gray text-sm">Selesaikan pembayaran atau KPR dengan panduan tim legal dan finansial kami yang berpengalaman.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-white-pure/10 rounded-full blur-[100px]"></div>
        
        <div className="container-standard relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white-pure mb-6 max-w-2xl mx-auto leading-tight">
            Siap Menemukan Rumah Impian Anda Hari Ini?
          </h2>
          <p className="text-white-pure/80 text-base md:text-lg mb-10 max-w-xl mx-auto">
            Bergabunglah dengan ribuan keluarga lain yang telah menemukan hunian terbaik mereka melalui NusaEstate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/cari" className="px-8 py-4 bg-white-pure text-brand-blue font-medium rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto shadow-premium">
              Mulai Pencarian
            </Link>
            <Link href="/tentang" className="px-8 py-4 bg-transparent border border-white-pure/30 text-white-pure font-medium rounded-lg hover:bg-white-pure/10 transition-colors w-full sm:w-auto">
              Konsultasi Gratis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
