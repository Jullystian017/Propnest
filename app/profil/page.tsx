'use client';

import React from 'react';
import { Bookmark, Search, MapPin, BedDouble, Bath, Scaling } from 'lucide-react';
import Link from 'next/link';

// Mock data for Bookmarks
const MOCK_BOOKMARKS = [
  {
    id: 1,
    name: "Modern Minimalist Home",
    location: "Kebayoran Baru, Jakarta",
    price: "Rp 3.5 Miliar",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    specs: { beds: 3, baths: 2, size: 150 }
  },
  {
    id: 2,
    name: "Luxury Smart Villa",
    location: "Pondok Indah, Jakarta",
    price: "Rp 8.2 Miliar",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    specs: { beds: 5, baths: 4, size: 320 }
  }
];

export default function ProfilOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-dark mb-2">Properti Disimpan</h2>
        <p className="text-sm text-text-gray font-medium">Lanjutkan pencarian dari properti terakhir yang Anda minati.</p>
      </div>

      {MOCK_BOOKMARKS.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_BOOKMARKS.map((item) => (
            <Link
              key={item.id}
              href={`/properti/${item.id}`}
              className="group flex flex-col bg-white-pure rounded-3xl shadow-sm border border-border-line/20 hover:border-brand-blue/30 hover:shadow-premium transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-brand-blue hover:scale-110 transition-transform shadow-sm">
                  <Bookmark size={18} fill="currentColor" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-dark group-hover:text-brand-blue transition-colors text-lg truncate">{item.name}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-text-gray font-medium mt-1">
                      <MapPin size={14} className="text-brand-blue/70 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-text-dark mt-4 mb-3">{item.price}</p>
                <div className="pt-4 border-t border-border-line/20 flex justify-between text-xs font-medium text-text-gray/70">
                  <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-brand-blue/50" /> {item.specs.beds} Kmr</span>
                  <span className="flex items-center gap-1.5"><Bath size={14} className="text-brand-blue/50" /> {item.specs.baths} Mandi</span>
                  <span className="flex items-center gap-1.5"><Scaling size={14} className="text-brand-blue/50" /> {item.specs.size} m²</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white-pure rounded-3xl p-12 border border-dashed border-border-line flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-gray rounded-full flex items-center justify-center text-text-gray/40 mb-4">
            <Bookmark size={24} />
          </div>
          <h3 className="font-semibold text-text-dark text-lg mb-2">Belum ada properti disimpan</h3>
          <p className="text-sm text-text-gray max-w-sm mb-6">Mulai eksplorasi dan simpan properti idaman Anda untuk membandingkannya nanti.</p>
          <Link href="/cari" className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-hover text-white-pure text-sm font-semibold rounded-xl flex items-center gap-2 transition-all">
            <Search size={16} /> Cari Properti
          </Link>
        </div>
      )}
    </div>
  );
}
