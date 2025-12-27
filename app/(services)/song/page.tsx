"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import {
  Star,
  Clock,
  Shield,
  Sparkles,
  Heart,
  Users,
  ArrowRight,
  Headphones,
  Mic,
  Play,
  Pause,
  Music2,
  Mic2,
  Gift,
  Smile,
  Flame,
  Zap,
  Target,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import GenerationFlow from "./components/GenerationFlow";
import { SongFormData as APISongFormData } from "@/lib/genapi/text-generation";

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


// Audio Player Component
function AudioPlayerCard({
  title,
  genre,
  audioSrc,
  index,
  gradientFrom,
  gradientTo,
  buttonColor,
  progressGradient,
}: {
  title: string;
  genre: string;
  audioSrc: string;
  index: number;
  gradientFrom: string;
  gradientTo: string;
  buttonColor: string;
  progressGradient: string;
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

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group hover:shadow-xl transition-all border-2 hover:border-primary/30">
        <CardContent className="pt-6">
          <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} aspect-square flex items-center justify-center mb-4 cursor-pointer transition-transform group-hover:scale-[1.02]`}
            onClick={togglePlay}
          >
            {/* Анимированный фон при проигрывании */}
            {isPlaying && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${gradientFrom.replace('/10', '/20')} ${gradientTo.replace('/10', '/20')}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Кнопка Play/Pause */}
            <motion.button
              className="relative z-10 w-20 h-20 rounded-full bg-white/95 dark:bg-slate-800/95 flex items-center justify-center shadow-xl backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? `Остановить ${title}` : `Воспроизвести ${title}`}
            >
              {isPlaying ? (
                <Pause className={`h-10 w-10 ${buttonColor}`} aria-hidden="true" />
              ) : (
                <Play className={`h-10 w-10 ${buttonColor} ml-1`} aria-hidden="true" />
              )}
            </motion.button>

            {/* Прогресс-бар */}
            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30 backdrop-blur-sm">
                <motion.div
                  className={`h-full ${progressGradient}`}
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                />
              </div>
            )}

            {/* Визуализация звуковых волн */}
            {isPlaying && (
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-white/80 rounded-full shadow-lg"
                    animate={{
                      height: [10, 24, 10],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <h4 className="font-semibold mb-1 text-slate-900 dark:text-white">{title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{genre}</p>

          <audio ref={audioRef} src={audioSrc} preload="none" aria-label={`Аудио пример: ${title}`} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Examples Grid Component
function ExamplesGrid() {
  const examples = [
    {
      title: "Поп про друга",
      genre: "Новогодний поп",
      audioSrc: "/examples/pop-friend.mp3",
      gradientFrom: "from-violet-100/80",
      gradientTo: "to-purple-100/80",
      buttonColor: "text-violet-600",
      progressGradient: "bg-gradient-to-r from-violet-500 to-purple-500"
    },
    {
      title: "Рок для брата",
      genre: "Рок",
      audioSrc: "/examples/rock-brother.mp3",
      gradientFrom: "from-purple-100/80",
      gradientTo: "to-pink-100/80",
      buttonColor: "text-purple-600",
      progressGradient: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      title: "Рэп коллеге",
      genre: "Рэп",
      audioSrc: "/examples/rap-colleague.mp3",
      gradientFrom: "from-pink-100/80",
      gradientTo: "to-rose-100/80",
      buttonColor: "text-pink-600",
      progressGradient: "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    {
      title: "Шансон маме",
      genre: "Шансон",
      audioSrc: "/examples/chanson-mom.mp3",
      gradientFrom: "from-rose-100/80",
      gradientTo: "to-orange-100/80",
      buttonColor: "text-rose-600",
      progressGradient: "bg-gradient-to-r from-rose-500 to-orange-500"
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {examples.map((example, index) => (
        <AudioPlayerCard
          key={index}
          title={example.title}
          genre={example.genre}
          audioSrc={example.audioSrc}
          index={index}
          gradientFrom={example.gradientFrom}
          gradientTo={example.gradientTo}
          buttonColor={example.buttonColor}
          progressGradient={example.progressGradient}
        />
      ))}
    </div>
  );
}

export default function SongPage() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [apiFormData, setApiFormData] = useState<APISongFormData | null>(null);

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

  // Restore form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('song_form_draft');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData) as APISongFormData;
        // Map API format back to form format
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
          agreedToPolicy: false, // Don't restore checkbox for privacy
        });
        console.log('[Form] Restored draft from localStorage');
      } catch (error) {
        console.error('[Form] Failed to restore draft:', error);
      }
    }
  }, [form]);

  const watchTextStyle = form.watch("textStyle");
  const watchOccasion = form.watch("occasion");

  const onSubmit = async (data: SongFormData) => {
    console.log("Song form data:", data);

    // Преобразуем данные формы в формат API
    const apiData: APISongFormData = {
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
    };

    setApiFormData(apiData);
    setIsFormSubmitted(true);
  };

  const handleSubmitClick = () => {
    form.handleSubmit(onSubmit)();
  };

  const handleReset = () => {
    setIsFormSubmitted(false);
    setApiFormData(null);
    form.reset();
    // Clear saved draft when user explicitly creates a new song
    localStorage.removeItem('song_form_draft');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Персональная песня на заказ",
            "description": "Закажите уникальную персональную песню! Индивидуальная композиция с именем и историей получателя. Готово за 10 минут. Идеальный подарок на день рождения, Новый год или любой праздник.",
            "provider": {
              "@type": "Organization",
              "name": "YouWow",
              "url": "https://youwow.ru"
            },
            "serviceType": "Музыкальный подарок",
            "areaServed": "RU",
            "offers": {
              "@type": "Offer",
              "price": "590",
              "priceCurrency": "RUB",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2025-12-31",
              "url": "https://youwow.ru/song"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "344",
              "bestRating": "5",
              "worstRating": "1"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Жанры песен",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Новогодний поп"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Классический поп"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Рок"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Рэп / Хип-хоп"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Шансон"
                  }
                }
              ]
            }
          })
        }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto] pb-2">
              Подари песню,
              <br />
              которой нет ни у кого
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Идея подарка, которая удивляет с первого прослушивания. Персональная песня с именами, фактами и историями
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2">
                <div className="flex" aria-label="Рейтинг 4.9 из 5 звезд">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  4.9/5
                </span>
                <span className="text-slate-500">(344 отзыва)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-semibold">Готово за 10 минут</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Users className="h-5 w-5 text-purple-600" aria-hidden="true" />
                <span className="font-semibold">+43 песни сегодня</span>
              </div>
            </div>

            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={() => {
                document
                  .getElementById("order-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label="Создать персональную песню - перейти к форме заказа"
            >
              Создать песню
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Как это работает?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Три простых шага до уникального музыкального подарка
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {[
              {
                step: 1,
                title: "Расскажите о человеке",
                description:
                  "Укажите имя, увлечения, смешные истории. Чем больше деталей, тем круче песня",
                icon: Mic,
                gradientFrom: "from-purple-500",
                gradientTo: "to-pink-500",
                bgGradient: "from-purple-500/10 via-pink-500/5 to-transparent",
                iconColor: "text-purple-600 dark:text-purple-400",
              },
              {
                step: 2,
                title: "Выберите стиль",
                description:
                  "Поп, рок, рэп или шансон? Юмор или лирика? Мужской или женский голос?",
                icon: Sparkles,
                gradientFrom: "from-pink-500",
                gradientTo: "to-orange-500",
                bgGradient: "from-pink-500/10 via-orange-500/5 to-transparent",
                iconColor: "text-pink-600 dark:text-pink-400",
              },
              {
                step: 3,
                title: "Получите готовый трек",
                description:
                  "Песня будет готова через 10 минут. Скачайте прямо на сайте или получите на email",
                icon: Headphones,
                gradientFrom: "from-orange-500",
                gradientTo: "to-purple-600",
                bgGradient: "from-orange-500/10 via-purple-500/5 to-transparent",
                iconColor: "text-orange-600 dark:text-orange-400",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative group"
              >
                {/* Connecting Line Animation */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 -right-6 lg:-right-8 w-12 lg:w-16 h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-transparent"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
                    />
                  </div>
                )}

                {/* Card */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative bg-white dark:bg-slate-700 rounded-3xl p-8 h-full border border-slate-200 dark:border-slate-600 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 -left-4 bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {item.step}
                  </div>

                  {/* Icon Container with Floating Animation */}
                  <div className="relative mb-8 mt-4">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300`}></div>
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                      className="relative flex items-center justify-center h-32"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} opacity-10 rounded-2xl`}></div>
                      <item.icon className={`h-20 w-20 ${item.iconColor} relative z-10 drop-shadow-lg`} aria-hidden="true" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Хиты, созданные сегодня
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Послушайте реальные примеры песен, которые наши клиенты получили за последние 24 часа
            </p>
          </motion.div>

          <ExamplesGrid />
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex" aria-label="Рейтинг 5 из 5 звезд">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-8 w-8 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-2">
              Более 5 000 песен создано
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Каждая стала любимым треком получателя
            </p>
          </motion.div>
        </div>
      </section>

      {/* Order Form */}
      <section id="order-form" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-primary/20"
          >
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ваш персональный хит почти готов
              </h2>

              {/* Glassmorphism pricing display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-6 inline-block"
              >
                <div className="relative backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-slate-700/50 rounded-2xl px-6 py-4 shadow-xl">
                  {/* Discount sticker - rotated -5deg with bounce */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -15 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.5,
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                      bounce: 0.6
                    }}
                    className="absolute -top-2 -right-2 z-10"
                  >
                    <div className="relative">
                      {/* Glossy sticker effect */}
                      <div className="bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white px-3 py-1.5 rounded-lg shadow-lg transform rotate-[-5deg]">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg"></div>
                        <span className="relative text-xs font-black tracking-tight">-50%</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Price content */}
                  <div className="flex flex-col items-center gap-1">
                    {/* Old price */}
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="text-base text-muted-foreground line-through decoration-2"
                    >
                      1 190₽
                    </motion.span>

                    {/* New price with smooth reveal */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.7,
                        delay: 0.1,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                    >
                      <span className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                        590₽
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <span>Безопасная оплата</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <span>Студийное звучание</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" aria-hidden="true" />
                  <span>Готовность за 10 минут</span>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <FormField
                  control={form.control}
                  name="aboutPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>О ком песня? *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Мой друг Алексей, 30 лет, работает программистом"
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

                <FormField
                  control={form.control}
                  name="facts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>О чём спеть? *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          placeholder="Любит футбол и пиво, всегда опаздывает, но душа компании. Недавно женился. Обожает мемы про котов."
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

                {/* Обязательные слова/фразы */}
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
                          placeholder="Например: 'лучший друг', 'помнишь как мы...'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Можно оставить пустым - мы сами подберём лучшие слова
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Повод для песни */}
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
                            <SelectValue placeholder="Выберите повод..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="birthday">День рождения</SelectItem>
                          <SelectItem value="new-year">Новый год</SelectItem>
                          <SelectItem value="march-8">8 марта</SelectItem>
                          <SelectItem value="feb-23">23 февраля</SelectItem>
                          <SelectItem value="anniversary">Годовщина</SelectItem>
                          <SelectItem value="wedding">Свадьба</SelectItem>
                          <SelectItem value="none">
                            Просто так / без повода
                          </SelectItem>
                          <SelectItem value="custom">Свой вариант</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Свой вариант повода */}
                {watchOccasion === "custom" && (
                  <FormField
                    control={form.control}
                    name="customOccasion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Укажите свой повод</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Например: Выпускной, юбилей компании"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="humor"
                                  id="humor"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="humor"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Smile className="h-6 w-6 text-yellow-500" aria-hidden="true" />
                                    <span className="font-semibold">Весёлая</span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Юмор и шутки
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="lyric"
                                  id="lyric"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="lyric"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Heart className="h-6 w-6 text-pink-500" aria-hidden="true" />
                                    <span className="font-semibold">
                                      Душевная
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Тёплые эмоции
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="roast"
                                  id="roast"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="roast"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Flame className="h-6 w-6 text-orange-500" aria-hidden="true" />
                                    <span className="font-semibold">
                                      Прожарка
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Дружеский троллинг
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="romantic"
                                  id="romantic"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="romantic"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Heart className="h-6 w-6 text-red-500 fill-red-500" aria-hidden="true" />
                                    <span className="font-semibold">
                                      Романтичная
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Про любовь
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="bold"
                                  id="bold"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="bold"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                                    <span className="font-semibold">
                                      Энергичная
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Дерзкая и мощная
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="motivating"
                                  id="motivating"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="motivating"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Target className="h-6 w-6 text-blue-500" aria-hidden="true" />
                                    <span className="font-semibold">
                                      Мотивирующая
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Вдохновляющая
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="nostalgic"
                                  id="nostalgic"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="nostalgic"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Mountain className="h-6 w-6 text-purple-500" aria-hidden="true" />
                                    <span className="font-semibold">
                                      Ностальгическая
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    О прошлом
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="custom"
                                  id="custom"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="custom"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-6 w-6 text-purple-500" aria-hidden="true" />
                                    <span className="font-semibold">
                                      Свой вариант
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Укажите свой стиль
                                  </span>
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Свой вариант стиля */}
                {watchTextStyle === "custom" && (
                  <FormField
                    control={form.control}
                    name="customStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Укажите свой стиль песни</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Например: Эпическая и героическая, Задумчивая и философская"
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

                {/* Жанр музыки */}
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
                            <SelectValue placeholder="Выберите жанр..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new-year-pop">
                            🎄 Новогодний поп
                          </SelectItem>
                          <SelectItem value="pop">🎵 Классический поп</SelectItem>
                          <SelectItem value="rock">🎸 Рок</SelectItem>
                          <SelectItem value="rap">🎤 Рэп / Хип-хоп</SelectItem>
                          <SelectItem value="chanson">💝 Шансон</SelectItem>
                          <SelectItem value="jazz">🎹 Джаз</SelectItem>
                          <SelectItem value="edm">⚡ Электро / EDM</SelectItem>
                          <SelectItem value="blues">🎺 Блюз</SelectItem>
                          <SelectItem value="country">🤠 Кантри</SelectItem>
                          <SelectItem value="acoustic">🎻 Акустика</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="male"
                                  id="male"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="male"
                                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-semibold"
                                >
                                  🎤 Мужской
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <div>
                                <RadioGroupItem
                                  value="female"
                                  id="female"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="female"
                                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-semibold"
                                >
                                  🎤 Женский
                                </FormLabel>
                              </div>
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email для отправки песни *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@mail.ru"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            className="text-primary underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Политикой конфиденциальности
                          </a>{" "}
                          и{" "}
                          <a
                            href="/legal/offer"
                            className="text-primary underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Договором оферты
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {!isFormSubmitted ? (
                  <>
                    <Button
                      type="button"
                      size="lg"
                      className="w-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 relative overflow-hidden group"
                      onClick={handleSubmitClick}
                      aria-label="Отправить заказ на создание персональной песни"
                    >
                      <span className="relative z-10 flex items-center justify-center w-full">
                        Получить готовую песню
                        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                      </span>
                      {/* Shine animation */}
                      <motion.div
                        className="absolute inset-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        initial={{ x: '-200%' }}
                        animate={{ x: '400%' }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 5,
                          ease: "easeInOut"
                        }}
                      />
                    </Button>
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
                      Песня будет готова через 10 минут. Скачаете на сайте и получите на почту
                    </p>
                  </>
                ) : null}
              </form>
            </Form>

            {/* Generation Flow */}
            {isFormSubmitted && apiFormData && (
              <GenerationFlow
                formData={apiFormData}
                onSubmit={() => {}}
                onReset={handleReset}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <div className="mx-auto max-w-4xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <Heart className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  С душой в каждой ноте
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Это не просто подарок
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Мы превращаем ваши воспоминания в песню, которую захочется слушать на повторе
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                    <Music2 className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Каждая деталь имеет значение
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Это не шаблон. Мы вплетем в текст ваши личные истории, имена и даже «внутренние» шутки. Человек поймет: эта песня только про него.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30 flex items-center justify-center">
                    <Mic2 className="h-6 w-6 text-pink-600 dark:text-pink-400" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Звучание как на вершине чартов
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Никакого «роботизированного» звука. Кристально чистый вокал и аранжировки профессионального уровня. Качество, которое не стыдно включить на колонках.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Эффект полной неожиданности
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    У всех есть цветы и гаджеты. Но песня, написанная в честь человека - это подарок, который вызывает искренние слезы радости и мурашки.
                  </p>
                </div>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-4">
                Гарантия результата
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Мы внимательно относимся к каждой песне и учитываем ваши пожелания.
                Если в готовом треке что-то хочется изменить - мы бесплатно доработаем песню, чтобы результат вам действительно понравился.
                Наша цель - чтобы вы получили эмоцию, которой захотите поделиться и подарить.
                Мы всегда на связи и готовы помочь на каждом этапе.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 dark:text-slate-400">
                  Поддержка 24/7:
                </span>
                <a
                  href="https://t.me/youwow_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition-opacity"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.042-1.362 5.362-.168.558-.5.744-.818.762-.696.033-1.224-.46-1.898-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.782-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.248-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.491-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.155.232.171.326.016.062.036.203.02.313z" />
                  </svg>
                  @youwow_support
                </a>
              </div>
            </div>

            {/* Final CTA */}
            <div className="text-center mt-8">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                Каждая песня - это подарок, который запомнят навсегда
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
