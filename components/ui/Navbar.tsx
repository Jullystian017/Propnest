'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, ChevronDown } from 'lucide-react';
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
    { label: 'Properties', href: '/cari', hasDropdown: true },
    { label: 'Services', href: '/services' },
    { label: 'Agents', href: '/agents' },
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isScrolled || pathname !== '/'
            ? 'py-3'
            : 'py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group shrink-0">
            <span className="font-display font-bold text-2xl tracking-tight text-white-pure">
              Prop<span className="text-brand-blue">Nest</span>
            </span>
          </Link>

          {/* Floating Pill Center Nav */}
          <nav className="hidden lg:flex items-center bg-black-pure/20 backdrop-blur-md border border-white/10 p-1.5 rounded-full shadow-lg">
            <Link 
              href="/" 
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                pathname === '/' 
                  ? 'bg-white-pure text-text-dark shadow-sm' 
                  : 'text-white-pure/80 hover:text-white-pure'
              }`}
            >
              Home
            </Link>
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-5 py-2 text-sm font-medium text-white-pure/80 hover:text-white-pure transition-colors flex items-center gap-1"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={14} className="opacity-50" />}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
             <Link href="/contact" className="hidden sm:block text-sm font-medium text-white-pure/90 hover:text-white-pure transition-colors px-4">
               Contact Us
             </Link>
             <Link href="/login" className="bg-brand-blue hover:bg-brand-blue-hover text-white-pure text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-md active:scale-95">
               Sign In
               <LogIn size={16} />
             </Link>

             {/* Mobile Menu Toggle */}
             <button
               className="lg:hidden p-2 rounded-full bg-white/10 text-white-pure transition-colors"
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
            <span className="font-display font-bold text-xl text-text-dark">Menu</span>
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
                className={`text-lg font-bold p-3 rounded-2xl transition-colors ${
                  pathname === link.href ? 'bg-blue-50 text-brand-blue' : 'text-text-dark hover:bg-surface-gray'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="p-6 border-t border-border-line flex flex-col gap-3">
            <Link
              href="/login"
              className="btn-primary w-full rounded-2xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
