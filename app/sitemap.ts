import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE_URL = 'https://bhashaschool.com';

const fallbackBlogSlugs = [
  'what-is-cefr',
  'german-a1-for-beginners',
  'german-a1-vs-a2',
  'how-to-improve-language-speaking',
  'learn-german-through-conversation',
  'how-to-practise-english-online',
  'spanish-for-beginners',
  'cefr-language-level-test',
];

interface BlogItem {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  published?: boolean;
}

function cleanSlug(raw: string): string {
  return decodeURIComponent(raw).replace(/^\/+|\/+$/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/courses/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/classes/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/features/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/german-for-beginners/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/english-conversational/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/german-language-for-business-professionals/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/business-german/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/exam-preparation/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/exam-preparation-for-german-language/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/public-masterclasses-for-german-language/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/courses/german-beginners/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/courses/english-conversational/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/courses/business-german/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/courses/exam-preparation/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/courses/public-masterclasses/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Map to hold blogs by clean slug (preventing duplicates)
  const blogMap = new Map<string, { lastModified: Date }>();

  // Initialize with fallback blogs
  for (const s of fallbackBlogSlugs) {
    blogMap.set(cleanSlug(s), { lastModified: new Date() });
  }

  // Live fetch from backend to automatically capture any newly uploaded blogs
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        for (const item of data as BlogItem[]) {
          if (item?.slug) {
            const clean = cleanSlug(item.slug);
            const date = item.updatedAt
              ? new Date(item.updatedAt)
              : item.createdAt
              ? new Date(item.createdAt)
              : new Date();
            blogMap.set(clean, { lastModified: Number.isNaN(date.getTime()) ? new Date() : date });
          }
        }
      }
    }
  } catch {
    // Graceful fallback to established blogs if backend is unreachable
  }

  const blogEntries: MetadataRoute.Sitemap = Array.from(blogMap.entries()).map(([slug, meta]) => ({
    url: `${SITE_URL}/blog/${encodeURIComponent(slug)}/`,
    lastModified: meta.lastModified,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogEntries];
}
