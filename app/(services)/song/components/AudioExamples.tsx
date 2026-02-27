"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import {
  AnimatedSection,
  StaggeredGrid,
  SectionBar,
  cardVariants,
} from "./AnimationWrappers";

// ─── Audio Player Card ──────────────────────────────────────────────────────

function AudioPlayerCard({
  title,
  subtitle,
  audioSrc,
  accentColor,
  onPlay,
}: {
  title: string;
  subtitle: string;
  audioSrc: string;
  accentColor: string;
  onPlay: (audio: HTMLAudioElement) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
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

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
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
      <div className="group bg-white rounded-2xl border border-border/60 shadow-xs hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300">
        <div className="p-5">
          <div
            className={`relative overflow-hidden rounded-xl ${accentColor} aspect-square flex items-center justify-center cursor-pointer`}
            onClick={togglePlay}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && togglePlay()}
            aria-label={
              isPlaying
                ? `Остановить ${title}`
                : `Воспроизвести ${title}`
            }
          >
            <button
              className={`w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 ${
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

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
              <div
                className="h-full bg-primary/60 transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h4 className="font-semibold text-foreground mt-4">{title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>

        <audio
          ref={audioRef}
          src={audioSrc}
          preload="none"
          aria-label={`Аудио: ${title}`}
        />
      </div>
    </motion.div>
  );
}

// ─── Examples Grid ──────────────────────────────────────────────────────────

function ExamplesGrid() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (audioElement: HTMLAudioElement) => {
    if (currentAudioRef.current && currentAudioRef.current !== audioElement) {
      currentAudioRef.current.pause();
    }
    currentAudioRef.current = audioElement;
  };

  const examples = [
    {
      title: "Песня для друга",
      subtitle: "Для того, кто всегда рядом",
      audioSrc: "/examples/pop-friend.mp3",
      accentColor: "bg-rose-50",
    },
    {
      title: "Песня для коллеги",
      subtitle: "Для человека из твоей команды",
      audioSrc: "/examples/rap-colleague.mp3",
      accentColor: "bg-amber-50",
    },
    {
      title: "Песня для мамы",
      subtitle: "Для самого родного человека",
      audioSrc: "/examples/chanson-mom.mp3",
      accentColor: "bg-sky-50",
    },
    {
      title: "Песня для брата",
      subtitle: "Для самого близкого человека",
      audioSrc: "/examples/rock-brother.mp3",
      accentColor: "bg-violet-50",
    },
  ];

  return (
    <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {examples.map((example, index) => (
        <AudioPlayerCard
          key={index}
          title={example.title}
          subtitle={example.subtitle}
          audioSrc={example.audioSrc}
          accentColor={example.accentColor}
          onPlay={handlePlay}
        />
      ))}
    </StaggeredGrid>
  );
}

export default ExamplesGrid;
