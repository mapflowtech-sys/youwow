import type { Metadata } from 'next';

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
