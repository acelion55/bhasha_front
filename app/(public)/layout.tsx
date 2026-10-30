import type { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import BottomNav from '@/components/layout/bottom-nav';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'BhashaSchool — Learn German & English with Live Expert Tutors',
  description:
    'Master German, English, and Spanish in small live cohorts. CEFR-certified tutors, peer speaking practice, and Goethe exam preparation.',
  keywords: TARGET_KEYWORDS,
  openGraph: {
    title: 'BhashaSchool — Live Online Language Learning Platform',
    description:
      'Master German, English, and Spanish in small live cohorts. CEFR-certified tutors, peer speaking practice, and Goethe exam preparation.',
    url: 'https://bhashaschool.com',
    type: 'website',
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh' }} className="flex flex-col justify-between pb-[70px] md:pb-0 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
