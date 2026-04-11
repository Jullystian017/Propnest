import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard developer PropNest AI.',
};

export default function DashboardPage() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-28 pb-20">
        <h1 className="section-title mb-2">Dashboard</h1>
        <p className="section-desc">Kelola listing, leads, dan konten propertimu.</p>
        <div
          className="mt-8 p-12 rounded-2xl text-center"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p style={{ color: 'var(--color-text-muted)' }}>🔧 Dashboard sedang dibangun...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
