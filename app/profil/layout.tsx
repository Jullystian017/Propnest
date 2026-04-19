'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bookmark, MessageSquare, Calendar, Calculator, LogOut, FileText, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/login');
      }
    }
    getUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navItems = [
    { name: 'Disimpan', href: '/profil', icon: Bookmark },
    { name: 'Kotak Masuk', href: '/profil/inbox', icon: MessageSquare },
    { name: 'Jadwal Kunjungan', href: '/profil/jadwal', icon: Calendar },
    { name: 'Profil KPR', href: '/profil/kpr', icon: Calculator },
    { name: 'Transaksi', href: '/profil/transaksi', icon: FileText },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans pb-12">
      {/* Top Header */}
      <header className="bg-white-pure border-b border-border-line/30 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-surface-gray flex items-center justify-center text-text-gray hover:text-brand-blue hover:bg-brand-blue/5 transition-all">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-display font-semibold text-xl text-text-dark">Profil Saya</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold text-text-dark">{user.user_metadata?.full_name}</p>
               <p className="text-xs text-text-gray font-medium">{user.email}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-brand-blue text-white-pure flex items-center justify-center font-semibold shadow-sm">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
             </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white-pure rounded-[2rem] p-4 shadow-sm border border-border-line/20 sticky top-28">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all group ${
                        isActive 
                          ? 'bg-brand-blue text-white-pure shadow-md shadow-brand-blue/10' 
                          : 'text-text-gray hover:bg-surface-gray hover:text-text-dark'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-white-pure' : 'text-text-gray/50 group-hover:text-brand-blue transition-colors'} />
                      {item.name}
                    </Link>
                  )
                })}
                
                <div className="my-2 border-t border-border-line/20"></div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut size={18} />
                  Keluar Akun
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
