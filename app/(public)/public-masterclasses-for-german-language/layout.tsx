import type { Metadata } from 'next';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Free Live Public Masterclasses for German Language | BhashaSchool',
  description:
    'Join free interactive masterclasses hosted by expert German trainers. Learn German pronunciation, Goethe exam strategies, and conversational speaking live.',
  keywords: TARGET_KEYWORDS,
  openGraph: {
    title: 'Free Live Masterclasses for German Language — BhashaSchool',
    description:
      'Learn German pronunciation, Goethe exam strategies, and conversational speaking in free live interactive sessions.',
    url: 'https://bhashaschool.com/public-masterclasses-for-german-language',
    type: 'website',
  },
};

export default function MasterclassesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
