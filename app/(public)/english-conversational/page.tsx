import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'English Conversational Classes Online | Improve Spoken English in India | BhashaSchool',
  description: 'Master conversational English with live online classes in India. Perfect English speaking course for professionals & students. Fluent English in 12 weeks!',
  keywords: 'English conversational classes, spoken English course India, English speaking classes online, improve English speaking, fluent English India',
  openGraph: {
    title: 'English Conversational - Live Online Classes in India',
    description: 'Improve your English speaking skills with certified trainers. Real conversations, confidence building, professional communication skills.',
    url: 'https://bhashaschool.com/courses/english-conversational',
    type: 'website',
  },
};

export default function EnglishConversationalPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] items-center">
          <div className="space-y-[3vh]">
            <h1 className="text-[4rem] md:text-[3.5rem] font-bold text-[var(--text-black)] leading-tight">
              English Conversational Classes
            </h1>
            <p className="text-[1.8rem] md:text-[1.6rem] text-[var(--text-black-soft)]">
              Become fluent in English with practical conversation skills. Perfect for professionals and students across India wanting confident English speaking ability.
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
            <img src="/course-graphics/english-conversational.svg" alt="English Conversational" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Course Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[var(--ceramic)] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-3">Fluent Speaking</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Develop confident, natural English speaking skills through daily practice and real-world conversation scenarios.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[var(--ceramic)] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-3">Professional Communication</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Master business English, presentations, interviews, and professional networking conversations for career growth.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-[var(--ceramic)] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-3">Accent & Pronunciation</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Improve pronunciation, reduce accent, and develop clear articulation for better communication in English.</p>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">What You'll Learn</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">1</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Daily Conversation Practice</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Engage in real conversations covering topics from everyday situations to professional discussions.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">2</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Confidence Building</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Overcome the fear of speaking English. Build confidence through regular practice in a supportive environment.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">3</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Listening & Understanding</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Develop active listening skills and understand various English accents and speaking styles.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">4</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Idioms & Slang</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn natural English idioms, phrasal verbs, and colloquial expressions used by native speakers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Levels */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Available Course Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">Elementary Level</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">For learners with basic English knowledge</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Simple conversations</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Daily routine English</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Basic grammar review</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--starbucks-green)] rounded-lg p-6 bg-gradient-to-br from-[var(--green-light)]">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">Intermediate Level</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">For learners seeking fluency</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Complex conversations</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Professional communication</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Advanced vocabulary</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">Advanced Level</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">For near-native proficiency</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Native-like fluency</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Leadership communication</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Specialized vocabulary</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Why BhashaSchool is Best for English in India</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Native English Speakers</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn from fluent native English trainers with years of teaching experience in India.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Affordable for All Indians</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Competitive pricing with EMI options available. Quality education without breaking the bank.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Personalized Learning Path</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Customized lessons based on your learning pace and professional goals.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Recognized Certificate</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Get internationally recognized certificate to boost your resume and career prospects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-[var(--starbucks-green)] text-white rounded-lg my-[4vh]">
        <div className="text-center space-y-[3vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold">Speak English with Confidence</h2>
          <p className="text-[1.6rem] max-w-2xl mx-auto">Join 5000+ students from across India who transformed their English speaking abilities with BhashaSchool.</p>
          <Link href="/features" className="inline-block px-8 py-4 bg-white text-[var(--starbucks-green)] rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]">
            View Pricing & Enroll
          </Link>
        </div>
      </section>
    </div>
  );
}
