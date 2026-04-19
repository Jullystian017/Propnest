'use client';

import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Clock, AlertCircle, ChevronDown, Search } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  {
    id: 'TRX-20261012-001',
    property: 'Rumah Modern Minimalis BSB',
    type: 'Booking Fee',
    amount: 10000000,
    date: '12 Okt 2026',
    status: 'Berhasil', // Berhasil, Menunggu Pembayaran, Dibatalkan
    paymentMethod: 'Transfer Bank BCA',
  },
  {
    id: 'TRX-20260925-042',
    property: 'Cluster Premium Colomadu',
    type: 'Uang Muka (DP) 1',
    amount: 50000000,
    date: '25 Sep 2026',
    status: 'Menunggu Pembayaran',
    paymentMethod: 'Virtual Account Mandiri',
  },
  {
    id: 'TRX-20260810-015',
    property: 'Vila Tropis Ungaran',
    type: 'Booking Fee',
    amount: 5000000,
    date: '10 Agu 2026',
    status: 'Dibatalkan',
    paymentMethod: 'Kartu Kredit',
  }
];

export default function TransaksiPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => 
    t.property.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Berhasil': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Menunggu Pembayaran': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Dibatalkan': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Berhasil': return <CheckCircle2 size={14} className="mr-1.5" />;
      case 'Menunggu Pembayaran': return <Clock size={14} className="mr-1.5" />;
      case 'Dibatalkan': return <AlertCircle size={14} className="mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-dark mb-1">Riwayat Transaksi</h2>
          <p className="text-sm text-text-gray font-medium">Pantau tagihan dan riwayat pembayaran properti Anda.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray/50" size={16} />
          <input 
            type="text" 
            placeholder="Cari ID atau Properti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white-pure rounded-xl text-sm border border-border-line/50 focus:ring-2 focus:ring-brand-blue/20 transition-all outline-none shadow-sm"
          />
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="bg-white-pure rounded-3xl border border-border-line/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-gray/50 border-b border-border-line/40 text-[11px] uppercase tracking-widest text-text-gray font-semibold">
                  <th className="p-5 font-semibold">ID Transaksi</th>
                  <th className="p-5 font-semibold">Detail Pembayaran</th>
                  <th className="p-5 font-semibold">Total Tagihan</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-line/20">
                {filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-surface-gray/20 transition-colors group">
                    <td className="p-5 align-top">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-text-gray/50" />
                        <div>
                          <p className="text-sm font-bold text-text-dark">{trx.id}</p>
                          <p className="text-xs text-text-gray font-medium">{trx.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 align-top">
                      <p className="text-sm font-bold text-text-dark group-hover:text-brand-blue transition-colors mb-0.5">{trx.property}</p>
                      <p className="text-xs text-text-gray font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/40"></span> {trx.type}
                      </p>
                    </td>
                    <td className="p-5 align-top">
                      <p className="text-sm font-bold text-text-dark">{formatRupiah(trx.amount)}</p>
                      <p className="text-[10px] text-text-gray font-medium mt-1">{trx.paymentMethod}</p>
                    </td>
                    <td className="p-5 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-md border ${getStatusColor(trx.status)}`}>
                        {getStatusIcon(trx.status)}
                        {trx.status}
                      </span>
                    </td>
                    <td className="p-5 align-top text-right">
                      {trx.status === 'Menunggu Pembayaran' ? (
                        <button className="px-4 py-2 bg-brand-blue text-white-pure text-xs font-bold rounded-xl hover:bg-brand-blue-hover shadow-sm transition-all active:scale-95">
                          Bayar Sekarang
                        </button>
                      ) : (
                        <button className="p-2 text-text-gray hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl border border-transparent hover:border-brand-blue/20 transition-all inline-flex items-center justify-center">
                          <Download size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border-line/30 bg-surface-gray/20 flex items-center justify-center gap-2">
            <button className="text-xs font-semibold text-text-gray hover:text-brand-blue flex items-center gap-1 transition-colors">
              Muat Lebih Banyak <ChevronDown size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white-pure rounded-3xl p-12 border border-dashed border-border-line flex flex-col items-center justify-center text-center mt-8">
          <div className="w-16 h-16 bg-surface-gray rounded-full flex items-center justify-center text-text-gray/40 mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-semibold text-text-dark text-lg mb-2">Belum ada transaksi</h3>
          <p className="text-sm text-text-gray max-w-sm mb-6">Riwayat pembayaran Booking Fee atau DP Anda akan muncul di sini.</p>
        </div>
      )}

    </div>
  );
}
