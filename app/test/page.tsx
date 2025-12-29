"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Music2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import PaymentWidget from "@/components/PaymentWidget";

const testFormSchema = z.object({
  aboutPerson: z.string().min(10, "Минимум 10 символов"),
  facts: z.string().min(20, "Минимум 20 символов"),
  genre: z.string().min(1, "Выберите жанр"),
  voice: z.enum(["male", "female"]),
  email: z.string().email("Введите корректный email"),
  agreedToPolicy: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие с условиями",
  }),
});

type TestFormData = z.infer<typeof testFormSchema>;

export default function TestPage() {
  const [step, setStep] = useState<'form' | 'payment' | 'processing'>('form');
  const [orderId, setOrderId] = useState<string>('');
  const [confirmationToken, setConfirmationToken] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TestFormData>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      aboutPerson: "",
      facts: "",
      genre: "",
      voice: "female",
      email: "",
      agreedToPolicy: false,
    },
  });

  const onSubmit = async (data: TestFormData) => {
    setIsSubmitting(true);

    try {
      console.log('[Test] Submitting form:', data);

      // Call API to create payment with widget mode
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          useWidget: true, // ВАЖНО: используем виджет вместо редиректа
          formData: {
            voice: data.voice,
            aboutWho: data.aboutPerson,
            aboutWhat: data.facts,
            genre: data.genre,
            style: 'humor',
            occasion: 'birthday',
            email: data.email,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const result = await response.json();
      console.log('[Test] Payment created:', result);

      if (result.payment?.confirmationToken) {
        setOrderId(result.orderId);
        setConfirmationToken(result.payment.confirmationToken);
        setStep('payment');
      } else {
        throw new Error('No confirmation token received');
      }
    } catch (error) {
      console.error('[Test] Error:', error);
      alert('Ошибка при создании заказа. Проверьте консоль.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <Music2 className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              ТЕСТОВАЯ СТРАНИЦА
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Тест виджета ЮKassa
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Упрощённая версия для тестирования нового платёжного флоу
          </p>
        </motion.div>

        {/* Content */}
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border-2 border-primary/20"
          >
            <h2 className="text-2xl font-bold mb-6">Шаг 1: Заполните форму</h2>

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
                          rows={2}
                          placeholder="Мой друг Алексей, 30 лет"
                          {...field}
                        />
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
                      <FormLabel>О чём спеть? *</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Любит футбол и пиво, душа компании..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Жанр *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите жанр..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pop">Поп</SelectItem>
                          <SelectItem value="rock">Рок</SelectItem>
                          <SelectItem value="rap">Рэп</SelectItem>
                          <SelectItem value="chanson">Шансон</SelectItem>
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
                    <FormItem>
                      <FormLabel>Голос *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Мужской</SelectItem>
                          <SelectItem value="female">Женский</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
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
                          <a href="/legal/privacy" className="text-primary underline">
                            Политикой конфиденциальности
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Создаём заказ...</>
                  ) : (
                    <>
                      Перейти к оплате (590₽)
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}

        {step === 'payment' && confirmationToken && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <PaymentWidget
              confirmationToken={confirmationToken}
              orderId={orderId}
              onSuccess={() => {
                console.log('[Test] Payment success!');
              }}
              onError={(error) => {
                console.error('[Test] Payment error:', error);
                alert(`Ошибка оплаты: ${error.message}`);
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
