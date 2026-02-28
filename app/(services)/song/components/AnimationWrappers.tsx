"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

// ─── Animation Helpers ──────────────────────────────────────────────────────

export const ease = [0.22, 1, 0.36, 1] as const;

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export function StaggeredGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Accent Bar (decorative) ────────────────────────────────────────

export function SectionBar() {
  return (
    <div className="flex justify-center mb-6">
      <div className="w-10 h-1 rounded-full bg-primary/60" />
    </div>
  );
}

// ─── Star Rating ────────────────────────────────────────────────────────────

export function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} из 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-amber-400 text-amber-400"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ─── NEW: Animated Counter ──────────────────────────────────────────────────

export function CountUp({
  target,
  suffix = "",
  duration = 1.8,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frame: number;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}

// ─── NEW: Floating Decorative Element ───────────────────────────────────────

export function FloatingNote({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none text-3xl md:text-4xl animate-float-note ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// ─── NEW: Waveform Visualization ────────────────────────────────────────────

// Pre-computed deterministic bar heights (avoids hydration mismatch from Math.sin)
const WAVEFORM_HEIGHTS = [15, 30, 22, 38, 18, 42, 25, 35, 20, 45, 28, 32, 17, 40, 23, 37, 19, 43, 26, 34, 21, 44, 29, 31, 16, 41, 24, 36, 18, 39, 27, 33];
const WAVEFORM_SCALES = [0.3, 0.55, 0.4, 0.65, 0.35, 0.7, 0.45, 0.6, 0.38, 0.72, 0.48, 0.58, 0.32, 0.68, 0.42, 0.62, 0.36, 0.71, 0.46, 0.59, 0.39, 0.73, 0.5, 0.57, 0.31, 0.69, 0.43, 0.63, 0.34, 0.67, 0.47, 0.56];

export function WaveformBars({
  isPlaying,
  barCount = 32,
  className = "",
}: {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}) {
  return (
    <div className={`waveform-bars ${isPlaying ? "playing" : ""} ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={`bar ${isPlaying ? "bg-white/70" : "bg-white/35"}`}
          style={{
            height: `${WAVEFORM_HEIGHTS[i % WAVEFORM_HEIGHTS.length]}%`,
            animationDelay: isPlaying ? `${i * 0.04}s` : undefined,
            transform: isPlaying ? undefined : `scaleY(${WAVEFORM_SCALES[i % WAVEFORM_SCALES.length]})`,
          }}
        />
      ))}
    </div>
  );
}

// ─── NEW: Section Badge ─────────────────────────────────────────────────────

export function SectionBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-primary ${className}`}
    >
      {children}
    </div>
  );
}
