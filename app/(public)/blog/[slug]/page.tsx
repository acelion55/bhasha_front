import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getMergedKeywords } from '@/lib/seo-keywords';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  BookOpen,
  ArrowRight,
  Brain,
  Coffee,
  Languages,
  Rocket,
  Target,
  UserRound,
  Info,
  AlertCircle,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const categoryIcons: Record<string, LucideIcon> = {
  'Study Methods': Brain,
  Grammar: BookOpen,
  'English Learning': Languages,
  Culture: Coffee,
  'Student Stories': Rocket,
  'German Tips': Target,
  'Goethe Exam Prep': Target,
  'Peer Ladder Tips': Rocket,
  'Vocabulary Drills': Languages,
  About: Info,
};

function CategoryIcon({ tag, className }: { tag: string; className?: string }) {
  const Icon = categoryIcons[tag] ?? BookOpen;
  return <Icon className={className} />;
}

interface ApiBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  tag?: string;
  tagColor?: string;
  author?: string;
  authorRole?: string;
  readTime?: string;
  createdAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

const fallbackTagColor = 'bg-emerald-100 text-emerald-800';

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

function cleanSlug(rawSlug: string): string {
  return decodeURIComponent(rawSlug).replace(/^\/+|\/+$/g, '');
}

async function getBlog(rawSlug: string): Promise<ApiBlog | null> {
  const slug = cleanSlug(rawSlug);
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Request failed');
    return (await res.json()) as ApiBlog;
  } catch {
    return null;
  }
}

