import type { Metadata } from 'next';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Terms of Service | BhashaSchool',
  description:
    'Review the Terms of Service for BhashaSchool language learning courses, cohort participation, and online classes.',
  keywords: TARGET_KEYWORDS,
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
