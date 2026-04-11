import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun developer PropNest AI kamu.',
};

export default function MasukPage() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-28 pb-20 flex items-center justify-center min-h-screen">
        <div
          className="w-full max-w-md p-8 rounded-2xl"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Masuk ke PropNest
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Belum punya akun?{' '}
            <a href="/daftar" style={{ color: 'var(--color-primary-light)' }}>
              Daftar gratis
            </a>
          </p>
          <div className="text-center p-8 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>🔧 Form login sedang dibangun...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
