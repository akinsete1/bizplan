import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://bizplannigeria.com'),
  title: {
    default: 'BizPlan Nigeria | Professional Business Documents',
    template: '%s | BizPlan Nigeria',
  },
  description: 'Turn your business idea into a funding-ready plan. Create professional business plans, grant proposals, and loan applications in minutes.',
  keywords: ['business plan', 'nigeria business plan', 'grant proposal', 'loan proposal', 'sme funding nigeria', 'startup business plan'],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'BizPlan Nigeria',
    title: 'BizPlan Nigeria | Professional Business Documents',
    description: 'Turn your business idea into a funding-ready plan in minutes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizPlan Nigeria | Professional Business Documents',
    description: 'Turn your business idea into a funding-ready plan in minutes.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
