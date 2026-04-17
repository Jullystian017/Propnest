export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  temperature: 'Hot' | 'Warm' | 'Cold';
  status: 'Baru' | 'Dihubungi' | 'Tertarik' | 'Closing' | 'Batal';
  date: string;
  source: string;
}

export const MOCK_LEADS: Lead[] = [
  { id: 'L-001', name: 'Budi Santoso', email: 'budi.s@email.com', phone: '081234567890', property: 'Rumah Modern Minimalis BSB', temperature: 'Hot', status: 'Baru', date: '2026-04-17T10:30:00Z', source: 'AI Chatbot' },
  { id: 'L-002', name: 'Siti Aminah', email: 'siti.a@gmail.com', phone: '085678901234', property: 'Vila Tropis Ungaran', temperature: 'Warm', status: 'Dihubungi', date: '2026-04-16T15:45:00Z', source: 'Instagram' },
  { id: 'L-003', name: 'Andi Wijaya', email: 'andi.w@yahoo.com', phone: '082123456789', property: 'Cluster Premium Colomadu', temperature: 'Hot', status: 'Tertarik', date: '2026-04-16T09:20:00Z', source: 'AI Chatbot' },
  { id: 'L-004', name: 'Dewi Lestari', email: 'dewi.l@outlook.com', phone: '087890123456', property: 'Griya Asri Premiere', temperature: 'Cold', status: 'Batal', date: '2026-04-15T14:10:00Z', source: 'Facebook' },
  { id: 'L-005', name: 'Eko Prasetyo', email: 'eko.p@perusahaan.com', phone: '081345678901', property: 'Taman Sari Solo Baru', temperature: 'Warm', status: 'Tertarik', date: '2026-04-15T08:00:00Z', source: 'TikTok' },
  { id: 'L-006', name: 'Linda Kusuma', email: 'linda.k@gmail.com', phone: '085234567890', property: 'Vila Tropis Ungaran', temperature: 'Hot', status: 'Closing', date: '2026-04-14T16:30:00Z', source: 'Instagram' },
  { id: 'L-007', name: 'Heri Kurniawan', email: 'heri.k@email.com', phone: '089876543210', property: 'Rumah Modern Minimalis BSB', temperature: 'Cold', status: 'Dihubungi', date: '2026-04-14T11:20:00Z', source: 'Website' },
  { id: 'L-008', name: 'Rina Wijayanti', email: 'rina.w@gmail.com', phone: '081223344556', property: 'Cilacap Bay View', temperature: 'Hot', status: 'Closing', date: '2026-04-13T09:15:00Z', source: 'TikTok' },
  { id: 'L-009', name: 'Agus Salim', email: 'agus.s@outlook.com', phone: '081334455667', property: 'Rumah Modern Minimalis BSB', temperature: 'Hot', status: 'Tertarik', date: '2026-04-13T14:20:00Z', source: 'Instagram' },
  { id: 'L-010', name: 'Maya Putri', email: 'maya.p@gmail.com', phone: '081445566778', property: 'Cluster Premium Colomadu', temperature: 'Warm', status: 'Baru', date: '2026-04-12T10:45:00Z', source: 'TikTok' },
  { id: 'L-011', name: 'Doni Setiawan', email: 'doni.s@yahoo.co.id', phone: '081556677889', property: 'Vila Tropis Ungaran', temperature: 'Hot', status: 'Dihubungi', date: '2026-04-12T16:30:00Z', source: 'Facebook' },
  { id: 'L-012', name: 'Indah Permata', email: 'indah.p@gmail.com', phone: '081667788990', property: 'Taman Sari Solo Baru', temperature: 'Warm', status: 'Baru', date: '2026-04-11T08:10:00Z', source: 'Instagram' },
  { id: 'L-013', name: 'Fajar Nugraha', email: 'fajar.n@email.com', phone: '081778899001', property: 'Rumah Modern Minimalis BSB', temperature: 'Cold', status: 'Batal', date: '2026-04-11T13:40:00Z', source: 'WhatsApp' },
  { id: 'L-014', name: 'Santi Rahayu', email: 'santi.r@gmail.com', phone: '081889900112', property: 'Griya Asri Premiere', temperature: 'Hot', status: 'Closing', date: '2026-04-10T11:25:00Z', source: 'Website' },
  { id: 'L-015', name: 'Bambang Utomo', email: 'bambang.u@outlook.com', phone: '081990011223', property: 'Cilacap Bay View', temperature: 'Warm', status: 'Dihubungi', date: '2026-04-10T15:50:00Z', source: 'TikTok' },
];
