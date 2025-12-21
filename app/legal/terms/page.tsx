import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользовательское соглашение | YouWow",
  description: "Пользовательское соглашение YouWow - правила использования сервиса",
};

export default function TermsPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="mb-6">Пользовательское соглашение</h1>

      <div className="space-y-4">
        <p>
          Эта страница находится в разработке. Пользовательское соглашение будет добавлено в ближайшее время.
        </p>
      </div>
    </article>
  );
}
