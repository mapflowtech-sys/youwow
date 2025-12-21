import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
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
  title: "YouWow | Индивидуальные подарки с WOW-эффектом",
  description:
    "Персональные видео от Деда Мороза, гадание Таро, песни созданные для Вас. Готовность за несколько минут. От 290₽",
  keywords: [
    "AI подарки",
    "персональные подарки",
    "гадание таро",
    "видео от деда мороза",
    "персональная песня",
  ],
  openGraph: {
    title: "YouWow | Индивидуальные подарки с WOW-эффектом",
    description:
      "Персональные видео от Деда Мороза, гадание Таро, песни созданные для Вас. Готовность за несколько минут. От 290₽",
    type: "website",
    locale: "ru_RU",
    siteName: "YouWow",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouWow | Индивидуальные подарки с WOW-эффектом",
    description:
      "Персональные видео от Деда Мороза, гадание Таро, песни созданные для Вас. От 290₽",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
