'use client';

import React from 'react';
import Link from 'next/link';
import MasterclassRegistration from '@/components/MasterclassRegistration';

export default function PublicMasterclassesPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
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
      <section id="masterclasses" className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Upcoming Masterclasses</h2>
        <MasterclassRegistration />
      </section>

      {/* Masterclass Categories */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-white rounded-lg my-[4vh]">
        <div className="flex justify-between items-center mb-[4vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)]">Masterclass Categories</h2>
          <Link href="/features" className="text-[1.4rem] text-[var(--starbucks-green)] font-bold hover:underline">← Back to Courses</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[var(--green-light)] to-emerald-50 rounded-lg p-6 border-2 border-[var(--starbucks-green)]">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">🗣️ Language Learning</h3>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ German conversation techniques</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ English speaking confidence</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Pronunciation improvement</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Accent reduction</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg p-6 border-2 border-blue-300">
            <h3 className="text-[1.8rem] font-bold text-blue-600 mb-4">📚 Exam Preparation</h3>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ IELTS/TOEFL strategies</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ GMAT/GRE tips</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ German B1/B2 exam</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Mock test analysis</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-50 rounded-lg p-6 border-2 border-purple-300">
            <h3 className="text-[1.8rem] font-bold text-purple-600 mb-4">💼 Career Development</h3>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Business communication</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Interview preparation</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Salary negotiation</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ International jobs</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-yellow-50 rounded-lg p-6 border-2 border-orange-300">
            <h3 className="text-[1.8rem] font-bold text-orange-600 mb-4">🎯 Personal Development</h3>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Leadership skills</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Presentation mastery</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Confidence building</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Public speaking</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-teal-100 to-emerald-50 rounded-lg p-6 border-2 border-teal-300">
            <h3 className="text-[1.8rem] font-bold text-teal-600 mb-4">🌍 Culture & Travel</h3>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Living abroad</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Cultural insights</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Travel German/English</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Expat experiences</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-rose-50 rounded-lg p-6 border-2 border-red-300">
            <h3 className="text-[1.8rem] font-bold text-red-600 mb-4">🎓 Education & Admissions</h3>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ University selection</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Visa interviews</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Scholarship tips</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Study abroad</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Attend */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
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
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">🎬</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Recordings Available</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Miss a session? All masterclasses are recorded and available for registered users.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">🏆</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Expert Speakers</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn from industry leaders, certified trainers, and professionals with decades of experience.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">🤝</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Network & Connect</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Meet like-minded learners from across India and around the world. Build your professional network.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-[var(--starbucks-green)] text-white rounded-lg my-[4vh]">
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
