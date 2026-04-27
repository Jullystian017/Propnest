'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2, ImagePlus, Trash2, AlertCircle, Navigation, CheckCircle } from 'lucide-react';
import { useCreateProperty, useUpdateProperty, uploadPropertyImage, Property } from '@/hooks/useProperties';
import { createClient } from '@/lib/supabase/client';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import Link from 'next/link';

const PROPERTY_TYPES = ['Rumah', 'Vila', 'Ruko', 'Apartemen', 'Kavling', 'Tanah'];
const STATUSES = ['Aktif', 'Nonaktif'];

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Property | null;
}

interface FormState {
  title: string;
  description: string;
  type: string;
  price_type: 'Jual' | 'Sewa';
  price: string;
  location: string;
  lat: string;
  lng: string;
  bedrooms: string;
  bathrooms: string;
  land_area: string;
  building_area: string;
  status: string;
  images: string[];
}

const INITIAL_FORM: FormState = {
  title: '',
  description: '',
  type: 'Rumah',
  price_type: 'Jual',
  price: '',
  location: '',
  lat: '',
  lng: '',
  bedrooms: '0',
  bathrooms: '0',
  land_area: '0',
  building_area: '0',
  status: 'Aktif',
  images: [],
};

// Geocode alamat → koordinat via Nominatim (OpenStreetMap, gratis, no key)
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; display: string } | null> {
  const fetchGeocode = async (query: string) => {
    try {
      const q = encodeURIComponent(query + ', Indonesia');
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=0`,
        {
          headers: { 'Accept-Language': 'id', 'User-Agent': 'NusaEstate-App' },
          signal: AbortSignal.timeout(8000),
        }
      );
      const data = await res.json();
      return data?.length > 0 ? {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display: data[0].display_name,
      } : null;
    } catch {
      return null;
    }
  };

  // 1. Coba alamat asli
  let result = await fetchGeocode(address);
  if (result) return result;

  // 2. Fallback: Jika ada RT/RW, bersihkan (karena sering bikin pencarian gagal)
  // Contoh: "Linggasari RT 2 RW 6..." -> "Linggasari Kecamatan Kembaran..."
  const cleanedAddress = address
    .replace(/rt\s?\d+/gi, '')
    .replace(/rw\s?\d+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanedAddress !== address) {
    result = await fetchGeocode(cleanedAddress);
    if (result) return result;
  }

  // 3. Fallback Terakhir: Coba ambil bagian akhir alamat (Kecamatan/Kota)
  const parts = address.split(/,|\s/);
  if (parts.length > 3) {
    const broadAddress = parts.slice(-3).join(' '); // Ambil 3 kata terakhir (biasanya Kec/Kab/Prov)
    result = await fetchGeocode(broadAddress);
    return result;
  }

  return null;
}

export default function PropertyFormModal({ isOpen, onClose, editData }: PropertyFormModalProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<string | null>(null);

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const { plan, usage, limits, loading: limitsLoading } = useSubscriptionLimits();
  
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEdit = !!editData;
  const isLimitReached = !isEdit && usage.listings >= limits.listings;

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title,
        description: editData.description || '',
        type: editData.type,
        price_type: editData.price_type || 'Jual',
        price: String(editData.price),
        location: editData.location,
        lat: String(editData.lat || ''),
        lng: String(editData.lng || ''),
        bedrooms: String(editData.bedrooms),
        bathrooms: String(editData.bathrooms),
        land_area: String(editData.land_area),
        building_area: String(editData.building_area),
        status: editData.status,
        images: editData.images || [],
      });
      // Show existing coords as geocode result
      if (editData.lat && editData.lng) {
        setGeocodeResult(`Koordinat tersimpan: ${editData.lat.toFixed(5)}, ${editData.lng.toFixed(5)}`);
      }
    } else {
      setForm(INITIAL_FORM);
      setGeocodeResult(null);
    }
    setError(null);
  }, [editData, isOpen]);

  const handleField = (field: keyof FormState, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Reset geocode badge saat lokasi diubah manual
    if (field === 'location') setGeocodeResult(null);
  };

  // Auto-geocode saat user selesai mengetik lokasi
  const handleLocationBlur = async () => {
    if (!form.location.trim()) return;
    if (form.lat && form.lng) return; // Sudah punya koordinat

    setGeocoding(true);
    setGeocodeResult(null);
    const result = await geocodeAddress(form.location);
    if (result) {
      setForm(prev => ({
        ...prev,
        lat: result.lat.toFixed(6),
        lng: result.lng.toFixed(6),
      }));
      setGeocodeResult(`✓ ${result.display.split(',').slice(0, 3).join(',')}`);
    } else {
      setGeocodeResult('Lokasi tidak ditemukan. Isi koordinat manual.');
    }
    setGeocoding(false);
  };

  // Manual geocode button
  const handleGeocodeClick = async () => {
    if (!form.location.trim()) return;
    setGeocoding(true);
    setGeocodeResult(null);
    const result = await geocodeAddress(form.location);
    if (result) {
      setForm(prev => ({
        ...prev,
        lat: result.lat.toFixed(6),
        lng: result.lng.toFixed(6),
      }));
      setGeocodeResult(`✓ ${result.display.split(',').slice(0, 3).join(',')}`);
    } else {
      setGeocodeResult('Lokasi tidak ditemukan. Coba nama lebih spesifik.');
    }
    setGeocoding(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (form.images.length + files.length > 5) {
      setError('Maksimal 5 foto per properti.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Tidak terautentikasi');

      const urls = await Promise.all(files.map(f => uploadPropertyImage(f, user.id)));
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err: any) {
      setError('Gagal upload foto: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.price || !form.location) {
      setError('Judul, harga, dan lokasi wajib diisi.');
      return;
    }

    if (isLimitReached) {
      setError(`Limit listing Anda (${limits.listings}) sudah tercapai. Silakan upgrade paket Anda.`);
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      type: form.type,
      price_type: form.price_type,
      price: parseInt(form.price.replace(/\D/g, ''), 10),
      location: form.location.trim(),
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      bedrooms: parseInt(form.bedrooms, 10) || 0,
      bathrooms: parseInt(form.bathrooms, 10) || 0,
      land_area: parseInt(form.land_area, 10) || 0,
      building_area: parseInt(form.building_area, 10) || 0,
      status: form.status,
      images: form.images,
    };

    try {
      if (isEdit && editData) {
        await updateMutation.mutateAsync({ id: editData.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black-pure/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl bg-white-pure rounded-[2rem] shadow-2xl border border-border-line/20 animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-7 pb-5 border-b border-border-line/10">
          <div>
            <h2 className="text-lg font-display font-semibold text-text-dark">
              {isEdit ? 'Edit Properti' : 'Tambah Properti Baru'}
            </h2>
            <p className="text-xs text-text-gray/50 mt-0.5">
              {isEdit ? 'Perbarui informasi listing Anda' : 'Isi detail untuk mempublikasikan listing'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-surface-gray/50 hover:bg-red-50 hover:text-red-500 text-text-gray/40 flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 space-y-6">

          {/* Limit Alert */}
          {isLimitReached && (
            <div className="p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-[24px] flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-brand-blue" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-text-dark">Limit Listing Tercapai</h4>
                <p className="text-xs text-text-gray/70 mt-1 leading-relaxed">
                  Paket <strong>{plan.toUpperCase()}</strong> Anda hanya memperbolehkan maksimal {limits.listings} listing. 
                  Upgrade ke Pro atau Premium untuk menambah lebih banyak properti.
                </p>
                <Link 
                  href="/dashboard/subscription" 
                  className="inline-flex items-center gap-2 mt-3 text-xs font-bold text-brand-blue hover:underline"
                >
                  Lihat Paket Langganan →
                </Link>
              </div>
            </div>
          )}

          {/* Foto */}
          <div>
            <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-3">
              Foto Properti <span className="text-text-gray/30 normal-case">(maks. 5)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative w-24 h-20 rounded-2xl overflow-hidden border border-border-line/20 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black-pure/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                  >
                    <Trash2 size={16} className="text-white-pure" />
                  </button>
                </div>
              ))}
              {form.images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-20 rounded-2xl border-2 border-dashed border-border-line/30 hover:border-brand-blue/50 hover:bg-brand-blue/5 flex flex-col items-center justify-center gap-1.5 text-text-gray/40 hover:text-brand-blue transition-all"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
                  <span className="text-[9px] font-medium">
                    {uploading ? 'Upload...' : 'Tambah Foto'}
                  </span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Judul */}
          <div>
            <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">Judul Properti *</label>
            <input
              type="text"
              placeholder="contoh: Rumah Modern Minimalis Tembalang"
              className="w-full bg-surface-gray/30 border border-border-line/20 rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20 placeholder:text-text-gray/30"
              value={form.title}
              onChange={e => handleField('title', e.target.value)}
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">Deskripsi</label>
            <textarea
              placeholder="Deskripsikan properti Anda secara singkat..."
              rows={3}
              className="w-full bg-surface-gray/30 border border-border-line/20 rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20 placeholder:text-text-gray/30 resize-none"
              value={form.description}
              onChange={e => handleField('description', e.target.value)}
            />
          </div>

          {/* Tipe & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">Tipe Properti *</label>
              <select
                className="w-full bg-surface-gray/30 border border-border-line/20 rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                value={form.type}
                onChange={e => handleField('type', e.target.value)}
              >
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">Status</label>
              <select
                className="w-full bg-surface-gray/30 border border-border-line/20 rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                value={form.status}
                onChange={e => handleField('status', e.target.value)}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Harga */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">Jenis Harga *</label>
              <div className="flex gap-2">
                {(['Jual', 'Sewa'] as const).map(pt => (
                  <button
                    type="button"
                    key={pt}
                    onClick={() => handleField('price_type', pt)}
                    className={`flex-1 py-3 rounded-2xl text-xs font-semibold transition-all border ${
                      form.price_type === pt
                        ? 'bg-brand-blue text-white-pure border-brand-blue shadow-md shadow-brand-blue/20'
                        : 'bg-surface-gray/30 text-text-gray/60 border-border-line/20 hover:border-brand-blue/30'
                    }`}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">Harga (Rp) *</label>
              <input
                type="number"
                placeholder="contoh: 1500000000"
                className="w-full bg-surface-gray/30 border border-border-line/20 rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20 placeholder:text-text-gray/30"
                value={form.price}
                onChange={e => handleField('price', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Lokasi + Auto-geocode */}
          <div>
            <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">
              Lokasi / Alamat *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="contoh: Jl. Diponegoro No. 10, Tembalang, Semarang"
                className="flex-1 bg-surface-gray/30 border border-border-line/20 rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20 placeholder:text-text-gray/30"
                value={form.location}
                onChange={e => handleField('location', e.target.value)}
                onBlur={handleLocationBlur}
                required
              />
              <button
                type="button"
                onClick={handleGeocodeClick}
                disabled={geocoding || !form.location.trim()}
                title="Deteksi koordinat otomatis dari alamat"
                className="px-4 py-3 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/20 text-brand-blue rounded-2xl flex items-center gap-2 text-xs font-medium transition-all disabled:opacity-40 whitespace-nowrap"
              >
                {geocoding ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                {geocoding ? 'Deteksi...' : 'Deteksi'}
              </button>
            </div>

            {/* Geocode result badge */}
            {geocodeResult && (
              <div className={`mt-2 text-[10px] px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 ${
                geocodeResult.startsWith('✓')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {geocodeResult.startsWith('✓')
                  ? <CheckCircle size={10} className="text-emerald-500" />
                  : <AlertCircle size={10} className="text-amber-500" />}
                {geocodeResult}
              </div>
            )}
          </div>

          {/* Koordinat (diisi otomatis atau manual) */}
          <div>
            <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">
              Koordinat GPS
              <span className="ml-2 normal-case text-text-gray/30 font-normal">
                — terisi otomatis dari tombol Deteksi, atau isi manual
              </span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude, contoh: -7.048"
                  className={`w-full border rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20 placeholder:text-text-gray/30 transition-colors ${
                    form.lat
                      ? 'bg-emerald-50/30 border-emerald-200/60 text-emerald-800'
                      : 'bg-surface-gray/30 border-border-line/20'
                  }`}
                  value={form.lat}
                  onChange={e => handleField('lat', e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude, contoh: 110.438"
                  className={`w-full border rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20 placeholder:text-text-gray/30 transition-colors ${
                    form.lng
                      ? 'bg-emerald-50/30 border-emerald-200/60 text-emerald-800'
                      : 'bg-surface-gray/30 border-border-line/20'
                  }`}
                  value={form.lng}
                  onChange={e => handleField('lng', e.target.value)}
                />
              </div>
            </div>
            <p className="text-[10px] text-text-gray/40 mt-2">
              💡 Koordinat digunakan untuk pin peta dan Nearest Location. Klik tombol <strong>Deteksi</strong> atau cari di{' '}
              <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="text-brand-blue underline">openstreetmap.org</a>.
            </p>
          </div>

          {/* Spesifikasi */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Kamar Tidur', field: 'bedrooms' as keyof FormState, unit: 'KT' },
              { label: 'Kamar Mandi', field: 'bathrooms' as keyof FormState, unit: 'KM' },
              { label: 'Luas Tanah', field: 'land_area' as keyof FormState, unit: 'm²' },
              { label: 'Luas Bangunan', field: 'building_area' as keyof FormState, unit: 'm²' },
            ].map(({ label, field, unit }) => (
              <div key={field}>
                <label className="block text-[10px] font-semibold text-text-gray/50 uppercase tracking-widest mb-2">
                  {label} <span className="text-text-gray/30">({unit})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-surface-gray/30 border border-border-line/20 rounded-2xl px-4 py-3 text-sm font-normal focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  value={form[field] as string}
                  onChange={e => handleField(field, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50/60 border border-red-100/50 rounded-2xl">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-red-500 text-xs font-medium">{error}</p>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-7 pt-5 border-t border-border-line/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-sm font-medium text-text-gray/60 hover:text-text-dark bg-surface-gray/50 rounded-2xl transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading || uploading || isLimitReached}
            onClick={handleSubmit}
            className="px-7 py-3 bg-brand-blue text-white-pure rounded-2xl text-sm font-semibold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue-deep transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? 'Simpan Perubahan' : 'Publikasikan Properti'}
          </button>
        </div>
      </div>
    </div>
  );
}
