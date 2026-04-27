'use client';

import React, { useState, use, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, BedDouble, Bath, Scaling, CheckCircle2,
  Phone, CalendarHeart, Share2, Bookmark, Award,
  Zap, MessageSquare, ChevronRight, Star, Shield, TrendingUp,
  Box, Eye, Info, FileText, Layout, Navigation, HelpCircle,
  Home, TrainFront, School, Hospital, ShoppingBag, ArrowUpRight,
  Car, Map as MapIcon, Church, GraduationCap, Calculator, Percent, Wallet, Clock, ArrowLeft,
  Loader2, X, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { notFound, useRouter } from 'next/navigation';
import MapContainer from '@/components/maps/MapContainer';
import { createClient } from '@/lib/supabase/client';
import { useNearbyPlaces } from '@/hooks/useNearbyPlaces';
import NusaEstateAI from '@/components/dashboard/NusaEstateAI';

// --- KPR CALCULATOR COMPONENT ---
const KPRCalculator = ({ propertyPrice, onInquiry }: { propertyPrice: string, onInquiry: () => void }) => {
  const parsePrice = (priceStr: string) => {
    let clean = priceStr.toLowerCase().replace('rp', '').trim();
    let multiplier = 1;

    if (clean.includes('miliar') || clean.includes(' m')) {
      multiplier = 1000000000;
      clean = clean.replace('miliar', '').replace(' m', '').replace(',', '.').trim();
    } else if (clean.includes('juta') || clean.includes(' jt')) {
      multiplier = 1000000;
      clean = clean.replace('juta', '').replace(' jt', '').replace(',', '.').trim();
    } else {
      // Handle full numbers like Rp 2.500.000.000
      clean = clean.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '');
    }

    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val * multiplier;
  };

  const numericPrice = parsePrice(propertyPrice);
  
  const [dpPercent, setDpPercent] = useState(20);
  const [tenor, setTenor] = useState(15);
  const [selectedBank, setSelectedBank] = useState('bca');
  
  const banks = [
    { id: 'bca', name: 'BCA', rate: 3.85, logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
    { id: 'mandiri', name: 'Mandiri', rate: 4.25, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
    { id: 'btn', name: 'BTN', rate: 3.99, logo: 'https://asset.kompas.com/crops/-ZknGfO22Go2aOGjJRUfnoL7RIw=/0x0:0x0/1200x800/data/photo/2024/03/03/65e4402c20cbf.jpeg' },
    { id: 'cimb', name: 'CIMB Niaga', rate: 4.10, logo: 'https://pinterpoin.com/wp-content/uploads/2020/10/1355px-CIMB_Niaga_logo.svg_.png' },
    { id: 'bri', name: 'BRI', rate: 4.40, logo: 'https://cdn.freelogovectors.net/wp-content/uploads/2023/02/bri-logo-freelogovectors.net_.png' },
    { id: 'bni', name: 'BNI', rate: 4.50, logo: 'https://i.pinimg.com/originals/36/38/43/36384348ef9d7bfff66da6da9e975d56.png' },
    { id: 'ocbc', name: 'OCBC', rate: 4.30, logo: 'https://uxconsulting.com.sg/wp-content/uploads/2017/09/ocbc-logo-1125x654.png' },
    { id: 'panin', name: 'Panin', rate: 4.60, logo: 'http://3.bp.blogspot.com/-05SbvsauCaE/UNk15orRHII/AAAAAAAAEVU/pC38Ga3Jza0/s1600/Logo+Bank+Panin.jpg' },
    { id: 'custom', name: 'Manual', rate: 5.0, icon: <Calculator size={16} /> },
  ];

  const currentRate = banks.find(b => b.id === selectedBank)?.rate || 5.0;
  
  const calculateInstallment = () => {
    if (numericPrice <= 0) return 0;
    const loanAmount = numericPrice * (1 - dpPercent / 100);
    const monthlyRate = currentRate / 100 / 12;
    const totalMonths = tenor * 12;
    
    if (monthlyRate === 0) return loanAmount / totalMonths;
    
    const installment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return installment;
  };

  const installment = calculateInstallment();

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white-pure border border-border-line/30 rounded-[2.5rem] p-8 md:p-10 shadow-premium relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-display font-medium text-text-dark mb-2">Simulasi Cicilan KPR</h2>
            <p className="text-xs text-text-gray font-medium opacity-70">Sesuaikan simulasi sesuai budget dan pilih bank favorit Anda.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls */}
          <div className="space-y-10">
            {/* Bank Select */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <label className="text-xs font-bold uppercase tracking-widest text-text-gray/60 block">Pilih Bank</label>
                <div className="text-[10px] font-semibold text-brand-blue animate-pulse">Geser untuk lainnya &rarr;</div>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide no-scrollbar -mx-4 px-6 snap-x snap-mandatory">
                {banks.map((bank) => (
                  <button suppressHydrationWarning key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className={`flex-none flex flex-col items-center justify-center w-32 h-24 rounded-2xl border transition-all duration-300 snap-start ${
                      selectedBank === bank.id 
                        ? 'border-brand-blue bg-white-pure shadow-blue-glow ring-2 ring-brand-blue/5' 
                        : 'border-border-line/40 bg-white-pure hover:border-brand-blue/30'
                    }`}
                  >
                    <div className="w-16 h-8 flex items-center justify-center mb-2">
                      {bank.logo ? (
                        <img 
                          src={bank.logo} 
                          alt={bank.name} 
                          className={`max-w-full max-h-full object-contain transition-all duration-500 ${selectedBank === bank.id ? 'grayscale-0 opacity-100 scale-110' : 'grayscale opacity-60'}`} 
                        />
                      ) : (
                        <div className="text-brand-blue">{bank.icon}</div>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold ${selectedBank === bank.id ? 'text-brand-blue' : 'text-text-gray/50'}`}>
                      {bank.rate}%
                    </span>
                    <span className={`text-[8px] font-medium uppercase tracking-tighter mt-1 ${selectedBank === bank.id ? 'opacity-100' : 'opacity-0'}`}>
                      {bank.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-text-dark font-semibold text-sm">
                    <Wallet size={16} className="text-brand-blue" /> Uang Muka (DP)
                  </div>
                  <div className="text-lg font-bold text-brand-blue">{dpPercent}% <span className="text-[10px] text-text-gray/40 font-medium ml-1">({formatCurrency(numericPrice * (dpPercent/100))})</span></div>
                </div>
                <input 
                  type="range" min="5" max="90" step="5" value={dpPercent}
                  onChange={(e) => setDpPercent(parseInt(e.target.value))}
                  className="w-full h-2 bg-border-line/30 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-text-dark font-semibold text-sm">
                    <Clock size={16} className="text-brand-blue" /> Jangka Waktu (Tenor)
                  </div>
                  <div className="text-lg font-bold text-brand-blue">{tenor} Tahun</div>
                </div>
                <input 
                  type="range" min="1" max="30" step="1" value={tenor}
                  onChange={(e) => setTenor(parseInt(e.target.value))}
                  className="w-full h-2 bg-border-line/30 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-[#F8F9FD] rounded-[2rem] p-8 border border-brand-blue/10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 text-center py-6">
              <div className="inline-flex items-center gap-2 bg-white-pure px-4 py-1.5 rounded-full shadow-sm border border-brand-blue/5 text-[9px] font-black uppercase tracking-widest text-brand-blue mb-6">
                Estimasi Cicilan Bulanan
              </div>
              <div className="text-4xl md:text-5xl font-display font-medium text-text-dark tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                {formatCurrency(installment)}
              </div>
              <p className="text-xs text-text-gray/60 font-medium">Berdasarkan bunga tetap 3-5 tahun pertama.</p>
            </div>

            <div className="space-y-4 pt-8 border-t border-brand-blue/5 relative z-10">
              <div className="flex justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-text-gray/50">
                  Pinjaman Pokok 
                  <div className="group/info relative cursor-help">
                    <Info size={12} className="text-text-gray/30 hover:text-brand-blue transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-text-dark text-white-pure text-[10px] font-medium rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none shadow-xl z-20">
                      Sisa harga rumah yang dipinjam dari bank setelah dikurangi DP.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-text-dark"></div>
                    </div>
                  </div>
                </div>
                <span className="text-text-dark">{formatCurrency(numericPrice * (1 - dpPercent/100))}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-gray/50">Suku Bunga</span>
                <span className="text-brand-blue">{currentRate}% Efektif</span>
              </div>
              
              <button suppressHydrationWarning 
                onClick={onInquiry}
                className="w-full bg-brand-blue text-white-pure py-4 rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all mt-4 flex items-center justify-center gap-3 active:scale-95 group/cta"
              >
                <MessageSquare size={18} />
                Ajukan KPR via NusaEstate
                <ArrowUpRight size={16} className="group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1 transition-transform" />
              </button>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-blue/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- INQUIRY MODAL COMPONENT ---
const InquiryModal = ({ isOpen, onClose, propertyName, propertyId }: { isOpen: boolean, onClose: () => void, propertyName: string, propertyId: string }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: `Halo, saya tertarik dengan unit ${propertyName}. Bisakah saya mendapatkan info lebih lanjut?` });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.from('leads').insert([{
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        property_id: propertyId,
        message: formData.message,
        status: 'Baru'
      }]);

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black-pure/40 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white-pure w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white-pure/20 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-blue-deep"></div>
        
        <div className="p-8">
          {success ? (
            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-display font-medium text-text-dark mb-2">Terima Kasih!</h3>
              <p className="text-text-gray/70 text-sm">Ketertarikan Anda telah kami catat di CRM Developer. Tim kami akan segera menghubungi Anda.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-display font-medium text-text-dark mb-1">Dapatkan Info Detail</h3>
                  <p className="text-xs text-text-gray">Lengkapi form di bawah untuk kami kirimkan brosur & pricelist terbaru.</p>
                </div>
                <button suppressHydrationWarning onClick={onClose} className="p-2 hover:bg-surface-gray rounded-full transition-colors text-text-gray/40">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-gray/60 px-2">Nama Lengkap</label>
                  <input 
                    required type="text" placeholder="Masukkan nama Anda" 
                    className="w-full bg-surface-gray/50 border border-border-line/30 rounded-xl px-4 py-3.5 text-sm focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-gray/60 px-2">WhatsApp / HP</label>
                    <input 
                      required type="tel" placeholder="08..." 
                      className="w-full bg-surface-gray/50 border border-border-line/30 rounded-xl px-4 py-3.5 text-sm focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-gray/60 px-2">Email</label>
                    <input 
                      type="email" placeholder="nama@email.com" 
                      className="w-full bg-surface-gray/50 border border-border-line/30 rounded-xl px-4 py-3.5 text-sm focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-text-gray/60 px-2">Pesan (Opsional)</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-surface-gray/50 border border-border-line/30 rounded-xl px-4 py-3.5 text-sm focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all resize-none"
                    value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <button suppressHydrationWarning disabled={loading}
                  className="w-full bg-brand-blue text-white-pure py-4 rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all mt-6 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white-pure border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <FileText size={18} />
                      Kirim Inquiry CRM
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- END OF COMPONENTS ---

export default function DetailPropertiPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter();
  const { id } = use(params);
  const supabase = createClient();

  // Support both: mock IDs (numeric like '5') and real Supabase UUIDs
  const mockProperty = MOCK_PROPERTIES.find(p => p.id === id);
  const [dbProperty, setDbProperty] = useState<any>(null);
  const [loadingDb, setLoadingDb] = useState(!mockProperty);

  useEffect(() => {
    if (mockProperty) return; // numeric ID → use mock
    async function fetchFromDb() {
      // 1. Fetch Property
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (!propError && propData) {
        // 2. Fetch Agent Profile (Separate to avoid join relationship issues)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, company_name')
          .eq('id', propData.user_id)
          .single();

        const agentProfile = profileData as any;
        
        // Normalize DB record to match the shape the page expects
        setDbProperty({
          id: propData.id,
          name: propData.title,
          location: propData.location,
          price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(propData.price),
          specs: { beds: propData.bedrooms, baths: propData.bathrooms, size: propData.land_area },
          badge: propData.type,
          image: propData.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          gallery: propData.images || [],
          description: propData.description || '',
          features: ['Properti Terverifikasi', `${propData.building_area}m² Luas Bangunan`, propData.price_type === 'Sewa' ? 'Per Tahun' : 'Harga Jual'],
          agent: {
            name: agentProfile?.full_name || 'Agen NusaEstate',
            type: agentProfile?.company_name || 'Developer Resmi',
            avatar: agentProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agentProfile?.full_name || 'AP')}&background=3B5BDB&color=fff`
          },
          coords: propData.lat && propData.lng ? { lat: propData.lat, lng: propData.lng } : { lat: -7.025, lng: 110.320 },
          _raw: propData,
        });
      }
      setLoadingDb(false);
    }
    fetchFromDb();
  }, [id]);

  const property = mockProperty || dbProperty;

  const formatPrice = (price: string | number) => {
    if (!price) return 'Rp 0';
    let num = typeof price === 'number' ? price : 0;
    if (typeof price === 'string') {
      if (price.includes('Miliar') || price.includes('Juta') || price.includes('M')) return price;
      num = parseInt(price.replace(/[^0-9]/g, ''), 10);
    }
    if (isNaN(num) || num === 0) return price.toString();
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1).replace('.0', '')} M`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1).replace('.0', '')} Juta`;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const [activeTab, setActiveTab] = useState<'transport' | 'school' | 'shopping' | 'health' | 'tourism' | 'worship'>('transport');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('nusaestate_bookmarks') || '[]');
      setIsSaved(saved.some((p: any) => p.id === id));
    }
  }, [id]);

  const handleSave = () => {
    if (typeof window === 'undefined') return;
    const saved = JSON.parse(localStorage.getItem('nusaestate_bookmarks') || '[]');
    if (isSaved) {
      const updated = saved.filter((p: any) => p.id !== id);
      localStorage.setItem('nusaestate_bookmarks', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      const propData = {
        id: property.id,
        name: property.name,
        location: property.location,
        price: property.price,
        image: property.image,
        specs: property.specs
      };
      saved.push(propData);
      localStorage.setItem('nusaestate_bookmarks', JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Koordinat properti untuk Nearest Location
  const propLat = property?.coords?.lat ?? null;
  const propLng = property?.coords?.lng ?? null;
  const { data: nearbyData, loading: nearbyLoading } = useNearbyPlaces(propLat, propLng);

  if (loadingDb) {
    return (
      <div className="min-h-screen bg-white-pure flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-text-gray/40">
          <Loader2 size={40} className="animate-spin text-brand-blue/40" />
          <p className="text-sm font-medium">Memuat detail properti...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  // Related: use mock for suggestions (both mock + DB IDs work for suggestions section)
  const relatedProperties = MOCK_PROPERTIES
    .filter(p => p.id !== id)
    .slice(0, 3);

  const tabs = [
    { id: 'transport', label: 'Transportation', icon: <TrainFront size={18} /> },
    { id: 'school', label: 'School', icon: <GraduationCap size={18} /> },
    { id: 'shopping', label: 'Shopping Center', icon: <ShoppingBag size={18} /> },
    { id: 'health', label: 'Healthcare', icon: <Hospital size={18} /> },
    { id: 'tourism', label: 'Tourism', icon: <MapIcon size={18} /> },
    { id: 'worship', label: 'Worship', icon: <Church size={18} /> },
  ];

  return (
    <div className="bg-white-pure min-h-screen pt-[100px] font-sans selection:bg-brand-blue/10 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-blue/3 rounded-full blur-[100px] -ml-48"></div>
      </div>

      <Navbar />

      <main className="container-standard py-6 relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <button 
            suppressHydrationWarning
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-text-gray/60 font-medium hover:text-brand-blue transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-surface-gray/50 flex items-center justify-center group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-all">
              <ArrowLeft size={14} />
            </div>
            Kembali
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 h-[500px] md:h-[650px] relative z-10">
          <div className="relative rounded-[2.5rem] overflow-hidden group h-full shadow-2xl border border-white-pure/20">
            <div className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-[5s] ease-out" style={{ backgroundImage: `url('${property.image}')` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black-pure/30 to-transparent"></div>
            
            <button suppressHydrationWarning className="absolute bottom-8 left-8 flex items-center gap-3 bg-white-pure/10 backdrop-blur-xl border border-white-pure/30 px-6 py-3 rounded-2xl text-white-pure text-sm font-semibold hover:bg-white-pure/20 transition-all shadow-xl group/btn">
              <div className="p-1.5 bg-brand-blue rounded-lg shadow-blue-glow group-hover/btn:scale-110 transition-transform">
                <Box size={16} />
              </div>
              Virtual Tour 360°
            </button>
          </div>

          <div className="flex-col gap-4 h-full hidden md:flex">
            <div className="relative rounded-[2rem] overflow-hidden group h-[60%] shadow-lg border border-white-pure/20">
              <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-[5s] ease-out" style={{ backgroundImage: `url('${property.gallery?.[1] || property.image}')` }}></div>
            </div>

            <div className="flex gap-4 h-[40%]">
              <div className="relative rounded-[1.5rem] overflow-hidden group flex-1 shadow-lg border border-white-pure/20">
                <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-[5s] ease-out" style={{ backgroundImage: `url('${property.gallery?.[2] || property.image}')` }}></div>
              </div>
              <div className="relative rounded-[1.5rem] overflow-hidden group flex-1 shadow-lg border border-white-pure/20">
                <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-[5s] ease-out" style={{ backgroundImage: `url('${property.gallery?.[3] || property.image}')` }}></div>
                <div 
                  className="absolute inset-0 bg-black-pure/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer hover:bg-black-pure/60 transition-all duration-500"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  <div className="text-center group-hover:scale-110 transition-transform flex flex-col items-center">
                    <div className="bg-white-pure/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white-pure/30">
                      <Eye size={14} className="text-white-pure" />
                      <span className="text-white-pure font-semibold text-[10px] uppercase tracking-wider">Lihat Semua Foto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="relative z-10 text-left">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="backdrop-blur-md bg-brand-blue/5 px-3 py-1 rounded-full border border-brand-blue/10 text-[9px] font-bold flex items-center gap-2 text-brand-blue uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
                  {property.badge}
                </div>
                <span className="bg-surface-dim/30 text-text-gray/70 text-[9px] font-semibold px-3 py-1 rounded-full border border-border-line/20 uppercase tracking-widest">SHM Sertifikat</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-display font-medium text-text-dark tracking-tight mb-3 leading-tight">
                {property.name}
              </h1>
              <div className="flex items-center gap-2 text-text-gray">
                <div className="p-1.5 bg-brand-blue/5 rounded-lg text-brand-blue">
                  <MapPin size={16} />
                </div>
                <span className="text-sm md:text-base font-medium tracking-tight opacity-80">{property.location}</span>
              </div>
            </div>

            <div className="flex gap-2.5 relative z-10">
              <button 
                suppressHydrationWarning 
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-3 bg-white-pure border border-border-line/60 rounded-xl text-xs font-medium text-text-dark hover:bg-blue-50 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm active:scale-95 ring-1 ring-border-line/5 w-28 justify-center"
              >
                {isCopied ? <CheckCircle2 size={16} className="text-green-500" /> : <Share2 size={16} className="text-brand-blue" />} 
                {isCopied ? 'Tersalin' : 'Bagikan'}
              </button>
              <button 
                suppressHydrationWarning 
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-3 bg-white-pure border border-border-line/60 rounded-xl text-xs font-semibold hover:bg-blue-50 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm active:scale-95 ring-1 ring-border-line/5 ${isSaved ? 'text-brand-blue' : 'text-text-dark'}`}
              >
                <Bookmark size={16} className="text-brand-blue" fill={isSaved ? "currentColor" : "none"} /> 
                {isSaved ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-12">
            
            {/* 1. High-End horizontal Specs Highlight - Replicating Reference Image 2 */}
            <div className="bg-white-pure rounded-[2rem] border border-border-line/30 p-8 md:p-10 shadow-premium ring-1 ring-border-line/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
              
              {/* Kamar Tidur */}
              <div className="flex flex-col items-center flex-1 relative cursor-default">
                <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue mb-4">
                  <BedDouble size={24} />
                </div>
                <div className="text-[10px] text-text-gray/50 font-black uppercase tracking-[0.2em] mb-1.5">Kamar Tidur</div>
                <div className="text-xl font-bold text-text-dark">{property.specs.beds} Unit</div>
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-border-line/20"></div>
              </div>

              {/* Kamar Mandi */}
              <div className="flex flex-col items-center flex-1 relative cursor-default">
                <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue mb-4">
                  <Bath size={24} />
                </div>
                <div className="text-[10px] text-text-gray/50 font-black uppercase tracking-[0.2em] mb-1.5">Kamar Mandi</div>
                <div className="text-xl font-bold text-text-dark">{property.specs.baths} Unit</div>
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-border-line/20"></div>
              </div>

              {/* Luas Tanah */}
              <div className="flex flex-col items-center flex-1 cursor-default">
                <div className="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue mb-4">
                  <Scaling size={24} />
                </div>
                <div className="text-[10px] text-text-gray/50 font-black uppercase tracking-[0.2em] mb-1.5">Luas Tanah</div>
                <div className="text-xl font-bold text-text-dark">{property.specs.size} m²</div>
              </div>
            </div>

            {/* 2. Deskripsi Section - Replicating Reference Image 1 style */}
            <div>
              <h2 className="text-xl font-semibold text-text-dark mb-4">Deskripsi</h2>
              <div className="text-text-gray/80 leading-relaxed text-sm font-medium max-w-4xl space-y-4">
                <p>
                  {property.description || 'Hunian modern minimalis berlokasi strategis di kawasan Ungaran, Semarang. Didesain dengan konsep open-plan living yang memaksimalkan pencahayaan alami dan sirkulasi udara.'}
                </p>
                <p>
                  Setiap sudut ruangan dirancang dengan material berkualitas tinggi, memastikan estetika modern bertemu dengan ketahanan jangka panjang. Cocok untuk kenyamanan penghuni keluarga dinamis.
                </p>
              </div>
            </div>

            {/* 3. Fasilitas Section - Replicating Reference Image 1 style */}
            <div>
              <h2 className="text-xl font-semibold text-text-dark mb-6">Fasilitas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {[
                  'Smart Home System', 'Carport 2 Mobil',
                  'Taman Belakang Private', 'Dapur Island',
                  'Kamar Mandi Rainfall Shower', 'CCTV & Keamanan 24 Jam',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-text-gray/90 font-medium cursor-default">
                    <div className="p-1 rounded-full bg-brand-blue/10 text-brand-blue">
                      <CheckCircle2 size={16} />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Lokasi Properti */}
            <div className="space-y-4 pt-4">
              <h2 className="text-lg font-display font-semibold text-text-dark mb-6">
                Lokasi Properti
              </h2>
              <div className="relative w-full h-[350px] rounded-[2.5rem] overflow-hidden border border-border-line/50 shadow-premium bg-surface-dim">
                <MapContainer properties={[property]} />
                <div className="absolute top-4 left-4 z-[400] bg-white-pure/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20 text-[10px] font-semibold text-brand-blue flex items-center gap-2">
                  <Navigation size={12} fill="currentColor" /> {property.location}
                </div>
              </div>
            </div>

            {/* 5. Nearest Location - Real Data from OpenStreetMap */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-dark">Nearest Location</h2>
                {propLat && propLng ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Data Real dari OpenStreetMap
                  </div>
                ) : (
                  <div className="text-[10px] text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    Tambahkan koordinat untuk data real
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 overflow-x-auto py-4 -mx-4 px-4 scrollbar-hide no-scrollbar">
                {tabs.map((tab) => (
                  <button suppressHydrationWarning key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border-2 whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border-brand-blue bg-white-pure text-brand-blue font-semibold scale-105 shadow-md shadow-brand-blue/5'
                        : 'border-border-line/40 text-text-gray/70 font-medium hover:border-border-line hover:text-text-dark shadow-sm bg-white-pure'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-brand-blue' : 'text-text-gray/60'}>
                      {tab.icon}
                    </span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-white-pure rounded-3xl border border-border-line/20 overflow-hidden">
                {nearbyLoading ? (
                  // Loading skeleton
                  <div className="space-y-0">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-5 border-b border-border-line/20 last:border-0">
                        <div className="h-4 bg-surface-gray rounded-lg w-48 animate-pulse" />
                        <div className="flex gap-4">
                          <div className="h-4 bg-surface-gray rounded-lg w-20 animate-pulse" />
                          <div className="h-4 bg-surface-gray rounded-lg w-16 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : nearbyData[activeTab].length > 0 ? (
                  nearbyData[activeTab].map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-5 border-b border-border-line/30 last:border-0 hover:bg-surface-gray/30 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="text-[15px] font-medium text-text-dark pr-4 truncate max-w-[60%]">{item.name}</div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="flex items-center gap-2 text-text-gray/70">
                          <Car size={16} />
                          <span className="text-sm font-medium">{item.timeLabel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-gray/40">
                          <span className="w-1 h-1 rounded-full bg-current" />
                        </div>
                        <div className="flex items-center gap-2 text-text-gray/70">
                          <MapPin size={16} />
                          <span className="text-sm font-medium">{item.distLabel}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty state — tidak ada data atau koordinat tidak diisi
                  <div className="py-12 flex flex-col items-center text-center text-text-gray/40">
                    <MapPin size={32} className="mb-3 text-brand-blue/20" />
                    <p className="text-sm font-medium">
                      {propLat && propLng
                        ? 'Tidak ada fasilitas terdekat yang ditemukan'
                        : 'Koordinat belum diatur oleh developer'}
                    </p>
                    <p className="text-xs mt-1">
                      {propLat && propLng
                        ? 'Coba kategori lain'
                        : 'Developer perlu mengisi Latitude & Longitude saat menambah properti'}
                    </p>
                  </div>
                )}
              </div>
            </div>


            {/* 7. KPR Calculator (Simulasi Cicilan) */}
            <KPRCalculator propertyPrice={property.price} onInquiry={() => setIsInquiryOpen(true)} />
          </div>

          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white-pure rounded-[2.5rem] border border-border-line/40 p-6 shadow-premium sticky top-24 ring-1 ring-border-line/20">

              <div className="mb-6 p-6 bg-[#F8F9FD] rounded-[2rem] border border-brand-blue/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-text-gray/50 mb-2">Harga Jual Properti</div>
                <div className="text-3xl font-display font-medium text-text-dark tracking-tight">{formatPrice(property.price)}</div>
              </div>

              <div className="bg-brand-blue/5 border border-brand-blue/10 text-brand-blue p-4 rounded-xl flex items-start gap-3 mb-6">
                <div className="bg-white-pure p-1.5 rounded-lg shadow-sm">
                  <Zap size={16} fill="currentColor" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight uppercase tracking-wide">High Demand Area!</div>
                  <div className="text-[10px] text-brand-blue/70 mt-1 leading-normal">Rumah di area ini populer, terjual dalam rata-rata 25 hari.</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <button suppressHydrationWarning onClick={() => setIsInquiryOpen(true)}
                  className="w-full bg-brand-blue text-white-pure py-4 rounded-xl font-semibold text-sm shadow-xl hover:bg-brand-blue-deep hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 group/cta"
                >
                  <MessageSquare size={18} className="group-hover/cta:scale-110 transition-transform" /> 
                  Hubungi Agen
                </button>
                <button suppressHydrationWarning onClick={() => setIsInquiryOpen(true)}
                  className="w-full bg-white-pure border-2 border-brand-blue text-brand-blue hover:bg-blue-50 py-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 active:scale-95 group/cta"
                >
                  <CalendarHeart size={18} className="group-hover/cta:scale-110 transition-transform" /> 
                  Atur Jadwal Survei
                </button>
              </div>

              <div className="bg-white-pure border border-border-line/40 p-4 rounded-2xl flex items-center gap-4 hover:bg-surface-gray transition-colors group mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-cover bg-center shadow-md grow-0 shrink-0 border border-white-pure group-hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url('${property.agent?.avatar || 'https://ui-avatars.com/api/?name=Agent+NusaEstate&background=random'}')` }}></div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white-pure p-1 rounded-full border-2 border-white-pure">
                    <Shield size={8} fill="currentColor" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-text-dark text-sm tracking-tight">{property.agent?.name || 'Agen NusaEstate Resmi'}</div>
                  <div className="text-[9px] text-text-gray font-black uppercase tracking-widest mt-0.5">{property.agent?.type || 'Senior Consultant'}</div>
                </div>
              </div>

              {/* Buying Guide - Replicated in Sidebar */}
              <div className="border-t border-border-line/30 pt-6 mt-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-brand-blue/5 rounded-lg text-brand-blue">
                    <HelpCircle size={14} />
                  </div>
                  <h3 className="text-sm font-bold text-text-dark uppercase tracking-wide">Panduan Pembelian</h3>
                </div>

                <div className="space-y-8 relative ml-3 border-l-2 border-brand-blue/10 pl-6">
                  {[
                    { title: 'Survei & Konsultasi', desc: 'Cek unit & lingkungan langsung.' },
                    { title: 'Booking', desc: 'Amankan unit pilihan Anda.' },
                    { title: 'Pengajuan KPR', desc: 'Verifikasi kelayakan bank.' },
                    { title: 'Serah Terima', desc: 'Akad & penyerahan kunci.' },
                  ].map((step, idx) => (
                    <div key={idx} className="relative group/step">
                      <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-white-pure border-2 border-brand-blue flex items-center justify-center text-[10px] font-bold text-brand-blue group-hover/step:bg-brand-blue group-hover/step:text-white-pure transition-all">
                        {idx + 1}
                      </div>
                      <h4 className="text-[12px] font-bold text-text-dark mb-0.5 group-hover/step:text-brand-blue transition-colors">{step.title}</h4>
                      <p className="text-[10px] text-text-gray/70 leading-normal">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>



            </div>
          </aside>

        </div>

        <section className="mt-24 pt-20 border-t border-border-line/40">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-brand-blue text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Rekomendasi</p>
              <h2 className="text-3xl font-display font-medium text-text-dark">Properti Serupa Lainnya</h2>
            </div>
            <Link href="/cari" className="flex items-center gap-2 text-xs font-semibold text-text-dark hover:text-brand-blue transition-colors group">
              Lihat Semua <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {relatedProperties.map((item) => (
              <Link
                key={item.id}
                href={`/properti/${item.id}`}
                className="group relative flex flex-col transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft group-hover:shadow-md transition-all duration-700">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[3s]" style={{ backgroundImage: `url(${item.image})` }}></div>
                  <div className="absolute top-4 left-4 backdrop-blur-md bg-white-pure/90 px-3 py-1.5 rounded-full shadow-premium border border-white/20 text-[10px] font-semibold flex items-center gap-2 text-brand-blue">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
                    {item.badge}
                  </div>
                </div>

                <div className="relative -mt-10 mx-3 bg-white-pure rounded-xl p-4 shadow-premium border border-border-line/20 group-hover:border-brand-blue/30 transition-all duration-500 z-10">
                  <h3 className="text-[15px] font-semibold text-text-dark truncate mb-1 pr-2">{item.name}</h3>
                  <p className="flex items-center gap-1.5 text-[10px] text-text-gray font-medium">
                    <MapPin size={12} className="text-brand-blue" />
                    <span className="truncate">{item.location}</span>
                  </p>
                  <div className="my-3 border-t border-border-line/20"></div>
                  <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-text-dark">{formatPrice(item.price)}</p>
                    <div className="flex gap-3 text-[10px] text-text-gray font-medium">
                      <span className="flex items-center gap-1"><BedDouble size={14} className="text-brand-blue/60" /> {item.specs.beds}</span>
                      <span className="flex items-center gap-1"><Bath size={14} className="text-brand-blue/60" /> {item.specs.baths}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <div className="mt-20">
        <Footer />
      </div>

      {/* NEW COMPONENTS */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        propertyName={property.name}
        propertyId={property.id}
      />
      {/* NusaEstate AI with full property context */}
      <NusaEstateAI
        pageContext={{
          page: 'properti',
          developer_id: property._raw?.user_id || null,
          property: {
            title: property.name,
            location: property.location,
            price: property.price,
            type: property.badge,
            bedrooms: property.specs?.beds,
            bathrooms: property.specs?.baths,
            land_area: property.specs?.size,
            building_area: property._raw?.building_area,
          },
          lat: propLat,
          lng: propLng,
        }}
        onAction={(action) => {
          if (action === 'TRIGGER_INQUIRY') {
            setIsInquiryOpen(true);
          }
        }}
      />

      {/* Photo Explorer Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[1000] bg-surface-gray/30 flex flex-col animate-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <header className="flex-none h-16 border-b border-border-line flex items-center justify-between px-4 lg:px-8 bg-white-pure sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 hover:bg-surface-gray rounded-full transition-colors shrink-0"
              >
                <ArrowLeft size={20} className="text-text-dark" />
              </button>
              <div className="truncate flex items-center gap-4">
                <h2 className="text-sm font-medium text-text-dark truncate hidden sm:block">{property.name}</h2>
                <p className="text-brand-blue font-semibold text-sm">{formatPrice(property.price)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleShare} className="p-2.5 hover:bg-surface-gray rounded-full transition-colors text-text-dark">
                {isCopied ? <CheckCircle2 size={18} className="text-green-500" /> : <Share2 size={18} />}
              </button>
              <button onClick={handleSave} className="p-2.5 hover:bg-surface-gray rounded-full transition-colors text-text-dark">
                <Bookmark size={18} className={isSaved ? "text-brand-blue" : ""} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Categories (lg up) */}
            <aside className="hidden lg:block w-72 border-r border-border-line bg-white-pure overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Category Item */}
                <button className="w-full text-left group">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-brand-blue ring-4 ring-brand-blue/10 mb-3">
                    <img src={property.image} alt="Semua Foto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-white-pure/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-lg text-brand-blue shadow-sm">
                      {property.gallery?.length || 0}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-brand-blue">Semua Foto</span>
                </button>
              </div>
            </aside>

            {/* Photo Grid */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 hide-scrollbar bg-white-pure">
              <div className="max-w-5xl mx-auto">
                <h3 className="text-lg font-bold text-text-dark mb-6 lg:hidden">Semua Foto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                  {(property.gallery || []).map((img, idx) => {
                    let colSpan = 'col-span-1 md:col-span-2';
                    let aspect = 'aspect-[4/3] md:aspect-square lg:aspect-[4/3]';
                    
                    if (idx === 0 || idx === 1) {
                      colSpan = 'col-span-1 sm:col-span-1 md:col-span-3';
                      aspect = 'aspect-[4/3] md:aspect-square lg:aspect-[4/3]';
                    } else if (idx >= 2 && idx <= 4) {
                      colSpan = 'col-span-1 sm:col-span-1 md:col-span-2';
                      aspect = 'aspect-[4/3] md:aspect-square lg:aspect-[4/3]';
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`relative rounded-2xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow cursor-pointer ${colSpan}`}
                        onClick={() => {
                          setActiveImageIndex(idx);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <img src={img} className={`w-full h-full object-cover ${aspect} group-hover:scale-105 transition-transform duration-700`} alt={`Gallery ${idx}`} />
                        <div className="absolute inset-0 bg-black-pure/0 group-hover:bg-black-pure/10 transition-colors"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Lightbox for Individual Photos */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black-pure/95 backdrop-blur-md animate-in fade-in duration-300">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-8 right-8 text-white-pure/50 hover:text-white-pure transition-colors"
          >
            <X size={32} />
          </button>
          <div className="relative w-full max-w-5xl aspect-video mx-4">
            <img 
              src={(property.gallery || [])[activeImageIndex]} 
              alt="Gallery" 
              className="w-full h-full object-contain rounded-xl"
            />
            <button 
              onClick={() => setActiveImageIndex(prev => prev === 0 ? Math.max(5, (property.gallery?.length || 0) + 1) - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white-pure/10 hover:bg-white-pure/20 text-white-pure rounded-full backdrop-blur-md transition-all shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setActiveImageIndex(prev => prev === Math.max(5, (property.gallery?.length || 0) + 1) - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white-pure/10 hover:bg-white-pure/20 text-white-pure rounded-full backdrop-blur-md transition-all shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
