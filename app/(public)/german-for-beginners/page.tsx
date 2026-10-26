import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BarChart3, Check, Target, Timer } from 'lucide-react';
import { getMergedKeywords } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'German for Beginners Online | Learn German from Scratch in India | BhashaSchool',
  description: 'Master German language from beginner level with live online classes in India. Expert trainers, interactive lessons, and certification. Start your German journey today!',
  keywords: getMergedKeywords([
    'German for beginners',
    'learn German online India',
    'German classes for beginners',
    'German language course India',
    'beginner German lessons online',
  ]),
  openGraph: {
    title: 'German for Beginners - Online German Classes in India',
    description: 'Learn German from scratch with certified trainers. Live interactive classes designed for Indian learners. Join BhashaSchool today!',
    url: 'https://bhashaschool.com/courses/german-beginners',
    type: 'website',
  },
};

export default function GermanBeginnersPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] items-center">
          <div className="space-y-[3vh]">
            <h1 className="text-[4rem] md:text-[3.5rem] font-bold text-[var(--text-black)] leading-tight">
              German for Beginners
            </h1>
            <p className="text-[1.8rem] md:text-[1.6rem] text-[var(--text-black-soft)]">
              Start your German learning journey from scratch with expert trainers. Perfect for beginners in India with zero prior experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-[var(--starbucks-green)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]">
                Enroll Now
              </button>
              <button className="px-8 py-3 border-2 border-[var(--starbucks-green)] text-[var(--starbucks-green)] rounded-lg font-bold hover:bg-[var(--green-light)] transition-colors text-[1.4rem]">
                Schedule Demo
              </button>
            </div>
          </div>
          <div className="bg-[var(--green-light)] rounded-lg p-8 h-[400px] flex items-center justify-center">
            <img src="/course-graphics/german-beginners.svg" alt="German for Beginners" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[var(--ceramic)] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-3">Basic Vocabulary</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Learn essential German words and phrases for daily conversations. Build a strong foundation with 500+ beginner vocabulary words.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[var(--ceramic)] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-3">Grammar Basics</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Master fundamental German grammar including articles, nouns, verbs, and sentence structure with interactive exercises.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[var(--ceramic)] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-3">Conversational Skills</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Develop speaking and listening skills through real-world scenarios and live practice sessions with certified instructors.</p>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Course Structure</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">1</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Level A1 - Complete Beginners</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">8 weeks of intensive training covering basic phrases, greetings, introductions, and simple conversations.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">2</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Interactive Live Classes</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">3 sessions per week with experienced German trainers. Small batch sizes for personalized attention.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">3</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">AI Practice Platform</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Unlimited AI-powered practice exercises and pronunciation drills. Learn at your own pace anytime, anywhere in India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* German Learning Path */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-gradient-to-r from-[var(--starbucks-green)] to-emerald-600 text-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold mb-[4vh]">How the Full German Path Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vh]">
          <div className="space-y-[2vh]">
            <div>
              <h3 className="text-[1.8rem] font-bold text-emerald-100">A1 Level</h3>
              <p className="text-[1.4rem] mt-2 text-emerald-50">Completed in about <strong>30 days</strong>. Master basic vocabulary, greetings, and introductions.</p>
            </div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-emerald-100">A2 Level</h3>
              <p className="text-[1.4rem] mt-2 text-emerald-50">Takes about <strong>40 days</strong>. Build on A1 with everyday conversations and expanded vocabulary.</p>
            </div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-emerald-100">B1 Level</h3>
              <p className="text-[1.4rem] mt-2 text-emerald-50">Takes about <strong>50 days</strong> of training, plus <strong>10 days</strong> of exam preparation for B1 Telc or Goethe certification.</p>
            </div>
          </div>
          <div className="space-y-[2vh] pt-[2vh]">
            <div className="bg-white/10 backdrop-blur-sm border border-emerald-200/30 rounded-lg p-4">
              <p className="flex items-center gap-2 text-[1.4rem] font-bold text-white mb-2"><BarChart3 className="w-4 h-4" /> Intermediate Path (A1–B1):</p>
              <p className="text-[1.6rem] font-bold text-yellow-200">Roughly 150 days</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-emerald-200/30 rounded-lg p-4">
              <p className="flex items-center gap-2 text-[1.4rem] font-bold text-white mb-2"><Target className="w-4 h-4" /> B2 Certification:</p>
              <p className="text-[1.4rem] text-emerald-50">Taught over 2 months in two parts — <strong>B2.1</strong> and <strong>B2.2</strong></p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-emerald-200/30 rounded-lg p-4">
              <p className="flex items-center gap-2 text-[1.4rem] font-bold text-white mb-2"><Timer className="w-4 h-4" /> Class Duration:</p>
              <p className="text-[1.4rem] text-emerald-50"><strong>Baustein classes:</strong> 1 hour | <strong>Other classes:</strong> 1:30 hours</p>
              <p className="text-[1.4rem] text-emerald-50 mt-2"><strong>Schedule:</strong> Monday to Friday</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Why Choose BhashaSchool?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <Check className="w-5 h-5 mt-1 flex-shrink-0 text-[var(--starbucks-green)]" />
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Certified Trainers from Germany</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn from native German speakers with international teaching credentials.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Check className="w-5 h-5 mt-1 flex-shrink-0 text-[var(--starbucks-green)]" />
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Affordable Pricing for India</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Flexible payment plans designed for Indian learners. EMI options available.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Check className="w-5 h-5 mt-1 flex-shrink-0 text-[var(--starbucks-green)]" />
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">100% Online & Flexible</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn from anywhere in India. Recording of all classes available for revision.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Check className="w-5 h-5 mt-1 flex-shrink-0 text-[var(--starbucks-green)]" />
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Certificate of Completion</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Internationally recognized certificate upon course completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-[var(--starbucks-green)] text-white rounded-lg my-[4vh]">
        <div className="text-center space-y-[3vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold">Ready to Start Learning German?</h2>
          <p className="text-[1.6rem] max-w-2xl mx-auto">Join thousands of Indian learners who have started their German language journey with BhashaSchool.</p>
          <Link href="/courses" className="inline-block px-8 py-4 bg-white text-[var(--starbucks-green)] rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]">
            View Pricing & Enroll
          </Link>
        </div>
      </section>
    </div>
  );
}
