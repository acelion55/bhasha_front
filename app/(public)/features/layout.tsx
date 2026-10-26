import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Courses & Fees — BhashaSchool | German & English Language Courses',
  description:
    'German teaching structure with Baustein + A1, A2, B1 and B2 fees, plus Intermediate English. Live classes Monday to Friday, PDF material, B1/B2 exam preparation.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://bhashaschool.com/courses',
  },
};

export default function CoursesLayout({ children }: { children: ReactNode }) {
  return children;
}
