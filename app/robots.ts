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
        allow: [
          '/',
          '/blog/',
          '/blog/*',
          '/courses/',
          '/courses/*',
          '/classes/',
          '/about/',
          '/contact/',
          '/features/',
          '/german-for-beginners/',
          '/english-conversational/',
          '/german-language-for-business-professionals/',
          '/business-german/',
          '/exam-preparation/',
          '/exam-preparation-for-german-language/',
          '/public-masterclasses-for-german-language/',
        ],
        disallow: blockedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
