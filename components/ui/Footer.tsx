import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0c10] text-gray-400 pt-20 pb-10 border-t border-white/5 font-sans overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-standard relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* Brand & Description */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-0 group transition-transform duration-300 hover:scale-105 origin-left">
              <img src="/images/nusaestate.png" alt="NusaEstate Logo" className="h-14 w-auto object-contain" />
              <span className="font-display font-bold text-2xl tracking-tight text-white-pure -ml-3">
                NusaEstate
              </span>
            </Link>
            <p className="text-[15px] leading-relaxed text-gray-400 max-w-sm">
              Marketplace properti terpercaya untuk Jawa Tengah dan sekitarnya. Kami menghadirkan hunian impian dengan teknologi AI yang memudahkan pencarian Anda.
            </p>
          </div>

          {/* Quick Links Group */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-display font-semibold text-white-pure text-base mb-7">Jelajahi</h4>
              <ul className="space-y-4 text-[14px]">
                <li><FooterLink href="/cari">Beli Rumah</FooterLink></li>
                <li><FooterLink href="/cari">Properti Baru</FooterLink></li>
                <li><FooterLink href="/cari">Listing Populer</FooterLink></li>
                <li><FooterLink href="/cari">Properti Sewa</FooterLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white-pure text-base mb-7">Informasi</h4>
              <ul className="space-y-4 text-[14px]">
                <li><FooterLink href="/tentang">Tentang Kami</FooterLink></li>
                <li><FooterLink href="/tentang">Kebijakan Privasi</FooterLink></li>
                <li><FooterLink href="/tentang">Syarat & Ketentuan</FooterLink></li>
                <li><FooterLink href="/tentang">Guide</FooterLink></li>
              </ul>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h4 className="font-display font-semibold text-white-pure text-base mb-5">Newsletter</h4>
              <p className="text-sm mb-5 text-gray-500">Dapatkan update properti terbaru setiap minggu.</p>
              <form className="relative group" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white-pure focus:outline-none focus:border-brand-blue/50 transition-all pr-12 placeholder:text-gray-600"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-brand-blue text-white-pure rounded-lg flex items-center justify-center hover:bg-brand-blue-hover transition-colors group-hover:shadow-lg group-hover:shadow-brand-blue/20">
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <ContactItem icon={<Mail size={16} />} text="halo@nusaestate.com" />
              <ContactItem icon={<Phone size={16} />} text="+62 (21) 5000 888" />
              <ContactItem icon={<MapPin size={16} />} text="Semarang, Jawa Tengah, Indonesia" />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 text-center text-[13px]">
          <p>© {currentYear} NusaEstate. Hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="group flex items-center gap-0 hover:text-white-pure transition-all duration-300"
    >
      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 text-brand-blue mr-0 group-hover:mr-2 inline-block">
        <ArrowRight size={10} strokeWidth={3} />
      </span>
      {children}
    </Link>
  );
}

function ContactItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm group cursor-pointer">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white-pure transition-all duration-300">
        {icon}
      </div>
      <span className="text-gray-400 group-hover:text-gray-200 transition-colors">{text}</span>
    </div>
  );
}
