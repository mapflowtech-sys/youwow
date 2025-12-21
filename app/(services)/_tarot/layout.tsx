import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Гадание Таро с твоим лицом | YouWow",
  description:
    "Уникальная карта Таро с твоим лицом и предсказанием на 2026 год. Готово за 10 минут. 290₽",
  openGraph: {
    title: "Гадание Таро с твоим лицом | YouWow",
    description:
      "Уникальная карта Таро с твоим лицом и предсказанием на 2026 год. Готово за 10 минут. 290₽",
    type: "website",
  },
};

export default function TarotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
