import type { Metadata } from 'next';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Language Courses — German, English & Spanish | BhashaSchool',
  description:
    'Explore CEFR-based language courses for German A1-B2, Conversational English, and Spanish. Live cohorts, personalized feedback, and certified trainers.',
  keywords: TARGET_KEYWORDS,
  openGraph: {
    title: 'Language Courses — German, English & Spanish | BhashaSchool',
    description:
      'Explore CEFR-based language courses for German A1-B2, Conversational English, and Spanish.',
    url: 'https://bhashaschool.com/courses',
    type: 'website',
  },
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
