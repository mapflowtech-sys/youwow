"use client";

import { motion } from "framer-motion";
import { Mic, Music, Headphones } from "lucide-react";
import {
  AnimatedSection,
  StaggeredGrid,
  SectionBar,
  cardVariants,
} from "./AnimationWrappers";

export default function HowItWorksSection() {
  return (
    <AnimatedSection>
      <section className="py-20 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionBar />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Как это работает
            </h2>
            <p className="text-lg text-muted-foreground">
              Три простых шага до уникального музыкального подарка
            </p>
          </div>

          <StaggeredGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              {
                step: 1,
                title: "Расскажите о человеке",
                description:
                  "Укажите имя, увлечения, смешные истории. Чем больше деталей, тем круче песня",
                icon: Mic,
                iconBg: "bg-rose-50",
                iconColor: "text-primary",
              },
              {
                step: 2,
                title: "Выберите стиль",
                description:
                  "Поп, рок, рэп или шансон? Юмор или лирика? Мужской или женский голос?",
                icon: Music,
                iconBg: "bg-amber-50",
                iconColor: "text-amber-600",
              },
              {
                step: 3,
                title: "Получите готовый трек",
                description:
                  "Песня будет готова через 10 минут. Скачайте на сайте или получите на email",
                icon: Headphones,
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={cardVariants}
                className={`bg-white rounded-2xl p-8 border border-border/60 shadow-xs hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300 ${
                  index === 2
                    ? "sm:col-span-2 sm:max-w-md sm:mx-auto lg:col-span-1 lg:max-w-none"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-5">
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

                <h3 className="font-display text-xl font-bold mb-3 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </StaggeredGrid>
        </div>
      </section>
    </AnimatedSection>
  );
}
