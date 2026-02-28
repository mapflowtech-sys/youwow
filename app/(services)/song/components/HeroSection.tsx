"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Home,
  ChevronRight,
  Shield,
  Zap,
  RefreshCw,
  Star,
  Music,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ease, CountUp, FloatingNote } from "./AnimationWrappers";

// ─── Stats Item ──────────────────────────────────────────────────────────────

function StatItem({
  value,
  label,
  delay,
}: {
  value: React.ReactNode;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease }}
      className="text-center"
    >
      <div className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
        {value}
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-0.5">
        {label}
      </div>
    </motion.div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

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
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
        {/* ── Gradient background ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(350 80% 96%) 0%, hsl(30 50% 97%) 40%, hsl(40 40% 97%) 70%, hsl(0 0% 98%) 100%)",
          }}
          aria-hidden="true"
        />

        {/* ── Mesh gradient orbs ── */}
        <div
          className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full opacity-40 blur-[140px]"
          style={{ background: "hsl(348 75% 62% / 0.08)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-5%] right-[10%] w-[500px] h-[500px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "hsl(38 90% 55% / 0.1)" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-[30%] right-[30%] w-[300px] h-[300px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "hsl(348 75% 62% / 0.06)" }}
          aria-hidden="true"
        />

        {/* ── Floating notes ── */}
        <FloatingNote className="top-24 left-[8%] opacity-15" delay={0}>
          <Music className="w-8 h-8 text-primary/40" />
        </FloatingNote>
        <FloatingNote className="top-16 right-[12%] opacity-10" delay={1.8}>
          <Music className="w-6 h-6 text-primary/30" />
        </FloatingNote>
        <FloatingNote className="bottom-32 left-[18%] opacity-10" delay={0.9}>
          <Music className="w-7 h-7 text-amber-400/30" />
        </FloatingNote>
        <FloatingNote className="top-[45%] right-[8%] opacity-10" delay={2.5}>
          <Music className="w-5 h-5 text-primary/25" />
        </FloatingNote>
        <FloatingNote
          className="bottom-24 right-[22%] opacity-10"
          delay={1.3}
        >
          <Music className="w-6 h-6 text-amber-400/25" />
        </FloatingNote>

        {/* ── Content ── */}
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* ── Activity badge ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-primary/10 rounded-full px-5 py-2.5 mb-8 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-foreground/70">
                Уже <strong className="text-foreground">5 247</strong>{" "}
                счастливых получателей
              </span>
            </motion.div>

            {/* ── Headline ── */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold mb-6 text-foreground leading-[1.08] tracking-tight">
              Подарите эмоцию,
              <br />
              которую невозможно
              <br />
              <span className="text-gradient-primary">забыть</span>
            </h1>

            {/* ── Subtitle ── */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
              className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Персональная песня с&nbsp;именем, историями и&nbsp;фактами
              о&nbsp;вашем близком человеке. Студийное звучание
              за&nbsp;10&nbsp;минут
            </motion.p>

            {/* ── CTA button ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-rose-400 hover:from-primary-dark hover:to-primary text-white rounded-2xl shadow-lg animate-glow-pulse transition-all duration-300 cursor-pointer"
                  onClick={() =>
                    document
                      .getElementById("order-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  aria-label="Создать персональную песню — перейти к форме заказа"
                >
                  Создать песню за 590&nbsp;&#8381;
                  <ArrowRight
                    className="ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* ── Trust signals ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Shield
                  className="w-4 h-4 text-emerald-500"
                  aria-hidden="true"
                />
                Безопасная оплата
              </span>
              <span
                className="hidden sm:block w-px h-4 bg-border"
                aria-hidden="true"
              />
              <span className="flex items-center gap-1.5">
                <Zap
                  className="w-4 h-4 text-amber-500"
                  aria-hidden="true"
                />
                Готово за 10 минут
              </span>
              <span
                className="hidden sm:block w-px h-4 bg-border"
                aria-hidden="true"
              />
              <span className="flex items-center gap-1.5">
                <RefreshCw
                  className="w-4 h-4 text-primary"
                  aria-hidden="true"
                />
                Бесплатная доработка
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-12 z-10 mb-4" aria-label="Статистика">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="bg-white rounded-2xl shadow-lg shadow-black/[0.04] border border-border/50 px-6 py-7 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            <StatItem
              value={<CountUp target={5247} suffix="+" />}
              label="песен создано"
              delay={0.6}
            />
            <StatItem
              value={
                <span className="flex items-center justify-center gap-1.5">
                  4.9
                  <Star
                    className="w-5 h-5 fill-amber-400 text-amber-400 inline"
                    aria-hidden="true"
                  />
                </span>
              }
              label="из 344 оценок"
              delay={0.7}
            />
            <StatItem value="10 мин" label="генерация" delay={0.8} />
            <StatItem
              value={
                <span>
                  590&nbsp;<span className="text-lg">&#8381;</span>
                </span>
              }
              label="всё включено"
              delay={0.9}
            />
          </div>
        </div>
      </section>
    </>
  );
}
