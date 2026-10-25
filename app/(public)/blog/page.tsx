'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  BookOpen,
  Search,
  Brain,
  Coffee,
  Languages,
  Rocket,
  Target,
  UserRound,
  SearchX,
  PartyPopper,
  Loader2,
  Info,
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
}

interface BlogCard {
  slug: string;
  tag: string;
  tagColor: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

const fallbackTagColor = 'bg-emerald-100 text-emerald-700';

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const toCard = (blog: ApiBlog): BlogCard => ({
  slug: blog.slug,
  tag: blog.tag || 'German Tips',
  tagColor: blog.tagColor || fallbackTagColor,
  title: blog.title,
  excerpt: blog.excerpt || '',
  author: blog.author || 'BhashaSchool Academic Team',
  authorRole: blog.authorRole || 'Senior Tutor',
  date: formatDate(blog.createdAt),
  readTime: blog.readTime || '5 min read',
  imageUrl: blog.imageUrl || '',
});

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/blogs`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Request failed');
      const data: ApiBlog[] = await res.json();
      setBlogs(Array.isArray(data) ? data.map(toCard) : []);
    } catch {
      setError('Could not load articles right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogs.map((b) => b.tag)))],
    [blogs],
  );

  const featured = blogs[0];
  const articles = blogs.slice(1);

  const filtered = articles.filter((article) => {
    const matchesCategory = activeCategory === 'All' || article.tag === activeCategory;
    const term = search.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(term) || article.excerpt.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#fdf8f3] overflow-x-hidden">
      {/* HERO */}
      <section style={{ minHeight: '42vh' }} className="hero-gradient flex items-center py-14 md:py-20">
        <div className="w-full px-4 md:px-8 lg:px-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4">BhashaSchool Journal</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.4rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] leading-tight mb-4">
            Insights for Language Learners
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-8">
            Expert guides, student stories, grammar deep-dives and cultural insights to help you speak German and English with real confidence.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white border border-emerald-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <section className="bg-white py-16">
          <div className="mx-auto flex items-center justify-center gap-3 px-4 text-sm font-bold text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            Loading articles…
          </div>
        </section>
      ) : error ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-md px-4 text-center">
            <p className="text-sm font-bold text-rose-600">{error}</p>
            <button
              type="button"
              onClick={loadBlogs}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Try again
            </button>
          </div>
        </section>
      ) : blogs.length === 0 ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-md px-4 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-emerald-300" />
            <p className="text-base font-bold text-gray-700">No articles published yet</p>
            <p className="mt-1 text-sm text-gray-500">New articles will appear here as soon as they are published.</p>
          </div>
        </section>
      ) : (
        <>
          {/* FEATURED POST */}
          {featured && (
            <section style={{ minHeight: '40vh' }} className="bg-white py-12 md:py-16">
              <div className="w-full px-4 md:px-8 lg:px-12">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-6">Featured Article</p>
                <Link href={`/blog/${featured.slug}`}>
                  <div className="card-soft overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                      <div style={{ minHeight: '280px' }} className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-violet-800 flex items-center justify-center relative overflow-hidden">
                        {featured.imageUrl ? (
                          <img src={featured.imageUrl} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <>
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-white" />
                              <div className="absolute bottom-8 right-4 w-16 h-16 rounded-full bg-white" />
                              <div className="absolute top-1/2 right-12 w-10 h-10 rounded-full bg-white" />
                            </div>
                            <CategoryIcon tag={featured.tag} className="relative w-24 h-24 text-white/80" />
                          </>
                        )}
                      </div>
                      <div className="lg:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${featured.tagColor}`}>{featured.tag}</span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                          <span className="text-[11px] text-gray-400">{featured.date}</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] mb-4 group-hover:text-emerald-700 transition-colors leading-snug">
                          {featured.title}
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center"><UserRound className="w-5 h-5 text-emerald-700" /></div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{featured.author}</p>
                              <p className="text-[10px] text-gray-400">{featured.authorRole}</p>
                            </div>
                          </div>
                          <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 group-hover:gap-2.5 transition-all">
                            Read Article <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* ARTICLE GRID */}
          <section style={{ minHeight: '65vh' }} className="cream-bg py-12 md:py-16">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="flex flex-wrap gap-2 mb-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === category
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300/40'
                        : 'bg-white border border-emerald-100 text-gray-600 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mb-4 flex justify-center"><SearchX className="w-12 h-12 text-gray-300" /></div>
                  <p className="font-bold text-gray-700">
                    {articles.length === 0 ? 'More articles are coming soon.' : `No articles found for "${search}"`}
                  </p>
                  {articles.length > 0 && (
                    <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-4 text-sm text-emerald-600 font-bold hover:underline">Clear filters</button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((article) => (
                    <Link key={article.slug} href={`/blog/${article.slug}`}>
                      <div className="card-soft overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                        <div style={{ height: '160px' }} className="bg-gradient-to-br from-emerald-50 to-violet-100 flex items-center justify-center relative overflow-hidden">
                          {article.imageUrl ? (
                            <img src={article.imageUrl} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
                          ) : (
                            <>
                              <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-emerald-400" />
                                <div className="absolute bottom-3 right-6 w-10 h-10 rounded-full bg-violet-500" />
                              </div>
                              <CategoryIcon tag={article.tag} className="relative w-14 h-14 text-emerald-700/50" />
                            </>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${article.tagColor}`}>{article.tag}</span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                          </div>
                          <h3 style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] mb-3 group-hover:text-emerald-700 transition-colors leading-snug flex-1">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed mb-5 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center"><UserRound className="w-4 h-4 text-emerald-700" /></div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-800">{article.author}</p>
                                <p className="text-[9px] text-gray-400">{article.date}</p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* NEWSLETTER */}
      <section style={{ minHeight: '35vh' }} className="bg-emerald-700 flex items-center py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-900/30 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto px-4 md:px-8 lg:px-12 text-center w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-3">Stay Updated</p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.2rem)' }} className="font-extrabold text-white font-[Plus_Jakarta_Sans] mb-3">
            Weekly language tips, straight to your inbox
          </h2>
          <p className="text-emerald-100 text-sm max-w-md mx-auto mb-8">
            Join 6,200+ learners who get our Tuesday digest — grammar guides, vocabulary challenges, and student success stories every week.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/20 border border-white/30 rounded-2xl px-8 py-4">
              <PartyPopper className="w-6 h-6 text-white flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-white text-sm">You're subscribed!</p>
                <p className="text-emerald-200 text-xs">Check your inbox for a welcome email.</p>
              </div>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur"
              />
              <button type="submit" className="px-6 py-3.5 bg-white text-emerald-700 font-bold text-sm rounded-2xl hover:bg-emerald-50 transition-colors flex items-center gap-2 justify-center flex-shrink-0">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          <p className="text-emerald-300 text-[11px] mt-4">No spam. Unsubscribe in one click anytime.</p>
        </div>
      </section>
    </div>
  );
}
