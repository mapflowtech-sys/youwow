"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User, CreditCard, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // JSON-LD для SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'YouWow',
    description: 'Персональные подарки: видео-поздравления и индивидуальные песни',
    url: 'https://youwow.ru',
  };

  const servicesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Product',
        position: 1,
        name: 'Видео от Деда Мороза',
        description: 'Персональное видео-поздравление от Деда Мороза с именем получателя',
        offers: {
          '@type': 'Offer',
          price: '390',
          priceCurrency: 'RUB',
          availability: 'https://schema.org/PreOrder'
        }
      },
      {
        '@type': 'Product',
        position: 2,
        name: 'Персональная песня',
        description: 'Уникальная песня с именем и историей получателя',
        offers: {
          '@type': 'Offer',
          price: '490',
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <main>
      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 via-background to-background dark:from-slate-900 dark:via-background dark:to-background px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-space bg-gradient-to-r from-primary via-accent-pink to-accent-gold bg-clip-text text-transparent mb-6 animate-shimmer">
            Подари эмоции, которые невозможно забыть
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mt-6">
            Персональные видео, песни и предсказания на 2026, созданные специально для вас за 1 минуту
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Button
              onClick={scrollToServices}
              size="lg"
              className="relative overflow-hidden bg-primary hover:bg-primary/90 text-white text-lg px-10 py-7 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center">
                Выбрать чудо
                <ChevronDown className="ml-2 w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Что создадим сегодня?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* КАРТОЧКА 1 — Видео от Деда Мороза */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/santa" className="h-full group">
              <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all hover:shadow-xl flex flex-col relative overflow-hidden bg-card">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                      🎄 Хит сезона
                    </Badge>
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                      🚧 Скоро запуск
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Видео от Деда Мороза</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    Дед Мороз лично поздравит ребёнка или взрослого. Сервис запустится совсем скоро. Пока доступно оформление предзаказа.
                  </p>
                </CardContent>
                <CardContent className="pt-0">
                  <p className="text-3xl font-bold font-space text-primary">
                    от 390 ₽
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary">
                    Создать поздравление →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* КАРТОЧКА 2 — Персональная песня */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/song" className="h-full group">
              <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all hover:shadow-xl flex flex-col relative overflow-hidden bg-card">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                      ✅ Доступно
                    </Badge>
                    <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                      🎵 Новинка
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Твой персональный хит</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">
                    Песня про твоего друга. Слова и музыка в любом стиле
                  </p>
                </CardContent>
                <CardContent className="pt-0">
                  <p className="text-3xl font-bold font-space text-primary">
                    490 ₽
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary">
                    Записать трек →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Магия в 3 клика</h2>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Шаг 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                    <div className="relative bg-primary/10 p-4 rounded-full">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Заполни форму</h3>
                <p className="text-muted-foreground">
                  Расскажи о том, кого поздравляем
                </p>
              </motion.div>

              {/* Линия 1 */}
              <div className="hidden md:flex absolute left-[30%] top-12 transform -translate-x-1/2 items-center justify-center">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-primary"
                  ></motion.div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent-pink"></div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="w-2 h-2 rounded-full bg-accent-pink"
                  ></motion.div>
                </div>
              </div>

              {/* Шаг 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-pink/20 rounded-full blur-xl"></div>
                    <div className="relative bg-accent-pink/10 p-4 rounded-full">
                      <CreditCard className="w-12 h-12 text-accent-pink" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Оплати</h3>
                <p className="text-muted-foreground">
                  Безопасная оплата российскими картами
                </p>
              </motion.div>

              {/* Линия 2 */}
              <div className="hidden md:flex absolute left-[63.5%] top-12 transform -translate-x-1/2 items-center justify-center">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    className="w-2 h-2 rounded-full bg-accent-pink"
                  ></motion.div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-accent-pink to-accent-gold"></div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                    className="w-2 h-2 rounded-full bg-accent-gold"
                  ></motion.div>
                </div>
              </div>

              {/* Шаг 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center relative"
              >
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-xl"></div>
                    <div className="relative bg-accent-gold/10 p-4 rounded-full">
                      <Sparkles className="w-12 h-12 text-accent-gold" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Получи магию</h3>
                <p className="text-muted-foreground">
                  Результат на почту через несколько минут
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
