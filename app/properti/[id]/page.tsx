'use client';

import React, { useState, use } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import {
  MapPin, BedDouble, Bath, Scaling, CheckCircle2,
  Phone, CalendarHeart, Share2, Bookmark, Award,
  Zap, MessageSquare, ChevronRight, Star, Shield, TrendingUp,
  Box, Eye, Info, FileText, Layout, Navigation, HelpCircle,
  Home, TrainFront, School, Hospital, ShoppingBag, ArrowUpRight,
  Car, Map as MapIcon, Church, GraduationCap, Calculator, Percent, Wallet, Clock
} from 'lucide-react';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import MapContainer from '@/components/maps/MapContainer';
import { createClient } from '@supabase/supabase-js';

// --- SUPABASE CLIENT ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- KPR CALCULATOR COMPONENT ---
const KPRCalculator = ({ propertyPrice }: { propertyPrice: string }) => {
  const parsePrice = (priceStr: string) => {
    let clean = priceStr.toLowerCase().replace('rp', '').trim();
    let multiplier = 1;

    if (clean.includes('miliar')) {
      multiplier = 1000000000;
      clean = clean.replace('miliar', '').replace(',', '.').trim();
    } else if (clean.includes('juta')) {
      multiplier = 1000000;
      clean = clean.replace('juta', '').replace(',', '.').trim();
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
                <span className="text-text-gray/50">Pinjaman Pokok</span>
                <span className="text-text-dark">{formatCurrency(numericPrice * (1 - dpPercent/100))}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-gray/50">Suku Bunga</span>
                <span className="text-brand-blue">{currentRate}% Efektif</span>
              </div>
              
              <button suppressHydrationWarning className="w-full bg-brand-blue text-white-pure py-4 rounded-xl font-bold text-sm shadow-xl shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all mt-4 flex items-center justify-center gap-3 active:scale-95 group/cta">
                <MessageSquare size={18} />
                Ajukan KPR via PropNest
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

// --- DATA UNTUK NEAREST FACILITIES ---
const NEAREST_DATA = {
  transport: [
    { name: 'Stasiun MRT Arjuna Selatan', time: '2 Menit', dist: '809 m' },
    { name: 'Stasiun MRT Tanjung Duren', time: '2 Menit', dist: '818 m' },
    { name: 'Cititrans Central Park', time: '2 Menit', dist: '1 km' },
    { name: 'Stasiun MRT Tomang', time: '2 Menit', dist: '1,1 km' },
    { name: 'Pangkalan Blue Bird Central Park Lobby Laguna', time: '2 Menit', dist: '1,2 km' },
  ],
  school: [
    { name: 'SD Negeri 01 Ungaran', time: '5 Menit', dist: '1.2 km' },
    { name: 'SMP Negeri 1 Ungaran', time: '8 Menit', dist: '2.5 km' },
    { name: 'SMA Negeri 1 Ungaran', time: '10 Menit', dist: '3.1 km' },
  ],
  shopping: [
    { name: 'Mall Ciputra Semarang', time: '15 Menit', dist: '12 km' },
    { name: 'Pasar Bandarjo', time: '5 Menit', dist: '2.2 km' },
    { name: 'Indomaret Fresh', time: '2 Menit', dist: '400 m' },
  ],
  health: [
    { name: 'RSUD dr. Gondo Suwarno', time: '12 Menit', dist: '4.5 km' },
    { name: 'Puskesmas Ungaran', time: '5 Menit', dist: '1.8 km' },
  ],
  tourism: [
    { name: 'Watu Gunung Ungaran', time: '15 Menit', dist: '6 km' },
    { name: 'The Fountain Water Park', time: '10 Menit', dist: '4.2 km' },
  ],
  worship: [
    { name: 'Masjid Agung Al-Mabrur', time: '5 Menit', dist: '1.5 km' },
    { name: 'Gereja Kristus Raja', time: '7 Menit', dist: '2 km' },
  ]
};

// --- INQUIRY MODAL COMPONENT ---
const InquiryModal = ({ isOpen, onClose, propertyName, propertyId }: { isOpen: boolean, onClose: () => void, propertyName: string, propertyId: string }) => {
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
        status: 'new'
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
                  <Box size={20} className="rotate-45" />
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

// --- CHATBOT COMPONENT ---
type Message = {
  role: 'ai' | 'user';
  text: string;
  buttons?: { label: string; action: string }[];
  type?: 'loading' | 'text';
};

const AIChatbot = ({ isOpen, setIsOpen, onFilter }: { isOpen: boolean, setIsOpen: (v: boolean) => void, onFilter?: (budget?: number) => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: 'Halo! Saya PropNest AI. Apa yang bisa saya bantu hari ini?',
      buttons: [
        { label: '🏠 Cari Properti', action: 'intent_cari' },
        { label: '💰 Simulasi KPR', action: 'intent_kpr' },
        { label: '📅 Jadwal Survei', action: 'intent_jadwal' },
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flowStep, setFlowStep] = useState<'welcome' | 'cari_budget' | 'lead_name' | 'lead_phone' | 'done'>('welcome');
  const [leadData, setLeadData] = useState({ name: '', phone: '', intent: '' });

  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);

  const handleAction = (action: string, label: string) => {
    addMessage({ role: 'user', text: label });
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (action === 'intent_cari') {
        addMessage({ 
          role: 'ai', 
          text: 'Siap! Kamu cari properti dengan budget sekitar berapa?',
          buttons: [
            { label: '< 1 Miliar', action: 'filter_1m' },
            { label: '1 - 2 Miliar', action: 'filter_2m' },
            { label: '> 2 Miliar', action: 'filter_high' },
          ]
        });
        setFlowStep('cari_budget');
      } else if (action === 'intent_kpr') {
        addMessage({ role: 'ai', text: 'Tentu. Berdasarkan harga unit ini, cicilan estimasi kamu adalah sekitar Rp 6-8 Juta/bulan dengan DP 20%. Mau simulasi lebih detail?' });
      } else if (action === 'intent_jadwal') {
        addMessage({ role: 'ai', text: 'Boleh banget! Siapa nama lengkap kamu biar agen kami bisa catat di jadwal?' });
        setFlowStep('lead_name');
        setLeadData(prev => ({ ...prev, intent: 'Jadwal Survei' }));
      } else if (action.startsWith('filter_')) {
        let budget = 0;
        if (action === 'filter_1m') budget = 1000000000;
        if (action === 'filter_2m') budget = 2000000000;
        if (action === 'filter_high') budget = 5000000000;
        
        if (onFilter) onFilter(budget);
        
        addMessage({ 
          role: 'ai', 
          text: `Oke, list "Properti Serupa" di bawah sudah saya sesuaikan ya! Boleh minta nomor WhatsApp kamu biar saya kirimkan daftar unit lainnya?` 
        });
        setFlowStep('lead_phone');
      }
    }, 800);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    addMessage({ role: 'user', text: userText });
    setInput('');
    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      if (flowStep === 'lead_name') {
        setLeadData(prev => ({ ...prev, name: userText }));
        addMessage({ role: 'ai', text: `Salam kenal, ${userText}! Sekarang boleh minta nomor HP/WhatsApp aktif kamu?` });
        setFlowStep('lead_phone');
      } else if (flowStep === 'lead_phone') {
        const phone = userText;
        addMessage({ role: 'ai', text: 'Terima kasih! Data sudah saya simpan di CRM. Tim kami akan segera menghubungi kamu ya. 🙏' });
        
        // Save to CRM
        try {
          await supabase.from('leads').insert([{
            name: leadData.name || 'User AI Chat',
            phone: phone,
            intent: leadData.intent || 'Chat Query',
            message: `User sedang cari properti via AI: ${userText}`,
            status: 'new'
          }]);
        } catch (e) { console.error(e); }
        
        setFlowStep('done');
      } else {
        addMessage({ 
          role: 'ai', 
          text: 'Maaf, saya sedang belajar. Tapi saya bisa bantu simulasi KPR atau cari properti lho! Coba pilih menu di bawah ya.' ,
          buttons: [
            { label: '🏠 Cari Properti', action: 'intent_cari' },
            { label: '💰 Simulasi KPR', action: 'intent_kpr' },
            { label: '📅 Jadwal Survei', action: 'intent_jadwal' },
          ]
        });
      }
    }, 1000);
  };

  return (
    <>
      {/* FAB */}
      <button suppressHydrationWarning onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[900] w-16 h-16 bg-brand-blue text-white-pure rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-blue-deep scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
        <Zap size={24} className="relative z-10 animate-pulse" fill="currentColor" />
        <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-blue/30 rounded-full animate-ping"></div>
      </button>

      {/* Chat Drawer */}
      <div className={`fixed bottom-28 right-8 z-[900] w-full max-w-[360px] bg-white-pure rounded-[2rem] shadow-2xl border border-border-line/30 flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="p-6 border-b border-border-line/20 bg-gradient-to-r from-brand-blue to-brand-blue-deep text-white-pure rounded-t-[2rem]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white-pure/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <div className="font-bold text-sm tracking-tight">PropNest AI</div>
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Assistant Concept
                </div>
              </div>
            </div>
            <button suppressHydrationWarning onClick={() => setIsOpen(false)} className="p-1 hover:bg-white-pure/10 rounded-lg">
              <Box size={18} className="rotate-45" />
            </button>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-surface-gray/30">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-brand-blue text-white-pure rounded-tr-none' 
                  : 'bg-white-pure text-text-dark border border-border-line/20 rounded-tl-none shadow-sm'
              }`}>
                {m.text}
              </div>
              
              {m.buttons && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {m.buttons.map((btn, bi) => (
                    <button 
                      key={bi}
                      onClick={() => handleAction(btn.action, btn.label)}
                      className="bg-white-pure border border-brand-blue/30 text-brand-blue px-3 py-1.5 rounded-full text-[10px] font-bold hover:bg-brand-blue hover:text-white-pure transition-all shadow-sm active:scale-95"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white-pure px-4 py-3 rounded-2xl rounded-tl-none border border-border-line/20 shadow-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-brand-blue/40 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-brand-blue/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white-pure rounded-b-[2rem]">
          <div className="relative">
            <input 
              type="text" 
              placeholder={flowStep === 'lead_phone' ? 'Ketik nomor WA kamu...' : 'Tanya info properti...'}
              className="w-full bg-surface-gray/50 border border-border-line/30 rounded-xl pl-4 pr-12 py-3 text-xs outline-none focus:border-brand-blue/50 transition-all font-medium"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button suppressHydrationWarning onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-blue text-white-pure rounded-lg hover:bg-brand-blue-deep transition-all">
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default function DetailPropertiPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const property = MOCK_PROPERTIES.find(p => p.id === id);

  const [activeTab, setActiveTab] = useState<'transport' | 'school' | 'shopping' | 'health' | 'tourism' | 'worship'>('transport');
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState<number | null>(null);

  if (!property) {
    notFound();
  }

  const parseNumPrice = (p: string) => {
    let clean = p.replace('Rp', '').trim();
    if (clean.includes('Miliar')) return parseFloat(clean) * 1000000000;
    if (clean.includes('Juta')) return parseFloat(clean) * 1000000;
    return parseFloat(clean.replace(/\./g, ''));
  };

  const relatedProperties = MOCK_PROPERTIES
    .filter(p => p.id !== id)
    .filter(p => !budgetFilter || parseNumPrice(p.price) <= budgetFilter)
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
    <div className="bg-white-pure min-h-screen pt-24 font-sans selection:bg-brand-blue/10 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-blue/3 rounded-full blur-[100px] -ml-48"></div>
      </div>

      <Navbar />

      <main className="container-standard py-6 relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-text-gray/60 font-medium">
            <Link href="/" className="hover:text-brand-blue transition-colors">Beranda</Link>
            <ChevronRight size={10} />
            <Link href="/cari" className="hover:text-brand-blue transition-colors">Properti</Link>
            <ChevronRight size={10} />
            <span className="text-text-dark font-semibold">{property.location.split(',')[0]}</span>
          </div>
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
              <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-[5s] ease-out" style={{ backgroundImage: `url('${property.gallery?.[0] || property.image}')` }}></div>
            </div>

            <div className="flex gap-4 h-[40%]">
              <div className="relative rounded-[1.5rem] overflow-hidden group flex-1 shadow-lg border border-white-pure/20">
                <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-[5s] ease-out" style={{ backgroundImage: `url('${property.gallery?.[1] || property.image}')` }}></div>
              </div>
              <div className="relative rounded-[1.5rem] overflow-hidden group flex-1 shadow-lg border border-white-pure/20">
                <div className="absolute inset-0 bg-cover bg-center hover:scale-110 transition-transform duration-[5s] ease-out" style={{ backgroundImage: `url('${property.gallery?.[2] || property.image}')` }}></div>
                <div className="absolute inset-0 bg-black-pure/40 backdrop-blur-[1px] flex items-center justify-center cursor-pointer hover:bg-black-pure/60 transition-all duration-500">
                  <div className="text-center group-hover:scale-110 transition-transform flex flex-col items-center">
                    <div className="bg-white-pure/20 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white-pure/30">
                      <Eye size={14} className="text-white-pure" />
                      <span className="text-white-pure font-semibold text-[10px] uppercase tracking-wider">Lihas Semua Foto</span>
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
              <button suppressHydrationWarning className="flex items-center gap-2 px-5 py-3 bg-white-pure border border-border-line/60 rounded-xl text-xs font-medium text-text-dark hover:bg-blue-50 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm active:scale-95 ring-1 ring-border-line/5">
                <Share2 size={16} className="text-brand-blue" /> Bagikan
              </button>
              <button suppressHydrationWarning className="flex items-center gap-2 px-5 py-3 bg-white-pure border border-border-line/60 rounded-xl text-xs font-semibold text-text-dark hover:bg-blue-50 hover:text-brand-blue hover:border-brand-blue/30 transition-all shadow-sm active:scale-95 ring-1 ring-border-line/5">
                <Bookmark size={16} className="text-brand-blue" /> Simpan
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

            {/* 5. Nearest Location */}
            <div>
              <h2 className="text-lg font-semibold text-text-dark mb-6">Nearest Location</h2>

              <div className="flex items-center gap-3 overflow-x-auto py-4 -mx-4 px-4 scrollbar-hide no-scrollbar">
                {tabs.map((tab) => (
                  <button suppressHydrationWarning key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border-2 whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
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
                {NEAREST_DATA[activeTab].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-5 border-b border-border-line/30 last:border-0 hover:bg-surface-gray/30 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="text-[15px] font-medium text-text-dark pr-4">{item.name}</div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="flex items-center gap-2 text-text-gray/70">
                        <Car size={16} />
                        <span className="text-sm font-medium">{item.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-gray/40">
                        <span className="w-1 h-1 rounded-full bg-current"></span>
                      </div>
                      <div className="flex items-center gap-2 text-text-gray/70">
                        <MapPin size={16} />
                        <span className="text-sm font-medium">{item.dist}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* 7. KPR Calculator (Simulasi Cicilan) */}
            <KPRCalculator propertyPrice={property.price} />
          </div>

          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white-pure rounded-[2.5rem] border border-border-line/40 p-6 shadow-premium sticky top-24 ring-1 ring-border-line/20">

              <div className="mb-6 p-6 bg-[#F8F9FD] rounded-[2rem] border border-brand-blue/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-text-gray/50 mb-2">Harga Jual Properti</div>
                <div className="text-3xl font-display font-medium text-text-dark tracking-tight">{property.price}</div>
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
                  <div className="w-12 h-12 rounded-xl bg-cover bg-center shadow-md grow-0 shrink-0 border border-white-pure group-hover:scale-110 transition-transform duration-300" style={{ backgroundImage: `url('${property.agent?.avatar || 'https://ui-avatars.com/api/?name=Agent+PropNest&background=random'}')` }}></div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white-pure p-1 rounded-full border-2 border-white-pure">
                    <Shield size={8} fill="currentColor" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-text-dark text-sm tracking-tight">{property.agent?.name || 'Agen PropNest Resmi'}</div>
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

              {/* AIChatbot Sidebar Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-brand-blue to-brand-blue-deep rounded-3xl text-white-pure relative overflow-hidden group shadow-lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white-pure/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white-pure/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <h3 className="text-sm font-bold mb-2">Punya pertanyaan?</h3>
                  <p className="text-[10px] opacity-80 mb-4 leading-relaxed">Tanyakan langsung ke PropNest AI untuk info detail properti ini.</p>
                  <button suppressHydrationWarning onClick={() => setIsChatOpen(true)} className="w-full bg-white-pure text-brand-blue py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all">
                    Mulai Chat AI
                  </button>
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
                    <p className="text-base font-bold text-text-dark">{item.price}</p>
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
      <AIChatbot 
        isOpen={isChatOpen} 
        setIsOpen={setIsChatOpen} 
        onFilter={(budget) => setBudgetFilter(budget || null)}
      />
    </div>
  );
}
