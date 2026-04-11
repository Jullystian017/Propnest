import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { MapPin, BedDouble, Bath, Scaling, CheckCircle2, Phone, CalendarHeart, Share2, Heart, Award } from 'lucide-react';
import Link from 'next/link';

export default function DetailPropertiPage() {
  return (
    <div className="bg-surface-gray min-h-screen pt-24 font-sans">
      <Navbar />

      <main className="container-standard py-6 border-b border-border-line/40">
        {/* Breadcrumb & Top Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex gap-2 text-sm text-text-gray mb-3 border-b border-border-line pb-2 inline-flex">
              <Link href="/" className="hover:text-brand-blue">Home</Link>
              <span>/</span>
              <Link href="/cari" className="hover:text-brand-blue">Jawa Tengah</Link>
              <span>/</span>
              <span className="text-text-dark font-medium">Banyumas</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-3 py-1 rounded-full border border-brand-blue/20">Rumah Komersil</span>
              <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full border border-brand-orange/20">Siap Huni</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text-dark mb-2">
              Griya Asri Premiere Purwokerto
            </h1>
            <div className="flex items-center gap-2 text-text-gray text-sm font-medium">
              <MapPin size={16} className="text-brand-orange" />
              Jl. Raden Patah, Purwokerto Utara, Banyumas
            </div>
          </div>

          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white-pure border border-border-line rounded-lg text-sm font-semibold hover:bg-surface-gray transition-colors">
               <Share2 size={16} /> Bagikan
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white-pure border border-border-line rounded-lg text-sm font-semibold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
               <Heart size={16} /> Simpan
             </button>
          </div>
        </div>

        {/* Bento Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[300px] md:h-[450px]">
           <div className="md:col-span-2 relative rounded-2xl overflow-hidden group h-full">
             <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800&h=600')` }}></div>
           </div>
           <div className="hidden md:block col-span-1 relative rounded-2xl overflow-hidden group h-full">
             <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400&h=600')` }}></div>
           </div>
           <div className="hidden md:block col-span-1 relative rounded-2xl overflow-hidden group h-full">
             <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&q=80&w=400&h=600')` }}></div>
             <div className="absolute inset-0 bg-black-pure/40 flex items-center justify-center cursor-pointer hover:bg-black-pure/50 transition-colors">
               <span className="text-white-pure font-bold text-lg">+12 Foto</span>
             </div>
           </div>
        </div>

        {/* Two Column Content */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sisi Kiri (Main) */}
          <div className="flex-1 space-y-10">
            {/* Keunggulan Spec */}
            <div className="bg-white-pure p-6 rounded-2xl shadow-sm border border-border-line flex justify-between items-center text-text-dark font-medium">
               <div className="text-center flex-1 border-r border-border-line/60">
                 <div className="text-text-gray text-xs mb-1">Kamar Tidur</div>
                 <div className="flex justify-center items-center gap-2"><BedDouble size={20} className="text-brand-blue" /> 3 Ruangan</div>
               </div>
               <div className="text-center flex-1 border-r border-border-line/60">
                 <div className="text-text-gray text-xs mb-1">Kamar Mandi</div>
                 <div className="flex justify-center items-center gap-2"><Bath size={20} className="text-brand-blue" /> 2 Ruangan</div>
               </div>
               <div className="text-center flex-1 border-r border-border-line/60">
                 <div className="text-text-gray text-xs mb-1">Luas Tanah</div>
                 <div className="flex justify-center items-center gap-2"><Scaling size={20} className="text-brand-blue" /> 90 m²</div>
               </div>
               <div className="text-center flex-1">
                 <div className="text-text-gray text-xs mb-1">Luas Bangunan</div>
                 <div className="flex justify-center items-center gap-2"><Scaling size={20} className="text-brand-blue" /> 60 m²</div>
               </div>
            </div>

            {/* Deskripsi */}
            <div>
              <h2 className="text-xl font-display font-bold text-text-dark mb-4">Deskripsi Properti</h2>
              <div className="prose prose-sm text-text-gray leading-relaxed pr-6">
                <p>Griya Asri Premiere adalah perumahan cluster eksklusif di jantung kota Purwokerto Utara. Dirancang khusus untuk keluarga modern yang mendambakan keseimbangan antara gaya hidup perkotaan dan ketenangan alam.</p>
                <p className="mt-4">Setiap unit dibangun menggunakan material premium berkualitas. Lokasinya sangat strategis, hanya 5 menit ke Universitas Jenderal Soedirman (UNSOED) dan 10 menit ke stasiun kereta api.</p>
              </div>
            </div>

            {/* Fasilitas */}
            <div>
              <h2 className="text-xl font-display font-bold text-text-dark mb-4">Fasilitas Utama</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['One Gate System', 'CCTV 24 Jam', 'Playground Anak', 'Taman Hijau', 'Mushola', 'Row Jalan 8 Meter'].map((fas, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-text-gray bg-white-pure px-4 py-3 rounded-xl border border-border-line/50">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <span>{fas}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini KPR */}
            <div className="bg-gradient-to-br from-blue-50 to-white-pure p-8 rounded-2xl border border-blue-100">
               <h2 className="text-xl font-display font-bold text-text-dark mb-2">Hitung Cicilan KPR</h2>
               <p className="text-sm text-text-gray mb-6">Simulasi cicilan bulanan untuk menyiapkan anggaran keluarga Anda.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <div>
                   <label className="block text-xs font-semibold text-text-dark mb-1">Uang Muka (DP)</label>
                   <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray font-medium text-sm">Rp</span>
                      <input type="text" className="w-full border border-border-line rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:border-brand-blue" defaultValue="50.000.000" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-semibold text-text-dark mb-1">Tenor Jangka Waktu</label>
                   <select className="w-full border border-border-line rounded-lg py-2 px-3 focus:outline-none focus:border-brand-blue" defaultValue="15 Tahun">
                     <option>10 Tahun</option>
                     <option>15 Tahun</option>
                     <option>20 Tahun</option>
                   </select>
                 </div>
               </div>
               
               <div className="flex items-center justify-between bg-white-pure p-4 rounded-xl border border-border-line shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <div>
                    <div className="text-xs text-text-gray font-medium mb-1">Estimasi Cicilan per Bulan</div>
                    <div className="text-2xl font-bold text-brand-orange">Rp 3.450.000</div>
                  </div>
                  <Link href="/kpr-calculator" className="text-brand-blue font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-brand-blue hover:text-white-pure transition-colors">
                    Lihat Detail
                  </Link>
               </div>
            </div>

          </div>

          {/* Sisi Kanan (Sticky Sidebar) */}
          <aside className="w-full lg:w-[380px] shrink-0">
             <div className="bg-white-pure rounded-2xl border border-border-line p-6 shadow-floating sticky top-28">
               
               <div className="mb-6 pb-6 border-b border-border-line/60">
                 <div className="text-sm text-text-gray font-medium mb-1 line-through">Rp 450.000.000</div>
                 <div className="text-3xl font-display font-bold text-text-dark mb-3">Rp 350 Juta</div>
                 <div className="bg-orange-50 border border-orange-100 text-orange-600 text-sm font-semibold p-3 rounded-lg flex items-start gap-2">
                   <Award size={18} className="shrink-0 mt-0.5" />
                   Promo Free BPHTB & Biaya KPR untuk pembelian bulan ini!
                 </div>
               </div>

               <div className="space-y-3 mb-6">
                 <button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-soft hover:shadow-floating flex items-center justify-center gap-2">
                   <Phone size={18} /> Hubungi Developer
                 </button>
                 <button className="w-full bg-white-pure border-2 border-brand-blue text-brand-blue hover:bg-blue-50 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                   <CalendarHeart size={18} /> Jadwalkan Kunjungan
                 </button>
               </div>

               {/* Agen Info */}
               <div className="bg-surface-gray p-4 rounded-xl flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-full bg-cover" style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=PT+Properti+Jaya&background=0D8ABC&color=fff')`}}></div>
                 <div>
                   <div className="font-bold text-text-dark text-sm">PT Alam Tropis Jaya</div>
                   <div className="text-xs text-text-gray font-medium">Developer Resmi PropNest</div>
                 </div>
               </div>

             </div>
          </aside>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
