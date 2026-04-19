'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, Sparkles, Layout, Zap, Check, Search, Home, Phone, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [role, setRole] = useState<'user' | 'developer' | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        
        // If already has a role, redirect properly
        if (user.user_metadata?.role) {
          if (user.user_metadata?.role === 'developer') {
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }
      }
    }
    checkUser();
  }, [router, supabase]);

  const handleSelectRole = async (selectedRole: 'user' | 'developer') => {
    setRole(selectedRole);
    if (selectedRole === 'user') {
      setIsLoading(true);
      try {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            role: 'user'
          }
        });
        if (updateError) throw updateError;

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'user' })
          .eq('id', user.id);
        
        if (profileError) throw profileError;

        router.push('/');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan.');
        setIsLoading(false);
      }
    } else {
      setStep(2); // Go to Developer form
    }
  };

  const handleCompleteDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // 1. Update User Metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          role: 'developer',
          company_name: companyName,
          phone_number: phoneNumber
        }
      });

      if (updateError) throw updateError;

      // 2. Update Profiles Table (for DB integrity)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_name: companyName, role: 'developer' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setStep(3); // Show success state
      
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Premium Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

      <div className="w-full max-w-[700px] relative z-10 transition-all duration-700">
        
        {step === 1 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-premium p-10 lg:p-14 border border-white/50 animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
            {/* Decorative Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue/40 via-brand-blue to-blue-400"></div>

            <div className="mb-12 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/5 text-brand-blue font-medium text-xs mb-6 border border-brand-blue/10 shadow-sm">
                <Sparkles size={14} className="animate-pulse" />
                <span>Mulai Perjalanan Anda</span>
              </div>
              <h1 className="text-4xl font-display font-semibold text-text-dark mb-4 tracking-tight">
                Pilih Profil Anda
              </h1>
              <p className="text-text-gray font-medium text-base leading-relaxed max-w-md mx-auto">
                Bantu kami menyesuaikan pengalaman terbaik untuk Anda di PropNest AI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 relative z-10">
              {/* Card User */}
              <button
                onClick={() => handleSelectRole('user')}
                disabled={isLoading}
                className="group relative p-8 rounded-[2rem] border-2 border-border-line/40 bg-white hover:border-brand-blue hover:bg-brand-blue/[0.02] hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-500 text-left flex flex-col gap-6 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-surface-gray group-hover:bg-brand-blue group-hover:text-white-pure flex items-center justify-center text-text-gray transition-all duration-500 shadow-sm">
                    <Search size={26} strokeWidth={2} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-gray flex items-center justify-center text-text-gray/50 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={16} />
                  </div>
                </div>
                <div className="relative">
                  <h3 className="font-display font-semibold text-text-dark text-xl mb-2 group-hover:text-brand-blue transition-colors">Pencari Properti</h3>
                  <p className="text-sm text-text-gray font-medium leading-relaxed">Saya ingin mencari, menyewa, atau membeli properti idaman dengan bantuan AI.</p>
                </div>
              </button>

              {/* Card Developer */}
              <button
                onClick={() => handleSelectRole('developer')}
                disabled={isLoading}
                className="group relative p-8 rounded-[2rem] border-2 border-border-line/40 bg-white hover:border-brand-blue hover:bg-brand-blue/[0.02] hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-500 text-left flex flex-col gap-6 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-surface-gray group-hover:bg-brand-blue group-hover:text-white-pure flex items-center justify-center text-text-gray transition-all duration-500 shadow-sm">
                    <Building2 size={26} strokeWidth={2} />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-gray flex items-center justify-center text-text-gray/50 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={16} />
                  </div>
                </div>
                <div className="relative">
                  <h3 className="font-display font-semibold text-text-dark text-xl mb-2 group-hover:text-brand-blue transition-colors">Pemilik / Agen</h3>
                  <p className="text-sm text-text-gray font-medium leading-relaxed">Saya ingin menjual, menyewakan, dan mengelola properti saya di Dashboard canggih.</p>
                </div>
              </button>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
          </div>
        ) : step === 2 ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-premium p-10 lg:p-14 border border-white/50 animate-in fade-in slide-in-from-right-8 duration-500 max-w-[550px] mx-auto relative overflow-hidden">
             {/* Decorative Top Gradient */}
             <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-blue/40 via-brand-blue to-blue-400"></div>

             {/* Back Button */}
             <button 
               onClick={() => setStep(1)} 
               className="absolute top-6 left-6 p-2 rounded-full hover:bg-surface-gray text-text-gray hover:text-text-dark transition-colors flex items-center justify-center group z-20"
               title="Kembali ke pilihan profil"
             >
               <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
             </button>

            <div className="mb-10 text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-blue/10 to-blue-400/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-brand-blue shadow-inner border border-brand-blue/10">
                <Building2 size={36} strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-display font-semibold text-text-dark mb-3 tracking-tight">
                Identitas Bisnis
              </h1>
              <p className="text-text-gray font-medium text-sm leading-relaxed max-w-sm mx-auto">
                Hanya butuh satu langkah lagi untuk mengaktifkan Dashboard AI perusahaan Anda.
              </p>
            </div>

            <form onSubmit={handleCompleteDeveloper} className="space-y-6 relative z-10">
              <div className="space-y-5">
                <Input
                  label="Nama Perusahaan / Agensi"
                  type="text"
                  placeholder="Contoh: PT Graha Sejahtera"
                  icon={Building2}
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-surface-gray border-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium py-4 text-base"
                />
                <Input
                  label="Nomor WhatsApp"
                  type="tel"
                  placeholder="08123456789"
                  icon={Phone}
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-surface-gray border-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium py-4 text-base"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-medium animate-in fade-in">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-4.5 text-base font-semibold shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all" 
                isLoading={isLoading}
              >
                Aktifkan Dashboard <ArrowRight size={20} />
              </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-border-line/30 grid grid-cols-3 gap-4 relative z-10">
               {[
                 { icon: Layout, label: 'CRM Leads' },
                 { icon: Zap, label: 'AI Studio' },
                 { icon: Building2, label: 'Listing' }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-surface-gray group-hover:bg-brand-blue/5 flex items-center justify-center text-text-gray/50 group-hover:text-brand-blue transition-colors">
                      <item.icon size={22} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold text-text-gray/50 group-hover:text-text-gray uppercase tracking-widest transition-colors">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-premium p-14 border border-white/50 text-center animate-in zoom-in-95 fade-in duration-500 max-w-[500px] mx-auto relative overflow-hidden">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 text-white-pure rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20 animate-bounce">
              <Check size={48} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-display font-semibold text-text-dark mb-4 tracking-tight">Dashboard Siap!</h2>
            <p className="text-text-gray font-medium text-base leading-relaxed mb-10">
              Identitas <strong className="text-text-dark">{companyName}</strong> telah dikonfigurasi. <br />
              Menyiapkan workspace canggih Anda...
            </p>
            <div className="flex gap-2.5 justify-center">
              <div className="w-10 h-1.5 bg-brand-blue rounded-full animate-pulse"></div>
              <div className="w-5 h-1.5 bg-brand-blue/30 rounded-full"></div>
              <div className="w-5 h-1.5 bg-brand-blue/30 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
