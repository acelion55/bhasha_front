import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business German Course Online | Corporate German in India | BhashaSchool',
  description: 'Master Business German for professionals in India. Learn corporate communication, negotiations, presentations & professional vocabulary. Boost your career!',
  keywords: 'Business German course, corporate German lessons, professional German India, German for business communication, export import German',
  openGraph: {
    title: 'Business German - Professional Language Course India',
    description: 'Advanced Business German training for professionals. Master negotiations, presentations, and business communication for international career growth.',
    url: 'https://bhashaschool.com/courses/business-german',
    type: 'website',
  },
};

export default function BusinessGermanPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] items-center">
          <div className="space-y-[3vh]">
            <h1 className="text-[4rem] md:text-[3.5rem] font-bold text-[var(--text-black)] leading-tight">
              Business German for Professionals
            </h1>
            <p className="text-[1.8rem] md:text-[1.6rem] text-[var(--text-black-soft)]">
              Master professional German communication. Perfect for Indian professionals in import-export, IT, manufacturing, and international business sectors.
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
            <img src="/course-graphics/business-german.svg" alt="Business German" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Why Business German */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Why Learn Business German in India?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">📊</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Career Advancement</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Germany is India's largest trading partner. Speaking German opens doors to MNC positions with higher salary packages and international exposure.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">💼</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Business Opportunities</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Expand your business network and opportunities with German companies and entrepreneurs for export-import ventures.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">🏢</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Competitive Advantage</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Stand out from competitors in IT, engineering, automotive, and manufacturing sectors where German language is highly valued.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">💰</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Higher Remuneration</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">German speakers in India earn 30-40% more than average professionals. Invest in your future with this valuable skill.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">What You'll Master</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">Professional Communication</h3>
            <ul className="space-y-3">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Business emails & correspondence</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Phone conversations & video calls</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Meeting participation & presentations</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Negotiation strategies</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">Business Vocabulary</h3>
            <ul className="space-y-3">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Industry-specific terminology</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Finance & commerce terms</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Technical vocabulary</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Marketing & sales language</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">Intercultural Skills</h3>
            <ul className="space-y-3">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ German business culture & etiquette</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Cross-cultural communication</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Networking in professional settings</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Business protocol & formalities</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[1.8rem] font-bold text-[var(--starbucks-green)] mb-4">Practical Skills</h3>
            <ul className="space-y-3">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Contract & document review</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Report writing & analysis</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Project management German</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Export-import documentation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Industry-Specific Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[var(--green-light)] rounded-lg p-6 border-2 border-[var(--starbucks-green)]">
            <h3 className="text-[1.6rem] font-bold text-[var(--starbucks-green)] mb-3">IT & Software</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Technical German for software development, project management, and IT consulting firms.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-[var(--ceramic)]">
            <h3 className="text-[1.6rem] font-bold text-[var(--starbucks-green)] mb-3">Manufacturing</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Industrial German for automobile, pharma, and machinery sectors with technical documentation.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-[var(--ceramic)]">
            <h3 className="text-[1.6rem] font-bold text-[var(--starbucks-green)] mb-3">Import-Export</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">Business German for customs, logistics, trade agreements, and international commerce.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-2 border-[var(--ceramic)]">
            <h3 className="text-[1.6rem] font-bold text-[var(--starbucks-green)] mb-3">Finance & HR</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">German for banking, accounting, recruitment, and human resources management.</p>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">12-Week Intensive Program</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">1</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Foundation (Weeks 1-3)</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Review of grammar, business vocabulary fundamentals, and professional communication basics.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">2</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Core Business Skills (Weeks 4-8)</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Meetings, presentations, negotiations, writing professional documents, and industry-specific vocabulary.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">3</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Advanced & Specialization (Weeks 9-12)</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Mock interviews, business simulations, case studies, and specialized industry modules. Final certification exam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose BhashaSchool */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Why BhashaSchool for Business German?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Trainers from German Companies</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn from professionals who worked in German corporations and understand real business practices.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Real-World Case Studies</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Study actual business scenarios and communications from Indian companies trading with Germany.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Mock Interviews & Presentations</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Practice with realistic business scenarios including job interviews and client presentations.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2rem] text-[var(--starbucks-green)]">✓</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Career Support</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Get connected with companies and organizations looking for German-speaking professionals in India.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-[var(--starbucks-green)] text-white rounded-lg my-[4vh]">
        <div className="text-center space-y-[3vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold">Boost Your Career with Business German</h2>
          <p className="text-[1.6rem] max-w-2xl mx-auto">Join 2000+ Indian professionals who advanced their careers by learning Business German with BhashaSchool.</p>
          <Link href="/features" className="inline-block px-8 py-4 bg-white text-[var(--starbucks-green)] rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]">
            View Pricing & Enroll
          </Link>
        </div>
      </section>
    </div>
  );
}
