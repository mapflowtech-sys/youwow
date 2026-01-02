import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/toaster";
import YandexMetrika from "@/components/YandexMetrika";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://youwow.ru'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'YouWow | Персональные подарки с WOW-эффектом',
    template: '%s | YouWow'
  },
  description: 'Создайте незабываемый персональный подарок на любой праздник! Уникальные сервисы для создания индивидуальных подарков: персональные песни с именем и историей получателя, эмоциональные сюрпризы на день рождения, юбилей, годовщину. Готово за 10 минут. Оригинальные подарки от 390₽ с доставкой онлайн',
  keywords: [
    'персональный подарок',
    'подарок на день рождения',
    'необычный подарок',
    'оригинальный подарок',
    'уникальный подарок',
    'индивидуальный подарок',
    'подарок на заказ',
    'персональная песня',
    'песня на заказ',
    'подарок маме',
    'подарок папе',
    'подарок другу',
    'подарок мужу',
    'подарок жене',
    'подарок парню',
    'подарок девушке',
    'подарок на юбилей',
    'подарок на годовщину',
    'эмоциональный подарок',
    'креативный подарок',
    'недорогой подарок'
  ],
  authors: [{ name: 'YouWow' }],
  creator: 'YouWow',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://youwow.ru',
    title: 'YouWow | Персональные подарки с WOW-эффектом',
    description: 'Создайте незабываемый персональный подарок на любой праздник! Уникальные сервисы для индивидуальных подарков. Готово за 10 минут. От 390₽',
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
    title: 'YouWow | Персональные подарки с WOW-эффектом',
    description: 'Создайте незабываемый персональный подарок на любой праздник! Уникальные сервисы для индивидуальных подарков. Готово за 10 минут. От 390₽',
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
  // Organization JSON-LD schema for brand identity
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'YouWow',
    url: 'https://youwow.ru',
    logo: 'https://youwow.ru/icon-512.png',
    description: 'Персональные подарки с WOW-эффектом: индивидуальные песни и видео-поздравления',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Russian'],
      url: 'https://t.me/youwow_support'
    },
    sameAs: [
      'https://t.me/youwow_support'
    ]
  };

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://mc.yandex.ru" crossOrigin="anonymous" />
        {/* Theme color for browser UI */}
        <meta name="theme-color" content="#a855f7" />
        {/* Organization JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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
          <YandexMetrika />
        </ThemeProvider>
      </body>
    </html>
  );
}
