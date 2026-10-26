import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getMergedKeywords } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'About BhashaSchool | Language Learning Platform India',
  description:
    "Learn about BhashaSchool's structured language education system. MSME-registered with MQA certification. Teaching German & English since 2022 with mentorship and exam prep.",
  keywords: getMergedKeywords([
    'about BhashaSchool',
    'language school India',
    'German learning',
    'English learning',
    'language education',
  ]),
  openGraph: {
    title: 'About BhashaSchool - Structured Language Learning',
    description:
      "Discover how BhashaSchool's innovative learning model connects teachers, mentors, and learners for practical language mastery.",
    url: 'https://bhashaschool.com/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
