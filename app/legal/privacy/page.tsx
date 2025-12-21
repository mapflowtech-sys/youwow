import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | YouWow",
  description: "Политика конфиденциальности YouWow - защита персональных данных",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="mb-6">Политика конфиденциальности</h1>

      <div className="space-y-4">
        <p>
          Эта страница находится в разработке. Политика конфиденциальности будет добавлена в ближайшее время.
        </p>

        <p>
          YouWow серьёзно относится к защите ваших персональных данных. Все загруженные фотографии удаляются через 24 часа после генерации результата.
        </p>
      </div>
    </article>
  );
}
