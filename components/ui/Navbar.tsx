'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NAV_LINKS = [
    { label: 'Beli', href: '/cari' },
    { label: 'Sewa', href: '/sewa' },
    { label: 'KPR', href: '/kpr-calculator' },
    { label: 'Agen', href: '/features' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled || pathname !== '/'
            ? 'bg-white-pure text-text-dark shadow-feature-card py-4'
            : 'bg-transparent text-white-pure py-6'
        }`}
      >
        <div className="container-standard flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-orange text-white-pure flex items-center justify-center font-display font-bold text-lg">
              PJ
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              PropNest<span className="text-brand-orange">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-orange`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
             <Link href="/login" className="text-sm font-medium hover:text-brand-orange transition-colors">
               Masuk
             </Link>
             <Link href="/daftar" className="btn-orange !py-2 !px-5 !text-sm">
               Daftar Gratis
             </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[100] bg-black-pure/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 w-64 bg-white-pure text-text-dark shadow-2xl transition-transform duration-300 flex flex-col ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex items-center justify-end border-b border-border-line">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 hover:bg-surface-gray rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-lg font-medium transition-colors hover:text-brand-orange"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-border-line flex flex-col gap-4">
            <Link
              href="/login"
              className="w-full text-center py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="btn-orange w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
