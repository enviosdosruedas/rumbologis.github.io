import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import for GeistSans
import { GeistMono } from 'geist/font/mono'; // Corrected import for GeistMono
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster

const geistSans = GeistSans({ 
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({ 
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rumbo Envíos',
  description: 'Gestión de Clientes y Repartidores',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
