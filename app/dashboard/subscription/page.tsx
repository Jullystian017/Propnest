'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Check, 
  Zap, 
  Crown, 
  CreditCard, 
  AlertCircle, 
  Calendar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Loader2,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import Script from 'next/script';

const PLANS = [
  {
    id: 'basic',
    name: 'Free Starter',
    price: '0',
    description: 'Cocok untuk developer individu yang baru memulai.',
    features: [
      'Hingga 5 Listing Properti',
      '10 AI Caption / bulan',
      'Standard CRM Leads',
      'KPR Simulator (Embed)',
      'Support via Email'
    ],
    color: 'text-text-gray',
    bg: 'bg-white-pure',
    border: 'border-border-line/10',
    button: 'bg-surface-gray text-text-dark hover:bg-border-line/20',
    icon: Building2
  },
  {
    id: 'pro',
    name: 'Pro Developer',
    price: '299rb',
    period: '/bulan',
    description: 'Pilihan terbaik untuk pengembang properti aktif.',
    features: [
      'Hingga 30 Listing Properti',
      '75 AI Caption / bulan',
      'Pipeline Management',
      'Auto Posting (IG + FB)',
      'Export PDF / Excel',
      'Multi-User (3 user)',
      'Support WA Business'
    ],
    color: 'text-brand-blue',
    bg: 'bg-white-pure',
    border: 'border-brand-blue/20 ring-4 ring-brand-blue/5',
    button: 'bg-brand-blue text-white-pure hover:bg-brand-blue-deep shadow-lg shadow-brand-blue/20',
    icon: Zap,
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium Developer',
    price: '999rb',
    period: '/bulan',
    description: 'Solusi lengkap untuk perusahaan real estate besar.',
    features: [
      'Listing Properti Unlimited',
      'Unlimited AI Caption',
      'Instant WA Lead Alert',
      'Auto Posting (Semua Platform)',
      'Advanced Analytics Dashboard',
      'Laporan Otomatis Mingguan',
      'Multi-User (10 user)',
      'Dedicated WA Support'
    ],
    color: 'text-purple-600',
    bg: 'bg-white-pure',
    border: 'border-purple-200',
    button: 'bg-purple-600 text-white-pure hover:bg-purple-700 shadow-lg shadow-purple-600/20',
    icon: Crown
  }
];

