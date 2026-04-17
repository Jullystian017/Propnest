'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronDown,
  Info,
  FileText,
  Printer
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
import { MOCK_LEADS } from '@/lib/leads-mock';
import { generateExecutiveReport } from '@/lib/reports/actions';

export default function AnalyticsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30 Hari');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // --- Data Processing for Charts ---
  
  // 1. Leads by Source (Pie Chart)
  const sourceData = useMemo(() => {
    const counts = MOCK_LEADS.reduce((acc: any, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ 
      name: key, 
      value: counts[key],
      percentage: Math.round((counts[key] / MOCK_LEADS.length) * 100)
    }));
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const GRADIENTS = [
    { start: '#3b82f6', end: '#2563eb' },
    { start: '#10b981', end: '#059669' },
    { start: '#f59e0b', end: '#d97706' },
    { start: '#ef4444', end: '#dc2626' },
    { start: '#8b5cf6', end: '#7c3aed' },
  ];

  // 2. Leads Trend (Area Chart - Mocked based on daily data)
  const trendData = [
    { name: 'Sen', leads: 12, click: 40 },
    { name: 'Sel', leads: 18, click: 55 },
    { name: 'Rab', leads: 15, click: 48 },
    { name: 'Kam', leads: 25, click: 70 },
    { name: 'Jum', leads: 32, click: 85 },
    { name: 'Sab', leads: 28, click: 75 },
    { name: 'Min', leads: 40, click: 95 },
  ];

  const AnalyticsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-border-line/10 backdrop-blur-xl">
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
    const counts = MOCK_LEADS.reduce((acc: any, lead) => {
      acc[lead.property] = (acc[lead.property] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .map(key => ({ 
        name: key.split(' ').slice(-2).join(' '), 
        full: key, 
        value: counts[key] 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReport(null);
    try {
      const result = await generateExecutiveReport();
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

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-medium text-text-dark tracking-tight">Market Intelligence</h1>
          <p className="text-text-gray font-normal text-base mt-2">Dapatkan pandangan 360 derajat terhadap ekosistem pemasaran Anda.</p>
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

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: MOCK_LEADS.length, change: '+12.5%', isPos: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-500/10 to-transparent' },
          { label: 'Conversion Rate', value: '4.8%', change: '+0.4%', isPos: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
          { label: 'Chatbot Clicks', value: '1,284', change: '-2.1%', isPos: false, icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50', gradient: 'from-orange-500/10 to-transparent' },
          { label: 'Projected Revenue', value: 'Rp 8,4M', change: '+5.2%', isPos: true, icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50', gradient: 'from-violet-500/10 to-transparent' },
        ].map((stat, i) => (
          <div key={i} className="bg-white-pure p-7 rounded-[2.5rem] border border-border-line/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${stat.isPos ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border border-current/10`}>
                  {stat.isPos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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
                  <Tooltip content={<AnalyticsTooltip />} />
                  
                  {/* Click Area (Lighter Layer) */}
                  <Area 
                    type="monotone" 
                    dataKey="click" 
                    stroke="#BFDBFE" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorClicks)" 
                    animationDuration={2000}
                  />

                  {/* Leads Area (Darker/Main Layer) */}
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
              <PieChartIcon size={20} className="text-brand-blue" />
              Lead Channels
            </h3>
            <p className="text-xs text-text-gray mb-10">Distribusi sumber leads berdasarkan platform.</p>
          </div>
          
          <div className="h-[280px] w-full relative">
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
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-display font-bold text-text-dark">{MOCK_LEADS.length}</span>
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
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-bold text-text-dark">Heatmap Properti Populer</h3>
            <p className="text-xs text-text-gray mt-1">Unit yang paling sering memicu interaksi chatbot dan inquiries.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-surface-gray rounded-full text-[10px] font-bold text-text-gray uppercase tracking-widest">
            <Info size={14} />
            Unit View Trend
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propertyData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={140} 
                tick={{fontSize: 13, fontWeight: 700, fill: '#1e293b'}} 
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
        </div>
      </div>

      {/* AI EXECUTIVE REPORT SECTION - CLEAN PROFESSIONAL RE-DESIGN */}
      <div className="bg-white-pure rounded-[2.5rem] border border-border-line/20 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Intro */}
          <div className="p-12 md:p-16 space-y-8 lg:border-r border-border-line/10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue/5 rounded-full border border-brand-blue/10 text-[10px] font-bold tracking-widest uppercase text-brand-blue">
              <Sparkles size={14} />
              AI Strategy Engine
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-text-dark tracking-tight leading-tight">
                Ubah Data Lead <br /> Menjadi <span className="text-brand-blue">Strategi Taktis.</span>
              </h2>
              <p className="text-base text-text-gray/70 font-normal leading-relaxed max-w-md">
                Gunakan AI kami untuk menganalisis perilaku prospek Anda secara mendalam. Dapatkan laporan eksekutif yang berisi langkah pasti untuk meningkatkan konversi hari ini.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="px-8 py-4 bg-brand-blue text-white-pure rounded-2xl font-bold text-sm shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all flex items-center gap-2.5 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCcw className="animate-spin" size={18} />
                    <span>Menganalisis Data...</span>
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    <span>Generate Executive Report</span>
                  </>
                )}
              </button>
              
              {report && (
                <button className="h-14 w-14 flex items-center justify-center bg-surface-gray border border-border-line/10 rounded-2xl text-text-gray hover:text-brand-blue transition-all shadow-sm">
                  <Download size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Report Viewer */}
          <div className="p-12 md:p-16 bg-surface-gray/30 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-blue/5 via-transparent to-transparent opacity-50"></div>
            
            <div className="relative h-full min-h-[400px] bg-white-pure rounded-3xl border border-border-line/20 shadow-xl shadow-brand-blue/5 flex flex-col overflow-hidden">
              {report ? (
                <div className="flex-1 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between p-6 border-b border-border-line/10 bg-white-pure/50 backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>
                      <span className="text-[10px] font-bold text-text-gray uppercase tracking-widest">Strategy Briefing</span>
                    </div>
                    <button className="p-2 text-text-gray/40 hover:text-brand-blue transition-colors">
                      <Printer size={16} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-hide">
                    <div className="prose prose-slate max-w-none">
                      <div className="text-text-dark/80 text-sm leading-[1.8] whitespace-pre-line font-medium tracking-tight">
                        {report}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-border-line/5 bg-surface-gray/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/10">
                          <Sparkles size={16} />
                        </div>
                        <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest">Model L3.3 Vision</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded border border-emerald-100 uppercase">Verified AI</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-surface-gray flex items-center justify-center text-text-gray/20 border border-border-line/5 mb-2">
                    <BarChart3 size={36} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-text-dark tracking-tight">Siap Menganalisis</h4>
                    <p className="text-sm text-text-gray/50 font-normal leading-relaxed max-w-[240px]">
                      Klik tombol untuk memulai sesi analisis data cerdas.
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-border-line/30"></div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CheckCircle2 = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
