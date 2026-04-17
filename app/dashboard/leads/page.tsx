'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronDown,
  ArrowUpRight,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Building2,
  TrendingUp,
  Flame,
  Thermometer,
  Snowflake,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MOCK_LEADS, Lead } from '@/lib/leads-mock';

export default function LeadsPage() {
  const supabase = createClient();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilter, setTempFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

  useEffect(() => {
    async function fetchLeads() {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // If data exists in Supabase, map it to our Lead interface
        if (data && data.length > 0) {
          const formattedLeads = data.map((l: any) => ({
            id: l.id.substring(0, 8),
            name: l.name || 'Anonim',
            email: l.email || '-',
            phone: l.phone || '-',
            property: l.intent || 'Umum', // Using intent as property name if missing
            temperature: l.temperature || (Math.random() > 0.5 ? 'Hot' : 'Warm'),
            status: l.status || 'Baru',
            date: l.created_at,
            source: l.source || 'AI Chatbot'
          }));
          setLeads(formattedLeads);
        } else {
          // Fallback to mock data for demonstration
          setLeads(MOCK_LEADS);
        }
      } catch (err) {
        console.error('Error fetching leads:', err);
        setLeads(MOCK_LEADS);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [supabase]);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTemp = tempFilter === 'Semua' || lead.temperature === tempFilter;
    const matchesStatus = statusFilter === 'Semua' || lead.status === statusFilter;
    
    return matchesSearch && matchesTemp && matchesStatus;
  });

  const getTempStyles = (temp: string) => {
    switch (temp) {
      case 'Hot': return { 
        bg: 'bg-red-50 text-red-600 border-red-200/50', 
        icon: <Flame size={12} className="fill-current" />,
        label: 'Hot'
      };
      case 'Warm': return { 
        bg: 'bg-amber-50 text-amber-600 border-amber-200/50', 
        icon: <Thermometer size={12} className="fill-current" />,
        label: 'Warm'
      };
      default: return { 
        bg: 'bg-blue-50 text-blue-600 border-blue-200/50', 
        icon: <Snowflake size={12} className="fill-current" />,
        label: 'Cold'
      };
    }
  };

  const statusColors: Record<string, string> = {
    'Baru': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Dihubungi': 'bg-blue-50 text-blue-600 border-blue-100',
    'Tertarik': 'bg-violet-50 text-violet-600 border-violet-100',
    'Closing': 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
    'Batal': 'bg-gray-50 text-gray-400 border-gray-100'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-medium text-text-dark tracking-tight">CRM Leads</h1>
          <p className="text-sm font-normal text-text-gray/50">Kelola prospek dan kualifikasi calon pembeli Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="px-5 py-3 bg-white-pure border border-border-line/20 rounded-2xl text-sm font-medium text-text-dark hover:bg-surface-gray transition-all flex items-center gap-2 active:scale-95 shadow-sm">
                <Calendar size={18} strokeWidth={1.5} />
                Laporan Bulanan
            </button>
            <button className="px-5 py-3 bg-brand-blue text-white-pure rounded-2xl text-sm font-medium shadow-lg shadow-brand-blue/10 hover:bg-brand-blue-deep transition-all flex items-center gap-2 active:scale-95">
              <TrendingUp size={18} strokeWidth={1.5} />
              Analisis AI
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Leads', value: leads.length.toString(), sub: '+12% bulan ini', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Prospek Hot', value: leads.filter(l => l.temperature === 'Hot').length.toString(), sub: 'Butuh follow-up segera', icon: Flame, color: 'text-red-600 bg-red-50' },
          { label: 'Konversi', value: '8.4%', sub: 'Target: 10%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white-pure p-6 rounded-[2rem] border border-border-line/20 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
              <stat.icon size={22} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-text-gray/40 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-medium text-text-dark">{stat.value}</h3>
              <p className="text-[9px] text-text-gray/50 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white-pure p-4 rounded-3xl border border-border-line/20 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray/30" size={18} strokeWidth={1.5} />
            <input 
                type="text" 
                placeholder="Cari nama, email, atau properti..."
                className="w-full bg-surface-gray/30 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-normal focus:ring-2 focus:ring-brand-blue/10 transition-all placeholder:text-text-gray/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <select 
              value={tempFilter}
              onChange={(e) => setTempFilter(e.target.value)}
              className="px-4 py-3 bg-white-pure border border-border-line/10 rounded-2xl text-xs font-medium text-text-gray focus:outline-none focus:ring-2 focus:ring-brand-blue/5"
            >
                <option value="Semua">Suhu: Semua</option>
                <option value="Hot">Suhu: Hot</option>
                <option value="Warm">Suhu: Warm</option>
                <option value="Cold">Suhu: Cold</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white-pure border border-border-line/10 rounded-2xl text-xs font-medium text-text-gray focus:outline-none focus:ring-2 focus:ring-brand-blue/5"
            >
                <option value="Semua">Status: Semua</option>
                <option value="Baru">Baru</option>
                <option value="Dihubungi">Dihubungi</option>
                <option value="Tertarik">Tertarik</option>
                <option value="Closing">Closing</option>
            </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white-pure rounded-[2rem] border border-border-line/20 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-2 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin"></div>
            <p className="text-xs text-text-gray/40 font-medium tracking-widest uppercase">Memuat Prospek...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center p-10">
            <div className="w-20 h-20 bg-surface-gray/50 rounded-[2rem] flex items-center justify-center text-text-gray/20 mb-6">
              <Users size={40} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-medium text-text-dark">Tidak Ada Prospek</h3>
            <p className="text-sm text-text-gray/40 max-w-xs mt-2">Coba sesuaikan pencarian atau filter Anda untuk menemukan leads.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface-gray/20 text-[10px] font-medium text-text-gray/40 uppercase tracking-widest border-b border-border-line/5">
                        <th className="p-6 pl-10">Nama Prospek</th>
                        <th className="p-6">Properti & Sumber</th>
                        <th className="p-6">Suhu</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Kontak</th>
                        <th className="p-6 pr-10">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-line/5">
                    {filteredLeads.map((lead) => {
                        const tempStyle = getTempStyles(lead.temperature);
                        return (
                            <tr key={lead.id} className="hover:bg-surface-gray/10 transition-all group">
                                <td className="p-6 pl-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-semibold shadow-sm transition-transform group-hover:scale-105 duration-300 ${
                                            lead.temperature === 'Hot' ? 'bg-red-100 text-red-600' : 
                                            lead.temperature === 'Warm' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-text-dark group-hover:text-brand-blue transition-colors">{lead.name}</div>
                                            <div className="text-[10px] text-text-gray/40 font-normal mt-0.5 flex items-center gap-1.5">
                                                <Calendar size={10} /> {new Date(lead.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="text-xs font-medium text-text-dark/80 line-clamp-1 truncate max-w-[180px]">{lead.property}</div>
                                    <div className="text-[10px] text-text-gray/40 mt-0.5 flex items-center gap-1">
                                        <Building2 size={10} /> {lead.source}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium border ${tempStyle.bg} border-line/10`}>
                                        {tempStyle.icon}
                                        {tempStyle.label}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-medium border ${statusColors[lead.status]}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-xs text-text-dark/70">
                                            <Phone size={12} className="text-text-gray/30" />
                                            {lead.phone}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-text-gray/40">
                                            <Mail size={12} className="text-text-gray/30" />
                                            {lead.email}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 pr-10">
                                    <div className="flex items-center gap-2">
                                        <a 
                                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm"
                                            title="Chat WhatsApp"
                                        >
                                            <MessageCircle size={16} strokeWidth={2} />
                                        </a>
                                        <button className="p-2.5 bg-surface-gray/50 text-text-gray hover:bg-brand-blue hover:text-white-pure rounded-xl transition-all shadow-sm active:scale-95 group/btn">
                                            <MoreVertical size={16} strokeWidth={1.5} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination & Export */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10">
          <div className="text-xs text-text-gray/40 font-medium">
              Menampilkan {filteredLeads.length} dari {leads.length} prospek
          </div>
          <div className="flex items-center gap-3">
              <button className="px-5 py-2.5 bg-white-pure border border-border-line/10 rounded-xl text-[11px] font-medium text-text-gray hover:bg-surface-gray transition-all">Previous</button>
              <div className="flex items-center gap-1">
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-blue text-white-pure text-[11px] font-medium shadow-sm">1</button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-border-line/5 text-[11px] font-medium text-text-gray hover:bg-white-pure transition-all">2</button>
              </div>
              <button className="px-5 py-2.5 bg-white-pure border border-border-line/10 rounded-xl text-[11px] font-medium text-text-gray hover:bg-surface-gray transition-all">Next</button>
          </div>
      </div>

    </div>
  );
}
