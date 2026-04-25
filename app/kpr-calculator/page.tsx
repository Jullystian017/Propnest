'use client';
import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Calculator, HelpCircle, ChevronRight, PieChart } from 'lucide-react';
import Link from 'next/link';

export default function KPRCalculatorPage() {
  const [harga, setHarga] = useState(500000000);
  const [dpPercent, setDpPercent] = useState(20);
  const [tenor, setTenor] = useState(15);
  const [bunga, setBunga] = useState(6.5);

  // Perhitungan Sederhana (Hanya estimasi visual, rumus aslinya lebih spesifik)
  const dpAmount = harga * (dpPercent / 100);
  const plafon = harga - dpAmount;
  const bungaPerBulan = bunga / 100 / 12;
  const totalBulan = tenor * 12;
  const cicilan = (plafon * bungaPerBulan) / (1 - Math.pow(1 + bungaPerBulan, -totalBulan));

  return (
    <div className="bg-surface-gray min-h-screen pt-[100px] font-sans">
      <Navbar />

      <main className="container-standard py-10">
        
        {/* Header Title */}
        <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-brand-blue mb-4">
             <Calculator size={32} />
           </div>
           <h1 className="text-3xl md:text-5xl font-display font-medium text-text-dark mb-4">
             Kalkulator KPR Pintar
           </h1>
           <p className="text-text-gray max-w-2xl mx-auto text-lg leading-relaxed">
             Rencanakan pendanaan rumah impian Anda dengan simulasi cicilan KPR yang transparan, mudah, dan menyesuaikan kondisi finansial Anda.
           </p>
        </div>

        {/* Dashboard Calculator */}
        <div className="bg-white-pure rounded-3xl shadow-soft border border-border-line overflow-hidden flex flex-col md:flex-row">
           
           {/* Kiri: Form Input */}
           <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-border-line">
              <h2 className="text-xl font-bold text-text-dark mb-6">Informasi Pendanaan</h2>
              
              <div className="space-y-6">
                 {/* Harga Properti */}
                 <div>
                   <label className="flex justify-between text-sm font-semibold text-text-dark mb-2">
                     <span>Harga Properti</span>
                     <span className="text-brand-blue">Rp {(harga/1000000).toLocaleString('id-ID')} Juta</span>
                   </label>
                   <input 
                     type="range" min="100000000" max="2000000000" step="50000000" 
                     value={harga} onChange={(e) => setHarga(Number(e.target.value))}
                     className="w-full accent-brand-blue h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                   />
                 </div>

                 {/* Uang Muka (DP) */}
                 <div>
                   <label className="flex justify-between text-sm font-semibold text-text-dark mb-2">
                     <span>Uang Muka (DP)</span>
                     <span className="text-brand-blue">{dpPercent}% (Rp {(dpAmount/1000000).toLocaleString('id-ID')} Jt)</span>
                   </label>
                   <input 
                     type="range" min="0" max="50" step="5" 
                     value={dpPercent} onChange={(e) => setDpPercent(Number(e.target.value))}
                     className="w-full accent-brand-blue h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                   />
                 </div>

                 {/* Suku Bunga & Tenor */}
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">Masa Kredit</label>
                      <div className="relative">
                        <select 
                          value={tenor} onChange={(e) => setTenor(Number(e.target.value))}
                          className="w-full border border-border-line rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-blue outline-none appearance-none"
                        >
                          <option value={5}>5 Tahun</option>
                          <option value={10}>10 Tahun</option>
                          <option value={15}>15 Tahun</option>
                          <option value={20}>20 Tahun</option>
                          <option value={25}>25 Tahun</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16}/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-2">Bunga per Tahun</label>
                      <div className="relative">
                        <input 
                          type="number" step="0.1" 
                          value={bunga} onChange={(e) => setBunga(Number(e.target.value))}
                          className="w-full border border-border-line rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-brand-blue outline-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray font-medium">%</span>
                      </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Kanan: Hasil & Chart */}
           <div className="w-full md:w-[400px] bg-slate-50 p-8 md:p-10 flex flex-col items-center justify-center">
              <div className="text-center w-full mb-8">
                 <div className="text-sm font-semibold text-text-gray mb-2">Estimasi Tagihan Bulanan</div>
                 <div className="text-4xl font-display font-bold text-brand-orange mb-2">
                   Rp {Math.round(cicilan).toLocaleString('id-ID')}
                 </div>
                 <div className="text-xs text-brand-blue font-medium bg-blue-100 py-1.5 px-3 rounded-md inline-block">
                   Suku bunga flat/fix selama periode awal
                 </div>
              </div>

              {/* Pseudo Chart Box */}
              <div className="w-full bg-white-pure p-5 rounded-2xl border border-border-line mb-6">
                 <div className="flex items-center gap-2 mb-4 font-bold text-text-dark text-sm border-b border-border-line pb-2">
                   <PieChart size={16} className="text-brand-blue" /> Rincian Pinjaman
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-text-gray flex items-center gap-2"><div className="w-3 h-3 bg-blue-200 rounded-sm"></div> Plafon Pokok</span>
                     <span className="font-semibold text-text-dark">Rp {(plafon).toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-text-gray flex items-center gap-2"><div className="w-3 h-3 bg-brand-orange rounded-sm"></div> Total Bunga</span>
                     <span className="font-semibold text-text-dark">Rp {Math.round((cicilan * totalBulan) - plafon).toLocaleString('id-ID')}</span>
                   </div>
                 </div>
              </div>

              <button className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-soft transition-colors">
                 Cari Properti yang Sesuai
              </button>
           </div>
           
        </div>
      </main>

      <Footer />
    </div>
  );
}
