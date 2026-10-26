import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Public Classes & Masterclasses — BhashaSchool',
  description: 'Join our free and public masterclasses to experience our teaching methodology.',
  keywords: TARGET_KEYWORDS,
  openGraph: {
    title: 'Public Classes & Masterclasses — BhashaSchool',
    description: 'Join our free and public masterclasses to experience our teaching methodology.',
    url: 'https://bhashaschool.com/classes',
    type: 'website',
  },
};

export default function ClassesLayout({ children }: { children: ReactNode }) {
  return children;
}
