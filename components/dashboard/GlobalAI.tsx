'use client';

import { usePathname } from 'next/navigation';
import NusaEstateAI from '@/components/dashboard/NusaEstateAI';

// Halaman yang tidak menampilkan AI global (karena punya AI sendiri atau untuk estetika)
const HIDDEN_PAGES = ['/properti/', '/login', '/register', '/onboarding'];

export default function GlobalAI() {
  const pathname = usePathname();
  const isHidden = HIDDEN_PAGES.some(p => pathname?.startsWith(p));
  if (isHidden) return null;
  return <NusaEstateAI />;
}
