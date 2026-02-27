import type { Metadata } from 'next';
import 'primereact/resources/themes/lara-light-pink/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export const metadata: Metadata = {
  title: 'Админ-панель партнёров',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
