export default function SongSchemaMarkup({
  faqItems,
}: {
  faqItems: { question: string; answer: string }[];
}) {
  return (
    <>
      {/* ── Schema.org: Breadcrumbs ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: "https://youwow.ru",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Персональная песня на заказ",
                item: "https://youwow.ru/song",
              },
            ],
          }),
        }}
      />

      {/* ── Schema.org: Service ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Персональная песня на заказ",
            description:
              "Закажите уникальную персональную песню! Индивидуальная композиция с именем и историей получателя. Готово за 10 минут. Идеальный подарок на день рождения, Новый год или любой праздник.",
            provider: {
              "@type": "Organization",
              name: "YouWow",
              url: "https://youwow.ru",
            },
            serviceType: "Музыкальный подарок",
            areaServed: "RU",
            offers: {
              "@type": "Offer",
              price: "590",
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              priceValidUntil: "2026-12-31",
              url: "https://youwow.ru/song",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "344",
              bestRating: "5",
              worstRating: "1",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Жанры песен",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Классический поп",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Рок" },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Рэп / Хип-хоп",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Шансон" },
                },
              ],
            },
          }),
        }}
      />

      {/* ── Schema.org: FAQ ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </>
  );
}
