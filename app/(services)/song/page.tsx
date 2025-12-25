"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
  Star,
  Clock,
  Shield,
  CheckCircle2,
  Sparkles,
  Music,
  Heart,
  Users,
  ArrowRight,
  Headphones,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

  const handleReset = () => {
    setIsFormSubmitted(false);
    setApiFormData(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-6 text-base px-4 py-2">
              🎵 Вирусный тренд 2025
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Подари песню,
              <br />
              которой нет ни у кого
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Уникальная персональная песня со словами о вашем друге. Выбери
              жанр, стиль и получи готовый трек с музыкой!
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  4.9/5
                </span>
                <span className="text-slate-500">(2,156 отзывов)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold">Готово за 1 час</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">+523 песни сегодня</span>
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
            >
              Создать песню
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-slate-800">
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

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Расскажите о человеке",
                description:
                  "Укажите имя, увлечения, смешные истории. Чем больше деталей, тем круче песня",
                icon: Mic,
              },
              {
                step: 2,
                title: "Выберите стиль",
                description:
                  "Поп, рок, рэп или шансон? Юмор или лирика? Мужской или женский голос?",
                icon: Sparkles,
              },
              {
                step: 3,
                title: "Получите готовый трек",
                description:
                  "Песня с музыкой и словами придёт на email за 1 час. Скачайте и дарите!",
                icon: Headphones,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-8 h-full border-2 border-transparent hover:border-primary transition-all">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="w-full h-32 bg-slate-200 dark:bg-slate-500 rounded-lg mb-6 flex items-center justify-center">
                    <item.icon className="h-16 w-16 text-slate-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
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
              Примеры наших песен
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Послушайте, как звучат персональные треки
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Поп про друга", genre: "Новогодний поп" },
              { title: "Рок для брата", genre: "Рок" },
              { title: "Рэп коллеге", genre: "Рэп" },
              { title: "Шансон маме", genre: "Шансон" },
            ].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group cursor-pointer hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-slate-700 dark:to-slate-600 aspect-square flex items-center justify-center mb-4">
                      <Music className="h-16 w-16 text-purple-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-semibold mb-1">{example.title}</h4>
                    <p className="text-sm text-slate-500">{example.genre}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Audio Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mt-12"
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-6 w-6 text-primary" />
                  Послушай, как это звучит
                </CardTitle>
                <CardDescription>
                  Пример песни в стиле &quot;Новогодний поп&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center">
                  <p className="text-slate-500 text-sm">
                    Пример скоро будет добавлен
                  </p>
                  {/* <audio controls className="w-full">
                    <source src="/examples/song-example.mp3" type="audio/mpeg" />
                    Ваш браузер не поддерживает аудио элемент.
                  </audio> */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-8 w-8 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-2">
              Более 18,000 уникальных песен
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Подарили незабываемые эмоции по всей России
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
                Создайте персональную песню
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">490₽</span>
                <Badge variant="destructive" className="text-base">
                  -50% до конца дня
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Безопасная оплата</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Гарантия качества</span>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        Слова или фразы, которые обязательно должны быть в песне
                        (необязательно)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Например: 'лучший друг', 'помнишь как мы...'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Необязательное поле — оставьте пустым если нет пожеланий
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
                                    <span className="text-2xl">😄</span>
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
                                    <span className="text-2xl">❤️</span>
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
                                    <span className="text-2xl">🔥</span>
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
                                    <span className="text-2xl">💕</span>
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
                                    <span className="text-2xl">⚡</span>
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
                                    <span className="text-2xl">💪</span>
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
                                    <span className="text-2xl">🌅</span>
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
                                    <span className="text-2xl">✨</span>
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
                  <Button
                    type="button"
                    size="lg"
                    className="w-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    Попробовать бесплатно
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
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
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Гарантия качества
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Мы создаём не просто песню
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Мы создаём эмоцию, которую невозможно забыть
              </p>
            </div>

            {/* Benefits List */}
            <div className="space-y-4 mb-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Уникальный текст
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Учитывается каждая деталь о человеке — имена, характер,
                    истории. Каждое слово индивидуально.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Профессиональная музыка
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Качество студийной записи. Музыка и вокал — как у настоящих
                    артистов.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Оригинальный подарок
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    Такого точно ни у кого нет. Запоминающийся сюрприз, который
                    удивит по-настоящему.
                  </p>
                </div>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-4">
                Не понравилось? Переделаем бесплатно или вернём деньги
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Мы верим в качество наших песен. Если результат вас не устроит —
                мы бесплатно переделаем песню один раз с учётом ваших пожеланий.
                А если и это не поможет — вернём деньги. Без вопросов и
                объяснений.
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
                Каждая песня — это подарок, который запомнят навсегда ✨
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "1 час",
                description: "Быстрая доставка",
              },
              {
                icon: Shield,
                title: "Безопасно",
                description: "Защита платежей",
              },
              {
                icon: CheckCircle2,
                title: "Качество",
                description: "Студийный звук",
              },
              {
                icon: Heart,
                title: "Гарантия",
                description: "Вернём деньги",
              },
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <badge.icon className="h-12 w-12 mx-auto mb-3 text-primary" />
                <h4 className="font-semibold mb-1">{badge.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {badge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
