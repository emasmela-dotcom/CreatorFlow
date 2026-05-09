/** FAQPage JSON-LD — must mirror visible on-page FAQ exactly (Google rich results). */

export type FaqPair = { question: string; answer: string }

export function faqPageJsonLd(items: FaqPair[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
