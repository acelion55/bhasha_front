'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Search,
  ArrowRight,
  BookOpen,
  Headphones,
  Sparkles,
  Star,
  CheckCircle2,
  SearchX,
  Mail,
  Send,
  GraduationCap,
} from 'lucide-react';

interface ApiBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  tag?: string;
  category?: string;
  tagColor?: string;
  author?: string;
  authorRole?: string;
  readTime?: string;
  published?: boolean;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

interface BlogCard {
  _id: string;
  slug: string;
  tag: string;
  tagColor?: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl: string;
  isFeatured?: boolean;
}

const DEFAULT_MOCK_BLOGS: BlogCard[] = [
  {
    _id: 'mock-1',
    slug: 'how-to-understand-your-cefr-language-level',
    title: 'How to Understand Your CEFR Language Level',
    excerpt:
      'Not sure whether you are an A2 or a B1? Here is how to benchmark your real language level, understand the official self-assessment grid, and prove your fluency.',
    tag: 'Study Methods',
    readTime: '7 min read',
    date: 'Oct 26, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'Testing & Certification Director',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop',
    isFeatured: true,
  },
  {
    _id: 'mock-2',
    slug: 'spanish-for-beginners-a-practical-learning-guide',
    title: 'Spanish for Beginners: A Practical Learning Guide',
    excerpt:
      "Ready to learn the world's second most spoken native language? Here is your step-by-step roadmap to start speaking from week one with core pronunciation rules.",
    tag: 'Study Methods',
    readTime: '7 min read',
    date: 'Oct 24, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'Linguistics Lead',
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'mock-3',
    slug: 'how-to-practise-english-speaking-online',
    title: 'How to Practise English Speaking Online',
    excerpt:
      'Want to speak fluent, professional English from the comfort of your home? Discover the best conversation exchange methods, daily habits, and speaking drills.',
    tag: 'English Learning',
    readTime: '6 min read',
    date: 'Oct 22, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'ESL Trainer',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'mock-4',
    slug: 'how-conversation-practice-helps-you-learn-german',
    title: 'How Conversation Practice Helps You Learn German',
    excerpt:
      'Tired of memorizing grammar charts without being able to speak? Discover why conversational immersion is the fastest path to overcoming the speaking barrier.',
    tag: 'German Tips',
    readTime: '7 min read',
    date: 'Oct 20, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'Senior German Tutor',
    imageUrl: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'mock-5',
    slug: 'how-to-improve-your-speaking-skills-in-a-new-language',
    title: 'How to Improve Your Speaking Skills in a New Language',
    excerpt:
      'Stuck understanding everything in your head but freezing when it is time to speak? Here are 7 evidence-based techniques to build automatic spoken fluency.',
    tag: 'Study Methods',
    readTime: '7 min read',
    date: 'Oct 18, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'Language Coach',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'mock-6',
    slug: 'german-a1-vs-a2-whats-the-difference',
    title: "German A1 vs A2: What's the Difference?",
    excerpt:
      'A clear and simple comparison of levels based on official CEFR criteria, with examples of vocabulary, sentence structure, and real conversations.',
    tag: 'German Tips',
    readTime: '6 min read',
    date: 'Oct 16, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'Goethe Certified Instructor',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'mock-7',
    slug: 'german-a1-for-beginners-what-you-will-learn',
    title: 'German A1 for Beginners: What You Will Learn',
    excerpt:
      'Stepping into German for the first time? Here is the complete blueprint for the German A1 level: key vocabulary, core grammar, and timelines.',
    tag: 'German Tips',
    readTime: '8 min read',
    date: 'Oct 14, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'German Faculty',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
  },
  {
    _id: 'mock-8',
    slug: 'what-is-cefr',
    title: 'What Is CEFR? A Complete Guide to Language Levels',
    excerpt:
      'The Common European Framework of Reference for Languages (CEFR) is the global gold standard for measuring language proficiency from beginner (A1) to mastery (C2).',
    tag: 'Study Methods',
    readTime: '7 min read',
    date: 'Oct 12, 2026',
    author: 'BhashaSchool Academic Team',
    authorRole: 'Head of Assessment',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
  },
];

const FALLBACK_IMAGES: Record<string, string> = {
  'how-to-understand-your-cefr-language-level': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop',
  'spanish-for-beginners-a-practical-learning-guide': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop',
  'how-to-practise-english-speaking-online': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
  'how-conversation-practice-helps-you-learn-german': 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=800&auto=format&fit=crop',
  'how-to-improve-your-speaking-skills-in-a-new-language': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
  'german-a1-vs-a2-whats-the-difference': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
  'german-a1-for-beginners-what-you-will-learn': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
  'what-is-cefr': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
};

