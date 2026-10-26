import './globals.css';
import { Providers } from './providers';
import type { Metadata } from 'next';
import Script from 'next/script';
import { TARGET_KEYWORDS } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'BhashaSchool — Learn German & English with Expert Tutors',
  description: 'Master German and English with live 1-on-1 lessons, AI-powered practice, and certified tutors. Join thousands of learners on BhashaSchool.',
  keywords: TARGET_KEYWORDS,
  verification: {
    google: 'bIbJdRXvoRZH0m0MDw098Y6gIUWuiv-WuyqJrb80d20',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EP75GXKQ1K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EP75GXKQ1K');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
