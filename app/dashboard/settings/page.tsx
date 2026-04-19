'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Shield, Bell, Building, Save, Camera, Mail, Phone, MapPin, 
  Lock, Globe, Check, Loader2, AlertCircle, ChevronRight, LogOut,
  Users, Sparkles, Home
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type TabType = 'profil' | 'keamanan' | 'notifikasi' | 'bisnis';

export default function SettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabType>('profil');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    avatarUrl: ''
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setProfile({
            fullName: profileData?.full_name || session.user.user_metadata?.full_name || '',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone_number || '',
            company: profileData?.company_name || session.user.user_metadata?.company_name || '',
            location: 'Jakarta, Indonesia', // Placeholder
            avatarUrl: profileData?.avatar_url || session.user.user_metadata?.avatar_url || ''
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          company_name: profile.company,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update Auth Metadata as well
      await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          company_name: profile.company,
        }
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload to 'avatars' bucket
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile and metadata
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      setProfile({ ...profile, avatarUrl: publicUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-gray/40">
        <Loader2 size={36} className="animate-spin mb-4 text-brand-blue/40" />
        <p className="text-sm font-medium">Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">Pengaturan Akun</h1>
          <p className="text-sm font-normal text-text-gray/50">Kelola profil, keamanan, dan preferensi akun Anda.</p>
        </div>
        
        {success && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 animate-in fade-in slide-in-from-top-1">
            <Check size={14} /> Perubahan berhasil disimpan
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
            <AlertCircle size={14} /> {error}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 flex-none space-y-2">
          {[
            { id: 'profil', label: 'Profil Pengguna', icon: User },
            { id: 'keamanan', label: 'Keamanan Akun', icon: Shield },
            { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
            { id: 'bisnis', label: 'Info Bisnis', icon: Building },
          ].map((tab) => (
            <button
              key={tab.id}
              suppressHydrationWarning
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-blue text-white-pure shadow-lg shadow-brand-blue/10' 
                  : 'bg-white-pure border border-border-line/10 text-text-gray hover:bg-surface-gray hover:text-text-dark'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2 : 1.5} />
                <span className="text-sm font-medium">{tab.label}</span>
              </div>
              <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-border-line/10">
            <button 
              suppressHydrationWarning
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium text-sm"
            >
              <LogOut size={18} />
              Keluar Akun
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white-pure rounded-[2.5rem] border border-border-line/10 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          
          <div className="flex-1 p-8 lg:p-10">
            {activeTab === 'profil' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-8 mb-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-surface-gray border-2 border-border-line/10 overflow-hidden shadow-inner">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-blue/30">
                          <User size={40} />
                        </div>
                      )}
                    </div>
                    <button 
                      suppressHydrationWarning
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-blue text-white-pure rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 border-4 border-white-pure"
                    >
                      <Camera size={16} />
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-text-dark">Foto Profil</h3>
                    <p className="text-xs text-text-gray/50 mt-1">Disarankan ukuran minimal 400x400px dalam format JPG atau PNG.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
                      <input 
                        type="text" 
                        suppressHydrationWarning
                        value={profile.fullName}
                        onChange={e => setProfile({...profile, fullName: e.target.value})}
                        className="w-full bg-surface-gray/30 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Email (Akun)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
                      <input 
                        type="email" 
                        suppressHydrationWarning
                        value={profile.email}
                        readOnly
                        className="w-full bg-surface-gray/10 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-text-gray/50 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
                      <input 
                        type="text" 
                        suppressHydrationWarning
                        value={profile.phone}
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        className="w-full bg-surface-gray/30 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                        placeholder="+62 8..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Nama Perusahaan / Kantor</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
                      <input 
                        type="text" 
                        suppressHydrationWarning
                        value={profile.company}
                        onChange={e => setProfile({...profile, company: e.target.value})}
                        className="w-full bg-surface-gray/30 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                        placeholder="Nama Developer / Agent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'keamanan' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-brand-blue/5 p-6 rounded-3xl border border-brand-blue/10 flex gap-4">
                  <Shield size={24} className="text-brand-blue shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-brand-blue">Keamanan Akun</h4>
                    <p className="text-xs text-brand-blue/60 mt-1 leading-relaxed">
                      Pastikan password Anda kuat dan rutin diperbarui untuk menjaga keamanan listing dan data leads Anda.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Password Lama</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
                      <input 
                        type="password" 
                        suppressHydrationWarning
                        className="w-full bg-surface-gray/30 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Password Baru</label>
                      <input 
                        type="password" 
                        suppressHydrationWarning
                        className="w-full bg-surface-gray/30 border-none rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Konfirmasi Password Baru</label>
                      <input 
                        type="password" 
                        suppressHydrationWarning
                        className="w-full bg-surface-gray/30 border-none rounded-2xl py-3.5 px-6 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifikasi' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-1 mb-8">
                  <h3 className="text-lg font-medium text-text-dark">Preferensi Notifikasi</h3>
                  <p className="text-sm text-text-gray/50">Atur bagaimana kami mengabari Anda tentang aktivitas penting.</p>
                </div>

                {[
                  { title: 'Leads Baru', desc: 'Dapatkan email instan saat calon pembeli menghubungi Anda.', icon: Users },
                  { title: 'Aktivitas Chatbot AI', desc: 'Rangkuman harian tentang interaksi chatbot dengan pengunjung.', icon: Sparkles },
                  { title: 'Status Listing', desc: 'Notifikasi saat listing Anda dipublikasikan atau kedaluwarsa.', icon: Home },
                  { title: 'Tips Marketing', desc: 'Info terbaru cara optimasi listing biar cepat terjual.', icon: Globe },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-gray/20 rounded-2xl border border-border-line/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white-pure flex items-center justify-center text-brand-blue shadow-sm">
                        <item.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-dark">{item.title}</p>
                        <p className="text-[11px] text-text-gray/50 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        suppressHydrationWarning
                        className="sr-only peer" 
                        defaultChecked 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bisnis' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Deskripsi Bisnis / Profile Bio</label>
                    <textarea 
                      rows={4}
                      suppressHydrationWarning
                      className="w-full bg-surface-gray/30 border-none rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all resize-none" 
                      placeholder="Ceritakan tentang layanan atau spesialisasi Anda..."
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-text-gray/40 uppercase tracking-widest ml-1">Website Resmi</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={16} />
                      <input 
                        type="url" 
                        suppressHydrationWarning
                        className="w-full bg-surface-gray/30 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-blue/10 transition-all" 
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-surface-gray/20 rounded-3xl border border-dashed border-border-line/40 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-white-pure rounded-2xl flex items-center justify-center text-text-gray/30 mb-4 shadow-sm">
                      <Building size={22} />
                    </div>
                    <p className="text-xs font-bold text-text-dark">Unggah Logo Perusahaan</p>
                    <p className="text-[10px] text-text-gray/40 mt-1">Logo akan muncul di kartu listing dan laporan leads.</p>
                    <button 
                      suppressHydrationWarning
                      className="mt-4 px-4 py-2 bg-white-pure border border-border-line/20 rounded-xl text-[10px] font-bold text-brand-blue hover:bg-brand-blue/5 transition-all"
                    >
                      PILIH FILE
                    </button>
                  </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-8 border-t border-border-line/10 bg-surface-gray/10 flex justify-end">
             <button 
              onClick={handleSave}
              disabled={saving}
              suppressHydrationWarning
              className="px-8 py-3.5 bg-brand-blue text-white-pure rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
               Simpan Perubahan
             </button>
          </div>

        </div>

      </div>

    </div>
  );
}
