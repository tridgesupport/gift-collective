import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '500', '600', '700'],  // 400 (normal) is never used explicitly
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Luxury Brand',
  description: 'A curation of the exceptional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${jost.variable}`}>
      <body className="font-jost bg-[--cream] text-[--warm-dark] antialiased">
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
