"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { SongFormData as APISongFormData } from "@/lib/genapi/text-generation";
import { songFormSchema, SongFormData } from "./lib/schema";
import SongSchemaMarkup from "./components/SongSchemaMarkup";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ExamplesGrid from "./components/AudioExamples";
import ReviewsSection from "./components/ReviewsSection";
import OrderFormSection from "./components/OrderFormSection";
import FAQSection, { faqItems } from "./components/FAQSection";
import GuaranteeSection from "./components/GuaranteeSection";
import { AnimatedSection, SectionBar } from "./components/AnimationWrappers";

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
        console.log("[Form] Restored draft from localStorage");
      } catch (error) {
        console.error("[Form] Failed to restore draft:", error);
      }
    }
  }, [form]);

  const onSubmit = async (data: SongFormData) => {
    setIsSubmitting(true);

    try {
      console.log("[Song] Submitting form:", data);

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
      console.log("[Song] Payment created:", result);

      if (result.payment?.confirmationToken) {
        setOrderId(result.orderId);
        setConfirmationToken(result.payment.confirmationToken);
        setStep("payment");
      } else {
        throw new Error("No confirmation token received");
      }
    } catch (error) {
      console.error("[Song] Error:", error);
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

      <HeroSection />

      <HowItWorksSection />

      {/* ════════════════════════════════════════════════════════════════════
          AUDIO EXAMPLES
      ════════════════════════════════════════════════════════════════════ */}
      <AnimatedSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionBar />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Послушайте примеры
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Реальные песни, которые наши клиенты получили в&nbsp;подарок
              </p>
              <p className="text-sm text-muted-foreground">
                Все треки публикуются с&nbsp;согласия авторов
              </p>
            </div>

            <ExamplesGrid />
          </div>
        </section>
      </AnimatedSection>

      <ReviewsSection />

      <OrderFormSection
        form={form}
        step={step}
        isSubmitting={isSubmitting}
        confirmationToken={confirmationToken}
        orderId={orderId}
        onSubmitClick={handleSubmitClick}
        onPaymentSuccess={(id) => {
          console.log("[Song] Payment success!");
        }}
        onPaymentError={() => {}}
      />

      <FAQSection />

      <GuaranteeSection />
    </div>
  );
}
