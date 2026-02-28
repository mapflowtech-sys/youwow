"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { SongFormData as APISongFormData } from "@/lib/genapi/text-generation";
import { songFormSchema, SongFormData } from "./lib/schema";
import { Button } from "@/components/ui/button";
import SongSchemaMarkup from "./components/SongSchemaMarkup";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ExamplesGrid from "./components/AudioExamples";
import ReviewsSection from "./components/ReviewsSection";
import OrderFormSection from "./components/OrderFormSection";
import FAQSection, { faqItems } from "./components/FAQSection";
import GuaranteeSection from "./components/GuaranteeSection";
import { AnimatedSection, SectionBar } from "./components/AnimationWrappers";

// ─── Sticky Mobile CTA ──────────────────────────────────────────────────────

function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const orderForm = document.getElementById("order-form");
    if (!orderForm) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when form is NOT visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    // Start observing after a short delay to prevent flash on load
    const timer = setTimeout(() => {
      observer.observe(orderForm);
    }, 1000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`sticky-cta md:hidden bg-white/95 border-t border-border/50 px-4 py-3 ${
        visible ? "visible" : ""
      }`}
    >
      <Button
        size="lg"
        className="w-full py-5 bg-gradient-to-r from-primary to-rose-400 text-white rounded-xl shadow-lg shadow-primary/20 text-base cursor-pointer"
        onClick={() =>
          document
            .getElementById("order-form")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        Создать песню за 590&nbsp;&#8381;
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function SongPage() {
  const [step, setStep] = useState<"form" | "payment" | "processing">("form");
  const [orderId, setOrderId] = useState<string>("");
  const [confirmationToken, setConfirmationToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SongFormData>({
    resolver: zodResolver(songFormSchema),
    defaultValues: {
      aboutPerson: "",
      facts: "",
      mustInclude: "",
      occasion: "",
      customOccasion: "",
      textStyle: "",
      customStyle: "",
      genre: "",
      voice: "female",
      email: "",
      agreedToPolicy: false,
    },
  });

  // Restore form data from localStorage
  useEffect(() => {
    const savedFormData = localStorage.getItem("song_form_draft");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData) as APISongFormData;
        form.reset({
          aboutPerson: parsedData.aboutWho || "",
          facts: parsedData.aboutWhat || "",
          mustInclude: parsedData.mustInclude || "",
          occasion: parsedData.occasion || "",
          customOccasion: parsedData.customOccasion || "",
          textStyle: parsedData.style || "",
          customStyle: parsedData.customStyle || "",
          genre: parsedData.genre || "",
          voice: parsedData.voice || "female",
          email: parsedData.email || "",
          agreedToPolicy: false,
        });
      } catch {
        // Ignore invalid draft
      }
    }
  }, [form]);

  const onSubmit = async (data: SongFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          useWidget: true,
          formData: {
            voice: data.voice,
            aboutWho: data.aboutPerson,
            aboutWhat: data.facts,
            genre: data.genre,
            style: data.textStyle,
            customStyle: data.customStyle,
            occasion: data.occasion,
            customOccasion: data.customOccasion,
            mustInclude: data.mustInclude,
            email: data.email,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to create payment");

      const result = await response.json();

      if (result.payment?.confirmationToken) {
        setOrderId(result.orderId);
        setConfirmationToken(result.payment.confirmationToken);
        setStep("payment");
      } else {
        throw new Error("No confirmation token received");
      }
    } catch {
      alert("Ошибка при создании заказа. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    form.handleSubmit(onSubmit)();
  };

  // Schema.org FAQ items for structured data
  const schemaFaqItems = faqItems.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <div className="min-h-screen bg-background">
      <SongSchemaMarkup faqItems={schemaFaqItems} />

      {/* 1. Hero — gradient, social proof, CTA, stats bar */}
      <HeroSection />

      {/* 2. Audio Examples — moved UP for immediate proof */}
      <AnimatedSection>
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBar />
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                Послушайте — и вы всё поймёте
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Реальные песни, созданные для реальных людей
              </p>
              <p className="text-sm text-muted-foreground">
                Все треки публикуются с&nbsp;согласия авторов
              </p>
            </div>

            <ExamplesGrid />
          </div>
        </section>
      </AnimatedSection>

      {/* 3. How It Works — timeline + large numbers */}
      <HowItWorksSection />

      {/* 4. Reviews — with occasion tags */}
      <ReviewsSection />

      {/* 5. Order Form — visual cards, progress sections */}
      <OrderFormSection
        form={form}
        step={step}
        isSubmitting={isSubmitting}
        confirmationToken={confirmationToken}
        orderId={orderId}
        onSubmitClick={handleSubmitClick}
        onPaymentSuccess={() => {
          // Payment success handler
        }}
        onPaymentError={() => {}}
      />

      {/* 6. FAQ */}
      <FAQSection />

      {/* 7. Guarantee + SEO */}
      <GuaranteeSection />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />
    </div>
  );
}
