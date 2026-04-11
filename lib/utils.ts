import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ---- Tailwind class merger ----
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---- Currency formatter ----
export function formatRupiah(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000_000) {
      return `Rp ${(amount / 1_000_000_000).toFixed(1).replace('.0', '')} M`;
    }
    if (amount >= 1_000_000) {
      return `Rp ${(amount / 1_000_000).toFixed(0)} jt`;
    }
    if (amount >= 1_000) {
      return `Rp ${(amount / 1_000).toFixed(0)} rb`;
    }
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ---- KPR Calculator ----
export function calculateKPR(
  hargaRumah: number,
  dpPercent: number,
  bungaPercent: number,
  tenorTahun: number
): {
  dpAmount: number;
  loanAmount: number;
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
} {
  const dpAmount = hargaRumah * (dpPercent / 100);
  const loanAmount = hargaRumah - dpAmount;
  const monthlyRate = bungaPercent / 100 / 12;
  const tenorBulan = tenorTahun * 12;

  const monthlyInstallment =
    monthlyRate === 0
      ? loanAmount / tenorBulan
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenorBulan)) /
        (Math.pow(1 + monthlyRate, tenorBulan) - 1);

  const totalPayment = monthlyInstallment * tenorBulan;
  const totalInterest = totalPayment - loanAmount;

  return {
    dpAmount,
    loanAmount,
    monthlyInstallment,
    totalPayment,
    totalInterest,
  };
}

// ---- KPR Eligibility check ----
// Rule: cicilan maksimal 30% dari gaji bersih
export function checkKPREligibility(
  gajiBersih: number,
  monthlyInstallment: number
): { eligible: boolean; ratio: number; maxInstallment: number } {
  const maxInstallment = gajiBersih * 0.3;
  const ratio = (monthlyInstallment / gajiBersih) * 100;
  return {
    eligible: monthlyInstallment <= maxInstallment,
    ratio,
    maxInstallment,
  };
}

// ---- Slug generator ----
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ---- Relative time ----
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return date.toLocaleDateString('id-ID');
  if (diffDays > 0) return `${diffDays} hari lalu`;
  if (diffHours > 0) return `${diffHours} jam lalu`;
  if (diffMins > 0) return `${diffMins} menit lalu`;
  return 'Baru saja';
}

// ---- Lead status label ----
export const LEAD_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  inquiry: { label: 'Inquiry', color: 'bg-blue-500/20 text-blue-400' },
  interested: { label: 'Tertarik', color: 'bg-yellow-500/20 text-yellow-400' },
  survey: { label: 'Survei', color: 'bg-purple-500/20 text-purple-400' },
  negotiation: {
    label: 'Negosiasi',
    color: 'bg-orange-500/20 text-orange-400',
  },
  closing: { label: 'Closing', color: 'bg-green-500/20 text-green-400' },
};

// ---- Content platform label ----
export const PLATFORM_MAP: Record<string, { label: string; color: string }> = {
  instagram: {
    label: 'Instagram',
    color: 'bg-pink-500/20 text-pink-400',
  },
  facebook: { label: 'Facebook', color: 'bg-blue-600/20 text-blue-400' },
  tiktok: { label: 'TikTok', color: 'bg-slate-500/20 text-slate-300' },
  whatsapp: { label: 'WhatsApp', color: 'bg-green-500/20 text-green-400' },
};

// ---- Truncate text ----
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
