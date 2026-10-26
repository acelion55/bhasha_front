import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://bhashaschool.com';

  const blockedPaths = [
    '/dashboard',
    '/dashboard/',
    '/dashboard/*',
    '/admin',
    '/admin/',
    '/admin/*',
    '/learner',
    '/learner/',
    '/learner/*',
    '/mentor',
    '/mentor/',
    '/mentor/*',
    '/api',
    '/api/',
    '/api/*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: blockedPaths,
      },
      {
        userAgent: ['Googlebot', 'Bingbot', 'PerplexityBot', 'GPTBot', 'ClaudeBot', 'Applebot', 'Yandex'],
        allow: ['/', '/blog/', '/blog/*', '/courses/', '/classes/', '/about/', '/contact/'],
        disallow: blockedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
