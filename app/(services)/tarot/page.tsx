"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";

// Zod validation schema
const tarotFormSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно быть не короче 2 символов")
    .max(50, "Имя слишком длинное"),

  birthDate: z.string().min(1, "Укажите дату рождения"),

  topic: z.enum(["love", "money", "career", "surprise"], {
    required_error: "Выберите тему гадания",
  }),

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
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Что-то пошло не так. Попробуйте позже",
        variant: "destructive",
      });
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent-pink bg-clip-text text-transparent">
          Таро 2026 🔮
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Загрузи фото — получи карту судьбы с твоим лицом
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Имя */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
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
            </motion.div>

            {/* Дата рождения */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата рождения</FormLabel>
                    <FormControl>
                      <Input type="date" max={today} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Тема гадания */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
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
                        <SelectItem value="love">❤️ Любовь</SelectItem>
                        <SelectItem value="money">💰 Деньги</SelectItem>
                        <SelectItem value="career">📈 Карьера</SelectItem>
                        <SelectItem value="surprise">
                          ✨ Сюрприз от Вселенной
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Фото лица */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="photo"
                render={({ field: { onChange, value, ...field } }) => (
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
                      Желательно анфас, без очков. Мы удалим фото через 24 часа
                    </FormDescription>
                    {photoPreview && (
                      <div className="mt-4">
                        <Image
                          src={photoPreview}
                          alt="Превью фото"
                          width={200}
                          height={200}
                          className="rounded-lg max-h-48 object-cover"
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
            </motion.div>

            {/* Фото ладони (опционально) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <FormField
                control={form.control}
                name="palmPhoto"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Фото ладони (по желанию) 🖐</FormLabel>
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
                      Для усиления магии 🔮 (опционально)
                    </FormDescription>
                    {palmPhotoPreview && (
                      <div className="mt-4">
                        <Image
                          src={palmPhotoPreview}
                          alt="Превью ладони"
                          width={200}
                          height={200}
                          className="rounded-lg max-h-48 object-cover"
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
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Согласие с политикой */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
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
                        <Link
                          href="/legal/privacy"
                          className="underline text-primary hover:text-primary/80"
                        >
                          политикой конфиденциальности
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Раскрыть карты за 290₽"
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
