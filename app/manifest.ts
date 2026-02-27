import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'YouWow - Персональные подарки с WOW-эффектом',
    short_name: 'YouWow',
    description: 'Создайте незабываемый персональный подарок на любой праздник!',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E8567F',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
}
