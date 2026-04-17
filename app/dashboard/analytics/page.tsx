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

  // --- Data Processing for Charts ---
  
  // 1. Leads by Source (Pie Chart)
  const sourceData = useMemo(() => {
    const counts = MOCK_LEADS.reduce((acc: any, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // 2. Leads Trend (Area Chart - Mocked based on dates)
  const trendData = [
    { name: 'Minggu 1', leads: 42, clicks: 120 },
    { name: 'Minggu 2', leads: 58, clicks: 180 },
    { name: 'Minggu 3', leads: 48, clicks: 150 },
    { name: 'Minggu 4', leads: 72, clicks: 240 },
  ];

  // 3. Property Performance (Bar Chart)
  const propertyData = useMemo(() => {
    const counts = MOCK_LEADS.reduce((acc: any, lead) => {
      acc[lead.property] = (acc[lead.property] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .map(key => ({ name: key.split(' ').slice(-2).join(' '), full: key, value: counts[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
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

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-medium text-text-dark tracking-tight">Market Analytics</h1>
          <p className="text-text-gray font-normal text-sm mt-1">Pantau performa kampanye dan konversi leads secara real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white-pure border border-border-line/10 rounded-2xl p-1 flex shadow-sm">
            {['7 Hari', '30 Hari', '90 Hari'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timeRange === range ? 'bg-brand-blue text-white-pure shadow-md shadow-brand-blue/20' : 'text-text-gray hover:text-text-dark'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-3 bg-white-pure border border-border-line/10 rounded-2xl text-text-gray hover:text-brand-blue transition-all shadow-sm">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Leads', value: MOCK_LEADS.length, change: '+12.5%', isPos: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Conversion Rate', value: '4.8%', change: '+0.4%', isPos: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Chatbot Clicks', value: '1,284', change: '-2.1%', isPos: false, icon: MousePointerClick, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Estimated Revenue', value: 'Rp 8,4M', change: '+5.2%', isPos: true, icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white-pure p-6 rounded-[2rem] border border-border-line/10 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={22} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.isPos ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {stat.isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.change}
              </div>
            </div>
            <p className="text-[10px] uppercase font-bold text-text-gray tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-display font-bold text-text-dark mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leads Trend - Area Chart */}
        <div className="lg:col-span-2 bg-white-pure p-8 rounded-[2.5rem] border border-border-line/10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <TrendingUp size={20} className="text-brand-blue" />
              Tren Pertumbuhan Leads
            </h3>
            <button className="text-text-gray hover:text-text-dark">
              <RefreshCcw size={16} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Distribution - Donut Chart */}
        <div className="bg-white-pure p-8 rounded-[2.5rem] border border-border-line/10 shadow-sm">
          <h3 className="text-lg font-bold text-text-dark mb-8 flex items-center gap-2">
            <PieChartIcon size={20} className="text-brand-blue" />
            Lead Sources
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {sourceData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-text-gray">{item.name}</span>
                </div>
                <span className="text-text-dark">{Math.round((item.value / MOCK_LEADS.length) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Performance Chart */}
      <div className="bg-white-pure p-8 rounded-[2.5rem] border border-border-line/10 shadow-sm">
        <h3 className="text-lg font-bold text-text-dark mb-8">Top 5 Properti Paling Diminati</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propertyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{fontSize: 12, fontWeight: 700, fill: '#1e293b'}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                {propertyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI AI EXECUTIVE REPORT SECTION */}
      <div className="bg-brand-blue-deep rounded-[3rem] p-10 md:p-14 text-white-pure relative overflow-hidden shadow-2xl shadow-brand-blue/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white-pure/10 backdrop-blur-md rounded-full border border-white-pure/20 text-xs font-bold tracking-widest uppercase mb-4">
              <Sparkles size={14} className="text-amber-300" />
              AI Executive Power
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-medium leading-tight tracking-tight">
              Laporan Strategis <br /> <span className="text-white-pure/60 italic font-normal">Buatan AI.</span>
            </h2>
            
            <p className="text-lg text-white-pure/70 font-normal leading-relaxed max-w-xl">
              Gunakan kecerdasan buatan untuk menganalisis ribuan data leads Bapak. Dapatkan insight eksklusif mana yang harus di-*follow up* dan platform mana yang paling menguntungkan.
            </p>

            <div className="py-2">
               <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="group relative px-10 py-5 bg-white-pure text-brand-blue-deep rounded-full font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
               >
                 {isGenerating ? (
                   <>
                     <RefreshCcw className="animate-spin" size={20} />
                     <span>Menganalisis Data...</span>
                   </>
                 ) : (
                   <>
                     <FileText size={20} />
                     <span>Generate Laporan Eksekutif</span>
                   </>
                 )}
               </button>
            </div>
          </div>

          <div className="w-full lg:w-[450px]">
            <div className="bg-white-pure/[0.03] backdrop-blur-xl border border-white-pure/10 rounded-[2.5rem] p-4 min-h-[400px] flex flex-col">
              {report ? (
                <div className="flex-1 flex flex-col">
                   <div className="flex items-center justify-between p-4 border-b border-white-pure/10 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-white-pure/40" />
                        <span className="text-[10px] font-bold text-white-pure/40 tracking-widest uppercase">Report Generated Successfully</span>
                      </div>
                      <button className="p-2 hover:bg-white-pure/10 rounded-full transition-colors">
                        <Printer size={16} className="text-white-pure/60" />
                      </button>
                   </div>
                   <div className="flex-1 max-h-[450px] overflow-y-auto px-4 prose prose-invert prose-sm">
                      <div className="text-white-pure/90 text-sm leading-relaxed whitespace-pre-line font-medium">
                        {report}
                      </div>
                   </div>
                   <div className="mt-6 p-4 bg-white-pure/10 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center border border-white-pure/20">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white-pure/50 uppercase">Analysis Engine</p>
                          <p className="text-xs font-bold">Llama 3.3 Versatile</p>
                        </div>
                      </div>
                      <button className="text-white-pure/60 hover:text-white-pure transition-colors">
                        <Download size={18} />
                      </button>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-white-pure/5 border border-white-pure/10 flex items-center justify-center text-white-pure/20">
                    <BarChart3 size={40} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold">Belum Ada Laporan</h4>
                    <p className="text-sm text-white-pure/40 font-normal">Klik tombol di samping untuk mulai membedah strategi marketing Anda hari ini.</p>
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
