"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Play,
  Pause,
  ChevronDown,
  Home,
  ChevronRight,
  Mic,
  Music,
  Headphones,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SongFormData as APISongFormData } from "@/lib/genapi/text-generation";
import PaymentWidget from "@/components/PaymentWidget";

// ─── Validation Schema ──────────────────────────────────────────────────────

const songFormSchema = z.object({
  aboutPerson: z
    .string()
    .min(10, "Расскажите о человеке подробнее (минимум 10 символов)")
    .max(500, "Слишком длинное описание (максимум 500 символов)"),
  facts: z
    .string()
    .min(20, "Опишите тему песни подробнее (минимум 20 символов)")
    .max(800, "Слишком длинное описание (максимум 800 символов)"),
  mustInclude: z
    .string()
    .max(200, "Слишком много обязательных фраз (максимум 200 символов)")
    .optional(),
  occasion: z.string().min(1, "Выберите повод для песни"),
  customOccasion: z.string().optional(),
  textStyle: z.string().min(1, "Выберите стиль песни"),
  customStyle: z.string().optional(),
  genre: z.string().min(1, "Выберите жанр музыки"),
  voice: z.enum(["male", "female"]),
  email: z
    .string()
    .email("Введите корректный email адрес")
    .min(5, "Email слишком короткий"),
  agreedToPolicy: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие с условиями",
  }),
});

type SongFormData = z.infer<typeof songFormSchema>;

// ─── Animation Helpers ──────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

