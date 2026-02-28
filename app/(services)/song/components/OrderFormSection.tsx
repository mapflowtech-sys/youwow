"use client";

import { motion } from "framer-motion";
import { ArrowRight, Music2, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
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
import PaymentWidget from "@/components/PaymentWidget";
import { AnimatedSection } from "./AnimationWrappers";
import { SongFormData } from "../lib/schema";

// ─── Genre Cards Data ────────────────────────────────────────────────────────

const genres = [
  { value: "pop", label: "Поп", emoji: "🎤", color: "hover:border-rose-300 peer-data-[state=checked]:border-rose-400 peer-data-[state=checked]:bg-rose-50/50 [&:has([data-state=checked])]:border-rose-400 [&:has([data-state=checked])]:bg-rose-50/50" },
  { value: "rock", label: "Рок", emoji: "🎸", color: "hover:border-orange-300 peer-data-[state=checked]:border-orange-400 peer-data-[state=checked]:bg-orange-50/50 [&:has([data-state=checked])]:border-orange-400 [&:has([data-state=checked])]:bg-orange-50/50" },
  { value: "rap", label: "Рэп", emoji: "🎙️", color: "hover:border-violet-300 peer-data-[state=checked]:border-violet-400 peer-data-[state=checked]:bg-violet-50/50 [&:has([data-state=checked])]:border-violet-400 [&:has([data-state=checked])]:bg-violet-50/50" },
  { value: "chanson", label: "Шансон", emoji: "🎻", color: "hover:border-amber-300 peer-data-[state=checked]:border-amber-400 peer-data-[state=checked]:bg-amber-50/50 [&:has([data-state=checked])]:border-amber-400 [&:has([data-state=checked])]:bg-amber-50/50" },
  { value: "jazz", label: "Джаз", emoji: "🎷", color: "hover:border-sky-300 peer-data-[state=checked]:border-sky-400 peer-data-[state=checked]:bg-sky-50/50 [&:has([data-state=checked])]:border-sky-400 [&:has([data-state=checked])]:bg-sky-50/50" },
  { value: "edm", label: "Электро", emoji: "⚡", color: "hover:border-indigo-300 peer-data-[state=checked]:border-indigo-400 peer-data-[state=checked]:bg-indigo-50/50 [&:has([data-state=checked])]:border-indigo-400 [&:has([data-state=checked])]:bg-indigo-50/50" },
  { value: "acoustic", label: "Акустика", emoji: "🎼", color: "hover:border-emerald-300 peer-data-[state=checked]:border-emerald-400 peer-data-[state=checked]:bg-emerald-50/50 [&:has([data-state=checked])]:border-emerald-400 [&:has([data-state=checked])]:bg-emerald-50/50" },
  { value: "blues", label: "Блюз", emoji: "🎹", color: "hover:border-blue-300 peer-data-[state=checked]:border-blue-400 peer-data-[state=checked]:bg-blue-50/50 [&:has([data-state=checked])]:border-blue-400 [&:has([data-state=checked])]:bg-blue-50/50" },
  { value: "country", label: "Кантри", emoji: "🤠", color: "hover:border-yellow-300 peer-data-[state=checked]:border-yellow-400 peer-data-[state=checked]:bg-yellow-50/50 [&:has([data-state=checked])]:border-yellow-400 [&:has([data-state=checked])]:bg-yellow-50/50" },
  { value: "new-year-pop", label: "Новогодний", emoji: "🎄", color: "hover:border-red-300 peer-data-[state=checked]:border-red-400 peer-data-[state=checked]:bg-red-50/50 [&:has([data-state=checked])]:border-red-400 [&:has([data-state=checked])]:bg-red-50/50" },
];

const textStyles = [
  { value: "humor", label: "Весёлая", desc: "Юмор и шутки", emoji: "😄" },
  { value: "lyric", label: "Душевная", desc: "Тёплые эмоции", emoji: "💛" },
  { value: "roast", label: "Прожарка", desc: "Дружеский троллинг", emoji: "🔥" },
  { value: "romantic", label: "Романтичная", desc: "Про любовь", emoji: "💕" },
  { value: "bold", label: "Энергичная", desc: "Дерзкая и мощная", emoji: "💪" },
  { value: "motivating", label: "Мотивирующая", desc: "Вдохновляющая", emoji: "🚀" },
  { value: "nostalgic", label: "Ностальгическая", desc: "О прошлом", emoji: "📷" },
  { value: "custom", label: "Свой вариант", desc: "Укажите свой стиль", emoji: "✏️" },
];

// ─── OrderFormSection ────────────────────────────────────────────────────────

interface OrderFormSectionProps {
  form: UseFormReturn<SongFormData>;
  step: "form" | "payment" | "processing";
  isSubmitting: boolean;
  confirmationToken: string;
  orderId: string;
  onSubmitClick: () => void;
  onPaymentSuccess: (orderId: string) => void;
  onPaymentError: () => void;
}

export default function OrderFormSection({
  form,
  step,
  isSubmitting,
  confirmationToken,
  orderId,
  onSubmitClick,
  onPaymentSuccess,
  onPaymentError,
}: OrderFormSectionProps) {
  const watchTextStyle = form.watch("textStyle");
  const watchOccasion = form.watch("occasion");

  return (
    <AnimatedSection>
      <section
        id="order-form"
        className="py-20 md:py-24"
        aria-labelledby="form-heading"
      >
        <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
          <div className="relative bg-white rounded-3xl shadow-xl shadow-black/[0.04] p-8 md:p-12 border border-border/40">
            {/* ── Floating price badge ── */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-rose-400 text-white rounded-full px-5 py-2.5 shadow-lg shadow-primary/25">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-semibold">
                  Специальная цена — 590&nbsp;&#8381;
                </span>
              </div>
            </div>

            {/* ── Header + Pricing ── */}
            <div className="text-center mb-10 pt-4">
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
                Безопасная оплата &nbsp;&middot;&nbsp; Студийное звучание
                &nbsp;&middot;&nbsp; Готовность за 10 минут
              </p>
            </div>

            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {/* ════════════════════════════════════════════
                    SECTION 1: О ком песня
                ════════════════════════════════════════════ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      1
                    </div>
                    Расскажите о человеке
                  </div>

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
                            placeholder="Мой друг Алексей, 30 лет, работает программистом..."
                            className="resize-none rounded-xl"
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
                            placeholder="Любит футбол и пиво, всегда опаздывает, но душа компании. Недавно женился. Обожает мемы про котов..."
                            className="resize-none rounded-xl"
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
                          Ключевые слова или фразы (по желанию)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={2}
                            placeholder='Например: "лучший друг", "помнишь как мы..."'
                            className="resize-none rounded-xl"
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
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Выберите повод..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="birthday">День рождения</SelectItem>
                            <SelectItem value="valentine">14 февраля</SelectItem>
                            <SelectItem value="march-8">8 марта</SelectItem>
                            <SelectItem value="feb-23">23 февраля</SelectItem>
                            <SelectItem value="anniversary">Годовщина</SelectItem>
                            <SelectItem value="wedding">Свадьба</SelectItem>
                            <SelectItem value="new-year">Новый год</SelectItem>
                            <SelectItem value="none">Просто так / без повода</SelectItem>
                            <SelectItem value="custom">Свой вариант</SelectItem>
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
                              placeholder="Например: Выпускной, юбилей компании..."
                              className="rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* ════════════════════════════════════════════
                    SECTION 2: Стиль и жанр
                ════════════════════════════════════════════ */}
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      2
                    </div>
                    Выберите стиль
                  </div>

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
                            className="grid grid-cols-2 md:grid-cols-4 gap-3"
                          >
                            {textStyles.map((style) => (
                              <FormItem key={style.value}>
                                <FormControl>
                                  <div>
                                    <RadioGroupItem
                                      value={style.value}
                                      id={`style-${style.value}`}
                                      className="peer sr-only"
                                    />
                                    <FormLabel
                                      htmlFor={`style-${style.value}`}
                                      className="flex flex-col items-center rounded-xl border-2 border-border/60 bg-white p-4 hover:border-primary/40 hover:bg-primary/[0.02] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all duration-200 text-center"
                                    >
                                      <span className="text-xl mb-1" aria-hidden="true">
                                        {style.emoji}
                                      </span>
                                      <span className="font-semibold text-foreground text-sm">
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
                              placeholder="Например: Эпическая и героическая, Задумчивая..."
                              className="rounded-xl"
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

                  {/* Genre — visual cards */}
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Жанр музыки *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
                          >
                            {genres.map((genre) => (
                              <FormItem key={genre.value}>
                                <FormControl>
                                  <div>
                                    <RadioGroupItem
                                      value={genre.value}
                                      id={`genre-${genre.value}`}
                                      className="peer sr-only"
                                    />
                                    <FormLabel
                                      htmlFor={`genre-${genre.value}`}
                                      className={`flex flex-col items-center justify-center rounded-xl border-2 border-border/60 bg-white p-3 cursor-pointer transition-all duration-200 ${genre.color}`}
                                    >
                                      <span className="text-2xl mb-1" aria-hidden="true">
                                        {genre.emoji}
                                      </span>
                                      <span className="font-semibold text-foreground text-sm">
                                        {genre.label}
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
                              { value: "male", label: "Мужской", emoji: "👨‍🎤" },
                              { value: "female", label: "Женский", emoji: "👩‍🎤" },
                            ].map((voice) => (
                              <FormItem key={voice.value}>
                                <FormControl>
                                  <div>
                                    <RadioGroupItem
                                      value={voice.value}
                                      id={`voice-${voice.value}`}
                                      className="peer sr-only"
                                    />
                                    <FormLabel
                                      htmlFor={`voice-${voice.value}`}
                                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-border/60 bg-white p-4 hover:border-primary/40 hover:bg-primary/[0.02] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer font-semibold transition-all duration-200"
                                    >
                                      <span className="text-xl" aria-hidden="true">
                                        {voice.emoji}
                                      </span>
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
                </div>

                {/* ════════════════════════════════════════════
                    SECTION 3: Контакты и оплата
                ════════════════════════════════════════════ */}
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      3
                    </div>
                    Оплата и получение
                  </div>

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
                            className="rounded-xl"
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
                          className="w-full text-lg py-7 bg-gradient-to-r from-primary to-rose-400 hover:from-primary-dark hover:to-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
                          onClick={onSubmitClick}
                          disabled={isSubmitting}
                          aria-label="Отправить заказ на создание персональной песни"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Создаём заказ...
                            </>
                          ) : (
                            <>
                              <Music2
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                              Получить готовую песню
                              <ArrowRight
                                className="ml-2 h-5 w-5"
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <p className="text-center text-sm text-muted-foreground mt-3">
                        Песня будет готова через 10 минут. Скачаете на сайте
                        и&nbsp;получите на&nbsp;почту
                      </p>
                    </>
                  ) : null}
                </div>
              </form>
            </Form>

            {/* Payment Widget */}
            {step === "payment" && confirmationToken && (
              <div className="mt-8">
                <PaymentWidget
                  confirmationToken={confirmationToken}
                  orderId={orderId}
                  onSuccess={() => {
                    onPaymentSuccess(orderId);
                  }}
                  onError={(error) => {
                    console.error("[Song] Payment error:", error);
                    alert(`Ошибка оплаты: ${error.message}`);
                    onPaymentError();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
