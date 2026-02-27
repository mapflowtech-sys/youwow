import type { Metadata } from 'next';

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
