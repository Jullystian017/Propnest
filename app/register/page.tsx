'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft, Building2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
      
      if (data.session) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="bg-white-pure min-h-screen flex flex-col font-sans">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[440px] bg-white-pure p-10 rounded-[2.5rem] shadow-premium border border-border-line/40 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-display font-medium text-text-dark mb-4">Cek Email Anda</h2>
            <p className="text-text-gray font-medium text-sm leading-relaxed mb-8">
              Kami telah mengirimkan tautan verifikasi ke <strong>{email}</strong>. <br />
              Silakan klik tautan tersebut untuk mengaktifkan akun Anda.
            </p>
            <Button variant="outline" className="w-full" onClick={() => setIsSuccess(false)}>
              Kembali
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-[1200px] bg-white-pure rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col md:flex-row h-full md:min-h-[820px] border border-white">
        
        {/* Left Side: Form Area */}
        <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16 relative order-2 md:order-1">
          
          {/* Back Button */}
          <div className="absolute top-8 left-8 md:top-12 md:left-12">
            <Link href="/" className="inline-flex items-center gap-2 text-text-gray/60 hover:text-brand-blue transition-colors group">
              <div className="w-10 h-10 rounded-full border border-border-line/20 flex items-center justify-center bg-white shadow-sm group-hover:border-brand-blue/30 group-active:scale-95 transition-all">
                <ArrowLeft size={18} />
              </div>
              <span className="text-sm font-medium">Kembali</span>
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
            <div className="mb-10 pt-16 md:pt-0">
              <h1 className="text-3xl font-display font-semibold text-text-dark mb-3 tracking-tight">
                Daftar PropNest AI
              </h1>
              <p className="text-text-gray font-medium text-sm">
                Bergabunglah dengan platform pemasaran properti masa depan
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="John Doe"
                icon={User}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Alamat Email"
                type="email"
                placeholder="nama@email.com"
                icon={Mail}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative group">
                <Input
                  label="Kata Sandi"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 karakter"
                  icon={Lock}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-text-gray/50 hover:text-brand-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-medium animate-in fade-in">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-4 text-sm mt-4 shadow-xl shadow-brand-blue/10" 
                isLoading={isLoading}
              >
                Daftar Akun
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-line/20"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-text-gray/50 bg-white-pure px-4 font-medium">
                Pendaftaran Instan
              </div>
            </div>

            <div className="mt-8">
              <Button 
                variant="outline" 
                className="w-full py-3.5 rounded-2xl border-border-line/40 hover:bg-surface-gray transition-colors" 
                onClick={handleGoogleLogin}
                leftIcon={<GoogleIcon />}
              >
                Daftar dengan Google
              </Button>
            </div>

            <p className="mt-10 text-center text-sm text-text-gray font-medium">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-brand-blue hover:underline font-semibold">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Visual Hero */}
        <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden order-1 md:order-2">
          <img 
            src="/images/auth-hero.png" 
            alt="Properti mewah" 
            className="absolute inset-0 w-full h-full object-cover p-3 rounded-[3rem]"
          />
          <div className="absolute inset-0 p-3">
             <div className="w-full h-full rounded-[2.5rem] bg-black-pure/30 flex flex-col justify-end p-10">
                <div className="mb-6 flex items-center gap-2 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
                    <div className="w-6 h-6 bg-brand-blue rounded-lg flex items-center justify-center">
                        <span className="text-white-pure text-[10px] font-bold">P</span>
                    </div>
                    <span className="text-white-pure text-xs font-medium tracking-wide">PropNest AI</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-semibold text-white-pure leading-tight mb-4">
                  Gabung PropNest <br /> Sekarang
                </h2>
                <p className="text-white-pure/80 text-sm font-medium max-w-sm leading-relaxed">
                  Mulai perjalanan Anda untuk menemukan properti impian dengan teknologi AI kami. Bergabunglah dengan ribuan pengguna lainnya.
                </p>
                <div className="flex gap-2 mt-8">
                    <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                    <div className="w-8 h-1 bg-white-pure rounded-full opacity-100"></div>
                    <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
