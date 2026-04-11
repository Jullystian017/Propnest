import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, Home, DollarSign, Search, 
  BrainCircuit, Calculator, Map, FileCheck, Zap, TrendingUp,
  Heart, BedDouble, Bath, Scaling, ArrowUpRight
} from 'lucide-react';

const RECOMMENDATIONS = [
  {
    id: '1',
    name: 'Rumah Modern Minimalis',
    location: 'BSB City, Semarang',
    price: 'Rp 1,25 Miliar',
    specs: { beds: 4, baths: 3, size: 180 },
    badge: 'Baru',
    badgeColor: 'bg-brand-blue',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '2',
    name: 'Cluster Premium Colomadu',
    location: 'Colomadu, Solo',
    price: 'Rp 875 Juta',
    specs: { beds: 3, baths: 2, size: 120 },
    badge: 'Populer',
    badgeColor: 'bg-text-dark',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '3',
    name: 'Vila Tropis Ungaran',
    location: 'Ungaran, Semarang',
    price: 'Rp 2,1 Miliar',
    specs: { beds: 5, baths: 4, size: 350 },
    badge: 'Eksklusif',
    badgeColor: 'bg-brand-blue-deep',
    image: 'https://images.unsplash.com/photo-1600607687931-cebf10c2c31e?auto=format&fit=crop&q=80&w=600&h=400',
  },
];

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Property Matching',
    desc: 'Algoritma cerdas mencocokkan preferensi Anda dengan properti ideal secara otomatis.',
  },
  {
    icon: Calculator,
    title: 'Instant KPR Calculator',
    desc: 'Hitung simulasi cicilan KPR dari berbagai bank dalam hitungan detik.',
  },
  {
    icon: Map,
    title: 'Peta Interaktif',
    desc: 'Jelajahi properti langsung di peta dengan info lingkungan sekitar.',
  },
  {
    icon: FileCheck,
    title: 'Verifikasi Legalitas',
    desc: 'Berbagai properti terverifikasi SHM/HGB untuk keamanan transaksi Anda.',
  },
  {
    icon: Zap,
    title: 'Proses Cepat',
    desc: 'Dari pencarian hingga akad, selesaikan semuanya dalam satu platform.',
  },
  {
    icon: TrendingUp,
    title: 'Analisis Harga Pasar',
    desc: 'Data tren harga terkini untuk membantu keputusan investasi yang tepat.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-surface-gray min-h-screen">
      <Navbar />

      {/* ── HERO SECTION (HEARTHAVEN STYLE) ── */}
      <section className="relative min-h-[110vh] flex flex-col pt-48 pb-80 overflow-hidden">
        {/* Full Image Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920')" }}
        >
          <div className="absolute inset-0 bg-black-pure/50"></div>
        </div>

        <div className="container-standard relative z-10">
          
          {/* Top Toggles */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['House', 'Apartment', 'Residential', 'Townhouse'].map((type, i) => (
              <button 
                key={type} 
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  i === 0 ? 'bg-white-pure text-text-dark' : 'bg-white/10 backdrop-blur-md text-white-pure/90 hover:bg-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] items-end gap-12 mb-20">
            {/* Big Heading */}
            <div className="max-w-3xl">
              <h1 className="font-display font-light text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-white-pure drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                Find Your Dream Home <br className="hidden md:block" />
                With <span className="text-brand-blue font-bold">PropNest</span>
              </h1>
            </div>

            {/* Subtext on the right */}
            <div className="hidden lg:block">
              <p className="text-white/60 text-sm leading-relaxed max-w-xs border-l-2 border-brand-blue pl-6">
                Discover the most exclusive properties in Central Java with AI-powered analytics and real-time market data.
              </p>
            </div>
          </div>


          {/* ── SEARCH CONTAINER (THE WHITE BOX) ── */}
          <div className="bg-white-pure rounded-[2rem] p-4 lg:p-6 shadow-2xl max-w-6xl mx-auto -mb-48 relative z-30 border border-gray-100">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
              <h2 className="text-xl md:text-2xl font-display font-medium text-text-dark max-w-xl">Find The Perfect Place To Call Home</h2>
              
              {/* Buy/Sell/Rent Toggle */}
              <div className="flex bg-[#F1F1F3] p-1 rounded-full self-start xl:self-center">
                {['Buy', 'Sell', 'Rent'].map((tab, idx) => (
                  <button 
                    key={tab}
                    className={`px-7 py-2 rounded-full text-xs font-bold transition-all ${
                      idx === 0 
                      ? 'bg-brand-blue text-white-pure shadow-md' 
                      : 'text-text-gray/70 hover:text-text-dark'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_180px] gap-4 items-end">
              {/* Looking For */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest block ml-1 opacity-60">Property Type</label>
                <div className="flex items-center justify-between p-4 bg-white border border-border-line rounded-3xl cursor-pointer group hover:border-brand-blue transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <Home size={18} className="text-brand-blue" />
                    <span className="text-sm font-semibold text-text-dark">Modern House</span>
                  </div>
                  <ChevronDown size={14} className="text-text-gray" />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest block ml-1 opacity-60">Budget Range</label>
                <div className="flex items-center justify-between p-4 bg-white border border-border-line rounded-3xl cursor-pointer group hover:border-brand-blue transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <DollarSign size={18} className="text-brand-blue" />
                    <span className="text-sm font-semibold text-text-dark">$250k - $500k</span>
                  </div>
                  <ChevronDown size={14} className="text-text-gray" />
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-gray uppercase tracking-widest block ml-1 opacity-60">Location</label>
                <div className="flex items-center justify-between p-4 bg-white border border-border-line rounded-3xl cursor-pointer group hover:border-brand-blue transition-all shadow-sm">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-brand-blue" />
                    <span className="text-sm font-semibold text-text-dark">Semarang, ID</span>
                  </div>
                  <ChevronDown size={14} className="text-text-gray" />
                </div>
              </div>

              {/* Search Button Integrated */}
              <button className="h-[52px] bg-black-pure hover:bg-gray-800 text-white-pure font-bold rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg group">
                <Search size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm">Search</span>
              </button>
            </div>

            {/* Trending / Quick Links to fill space and look premium */}
            <div className="mt-6 pt-6 border-t border-border-line/50 flex flex-wrap items-center gap-4">
              <span className="text-[11px] font-bold text-text-gray uppercase tracking-wider">Trending:</span>
              <div className="flex flex-wrap gap-3">
                {['Apartment in Solo', 'Villa at Ungaran', 'BSB City House', 'Luxury Yogyakarta'].map(tag => (
                  <button key={tag} className="text-xs font-medium text-text-dark/60 hover:text-brand-blue transition-colors px-3 py-1.5 rounded-full bg-surface-gray hover:bg-blue-50">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing for the overlapping search bar */}
      <div className="h-64 md:h-80"></div>

      {/* ── FITUR UNGGULAN ── */}
      <section className="py-24 container-standard">
        <div className="text-center mb-16">
          <p className="text-brand-blue text-xs font-bold tracking-widest uppercase mb-3 text-center">Fitur Unggulan</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-dark mb-4">
            Teknologi Modern untuk Pencarian<br/> Properti
          </h2>
          <p className="text-text-gray max-w-2xl mx-auto">
            Kami memadukan AI dan data real-time untuk pengalaman pencarian properti terbaik di Jawa Tengah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
             const isBlue = i < 2; 
             return (
              <div 
                key={i} 
                className={`p-8 rounded-3xl shadow-feature-card ${isBlue ? 'bg-brand-blue text-white-pure' : 'bg-white-pure text-text-dark'} flex flex-col transition-transform hover:-translate-y-2 duration-300`}
              >
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 
                    ${isBlue ? 'bg-white-pure/10 text-white-pure' : 'bg-blue-50 text-brand-blue'}`}
                >
                  <feat.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold font-display mb-3">{feat.title}</h3>
                <p className={`text-sm leading-relaxed ${isBlue ? 'text-blue-100' : 'text-text-gray'}`}>
                  {feat.desc}
                </p>
              </div>
             )
          })}
        </div>
      </section>

      {/* ── REKOMENDASI PROPERTI ── */}
      <section className="py-24 container-standard border-t border-border-line/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
           <div>
             <p className="text-brand-blue text-xs font-bold tracking-widest uppercase mb-2">Rekomendasi</p>
             <h2 className="text-4xl font-display font-bold text-text-dark">Properti Pilihan</h2>
           </div>
           <Link href="/cari" className="group flex items-center gap-2 text-sm font-bold text-brand-blue">
             Lihat Semua Properti 
             <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {RECOMMENDATIONS.map((item) => (
             <div key={item.id} className="bg-white-pure rounded-3xl overflow-hidden shadow-feature-card border border-border-line group cursor-pointer transition-all hover:shadow-premium">
               <div className="relative aspect-[16/11] bg-surface-dim overflow-hidden">
                 <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${item.image})` }}></div>
                 
                 <div className="absolute top-5 left-5">
                   <div className={`${item.badgeColor} text-white-pure text-[10px] font-extrabold px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md bg-opacity-90`}>
                     {item.badge}
                   </div>
                 </div>
                 <div className="absolute top-5 right-5">
                   <div className="w-10 h-10 rounded-full bg-white-pure/90 flex items-center justify-center shadow-lg text-gray-400 hover:text-red-500 hover:bg-white transition-all transform hover:scale-110 active:scale-90">
                     <Heart size={18} />
                   </div>
                 </div>
               </div>

               <div className="p-7">
                 <h3 className="text-brand-blue-deep font-extrabold text-2xl mb-2">{item.price}</h3>
                 <div className="font-bold text-text-dark text-lg mb-1 truncate">{item.name}</div>
                 <div className="text-sm text-text-gray mb-6 flex items-center gap-1.5 opacity-80">
                   <MapPin size={14} /> {item.location}
                 </div>
                 
                 <div className="flex items-center gap-6 text-[13px] font-bold text-text-dark/70 pt-6 border-t border-border-line/50">
                   <span className="flex items-center gap-2"><BedDouble size={18} className="text-brand-blue" /> {item.specs.beds}</span>
                   <span className="flex items-center gap-2"><Bath size={18} className="text-brand-blue" /> {item.specs.baths}</span>
                   <span className="flex items-center gap-2"><Scaling size={18} className="text-brand-blue" /> {item.specs.size} m²</span>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="container-standard py-12">
        <div className="bg-brand-blue rounded-[3rem] p-12 lg:p-20 overflow-hidden relative shadow-premium">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="max-w-2xl relative z-10 text-white-pure">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Siap Menemukan <br/>Rumah Impian?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-lg leading-relaxed">
              Daftarkan diri Anda sekarang dan dapatkan rekomendasi properti terbaik langsung ke inbox Anda secara otomatis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/daftar" className="bg-white-pure text-brand-blue px-10 py-4 rounded-full font-bold hover:bg-gray-50 transition-all shadow-lg active:scale-95 text-center">
                Mulai Sekarang
              </Link>
              <Link href="/about" className="border border-white/30 text-white-pure px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-colors text-center">
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
