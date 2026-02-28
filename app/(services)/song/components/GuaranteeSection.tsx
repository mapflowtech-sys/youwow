"use client";

import { ShieldCheck, RefreshCw, Headphones, MessageCircle } from "lucide-react";
import { AnimatedSection, StaggeredGrid, cardVariants } from "./AnimationWrappers";
import { motion } from "framer-motion";

const guarantees = [
  {
    icon: RefreshCw,
    title: "Бесплатная доработка",
    description: "Не понравилось? Переделаем бесплатно — жанр, текст, настроение",
    iconColor: "text-primary",
    iconBg: "bg-rose-50",
  },
  {
    icon: Headphones,
    title: "Студийный звук",
    description: "Профессиональное звучание, неотличимое от живых исполнителей",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
  },
  {
    icon: MessageCircle,
    title: "Поддержка 24/7",
    description: "Всегда на связи в Telegram и готовы помочь с любым вопросом",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
];

export default function GuaranteeSection() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          GUARANTEE
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
            {/* ── Header ── */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
                <ShieldCheck
                  className="w-7 h-7 text-primary"
                  aria-hidden="true"
                />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Гарантия результата
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Наша цель — чтобы вы получили эмоцию, которой захотите
                поделиться и&nbsp;подарить
              </p>
            </div>

            {/* ── Guarantee cards ── */}
            <StaggeredGrid className="grid md:grid-cols-3 gap-6">
              {guarantees.map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="text-center bg-white rounded-2xl border border-border/50 p-7 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.iconBg} mb-4`}
                  >
                    <item.icon
                      className={`w-6 h-6 ${item.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </StaggeredGrid>

            {/* ── Support link ── */}
            <div className="text-center mt-10">
              <p className="text-sm text-muted-foreground">
                Есть вопросы?{" "}
                <a
                  href="https://t.me/youwow_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  @youwow_support
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ════════════════════════════════════════════════════════════════════
          SEO CONTENT
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-secondary/50">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <article>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground text-center">
              Персональная песня на заказ — уникальный подарок
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">
                  Персональная песня на заказ
                </strong>{" "}
                — индивидуальный подарок, который создаётся специально для одного
                человека. Каждая песня включает имя получателя, личные истории,
                черты характера и&nbsp;памятные моменты из жизни. Идеальный подарок
                на&nbsp;день рождения, годовщину, свадьбу, 8&nbsp;марта,
                23&nbsp;февраля, Новый год или просто так — чтобы порадовать
                близкого человека.
              </p>

              <p>
                Выберите жанр (поп, рок, рэп, шансон, джаз, акустика и&nbsp;другие),
                стиль текста и&nbsp;голос исполнителя. Через 10&nbsp;минут после
                оплаты готовый MP3-трек придёт на&nbsp;вашу почту.
                Стоимость — 590&nbsp;рублей, всё включено.
              </p>

              <p className="pt-2">
                Хотите узнать больше?{" "}
                <a
                  href="/"
                  className="text-primary hover:underline font-semibold"
                >
                  Посетите главную страницу YouWow
                </a>
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
