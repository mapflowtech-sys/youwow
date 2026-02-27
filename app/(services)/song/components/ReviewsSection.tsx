"use client";

import { motion } from "framer-motion";
import {
  AnimatedSection,
  StaggeredGrid,
  SectionBar,
  Stars,
  cardVariants,
} from "./AnimationWrappers";

export default function ReviewsSection() {
  return (
    <AnimatedSection>
      <section className="py-20 bg-secondary/50">
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
              review: [
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Мария" },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                  },
                  reviewBody:
                    "Заказала песню для мамы на юбилей. Когда она услышала, просто расплакалась от счастья. Там были все наши семейные истории, которые я указала в форме. Спасибо вам огромное за такой подарок!",
                },
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Алексей" },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                  },
                  reviewBody:
                    "Сделал песню-прожарку для друга на день рождения. Вся компания смеялась до слёз! Качество трека как у настоящих исполнителей, даже не верится что это AI. Однозначно буду заказывать ещё!",
                },
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Екатерина" },
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                  },
                  reviewBody:
                    "Подарила мужу романтичную песню на годовщину. Он был в полном шоке! Говорит, это лучший подарок за всю нашу жизнь. И правда, песня получилась очень трогательная и личная.",
                },
              ],
            }),
          }}
        />

        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionBar />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Что говорят наши клиенты
            </h2>
            <p className="text-lg text-muted-foreground">
              Более 5&nbsp;000 песен создано
            </p>
          </div>

          <StaggeredGrid className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Мария",
                text: "Заказала песню для мамы на юбилей. Когда она услышала, просто расплакалась от счастья. Там были все наши семейные истории. Спасибо за такой подарок!",
              },
              {
                name: "Алексей",
                text: "Сделал песню-прожарку для друга на день рождения. Вся компания смеялась до слёз! Качество трека как у настоящих исполнителей. Однозначно буду заказывать ещё!",
              },
              {
                name: "Екатерина",
                text: "Подарила мужу романтичную песню на годовщину. Он был в полном шоке! Говорит, это лучший подарок за всю нашу жизнь. Песня получилась очень трогательная и личная.",
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="relative bg-white rounded-2xl border border-border/60 shadow-xs p-7 flex flex-col h-full hover:shadow-md transition-all duration-300"
              >
                {/* Decorative quote */}
                <span
                  className="absolute top-4 right-5 text-5xl leading-none font-serif text-primary/8 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">
                      {review.name}
                    </span>
                    <Stars />
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed grow">
                  &laquo;{review.text}&raquo;
                </p>
              </motion.div>
            ))}
          </StaggeredGrid>
        </div>
      </section>
    </AnimatedSection>
  );
}
