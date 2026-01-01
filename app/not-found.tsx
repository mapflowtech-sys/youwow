"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Search, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-violet-50 via-background to-background dark:from-slate-900 dark:via-background dark:to-background px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Number with gradient */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-8xl sm:text-9xl font-bold font-space bg-gradient-to-r from-primary via-accent-pink to-accent-gold bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            404
          </h1>
        </motion.div>

        {/* Friendly message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Кажется, вы заблудились
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Страница, которую вы ищете, не существует или была перемещена.
            <br className="hidden sm:block" />
            Но не переживайте — мы поможем вам найти то, что нужно!
          </p>
        </motion.div>

        {/* Quick action cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          <Link href="/" className="group">
            <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-primary/20 transition-colors">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">На главную</h3>
                <p className="text-sm text-muted-foreground">
                  Вернуться на главную страницу
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/song" className="group">
            <Card className="h-full cursor-pointer border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-purple-500/10 p-3 rounded-full mb-3 group-hover:bg-purple-500/20 transition-colors">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Создать песню</h3>
                <p className="text-sm text-muted-foreground">
                  Заказать персональную песню
                </p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Support link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <Link href="/">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Вернуться на главную
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
            <span>Нужна помощь?</span>
            <a
              href="https://t.me/youwow_support"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              @youwow_support
            </a>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute top-20 left-10 text-9xl opacity-5 pointer-events-none hidden lg:block"
        >
          🎵
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute bottom-20 right-10 text-9xl opacity-5 pointer-events-none hidden lg:block"
        >
          🎁
        </motion.div>
      </motion.div>
    </main>
  );
}
