"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
                                    className="flex flex-col items-start rounded-xl border-2 border-border/60 bg-white p-4 hover:border-primary/40 hover:bg-primary/2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer transition-all duration-200"
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
                                    className="flex items-center justify-center rounded-xl border-2 border-border/60 bg-white p-4 hover:border-primary/40 hover:bg-primary/2 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 cursor-pointer font-semibold transition-all duration-200"
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
                        onClick={onSubmitClick}
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