export default function SubscriptionPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { plan, usage, limits, refresh: refreshLimits } = useSubscriptionLimits();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  const handleUpgrade = async (planId: string) => {
    if (planId === profile?.subscription_plan) return;
    if (planId === 'basic') return;

    const message = `Halo Admin NusaEstate, saya ingin upgrade akun saya ke paket ${planId.toUpperCase()}. Mohon dibantu prosesnya.`;
    const waUrl = `https://wa.me/6285798051625?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60rem]">
        <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Current Plan Hero */}
      <div className="bg-white-pure rounded-[3rem] border border-border-line/10 p-10 shadow-xl shadow-brand-blue/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-brand-blue/10 text-brand-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-blue/10">
                Paket Anda Saat Ini
              </div>
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-[10px] font-bold border border-emerald-100">
                <ShieldCheck size={14} />
                AKTIF
              </div>
            </div>
            <h2 className="text-4xl font-display font-bold text-text-dark">
              {PLANS.find(p => p.id === profile?.subscription_plan)?.name || 'Free Starter'}
            </h2>
            <p className="text-text-gray max-w-lg leading-relaxed">
              Anda memiliki akses ke fitur-fitur dasar pemasaran NusaEstate AI. Tingkatkan paket Anda untuk membuka potensi penuh otomasi AI.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-gray flex items-center justify-center text-text-gray">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Perpanjangan Berikutnya</p>
                  <p className="text-sm font-bold text-text-dark">
                    {profile?.subscription_expires_at 
                      ? new Date(profile.subscription_expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-gray flex items-center justify-center text-text-gray">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Metode Pembayaran</p>
                  <p className="text-sm font-bold text-text-dark">Transfer Bank / E-Wallet</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-blue rounded-3xl p-8 text-white-pure shadow-2xl shadow-brand-blue/30 md:w-80">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-white/80" />
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Limit Penggunaan</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Listing Properti</span>
                  <span>{usage.listings} / {limits.listings === 999999 ? '∞' : limits.listings}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (usage.listings / limits.listings) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>AI Generation</span>
                  <span>{usage.aiCaptions} / {limits.aiCaptions === 999999 ? '∞' : limits.aiCaptions}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (usage.aiCaptions / limits.aiCaptions) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold text-text-dark">Pilih Paket Langganan</h2>
          <p className="text-text-gray max-w-2xl mx-auto">Tingkatkan efisiensi pemasaran Anda dengan fitur otomasi AI tercanggih di industri properti.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`${plan.bg} p-8 rounded-[3rem] border ${plan.border} flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white-pure px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-blue/30">
                  Paling Populer
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl ${plan.bg} ${plan.color} flex items-center justify-center mb-6 shadow-xl shadow-current/5 border border-current/10`}>
                  <plan.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-text-dark">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-sm font-medium text-text-gray">Rp</span>
                  <span className="text-4xl font-display font-bold text-text-dark tracking-tight">{plan.price}</span>
                  <span className="text-sm font-medium text-text-gray">{plan.period}</span>
                </div>
                <p className="text-text-gray text-xs mt-4 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.id === 'basic' ? 'bg-surface-gray text-text-gray' : plan.color + ' bg-current/5 border border-current/10'}`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-medium text-text-dark/80">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={isUpdating || profile?.subscription_plan === plan.id}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all text-sm ${
                  profile?.subscription_plan === plan.id 
                    ? 'bg-surface-gray text-text-gray/50 cursor-not-allowed' 
                    : plan.button
                }`}
              >
                {isUpdating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {profile?.subscription_plan === plan.id ? 'Paket Aktif' : 'Pilih Paket'}
                    {profile?.subscription_plan !== plan.id && <ArrowRight size={18} />}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="space-y-10 py-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-display font-bold text-text-dark">Perbandingan Detail Fitur</h2>
          <p className="text-sm text-text-gray">Bandingkan setiap fitur untuk menemukan paket yang paling tepat bagi bisnis Anda.</p>
        </div>

        <div className="bg-white-pure rounded-[2.5rem] border border-border-line/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-gray/30">
                  <th className="p-8 text-sm font-bold text-text-gray uppercase tracking-widest border-b border-border-line/10 w-1/4">Fitur</th>
                  <th className="p-8 text-sm font-bold text-text-dark border-b border-border-line/10 text-center w-1/4">Basic (Gratis)</th>
                  <th className="p-8 text-sm font-bold text-brand-blue border-b border-border-line/10 text-center w-1/4">Pro</th>
                  <th className="p-8 text-sm font-bold text-purple-600 border-b border-border-line/10 text-center w-1/4">Premium</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: 'Harga / bulan', basic: 'Rp 0', pro: 'Rp 299.000', premium: 'Rp 999.000' },
                  { name: 'Jumlah Listing', basic: '5', pro: '30', premium: 'Unlimited' },
                  { name: 'AI Caption Generator', basic: '10x / bulan', pro: '75x / bulan', premium: 'Unlimited' },
                  { name: 'CRM List Leads', basic: true, pro: true, premium: true },
                  { name: 'Pipeline Management', basic: false, pro: true, premium: true },
                  { name: 'Analytics Dashboard', basic: 'Basic', pro: 'Basic', premium: 'Advanced' },
                  { name: 'Automation (Auto Post)', basic: false, pro: '✓ (IG + FB)', premium: '✓ (All Platforms)' },
                  { name: 'Laporan Otomatis', basic: false, pro: false, premium: true },
                  { name: 'Instant WA Lead Alert', basic: false, pro: false, premium: true },
                  { name: 'Export PDF / Excel', basic: false, pro: true, premium: true },
                  { name: 'Multi-User', basic: '1 user', pro: '3 user', premium: '10 user' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-gray/20 transition-colors group">
                    <td className="p-6 font-semibold text-text-dark/80 border-b border-border-line/5 pl-8">{row.name}</td>
                    <td className="p-6 text-center border-b border-border-line/5">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? <Check className="mx-auto text-emerald-500" size={18} /> : <X className="mx-auto text-text-gray/20" size={18} />
                      ) : (
                        <span className="font-medium text-text-gray">{row.basic || '-'}</span>
                      )}
                    </td>
                    <td className="p-6 text-center border-b border-border-line/5">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="mx-auto text-brand-blue" size={18} /> : <X className="mx-auto text-text-gray/20" size={18} />
                      ) : (
                        <span className="font-bold text-brand-blue">{row.pro || '-'}</span>
                      )}
                    </td>
                    <td className="p-6 text-center border-b border-border-line/5 bg-purple-50/10">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="mx-auto text-purple-600" size={18} /> : <X className="mx-auto text-text-gray/20" size={18} />
                      ) : (
                        <span className="font-bold text-purple-600">{row.premium || '-'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-border-line/10"></div>
          <h2 className="text-xl font-bold text-text-dark/40 uppercase tracking-[0.3em]">Layanan Tambahan</h2>
          <div className="h-[1px] flex-1 bg-border-line/10"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white-pure rounded-[2.5rem] border border-border-line/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-xl transition-all duration-500 group">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={36} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-text-dark">Featured Listing</h3>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">BOOST</span>
                </div>
                <p className="text-sm text-text-gray max-w-md leading-relaxed">Posisikan properti Anda di bagian teratas hasil pencarian dan halaman utama selama 30 hari.</p>
              </div>
            </div>
            <div className="text-center md:text-right space-y-4 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-text-gray uppercase tracking-widest block mb-1">Mulai Dari</span>
                <div className="flex items-baseline justify-center md:justify-end gap-1">
                  <span className="text-xs font-medium text-text-gray">Rp</span>
                  <span className="text-3xl font-display font-bold text-text-dark">50rb</span>
                  <span className="text-xs font-medium text-text-gray">/unit</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  const message = "Halo Admin NusaEstate, saya ingin membeli Add-on Featured Listing (50rb). Mohon dibantu prosesnya.";
                  window.open(`https://wa.me/6285798051625?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="px-8 py-3 bg-white-pure border border-brand-blue/20 text-brand-blue rounded-xl font-bold text-sm hover:bg-brand-blue hover:text-white-pure transition-all shadow-sm active:scale-95"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
