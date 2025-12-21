"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main>
      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 via-background to-background dark:from-slate-900 dark:via-background dark:to-background px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-space bg-gradient-to-r from-primary via-accent-pink to-accent-gold bg-clip-text text-transparent mb-6">
            Подари эмоции, которые невозможно забыть
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mt-6">
            Персональные видео, песни и предсказания на 2026, созданные специально для вас за 1 минуту
          </p>

          <Button
            onClick={scrollToServices}
            size="lg"
            className="mt-8 bg-accent-gold hover:bg-accent-gold/90 text-white text-lg px-8 py-6"
          >
            Выбрать чудо ↓
          </Button>
        </motion.div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Что создадим сегодня?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* КАРТОЧКА 1 — Гадание Таро */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/tarot">
              <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all hover:shadow-xl">
                <CardHeader>
                  <Badge className="w-fit mb-3 bg-accent-pink/10 text-accent-pink border-accent-pink/20">
                    🔥 Viral
                  </Badge>
                  <CardTitle className="text-2xl">Гадание Таро 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Узнай свою судьбу. Создадим уникальную карту Таро с твоим лицом и предсказанием
                  </p>
                  <p className="text-3xl font-bold font-space text-primary mt-4">
                    290 ₽
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary">
                    Узнать будущее →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* КАРТОЧКА 2 — Видео от Деда Мороза */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/santa">
              <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all hover:shadow-xl">
                <CardHeader>
                  <Badge className="w-fit mb-3 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                    🎄 Хит сезона
                  </Badge>
                  <CardTitle className="text-2xl">Видео от Деда Мороза</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Дед Мороз лично поздравит ребёнка или взрослого.
                  </p>
                  <p className="text-3xl font-bold font-space text-primary mt-4">
                    от 690 ₽
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary">
                    Создать поздравление →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>

          {/* КАРТОЧКА 3 — Персональная песня */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/song">
              <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all hover:shadow-xl">
                <CardHeader>
                  <Badge className="w-fit mb-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                    🎵 Новинка
                  </Badge>
                  <CardTitle className="text-2xl">Твой персональный хит</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Песня про твоего друга. Слова и музыка в любом стиле
                  </p>
                  <p className="text-3xl font-bold font-space text-primary mt-4">
                    490 ₽
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary">
                    Записать трек →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Магия в 3 клика</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Шаг 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Заполни форму</h3>
              <p className="text-muted-foreground">
                Расскажи о том, кого поздравляем
              </p>
            </motion.div>

            {/* Шаг 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <CreditCard className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Оплати</h3>
              <p className="text-muted-foreground">
                Безопасная оплата российскими картами
              </p>
            </motion.div>

            {/* Шаг 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Получи магию</h3>
              <p className="text-muted-foreground">
                Результат на почту через несколько минут
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