const formatDate = (value?: string) => {
  if (!value) return 'Oct 2026';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Oct 2026';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const toCard = (b: ApiBlog): BlogCard => ({
  _id: b._id,
  slug: b.slug,
  title: b.title,
  excerpt: b.excerpt,
  imageUrl: b.imageUrl?.trim() || FALLBACK_IMAGES[b.slug] || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
  tag: b.tag || b.category || 'Study Methods',
  tagColor: b.tagColor,
  author: b.author || 'BhashaSchool Academic Team',
  authorRole: b.authorRole || 'Linguistics Lead',
  date: formatDate(b.createdAt),
  readTime: b.readTime || '7 min read',
  isFeatured: Boolean(b.isFeatured || b.slug === 'how-to-understand-your-cefr-language-level'),
});

function getBadgeStyle(tag: string) {
  const lower = (tag || '').toLowerCase();
  if (lower.includes('study') || lower.includes('method') || lower.includes('cefr')) {
    return 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]';
  }
  if (lower.includes('english')) {
    return 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]';
  }
  if (lower.includes('german')) {
    return 'bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]';
  }
  return 'bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]';
}

function getCategoryIcon(tag: string) {
  const lower = (tag || '').toLowerCase();
  if (lower.includes('german')) return { emoji: '🇩🇪' };
  if (lower.includes('english')) return { icon: Headphones, color: 'text-amber-600' };
  if (lower.includes('study') || lower.includes('method') || lower.includes('cefr')) {
    return { icon: BookOpen, color: 'text-blue-600' };
  }
  return { icon: Sparkles, color: 'text-amber-500' };
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Fetch blogs dynamically from database, fallback to mock data
  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiBlog[]>('/blogs');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setBlogs(res.data.map(toCard));
      } else {
        setBlogs(DEFAULT_MOCK_BLOGS);
      }
    } catch (err) {
      console.warn('Using default articles for blog:', err);
      setBlogs(DEFAULT_MOCK_BLOGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Preset categories matching the design mockup tabs
  const categoriesList = useMemo(() => {
    return ['All', 'Study Methods', 'English Learning', 'German Tips'];
  }, []);

  // Featured Guide
  const featured = useMemo(() => {
    if (blogs.length === 0) return null;
    return blogs.find((b) => b.isFeatured || b.slug === 'how-to-understand-your-cefr-language-level') || blogs[0];
  }, [blogs]);

  // Regular articles excluding featured
  const regularArticles = useMemo(() => {
    if (!featured) return blogs;
    return blogs.filter((b) => b._id !== featured._id && b.slug !== featured.slug);
  }, [blogs, featured]);

  // Dynamic search and category filtering
  const filteredArticles = useMemo(() => {
    return regularArticles.filter((article) => {
      const matchesCategory =
        activeCategory === 'All' ||
        article.tag.toLowerCase().includes(activeCategory.toLowerCase());
      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term ||
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        article.tag.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [regularArticles, activeCategory, search]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1B2533] pb-20 selection:bg-amber-100 selection:text-amber-900 w-full overflow-x-hidden font-[Plus_Jakarta_Sans]">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: "Insights for Language Learners"
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-16 border-b border-[rgba(32,37,42,0.06)] bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FAF8F5]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Subtitle & Search */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-5 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>BHASHASCHOOL JOURNAL &amp; GUIDES</span>
                <span className="text-amber-400 font-bold">›</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-gray-900 tracking-tight leading-[1.12]">
                Insights for <br />
                <span className="text-[#3048D4]">Language</span> Learners
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed font-medium">
                Expert guides, CEFR exam strategies, grammar breakdowns, and cultural blueprints
                to help you speak German and English with genuine confidence.
              </p>

              {/* Search Pill Input with Orange Circle Submit Button */}
              <div className="pt-2">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="relative max-w-md flex items-center bg-white rounded-full border border-gray-200/90 shadow-2xs focus-within:border-[#EA580C] focus-within:ring-2 focus-within:ring-amber-200/50 transition-all p-1"
                >
                  <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles by topic, keyword, CEFR..."
                    className="w-full px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EA580C] hover:bg-[#C2410C] active:scale-95 text-white flex items-center justify-center shrink-0 transition-transform shadow-xs mr-0.5 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Prominently Sized Landmarks Artwork */}
            <div className="lg:col-span-7 xl:col-span-7 relative flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[680px] xl:max-w-[760px] flex items-center justify-center lg:justify-end">
                <img
                  src="/blog-hero-landmarks.png"
                  alt="Big Ben, Brandenburg Gate and Eiffel Tower - Learn Explore Grow Globally"
                  className="w-full h-auto object-contain select-none scale-100 sm:scale-105 lg:scale-110 origin-center lg:origin-right hover:scale-[1.12] transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT AREA
      ────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {loading ? (
          <div className="space-y-10 py-6">
            <div className="h-6 w-36 bg-gray-200/80 rounded-md animate-pulse" />
            <div className="h-64 sm:h-72 w-full bg-white border border-gray-200/80 rounded-3xl animate-pulse p-8 flex flex-col justify-center gap-4">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-8 w-2/3 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-white border border-gray-200/80 rounded-2xl animate-pulse p-4 space-y-4">
                  <div className="h-40 bg-gray-200 rounded-xl" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-5 w-4/5 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* ─────────────────────────────────────────────────────────────
                2A. FEATURED GUIDE
            ────────────────────────────────────────────────────────────── */}
            {featured && (
              <section className="mb-12">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#EA580C] mb-3.5">
                  <Star className="w-3.5 h-3.5 fill-[#EA580C] text-[#EA580C]" />
                  <span>FEATURED GUIDE</span>
                </div>

                <Link href={`/blog/${featured.slug}`} className="block group">
                  <div className="bg-white rounded-[28px] border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      
                      {/* Left Side: Dark Academic Graphic Card */}
                      <div className="lg:col-span-5 relative bg-[#0B172E] min-h-[220px] lg:min-h-[290px] overflow-hidden flex flex-col justify-between p-6 sm:p-8">
                        {/* Brain Squircle Icon & Watermark */}
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shadow-xs">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                            OFFICIAL GUIDE
                          </span>
                        </div>

                        {/* Title & Stacks */}
                        <div className="relative z-10 my-auto text-left py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🧠</span>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                              CEFR ACADEMIC GUIDE
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                            Language Benchmark &amp; Assessment
                          </h3>
                        </div>

                        <div className="relative z-10 flex items-center gap-2 text-white/60 text-xs font-medium">
                          <span>Council of Europe Framework</span>
                        </div>

                        {/* Background glowing decorations */}
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
                      </div>

                      {/* Right Side: Content */}
                      <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span
                              className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md ${getBadgeStyle(
                                featured.tag,
                              )}`}
                            >
                              {featured.tag}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                              {featured.readTime}
                            </span>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-400 font-medium">
                              {featured.date}
                            </span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 group-hover:text-[#EA580C] transition-colors leading-snug mb-3">
                            {featured.title}
                          </h2>

                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-6 font-medium">
                            {featured.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                              BS
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900">{featured.author}</p>
                              <p className="text-[11px] text-gray-400 font-medium">
                                {featured.authorRole}
                              </p>
                            </div>
                          </div>

                          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#EA580C] group-hover:gap-2.5 transition-all">
                            Read Full Guide <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* ─────────────────────────────────────────────────────────────
                2B. CATEGORY FILTER PILLS
            ────────────────────────────────────────────────────────────── */}
            <section className="mb-8">
              <div className="flex flex-wrap items-center gap-2.5 pb-1">
                {categoriesList.map((catName) => {
                  const isActive = activeCategory === catName;
                  const iconInfo = catName === 'All' ? null : getCategoryIcon(catName);

                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => setActiveCategory(catName)}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#0B172E] text-white shadow-xs'
                          : 'bg-white border border-gray-200/90 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      {iconInfo?.emoji ? (
                        <span className="text-sm">{iconInfo.emoji}</span>
                      ) : iconInfo?.icon ? (
                        <iconInfo.icon
                          className={`w-3.5 h-3.5 ${isActive ? 'text-white' : iconInfo.color}`}
                        />
                      ) : null}
                      <span>{catName}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ─────────────────────────────────────────────────────────────
                2C. ARTICLES GRID
            ────────────────────────────────────────────────────────────── */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/90 p-8 shadow-xs my-8">
                <SearchX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-gray-800 mb-1">
                  No matching articles found
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                  Try adjusting your search terms or select another category above.
                </p>
                <button
                  onClick={() => {
                    setSearch('');
                    setActiveCategory('All');
                  }}
                  className="text-xs font-bold text-[#EA580C] hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredArticles.map((article) => (
                  <Link
                    key={article._id || article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-[24px] border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Card Thumbnail */}
                      <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${getBadgeStyle(
                              article.tag,
                            )}`}
                          >
                            {article.tag}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400">
                            {article.readTime}
                          </span>
                        </div>

                        <h3 className="text-base font-black text-gray-900 group-hover:text-[#EA580C] transition-colors line-clamp-2 leading-snug mb-2">
                          {article.title}
                        </h3>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Author & Arrow Footer */}
                    <div className="px-5 sm:px-6 pb-5 pt-3.5 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-[10px] font-black">
                          BS
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-gray-800 line-clamp-1">
                            {article.author}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {article.date}
                          </p>
                        </div>
                      </div>

                      <div className="w-7 h-7 rounded-full bg-[#FFF7ED] text-[#EA580C] group-hover:bg-[#EA580C] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Right Bottom Whimsical Illustration Card (Matching the design mockup beside Card 7) */}
                {filteredArticles.length % 3 !== 0 && (
                  <div className="hidden lg:flex lg:col-span-2 bg-[#F9F7F3] rounded-[24px] border border-gray-200/70 p-6 flex-col justify-between relative overflow-hidden select-none">
                    {/* Top Right Whimsical Text & Flight Path */}
                    <div className="self-end text-right z-10">
                      <span className="block font-serif italic font-black text-[#1E75C8] text-sm tracking-tight leading-snug">
                        Different Languages
                      </span>
                      <span className="block font-serif italic font-black text-[#1E75C8] text-sm tracking-tight leading-snug">
                        Brighter Opportunities
                      </span>
                      <svg
                        className="w-24 h-8 overflow-visible mt-1 ml-auto text-rose-500"
                        viewBox="0 0 100 35"
                        fill="none"
                      >
                        <path
                          d="M10 28 C 35 32, 60 25, 80 10"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeDasharray="3 3"
                        />
                        <path d="M80 10 L92 4 L86 15 L83 11 Z" fill="currentColor" />
                      </svg>
                    </div>

                    {/* Bottom Landmark Line-Art Silhouette */}
                    <div className="relative mt-4 flex items-end justify-between text-gray-400/80 px-2">
                      <svg className="w-full h-24" viewBox="0 0 400 100" fill="none" stroke="currentColor" strokeWidth="1.2">
                        {/* Big Ben Silhouette */}
                        <path d="M40 95 L40 40 L50 25 L55 25 L65 40 L65 95 Z" strokeDasharray="2 2" />
                        <circle cx="52.5" cy="50" r="5" stroke="currentColor" />
                        {/* Brandenburg Gate Silhouette */}
                        <path d="M120 95 L120 50 L180 50 L180 95 M135 50 L135 95 M150 50 L150 95 M165 50 L165 95" />
                        <path d="M140 40 L160 40 L150 30 Z" />
                        {/* Eiffel Tower Silhouette */}
                        <path d="M230 95 L255 20 L280 95 M245 60 L265 60 M240 80 L270 80" />
                        {/* Colosseum Arches */}
                        <path d="M320 95 C 320 60, 390 60, 390 95 M335 95 C 335 75, 375 75, 375 95" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ─────────────────────────────────────────────────────────────
            3. NEWSLETTER BANNER: "Weekly CEFR exam tips & speaking drills"
        ────────────────────────────────────────────────────────────── */}
        <section className="bg-[#0B172E] rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-blue-950/80 mt-16 text-white">
          
          <div className="absolute top-4 left-6 text-amber-400/20 pointer-events-none">
            <Send className="w-10 h-10 rotate-[20deg]" />
          </div>
          <div className="absolute bottom-4 right-8 text-amber-400/20 pointer-events-none">
            <Send className="w-12 h-12 rotate-[-40deg]" />
          </div>
          <div className="absolute -top-16 -left-16 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#F59E0B] text-[11px] font-black uppercase tracking-widest mb-3.5">
                <Send className="w-3.5 h-3.5" />
                <span>STAY AHEAD IN LANGUAGES</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-white leading-tight mb-3 tracking-tight">
                Weekly CEFR exam tips <br />
                <span className="text-[#F59E0B] font-black">&amp; speaking drills</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg font-medium">
                Join 6,200+ students who get our weekly digest on Goethe exam questions,
                grammar blueprints, and conversation habits.
              </p>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="inline-flex items-center gap-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl px-5 py-4 text-emerald-300 text-xs font-bold shadow-sm w-full justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>You&apos;re subscribed! Watch your inbox for weekly fluency tips.</span>
                </div>
              ) : (
                <div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!email) return;
                      try {
                        await api.post('/masterclasses/subscribe', { email, source: 'blog' });
                        setSubscribed(true);
                      } catch (err: any) {
                        toast.error(err?.response?.data?.message || 'Subscription failed');
                      }
                    }}
                    className="flex flex-col sm:flex-row items-center bg-white rounded-2xl sm:rounded-full p-1.5 shadow-md gap-2 sm:gap-0"
                  >
                    <div className="relative flex-1 w-full flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 ml-3.5 flex-shrink-0" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-3 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-[#F59E0B] hover:bg-[#D97706] active:scale-95 text-gray-900 font-extrabold text-xs sm:text-sm transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      Subscribe Free
                    </button>
                  </form>
                  <p className="text-[11px] text-gray-400 mt-2.5 font-medium text-center sm:text-left pl-2">
                    Zero spam. Unsubscribe anytime with 1 click.
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
