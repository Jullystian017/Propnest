'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  Settings, 
  LogOut,
  Bell,
  Menu
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Listing Properti', href: '/dashboard/listing', icon: Building2 },
    { name: 'CRM Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Content Studio', href: '/dashboard/content', icon: Sparkles },
    { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
  ];

  const companyName = user?.user_metadata?.company_name || 'Developer';

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white-pure border-r border-border-line/40 z-50 flex flex-col hidden lg:flex">
        <div className="h-20 flex items-center px-8 border-b border-border-line/20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center">
              <span className="text-white-pure font-bold text-sm">P</span>
            </div>
            <span className="font-display font-bold text-lg text-text-dark tracking-tight">PropNest</span>
          </Link>
        </div>

        <div className="p-6 border-b border-border-line/10">
          <div className="flex items-center gap-3 p-3 bg-surface-gray rounded-2xl border border-border-line/20">
            <div className="w-10 h-10 rounded-xl bg-brand-blue text-white-pure flex items-center justify-center font-bold text-lg flex-none shadow-sm shadow-brand-blue/20">
              {companyName ? companyName.charAt(0) : 'D'}
            </div>
            <div className="overflow-hidden">
               <p className="text-xs font-bold text-text-gray/50 uppercase tracking-widest leading-none mb-1">Company</p>
               <p className="text-sm font-bold text-text-dark truncate">{companyName}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="text-[10px] font-bold text-text-gray/50 uppercase tracking-widest mb-4 px-4">Menu Utama</div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-brand-blue/5 text-brand-blue' 
                      : 'text-text-gray hover:bg-surface-gray hover:text-text-dark'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-brand-blue' : 'text-text-gray/70'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border-line/20">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative">
        {/* Topbar */}
        <header className="h-20 bg-white-pure/80 backdrop-blur-md border-b border-border-line/40 sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4 lg:hidden">
            <button className="p-2 text-text-gray hover:bg-surface-gray rounded-lg">
              <Menu size={24} />
            </button>
            <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center">
              <span className="text-white-pure font-bold text-sm">P</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-xl font-display font-semibold text-text-dark capitalize">
              {pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-border-line/40 flex items-center justify-center text-text-gray hover:bg-surface-gray hover:text-brand-blue transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white-pure"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold">
              D
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
