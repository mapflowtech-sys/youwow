"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  ChevronRight,
  Star,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ease, TextReveal } from "./AnimationWrappers";

// ─── Background Sound Wave Lines (full-width, behind text) ──────────────────

function HeroWaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 1440 600"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.035]"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Flowing sound wave curves */}
        <motion.path
          d="M0,300 C200,250 400,350 600,280 C800,210 1000,340 1200,290 C1350,260 1440,300 1440,300"
          stroke="hsl(280 40% 25%)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        />
        <motion.path
          d="M0,320 C240,370 440,260 680,330 C920,400 1100,270 1300,320 C1400,340 1440,320 1440,320"
          stroke="hsl(348 75% 62%)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M0,280 C180,230 380,310 580,260 C780,210 980,300 1180,270 C1340,250 1440,280 1440,280"
          stroke="hsl(28 55% 60%)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.7, ease: "easeOut" }}
        />
      </svg>

      {/* Subtle radial warmth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(348 75% 62% / 0.03) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 30% 60%, hsl(28 55% 60% / 0.025) 0%, transparent 50%), radial-gradient(ellipse 40% 40% at 70% 60%, hsl(280 40% 25% / 0.02) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <>
      {/* ── Breadcrumbs ── */}
      <nav
        aria-label="Breadcrumb"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-6"
      >
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <a
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors link-underline"
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

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28">
        <HeroWaveBackground />

        <div className="relative mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
          {/* Activity badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">
                <strong className="text-foreground font-semibold">5 247</strong>{" "}
                песен создано
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-plum leading-[1.1] tracking-tight">
            <TextReveal text="Подарите эмоцию, которую" />
            <br />
            <TextReveal text="невозможно" delay={0.15} />{" "}
            <span className="text-gradient-hero italic">
              <TextReveal text="забыть" delay={0.3} />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease }}
            className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Персональная песня с&nbsp;именем, историями и&nbsp;фактами
            о&nbsp;вашем близком человеке. Студийное звучание
            за&nbsp;10&nbsp;минут
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-primary hover:bg-primary-dark text-white rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
                onClick={() =>
                  document
                    .getElementById("order-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                aria-label="Создать персональную песню, перейти к форме заказа"
              >
                Создать песню за 590&nbsp;&#8381;
                <ArrowRight
                  className="ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Single trust row — 3 key facts, no duplication */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Star
                className="w-4 h-4 fill-gold text-gold"
                aria-hidden="true"
              />
              <strong className="text-foreground">4.9</strong> из 344 оценок
            </span>
            <span
              className="hidden sm:block w-px h-4 bg-border"
              aria-hidden="true"
            />
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-gold" aria-hidden="true" />
              Готово за 10 минут
            </span>
            <span
              className="hidden sm:block w-px h-4 bg-border"
              aria-hidden="true"
            />
            <span className="flex items-center gap-1.5">
              <RefreshCw
                className="w-4 h-4 text-plum-light"
                aria-hidden="true"
              />
              Бесплатная доработка
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
}
