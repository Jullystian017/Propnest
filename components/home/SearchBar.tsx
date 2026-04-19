'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, DollarSign, MapPin, Search, ChevronDown, Check } from 'lucide-react';

const TIPE_OPSI = ['Rumah Modern', 'Apartemen', 'Villa', 'Ruko', 'Tanah'];
const HARGA_OPSI = ['< Rp 500jt', 'Rp 500jt - 1M', 'Rp 1M - 5M', 'Rp 5M - 10M', '> Rp 10M'];
const LOKASI_OPSI = ['Semarang', 'Purwokerto', 'Solo', 'Yogyakarta', 'Salatiga'];

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState('Beli');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    tipe: 'Rumah Modern',
    harga: 'Rp 500jt - 1M',
    lokasi: ''
  });
  const [lokasiQuery, setLokasiQuery] = useState('');
  const [filteredLokasi, setFilteredLokasi] = useState(LOKASI_OPSI);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside & Load recent searches
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    
    // Load from localStorage
    const saved = localStorage.getItem('propnest_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const router = useRouter();

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const selectOption = (category: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [category]: value }));
    if (category === 'lokasi') {
      setLokasiQuery(value);
    }
    setOpenDropdown(null);
  };

  const handleLokasiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLokasiQuery(val);
    setFilters(prev => ({ ...prev, lokasi: val }));
    
    const filtered = LOKASI_OPSI.filter(loc => 
      loc.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredLokasi(filtered);
    
    if (openDropdown !== 'lokasi') setOpenDropdown('lokasi');
  };

  const handleSearch = () => {
    // Save to recent searches if not empty
    if (filters.lokasi.trim()) {
      const updated = [filters.lokasi, ...recentSearches.filter(s => s !== filters.lokasi)].slice(0, 3);
      setRecentSearches(updated);
      localStorage.setItem('propnest_recent_searches', JSON.stringify(updated));
    }

    const params = new URLSearchParams({
      tab: activeTab,
      tipe: filters.tipe,
      harga: filters.harga,
      lokasi: filters.lokasi
    });
    router.push(`/cari?${params.toString()}`);
  };

  return (
    <div 
      className="bg-white-pure rounded-[2.5rem] p-4 lg:p-6 shadow-2xl max-w-full mx-auto -mb-32 relative z-30 border border-gray-100/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500" 
      ref={dropdownRef}
      suppressHydrationWarning
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <h2 className="text-xl md:text-2xl font-display font-medium text-text-dark max-w-xl">
          Temukan Tempat Sempurna untuk Menetap
        </h2>

        {/* Beli/Sewa Toggle */}
        <div className="relative flex bg-[#F1F1F3] p-1.5 rounded-full self-start xl:self-center">
          {/* Active indicator pill */}
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-brand-blue rounded-full shadow-md transition-all duration-300 ease-out ${
              activeTab === 'Sewa' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          
          <button
            onClick={() => setActiveTab('Beli')}
            suppressHydrationWarning
            className={`relative z-10 px-10 py-2.5 rounded-full text-xs font-semibold transition-colors duration-300 ${
              activeTab === 'Beli' ? 'text-white-pure' : 'text-text-gray/70 hover:text-text-dark'
            }`}
          >
            Beli
          </button>
          <button
            onClick={() => setActiveTab('Sewa')}
            suppressHydrationWarning
            className={`relative z-10 px-10 py-2.5 rounded-full text-xs font-semibold transition-colors duration-300 ${
              activeTab === 'Sewa' ? 'text-white-pure' : 'text-text-gray/70 hover:text-text-dark'
            }`}
          >
            Sewa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_180px] gap-4 items-end">
        {/* Tipe Properti */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-semibold text-text-gray uppercase tracking-widest block ml-4 opacity-60">Tipe Properti</label>
          <div 
            onClick={() => toggleDropdown('tipe')}
            className={`flex items-center justify-between p-5 rounded-[2rem] cursor-pointer transition-all border ${
              openDropdown === 'tipe' ? 'bg-white-pure border-brand-blue shadow-lg scale-[1.02]' : 'bg-[#F1F1F3] border-transparent hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home size={18} className="text-brand-blue" />
              <span className="text-sm font-semibold text-text-dark">{filters.tipe}</span>
            </div>
            <ChevronDown size={14} className={`text-text-gray transition-transform duration-300 ${openDropdown === 'tipe' ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {openDropdown === 'tipe' && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white-pure rounded-3xl shadow-2xl border border-gray-100 p-3 z-50 animate-fade-in">
              {TIPE_OPSI.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => selectOption('tipe', opt)}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <span className={`text-sm font-medium ${filters.tipe === opt ? 'text-brand-blue' : 'text-text-dark'}`}>{opt}</span>
                  {filters.tipe === opt && <Check size={16} className="text-brand-blue" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rentang Harga */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-semibold text-text-gray uppercase tracking-widest block ml-4 opacity-60">Rentang Harga</label>
          <div 
            onClick={() => toggleDropdown('harga')}
            className={`flex items-center justify-between p-5 rounded-[2rem] cursor-pointer transition-all border ${
              openDropdown === 'harga' ? 'bg-white-pure border-brand-blue shadow-lg scale-[1.02]' : 'bg-[#F1F1F3] border-transparent hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign size={18} className="text-brand-blue" />
              <span className="text-sm font-semibold text-text-dark">{filters.harga}</span>
            </div>
            <ChevronDown size={14} className={`text-text-gray transition-transform duration-300 ${openDropdown === 'harga' ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {openDropdown === 'harga' && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white-pure rounded-3xl shadow-2xl border border-gray-100 p-3 z-50 animate-fade-in">
              {HARGA_OPSI.map((opt) => (
                <div 
                  key={opt}
                  onClick={() => selectOption('harga', opt)}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <span className={`text-sm font-medium ${filters.harga === opt ? 'text-brand-blue' : 'text-text-dark'}`}>{opt}</span>
                  {filters.harga === opt && <Check size={16} className="text-brand-blue" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lokasi (Smart Input) */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-semibold text-text-gray uppercase tracking-widest block ml-4 opacity-60">Lokasi</label>
          <div 
            className={`flex items-center justify-between p-5 rounded-[2rem] transition-all border ${
              openDropdown === 'lokasi' ? 'bg-white-pure border-brand-blue shadow-lg scale-[1.02]' : 'bg-[#F1F1F3] border-transparent hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <MapPin size={18} className="text-brand-blue shrink-0" />
              <input 
                type="text"
                suppressHydrationWarning
                value={lokasiQuery}
                onChange={handleLokasiChange}
                onFocus={() => setOpenDropdown('lokasi')}
                placeholder="Cari Lokasi..."
                className="bg-transparent border-none outline-none text-sm font-semibold text-text-dark w-full placeholder:text-text-gray/50"
              />
            </div>
            <ChevronDown size={14} className={`text-text-gray transition-transform duration-300 ${openDropdown === 'lokasi' ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu (Suggestions) */}
          {openDropdown === 'lokasi' && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white-pure rounded-3xl shadow-2xl border border-gray-100 p-3 z-50 animate-fade-in">
              {filteredLokasi.length > 0 ? (
                filteredLokasi.map((opt) => (
                  <div 
                    key={opt}
                    onClick={() => selectOption('lokasi', opt)}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-text-gray/40 group-hover:text-brand-blue" />
                      <span className={`text-sm font-medium ${filters.lokasi === opt ? 'text-brand-blue' : 'text-text-dark'}`}>{opt}</span>
                    </div>
                    {filters.lokasi === opt && <Check size={16} className="text-brand-blue" />}
                  </div>
                ))
              ) : (
                <div className="p-4 text-xs text-text-gray italic">Lokasi tidak ditemukan...</div>
              )}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          suppressHydrationWarning
          className="h-[64px] bg-black-pure hover:bg-brand-blue text-white-pure font-semibold rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg group"
        >
          <Search size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm">Cari Properti</span>
        </button>
      </div>

    </div>
  );
}
