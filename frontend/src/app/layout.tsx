import type { Metadata } from 'next';
import './globals.css';
import AmbientBackground from '@/components/ambient';

export const metadata: Metadata = {
  title: 'Hand of Focus',
  description: 'Copilot de autorregulación y concentración',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-sans">
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}