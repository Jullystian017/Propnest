import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import GlobalAI from '@/components/dashboard/GlobalAI';

export const metadata: Metadata = {
  title: {
    default: 'PropNest AI — Platform Properti Cerdas Indonesia',
    template: '%s | PropNest AI',
  },
  description:
    'Platform pemasaran properti berbasis kecerdasan buatan untuk developer perumahan Indonesia. AI Caption Generator, CRM Leads, KPR Simulator, dan Auto Posting media sosial dalam satu platform.',
  keywords: [
    'properti Indonesia',
    'rumah dijual Purwokerto',
    'KPR calculator',
    'platform properti AI',
    'developer perumahan',
    'listing properti Jawa Tengah',
  ],
  authors: [{ name: 'PropNest AI' }],
  creator: 'PropNest AI',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'PropNest AI',
    title: 'PropNest AI — Platform Properti Cerdas Indonesia',
    description:
      'Ekosistem digital lengkap untuk developer perumahan. AI-powered, auto posting, CRM leads, dan KPR simulator.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropNest AI',
    description: 'Platform properti berbasis AI untuk developer Indonesia.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <QueryProvider>
          {children}
          <GlobalAI />
        </QueryProvider>
      </body>
    </html>
  );
}
