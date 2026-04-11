import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { 
  MapPin, BedDouble, Bath, Scaling, CheckCircle2, 
  Phone, CalendarHeart, Share2, Heart, Award,
  Zap, MessageSquare, ChevronRight, Star, Shield, TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

export default async function DetailPropertiPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const property = MOCK_PROPERTIES.find(p => p.id === id);

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-white-pure min-h-screen pt-24 font-sans selection:bg-brand-blue/10">
      <Navbar />

      <main className="container-standard py-6">
        {/* Breadcrumb & Top Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-gray/60 mb-4 font-medium">
              <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/cari" className="hover:text-brand-blue transition-colors">Properties</Link>
              <ChevronRight size={12} />
              <span className="text-text-dark">{property.location.split(',')[0]}</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="backdrop-blur-md bg-white-pure/90 px-3 py-1 rounded-full shadow-premium border border-border-line/50 text-[10px] font-semibold flex items-center gap-2 text-brand-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
                {property.badge}
              </div>
              <span className="bg-surface-dim/50 text-text-gray/80 text-[10px] font-medium px-3 py-1 rounded-full border border-border-line/30">SHM Sertifikat</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-text-dark tracking-tight">
              {property.name}
            </h1>
            <div className="flex items-center gap-2 text-text-gray mt-3">
              <MapPin size={18} className="text-brand-blue" />
              <span className="text-sm md:text-lg font-medium">{property.location}</span>
            </div>
          </div>

          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white-pure border border-border-line/60 rounded-xl text-sm font-medium text-text-dark hover:bg-surface-gray transition-all shadow-sm active:scale-95">
               <Share2 size={16} className="text-brand-blue" /> Bagikan
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white-pure border border-border-line/60 rounded-xl text-sm font-bold text-text-dark hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm active:scale-95">
               <Heart size={16} /> Simpan
             </button>
          </div>
        </div>

        {/* Bento Gallery - Dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[350px] md:h-[550px]">
           <div className="md:col-span-2 relative rounded-3xl overflow-hidden group h-full shadow-premium">
             <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${property.image}')` }}></div>
           </div>
           <div className="hidden md:block col-span-1 space-y-4 h-full">
             <div className="relative rounded-3xl overflow-hidden group h-[calc(50%-8px)] shadow-soft">
               <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${property.gallery?.[0] || property.image}')` }}></div>
             </div>
             <div className="relative rounded-3xl overflow-hidden group h-[calc(50%-8px)] shadow-soft">
               <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${property.gallery?.[1] || property.image}')` }}></div>
             </div>
           </div>
           <div className="hidden md:block col-span-1 relative rounded-3xl overflow-hidden group h-full shadow-soft">
             <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${property.gallery?.[2] || property.image}')` }}></div>
             <div className="absolute inset-0 bg-black-pure/30 backdrop-blur-[2px] flex items-center justify-center cursor-pointer hover:bg-black-pure/50 transition-all">
               <div className="text-center">
                 <div className="text-white-pure font-semibold text-2xl tracking-tighter">+12</div>
                 <div className="text-white-pure/80 text-[10px] font-bold uppercase tracking-widest">More Photos</div>
               </div>
             </div>
           </div>
        </div>

        {/* Two Column Content */}
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column (Main) */}
          <div className="flex-1 space-y-12">
            
            {/* Specs Highlight Dashboard */}
            <div className="bg-white-pure p-8 rounded-[32px] shadow-premium border border-border-line/40 flex flex-wrap justify-between items-center text-text-dark relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
               
               <div className="flex flex-col items-center gap-1 flex-1 min-w-[120px] border-r border-border-line/40 last:border-0 py-2">
                 <BedDouble size={24} className="text-brand-blue mb-2" />
                 <div className="text-[10px] text-text-gray font-semibold uppercase tracking-widest">Bedrooms</div>
                 <div className="text-xl font-medium">{property.specs.beds} Rooms</div>
               </div>
               
               <div className="flex flex-col items-center gap-1 flex-1 min-w-[120px] border-r border-border-line/40 last:border-0 py-2">
                 <Bath size={24} className="text-brand-blue mb-2" />
                 <div className="text-[10px] text-text-gray font-bold uppercase tracking-widest">Bathrooms</div>
                 <div className="text-xl font-bold">{property.specs.baths} Rooms</div>
               </div>
               
               <div className="flex flex-col items-center gap-1 flex-1 min-w-[120px] py-2">
                 <Scaling size={24} className="text-brand-blue mb-2" />
                 <div className="text-[10px] text-text-gray font-bold uppercase tracking-widest">Land Area</div>
                 <div className="text-xl font-bold">{property.specs.size} m²</div>
               </div>
            </div>

            {/* Description Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-10 bg-brand-blue rounded-full"></div>
                <h2 className="text-3xl font-display font-medium text-text-dark">About this Property</h2>
              </div>
              <div className="text-text-gray leading-relaxed text-lg font-light max-w-3xl">
                {property.description || 'Properti eksklusif yang dirancang untuk kenyamanan keluarga Anda. Terletak di lokasi yang sangat strategis dengan akses mudah ke fasilitas publik utama.'}
              </div>
            </div>

            {/* Features Section */}
            <div>
              <h2 className="text-xl font-display font-bold text-text-dark mb-6 flex items-center gap-3">
                <Shield size={20} className="text-brand-blue" /> Premium Facilities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(property.features || ['Keamanan 24 Jam', 'Area Taman', 'Smart Gateway', 'Internet Dedicated']).map((feat) => (
                    <div key={feat} className="flex flex-col gap-3 bg-surface-dim/30 p-5 rounded-2xl border border-border-line/20 hover:border-brand-blue/30 transition-all group">
                      <CheckCircle2 size={24} className="text-brand-blue/40 group-hover:text-brand-blue transition-colors" />
                      <span className="text-sm text-text-dark font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Mini Mortgage Calculator */}
            <div className="bg-gradient-to-br from-brand-blue/5 via-white-pure to-transparent p-10 rounded-[40px] border border-brand-blue/10 relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-2xl font-display font-bold text-text-dark mb-2">Simulasi Cicilan KPR</h2>
                 <p className="text-text-gray mb-8 text-sm">Wujudkan hunian impian Anda dengan skema pembayaran yang fleksibel.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-text-gray">Uang Muka (DP)</label>
                     <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark font-bold text-sm">Rp</span>
                        <input type="text" className="w-full bg-white-pure border-2 border-border-line/40 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-blue shadow-sm group-hover:border-border-line transition-all" defaultValue="150.000.000" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-text-gray">Tenor (Tahun)</label>
                     <select className="w-full bg-white-pure border-2 border-border-line/40 rounded-2xl py-4 px-4 focus:outline-none focus:border-brand-blue shadow-sm appearance-none font-bold text-text-dark" defaultValue="15">
                       <option value="10">10 Tahun</option>
                       <option value="15">15 Tahun</option>
                       <option value="20">20 Tahun</option>
                     </select>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between bg-white-pure/60 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-premium">
                    <div>
                      <div className="text-[10px] text-text-gray font-black uppercase tracking-widest mb-1">Estimasi Cicilan Ke-1</div>
                      <div className="text-3xl font-black text-brand-blue font-display">{property.price.includes('Miliar') ? 'Rp 8.450.000' : 'Rp 3.120.000'}<span className="text-sm font-bold text-text-gray/50 ml-1">/ bulan</span></div>
                    </div>
                    <Link href="#" className="bg-brand-blue text-white-pure font-bold text-xs px-6 py-3 rounded-xl hover:bg-brand-blue-deep transition-all shadow-md hover:shadow-lg active:scale-95">
                      Lihat Detail
                    </Link>
                 </div>
               </div>
            </div>

          </div>

          {/* Right Column (Sticky Sidebar) */}
          <aside className="w-full lg:w-[420px] shrink-0">
             <div className="bg-white-pure rounded-[40px] border border-border-line/40 p-8 shadow-premium sticky top-28 ring-1 ring-border-line/20">
               
               <div className="mb-8 p-6 bg-surface-dim/30 rounded-3xl border border-border-line/20">
                 <div className="text-[10px] font-black uppercase tracking-widest text-text-gray/60 mb-1">Selling Price</div>
                 <div className="text-4xl font-semibold text-text-dark font-display tracking-tight">{property.price}</div>
                 <div className="flex items-center gap-2 mt-3 text-brand-blue font-semibold text-xs">
                   <TrendingUp size={14} /> <span>Price reflects current market value</span>
                 </div>
               </div>

               {/* Smart Reminder Widget */}
               <div className="bg-brand-blue/5 border border-brand-blue/10 text-brand-blue p-5 rounded-2xl flex items-start gap-3 mb-8">
                 <div className="bg-white-pure p-2 rounded-lg shadow-sm">
                   <Zap size={18} fill="currentColor" />
                 </div>
                 <div>
                   <div className="text-sm font-semibold leading-tight">High Demand Area!</div>
                   <div className="text-xs text-brand-blue/70 mt-1">Rumah di area ini populer, terjual dalam rata-rata 25 hari.</div>
                 </div>
               </div>

               <div className="space-y-4 mb-10">
                 <button className="w-full bg-brand-blue text-white-pure py-5 rounded-2xl font-semibold text-base shadow-xl hover:bg-brand-blue-deep hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                   <MessageSquare size={20} /> Hubungi Agen
                 </button>
                 <button className="w-full bg-white-pure border-2 border-brand-blue text-brand-blue hover:bg-blue-50 py-5 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-3 active:scale-95">
                   <CalendarHeart size={20} /> Jadwalkan Kunjungan
                 </button>
               </div>

               {/* Verified Agent Badge */}
               <div className="bg-white-pure border border-border-line/40 p-5 rounded-3xl flex items-center gap-5 hover:bg-surface-gray transition-colors group">
                 <div className="relative">
                   <div className="w-14 h-14 rounded-2xl bg-cover bg-center shadow-md grow-0 shrink-0 border border-white-pure group-hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url('${property.agent?.avatar || 'https://ui-avatars.com/api/?name=Agent+PropNest&background=random'}')`}}></div>
                   <div className="absolute -bottom-1 -right-1 bg-green-500 text-white-pure p-1 rounded-full border-2 border-white-pure">
                     <Shield size={10} fill="currentColor" />
                   </div>
                 </div>
                 <div>
                   <div className="font-semibold text-text-dark text-base tracking-tight">{property.agent?.name || 'Agen PropNest Resmi'}</div>
                   <div className="text-[10px] text-text-gray font-black uppercase tracking-widest mt-0.5">{property.agent?.type || 'Senior Consultant'}</div>
                 </div>
               </div>

             </div>
          </aside>

        </div>
      </main>
      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
