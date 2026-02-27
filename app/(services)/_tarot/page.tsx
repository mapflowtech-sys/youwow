"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Star, Clock, Shield, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

// Zod validation schema
const tarotFormSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно быть не короче 2 символов")
    .max(50, "Имя слишком длинное"),

  birthDate: z.string().min(1, "Укажите дату рождения"),

  topic: z.enum(["love", "money", "career", "surprise"]),

  photo: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "Загрузите фото")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "Размер файла не должен превышать 5MB"
    )
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(files?.[0]?.type),
      "Только JPG, JPEG или PNG"
    ),

  palmPhoto: z.instanceof(FileList).optional(),

  email: z.string().email("Введите корректный email").min(1, "Email обязателен"),

  agreedToPolicy: z
    .boolean()
    .refine((val) => val === true, "Необходимо согласие с политикой"),
});

type TarotFormData = z.infer<typeof tarotFormSchema>;

export default function TarotPage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [palmPhotoPreview, setPalmPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<TarotFormData>({
    resolver: zodResolver(tarotFormSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      email: "",
      agreedToPolicy: false,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePalmPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPalmPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: TarotFormData) {
    try {
      console.log("Form data:", data);

      // TODO: В следующих шагах:
      // 1. Загрузить фото в Supabase Storage
      // 2. Создать заказ в БД
      // 3. Перейти на страницу оплаты

      toast({
        title: "Форма заполнена! ✨",
        description: "Скоро здесь будет генерация и оплата",
      });
    } catch {
      toast({
        title: "Ошибка",
        description: "Что-то пошло не так. Попробуйте позже",
        variant: "destructive",
      });
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-linear-to-b from-violet-50 via-background to-background dark:from-slate-900 dark:via-background dark:to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-accent-pink/10 text-accent-pink border-accent-pink/20 px-4 py-1">
              🔥 Вирусный тренд 2025
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-linear-to-r from-primary via-accent-pink to-accent-gold bg-clip-text text-transparent">
              Твоя карта Таро 2026<br />с твоим лицом
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Уникальное предсказание судьбы на персональной карте
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent-gold fill-accent-gold" />
                <span className="text-sm font-medium">4.9/5 из 2,847 отзывов</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Готово за 10 минут</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">+1,234 заказа сегодня</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Как это работает?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full text-center p-6">
                  <div className="w-full aspect-video bg-linear-to-br from-primary/10 to-accent-pink/10 rounded-lg mb-4 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">Фото появится здесь</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-lg mb-2">Загрузи фото</h3>
                  <p className="text-muted-foreground text-sm">
                    Селфи анфас — мы перенесём твоё лицо на карту Таро
                  </p>
                </Card>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full text-center p-6">
                  <div className="w-full aspect-video bg-linear-to-br from-accent-pink/10 to-accent-gold/10 rounded-lg mb-4 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-accent-pink" />
                    <p className="text-sm text-muted-foreground mt-2">Процесс создания</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent-pink text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-lg mb-2">Магия в действии</h3>
                  <p className="text-muted-foreground text-sm">
                    Создаём твою уникальную карту с мистическим предсказанием
                  </p>
                </Card>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="h-full text-center p-6">
                  <div className="w-full aspect-video bg-linear-to-br from-accent-gold/10 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-accent-gold" />
                    <p className="text-sm text-muted-foreground mt-2">Готовый результат</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent-gold text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-lg mb-2">Получи карту судьбы</h3>
                  <p className="text-muted-foreground text-sm">
                    HD изображение на email через 10 минут
                  </p>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXAMPLES GALLERY */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Примеры наших карт
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Каждая карта уникальна — как и твоя судьба
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-2/3 rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-accent-pink/20 to-accent-gold/20 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-white mb-2 mx-auto" />
                      <p className="text-white text-sm font-medium">Пример {i}</p>
                      <p className="text-white/80 text-xs mt-1">Скоро здесь</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              * Примеры будут добавлены в ближайшее время
            </p>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-12 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-8 h-8 text-accent-gold fill-accent-gold" />
              ))}
            </div>
            <p className="text-2xl font-bold mb-2">
              Уже 15,000+ человек узнали свою судьбу
            </p>
            <p className="text-muted-foreground">
              Присоединяйся к тысячам довольных клиентов по всей России
            </p>
          </motion.div>
        </div>
      </section>

      {/* ORDER FORM */}
      <section className="py-16 px-4" id="order-form">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Закажи свою карту сейчас
              </h2>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  ✅ Безопасная оплата
                </Badge>
                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                  🔒 Данные защищены
                </Badge>
                <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                  ⚡ Мгновенная обработка
                </Badge>
              </div>
            </div>

            <Card className="p-6 md:p-8 shadow-xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Имя */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Как к тебе обращаться?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Введи своё имя"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Дата рождения */}
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата рождения</FormLabel>
                        <FormControl>
                          <Input type="date" max={today} {...field} />
                        </FormControl>
                        <FormDescription>
                          Для точности предсказания
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Тема гадания */}
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тема гадания</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выбери тему" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="love">❤️ Любовь и отношения</SelectItem>
                            <SelectItem value="money">💰 Деньги и богатство</SelectItem>
                            <SelectItem value="career">📈 Карьера и успех</SelectItem>
                            <SelectItem value="surprise">
                              ✨ Сюрприз от Вселенной
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Фото лица */}
                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Твоё фото (анфас)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handlePhotoChange(e);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Желательно анфас, без очков. Удалим через 24 часа
                        </FormDescription>
                        {photoPreview && (
                          <div className="mt-4">
                            <Image
                              src={photoPreview}
                              alt="Превью фото"
                              width={200}
                              height={200}
                              className="rounded-lg max-h-48 object-cover border-2 border-primary"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => setPhotoPreview(null)}
                            >
                              Изменить фото
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Фото ладони */}
                  <FormField
                    control={form.control}
                    name="palmPhoto"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>
                          Фото ладони (опционально) 🖐
                          <Badge className="ml-2 bg-accent-gold/10 text-accent-gold border-accent-gold/20">
                            +50₽
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handlePalmPhotoChange(e);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Для усиления магии 🔮 и расширенного толкования
                        </FormDescription>
                        {palmPhotoPreview && (
                          <div className="mt-4">
                            <Image
                              src={palmPhotoPreview}
                              alt="Превью ладони"
                              width={200}
                              height={200}
                              className="rounded-lg max-h-48 object-cover border-2 border-accent-gold"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => setPalmPhotoPreview(null)}
                            >
                              Изменить фото
                            </Button>
                          </div>
                        )}
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
                        <FormLabel>Email для отправки результата</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Пришлём HD изображение в течение 10 минут
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Согласие */}
                  <FormField
                    control={form.control}
                    name="agreedToPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Я согласен с{" "}
                            <Link
                              href="/legal/privacy"
                              className="underline text-primary hover:text-primary/80"
                              target="_blank"
                            >
                              политикой конфиденциальности
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Price & Submit */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Итоговая цена:</p>
                        <p className="text-3xl font-bold text-primary">290 ₽</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                          🔥 Акция -40%
                        </Badge>
                        <p className="text-sm text-muted-foreground line-through mt-1">
                          480 ₽
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Раскрыть карты за 290₽
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Безопасно</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>10 минут</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Гарантия качества</span>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Clock className="w-10 h-10 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Быстро</p>
              <p className="text-sm text-muted-foreground">10 минут</p>
            </div>
            <div>
              <Shield className="w-10 h-10 mx-auto mb-2 text-green-500" />
              <p className="font-semibold">Безопасно</p>
              <p className="text-sm text-muted-foreground">SSL защита</p>
            </div>
            <div>
              <Star className="w-10 h-10 mx-auto mb-2 text-accent-gold" />
              <p className="font-semibold">Качество</p>
              <p className="text-sm text-muted-foreground">HD формат</p>
            </div>
            <div>
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-blue-500" />
              <p className="font-semibold">Гарантия</p>
              <p className="text-sm text-muted-foreground">100% возврат</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
