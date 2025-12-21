"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useToast } from "@/hooks/use-toast";
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

const songFormSchema = z.object({
  aboutPerson: z
    .string()
    .min(5, "Расскажите о человеке (минимум 5 символов)"),

  facts: z.string().min(10, "Добавьте факты для песни (минимум 10 символов)"),

  genre: z.enum(["pop", "rock", "rap", "chanson"]),

  textStyle: z.enum(["humor", "lyric", "roast", "motivation"]),

  voice: z.enum(["male", "female"]),

  email: z.string().email("Введите корректный email"),

  agreedToPolicy: z
    .boolean()
    .refine((val) => val === true, "Необходимо согласие"),
});

type SongFormData = z.infer<typeof songFormSchema>;

export default function SongPage() {
  const { toast } = useToast();

  const form = useForm<SongFormData>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      aboutPerson: "",
      facts: "",
      email: "",
      agreedToPolicy: false,
    },
  });

  const onSubmit = async (data: SongFormData) => {
    console.log("Song form data:", data);

    toast({
      title: "Заказ принят!",
      description: "Мы создадим песню и отправим на указанный email",
    });
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
                          <SelectItem value="pop">🎤 Новогодний поп</SelectItem>
                          <SelectItem value="rock">🎸 Рок</SelectItem>
                          <SelectItem value="rap">🎧 Рэп</SelectItem>
                          <SelectItem value="chanson">🎻 Шансон</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">😄</span>
                                    <span className="font-semibold">Юмор</span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Весёлая песня с шутками
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
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">❤️</span>
                                    <span className="font-semibold">
                                      Лирика
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Тёплые слова и эмоции
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
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
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
                                  value="motivation"
                                  id="motivation"
                                  className="peer sr-only"
                                />
                                <FormLabel
                                  htmlFor="motivation"
                                  className="flex flex-col items-start justify-between rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">💪</span>
                                    <span className="font-semibold">
                                      Мотивация
                                    </span>
                                  </div>
                                  <span className="text-sm text-slate-500">
                                    Вдохновляющий текст
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
                                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-semibold"
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
                                  className="flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-semibold"
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
                            href="/legal/offer"
                            className="text-primary underline"
                          >
                            договором оферты
                          </a>{" "}
                          и{" "}
                          <a
                            href="/legal/privacy"
                            className="text-primary underline"
                          >
                            политикой конфиденциальности
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Записать хит за 490₽
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
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
