import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'GadgetSol — Toko Gadget Online Terpercaya',
  description: 'Temukan smartphone, laptop, tablet & smartwatch terbaik dengan konsultan AI pribadi. 100% Original, Free Ongkir, Garansi Resmi.',
  keywords: 'gadget, smartphone, laptop, tablet, smartwatch, toko online, AI konsultan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
