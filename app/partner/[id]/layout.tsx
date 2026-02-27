import type { Metadata } from 'next';
import 'primereact/resources/themes/lara-light-pink/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export const metadata: Metadata = {
  title: 'Партнёрский кабинет',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
