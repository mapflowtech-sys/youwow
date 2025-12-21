import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary">
          YouWow
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          AI-подарки с WOW-эффектом за 60 секунд
        </p>
        <Button size="lg" className="min-h-12 bg-accent-gold hover:bg-accent-gold/90 text-white font-display">
          <Sparkles className="mr-2 h-5 w-5" />
          Создать магию
        </Button>
      </div>
    </main>
  );
}
