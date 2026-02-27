"use client";

import { ChevronDown } from "lucide-react";
import { AnimatedSection, SectionBar } from "./AnimationWrappers";

export const faqItems = [
  {
    question: "Это реально поют люди или AI?",
    answer:
      "Честно — это AI-технология, но не та, что звучит роботизированно. Мы используем самые современные модели синтеза голоса, обученные на записях профессиональных вокалистов. Результат: чистый, живой звук. Включите любой пример — сами услышите.",
  },
  {
    question: "Сколько это стоит?",
    answer:
      "590 рублей — и всё включено. Полноценный трек с вокалом, аранжировкой и текстом, написанным специально под вашу историю. Без скрытых доплат.",
  },
  {
    question: "За сколько будет готова песня?",
    answer:
      "Примерно за 10 минут после оплаты. Вы получите трек на почту и сможете сразу скачать его на сайте.",
  },
  {
    question: "А если мне не понравится?",
    answer:
      "Тогда мы бесплатно переделаем песню. Можно изменить жанр, настроение, добавить или убрать детали из текста.",
  },
  {
    question: "Что нужно написать для создания песни?",
    answer:
      "Расскажите о человеке: имя, характер, увлечения, смешные или трогательные моменты из жизни. Чем больше деталей — тем круче получится.",
  },
  {
    question: "Можно выбрать жанр и голос?",
    answer:
      "Конечно. Доступны все популярные жанры: поп, рок, рэп, шансон, джаз, электроника, блюз, кантри, акустика. Голос — мужской или женский.",
  },
  {
    question: "Это точно будет уникально?",
    answer:
      "Исключено повторение. Даже с похожими данными каждая песня создаётся с нуля: новая мелодия, аранжировка, структура. Каждый трек оригинален на 100%.",
  },
];

export default function FAQSection() {
  return (
    <AnimatedSection>
      <section className="py-20 bg-secondary/50">
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionBar />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Частые вопросы
            </h2>
            <p className="text-lg text-muted-foreground">
              Отвечаем честно на всё, что вас волнует
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-xl border border-border/60 overflow-hidden hover:border-primary/30 transition-colors duration-200"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-foreground list-none select-none [&::-webkit-details-marker]:hidden">
                  <span className="pr-6">{faq.question}</span>
                  <ChevronDown
                    className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180 shrink-0"
                    aria-hidden="true"
                  />
                </summary>
                <div className="faq-answer">
                  <div>
                    <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
