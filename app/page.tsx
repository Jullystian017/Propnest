'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, Home, DollarSign, Search,
  BrainCircuit, Calculator, Map, FileCheck, Zap, TrendingUp,
  Heart, BedDouble, Bath, Scaling, ArrowUpRight, Bookmark,
  ChevronDown
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
                Bersama <span className="text-brand-blue font-medium">PropNest</span>
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

                  <button className="p-2.5 bg-blue-50/80 text-brand-blue rounded-full hover:bg-brand-blue hover:text-white-pure transition-all duration-300 shadow-sm overflow-hidden active:scale-95 group-hover:shadow-soft">
                    <Bookmark size={16} fill="currentColor" className="fill-transparent hover:fill-current" />
                  </button>
                </div>

                <div className="my-2.5 border-t border-border-line/30 w-full"></div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-text-dark">
                    {item.price.replace('Rp ', 'Rp').replace(' Juta', 'jt').replace(' Miliar', 'M')}
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


      <Footer />
    </div>
  );
}

