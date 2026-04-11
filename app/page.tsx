import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, Home, DollarSign, Search, 
  BrainCircuit, Calculator, Map, FileCheck, Zap, TrendingUp,
  Heart, BedDouble, Bath, Scaling
} from 'lucide-react';

const RECOMMENDATIONS = [
  {
    id: '1',
    name: 'Rumah Modern Minimalis',
    location: 'BSB City, Semarang',
    price: 'Rp 1,25 Miliar',
    specs: { beds: 4, baths: 3, size: 180 },
    badge: 'Baru',
    badgeColor: 'bg-brand-orange',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '2',
    name: 'Cluster Premium Colomadu',
    location: 'Colomadu, Solo',
    price: 'Rp 875 Juta',
    specs: { beds: 3, baths: 2, size: 120 },
    badge: 'Populer',
    badgeColor: 'bg-brand-orange',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600&h=400',
  },
  {
    id: '3',
    name: 'Vila Tropis Ungaran',
    location: 'Ungaran, Semarang',
    price: 'Rp 2,1 Miliar',
    specs: { beds: 5, baths: 4, size: 350 },
    badge: 'Eksklusif',
    badgeColor: 'bg-brand-orange',
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

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 bg-black-pure text-white-pure">
        {/* Full background image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        >
           <div className="absolute inset-0 bg-black-pure/60"></div>
        </div>

        <div className="container-standard relative z-10 text-center">
          <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 opacity-90">
            #1 MARKETPLACE PROPERTI JAWA TENGAH
          </div>
          
          <h1 className="font-display font-medium text-4xl md:text-6xl lg:text-[4rem] leading-tight tracking-tight mb-6">
            Temukan Rumah <br className="hidden md:block"/>
            <span className="text-brand-orange font-bold">Impianmu</span> di Sini
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-12">
            Jelajahi ribuan properti terbaik di Semarang, Solo, Yogyakarta dan sekitarnya dengan teknologi AI matching.
          </p>

          {/* Floating Search Bar */}
          <div className="bg-white-pure p-3 rounded-xl max-w-4xl mx-auto shadow-floating-search flex flex-col md:flex-row items-center gap-2 mb-10 text-left">
            
            <div className="flex-1 flex w-full">
              {/* Lokasi */}
              <div className="flex-1 px-4 py-2 border-r border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lokasi</div>
                  <div className="text-sm font-semibold text-gray-900">Semarang, Solo...</div>
                </div>
              </div>

              {/* Tipe */}
              <div className="flex-1 px-4 py-2 border-r border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <Home size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tipe</div>
                  <div className="text-sm font-semibold text-gray-900">Semua Tipe</div>
                </div>
              </div>

              {/* Budget */}
              <div className="flex-1 px-4 py-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <DollarSign size={16} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Budget</div>
                  <div className="text-sm font-semibold text-gray-900">Semua Harga</div>
                </div>
              </div>
            </div>

            <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Search size={18} strokeWidth={2.5} />
              Cari Properti
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center mt-12">
            {[
              { val: '12,500+', label: 'Properti' },
              { val: '35+', label: 'Agen' },
              { val: '8,200+', label: 'Pengguna' },
              { val: '98%', label: 'Kepuasan' },
            ].map((stat, i) => (
               <div key={i}>
                 <div className="text-2xl md:text-3xl font-bold font-display">{stat.val}</div>
                 <div className="text-sm font-medium text-gray-300">{stat.label}</div>
               </div>
            ))}
          </div>

        </div>
      </section>


      {/* ── FITUR UNGGULAN ── */}
      <section className="py-24 container-standard">
        <div className="text-center mb-16">
          <p className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-3">Fitur Unggulan</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-dark mb-4">
            Teknologi Modern untuk Pencarian<br/> Properti
          </h2>
          <p className="text-text-gray max-w-2xl mx-auto">
            Kami memadukan AI dan data real-time untuk pengalaman pencarian properti terbaik di Jawa Tengah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => {
             // 2 Pertama biru solid, sisanya putih solid
             const isBlue = i < 2; 
             
             return (
              <div 
                key={i} 
                className={`p-8 rounded-2xl shadow-feature-card ${isBlue ? 'bg-brand-blue text-white-pure' : 'bg-white-pure text-text-dark'} flex flex-col`}
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
             <p className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-2">Rekomendasi</p>
             <h2 className="text-3xl font-display font-bold text-text-dark">Properti Pilihan</h2>
           </div>
           <Link href="/cari" className="border border-border-line px-5 py-2 rounded-lg text-sm font-medium hover:bg-white-pure transition-colors bg-transparent">
             Lihat Semua →
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {RECOMMENDATIONS.map((item) => (
             <div key={item.id} className="bg-white-pure rounded-xl overflow-hidden shadow-feature-card border border-border-line group cursor-pointer">
               <div className="relative aspect-[4/3] bg-surface-dim overflow-hidden">
                 <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.image})` }}></div>
                 
                 {/* Top Badges */}
                 <div className="absolute top-4 left-4">
                   <div className={`${item.badgeColor} text-white-pure text-[10px] font-bold px-3 py-1 rounded shadow-sm`}>
                     {item.badge}
                   </div>
                 </div>
                 <div className="absolute top-4 right-4">
                   <div className="w-8 h-8 rounded-full bg-white-pure/90 flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                     <Heart size={16} />
                   </div>
                 </div>
               </div>

               <div className="p-5">
                 <h3 className="text-brand-orange font-bold text-lg mb-1">{item.price}</h3>
                 <div className="font-semibold text-text-dark text-[15px] mb-1 truncate">{item.name}</div>
                 <div className="text-xs text-text-gray mb-4">{item.location}</div>
                 
                 <div className="flex items-center gap-4 text-xs font-medium text-text-gray pt-4 border-t border-border-line/60">
                   <span className="flex items-center gap-1.5"><BedDouble size={14} /> {item.specs.beds}</span>
                   <span className="flex items-center gap-1.5"><Bath size={14} /> {item.specs.baths}</span>
                   <span className="flex items-center gap-1.5"><Scaling size={14} /> {item.specs.size} m²</span>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-brand-blue py-20 px-6 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue-light/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue-light/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-3xl mx-auto text-center relative z-10 text-white-pure">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Siap Menemukan Rumah Impian?</h2>
          <p className="text-blue-100 text-[15px] max-w-lg mx-auto mb-10">
            Daftarkan diri Anda sekarang dan dapatkan rekomendasi properti terbaik langsung ke inbox Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/daftar" className="btn-orange">
              Mulai Sekarang →
            </Link>
            <Link href="/about" className="bg-white-pure text-brand-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
