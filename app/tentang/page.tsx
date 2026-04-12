'use client';

import React from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { 
  Rocket, Shield, Zap, Target, 
  MapPin, Heart, Sparkles, Building2, 
  ChevronRight, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function TentangPage() {
  return (
    <div className="bg-white-pure min-h-screen font-sans selection:bg-brand-blue/10">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-blue/5 to-transparent -z-10"></div>
          <div className="container-standard relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-[10px] font-semibold uppercase tracking-widest mb-6 animate-fade-in">
                <Sparkles size={14} />
                Masa Depan Properti Indonesia
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-text-dark tracking-tight leading-[1.1] mb-8">
                Mentransformasi Pemasaran Properti dengan <span className="text-brand-blue">Kecerdasan Buatan</span>
              </h1>
              <p className="text-lg md:text-xl text-text-gray leading-relaxed mb-10 max-w-2xl font-medium">
                PropNest AI hadir untuk memberdayakan developer perumahan di Indonesia melalui solusi digital cerdas yang menyatukan AI generatif, otomasi, dan manajemen leads.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/cari" className="bg-brand-blue text-white-pure px-8 py-4 rounded-2xl font-semibold hover:bg-brand-blue-hover transition-all shadow-premium active:scale-95 flex items-center gap-2">
                  Lihat Properti <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-surface-gray/30">
          <div className="container-standard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-display font-semibold text-text-dark mb-6">Misi Kami</h2>
                <p className="text-text-gray mb-8 leading-relaxed font-medium">
                  Kami percaya bahwa setiap developer perumahan, terlepas dari ukurannya, harus memiliki akses ke alat pemasaran tercanggih. Misi kami adalah mendemokratisasi teknologi AI untuk mempercepat pertumbuhan industri properti lokal.
                </p>
                <div className="space-y-4">
                  {[
                    "Otomasi konten pemasaran berkualitas tinggi.",
                    "Penyederhanaan simulasi KPR untuk pembeli.",
                    "Integrasi ekosistem digital dari listing ke closing.",
                    "Fokus pada pertumbuhan ekonomi daerah (Tier 2-3)."
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
                        <ChevronRight size={14} className="text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-text-dark">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="aspect-square bg-white-pure rounded-[2rem] shadow-premium border border-border-line/40 flex flex-col items-center justify-center p-8 text-center group hover:border-brand-blue/30 transition-all">
                    <Rocket className="text-brand-blue mb-4 transition-transform group-hover:-translate-y-1" size={32} />
                    <div className="text-2xl font-semibold text-text-dark">100%</div>
                    <div className="text-[10px] text-text-gray font-semibold uppercase tracking-widest mt-1">Otomatis</div>
                  </div>
                  <div className="aspect-[4/5] bg-brand-blue rounded-[2rem] shadow-premium flex flex-col items-center justify-center p-8 text-center text-white-pure">
                    <Zap size={32} className="mb-4" />
                    <div className="text-2xl font-semibold">10x</div>
                    <div className="text-[10px] text-white-pure/70 font-semibold uppercase tracking-widest mt-1">Lebih Cepat</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-[4/5] bg-white-pure rounded-[2rem] shadow-premium border border-border-line/40 flex flex-col items-center justify-center p-8 text-center group hover:border-brand-blue/30 transition-all">
                    <Target className="text-brand-blue mb-4 transition-transform group-hover:scale-110" size={32} />
                    <div className="text-xl font-semibold text-text-dark">Terarah</div>
                    <div className="text-[10px] text-text-gray font-semibold uppercase tracking-widest mt-1">Leads Lokal</div>
                  </div>
                  <div className="aspect-square bg-surface-dim rounded-[2rem] shadow-soft flex flex-col items-center justify-center p-8 text-center">
                    <Shield className="text-text-dark/40 mb-4" size={32} />
                    <div className="text-xl font-semibold text-text-dark">Aman</div>
                    <div className="text-[10px] text-text-gray font-semibold uppercase tracking-widest mt-1">Sertifikasi SHM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us / AI Focus */}
        <section className="py-24">
          <div className="container-standard text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-text-dark mb-4">Kenapa PropNest AI?</h2>
            <p className="text-text-gray max-w-2xl mx-auto font-medium">Platform pemasaran properti pertama yang memahami konteks lokal Indonesia.</p>
          </div>
          <div className="container-standard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Content Studio",
                  description: "Generate caption konten untuk IG, TikTok, dan FB secara otomatis dalam hitungan detik dengan bahasa yang natural.",
                  icon: Sparkles
                },
                {
                  title: "KPR Simulator Pintar",
                  description: "Simulasi cicilan yang akurat dan perbandingan antar bank untuk membantu calon pembeli mengambil keputusan.",
                  icon: Zap
                },
                {
                  title: "CRM Terintegrasi",
                  description: "Kelola semua leads dari berbagai platform dalam satu dashboard yang intuitif untuk percepatan closing.",
                  icon: Building2
                }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[40px] border border-border-line/40 hover:border-brand-blue/20 hover:shadow-premium transition-all duration-500 bg-white-pure group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue mb-6 group-hover:bg-brand-blue group-hover:text-white-pure transition-colors">
                    <feature.icon size={26} />
                  </div>
                  <h3 className="text-xl font-semibold text-text-dark mb-4">{feature.title}</h3>
                  <p className="text-text-gray text-sm leading-relaxed font-medium">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Roots */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue opacity-[0.02] -z-10"></div>
          <div className="container-standard">
            <div className="bg-white-pure rounded-[3rem] p-12 md:p-20 shadow-premium border border-border-line/50 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-brand-blue font-semibold text-[10px] uppercase tracking-widest mb-4">
                  <MapPin size={14} /> Berakar di Jawa Tengah
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-semibold text-text-dark mb-6">Fokus pada Kota Tier 2 & 3</h2>
                <p className="text-text-gray leading-relaxed mb-8 font-medium">
                  Kami memulai perjalanan di Purwokerto dengan pemahaman mendalam tentang ekosistem properti lokal. PropNest AI dirancang untuk kebutuhan nyata developer perumahan di daerah, bukan sekadar platform dari kota besar.
                </p>
                <div className="flex gap-8">
                  <div>
                    <div className="text-3xl font-semibold text-text-dark">15k+</div>
                    <div className="text-[10px] text-text-gray font-semibold uppercase tracking-widest mt-1">Developer Aktif</div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold text-text-dark">12.7jt</div>
                    <div className="text-[10px] text-text-gray font-semibold uppercase tracking-widest mt-1">Backlog Rumah</div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-surface-gray rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
                 <Building2 size={120} className="text-text-gray/20" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