async function getRelated(currentSlug: string): Promise<ApiBlog[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      cache: 'no-store',
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: ApiBlog[] = await res.json();
    return Array.isArray(data)
      ? data.filter((b) => cleanSlug(b.slug) !== cleanSlug(currentSlug)).slice(0, 3)
      : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlog(slug);

  if (!article) {
    return {
      title: 'Article Not Found | BhashaSchool',
      description: 'The requested language learning article could not be found.',
    };
  }

  const title = article.seoTitle || `${article.title} | BhashaSchool`;
  const description =
    article.seoDescription ||
    article.excerpt ||
    'Master language speaking with live cohorts, certified tutors, and interactive daily practice at BhashaSchool.';
  const keywords = getMergedKeywords(
    article.seoKeywords || [article.tag || 'Language Learning', 'BhashaSchool']
  );

  const canonicalUrl = `https://bhashaschool.com/blog/${cleanSlug(article.slug)}/`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'BhashaSchool',
      publishedTime: article.createdAt,
      authors: [article.author || 'BhashaSchool Academic Team'],
      images: [
        {
          url: article.imageUrl || 'https://bhashaschool.com/hero-classroom.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [article.imageUrl || 'https://bhashaschool.com/hero-classroom.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Helper to extract FAQs for AEO/GEO JSON-LD
function extractFaqs(content: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const faqSplit = content.split(/## Frequently Asked Questions/i)[1];
  if (!faqSplit) return faqs;

  const items = faqSplit.split(/\n###\s+/).slice(1);
  for (const item of items) {
    const lines = item.trim().split('\n');
    const question = lines[0]?.trim();
    const answer = lines
      .slice(1)
      .join(' ')
      .replace(/\*\*|__|\*|_/g, '')
      .trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

// Inline Markdown parser (bold, italic, code)
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('***') && token.endsWith('***')) {
      parts.push(
        <strong key={match.index} className="font-extrabold italic text-gray-900">
          {token.slice(3, -3)}
        </strong>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-gray-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-gray-800">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-xs font-mono font-medium"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

// Markdown Table Parser
function renderTable(block: string, key: number) {
  const rows = block.trim().split('\n').filter((r) => r.trim().startsWith('|'));
  if (rows.length < 2) return null;

  const parseRow = (row: string) =>
    row.split('|').slice(1, -1).map((cell) => cell.trim());

  const headerCells = parseRow(rows[0]);
  const dataRows = rows.slice(1).filter((r) => !/^[|\s-:]+$/.test(r));

  return (
    <div key={key} className="my-8 overflow-x-auto rounded-2xl border border-emerald-100 shadow-xs">
      <table className="min-w-full divide-y divide-emerald-100 text-left text-sm sm:text-base">
        <thead className="bg-emerald-50/70">
          <tr>
            {headerCells.map((h, i) => (
              <th key={i} className="px-4 py-3.5 font-black text-emerald-950 font-[Plus_Jakarta_Sans]">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {dataRows.map((rowStr, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              {parseRow(rowStr).map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-gray-700 leading-relaxed font-medium">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Content block renderer
function renderContent(content: string) {
  return content.split(/\n{2,}/).map((rawBlock, index) => {
    const block = rawBlock.trim();
    if (!block) return null;

    // Horizontal Divider
    if (block === '---') {
      return <hr key={index} className="my-8 border-gray-200" />;
    }

    // Direct Answer / Blockquote
    if (block.startsWith('> ')) {
      const quoteText = block.replace(/^>\s*/gm, '');
      return (
        <div
          key={index}
          className="my-6 rounded-2xl border-l-4 border-emerald-600 bg-emerald-50/70 p-5 sm:p-6 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-sm md:text-base text-emerald-950 font-medium leading-relaxed">
              {renderInline(quoteText)}
            </div>
          </div>
        </div>
      );
    }

    // Table
    if (block.startsWith('|') && block.includes('\n|')) {
      return renderTable(block, index);
    }

    // Heading 3
    if (block.startsWith('### ')) {
      const heading = block.slice(4);
      return (
        <h3
          key={index}
          className="font-black text-gray-900 text-lg sm:text-xl mb-3 mt-7 font-[Plus_Jakarta_Sans]"
        >
          {renderInline(heading)}
        </h3>
      );
    }

    // Heading 2 / Heading 1
    if (block.startsWith('## ') || block.startsWith('# ')) {
      const heading = block.replace(/^#+\s/, '');
      return (
        <h2
          key={index}
          style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
          className="font-black text-gray-900 font-[Plus_Jakarta_Sans] mb-4 mt-10 first:mt-0 tracking-tight"
        >
          {renderInline(heading)}
        </h2>
      );
    }

    // Lists
    const lines = block.split('\n');

    // Ordered list
    if (lines.every((line) => /^\d+\.\s+/.test(line.trim()))) {
      return (
        <ol key={index} className="space-y-2.5 my-5 list-decimal pl-6 text-sm sm:text-base text-gray-700 leading-[1.8]">
          {lines.map((line, li) => (
            <li key={li}>{renderInline(line.replace(/^\d+\.\s+/, ''))}</li>
          ))}
        </ol>
      );
    }

    // Unordered list
    if (lines.every((line) => /^[-*]\s+/.test(line.trim()))) {
      return (
        <ul key={index} className="space-y-2.5 my-5 list-disc pl-6 text-sm sm:text-base text-gray-700 leading-[1.8]">
          {lines.map((line, li) => (
            <li key={li}>{renderInline(line.replace(/^[-*]\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    // Standard paragraph
    return (
      <p key={index} className="text-sm sm:text-base text-gray-700 leading-[1.85] mb-5 font-normal">
        {renderInline(block)}
      </p>
    );
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlog(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelated(article.slug);
  const tag = article.tag || 'German Tips';
  const tagColor = article.tagColor || fallbackTagColor;
  const date = formatDate(article.createdAt);
  const readTime = article.readTime || '6 min read';
  const author = article.author || 'BhashaSchool Academic Team';
  const authorRole = article.authorRole || 'Senior Tutor';
  const content = (article.content || article.excerpt || '').trim();

  const shareText = encodeURIComponent(article.title);
  const articleUrl = `https://bhashaschool.com/blog/${cleanSlug(article.slug)}/`;

  // Schemas for AEO and GEO
  const faqs = extractFaqs(content);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.seoDescription || article.excerpt,
    datePublished: article.createdAt || new Date().toISOString(),
    dateModified: article.createdAt || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    author: {
      '@type': 'Person',
      name: author,
      jobTitle: authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BhashaSchool',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bhashaschool.com/icon.png',
      },
    },
    image: article.imageUrl || 'https://bhashaschool.com/hero-classroom.png',
    keywords: getMergedKeywords(article.seoKeywords).join(', '),
  };

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://bhashaschool.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://bhashaschool.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <div className="bg-[#fdf8f3] overflow-x-hidden">
      {/* STRUCTURED DATA FOR SEARCH ENGINES & ANSWER ENGINES (AEO / GEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-emerald-100">
        <div className="w-full px-4 md:px-8 lg:px-12 py-3.5 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <Link
            href="/blog"
            className="hover:text-emerald-700 font-bold transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> BhashaSchool Blog
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px] md:max-w-none">{tag}</span>
        </div>
      </div>

      {/* HERO */}
      <section
        style={{ minHeight: '38vh' }}
        className="bg-gradient-to-br from-emerald-50 via-[#fdf8f3] to-violet-50 flex items-center py-12 md:py-16"
      >
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span
              className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full ${tagColor}`}
            >
              {tag}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> {readTime}
            </span>
            {date && (
              <span className="text-xs sm:text-sm text-gray-500 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {date}
              </span>
            )}
          </div>
          <h1
            style={{ fontSize: 'clamp(1.85rem, 3.8vw, 3.2rem)' }}
            className="font-black text-gray-900 font-[Plus_Jakarta_Sans] leading-tight mb-6 max-w-5xl"
          >
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-gray-600 text-base md:text-xl leading-relaxed mb-8 font-normal max-w-4xl">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-3 border-t border-emerald-100/60 max-w-5xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <UserRound className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-black text-gray-900">{author}</p>
                <p className="text-xs text-gray-500 font-medium">{authorRole}</p>
              </div>
            </div>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
                articleUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-emerald-700 transition-colors border border-gray-200 hover:border-emerald-300 rounded-2xl px-4 py-2.5 bg-white shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-emerald-600" /> Share Article
            </a>
          </div>
        </div>
      </section>

      {/* COVER BANNER */}
      <div
        style={{ height: '220px' }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 flex items-center justify-center"
      >
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-white" />
              <div className="absolute bottom-0 right-1/4 w-28 h-28 rounded-full bg-white" />
            </div>
            <div className="text-center relative space-y-2">
              <CategoryIcon tag={tag} className="w-16 h-16 text-white/90 mx-auto" />
              <p className="text-emerald-100 text-xs font-black uppercase tracking-widest">
                BhashaSchool Verified Guide
              </p>
            </div>
          </>
        )}
      </div>

      {/* ARTICLE BODY + SIDEBAR */}
      <section style={{ minHeight: '70vh' }} className="bg-white py-12 md:py-16">
        <div className="w-full px-4 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* MAIN CONTENT */}
          <article className="lg:col-span-3 prose-custom">
            {content ? (
              renderContent(content)
            ) : (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>The full article content is not available yet. Please check back soon.</p>
              </div>
            )}

            {/* HIGH CONVERTING AEO/GEO CTA BLOCK */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-950 rounded-3xl p-8 sm:p-10 text-white mt-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl -mr-20 -mt-20" />
              <p className="text-xs font-black uppercase tracking-widest text-emerald-300 mb-2.5">
                Ready to put theory into practice?
              </p>
              <h3
                style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }}
                className="font-black font-[Plus_Jakarta_Sans] mb-3 leading-snug"
              >
                Join a live BhashaSchool speaking cohort and practice with certified mentors
              </h3>
              <p className="text-emerald-100/90 text-sm sm:text-base mb-6 leading-relaxed">
                Max 5 learners per cohort · 38 min average speaking time per session · Personalized CEFR
                spoken assessment · Day 1 speaking confidence guarantee.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-sm sm:text-base px-6 py-4 rounded-2xl transition-all shadow-md"
                >
                  Book Free Assessment <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base px-5 py-4 rounded-2xl transition-colors border border-white/20"
                >
                  Explore Cohorts
                </Link>
              </div>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="bg-gray-50/80 border border-gray-100 rounded-3xl p-6 shadow-xs">
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">
                Author & Expert Review
              </p>
              <div className="flex items-center gap-3.5 mb-3.5">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                  <UserRound className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 font-[Plus_Jakarta_Sans]">
                    {author}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">{authorRole}</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                Part of the BhashaSchool academic committee, synthesizing insights from live classroom
                experiments and 14,000+ learner journeys across German, English, and Spanish.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-3xl p-6 shadow-xs">
              <p className="text-[11px] font-black uppercase tracking-widest text-emerald-800 mb-4">
                Article Key Stats
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Topic: {tag}</span>
                </li>
                {date && (
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Updated {date}</span>
                  </li>
                )}
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{readTime}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 font-medium">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>AEO & GEO Optimized</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-dashed border-emerald-200 rounded-3xl p-6 text-center shadow-xs">
              <BookOpen className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-black text-emerald-950 font-[Plus_Jakarta_Sans]">
                {readTime}
              </p>
              <p className="text-xs text-gray-500 font-medium">Estimated Reading Time</p>
            </div>
          </aside>
        </div>
      </section>

      {/* RELATED ARTICLES */}
      {related.length > 0 && (
        <section style={{ minHeight: '35vh' }} className="bg-[#fcfaf7] py-14 border-t border-emerald-100/60">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2
                  style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)' }}
                  className="font-black text-gray-900 font-[Plus_Jakarta_Sans]"
                >
                  Related Guides & Articles
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Explore other high-yield language learning roadmaps
                </p>
              </div>
              <Link
                href="/blog"
                className="text-sm font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
              >
                View all blogs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => {
                const relatedTag = r.tag || 'German Tips';
                return (
                  <Link key={r.slug} href={`/blog/${cleanSlug(r.slug)}/`}>
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                          <span
                            className={`text-[11px] font-black px-3 py-1 rounded-full ${
                              r.tagColor || fallbackTagColor
                            }`}
                          >
                            {relatedTag}
                          </span>
                          <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            {r.readTime || '5 min read'}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-gray-900 font-[Plus_Jakarta_Sans] group-hover:text-emerald-700 transition-colors leading-snug">
                          {r.title}
                        </h3>
                        {r.excerpt && (
                          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-2 font-medium">
                            {r.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="pt-4 mt-4 border-t border-gray-50 flex items-center text-xs sm:text-sm font-black text-emerald-700 group-hover:translate-x-1 transition-transform">
                        Read full guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
