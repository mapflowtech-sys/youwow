"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Snowflake, Music, User, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          price: '1390',
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
          price: '590',
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
        <section className="min-h-[85vh] flex items-center justify-center bg-linear-to-b from-primary/5 via-background to-background px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-6">
              Персональные подарки
            </p>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-plum mb-6 leading-tight">
              Подарки с эмоцией
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
              Песни и видео-поздравления, созданные специально для ваших близких
            </p>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10"
            >
              <Button
                onClick={scrollToServices}
                size="lg"
                className="bg-primary hover:bg-primary-dark text-white text-lg px-10 py-7 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <span className="flex items-center">
                  Создать подарок
                  <ChevronDown className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-5">
                Наши сервисы
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-plum">
                Что создадим сегодня?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Персональная песня */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/song" className="block h-full group">
                  <div className="h-full bg-card rounded-2xl border border-border/50 p-8 shadow-sm hover:shadow-md hover:shadow-plum/[0.04] transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/8">
                        <Music className="w-6 h-6 text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Доступно
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      Персональная песня
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 grow">
                      Песня про вашего друга, маму или коллегу. Слова и музыка в любом стиле, готово за 10 минут
                    </p>

                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="font-display text-3xl font-bold text-plum">590 ₽</span>
                      <span className="text-sm text-muted-foreground line-through">1 190 ₽</span>
                    </div>

                    <div className="bg-primary text-white text-center py-3 rounded-xl font-semibold group-hover:bg-primary-dark transition-colors">
                      Записать трек &rarr;
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Видео от Деда Мороза */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/santa" className="block h-full group">
                  <div className="h-full bg-card rounded-2xl border border-border/50 p-8 shadow-sm hover:shadow-md hover:shadow-plum/[0.04] transition-all duration-300 flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/8">
                        <Snowflake className="w-6 h-6 text-gold" aria-hidden="true" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                        Скоро запуск
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      Видео от Деда Мороза
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 grow">
                      Дед Мороз лично поздравит ребёнка или взрослого. Сервис запустится совсем скоро
                    </p>

                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="font-display text-3xl font-bold text-plum">от 1 390 ₽</span>
                    </div>

                    <div className="bg-plum text-white text-center py-3 rounded-xl font-semibold group-hover:bg-plum-light transition-colors">
                      Создать поздравление &rarr;
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="bg-secondary/50 py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-5">
                Как это работает
              </p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-plum">
                Всего 3 шага
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {[
                {
                  step: 1,
                  icon: User,
                  title: "Заполните детали",
                  description: "Расскажите о человеке, а мы превратим это в искусство",
                  accentColor: "text-primary",
                  accentBg: "bg-primary/8",
                  dotColor: "bg-primary",
                },
                {
                  step: 2,
                  icon: CreditCard,
                  title: "Удобная оплата",
                  description: "Картами любых банков РФ. Мгновенное подтверждение",
                  accentColor: "text-plum",
                  accentBg: "bg-plum/8",
                  dotColor: "bg-plum",
                },
                {
                  step: 3,
                  icon: Sparkles,
                  title: "Момент восторга",
                  description: "Готовая песня или видео на почту за 10 минут",
                  accentColor: "text-gold",
                  accentBg: "bg-gold/8",
                  dotColor: "bg-gold",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * item.step }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-5">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl ${item.accentBg} flex items-center justify-center`}>
                        <item.icon className={`w-7 h-7 ${item.accentColor}`} aria-hidden="true" />
                      </div>
                      <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 ${item.dotColor} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{item.step}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
