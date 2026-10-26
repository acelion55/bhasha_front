import type { Metadata } from 'next';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Language Learning Blog & Guides | BhashaSchool Journal',
  description:
    'Expert language guides, CEFR exam preparation tips, German and English speaking strategies, and student stories to help you achieve fluency.',
  keywords: TARGET_KEYWORDS,
  openGraph: {
    title: 'Language Learning Blog & Guides | BhashaSchool Journal',
    description:
      'Expert language guides, CEFR exam preparation tips, German and English speaking strategies, and student stories.',
    url: 'https://bhashaschool.com/blog',
    type: 'website',
  },
  alternates: {
    canonical: 'https://bhashaschool.com/blog/',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