function AnimatedSection({
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

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

function StaggeredGrid({
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
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Accent Bar (decorative) ────────────────────────────────────────

function SectionBar() {
  return (
    <div className="flex justify-center mb-6">
      <div className="w-10 h-1 rounded-full bg-primary/60" />
    </div>
  );
}

// ─── Star Rating ────────────────────────────────────────────────────────────

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${count} из 5`}>
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
      <div className="group bg-white rounded-2xl border border-border/60 shadow-sm hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300">
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

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function SongPage() {
  const [step, setStep] = useState<"form" | "payment" | "processing">("form");
  const [orderId, setOrderId] = useState<string>("");
  const [confirmationToken, setConfirmationToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SongFormData>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      aboutPerson: "",
      facts: "",
      mustInclude: "",
      occasion: "",
      customOccasion: "",
      textStyle: "",
      customStyle: "",
      genre: "",
      voice: "female",
      email: "",
      agreedToPolicy: false,
    },
  });

  // Restore form data from localStorage
  useEffect(() => {
    const savedFormData = localStorage.getItem("song_form_draft");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData) as APISongFormData;
        form.reset({
          aboutPerson: parsedData.aboutWho || "",
          facts: parsedData.aboutWhat || "",
          mustInclude: parsedData.mustInclude || "",
          occasion: parsedData.occasion || "",
          customOccasion: parsedData.customOccasion || "",
          textStyle: parsedData.style || "",
          customStyle: parsedData.customStyle || "",
          genre: parsedData.genre || "",
          voice: parsedData.voice || "female",
          email: parsedData.email || "",
          agreedToPolicy: false,
        });
        console.log("[Form] Restored draft from localStorage");
      } catch (error) {
        console.error("[Form] Failed to restore draft:", error);
      }
    }
  }, [form]);

  const watchTextStyle = form.watch("textStyle");
  const watchOccasion = form.watch("occasion");

  const onSubmit = async (data: SongFormData) => {
    setIsSubmitting(true);

    try {
      console.log("[Song] Submitting form:", data);

      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          useWidget: true,
          formData: {
            voice: data.voice,
            aboutWho: data.aboutPerson,
            aboutWhat: data.facts,
            genre: data.genre,
            style: data.textStyle,
            customStyle: data.customStyle,
            occasion: data.occasion,
            customOccasion: data.customOccasion,
            mustInclude: data.mustInclude,
            email: data.email,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create payment");

      const result = await response.json();
      console.log("[Song] Payment created:", result);

      if (result.payment?.confirmationToken) {
        setOrderId(result.orderId);
        setConfirmationToken(result.payment.confirmationToken);
        setStep("payment");
      } else {
        throw new Error("No confirmation token received");
      }
    } catch (error) {
      console.error("[Song] Error:", error);
      alert("Ошибка при создании заказа. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Schema.org: Breadcrumbs ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: "https://youwow.ru",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Персональная песня на заказ",
                item: "https://youwow.ru/song",
              },
            ],
          }),
        }}
      />

      {/* ── Schema.org: Service ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Персональная песня на заказ",
            description:
              "Закажите уникальную персональную песню! Индивидуальная композиция с именем и историей получателя. Готово за 10 минут. Идеальный подарок на день рождения, Новый год или любой праздник.",
            provider: {
              "@type": "Organization",
              name: "YouWow",
              url: "https://youwow.ru",
            },
            serviceType: "Музыкальный подарок",
            areaServed: "RU",
            offers: {
              "@type": "Offer",
              price: "590",
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              priceValidUntil: "2026-12-31",
              url: "https://youwow.ru/song",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "344",
              bestRating: "5",
              worstRating: "1",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Жанры песен",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Классический поп",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Рок" },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Рэп / Хип-хоп",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Шансон" },
                },
              ],
            },
          }),
        }}
      />

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

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
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
                  className={`bg-white rounded-2xl p-8 border border-border/60 shadow-sm hover:shadow-lg hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300 ${
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

      {/* ════════════════════════════════════════════════════════════════════
          AUDIO EXAMPLES
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBar />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Послушайте примеры
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Реальные песни, которые наши клиенты получили в&nbsp;подарок
              </p>
              <p className="text-sm text-muted-foreground">
                Все треки публикуются с&nbsp;согласия авторов
              </p>
            </div>

            <ExamplesGrid />
          </div>
        </section>
      </AnimatedSection>

      {/* ════════════════════════════════════════════════════════════════════
          REVIEWS
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 bg-secondary/50">
          {/* Schema.org Reviews */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: "Персональная песня на заказ",
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.9",
                  reviewCount: "344",
                },
                review: [
                  {
                    "@type": "Review",
                    author: { "@type": "Person", name: "Мария" },
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: "5",
                    },
                    reviewBody:
                      "Заказала песню для мамы на юбилей. Когда она услышала, просто расплакалась от счастья. Там были все наши семейные истории, которые я указала в форме. Спасибо вам огромное за такой подарок!",
                  },
                  {
                    "@type": "Review",
                    author: { "@type": "Person", name: "Алексей" },
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: "5",
                    },
                    reviewBody:
                      "Сделал песню-прожарку для друга на день рождения. Вся компания смеялась до слёз! Качество трека как у настоящих исполнителей, даже не верится что это AI. Однозначно буду заказывать ещё!",
                  },
                  {
                    "@type": "Review",
                    author: { "@type": "Person", name: "Екатерина" },
                    reviewRating: {
                      "@type": "Rating",
                      ratingValue: "5",
                    },
                    reviewBody:
                      "Подарила мужу романтичную песню на годовщину. Он был в полном шоке! Говорит, это лучший подарок за всю нашу жизнь. И правда, песня получилась очень трогательная и личная.",
                  },
                ],
              }),
            }}
          />

          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <SectionBar />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Что говорят наши клиенты
              </h2>
              <p className="text-lg text-muted-foreground">
                Более 5&nbsp;000 песен создано
              </p>
            </div>

            <StaggeredGrid className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  name: "Мария",
                  text: "Заказала песню для мамы на юбилей. Когда она услышала, просто расплакалась от счастья. Там были все наши семейные истории. Спасибо за такой подарок!",
                },
                {
                  name: "Алексей",
                  text: "Сделал песню-прожарку для друга на день рождения. Вся компания смеялась до слёз! Качество трека как у настоящих исполнителей. Однозначно буду заказывать ещё!",
                },
                {
                  name: "Екатерина",
                  text: "Подарила мужу романтичную песню на годовщину. Он был в полном шоке! Говорит, это лучший подарок за всю нашу жизнь. Песня получилась очень трогательная и личная.",
                },
              ].map((review, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="relative bg-white rounded-2xl border border-border/60 shadow-sm p-7 flex flex-col h-full hover:shadow-md transition-all duration-300"
                >
                  {/* Decorative quote */}
                  <span
                    className="absolute top-4 right-5 text-5xl leading-none font-serif text-primary/8 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {review.name[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">
                        {review.name}
                      </span>
                      <Stars />
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    &laquo;{review.text}&raquo;
                  </p>
                </motion.div>
              ))}
            </StaggeredGrid>
          </div>
        </section>
      </AnimatedSection>

      {/* ════════════════════════════════════════════════════════════════════
          ORDER FORM
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section id="order-form" className="py-20" aria-labelledby="form-heading">
          <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-md p-8 md:p-12 border border-border/40">
              {/* Header + Pricing */}
              <div className="text-center mb-10">
                <h2
                  id="form-heading"
                  className="font-display text-3xl md:text-4xl font-bold mb-6 text-foreground"
                >
                  Создайте свою песню
                </h2>

                <div className="mb-5">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-lg text-muted-foreground line-through">
                      1&nbsp;190&nbsp;&#8381;
                    </span>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wide">
                      &minus;50%
                    </span>
                  </div>
                  <span className="text-5xl md:text-6xl font-bold text-foreground">
                    590&nbsp;&#8381;
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Безопасная оплата &nbsp;·&nbsp; Студийное звучание
                  &nbsp;·&nbsp; Готовность за 10 минут
                </p>
              </div>

              <Form {...form}>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {/* About person */}
                  <FormField
                    control={form.control}
                    name="aboutPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>О ком песня? *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Мой друг Алексей, 30 лет, работает программистом…"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Имя и краткое описание человека
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Facts */}
                  <FormField
                    control={form.control}
                    name="facts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>О чём спеть? *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Любит футбол и пиво, всегда опаздывает, но душа компании. Недавно женился. Обожает мемы про котов…"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Смешные истории, черты характера, увлечения. Чем больше
                          деталей, тем лучше песня
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Must include */}
                  <FormField
                    control={form.control}
                    name="mustInclude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Ключевые слова или фразы для песни (по желанию)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder="Например: «лучший друг», «помнишь как мы…»"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Можно оставить пустым — мы сами подберём лучшие слова
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Occasion */}
                  <FormField
                    control={form.control}
                    name="occasion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Повод для песни *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите повод…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="birthday">
                              День рождения
                            </SelectItem>
                            <SelectItem value="valentine">
                              14 февраля
                            </SelectItem>
                            <SelectItem value="march-8">8 марта</SelectItem>
                            <SelectItem value="feb-23">23 февраля</SelectItem>
                            <SelectItem value="anniversary">
                              Годовщина
                            </SelectItem>
                            <SelectItem value="wedding">Свадьба</SelectItem>
                            <SelectItem value="new-year">Новый год</SelectItem>
                            <SelectItem value="none">
                              Просто так / без повода
                            </SelectItem>
                            <SelectItem value="custom">
                              Свой вариант
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Custom occasion */}
                  {watchOccasion === "custom" && (
                    <FormField
                      control={form.control}
                      name="customOccasion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Укажите свой повод</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Например: Выпускной, юбилей компании…"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Text style */}
                  <FormField
                    control={form.control}
                    name="textStyle"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Стиль текста песни *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                          >
                            {[
                              {
                                value: "humor",
                                label: "Весёлая",
                                desc: "Юмор и шутки",
                              },
                              {
                                value: "lyric",
                                label: "Душевная",
                                desc: "Тёплые эмоции",
                              },
                              {
                                value: "roast",
                                label: "Прожарка",
                                desc: "Дружеский троллинг",
                              },
                              {
                                value: "romantic",
                                label: "Романтичная",
                                desc: "Про любовь",
                              },
                              {
                                value: "bold",
                                label: "Энергичная",
                                desc: "Дерзкая и мощная",
                              },
                              {
                                value: "motivating",
                                label: "Мотивирующая",
                                desc: "Вдохновляющая",
                              },
                              {
                                value: "nostalgic",
                                label: "Ностальгическая",
                                desc: "О прошлом",
                              },
                              {
                                value: "custom",
                                label: "Свой вариант",
                                desc: "Укажите свой стиль",
                              },
                            ].map((style) => (
                              <FormItem key={style.value}>
                                <FormControl>
                                  <div>
                                    <RadioGroupItem
                                      value={style.value}
                                      id={style.value}
                                      className="peer sr-only"
                                    />
                                    <FormLabel
                                      htmlFor={style.value}
                                      className="flex flex-col items-start rounded-xl border-2 border-border/60 bg-white p-4 hover:border-primary/40 hover:bg-primary/[0.02] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all duration-200"
                                    >
                                      <span className="font-semibold text-foreground">
                                        {style.label}
                                      </span>
                                      <span className="text-xs text-muted-foreground mt-0.5">
                                        {style.desc}
                                      </span>
                                    </FormLabel>
                                  </div>
                                </FormControl>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Custom style */}
                  {watchTextStyle === "custom" && (
                    <FormField
                      control={form.control}
                      name="customStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Укажите свой стиль песни</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Например: Эпическая и героическая, Задумчивая и философская…"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Опишите желаемый стиль текста песни
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Genre */}
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Жанр музыки *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите жанр…" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="new-year-pop">
                              Новогодний поп
                            </SelectItem>
                            <SelectItem value="pop">
                              Классический поп
                            </SelectItem>
                            <SelectItem value="rock">Рок</SelectItem>
                            <SelectItem value="rap">Рэп / Хип-хоп</SelectItem>
                            <SelectItem value="chanson">Шансон</SelectItem>
                            <SelectItem value="jazz">Джаз</SelectItem>
                            <SelectItem value="edm">Электро / EDM</SelectItem>
                            <SelectItem value="blues">Блюз</SelectItem>
                            <SelectItem value="country">Кантри</SelectItem>
                            <SelectItem value="acoustic">Акустика</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Voice */}
                  <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Голос исполнителя *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-3"
                          >
                            {[
                              { value: "male", label: "Мужской" },
                              { value: "female", label: "Женский" },
                            ].map((voice) => (
                              <FormItem key={voice.value}>
                                <FormControl>
                                  <div>
                                    <RadioGroupItem
                                      value={voice.value}
                                      id={voice.value}
                                      className="peer sr-only"
                                    />
                                    <FormLabel
                                      htmlFor={voice.value}
                                      className="flex items-center justify-center rounded-xl border-2 border-border/60 bg-white p-4 hover:border-primary/40 hover:bg-primary/[0.02] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer font-semibold transition-all duration-200"
                                    >
                                      {voice.label}
                                    </FormLabel>
                                  </div>
                                </FormControl>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email для отправки песни *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="example@mail.ru"
                            spellCheck={false}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Agreement */}
                  <FormField
                    control={form.control}
                    name="agreedToPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Я согласен с{" "}
                            <a
                              href="/legal/privacy"
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Политикой конфиденциальности
                            </a>{" "}
                            и{" "}
                            <a
                              href="/legal/terms"
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Пользовательским соглашением
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  {step === "form" ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          size="lg"
                          className="w-full text-lg py-6 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                          onClick={handleSubmitClick}
                          disabled={isSubmitting}
                          aria-label="Отправить заказ на создание персональной песни"
                        >
                          {isSubmitting
                            ? "Создаём заказ…"
                            : "Получить готовую песню"}
                          {!isSubmitting && (
                            <ArrowRight
                              className="ml-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          )}
                        </Button>
                      </motion.div>
                      <p className="text-center text-sm text-muted-foreground mt-3">
                        Песня будет готова через 10 минут. Скачаете на сайте
                        и&nbsp;получите на&nbsp;почту
                      </p>
                    </>
                  ) : null}
                </form>
              </Form>

              {/* Payment Widget */}
              {step === "payment" && confirmationToken && (
                <div className="mt-8">
                  <PaymentWidget
                    confirmationToken={confirmationToken}
                    orderId={orderId}
                    onSuccess={() => {
                      console.log("[Song] Payment success!");
                    }}
                    onError={(error) => {
                      console.error("[Song] Payment error:", error);
                      alert(`Ошибка оплаты: ${error.message}`);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ════════════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20 bg-secondary/50">
          {/* Schema.org FAQ */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Сколько стоит персональная песня на заказ?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Стоимость индивидуальной песни на заказ составляет 590 рублей. В эту цену входит полноценная композиция с профессиональным вокалом, аранжировкой и персонализированным текстом по вашим данным.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Как быстро будет готова песня?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Ваша персональная песня будет готова через 10 минут после оплаты. Готовый трек придёт на указанную вами электронную почту, и вы сможете скачать его прямо на сайте.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Какие жанры музыки доступны?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Мы создаём песни в любых популярных жанрах: поп, рок, рэп, шансон, джаз, электронная музыка, блюз, кантри и акустика.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Можно ли заказать песню с мужским или женским голосом?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Да, при оформлении заказа вы выбираете голос исполнителя — мужской или женский. Оба варианта звучат профессионально и естественно.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "На какой праздник можно подарить персональную песню?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Персональная песня — универсальный подарок на любой праздник: день рождения, Новый год, 8 марта, 23 февраля, годовщину, свадьбу или просто так.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Что нужно указать для создания песни?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Для создания уникальной песни нужно рассказать о человеке: его имя, интересы, черты характера, смешные истории или важные моменты из жизни.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "В каком формате я получу готовую песню?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Готовая песня приходит в формате MP3 высокого качества.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Можно ли доработать песню, если что-то не понравилось?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Да, если в готовой песне что-то хочется изменить, мы бесплатно доработаем трек.",
                    },
                  },
                ],
              }),
            }}
          />

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
              {[
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
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-xl border border-border/60 overflow-hidden hover:border-primary/30 transition-colors duration-200"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-foreground list-none select-none [&::-webkit-details-marker]:hidden">
                    <span className="pr-6">{faq.question}</span>
                    <ChevronDown
                      className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
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

      {/* ════════════════════════════════════════════════════════════════════
          GUARANTEE
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-16 bg-primary/[0.03]">
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
    </div>
  );
}
