'use client';

import { usePathname } from 'next/navigation';
import PropNestAI from '@/components/dashboard/PropNestAI';

// Halaman yang punya PropNestAI sendiri dengan context khusus
const PAGES_WITH_OWN_AI = ['/properti/'];

export default function GlobalAI() {
  const pathname = usePathname();
  const hasOwnAI = PAGES_WITH_OWN_AI.some(p => pathname?.startsWith(p));
  if (hasOwnAI) return null;
  return <PropNestAI />;
}
