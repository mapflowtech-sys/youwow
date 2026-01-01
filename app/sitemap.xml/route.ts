/**
 * Dynamic sitemap endpoint
 * Automatically updates when new services or pages are added
 * Cached for 1 hour on CDN/Edge for performance
 */

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

function buildUrlEntry(url: SitemapUrl): string {
  const { loc, lastmod, changefreq, priority } = url;
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ''}
    ${priority !== undefined ? `<priority>${priority}</priority>` : ''}
  </url>`;
}

export async function GET() {
  const baseUrl = 'https://youwow.ru';

  // Static pages - update lastmod when content changes
  const staticPages: SitemapUrl[] = [
    {
      loc: baseUrl,
      lastmod: '2026-01-01', // Update when homepage content changes
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/song`,
      lastmod: '2026-01-01', // Update when song page content/price changes
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/santa`,
      lastmod: '2025-12-15', // Update when santa page content changes
      changefreq: 'monthly',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/legal/privacy`,
      lastmod: '2025-11-01',
      changefreq: 'monthly',
      priority: 0.3,
    },
    {
      loc: `${baseUrl}/legal/offer`,
      lastmod: '2025-11-01',
      changefreq: 'monthly',
      priority: 0.3,
    },
    {
      loc: `${baseUrl}/legal/terms`,
      lastmod: '2025-11-01',
      changefreq: 'monthly',
      priority: 0.3,
    },
  ];

  // TODO: Add dynamic pages from database when needed
  // Example: fetch active services, blog posts, etc.
  // const dynamicPages = await fetchDynamicPages();
  // const allPages = [...staticPages, ...dynamicPages];

  const allPages = staticPages;

  // Generate XML
  const urlsXml = allPages.map(page => buildUrlEntry(page)).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlsXml}
</urlset>`;

  // Return with cache headers for CDN/Edge caching
  // Cache for 1 hour, stale-while-revalidate for 24 hours
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

/**
 * Helper function to fetch dynamic pages from database (for future use)
 * Uncomment and implement when you have dynamic content
 */
/*
async function fetchDynamicPages(): Promise<SitemapUrl[]> {
  try {
    // Example: fetch from Supabase or your database
    // const { data } = await supabase.from('services').select('slug, updated_at').eq('active', true);
    // return data.map(item => ({
    //   loc: `https://youwow.ru/service/${item.slug}`,
    //   lastmod: new Date(item.updated_at).toISOString().split('T')[0],
    //   changefreq: 'weekly',
    //   priority: 0.8,
    // }));
    return [];
  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error);
    return [];
  }
}
*/
