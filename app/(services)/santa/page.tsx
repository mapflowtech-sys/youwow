"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Clock,
  Shield,
  CheckCircle2,
  Sparkles,
  Gift,
  Heart,
  ArrowRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Zod schemas with discriminated union
const childFormSchema = z.object({
  recipientType: z.literal("child"),
  childName: z.string().min(2, "Минимум 2 символа"),
  childAge: z.number().min(1).max(12, "Возраст от 1 до 12 лет"),
  hobby: z.string().min(3, "Расскажите о хобби ребёнка"),
  achievement: z.string().min(3, "Расскажите о достижении"),
  gift: z.string().optional(),
  email: z.string().email("Некорректный email"),
});

const adultFormSchema = z.object({
  recipientType: z.literal("adult"),
  name: z.string().min(2, "Минимум 2 символа"),
  relation: z.string().min(1, "Выберите отношение"),
  tone: z.enum(["warm", "funny", "formal"]),
  facts: z.string().min(10, "Расскажите подробнее (минимум 10 символов)"),
  email: z.string().email("Некорректный email"),
});

const formSchema = z.discriminatedUnion("recipientType", [
  childFormSchema,
  adultFormSchema,
]);

type FormValues = z.infer<typeof formSchema>;

export default function SantaPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [recipientType, setRecipientType] = useState<"child" | "adult" | null>(
    null
  );
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientType: "child",
      email: "",
    },
  });

  const handleRecipientSelect = (type: "child" | "adult") => {
    setRecipientType(type);
    form.setValue("recipientType", type);
    setStep(2);
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    toast({
      title: "Заявка принята!",
      description: `Спасибо! Мы сообщим вам о запуске сервиса на email: ${data.email}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Development Alert */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b border-amber-200 dark:border-amber-800">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-6">
          <Alert className="border-amber-300 dark:border-amber-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-lg font-semibold text-amber-900 dark:text-amber-100">
              ⚙️ Сервис в разработке
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200 mt-2">
              Видео-поздравления от Деда Мороза будут доступны очень скоро! Вы можете оставить заявку сейчас — мы сообщим о запуске на указанный email.
            </AlertDescription>
          </Alert>
        </div>
      </div>

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
              🎅 Новогодний хит 2025
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-600 via-green-600 to-red-600 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Видео от Деда Мороза
              <br />с именем получателя
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
              Персональное новогоднее поздравление, которое растрогает до слёз.
              Дед Мороз обратится по имени и расскажет о достижениях!
            </p>

            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700 text-white"
              onClick={() => {
                document
                  .getElementById("order-form")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Оставить заявку
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
              Три простых шага до волшебного момента
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Заполните форму",
                description:
                  "Укажите имя получателя, возраст, увлечения и достижения года",
                icon: Gift,
              },
              {
                step: 2,
                title: "Мы создаём видео",
                description:
                  "Дед Мороз обратится по имени и расскажет персональное поздравление",
                icon: Sparkles,
              },
              {
                step: 3,
                title: "Получите на почту",
                description:
                  "Видео придёт на email за 30 минут. Скачайте и дарите!",
                icon: Heart,
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
                <div className="bg-gradient-to-br from-red-50 to-green-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl p-8 h-full border-2 border-transparent hover:border-primary transition-all">
                  <div className="bg-gradient-to-r from-red-500 to-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">
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
              Примеры наших видео
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Посмотрите, как мы радуем людей по всей России
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Маша, 7 лет", views: "1.2K" },
              { name: "Артём, 5 лет", views: "890" },
              { name: "Для мамы", views: "2.1K" },
              { name: "Для коллеги", views: "650" },
            ].map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-100 to-green-100 dark:from-slate-700 dark:to-slate-600 aspect-video flex items-center justify-center">
                  <Play className="h-16 w-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="mt-3">
                  <h4 className="font-semibold">{example.name}</h4>
                  <p className="text-sm text-slate-500">
                    {example.views} просмотров
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
                Оставьте заявку на видео
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Мы сообщим вам о запуске сервиса первыми
              </p>
            </div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-center mb-6">
                  Кому предназначено видео?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="h-32 text-lg font-semibold border-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => handleRecipientSelect("child")}
                  >
                    <div className="text-center">
                      <Gift className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <div>Ребёнку</div>
                      <div className="text-sm font-normal text-slate-500">
                        До 12 лет
                      </div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="h-32 text-lg font-semibold border-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => handleRecipientSelect("adult")}
                  >
                    <div className="text-center">
                      <Heart className="h-12 w-12 mx-auto mb-2 text-primary" />
                      <div>Взрослому</div>
                      <div className="text-sm font-normal text-slate-500">
                        Близкому человеку
                      </div>
                    </div>
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && recipientType && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStep(1);
                        setRecipientType(null);
                      }}
                      className="mb-4"
                    >
                      ← Назад
                    </Button>

                    {recipientType === "child" && (
                      <>
                        <FormField
                          control={form.control}
                          name="childName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя ребёнка *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Например: Маша"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="childAge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Возраст *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Например: 7"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hobby"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Увлечения ребёнка *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Например: рисование, танцы, футбол"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="achievement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Главное достижение года *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Например: научилась читать, выиграла в конкурсе"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gift"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Желаемый подарок (необязательно)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Например: велосипед, кукла"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {recipientType === "adult" && (
                      <>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Имя получателя *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Например: Анна"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="relation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Кем приходится *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="partner">
                                    Муж/Жена
                                  </SelectItem>
                                  <SelectItem value="parent">
                                    Родитель
                                  </SelectItem>
                                  <SelectItem value="friend">Друг</SelectItem>
                                  <SelectItem value="colleague">
                                    Коллега
                                  </SelectItem>
                                  <SelectItem value="relative">
                                    Родственник
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Стиль обращения *</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-3 gap-4"
                                >
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <RadioGroupItem
                                          value="warm"
                                          id="warm"
                                          className="peer sr-only"
                                        />
                                        <FormLabel
                                          htmlFor="warm"
                                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                          <Heart className="mb-3 h-6 w-6" />
                                          <span className="text-sm font-semibold">
                                            Тёплый
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <RadioGroupItem
                                          value="funny"
                                          id="funny"
                                          className="peer sr-only"
                                        />
                                        <FormLabel
                                          htmlFor="funny"
                                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                          <Sparkles className="mb-3 h-6 w-6" />
                                          <span className="text-sm font-semibold">
                                            Весёлый
                                          </span>
                                        </FormLabel>
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                  <FormItem>
                                    <FormControl>
                                      <div>
                                        <RadioGroupItem
                                          value="formal"
                                          id="formal"
                                          className="peer sr-only"
                                        />
                                        <FormLabel
                                          htmlFor="formal"
                                          className="flex flex-col items-center justify-between rounded-md border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                          <Shield className="mb-3 h-6 w-6" />
                                          <span className="text-sm font-semibold">
                                            Официальный
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
                          name="facts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Интересные факты о получателе *
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Например: любит готовить, мечтает о путешествии в Италию, в этом году получила повышение"
                                  className="min-h-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email для получения видео *</FormLabel>
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

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-lg bg-gradient-to-r from-red-500 to-green-600 hover:from-red-600 hover:to-green-700"
                    >
                      Оставить заявку на поздравление
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-sm text-center text-slate-500">
                      Нажимая кнопку, вы соглашаетесь с{" "}
                      <a href="/legal/terms" className="underline">
                        Пользовательским соглашением
                      </a>
                    </p>
                  </motion.div>
                </form>
              </Form>
            )}
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
                title: "30 минут",
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
                description: "HD видео",
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
