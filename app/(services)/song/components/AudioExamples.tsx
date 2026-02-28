"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AnimatedSection,
  StaggeredGrid,
  SectionBar,
  WaveformBars,
  cardVariants,
} from "./AnimationWrappers";

// ─── Audio Data ──────────────────────────────────────────────────────────────

const examples = [
  {
    title: "Песня для друга",
    subtitle: "Для того, кто всегда рядом",
    audioSrc: "/examples/pop-friend.mp3",
    genre: "Поп",
    gradientFrom: "from-rose-400",
    gradientTo: "to-pink-500",
    bgAccent: "bg-gradient-to-br from-rose-400/90 to-pink-500/90",
  },
  {
    title: "Песня для коллеги",
    subtitle: "Для человека из твоей команды",
    audioSrc: "/examples/rap-colleague.mp3",
    genre: "Рэп",
    gradientFrom: "from-violet-400",
    gradientTo: "to-purple-500",
    bgAccent: "bg-gradient-to-br from-violet-400/90 to-purple-500/90",
  },
  {
    title: "Песня для мамы",
    subtitle: "Для самого родного человека",
    audioSrc: "/examples/chanson-mom.mp3",
    genre: "Шансон",
    gradientFrom: "from-amber-400",
    gradientTo: "to-orange-500",
    bgAccent: "bg-gradient-to-br from-amber-400/90 to-orange-500/90",
  },
  {
    title: "Песня для брата",
    subtitle: "Для самого близкого человека",
    audioSrc: "/examples/rock-brother.mp3",
    genre: "Рок",
    gradientFrom: "from-sky-400",
    gradientTo: "to-blue-500",
    bgAccent: "bg-gradient-to-br from-sky-400/90 to-blue-500/90",
  },
];

// ─── Audio Player Card ──────────────────────────────────────────────────────

function AudioPlayerCard({
  title,
  subtitle,
  audioSrc,
  genre,
  bgAccent,
  onPlay,
}: {
  title: string;
  subtitle: string;
  audioSrc: string;
  genre: string;
  bgAccent: string;
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
    <motion.div variants={cardVariants}>
      <div className="group bg-white rounded-2xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/[0.06] hover:-translate-y-1.5 transition-all duration-300">
        {/* ── Waveform area ── */}
        <div
          className={`relative overflow-hidden rounded-t-2xl ${bgAccent} aspect-[4/3] flex items-center justify-center cursor-pointer`}
          onClick={togglePlay}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && togglePlay()}
          aria-label={
            isPlaying ? `Остановить ${title}` : `Воспроизвести ${title}`
          }
        >
          {/* Waveform visualization */}
          <div className="absolute inset-0 flex items-end px-4 pb-12 pt-4">
            <WaveformBars isPlaying={isPlaying} barCount={28} className="h-full" />
          </div>

          {/* Play/Pause button */}
          <button
            className={`relative z-10 w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-200 ${
              isPlaying ? "animate-pulse-ring" : ""
            }`}
            aria-hidden="true"
            tabIndex={-1}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-foreground" />
            ) : (
              <Play className="h-6 w-6 text-foreground ml-0.5" />
            )}
          </button>

          {/* Genre badge */}
          <span className="absolute top-3 left-3 text-xs font-semibold bg-white/25 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            {genre}
          </span>

          {/* Duration */}
          {duration && (
            <span className="absolute top-3 right-3 text-xs font-medium text-white/80">
              {duration}
            </span>
          )}

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
            <div
              className="h-full bg-white/80 transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ── Info ── */}
        <div className="p-5">
          <h4 className="font-semibold text-foreground text-base">{title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
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

// ─── Examples Section ────────────────────────────────────────────────────────

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
      <StaggeredGrid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {examples.map((example, index) => (
          <AudioPlayerCard
            key={index}
            title={example.title}
            subtitle={example.subtitle}
            audioSrc={example.audioSrc}
            genre={example.genre}
            bgAccent={example.bgAccent}
            onPlay={handlePlay}
          />
        ))}
      </StaggeredGrid>

      {/* ── Secondary CTA ── */}
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
              className="text-base px-8 py-5 rounded-xl border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 cursor-pointer"
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
