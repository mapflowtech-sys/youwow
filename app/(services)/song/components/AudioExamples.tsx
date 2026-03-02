"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  StaggeredGrid,
  WaveformBars,
  SectionBadge,
  cardVariants,
} from "./AnimationWrappers";

// ─── Audio Data ─────────────────────────────────────────────────────────────

const examples = [
  {
    title: "Песня для друга",
    subtitle: "Для того, кто всегда рядом",
    audioSrc: "/examples/pop-friend.mp3",
    genre: "Поп",
    accentColor: "#E8567F",
    accentBg: "bg-primary/10",
    accentText: "text-primary",
  },
  {
    title: "Песня для коллеги",
    subtitle: "Для человека из твоей команды",
    audioSrc: "/examples/rap-colleague.mp3",
    genre: "Рэп",
    accentColor: "#7C3AED",
    accentBg: "bg-violet-500/10",
    accentText: "text-violet-500",
  },
  {
    title: "Песня для мамы",
    subtitle: "Для самого родного человека",
    audioSrc: "/examples/chanson-mom.mp3",
    genre: "Шансон",
    accentColor: "#C9956B",
    accentBg: "bg-gold/10",
    accentText: "text-gold",
  },
  {
    title: "Песня для брата",
    subtitle: "Для самого близкого человека",
    audioSrc: "/examples/rock-brother.mp3",
    genre: "Рок",
    accentColor: "#5B2C6F",
    accentBg: "bg-plum/10",
    accentText: "text-plum",
  },
];

// ─── Audio Player Card ──────────────────────────────────────────────────────

function AudioPlayerCard({
  title,
  subtitle,
  audioSrc,
  genre,
  accentColor,
  accentBg,
  accentText,
  onPlay,
}: {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
  onPlay: (audio: HTMLAudioElement) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    const handlePause = () => setIsPlaying(false);
    const handleLoaded = () => {
      if (audio.duration && isFinite(audio.duration)) {
        const min = Math.floor(audio.duration / 60);
        const sec = Math.floor(audio.duration % 60);
        setDuration(`${min}:${sec.toString().padStart(2, "0")}`);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      onPlay(audio);
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <motion.div variants={cardVariants} className="min-w-[280px] sm:min-w-0">
      <div className="card-tilt bg-surface-dark rounded-2xl overflow-hidden">
        {/* Accent color line at top */}
        <div
          className="h-1"
          style={{ background: accentColor }}
          aria-hidden="true"
        />

        {/* Waveform area — dark */}
        <div
          className="relative aspect-[4/3] flex items-center justify-center cursor-pointer bg-surface-dark-card"
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && togglePlay()}
          aria-label={
            isPlaying ? `Остановить ${title}` : `Воспроизвести ${title}`
          }
        >
          {/* Waveform */}
          <div className="absolute inset-0 flex items-end px-4 pb-14 pt-4">
            <WaveformBars
              isPlaying={isPlaying}
              barCount={24}
              className="h-full"
            />
          </div>

          {/* Play/Pause button with vinyl spin */}
          <button
            className={`relative z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200 ${
              isPlaying ? "animate-pulse-ring" : ""
            }`}
            aria-hidden="true"
            tabIndex={-1}
          >
            <div className={isPlaying ? "animate-vinyl-spin" : ""}>
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-0.5" />
              )}
            </div>
          </button>

          {/* Genre badge */}
          <span
            className="absolute top-3 left-3 text-xs font-semibold bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full"
          >
            {genre}
          </span>

          {/* Duration */}
          {duration && (
            <span className="absolute top-3 right-3 text-xs font-medium text-white/50">
              {duration}
            </span>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <div
              className="h-full transition-[width] duration-200"
              style={{ width: `${progress}%`, background: accentColor }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${accentBg} ${accentText}`}
            >
              {genre}
            </span>
          </div>
          <h4 className="font-semibold text-white text-base mt-2">{title}</h4>
          <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>
        </div>

        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
          aria-label={`Аудио: ${title}`}
        />
      </div>
    </motion.div>
  );
}

// ─── Examples Section ───────────────────────────────────────────────────────

export default function ExamplesGrid() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (audioElement: HTMLAudioElement) => {
    if (currentAudioRef.current && currentAudioRef.current !== audioElement) {
      currentAudioRef.current.pause();
    }
    currentAudioRef.current = audioElement;
  };

  return (
    <>
      {/* Desktop: grid | Mobile: horizontal scroll */}
      <StaggeredGrid className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {examples.map((example, index) => (
          <AudioPlayerCard
            key={index}
            {...example}
            onPlay={handlePlay}
          />
        ))}
      </StaggeredGrid>

      {/* Mobile: horizontal carousel */}
      <div className="sm:hidden">
        <div className="flex gap-4 overflow-x-auto scroll-snap-x pb-4 -mx-4 px-4">
          {examples.map((example, index) => (
            <div key={index} className="scroll-snap-item flex-shrink-0 w-[80vw]">
              <AudioPlayerCard
                {...example}
                onPlay={handlePlay}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Свайпните для просмотра
        </p>
      </div>

      {/* Secondary CTA */}
      <AnimatedSection delay={0.3}>
        <div className="text-center mt-12">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-5 rounded-xl border-plum/20 text-plum hover:bg-plum/5 hover:border-plum/30 transition-all duration-300 cursor-pointer"
              onClick={() =>
                document
                  .getElementById("order-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Хочу такую же песню
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </AnimatedSection>
    </>
  );
}
