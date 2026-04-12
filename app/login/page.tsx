'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
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

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Silakan periksa email dan kata sandi Anda.');
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-[1200px] bg-white-pure rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col md:flex-row h-full md:min-h-[750px] border border-white">
        
        {/* Left Side: Visual Hero */}
        <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden">
          <img 
            src="/images/auth-hero.png" 
            alt="Luxury Property" 
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
                  Manage Properties <br /> Efficiently
                </h2>
                <p className="text-white-pure/80 text-sm font-medium max-w-sm leading-relaxed">
                  Easily track rent payments, maintenance requests, and tenant communications in one place. Say goodbye to manual management.
                </p>
                <div className="flex gap-2 mt-8">
                    <div className="w-8 h-1 bg-white-pure rounded-full opacity-100"></div>
                    <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                    <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16 relative">
          
          <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
            <div className="mb-10 pt-8 md:pt-0">
              <h1 className="text-3xl font-display font-semibold text-text-dark mb-3 tracking-tight">
                Welcome Back to PropNest!
              </h1>
              <p className="text-text-gray font-medium text-sm">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Your Email"
                  type="email"
                  placeholder="name@email.com"
                  icon={Mail}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative group">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-5 h-5 border-2 border-border-line/40 rounded-md transition-all peer-checked:bg-brand-blue peer-checked:border-brand-blue group-hover:border-brand-blue/50"></div>
                    <svg className="absolute w-3 h-3 text-white-pure opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-text-gray">Remember Me</span>
                </label>
                <Link href="/forgot-password" title="Lupa Password" className="text-xs font-semibold text-text-gray/50 hover:text-brand-blue transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs font-medium animate-in fade-in">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-4 text-sm shadow-xl shadow-brand-blue/10" 
                isLoading={isLoading}
              >
                Login
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-line/20"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-text-gray/50 bg-white-pure px-4 font-medium">
                Instan Login
              </div>
            </div>

            <div className="mt-8">
              <Button 
                variant="outline" 
                className="w-full py-3.5 rounded-2xl border-border-line/40 hover:bg-surface-gray transition-colors" 
                onClick={handleGoogleLogin}
                leftIcon={<GoogleIcon />}
              >
                Sign in with Google
              </Button>
            </div>

            <p className="mt-10 text-center text-xs text-text-gray font-medium">
              Don't have any account?{' '}
              <Link href="/register" className="text-brand-blue hover:underline font-semibold">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
