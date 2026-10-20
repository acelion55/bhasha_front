'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  BookOpen,
  IndianRupee,
  Clock,
  CalendarDays,
  Award,
  FileText,
  MapPin,
  Globe2,
  GraduationCap,
} from 'lucide-react';
import { api } from '@/lib/api';

interface Course {
  _id: string;
  title: string;
  language: 'German' | 'English';
  level?: string;
  description?: string;
  price: number;
  currency?: string;
  billingPeriod?: 'one-time' | 'monthly';
  feeNote?: string;
  durationDays?: number;
  durationLabel?: string;
  classDuration?: string;
  schedule?: string;
  features?: string[];
  examPrep?: string;
  certificate?: string;
  order?: number;
}

const germanNotes = [
  {
    icon: FileText,
    title: 'PDF Learning Material',
    desc: 'All learning material is shared with students in PDF form.',
  },
  {
    icon: MapPin,
    title: 'Offline Practice in Agra',
    desc: 'After 2 weeks, we conduct offline classes in a café, hotel or park in Agra.',
  },
  {
    icon: GraduationCap,
    title: 'Profile Stays Active',
    desc: "A learner's profile remains active for as long as they want to stay on it for speaking.",
  },
  {
    icon: Award,
    title: 'Certificates',
    desc: 'A certificate is provided after completing B1 or B2.',
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<Course[]>('/courses/public');
        if (active) setCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        if (active) setError(err?.response?.data?.message || 'Failed to load courses');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const german = courses.filter((c) => c.language === 'German');
  const english = courses.filter((c) => c.language === 'English');

  const renderCard = (course: Course, accent: 'emerald' | 'amber') => {
    const isMonthly = course.billingPeriod === 'monthly';
    const accentClasses =
      accent === 'emerald'
        ? 'bg-[var(--green-light)] text-[var(--starbucks-green)] border-[var(--green-accent)]'
        : 'bg-amber-100 text-amber-700 border-amber-300';
    return (
      <div
        key={course._id}
        className="content-card bg-white border border-[var(--ceramic)] shadow-md flex flex-col"
      >
        <div className="flex items-start justify-between gap-[1vw] mb-[2vh]">
          <div>
            <h3 className="display-text text-[3.2rem] text-[var(--text-black)] leading-tight">
              {course.title}
            </h3>
            {course.level && course.level !== course.title && (
              <span className="inline-block mt-[1vh] text-[1.3rem] font-bold px-[1.2vw] py-[0.4vh] rounded-[6px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black-soft)]">
                {course.level}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-baseline justify-end gap-0.5 text-[var(--starbucks-green)]">
              <IndianRupee className="w-5 h-5" />
              <span className="display-text text-[3.2rem] leading-none">
                {(course.price ?? 0).toLocaleString('en-IN')}
              </span>
              {isMonthly && (
                <span className="text-[1.4rem] font-bold text-[var(--text-black-soft)]">/mo</span>
              )}
            </div>
            <p className="text-[1.2rem] font-bold text-[var(--text-black-soft)] mt-[0.5vh]">
              {isMonthly ? 'Billed monthly' : 'One-time fee'}
            </p>
          </div>
        </div>

        {course.description && (
          <p className="body-text text-[var(--text-black-soft)] leading-relaxed mb-[3vh]">
            {course.description}
          </p>
        )}

        <div className="flex flex-wrap gap-[1vw] mb-[3vh]">
          {course.durationLabel && (
            <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-bold px-[1.2vw] py-[0.5vh] rounded-[8px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black-soft)]">
              <CalendarDays className="w-4 h-4 text-[var(--starbucks-green)]" />
              {course.durationLabel}
            </span>
          )}
          {course.classDuration && (
            <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-bold px-[1.2vw] py-[0.5vh] rounded-[8px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black-soft)]">
              <Clock className="w-4 h-4 text-[var(--starbucks-green)]" />
              {course.classDuration}
            </span>
          )}
          {course.schedule && (
            <span className="inline-flex items-center gap-1.5 text-[1.3rem] font-bold px-[1.2vw] py-[0.5vh] rounded-[8px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black-soft)]">
              <BookOpen className="w-4 h-4 text-[var(--starbucks-green)]" />
              {course.schedule}
            </span>
          )}
        </div>

        {course.features && course.features.length > 0 && (
          <ul className="space-y-[1.2vh] mb-[3vh]">
            {course.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-[1vw] body-text text-[var(--text-black-soft)] font-medium"
              >
                <CheckCircle className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {(course.examPrep || course.certificate || course.feeNote) && (
          <div className="space-y-[0.8vh] mb-[3vh] text-[1.3rem] font-semibold text-[var(--text-black-soft)] bg-[var(--neutral-warm)] border border-[var(--ceramic)] rounded-[10px] p-[1.2vw]">
            {course.feeNote && (
              <p className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-[var(--starbucks-green)]" /> {course.feeNote}
              </p>
            )}
            {course.examPrep && (
              <p className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[var(--starbucks-green)]" /> {course.examPrep}
              </p>
            )}
            {course.certificate && (
              <p className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[var(--starbucks-green)]" /> {course.certificate}
              </p>
            )}
          </div>
        )}

        <Link
          href="/register"
          className={`btn-primary w-full flex justify-center items-center gap-[1vw] py-[2vh] text-[1.8rem] !rounded-[12px] shadow-lg mt-auto ${accentClasses}`}
        >
          Enrol in {course.title} <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--neutral-warm)] pb-[10vh]">
      {/* Hero */}
      <section className="pt-[6vh] pb-[3vh] md:py-[8vh] text-center bg-gradient-to-b from-[var(--white)] to-[var(--neutral-warm)]">
        <div className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw]">
          <div className="inline-flex items-center gap-2 px-[1.5vw] py-[0.5vh] rounded-[50px] bg-[var(--green-light)] border border-[var(--ceramic)] text-[var(--starbucks-green)] text-[1.4rem] font-bold mb-[3vh] shadow-sm">
            <BookOpen className="w-5 h-5" />
            German &amp; English Courses
          </div>
          <h1 className="display-text text-[var(--text-black)] mb-[2vh]">
            Our <span className="text-[var(--starbucks-green)]">Courses &amp; Fees</span>
          </h1>
          <p className="body-text text-[1.8rem] text-[var(--text-black-soft)] max-w-3xl mx-auto leading-relaxed">
            A structured path from your very first lesson to B1/B2 certification. Taught live, Monday to
            Friday, with all material provided in PDF form.
          </p>
        </div>
      </section>

      {loading ? (
        <section className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw] py-[4vh] grid grid-cols-1 md:grid-cols-2 gap-[4vw]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="content-card bg-white border border-[var(--ceramic)] animate-pulse h-[40vh]" />
          ))}
        </section>
      ) : error ? (
        <section className="max-w-[800px] mx-auto px-[5vw] py-[6vh]">
          <div className="content-card bg-white border border-[var(--ceramic)] text-center py-[6vh]">
            <p className="body-text text-[var(--text-black-soft)]">{error}</p>
          </div>
        </section>
      ) : (
        <>
          {/* German structure */}
          <section className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw] py-[4vh]">
            <div className="flex items-center gap-[1.5vw] mb-[4vh]">
              <div className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center h2-text font-bold shadow-sm bg-[var(--green-light)] text-[var(--starbucks-green)] border-2 border-[var(--green-accent)]">
                DE
              </div>
              <div>
                <h2 className="display-text text-[3.6rem] text-[var(--text-black)] leading-none">
                  German Teaching Structure
                </h2>
                <p className="body-text text-[var(--text-black-soft)] mt-[0.8vh]">
                  <b>Baustein</b> — our own designed course — is taught first, before the foreign language
                  book. It is a 15-day syllabus in which you learn the basic structure of the language.
                </p>
              </div>
            </div>

            {german.length === 0 ? (
              <p className="body-text text-[var(--text-black-soft)]">
                German courses will be published soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vw] md:gap-[2vw]">
                {german.map((c) => renderCard(c, 'emerald'))}
              </div>
            )}

            <div className="mt-[5vh] content-card bg-[var(--house-green)] text-white shadow-xl">
              <h3 className="h2-text text-white mb-[2vh]">How the full German path works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[2vw] body-text text-[rgba(255,255,255,0.85)] leading-relaxed">
                <p>
                  <b className="text-white">A1</b> is completed in about 30 days. <b className="text-white">A2</b>{' '}
                  takes about 40 days. <b className="text-white">B1</b> takes about 50 days, plus 10 days of
                  exam preparation for B1 Telc or Goethe. That makes the intermediate German path (A1–B1)
                  roughly <b className="text-white">150 days</b>.
                </p>
                <p>
                  We prepare students directly for the <b className="text-white">B1 and B2 exams</b>. B2 is
                  taught over 2 months in two parts — <b className="text-white">B2.1 and B2.2</b>. Baustein
                  classes are 1 hour; other classes are 1:30 hours, Monday to Friday.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[2vw] mt-[4vh]">
              {germanNotes.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.title}
                    className="content-card bg-white border border-[var(--ceramic)] shadow-sm text-center"
                  >
                    <div className="w-[64px] h-[64px] mx-auto rounded-full bg-[var(--green-light)] text-[var(--starbucks-green)] flex items-center justify-center mb-[2vh]">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h4 className="h2-text text-[var(--text-black)] mb-[1vh]">{n.title}</h4>
                    <p className="body-text text-[var(--text-black-soft)]">{n.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* English structure */}
          <section className="bg-[var(--white)] py-[8vh] mt-[5vh] border-y border-[var(--ceramic)]">
            <div className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw]">
              <div className="flex items-center gap-[1.5vw] mb-[4vh]">
                <div className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center h2-text font-bold shadow-sm bg-amber-100 text-amber-700 border-2 border-amber-300">
                  EN
                </div>
                <div>
                  <h2 className="display-text text-[3.6rem] text-[var(--text-black)] leading-none">
                    English Learning Structure
                  </h2>
                  <p className="body-text text-[var(--text-black-soft)] mt-[0.8vh]">
                    Intermediate English is taught over 4–5 months, with continuous mentor and teacher
                    support until you can express yourself confidently.
                  </p>
                </div>
              </div>

              {english.length === 0 ? (
                <p className="body-text text-[var(--text-black-soft)]">
                  English courses will be published soon.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vw] md:gap-[2vw]">
                  {english.map((c) => renderCard(c, 'amber'))}
                </div>
              )}

              <div className="mt-[4vh] content-card bg-white border border-[var(--ceramic)] shadow-sm">
                <h3 className="h2-text text-[var(--text-black)] mb-[1.5vh] flex items-center gap-2">
                  <Globe2 className="w-6 h-6 text-amber-600" /> What Intermediate English covers
                </h3>
                <p className="body-text text-[var(--text-black-soft)] leading-relaxed">
                  Learners work not only on <b>speaking</b> but also on <b>reading</b>, <b>writing</b> and{' '}
                  <b>listening</b>. Classes run Monday to Friday for 1:30 hours, and every learner is
                  continuously assisted by a mentor and teacher until they can express themselves.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="py-[10vh] text-center bg-[var(--neutral-warm)]">
        <div className="max-w-xl mx-auto px-[5vw] md:px-[2vw]">
          <h2 className="display-text text-[var(--text-black)] mb-[2vh] text-[4rem]">
            Not Sure Where to <span className="text-[var(--starbucks-green)]">Start?</span>
          </h2>
          <p className="body-text text-[var(--text-black-soft)] mb-[5vh] text-[1.8rem]">
            Talk to us and we&apos;ll recommend the right level for you — or join a free public taster
            class first.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[2vw]">
            <Link
              href="/register"
              className="btn-primary flex justify-center items-center gap-[1vw] py-[2vh] px-[4vw] text-[1.8rem] !bg-[var(--gold)] !border-[var(--gold)] !text-[var(--house-green)] shadow-xl"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/classes"
              className="btn-outline flex justify-center items-center gap-[1vw] py-[2vh] px-[4vw] text-[1.8rem]"
            >
              View Free Classes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
