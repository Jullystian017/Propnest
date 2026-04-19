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
  X,
  ArrowDownRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  temperature: string;
  status: string;
  date: string;
  source: string;
}

export default function LeadsPage() {
  const supabase = createClient();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilter, setTempFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleConvertToDeal = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === 'Closing') return;

    setConvertingId(leadId);
    try {
      // Check if deal already exists for this lead to prevent duplicates
      const { data: existingDeal } = await supabase
        .from('deals')
        .select('id')
        .eq('lead_id', leadId)
        .maybeSingle();

      if (existingDeal) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Closing' } : l));
        alert('Lead ini sudah terdaftar di Pipeline!');
        return;
      }

      let dealTitle = lead.property || 'Properti Baru';
      let dealPrice = 0;
      let dealImage = '';

      // If property is a UUID, fetch real details
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lead.property);
      
      if (isUuid) {
        const { data: propData } = await supabase
          .from('properties')
          .select('title, price, images')
          .eq('id', lead.property)
          .single();
        
        if (propData) {
          dealTitle = propData.title;
          dealPrice = propData.price;
          dealImage = propData.images?.[0] || '';
        }
      }

      // 1. Create a new deal in the deals table
      const { error: dealError } = await supabase
        .from('deals')
        .insert([{
          lead_id: leadId,
          title: dealTitle,
          client_name: lead.name,
          price: dealPrice,
          status: 'Survey',
          priority: lead.temperature === 'Hot' ? 'High' : (lead.temperature === 'Warm' ? 'Medium' : 'Low'),
          source: lead.source,
          display_id: `DL-${Math.floor(1000 + Math.random() * 9000)}`,
          property_image: dealImage
        }]);

      if (dealError) throw dealError;

      // 2. Update lead status to 'Closing'
      const { error: leadError } = await supabase
        .from('leads')
        .update({ status: 'Closing' })
        .eq('id', leadId);

      if (leadError) throw leadError;

      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Closing' } : l));
      alert('Berhasil dipindahkan ke Pipeline Penjualan!');
    } catch (err) {
      console.error('Error converting lead to deal:', err);
      alert('Gagal memindahkan ke Pipeline.');
    } finally {
      setConvertingId(null);
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedLeads = data.map((l: any) => ({
          id: l.id,
          name: l.name || 'Anonim',
          email: l.email || '-',
          phone: l.phone || '-',
          property: l.property_id || l.intent || 'Umum',
          temperature: l.temperature || 'Warm',
          status: l.status || 'Baru',
          date: l.created_at,
          source: l.source || 'Website'
        }));
        setLeads(formattedLeads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.lead-action-menu')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [supabase]);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (error) throw error;
      
      // Update local state
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      setOpenDropdownId(null);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Gagal mengupdate status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lead ini?')) return;
    
    setUpdatingId(leadId);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);
        
      if (error) throw error;
      
      setLeads(prev => prev.filter(l => l.id !== leadId));
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('Gagal menghapus lead');
    } finally {
      setUpdatingId(null);
    }
  };

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
    'new': 'bg-emerald-50 text-emerald-600 border-emerald-100',
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

      {/* Stats Cards - Premium Summary Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total CRM Leads', value: leads.length.toString(), change: '+12%', isPos: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', gradient: 'from-blue-500/10 to-transparent' },
          { label: 'Prospek Hot', value: leads.filter(l => l.temperature === 'Hot').length.toString(), change: 'Hot', isPos: true, icon: Flame, color: 'text-red-600', bg: 'bg-red-50', gradient: 'from-red-500/10 to-transparent' },
          { label: 'Closing Terverifikasi', value: leads.filter(l => l.status === 'Closing').length.toString(), change: '+2', isPos: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
        ].map((stat, i) => (
          <div key={i} className="bg-white-pure p-6 rounded-[2.2rem] border border-border-line/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <stat.icon size={22} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${stat.isPos ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} border border-current/5`}>
                  {stat.isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-[10px] uppercase font-semibold text-text-gray/50 tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-medium text-text-dark mt-1 tracking-tight">{stat.value}</h3>
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
      <div className="bg-white-pure rounded-[2rem] border border-border-line/20 shadow-sm min-h-[400px] relative">
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
        <div className="overflow-x-auto overflow-y-visible pb-40">
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
                            <tr 
                                key={lead.id} 
                                className="hover:bg-surface-gray/10 transition-all group"
                            >
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
                                        {lead.status === 'new' ? 'Baru' : lead.status}
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
                                        <button 
                                            onClick={() => handleConvertToDeal(lead.id)}
                                            disabled={convertingId === lead.id || lead.status === 'Closing'}
                                            className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 group/btn flex items-center justify-center ${
                                                lead.status === 'Closing' 
                                                ? 'bg-brand-blue text-white-pure opacity-50 cursor-not-allowed' 
                                                : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue hover:text-white-pure'
                                            }`}
                                            title="Jadikan Deal"
                                        >
                                            {convertingId === lead.id ? (
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            ) : lead.status === 'Closing' ? (
                                                <Check size={16} strokeWidth={2} />
                                            ) : (
                                                <TrendingUp size={16} strokeWidth={2} />
                                            )}
                                        </button>
                                        <div className="relative lead-action-menu">
                                            <button 
                                                suppressHydrationWarning
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.nativeEvent.stopImmediatePropagation();
                                                    setOpenDropdownId(openDropdownId === lead.id ? null : lead.id);
                                                }}
                                                className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 group/btn ${
                                                    openDropdownId === lead.id 
                                                    ? 'bg-brand-blue text-white-pure' 
                                                    : 'bg-surface-gray/50 text-text-gray hover:bg-brand-blue hover:text-white-pure'
                                                }`}
                                            >
                                                {updatingId === lead.id ? (
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <MoreVertical size={16} strokeWidth={1.5} className={`transition-transform duration-300 pointer-events-none ${openDropdownId === lead.id ? 'rotate-90' : 'group-hover/btn:rotate-90'}`} />
                                                )}
                                            </button>

                                            {openDropdownId === lead.id && (
                                                <div 
                                                    suppressHydrationWarning
                                                    className="absolute right-0 top-full mt-2 w-48 bg-white-pure rounded-2xl shadow-2xl border border-border-line/10 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="px-3 py-2 text-[10px] font-bold text-text-gray/40 uppercase tracking-widest border-b border-border-line/5 bg-surface-gray/10">
                                                        Ubah Status
                                                    </div>
                                                    <div className="p-1">
                                                        {['Baru', 'Dihubungi', 'Tertarik'].map(status => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleUpdateStatus(lead.id, status)}
                                                                className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                                                                    lead.status === status 
                                                                    ? 'bg-brand-blue/5 text-brand-blue' 
                                                                    : 'text-text-gray hover:bg-surface-gray hover:text-text-dark'
                                                                }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="border-t border-border-line/5 p-1">
                                                        <button 
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                                                        >
                                                            <X size={14} /> Hapus Lead
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
