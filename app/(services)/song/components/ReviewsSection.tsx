"use client";

import { motion } from "framer-motion";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import {
  AnimatedSection,
  StaggeredGrid,
  SectionBadge,
  Stars,
  CountUp,
  cardVariants,
} from "./AnimationWrappers";

const reviews = [
  {
    name: "Мария",
    occasion: "День рождения",
    source: "Telegram",
    date: "Февраль 2026",
    text: "Заказала песню для мамы на юбилей. Когда она услышала, просто расплакалась от счастья. Там были все наши семейные истории. Спасибо за такой подарок!",
    initial: "М",
    accentBg: "bg-primary",
  },
  {
    name: "Алексей",
    occasion: "Для друга",
    source: "Яндекс.Карты",
    date: "Январь 2026",
    text: "Сделал песню-прожарку для друга на день рождения. Вся компания смеялась до слёз! Качество трека как у настоящих исполнителей. Однозначно буду заказывать ещё!",
    initial: "А",
    accentBg: "bg-plum",
  },
  {
    name: "Екатерина",
    occasion: "Годовщина",
    source: "Telegram",
    date: "Декабрь 2025",
    text: "Подарила мужу романтичную песню на годовщину. Он был в полном шоке! Говорит, это лучший подарок за всю нашу жизнь. Песня получилась очень трогательная и личная.",
    initial: "Е",
    accentBg: "bg-gold",
  },
];

export default function ReviewsSection() {
  return (
    <AnimatedSection>
      {/* Dark section */}
      <section className="py-20 md:py-24 bg-surface-dark wave-divider wave-divider-to-light">
        {/* Schema.org Reviews */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Персональная песня на заказ",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "344",
              },
              review: reviews.map((r) => ({
                "@type": "Review",
                author: { "@type": "Person", name: r.name },
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                },
                reviewBody: r.text,
              })),
            }),
          }}
        />

        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <SectionBadge variant="dark">
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Отзывы клиентов
            </SectionBadge>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
              Что говорят наши клиенты
            </h2>
            <p className="text-lg text-white/50">
              Более{" "}
              <strong className="text-white/80">
                <CountUp target={5000} suffix="+" />
              </strong>{" "}
              песен уже подарено
            </p>
          </div>

          {/* Reviews grid — glassmorphism cards */}
          <StaggeredGrid className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/[0.08] p-7 flex flex-col h-full hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
              >
                {/* Decorative quote */}
                <span
                  className="absolute top-4 right-5 text-6xl leading-none font-display text-white/[0.04] select-none pointer-events-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Header: avatar + name + stars */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full ${review.accentBg} text-white flex items-center justify-center font-bold text-sm`}
                  >
                    {review.initial}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {review.name}
                      </span>
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-emerald-400"
                        aria-label="Проверенный покупатель"
                      />
                    </div>
                    <Stars />
                  </div>
                </div>

                {/* Occasion + Source */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/[0.06] text-white/60">
                    {review.occasion}
                  </span>
                  <span className="text-xs text-white/30">
                    {review.source}
                  </span>
                </div>

                {/* Review text */}
                <p className="text-white/70 leading-relaxed grow">
                  &laquo;{review.text}&raquo;
                </p>

                {/* Date */}
                <span className="text-xs text-white/25 mt-4 block">
                  {review.date}
                </span>
              </motion.div>
            ))}
          </StaggeredGrid>
        </div>
      </section>
    </AnimatedSection>
  );
}
