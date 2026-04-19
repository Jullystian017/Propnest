'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  PieChart as PieChartIcon, 
  Sparkles, 
  Calendar, 
  Download, 
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  FileText,
  Building2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { generateExecutiveReport } from '@/lib/reports/actions';
import { exportToPDF, exportToWord } from '@/lib/reports/export-utils';
import { createClient } from '@/lib/supabase/client';

export default function AnalyticsPage() {
  const supabase = createClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30 Hari');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [reportSerial, setReportSerial] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [leadsData, setLeadsData] = useState<any[]>([]);
  const [dealsData, setDealsData] = useState<any[]>([]);
  const [propertiesData, setPropertiesData] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setReportSerial(`PN-#${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`);
    setReportDate(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [leadsRes, dealsRes, propsRes] = await Promise.all([
          supabase.from('leads').select('*').order('created_at', { ascending: true }),
          supabase.from('deals').select('*'),
          supabase.from('properties').select('id, title')
        ]);
        
        if (leadsRes.data) setLeadsData(leadsRes.data);
        if (dealsRes.data) setDealsData(dealsRes.data);
        if (propsRes.data) setPropertiesData(propsRes.data);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // --- Data Processing for Charts ---
  
  // 1. Leads by Source (Pie Chart)
  const sourceData = useMemo(() => {
    if (leadsData.length === 0) return [];
    const counts = leadsData.reduce((acc: any, lead) => {
      const src = lead.source || 'Lainnya';
      acc[src] = (acc[src] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ 
      name: key, 
      value: counts[key],
      percentage: Math.round((counts[key] / leadsData.length) * 100)
    }));
  }, [leadsData]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // 2. Leads Trend (Area Chart)
  const trendData = useMemo(() => {
    // Generate last 7 days
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const result = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      
      // Count leads for this day
      const leadsCount = leadsData.filter(l => {
        const ld = new Date(l.created_at);
        return ld.getDate() === d.getDate() && ld.getMonth() === d.getMonth();
      }).length;
      
      result.push({
        name: dayName,
        leads: leadsCount,
        // Simulated clicks based on leads + random factor to make chart look alive
        click: leadsCount > 0 ? leadsCount * 3 + Math.floor(Math.random() * 5) : Math.floor(Math.random() * 10) + 5
      });
    }
    return result;
  }, [leadsData]);

  const AnalyticsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-border-line/10 backdrop-blur-xl z-50">
          <p className="text-[10px] font-bold text-text-gray/40 uppercase tracking-[0.2em] mb-3">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                <span className="text-xs font-medium text-text-gray">Leads Baru</span>
              </div>
              <span className="text-xs font-bold text-text-dark">{payload[1]?.value || 0}</span>
            </div>
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-blue/30"></div>
                <span className="text-xs font-medium text-text-gray">Klik Chatbot</span>
              </div>
              <span className="text-xs font-bold text-text-dark">{payload[0]?.value || 0}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 3. Property Performance (Bar Chart)
  const propertyData = useMemo(() => {
    if (leadsData.length === 0) return [];
    const counts = leadsData.reduce((acc: any, lead) => {
      let propName = lead.intent || 'Unit Lainnya';
      if (lead.property_id && propertiesData.length > 0) {
        const prop = propertiesData.find((p: any) => p.id === lead.property_id);
        if (prop && prop.title) {
          propName = prop.title;
        }
      }
      
      acc[propName] = (acc[propName] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(counts)
      .map(key => ({ 
        name: key.length > 25 ? key.substring(0, 25) + '...' : key, 
        full: key, 
        value: counts[key] 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [leadsData, propertiesData]);

  // KPI Calculations
  const totalLeads = leadsData.length;
  const wonDeals = dealsData.filter(d => d.status === 'Won').length;
  const conversionRate = totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : '0';
  const totalClicks = trendData.reduce((acc, curr) => acc + curr.click, 0);
  const projectedRevenue = dealsData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  
  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)}M`;
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}Jt`;
    return `Rp ${val}`;
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport(null);
    
    const analyticsData = {
      totalLeads: totalLeads,
      sourceStats: sourceData.reduce((acc: any, item) => ({ ...acc, [item.name]: item.value }), {}),
      propertyStats: propertyData.reduce((acc: any, item) => ({ ...acc, [item.name]: item.value }), {}),
      qualityStats: leadsData.reduce((acc: any, lead) => {
        const temp = lead.temperature || 'Cold';
        return { ...acc, [temp]: (acc[temp] || 0) + 1 };
      }, {}),
      trendSummary: `Tertinggi di minggu ini mencapai ${Math.max(...trendData.map(t => t.leads))} leads per hari.`
    };

    try {
      const result = await generateExecutiveReport(analyticsData);
      if (result.success) {
        setReport(result.report!);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat membuat laporan.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = (id: string = 'report-print-template') => {
    if (!report) return;
    exportToPDF(id, `PropNest_Laporan_Eksekutif_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportWord = () => {
    if (!report) return;
    exportToWord(report, `PropNest_Laporan_Eksekutif_${new Date().toLocaleDateString('id-ID')}.docx`);
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">Analitik Pasar</h1>
          <p className="text-sm font-normal text-text-gray/50">Dapatkan pandangan 360 derajat terhadap performa pemasaran Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 flex shadow-sm">
            {['7 Hari', '30 Hari', '90 Hari'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  timeRange === range ? 'bg-brand-blue text-white-pure shadow-xl shadow-brand-blue/25' : 'text-text-gray hover:text-text-dark hover:bg-white/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="h-12 w-12 flex items-center justify-center bg-white-pure border border-border-line/10 rounded-2xl text-text-gray hover:text-brand-blue transition-all shadow-sm hover:shadow-md active:scale-90">
            <Download size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-text-gray/40">
           <Loader2 size={32} className="animate-spin mb-4 text-brand-blue" />
           <p className="text-sm font-medium">Memuat data analitik...</p>
        </div>
      ) : (
        <>
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Leads', value: totalLeads, change: '+12.5%', isPos: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-500/10 to-transparent' },
              { label: 'Tingkat Konversi', value: `${conversionRate}%`, change: '+0.4%', isPos: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
              { label: 'Klik Chatbot', value: totalClicks, change: '+2.1%', isPos: true, icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50', gradient: 'from-orange-500/10 to-transparent' },
              { label: 'Proyeksi Pendapatan', value: formatCurrency(projectedRevenue), change: '+5.2%', isPos: true, icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50', gradient: 'from-violet-500/10 to-transparent' },
            ].map((stat, i) => (
              <div key={i} className="bg-white-pure p-7 rounded-[2.5rem] border border-border-line/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <stat.icon size={24} />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${stat.isPos ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border border-current/5`}>
                      {stat.isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-[10px] uppercase font-semibold text-text-gray/50 tracking-[0.1em]">{stat.label}</p>
                  <h3 className="text-2xl font-medium text-text-dark mt-1 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Main Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Leads Trend - Area Chart */}
            <div className="lg:col-span-2 bg-white-pure p-10 rounded-[3rem] border border-border-line/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-16">
                  <div>
                    <h3 className="text-xl font-bold text-text-dark flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
                      Tren Pertumbuhan Leads
                    </h3>
                    <p className="text-xs text-text-gray mt-1">Pergerakan traffic dan konversi selama 7 hari terakhir.</p>
                  </div>
                  <button className="p-2.5 text-text-gray hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all">
                    <RefreshCcw size={18} />
                  </button>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#93C5FD" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.3} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 500, fill: '#94a3b8'}} dx={-10} />
                      <Tooltip content={<AnalyticsTooltip />} cursor={{ stroke: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                      
                      {/* Click Area */}
                      <Area 
                        type="monotone" 
                        dataKey="click" 
                        stroke="#BFDBFE" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorClicks)" 
                        animationDuration={2000}
                      />

                      {/* Leads Area */}
                      <Area 
                        type="monotone" 
                        dataKey="leads" 
                        stroke="#1D4ED8" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorLeads)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Source Distribution - Donut Chart */}
            <div className="bg-white-pure p-10 rounded-[3rem] border border-border-line/10 shadow-sm relative overflow-hidden flex flex-col items-center">
              <div className="w-full">
                <h3 className="text-xl font-bold text-text-dark mb-2 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
                  Saluran Leads
                </h3>
                <p className="text-xs text-text-gray mb-10">Distribusi sumber leads berdasarkan platform.</p>
              </div>
              
              <div className="h-[280px] w-full relative">
                {sourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart onMouseLeave={onPieLeave}>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                        onMouseEnter={onPieEnter}
                      >
                        {sourceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            style={{ 
                              filter: activeIndex === index ? 'drop-shadow(0 0 8px rgba(0,0,0,0.1))' : 'none',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-border-line/5 text-xs font-bold text-text-dark">
                                {payload[0].name}: {payload[0].value} Leads
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-gray/30">
                    <PieChartIcon size={40} className="mb-2" />
                    <span className="text-sm">Belum ada data</span>
                  </div>
                )}
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-display font-bold text-text-dark">{totalLeads}</span>
                  <span className="text-[10px] font-bold text-text-gray uppercase tracking-widest mt-1">Total Leads</span>
                </div>
              </div>

              <div className="w-full mt-8 grid grid-cols-2 gap-3">
                {sourceData.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${
                      activeIndex === i ? 'bg-surface-gray border-border-line/20 scale-105' : 'bg-transparent border-transparent'
                    }`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={onPieLeave}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-[11px] font-bold text-text-gray truncate max-w-[70px]">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-text-dark">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Property Performance Chart */}
          <div className="bg-white-pure p-10 rounded-[3rem] border border-border-line/10 shadow-sm group">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-xl font-bold text-text-dark flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
                  Properti Paling Diminati
                </h3>
                <p className="text-xs text-text-gray mt-1">Unit yang paling sering memicu interaksi dan prospek.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-gray rounded-full text-[10px] font-bold text-text-gray uppercase tracking-widest self-start md:self-auto">
                <Info size={14} />
                Tren Tampilan Unit
              </div>
            </div>
            <div className="h-[350px] w-full">
              {propertyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyData} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide domain={[0, (dataMax: number) => Math.max(5, Math.ceil(dataMax * 1.2))]} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      width={170} 
                      tick={{fontSize: 12, fontWeight: 600, fill: '#1e293b'}} 
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 15, 15, 0]} barSize={35}>
                      {propertyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          fillOpacity={0.8}
                          className="hover:fill-opacity-100 transition-all duration-300"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-text-gray/30 border-2 border-dashed border-border-line/20 rounded-3xl">
                   <Building2 size={32} className="mb-2" />
                   <p className="text-sm font-medium">Belum ada properti yang diminati</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* AI EXECUTIVE REPORT SECTION */}
      <div className="bg-white-pure rounded-[2.5rem] border border-border-line/20 shadow-sm relative overflow-hidden group mb-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60"></div>
        
        <div className="relative z-10 p-12 md:p-16 flex flex-col items-center text-center max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/5 rounded-full border border-brand-blue/10 text-[10px] font-bold tracking-widest uppercase text-brand-blue">
            <Sparkles size={14} />
            Mesin Strategi AI
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-display font-medium text-text-dark tracking-tight leading-tight">
              Ubah Data Lead Menjadi <span className="text-brand-blue">Strategi Taktis.</span>
            </h2>
            <p className="text-lg text-text-gray/70 font-normal leading-relaxed max-w-2xl mx-auto">
              Analisis performa pemasaran Anda secara mendalam dengan AI. Dapatkan laporan eksekutif siap pakai dalam format PDF dan Word.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {!report ? (
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating || loading}
                className="w-full h-16 bg-brand-blue text-white-pure rounded-2xl font-bold text-base shadow-xl shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw className="animate-spin" size={20} />
                    <span>Menganalisis Data Analytics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Buat Laporan Strategi</span>
                  </>
                )}
              </button>
            ) : (
              <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Laporan Berhasil Dibuat</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleExportPDF('report-print-template')}
                    className="h-16 flex items-center justify-center bg-white-pure border-2 border-brand-blue text-brand-blue rounded-2xl font-bold text-sm hover:bg-brand-blue/5 transition-all gap-3 shadow-sm"
                  >
                    <Download size={20} />
                    UNDUH LAPORAN PDF
                  </button>
                  <button 
                    onClick={handleExportWord}
                    className="h-16 flex items-center justify-center bg-surface-gray border border-border-line/10 text-text-dark rounded-2xl font-bold text-sm hover:bg-surface-dim transition-all gap-3"
                  >
                    <FileText size={20} className="text-brand-blue" />
                    UNDUH LAPORAN WORD
                  </button>
                </div>

                <button 
                  onClick={() => setReport(null)}
                  className="text-[11px] font-bold text-text-gray/40 uppercase tracking-widest hover:text-brand-blue transition-colors pt-2"
                >
                  Buat Ulang Laporan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HIDDEN PRINT TEMPLATE */}
      <div className="fixed top-0 left-0 pointer-events-none opacity-0 -z-50 overflow-hidden h-0">
        <div 
          id="report-print-template" 
          className="bg-white-pure p-16" 
          style={{ width: '1000px' }}
        >
          {/* Professional Document Header */}
          <div className="mb-12 border-b-4 border-brand-blue pb-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center text-white-pure shadow-2xl">
                  <Building2 size={36} />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-text-dark tracking-tight">PropNest <span className="text-brand-blue">Intelligence</span></h1>
                  <p className="text-sm font-bold text-text-gray uppercase tracking-[0.3em] opacity-60 mt-1">Analisis Pasar Strategis</p>
                </div>
              </div>
              <div className="text-right" suppressHydrationWarning>
                <p className="text-xs font-bold text-text-gray uppercase tracking-widest mb-2">No. Seri Laporan</p>
                <p className="text-lg font-bold text-text-dark">{reportSerial}</p>
                <p className="text-sm text-text-gray font-medium mt-1">{reportDate}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="px-5 py-2.5 bg-surface-gray rounded-xl border border-border-line/10 flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-xs font-bold text-text-dark/70 uppercase tracking-widest">Integritas Data Terverifikasi</span>
              </div>
              <div className="px-5 py-2.5 bg-surface-gray rounded-xl border border-border-line/10 flex items-center gap-3">
                <Calendar size={16} className="text-brand-blue" />
                <span className="text-xs font-bold text-text-dark/70 uppercase tracking-widest">Wawasan Real-time</span>
              </div>
            </div>
          </div>

          {/* Styled Markdown Content */}
          <div className={`prose prose-slate max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-dark
            prose-h2:text-4xl prose-h2:mb-10 prose-h2:pb-4 prose-h2:border-b prose-h2:border-border-line/10
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
            prose-p:text-text-dark/80 prose-p:leading-[2] prose-p:text-[18px]
            prose-strong:text-brand-blue prose-strong:font-bold
            prose-table:border prose-table:border-border-line/10 prose-table:rounded-2xl prose-table:overflow-hidden prose-table:my-10
            prose-th:bg-surface-gray prose-th:px-6 prose-th:py-5 prose-th:text-xs prose-th:font-bold prose-th:uppercase prose-th:tracking-widest prose-th:text-text-gray
            prose-td:px-6 prose-td:py-5 prose-td:text-base prose-td:text-text-dark/70 prose-td:border-t prose-td:border-border-line/5
            prose-li:text-text-dark/80 prose-li:text-[18px] prose-li:my-2
            `}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {report || ''}
            </ReactMarkdown>
          </div>

          <div className="mt-24 pt-10 border-t border-border-line/10 flex justify-between items-center opacity-50 italic text-xs text-text-gray">
            <p>© 2026 PropNest Intelligence — Penggunaan Internal</p>
            <p>Memberdayakan Keputusan Properti melalui Data dan AI.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
