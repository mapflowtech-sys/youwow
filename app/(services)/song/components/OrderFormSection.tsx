"use client";

import { motion } from "framer-motion";
import { ArrowRight, Music2 } from "lucide-react";
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

// ─── Genre Data — colored dots instead of emoji ─────────────────────────────

const genres = [
  { value: "Классический поп", label: "Поп", dot: "bg-rose-400" },
  { value: "Рок", label: "Рок", dot: "bg-orange-400" },
  { value: "Рэп", label: "Рэп", dot: "bg-violet-500" },
  { value: "Шансон", label: "Шансон", dot: "bg-amber-500" },
  { value: "Джаз", label: "Джаз", dot: "bg-sky-400" },
  { value: "Электро", label: "Электро", dot: "bg-indigo-400" },
  { value: "Акустика", label: "Акустика", dot: "bg-emerald-400" },
  { value: "Блюз", label: "Блюз", dot: "bg-blue-400" },
  { value: "Кантри", label: "Кантри", dot: "bg-yellow-500" },
  { value: "Фанк", label: "Фанк", dot: "bg-fuchsia-400" },
];

const textStyles = [
  { value: "humor", label: "Весёлая", desc: "Юмор и шутки" },
  { value: "lyric", label: "Душевная", desc: "Тёплые эмоции" },
  { value: "roast", label: "Прожарка", desc: "Дружеский троллинг" },
  { value: "romantic", label: "Романтичная", desc: "Про любовь" },
  { value: "bold", label: "Энергичная", desc: "Дерзкая и мощная" },
  { value: "motivating", label: "Мотивирующая", desc: "Вдохновляющая" },
  { value: "nostalgic", label: "Ностальгическая", desc: "О прошлом" },
  { value: "custom", label: "Свой вариант", desc: "Укажите свой стиль" },
];

// ─── OrderFormSection ───────────────────────────────────────────────────────

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
          <div className="relative bg-card rounded-3xl shadow-xl shadow-plum/[0.04] p-8 md:p-12 border border-border/40">
            {/* Header + Pricing — elegant, no floating badge */}
            <div className="text-center mb-10">
              <h2
                id="form-heading"
                className="font-display text-4xl md:text-5xl font-bold mb-6 text-plum"
              >
                Создайте свою песню
              </h2>

              <div className="mb-5">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-lg text-muted-foreground line-through">
                    1&nbsp;190&nbsp;&#8381;
                  </span>
                  <span className="text-xs font-bold bg-plum/8 text-plum px-3 py-1 rounded-full uppercase tracking-wide">
                    &minus;50%
                  </span>
                </div>
                <span className="font-display text-5xl md:text-6xl font-bold text-foreground">
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
                {/* ═══════════════════════════════════════
                    SECTION 1: О ком песня
                ═══════════════════════════════════════ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-plum/10 flex items-center justify-center text-xs font-bold text-plum">
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
                            className="resize-none rounded-xl input-warm-focus"
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
                            className="resize-none rounded-xl input-warm-focus"
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
                            className="resize-none rounded-xl input-warm-focus"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Можно оставить пустым, мы сами подберём лучшие слова
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
                              className="rounded-xl input-warm-focus"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* ═══════════════════════════════════════
                    SECTION 2: Стиль и жанр
                ═══════════════════════════════════════ */}
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-plum/10 flex items-center justify-center text-xs font-bold text-plum">
                      2
                    </div>
                    Выберите стиль
                  </div>

                  {/* Text style — no emoji */}
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
                              <FormItem key={style.value} className="h-auto">
                                <FormControl>
                                  <div className="h-full">
                                    <RadioGroupItem
                                      value={style.value}
                                      id={`style-${style.value}`}
                                      className="peer sr-only"
                                    />
                                    <FormLabel
                                      htmlFor={`style-${style.value}`}
                                      className="flex flex-col items-center justify-center rounded-xl border-2 border-border/60 bg-card p-4 h-full hover:border-plum/30 hover:bg-plum/[0.02] peer-data-[state=checked]:border-plum peer-data-[state=checked]:bg-plum/5 [&:has([data-state=checked])]:border-plum [&:has([data-state=checked])]:bg-plum/5 cursor-pointer transition-all duration-200 text-center"
                                    >
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
                              className="rounded-xl input-warm-focus"
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

                  {/* Genre — colored dot cards */}
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
                                      className="flex items-center gap-2.5 rounded-xl border-2 border-border/60 bg-card p-3 cursor-pointer transition-all duration-200 hover:border-plum/30 peer-data-[state=checked]:border-plum peer-data-[state=checked]:bg-plum/5 [&:has([data-state=checked])]:border-plum [&:has([data-state=checked])]:bg-plum/5"
                                    >
                                      <span
                                        className={`w-3 h-3 rounded-full ${genre.dot} flex-shrink-0`}
                                        aria-hidden="true"
                                      />
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

                  {/* Voice — clean, no emoji */}
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
                                      id={`voice-${voice.value}`}
                                      className="peer sr-only"
                                    />
                                    <FormLabel
                                      htmlFor={`voice-${voice.value}`}
                                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-border/60 bg-card p-4 hover:border-plum/30 hover:bg-plum/[0.02] peer-data-[state=checked]:border-plum peer-data-[state=checked]:bg-plum/5 [&:has([data-state=checked])]:border-plum [&:has([data-state=checked])]:bg-plum/5 cursor-pointer font-semibold transition-all duration-200"
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
                </div>

                {/* ═══════════════════════════════════════
                    SECTION 3: Контакты и оплата
                ═══════════════════════════════════════ */}
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-plum/10 flex items-center justify-center text-xs font-bold text-plum">
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
                            className="rounded-xl input-warm-focus"
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
                          className="w-full text-lg py-7 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer"
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
