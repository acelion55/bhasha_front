import { MetadataRoute } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE_URL = 'https://bhashaschool.com';

const fallbackSlugs = [
  'what-is-cefr',
  'german-a1-for-beginners',
  'german-a1-vs-a2',
  'how-to-improve-language-speaking',
  'learn-german-through-conversation',
  'how-to-practise-english-online',
  'spanish-for-beginners',
  'cefr-language-level-test',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogSlugs = fallbackSlugs;

  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      cache: 'no-store',
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const blogs = await res.json();
      if (Array.isArray(blogs) && blogs.length > 0) {
        blogSlugs = Array.from(new Set([...fallbackSlugs, ...blogs.map((b: any) => b.slug)]));
      }
    }
  } catch {
    // use fallback
  }

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/courses/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  return [...staticRoutes, ...blogEntries];
}
