import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, Home, DollarSign, Search,
  BrainCircuit, Calculator, Map, FileCheck, Zap, TrendingUp,
  Heart, BedDouble, Bath, Scaling, ArrowUpRight, Bookmark
} from 'lucide-react';

import { MOCK_PROPERTIES as RECOMMENDATIONS } from '@/lib/mock-data';

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
      <section className="relative h-screen flex flex-col justify-end pb-64 overflow-hidden">
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
                Find Your Dream Home <br className="hidden md:block" />
                With <span className="text-brand-blue font-medium">PropNest</span>
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
          <div className="bg-white-pure rounded-[2.5rem] py-5 lg:py-7 px-6 lg:px-10 shadow-xl max-w-full mx-auto -mb-48 relative z-30 border border-gray-100">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
              <h2 className="text-xl md:text-2xl font-display font-medium text-text-dark max-w-xl">Find The Perfect Place To Call Home</h2>

              {/* Buy/Sell/Rent Toggle */}
              <div className="flex bg-[#F1F1F3] p-1 rounded-full self-start xl:self-center">
                {['Buy', 'Sell', 'Rent'].map((tab, idx) => (
                  <button
                    key={tab}
                    className={`px-7 py-2 rounded-full text-xs font-semibold transition-all ${idx === 0
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
                <label className="text-[10px] font-medium text-text-gray uppercase tracking-widest block ml-1 opacity-60">Property Type</label>
                <div className="flex items-center justify-between p-5 bg-[#F1F1F3] rounded-[2rem] cursor-pointer group hover:bg-gray-200 transition-all">
                  <div className="flex items-center gap-3">
                    <Home size={18} className="text-brand-blue" />
                    <span className="text-sm font-semibold text-text-dark">Modern House</span>
                  </div>
                  <ChevronDown size={14} className="text-text-gray" />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-text-gray uppercase tracking-widest block ml-1 opacity-60">Budget Range</label>
                <div className="flex items-center justify-between p-5 bg-[#F1F1F3] rounded-[2rem] cursor-pointer group hover:bg-gray-200 transition-all">
                  <div className="flex items-center gap-3">
                    <DollarSign size={18} className="text-brand-blue" />
                    <span className="text-sm font-semibold text-text-dark">$250k - $500k</span>
                  </div>
                  <ChevronDown size={14} className="text-text-gray" />
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-text-gray uppercase tracking-widest block ml-1 opacity-60">Location</label>
                <div className="flex items-center justify-between p-5 bg-[#F1F1F3] rounded-[2rem] cursor-pointer group hover:bg-gray-200 transition-all">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-brand-blue" />
                    <span className="text-sm font-semibold text-text-dark">Semarang, ID</span>
                  </div>
                  <ChevronDown size={14} className="text-text-gray" />
                </div>
              </div>

              {/* Search Button Integrated */}
              <button className="h-[64px] bg-black-pure hover:bg-gray-800 text-white-pure font-medium rounded-[2rem] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg group">
                <Search size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm">Search</span>
              </button>
            </div>

            {/* Trending / Quick Links to fill space and look premium */}
          </div>
        </div>
      </section>


      {/* ── FITUR UNGGULAN ── */}
      <section className="py-24 container-standard">
        <div className="text-center mb-16">
          <p className="text-brand-blue text-xs font-medium tracking-widest uppercase mb-3 text-center">Fitur Unggulan</p>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-text-dark mb-4">
            Teknologi Modern untuk Pencarian<br /> Properti
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
                <h3 className="text-lg font-medium font-display mb-3">{feat.title}</h3>
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
                  <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-brand-blue/60" /> {item.specs.beds} Bed</span>
                  <span className="flex items-center gap-1.5"><Bath size={14} className="text-brand-blue/60" /> {item.specs.baths} Bath</span>
                  <span className="flex items-center gap-1.5"><Scaling size={14} className="text-brand-blue/60" /> {item.specs.size}m²</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="container-standard py-12">
        <div className="bg-brand-blue rounded-[3rem] p-12 lg:p-20 overflow-hidden relative shadow-premium">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="max-w-2xl relative z-10 text-white-pure">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Siap Menemukan <br />Rumah Impian?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-lg leading-relaxed">
              Daftarkan diri Anda sekarang dan dapatkan rekomendasi properti terbaik langsung ke inbox Anda secara otomatis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/daftar" className="bg-white-pure text-brand-blue px-10 py-4 rounded-full font-medium hover:bg-gray-50 transition-all shadow-lg active:scale-95 text-center">
                Mulai Sekarang
              </Link>
              <Link href="/about" className="border border-white/30 text-white-pure px-10 py-4 rounded-full font-medium hover:bg-white/10 transition-colors text-center">
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
