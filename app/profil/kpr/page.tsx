'use client';

import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle, FileText, Upload, Briefcase, CreditCard, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ProfilKPRPage() {
  const [income, setIncome] = useState(15000000);
  const [debts, setDebts] = useState(3000000);

  const calculateMaxInstallment = () => {
    // Standard rule: Max 40% of income minus existing debts
    const maxCapacity = (income * 0.4) - debts;
    return maxCapacity > 0 ? maxCapacity : 0;
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const documents = [
    { id: 'ktp', name: 'KTP Suami/Istri', status: 'verified', desc: 'Terverifikasi pada 12 Okt 2026' },
    { id: 'npwp', name: 'NPWP', status: 'uploaded', desc: 'Menunggu proses verifikasi' },
    { id: 'slip', name: 'Slip Gaji (3 Bulan Terakhir)', status: 'missing', desc: 'Harap unggah dokumen terbaru' },
    { id: 'rek', name: 'Rekening Koran', status: 'missing', desc: 'Harap unggah dokumen terbaru' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-text-dark mb-1">Profil KPR</h2>
        <p className="text-sm text-text-gray font-medium">Lengkapi profil finansial Anda untuk mempercepat proses pengajuan KPR.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Financial Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-brand-blue to-blue-800 rounded-3xl p-6 text-white-pure shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white-pure/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center gap-2 text-white/80 mb-2 font-medium text-xs uppercase tracking-widest">
              <Calculator size={14} /> Kapasitas Cicilan
            </div>
            <div className="text-3xl font-display font-bold mb-1">
              {formatRupiah(calculateMaxInstallment())}
            </div>
            <p className="text-xs text-white/70 mb-6">Maksimal per bulan (Est. Bunga 5%)</p>

            <div className="space-y-3 pt-4 border-t border-white/20">
              <div>
                <p className="text-[10px] text-white/60 mb-0.5 uppercase tracking-wider">Penghasilan Bulanan</p>
                <p className="font-semibold">{formatRupiah(income)}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/60 mb-0.5 uppercase tracking-wider">Cicilan Berjalan</p>
                <p className="font-semibold">{formatRupiah(debts)}</p>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-white-pure text-brand-blue text-xs font-bold rounded-xl hover:bg-surface-gray transition-colors">
              Update Finansial
            </button>
          </div>

          <div className="bg-white-pure rounded-3xl p-5 border border-border-line/30 shadow-sm">
            <h3 className="font-semibold text-text-dark text-sm mb-4">Simulasi Terakhir</h3>
            <div className="flex items-center justify-between p-3 bg-surface-gray/50 rounded-xl mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white-pure shadow-sm flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=100&h=100" alt="Rumah" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-dark">Rumah BSB City</p>
                  <p className="text-[10px] font-medium text-brand-blue">Rp 1,25 Miliar</p>
                </div>
              </div>
            </div>
            <Link href="/kpr-calculator" className="flex items-center justify-between w-full p-3 border border-border-line/50 rounded-xl hover:border-brand-blue/50 group transition-all">
              <span className="text-xs font-semibold text-text-gray group-hover:text-brand-blue transition-colors">Buka Kalkulator KPR</span>
              <ChevronRight size={16} className="text-text-gray group-hover:text-brand-blue transition-colors" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Document Checklist */}
        <div className="lg:col-span-2">
          <div className="bg-white-pure rounded-3xl p-6 sm:p-8 border border-border-line/30 shadow-sm h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-lg font-bold text-text-dark mb-1">Kelengkapan Dokumen</h3>
                <p className="text-xs text-text-gray font-medium">Unggah dokumen untuk mempercepat proses BI Checking & Pengajuan.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-blue">50%</p>
                  <p className="text-[10px] font-medium text-text-gray uppercase tracking-wider">Lengkap</p>
                </div>
                <div className="w-10 h-10 rounded-full border-4 border-surface-gray relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-brand-blue" strokeDasharray="100" strokeDashoffset="50" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-surface-gray/30 border border-border-line/40 hover:border-brand-blue/30 rounded-2xl transition-all group gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' :
                      doc.status === 'uploaded' ? 'bg-amber-50 text-amber-600' :
                      'bg-white-pure border border-border-line text-text-gray'
                    }`}>
                      {doc.status === 'verified' ? <CheckCircle2 size={18} /> : 
                       doc.status === 'uploaded' ? <Clock size={18} /> : 
                       <FileText size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-dark">{doc.name}</h4>
                      <p className="text-xs font-medium text-text-gray mt-0.5">{doc.desc}</p>
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex items-center self-end sm:self-auto">
                    {doc.status === 'verified' ? (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle2 size={12} /> Selesai
                      </span>
                    ) : doc.status === 'uploaded' ? (
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-amber-100 flex items-center gap-1.5">
                        <Clock size={12} /> Diproses
                      </span>
                    ) : (
                      <button className="px-4 py-2 bg-white-pure text-brand-blue border border-brand-blue/30 text-xs font-bold rounded-xl hover:bg-brand-blue hover:text-white-pure transition-all shadow-sm flex items-center gap-2">
                        <Upload size={14} /> Unggah
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border-line/30 flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl">
              <AlertCircle size={20} className="text-brand-blue shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-text-dark mb-1">Keamanan Data Terjamin</h4>
                <p className="text-[11px] text-text-gray leading-relaxed font-medium">Semua dokumen yang Anda unggah dienkripsi dan hanya akan dibagikan kepada bank rekanan dengan persetujuan eksplisit dari Anda.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
