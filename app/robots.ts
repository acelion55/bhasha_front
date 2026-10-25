import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bhashaschool.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/admin/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'PerplexityBot', 'GPTBot', 'ClaudeBot'],
        allow: ['/', '/blog/', '/courses/'],
        disallow: ['/dashboard/', '/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
