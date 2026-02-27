"use client";

import { motion } from "framer-motion";
import { ArrowRight, Home, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ease } from "./AnimationWrappers";

export default function HeroSection() {
  return (
    <>
      {/* ── Breadcrumbs ── */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-6"
      >
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <a
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
              aria-label="Вернуться на главную"
            >
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Главная</span>
            </a>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </li>
          <li className="text-foreground font-medium" aria-current="page">
            Персональная песня
          </li>
        </ol>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Decorative warm blobs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, hsl(348 75% 62% / 0.12) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(38 90% 55% / 0.15) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold mb-6 text-foreground leading-[1.1] tracking-tight">
              Персональная песня
              <br />
              <span className="text-primary">в подарок</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Уникальная композиция с&nbsp;именами, фактами и&nbsp;личными
              историями получателя. Подарок, который удивляет с&nbsp;первого
              прослушивания
            </p>

            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="inline-flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-full px-5 py-2.5 mb-10"
            >
              <span className="flex items-center gap-1 text-sm font-medium text-foreground/80">
                <Star
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                4.9 из 5
              </span>
              <span className="w-px h-4 bg-border" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">
                Готово за 10 минут
              </span>
              <span className="w-px h-4 bg-border" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground/80">
                590&nbsp;&#8381;
              </span>
            </motion.div>

            <div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  onClick={() =>
                    document
                      .getElementById("order-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  aria-label="Создать персональную песню — перейти к форме заказа"
                >
                  Создать песню
                  <ArrowRight
                    className="ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
