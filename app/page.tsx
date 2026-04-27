'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, Home, DollarSign, Search,
  BrainCircuit, Calculator, Map, FileCheck, Zap, TrendingUp,
  Heart, BedDouble, Bath, Scaling, ArrowUpRight, Bookmark,
  ChevronDown, Shield, CheckCircle, Building, Store, ArrowRight,
  Star, Sparkles, Crown, ChevronLeft, ChevronRight
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

      {/* ── PROPERTI UNGGULAN (FEATURED LISTING - WOW UI) ── */}
      <section className="py-24 bg-surface-gray relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container-standard relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-brand-blue/20 rounded-full mb-6">
                <Sparkles size={14} className="text-brand-blue" />
                <span className="text-brand-blue font-bold text-[10px] uppercase tracking-[0.2em]">FEATURED ADD-ON</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-text-dark leading-tight">
                Properti <span className="text-brand-blue italic">Unggulan</span> Minggu <br className="hidden md:block" /> Ini
              </h2>
            </div>
            <p className="text-text-gray text-sm md:text-base max-w-xs md:text-right">
              Listing pilihan dengan eksposur maksimal dan verifikasi premium dari tim ahli kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Featured Card (Large - Span 2 columns on large screens) */}
            {RECOMMENDATIONS.slice(2, 3).map((item) => (
              <Link
                key={`featured-large-${item.id}`}
                href={`/properti/${item.id}`}
                className="group relative h-[450px] md:h-full lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-end p-8 transition-transform duration-700 hover:scale-[1.01]"
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] group-hover:scale-110" style={{ backgroundImage: `url(${item.image})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-black-pure/40 to-transparent"></div>

                {/* Top Badge Removed */}
                <div className="absolute top-6 left-6 flex gap-3">
                  <div className="px-4 py-2 bg-white/10 backdrop-blur-md text-white-pure rounded-full text-xs font-medium border border-white/20">
                    {item.location}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-display font-medium text-white-pure mb-4 group-hover:text-brand-blue transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-6 mb-6 text-white/70 text-sm">
                    <span className="flex items-center gap-2"><BedDouble size={18} className="text-brand-blue" /> {item.specs.beds} Kamar</span>
                    <span className="flex items-center gap-2"><Bath size={18} className="text-brand-blue" /> {item.specs.baths} Kamar Mandi</span>
                    <span className="flex items-center gap-2"><Scaling size={18} className="text-brand-blue" /> {item.specs.size}m²</span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div>
                      <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Harga Penawaran</p>
                      <p className="text-2xl md:text-3xl font-bold text-white-pure">{item.price}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-brand-blue text-white-pure flex items-center justify-center shadow-lg shadow-brand-blue/40 group-hover:scale-110 transition-transform">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Featured Small Items + Promo CTA Grid */}
            <div className="lg:col-span-1 grid grid-cols-1 gap-6">
              {RECOMMENDATIONS.slice(0, 2).map((item) => (
                <Link
                  key={`featured-small-${item.id}`}
                  href={`/properti/${item.id}`}
                  className="group relative flex rounded-3xl overflow-hidden bg-white-pure border border-border-line/10 hover:border-brand-blue/30 transition-all duration-500 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(13,138,188,0.15)] h-[200px]"
                >
                  {/* Left: Image Area */}
                  <div className="relative w-[40%] overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${item.image})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black-pure/10 to-transparent"></div>
                  </div>

                  {/* Right: Content Area */}
                  <div className="w-[60%] p-6 flex flex-col justify-between relative bg-gradient-to-br from-white-pure to-surface-gray/50">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-medium text-text-gray">{item.badge}</span>
                      </div>
                      <h4 className="text-lg font-medium text-text-dark mb-1 group-hover:text-brand-blue transition-colors line-clamp-1 leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-text-gray flex items-center gap-1.5 font-medium">
                        <MapPin size={12} className="text-brand-blue" />
                        {item.location}
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xl font-bold text-text-dark tracking-tight">{item.price}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-text-gray/60 font-semibold">
                          <span className="flex items-center gap-1"><BedDouble size={12} /> {item.specs.beds}</span>
                          <span className="flex items-center gap-1"><Bath size={12} /> {item.specs.baths}</span>
                          <span className="flex items-center gap-1"><Scaling size={12} /> {item.specs.size}m²</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white-pure transition-all duration-300">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Promo Card / Add-on CTA */}
              <div className="relative rounded-2xl overflow-hidden p-6 bg-brand-blue-deep flex flex-col justify-between group cursor-pointer border border-brand-blue/20 h-[180px]">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <Crown size={80} />
                </div>

                <div>
                  <h4 className="text-white-pure font-medium mb-1">Ingin Properti Anda Di Sini?</h4>
                  <p className="text-white/60 text-[10px] leading-relaxed">
                    Tingkatkan visibilitas listing Anda 10x lipat dengan fitur Featured Listing.
                  </p>
                </div>

                <Link href="/dashboard/subscription" className="flex items-center gap-2 text-xs font-bold text-brand-blue-light group-hover:text-white-pure transition-colors">
                  PELAJARI SELENGKAPNYA
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Items - HORIZONTAL SLIDER */}
          <div className="relative mt-12 group/slider">
            <div
              id="featured-slider"
              className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {RECOMMENDATIONS.map((item) => (
                <Link
                  key={`featured-slider-${item.id}`}
                  href={`/properti/${item.id}`}
                  className="flex-none w-[320px] md:w-[380px] snap-start group/card relative pb-12"
                >
                  {/* Top Image Area */}
                  <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-110" style={{ backgroundImage: `url(${item.image})` }}></div>
                  </div>

                  {/* Floating Content Box */}
                  <div className="relative -mt-20 mx-4 bg-white-pure rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border-line/10 group-hover/card:border-brand-blue/30 transition-all duration-500 z-10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xl font-bold text-text-dark group-hover/card:text-brand-blue transition-colors line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-text-gray flex items-center gap-1 mt-1">
                          <MapPin size={14} className="text-brand-blue" />
                          {item.location}
                        </p>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center hover:bg-brand-blue hover:text-white-pure transition-colors">
                        <Bookmark size={18} />
                      </button>
                    </div>

                    <div className="mt-4 mb-5">
                      <p className="text-2xl font-bold text-text-dark tracking-tight">{item.price}</p>
                    </div>

                    <div className="pt-4 border-t border-border-line/30 flex items-center justify-between text-[11px] font-medium text-text-gray">
                      <div className="flex items-center gap-2">
                        <BedDouble size={16} className="text-brand-blue/60" />
                        <span>{item.specs.beds} Kamar Tidur</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath size={16} className="text-brand-blue/60" />
                        <span>{item.specs.baths} Kamar Mandi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scaling size={16} className="text-brand-blue/60" />
                        <span>{item.specs.size}m²</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Slider Navigation Buttons */}
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 opacity-0 group-hover/slider:opacity-100 transition-opacity z-20">
              <button
                onClick={() => document.getElementById('featured-slider')?.scrollBy({ left: -350, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full bg-white-pure shadow-premium border border-border-line/20 flex items-center justify-center text-text-dark hover:bg-brand-blue hover:text-white-pure transition-all"
              >
                <ChevronLeft size={28} />
              </button>
            </div>
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 opacity-0 group-hover/slider:opacity-100 transition-opacity z-20">
              <button
                onClick={() => document.getElementById('featured-slider')?.scrollBy({ left: 350, behavior: 'smooth' })}
                className="w-14 h-14 rounded-full bg-white-pure shadow-premium border border-border-line/20 flex items-center justify-center text-text-dark hover:bg-brand-blue hover:text-white-pure transition-all"
              >
                <ChevronRight size={28} />
              </button>
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
