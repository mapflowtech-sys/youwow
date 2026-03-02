"use client";

import { motion } from "framer-motion";
import { Mic, Music, Headphones, Clock } from "lucide-react";
import { AnimatedSection, SectionBadge, ease } from "./AnimationWrappers";

const steps = [
  {
    step: 1,
    title: "Расскажите о человеке",
    description:
      "Укажите имя, характер, увлечения, забавные истории. Чем больше деталей, тем круче песня",
    time: "~2 мин",
    icon: Mic,
    accentColor: "text-primary",
    accentBg: "bg-primary/8",
    dotColor: "bg-primary",
  },
  {
    step: 2,
    title: "Выберите стиль и жанр",
    description:
      "Поп, рок, рэп или шансон? Юмор или лирика? Мужской или женский голос? Всё можно настроить",
    time: "~1 мин",
    icon: Music,
    accentColor: "text-plum",
    accentBg: "bg-plum/8",
    dotColor: "bg-plum",
  },
  {
    step: 3,
    title: "Получите готовый трек",
    description:
      "Оплатите и получите профессиональный трек на email. Скачайте на сайте или поделитесь ссылкой",
    time: "~7 мин",
    icon: Headphones,
    accentColor: "text-gold",
    accentBg: "bg-gold/8",
    dotColor: "bg-gold",
  },
];

export default function HowItWorksSection() {
  return (
    <AnimatedSection>
      <section className="py-20 md:py-24 bg-secondary/50 wave-divider">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14 md:mb-16">
            <SectionBadge>
              <Clock className="w-4 h-4" aria-hidden="true" />
              Всего 10 минут
            </SectionBadge>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-plum">
              Как это работает
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              От идеи до готового трека за три простых шага
            </p>
          </div>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.12, ease }}
                className="text-center"
              >
                {/* Step number + icon */}
                <div className="flex flex-col items-center mb-5">
                  <div className="relative mb-4">
                    <div
                      className={`w-[4.25rem] h-[4.25rem] rounded-2xl ${item.accentBg} flex items-center justify-center`}
                    >
                      <item.icon
                        className={`h-6 w-6 ${item.accentColor}`}
                        aria-hidden="true"
                      />
                    </div>
                    {/* Step number badge */}
                    <span
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${item.dotColor} text-white text-xs font-bold flex items-center justify-center shadow-sm`}
                    >
                      {item.step}
                    </span>
                  </div>

                  {/* Time badge */}
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground/70">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {item.time}
                  </span>
                </div>

                {/* Text */}
                <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </AnimatedSection>
  );
}
