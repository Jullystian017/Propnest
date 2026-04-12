'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User as UserType } from '@supabase/supabase-js';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NAV_LINKS = [
    { label: 'Properti', href: '/cari' },
    { label: 'Kalkulator KPR', href: '/kpr-calculator' },
    { label: 'Tentang', href: '/tentang' },
  ];

  return (
    <>
      <header
        className={`${pathname === '/cari' ? 'absolute' : 'fixed'} top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled || pathname !== '/'
            ? 'py-4 bg-white/80 backdrop-blur-md border-b border-black/5 shadow-sm'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center w-full">
          
          {/* Logo - Fixed width for symmetry */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-1.5 group shrink-0">
              <span className={`font-display font-semibold text-2xl tracking-tight transition-colors duration-300 ${
                isScrolled || pathname !== '/' ? 'text-text-dark' : 'text-white-pure'
              }`}>
                Prop<span className="text-brand-blue">Nest</span>
              </span>
            </Link>
          </div>

          {/* Floating Pill Center Nav */}
          <nav className={`hidden lg:flex items-center backdrop-blur-md border p-1.5 rounded-full shadow-lg transition-all duration-300 ${
            isScrolled || pathname !== '/' 
              ? 'bg-black/5 border-black/5 shadow-none' 
              : 'bg-black-pure/20 border-white/10'
          }`}>
            <Link 
              href="/" 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/' 
                  ? 'bg-brand-blue text-white-pure shadow-sm' 
                  : (isScrolled || pathname !== '/' ? 'text-text-gray hover:text-text-dark' : 'text-white-pure/80 hover:text-white-pure')
              }`}
            >
              Beranda
            </Link>
            {NAV_LINKS.map((link) => ( 
              <Link
                key={link.label}
                href={link.href}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === link.href 
                    ? 'bg-brand-blue text-white-pure shadow-sm' 
                    : (isScrolled || pathname !== '/' ? 'text-text-gray hover:text-text-dark' : 'text-white-pure/80 hover:text-white-pure')
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions - Fixed width for symmetry */}
          <div className="flex-1 flex items-center justify-end gap-3">
             {user ? (
               <Link href="/dashboard" className="bg-brand-blue hover:bg-brand-blue-hover text-white-pure text-sm font-medium px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md active:scale-95">
                 Dashboard
               </Link>
             ) : (
               <Link href="/login" className="bg-brand-blue hover:bg-brand-blue-hover text-white-pure text-sm font-medium px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md active:scale-95">
                 Masuk
                 <LogIn size={16} />
               </Link>
             )}

             {/* Mobile Menu Toggle */}
             <button
               className={`lg:hidden p-2 rounded-full transition-colors ${
                 isScrolled || pathname !== '/' ? 'bg-black/5 text-text-dark' : 'bg-white/10 text-white-pure'
               }`}
               onClick={() => setMobileMenuOpen(true)}
             >
               <Menu size={22} />
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[100] bg-black-pure/60 backdrop-blur-md transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-4 top-4 bottom-4 w-[280px] bg-white-pure rounded-3xl shadow-2xl transition-transform duration-500 flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-[110%]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex items-center justify-between border-b border-border-line">
            <span className="font-display font-semibold text-xl text-text-dark">Menu Utama</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 bg-surface-gray rounded-full text-text-dark"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-lg font-medium p-3 rounded-2xl transition-colors ${
                  pathname === link.href ? 'bg-blue-50 text-brand-blue' : 'text-text-dark hover:bg-surface-gray'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="p-6 border-t border-border-line flex flex-col gap-3">
            {!user && (
              <Link
                href="/login"
                className="btn-primary w-full rounded-2xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk
              </Link>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="btn-primary w-full rounded-2xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
