import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Daftar Developer',
  description: 'Daftar sebagai developer dan mulai pemasaran properti dengan AI.',
};

export default function DaftarPage() {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <main className="container pt-28 pb-20 flex items-center justify-center min-h-screen">
        <div
          className="w-full max-w-md p-8 rounded-2xl"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
            Daftar Developer
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Sudah punya akun?{' '}
            <a href="/masuk" style={{ color: 'var(--color-primary-light)' }}>
              Masuk here
            </a>
          </p>
          <div className="text-center p-8 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>🔧 Form registrasi sedang dibangun...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
