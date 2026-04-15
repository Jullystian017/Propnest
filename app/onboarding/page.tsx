'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, Sparkles, Layout, Zap, Check } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [companyName, setCompanyName] = useState('');
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
        // If already has company name, skip to dashboard
        if (user.user_metadata?.company_name) {
          router.push('/dashboard');
        }
      }
    }
    checkUser();
  }, []);

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // 1. Update User Metadata (fast for middleware)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          company_name: companyName,
          onboarding_completed: true 
        }
      });

      if (updateError) throw updateError;

      // 2. Update Profiles Table (for DB integrity)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ company_name: companyName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setStep(2); // Show success state
      
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-sans overflow-hidden">
      {/* Abstract Background Decors */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[500px] relative z-10 transition-all duration-700">
        
        {step === 1 ? (
          <div className="bg-white-pure rounded-[2.5rem] shadow-premium p-10 lg:p-12 border border-white animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-blue">
                <Sparkles size={32} />
              </div>
              <h1 className="text-3xl font-display font-semibold text-text-dark mb-3 tracking-tight">
                Selamat Datang!
              </h1>
              <p className="text-text-gray font-medium text-sm leading-relaxed">
                Hanya butuh satu langkah lagi untuk mengaktifkan Dashboard AI kamu.
              </p>
            </div>

            <form onSubmit={handleCompleteOnboarding} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-gray/70 uppercase tracking-widest pl-1">
                  Identitas Bisnis
                </label>
                <Input
                  label=""
                  type="text"
                  placeholder="Contoh: PT Graha Sejahtera / Bukit Villas"
                  icon={Building2}
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-surface-gray border-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium py-4"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-medium animate-in fade-in">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-4 text-sm font-bold shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-2" 
                isLoading={isLoading}
              >
                Aktifkan Dashboard <ArrowRight size={18} />
              </Button>
            </form>

            <div className="mt-10 grid grid-cols-3 gap-4">
               {[
                 { icon: Layout, label: 'CRM' },
                 { icon: Zap, label: 'AI Gen' },
                 { icon: Building2, label: 'Listing' }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-surface-gray flex items-center justify-center text-text-gray/40">
                      <item.icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-text-gray/50 uppercase tracking-tighter">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        ) : (
          <div className="bg-white-pure rounded-[2.5rem] shadow-premium p-12 border border-white text-center animate-in zoom-in-95 fade-in duration-500">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-display font-semibold text-text-dark mb-4">Dashboard Siap!</h2>
            <p className="text-text-gray font-medium text-sm leading-relaxed mb-8">
              Identitas <strong>{companyName}</strong> telah dikonfigurasi. <br />
              Menyiapkan workspace AI kamu...
            </p>
            <div className="flex gap-2 justify-center">
              <div className="w-8 h-1 bg-brand-blue rounded-full animate-pulse"></div>
              <div className="w-4 h-1 bg-brand-blue/30 rounded-full"></div>
              <div className="w-4 h-1 bg-brand-blue/30 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
