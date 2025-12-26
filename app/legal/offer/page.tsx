import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: '/legal/offer',
  },
  title: "Договор оферты | YouWow",
  description: "Публичная оферта на оказание услуг YouWow",
};

export default function OfferPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="mb-6">Договор оферты</h1>

      <div className="space-y-4">
        <p>
          Эта страница находится в разработке. Договор оферты будет добавлен в ближайшее время.
        </p>

        <p>
          Услуга считается оказанной в момент отправки ссылки на цифровой контент (видео, изображение, аудиофайл) на указанный вами email.
        </p>
      </div>
    </article>
  );
}
