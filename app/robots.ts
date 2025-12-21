import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://youwow.ru' // Замени на свой домен когда будет готов

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/order/', '/orders/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
