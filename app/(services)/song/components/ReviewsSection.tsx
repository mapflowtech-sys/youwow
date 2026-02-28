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
    occasionColor: "bg-rose-50 text-rose-600",
    date: "Февраль 2026",
    text: "Заказала песню для мамы на юбилей. Когда она услышала, просто расплакалась от счастья. Там были все наши семейные истории. Спасибо за такой подарок!",
    avatarGradient: "from-rose-400 to-pink-500",
  },
  {
    name: "Алексей",
    occasion: "Для друга",
    occasionColor: "bg-violet-50 text-violet-600",
    date: "Январь 2026",
    text: "Сделал песню-прожарку для друга на день рождения. Вся компания смеялась до слёз! Качество трека как у настоящих исполнителей. Однозначно буду заказывать ещё!",
    avatarGradient: "from-violet-400 to-purple-500",
  },
  {
    name: "Екатерина",
    occasion: "Годовщина",
    occasionColor: "bg-amber-50 text-amber-600",
    date: "Декабрь 2025",
    text: "Подарила мужу романтичную песню на годовщину. Он был в полном шоке! Говорит, это лучший подарок за всю нашу жизнь. Песня получилась очень трогательная и личная.",
    avatarGradient: "from-amber-400 to-orange-500",
  },
];

export default function ReviewsSection() {
  return (
    <AnimatedSection>
      <section className="py-20 md:py-24 bg-secondary/50">
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
          {/* ── Header ── */}
          <div className="text-center mb-14">
            <SectionBadge>
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Отзывы клиентов
            </SectionBadge>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Что говорят наши клиенты
            </h2>
            <p className="text-lg text-muted-foreground">
              Более{" "}
              <strong className="text-foreground">
                <CountUp target={5000} suffix="+" />
              </strong>{" "}
              песен уже подарено
            </p>
          </div>

          {/* ── Reviews grid ── */}
          <StaggeredGrid className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative bg-white rounded-2xl border border-border/50 shadow-sm p-7 flex flex-col h-full hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Decorative quote */}
                <span
                  className="absolute top-4 right-5 text-6xl leading-none font-serif text-primary/[0.06] select-none pointer-events-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* ── Header: avatar + name + stars ── */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.avatarGradient} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                  >
                    {review.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {review.name}
                      </span>
                      <CheckCircle2
                        className="w-3.5 h-3.5 text-emerald-500"
                        aria-label="Проверенный покупатель"
                      />
                    </div>
                    <Stars />
                  </div>
                </div>

                {/* ── Occasion tag ── */}
                <span
                  className={`inline-flex self-start text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${review.occasionColor}`}
                >
                  {review.occasion}
                </span>

                {/* ── Review text ── */}
                <p className="text-muted-foreground leading-relaxed grow">
                  &laquo;{review.text}&raquo;
                </p>

                {/* ── Date ── */}
                <span className="text-xs text-muted-foreground/60 mt-4 block">
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
