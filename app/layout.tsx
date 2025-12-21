import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://youwow.ru'),
  title: {
    default: 'YouWow | Персональные подарки с WOW-эффектом',
    template: '%s | YouWow'
  },
  description: 'Создайте уникальный подарок за 10 минут! Персональные видео-поздравления от любимых персонажей и индивидуальные песни. Готово за считанные минуты. От 390₽',
  keywords: [
    'персональный подарок',
    'видео поздравление',
    'персональная песня',
    'видео от деда мороза',
    'поздравление с новым годом',
    'поздравление с днем рождения',
    'индивидуальный подарок',
    'необычный подарок',
    'уникальный подарок',
    'подарок на новый год',
    'подарок на день рождения',
    'видео поздравление на заказ',
    'песня на заказ'
  ],
  authors: [{ name: 'YouWow' }],
  creator: 'YouWow',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://youwow.ru',
    title: 'YouWow | Персональные подарки с WOW-эффектом',
    description: 'Создайте уникальный подарок за 10 минут! Персональные видео-поздравления и индивидуальные песни.',
    siteName: 'YouWow',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YouWow - Персональные подарки',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YouWow | Персональные подарки',
    description: 'Создайте уникальный подарок за 10 минут! Видео-поздравления и персональные песни.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
