"use client";

import { motion } from "framer-motion";
import { Mic, Music, Headphones, Clock } from "lucide-react";
import {
  AnimatedSection,
  StaggeredGrid,
  cardVariants,
  SectionBadge,
} from "./AnimationWrappers";

const steps = [
  {
    step: 1,
    number: "01",
    title: "Расскажите о человеке",
    description:
      "Укажите имя, характер, увлечения, забавные истории. Чем больше деталей — тем круче песня",
    time: "~2 мин",
    icon: Mic,
    gradient: "from-rose-500 to-pink-400",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    step: 2,
    number: "02",
    title: "Выберите стиль и жанр",
    description:
      "Поп, рок, рэп или шансон? Юмор или лирика? Мужской или женский голос? Всё можно настроить",
    time: "~1 мин",
    icon: Music,
    gradient: "from-violet-500 to-purple-400",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    step: 3,
    number: "03",
    title: "Получите готовый трек",
    description:
      "Оплатите и получите профессиональный трек на email. Скачайте на сайте или поделитесь ссылкой",
    time: "~10 мин",
    icon: Headphones,
    gradient: "from-amber-500 to-orange-400",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

export default function HowItWorksSection() {
  return (
    <AnimatedSection>
      <section className="py-20 md:py-24 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* ── Header ── */}
          <div className="text-center mb-16">
            <SectionBadge>
              <Clock className="w-4 h-4" aria-hidden="true" />
              Всего 10 минут
            </SectionBadge>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              Как это работает
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              От идеи до готового трека — три простых шага
            </p>
          </div>

          {/* ── Steps ── */}
          <StaggeredGrid className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                variants={cardVariants}
                className={`relative bg-white rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1.5 transition-all duration-300 ${
                  index < steps.length - 1 ? "timeline-connector" : ""
                }`}
              >
                {/* ── Large step number ── */}
                <div
                  className={`text-7xl md:text-8xl font-bold leading-none mb-6 bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent opacity-15 select-none`}
                  aria-hidden="true"
                >
                  {item.number}
                </div>

                {/* ── Icon + step label ── */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${item.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Шаг {item.step}
                  </span>
                </div>

                {/* ── Content ── */}
                <h3 className="font-display text-xl font-bold mb-3 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* ── Time badge ── */}
                <div className="inline-flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {item.time}
                </div>
              </motion.div>
            ))}
          </StaggeredGrid>

          {/* ── Total time callout ── */}
          <AnimatedSection delay={0.4}>
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock
                    className="w-4 h-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  Итого:{" "}
                  <strong className="text-foreground">~13 минут</strong> от
                  заполнения формы до готового трека
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </AnimatedSection>
  );
}
