import type { Metadata } from 'next';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Contact Us | BhashaSchool Language Learning Platform',
  description:
    'Have questions about our German and English courses? Contact the BhashaSchool team for course counseling, schedule inquiries, and spoken assessments.',
  keywords: TARGET_KEYWORDS,
  openGraph: {
    title: 'Contact BhashaSchool — Language Learning Platform',
    description:
      'Get in touch with BhashaSchool academic advisors for live cohort guidance and assessment booking.',
    url: 'https://bhashaschool.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
