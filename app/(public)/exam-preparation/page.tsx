import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GMAT/TOEFL/IELTS/GRE/German Exam Prep India | BhashaSchool',
  description: 'Expert exam preparation courses for GMAT, TOEFL, IELTS, GRE, German exams in India. Proven strategies, full-length tests, and high score guarantee!',
  keywords: 'GMAT preparation India, TOEFL coaching, IELTS exam prep, GRE coaching India, German B1 B2 exam preparation, exam coaching India',
  openGraph: {
    title: 'Exam Preparation - Master Your Test',
    description: 'Score high on GMAT, TOEFL, IELTS, GRE, and German exams with expert coaching and proven strategies from BhashaSchool.',
    url: 'https://bhashaschool.com/courses/exam-preparation',
    type: 'website',
  },
};

export default function ExamPreparationPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] items-center">
          <div className="space-y-[3vh]">
            <h1 className="text-[4rem] md:text-[3.5rem] font-bold text-[var(--text-black)] leading-tight">
              Ace Your Exams
            </h1>
            <p className="text-[1.8rem] md:text-[1.6rem] text-[var(--text-black-soft)]">
              Comprehensive exam preparation for GMAT, TOEFL, IELTS, GRE, and German language exams. Expert trainers, proven strategies, and guaranteed score improvement.
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
            <img src="/course-graphics/exam-prep.svg" alt="Exam Preparation" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      {/* Our Exams */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Exams We Prepare You For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[var(--starbucks-green)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-4">IELTS</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">International English Language Testing System - Most accepted in UK, Australia, Canada, NZ</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Academic & General Training</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Band 6-9 target scores</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Full-length practice tests</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Speaking mock interviews</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-4">TOEFL</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">Test of English as Foreign Language - Required for US and Canadian universities</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ TOEFL iBT preparation</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Score 90-120 guaranteed</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Time management strategies</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ University application guidance</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-4">GMAT</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">Graduate Management Admission Test - For MBA admissions worldwide</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Quantitative & Verbal</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Score 650-750 target</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Analytical writing</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ MBA school selection</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-4">GRE</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">Graduate Record Examination - For MS and PhD programs in US</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Verbal & Quantitative</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Score 320-340 target</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Analytical writing section</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Graduate school guidance</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-4">German Exams</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">Goethe B1, B2, C1 exams - For German universities and jobs</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ All levels A1-C2</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Comprehensive preparation</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Mock exam practice</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Certification guidance</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-4">More Exams</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">SAT, ACT, CAT, and other competitive exams</p>
            <ul className="space-y-2">
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Customized preparation</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Expert tutoring</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Strategy sessions</li>
              <li className="text-[1.4rem] text-[var(--text-black-soft)]">✓ Performance tracking</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Our Students Succeed */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Why Our Students Score Higher</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">📊</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Data-Driven Approach</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Analytics track your progress on each topic. Personalized study plans focus on weak areas. Average 200+ point improvement.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">🎯</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Proven Strategies</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Learn test-specific strategies for time management, elimination, and pattern recognition proven to increase scores.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">📚</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Unlimited Practice</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Access to 500+ full-length practice tests, all official past papers, and sectional quizzes for unlimited practice.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="text-[2.5rem] text-[var(--starbucks-green)]">👨‍🏫</span>
            <div>
              <h3 className="text-[1.6rem] font-bold text-[var(--text-black)]">Expert Instructors</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Trainers who scored 99 percentile themselves. Average 15 years experience in test prep coaching.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Structure */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Our Preparation Structure</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">1</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Diagnostic Assessment</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Take a full-length mock test to identify strengths, weaknesses, and target score requirements.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">2</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Personalized Study Plan</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Custom roadmap created based on your current level, target score, and available time. Typically 8-16 weeks of preparation.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">3</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Focused Learning</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Live classes covering concepts, strategies, and techniques. Interactive Q&A sessions. Homework assignments with feedback.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">4</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Regular Practice & Testing</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Weekly mock tests, sectional quizzes, and performance tracking. Detailed analysis of every practice test.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start pb-4 border-b border-[var(--ceramic)]">
            <div className="bg-[var(--starbucks-green)] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-[1.6rem] flex-shrink-0">5</div>
            <div>
              <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">Final Push & Confidence</h3>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-2">Final review, strategy reinforcement, and mental preparation. Last 2 weeks focus on scoring in the exam conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">Success Stories from India</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-[var(--ceramic)] rounded-lg p-6">
            <div className="flex gap-2 mb-4">
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
            </div>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">Scored 7.5 in IELTS after 8 weeks! Got admitted to University of Melbourne. BhashaSchool's strategic approach really worked.</p>
            <div className="font-bold text-[1.4rem] text-[var(--starbucks-green)]">Priya Sharma, Bangalore</div>
          </div>
          <div className="border-2 border-[var(--ceramic)] rounded-lg p-6">
            <div className="flex gap-2 mb-4">
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
            </div>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">Improved GMAT from 590 to 740! Got into ISB Hyderabad. The personalized coaching made all the difference.</p>
            <div className="font-bold text-[1.4rem] text-[var(--starbucks-green)]">Rahul Verma, Delhi</div>
          </div>
          <div className="border-2 border-[var(--ceramic)] rounded-lg p-6">
            <div className="flex gap-2 mb-4">
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
              <span className="text-[1.5rem]">⭐</span>
            </div>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4">TOEFL 110/120! Got full scholarship to Stanford. The speaking practice was incredibly helpful!</p>
            <div className="font-bold text-[1.4rem] text-[var(--starbucks-green)]">Anjali Singh, Mumbai</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* CTA */}
      <section className="max-w-7xl mx-auto px-[4vw] md:px-6 py-[8vh] bg-[var(--starbucks-green)] text-white rounded-lg my-[4vh]">
        <div className="text-center space-y-[3vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold">Ready to Ace Your Exam?</h2>
          <p className="text-[1.6rem] max-w-2xl mx-auto">Join 10,000+ Indian students who achieved their target scores with BhashaSchool's expert exam preparation.</p>
          <Link href="/features" className="inline-block px-8 py-4 bg-white text-[var(--starbucks-green)] rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]">
            View Pricing & Enroll
          </Link>
        </div>
      </section>
    </div>
  );
}
