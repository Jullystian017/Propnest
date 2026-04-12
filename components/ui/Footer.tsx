import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 text-[13px]">
      <div className="container-standard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-blue text-white-pure flex items-center justify-center font-display font-semibold text-lg">
                PJ
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-white-pure">
                PropNest<span className="text-brand-blue">.</span>
              </span>
            </Link>
            <p className="leading-relaxed text-gray-400 max-w-sm">
              Marketplace properti terpercaya untuk Jawa Tengah dan sekitarnya.
            </p>
          </div>

          {/* Spacer for grid */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Links: Jelajahi */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white-pure mb-5">Jelajahi</h4>
            <ul className="space-y-3">
              <li><Link href="/cari" className="hover:text-white-pure transition-colors">Beli Rumah</Link></li>
              <li><Link href="/cari" className="hover:text-white-pure transition-colors">Properti Baru</Link></li>
              <li><Link href="/cari" className="hover:text-white-pure transition-colors">Listing Populer</Link></li>
            </ul>
          </div>

          {/* Links: Layanan */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white-pure mb-5">Layanan</h4>
            <ul className="space-y-3">
              <li><Link href="/kpr-calculator" className="hover:text-white-pure transition-colors">Kalkulator KPR</Link></li>
              <li><Link href="/cari" className="hover:text-white-pure transition-colors">AI Property Matcher</Link></li>
              <li><Link href="/dashboard" className="hover:text-white-pure transition-colors">Dasbor Developer</Link></li>
            </ul>
          </div>

          {/* Links: Perusahaan */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white-pure mb-5">Perusahaan</h4>
            <ul className="space-y-3">
              <li><Link href="/tentang" className="hover:text-white-pure transition-colors">Tentang Kami</Link></li>
              <li><Link href="/tentang" className="hover:text-white-pure transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/tentang" className="hover:text-white-pure transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
           <p>© {new Date().getFullYear()} PropNest. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
