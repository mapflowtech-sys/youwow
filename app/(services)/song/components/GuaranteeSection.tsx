"use client";

import { ShieldCheck } from "lucide-react";
import { AnimatedSection } from "./AnimationWrappers";

export default function GuaranteeSection() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          GUARANTEE
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-16 bg-primary/3">
          <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8 text-center">
            <ShieldCheck
              className="w-12 h-12 text-primary mx-auto mb-5"
              aria-hidden="true"
            />
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Гарантия результата
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
              Если в готовом треке что-то хочется изменить — мы бесплатно
              доработаем песню. Наша цель — чтобы вы получили эмоцию, которой
              захотите поделиться и&nbsp;подарить. Мы всегда на связи и&nbsp;готовы
              помочь.
            </p>
            <p className="text-sm text-muted-foreground">
              Поддержка 24/7:{" "}
              <a
                href="https://t.me/youwow_support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                @youwow_support
              </a>
            </p>
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
