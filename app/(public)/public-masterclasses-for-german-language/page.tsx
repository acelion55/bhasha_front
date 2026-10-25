'use client';

import React from 'react';
import Link from 'next/link';
import MasterclassRegistration from '@/components/MasterclassRegistration';
import { ArrowLeft, BookOpen, Briefcase, Check, Globe2, GraduationCap, Handshake, Mic, Target, Trophy, Video } from 'lucide-react';

export default function PublicMasterclassesPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] items-center">
          <div className="space-y-[3vh]">
            <h1 className="text-[4rem] md:text-[3.5rem] font-bold text-[var(--text-black)] leading-tight">
              Free Live Masterclasses
            </h1>
            <p className="text-[1.8rem] md:text-[1.6rem] text-[var(--text-black-soft)]">
              Learn from industry experts and language professionals in free, interactive live sessions. Perfect for anyone curious about learning, career growth, and personal development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#masterclasses" className="px-8 py-3 bg-[var(--starbucks-green)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]">
                Register Now (Free)
              </a>
              <a href="#masterclasses" className="px-8 py-3 border-2 border-[var(--starbucks-green)] text-[var(--starbucks-green)] rounded-lg font-bold hover:bg-[var(--green-light)] transition-colors text-[1.4rem]">
                View Schedule
              </a>
            </div>
          </div>
          <div className="bg-[var(--green-light)] rounded-lg p-8 h-[400px] flex items-center justify-center">
            <img src="/course-graphics/masterclasses.svg" alt="Masterclasses" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Upcoming Masterclasses */}
      <section id="masterclasses" className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Upcoming Masterclasses</h2>
        <MasterclassRegistration />
      </section>

      {/* Masterclass Categories */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-white rounded-lg my-[4vh]">
        <div className="flex justify-between items-center mb-[4vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)]">Masterclass Categories</h2>
          <Link href="/features" className="text-[1.4rem] text-[var(--starbucks-green)] font-bold hover:underline inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Back to Courses</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[var(--green-light)] to-emerald-50 rounded-lg p-6 border-2 border-[var(--starbucks-green)]">
            <h3 className="flex items-center gap-2 text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4"><Mic className="w-5 h-5" /> Language Learning</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> German conversation techniques</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> English speaking confidence</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Pronunciation improvement</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Accent reduction</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg p-6 border-2 border-blue-300">
            <h3 className="flex items-center gap-2 text-[1.8rem] font-bold text-blue-600 mb-4"><BookOpen className="w-5 h-5" /> Exam Preparation</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> IELTS/TOEFL strategies</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> GMAT/GRE tips</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> German B1/B2 exam</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Mock test analysis</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-50 rounded-lg p-6 border-2 border-purple-300">
            <h3 className="flex items-center gap-2 text-[1.8rem] font-bold text-purple-600 mb-4"><Briefcase className="w-5 h-5" /> Career Development</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Business communication</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Interview preparation</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Salary negotiation</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> International jobs</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-yellow-50 rounded-lg p-6 border-2 border-orange-300">
            <h3 className="flex items-center gap-2 text-[1.8rem] font-bold text-orange-600 mb-4"><Target className="w-5 h-5" /> Personal Development</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Leadership skills</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Presentation mastery</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Confidence building</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Public speaking</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-teal-100 to-emerald-50 rounded-lg p-6 border-2 border-teal-300">
            <h3 className="flex items-center gap-2 text-[1.8rem] font-bold text-teal-600 mb-4"><Globe2 className="w-5 h-5" /> Culture &amp; Travel</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Living abroad</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Cultural insights</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Travel German/English</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Expat experiences</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-rose-50 rounded-lg p-6 border-2 border-red-300">
            <h3 className="flex items-center gap-2 text-[1.8rem] font-bold text-red-600 mb-4"><GraduationCap className="w-5 h-5" /> Education &amp; Admissions</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> University selection</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Visa interviews</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Scholarship tips</li>
              <li className="flex items-start gap-2 text-[1.4rem] text-[var(--text-black-soft)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Study abroad</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Attend */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Why Attend Our Masterclasses?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">100%</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Completely Free</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">No registration fees, no hidden charges. Learn from world-class experts without spending a rupee.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Video className="w-8 h-8 mt-1 flex-shrink-0 text-[var(--starbucks-green)]" />
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Recordings Available</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Miss a session? All masterclasses are recorded and available for registered users.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Trophy className="w-8 h-8 mt-1 flex-shrink-0 text-[var(--starbucks-green)]" />
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Expert Speakers</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn from industry leaders, certified trainers, and professionals with decades of experience.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <Handshake className="w-8 h-8 mt-1 flex-shrink-0 text-[var(--starbucks-green)]" />
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Network & Connect</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Meet like-minded learners from across India and around the world. Build your professional network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-[var(--starbucks-green)] text-white rounded-lg my-[4vh]">
        <div className="text-center space-y-[3vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold">Join Our Next Masterclass</h2>
          <p className="text-[1.6rem] max-w-2xl mx-auto">50+ masterclasses every month on languages, career, and personal development. Completely free for all learners in India.</p>
          <Link href="/features" className="inline-block px-8 py-4 bg-white text-[var(--starbucks-green)] rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]">
            Back to Courses
          </Link>
        </div>
      </section>
    </div>
  );
}
