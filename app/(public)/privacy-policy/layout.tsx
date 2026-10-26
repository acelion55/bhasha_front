import type { Metadata } from 'next';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Privacy Policy | BhashaSchool',
  description:
    'Read the BhashaSchool Privacy Policy. Learn how we safeguard student data, class sessions, and personal information.',
  keywords: TARGET_KEYWORDS,
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
