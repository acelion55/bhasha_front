'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftRight, BookOpen, Check, Ear, ExternalLink, FileText, GraduationCap, MessageCircle, Mic, PenLine, Rocket, Sparkles, Target, Users, Zap } from 'lucide-react';

const documents = [
  {
    title: 'ISO 9001 Certification',
    description: 'Quality management system certification for BhashaSchool.',
    file: encodeURI('/about us/iso_certified_mqa.png'),
  },
  {
    title: 'Udyam Registration',
    description: 'Official MSME (Udyam) registration certificate.',
    file: encodeURI('/about us/udhyam_registered.png'),
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3]">
      {/* Hero Section */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] text-center">
        <div className="space-y-[3vh]">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--green-light)] border border-[var(--ceramic)] text-[var(--starbucks-green)] text-[1.4rem] font-bold mb-[2vh]">
            <BookOpen className="w-5 h-5" />
            About Us
          </div>
          <h1 className="text-[4rem] md:text-[3.5rem] font-bold text-[var(--text-black)] leading-tight">
            Learn. Practice. Progress. <span className="text-[var(--starbucks-green)]">Achieve.</span>
          </h1>
          <p className="text-[1.8rem] md:text-[1.6rem] text-[var(--text-black-soft)] max-w-3xl mx-auto">
            A Structured Language Learning Experience Since 2022
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-white rounded-lg my-[4vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] items-center">
          <div className="space-y-[3vh]">
            <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)]">
              Our Journey Since 2022
            </h2>
            <p className="text-[1.6rem] text-[var(--text-black-soft)] leading-relaxed">
              BhashaSchool has been serving learners since 2022, helping students build strong and practical language skills through structured classes, guided practice, mentoring, and exam preparation.
            </p>
            <p className="text-[1.6rem] text-[var(--text-black-soft)] leading-relaxed">
              We are a <strong>MSME-registered</strong> language education organization with <strong>MQA certification</strong>, committed to providing a systematic and learner-focused approach to language education.
            </p>
            <p className="text-[1.6rem] text-[var(--starbucks-green)] font-bold">
              Our goal is simple: not only to teach a language, but to help learners use it confidently in real communication.
            </p>
          </div>
          <div className="bg-[var(--green-light)] rounded-lg p-8 h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-[5rem] font-bold text-[var(--starbucks-green)] mb-[2vh]">2022</div>
              <p className="text-[1.8rem] font-bold text-[var(--starbucks-green)]">Established</p>
              <p className="text-[1.4rem] text-[var(--text-black-soft)] mt-[1vh]">4+ Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh] text-center">
          What We Believe In
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <div className="w-16 h-16 bg-[var(--green-light)] rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-[var(--starbucks-green)]" />
            </div>
            <h3 className="text-[1.8rem] font-bold text-[var(--text-black)] mb-3">Structured Learning</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">
              A clear pathway from A1 to B2 with well-defined levels, outcomes, and progression metrics.
            </p>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <div className="w-16 h-16 bg-[var(--green-light)] rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[var(--starbucks-green)]" />
            </div>
            <h3 className="text-[1.8rem] font-bold text-[var(--text-black)] mb-3">Community Learning</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">
              Learning happens together — with teachers, mentors, peers, and senior learners supporting each other.
            </p>
          </div>
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <div className="w-16 h-16 bg-[var(--green-light)] rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-[var(--starbucks-green)]" />
            </div>
            <h3 className="text-[1.8rem] font-bold text-[var(--text-black)] mb-3">Practical Skills</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)]">
              From knowing the language to actually using it — real communication is our ultimate goal.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">
          How Our Learning System Works
        </h2>
        <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[4vh] leading-relaxed">
          Our learning model is designed around different language levels, including A1, A2, B1 and B2. Learners are placed into appropriate classrooms according to their level and learning requirements.
        </p>
        <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[4vh] leading-relaxed">
          Each learner receives an individual profile, through which they can access and track their learning journey, including their classes, learning activities, practice opportunities, progress and other relevant information.
        </p>

        {/* Level Progression */}
        <div className="mb-[6vh]">
          <h3 className="text-[2.2rem] font-bold text-[var(--starbucks-green)] mb-[3vh]">
            Learn With Your Level — Practice Beyond Your Level
          </h3>
          <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[3vh]">
            One of the key features of our learning system is <strong>level-to-level practice</strong>.
          </p>
          <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[3vh]">
            Learners do not practice only with students from their own classroom. They also get opportunities to communicate and practice with learners from a senior batch.
          </p>

          {/* Level Connections */}
          <div className="bg-gradient-to-r from-[var(--starbucks-green)] to-emerald-600 text-white rounded-lg p-6 mb-[3vh]">
            <h4 className="text-[1.8rem] font-bold mb-[2vh]">Our Learning Path</h4>
            <div className="space-y-[2vh]">
              <div className="flex items-center gap-4 text-[1.6rem] font-bold">
                <span className="bg-white/20 px-4 py-2 rounded-lg">A1</span>
                <ArrowLeftRight className="w-5 h-5 text-white/80" aria-hidden />
                <span className="bg-white/20 px-4 py-2 rounded-lg">A2</span>
                <ArrowLeftRight className="w-5 h-5 text-white/80" aria-hidden />
                <span className="bg-white/20 px-4 py-2 rounded-lg">B1</span>
                <ArrowLeftRight className="w-5 h-5 text-white/80" aria-hidden />
                <span className="bg-white/20 px-4 py-2 rounded-lg">B2</span>
              </div>
            </div>
          </div>

          <div className="space-y-[2vh] text-[1.5rem]">
            <p className="flex items-start gap-2 text-[var(--text-black-soft)]">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
              <span><strong>A1 learners</strong> can practice selected topics with A2 learners</span>
            </p>
            <p className="flex items-start gap-2 text-[var(--text-black-soft)]">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
              <span><strong>A2 learners</strong> can practice with B1 learners</span>
            </p>
            <p className="flex items-start gap-2 text-[var(--text-black-soft)]">
              <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
              <span><strong>B1 learners</strong> can practice with B2 learners</span>
            </p>
          </div>

          <p className="text-[1.6rem] text-[var(--text-black-soft)] mt-[3vh] leading-relaxed">
            This creates a continuous learning environment where senior learners can support junior learners while simultaneously revising and strengthening their own previously learned language skills.
          </p>
        </div>
      </section>

      {/* Teachers & Mentors */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[6vh] items-center">
          <div className="space-y-[3vh]">
            <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)]">
              Learning With Teachers and Mentors
            </h2>
            <p className="text-[1.6rem] text-[var(--text-black-soft)] leading-relaxed">
              Our learners receive support not only from teachers but also through a <strong>mentor-based learning system</strong>.
            </p>
            <div className="space-y-[2vh]">
              <div className="bg-[var(--green-light)] border-2 border-[var(--starbucks-green)] rounded-lg p-4">
                <h4 className="text-[1.6rem] font-bold text-[var(--starbucks-green)] mb-2">Teachers</h4>
                <p className="text-[1.4rem] text-[var(--text-black-soft)]">
                  Focus on structured teaching, lessons and language development
                </p>
              </div>
              <div className="bg-amber-100 border-2 border-amber-600 rounded-lg p-4">
                <h4 className="text-[1.6rem] font-bold text-amber-800 mb-2">Mentors</h4>
                <p className="text-[1.4rem] text-[var(--text-black-soft)]">
                  Help learners with practice, communication, guidance and maintaining consistency in their learning journey
                </p>
              </div>
            </div>
            <p className="text-[1.6rem] text-[var(--text-black-soft)] leading-relaxed">
              Through their learner profile, students can participate in the learning and practice activities available to them and stay connected with their learning progress.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[var(--green-light)] to-emerald-100 rounded-lg p-8">
            <div className="space-y-[3vh]">
              <div className="text-center">
                <div className="mb-[1vh] flex justify-center"><GraduationCap className="w-16 h-16 text-[var(--starbucks-green)]" /></div>
                <p className="text-[1.6rem] font-bold text-[var(--text-black)]">Expert Teachers</p>
              </div>
              <div className="h-2 bg-[var(--starbucks-green)]"></div>
              <div className="text-center">
                <div className="mb-[1vh] flex justify-center"><Users className="w-16 h-16 text-[var(--starbucks-green)]" /></div>
                <p className="text-[1.6rem] font-bold text-[var(--text-black)]">Dedicated Mentors</p>
              </div>
              <div className="h-2 bg-[var(--starbucks-green)]"></div>
              <div className="text-center">
                <div className="mb-[1vh] flex justify-center"><BookOpen className="w-16 h-16 text-[var(--starbucks-green)]" /></div>
                <p className="text-[1.6rem] font-bold text-[var(--text-black)]">Continuous Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speaking Practice */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">
          Dedicated Speaking Practice
        </h2>
        <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[3vh] leading-relaxed">
          We believe that learning a language is not complete until you can speak and communicate confidently.
        </p>
        <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[4vh] leading-relaxed">
          Therefore, we provide a dedicated speaking environment, particularly for B1 and B2 learners, where students can discuss different topics, communicate with other learners and practice using the language more naturally.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[4vh]">
          <div className="space-y-[2vh]">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-[2vh]">Our Speaking Sessions Focus On:</h3>
            <ul className="space-y-[1.5vh]">
              <li className="flex gap-3 items-start text-[1.5rem]">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
                <span className="text-[var(--text-black-soft)]">Everyday communication</span>
              </li>
              <li className="flex gap-3 items-start text-[1.5rem]">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
                <span className="text-[var(--text-black-soft)]">Discussion and conversation</span>
              </li>
              <li className="flex gap-3 items-start text-[1.5rem]">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
                <span className="text-[var(--text-black-soft)]">Course-related topics</span>
              </li>
              <li className="flex gap-3 items-start text-[1.5rem]">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
                <span className="text-[var(--text-black-soft)]">Vocabulary development</span>
              </li>
              <li className="flex gap-3 items-start text-[1.5rem]">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
                <span className="text-[var(--text-black-soft)]">Fluency and confidence</span>
              </li>
              <li className="flex gap-3 items-start text-[1.5rem]">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
                <span className="text-[var(--text-black-soft)]">Speaking strategies</span>
              </li>
              <li className="flex gap-3 items-start text-[1.5rem]">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" />
                <span className="text-[var(--text-black-soft)]">Real-life communication situations</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 border-2 border-amber-300">
            <h3 className="text-[1.8rem] font-bold text-amber-900 mb-[2vh]">Our Objective</h3>
            <p className="text-[1.6rem] text-amber-800 leading-relaxed font-bold">
              Help learners move from knowing the language to actually using the language.
            </p>
            <div className="mt-[3vh] space-y-[1vh]">
              <p className="flex items-center gap-2 text-[1.5rem] text-amber-700">
                <Target className="w-4 h-4 flex-shrink-0" /> From Theory to Practice
              </p>
              <p className="flex items-center gap-2 text-[1.5rem] text-amber-700">
                <MessageCircle className="w-4 h-4 flex-shrink-0" /> Real Conversations
              </p>
              <p className="flex items-center gap-2 text-[1.5rem] text-amber-700">
                <Sparkles className="w-4 h-4 flex-shrink-0" /> Confident Communication
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Prep */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh]">
          Exam Preparation — Goethe & Telc
        </h2>
        <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[4vh] leading-relaxed">
          For learners who want to take an internationally recognized German language examination, we also provide exam-oriented preparation for Goethe and telc examinations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[4vh]">
          <div className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-[3vh]">Examination Skills</h3>
            <div className="space-y-[1.5vh]">
              <div className="flex gap-3 items-center">
                <BookOpen className="w-5 h-5 text-[var(--starbucks-green)]" />
                <span className="text-[1.5rem] font-bold text-[var(--text-black)]">Reading</span>
              </div>
              <div className="flex gap-3 items-center">
                <Ear className="w-5 h-5 text-[var(--starbucks-green)]" />
                <span className="text-[1.5rem] font-bold text-[var(--text-black)]">Listening</span>
              </div>
              <div className="flex gap-3 items-center">
                <PenLine className="w-5 h-5 text-[var(--starbucks-green)]" />
                <span className="text-[1.5rem] font-bold text-[var(--text-black)]">Writing</span>
              </div>
              <div className="flex gap-3 items-center">
                <Mic className="w-5 h-5 text-[var(--starbucks-green)]" />
                <span className="text-[1.5rem] font-bold text-[var(--text-black)]">Speaking</span>
              </div>
            </div>
          </div>
          <div className="bg-[var(--green-light)] border-2 border-[var(--starbucks-green)] rounded-lg p-6">
            <h3 className="text-[2rem] font-bold text-[var(--starbucks-green)] mb-[3vh]">Our Preparation Focuses On:</h3>
            <ul className="space-y-[1.5vh]">
              <li className="flex items-start gap-2 text-[1.5rem] text-[var(--text-black)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Strengthening language skills</li>
              <li className="flex items-start gap-2 text-[1.5rem] text-[var(--text-black)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Examination formats & task types</li>
              <li className="flex items-start gap-2 text-[1.5rem] text-[var(--text-black)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Test strategies</li>
              <li className="flex items-start gap-2 text-[1.5rem] text-[var(--text-black)]"><Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--starbucks-green)]" /> Time management</li>
            </ul>
          </div>
        </div>

        <p className="text-[1.6rem] text-[var(--text-black-soft)] leading-relaxed">
          Our aim is to prepare learners not only to complete the syllabus, but also to approach their examination with knowledge, practice and confidence.
        </p>
      </section>

      {/* More Than A Classroom */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-white rounded-lg my-[4vh]">
        <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[4vh] text-center">
          More Than a Classroom
        </h2>
        <p className="text-[1.6rem] text-[var(--text-black-soft)] mb-[4vh] text-center leading-relaxed">
          We believe language learning should not be limited to a traditional classroom.
        </p>

        <div className="bg-gradient-to-r from-[var(--starbucks-green)] to-emerald-600 text-white rounded-lg p-8 mb-[4vh]">
          <h3 className="text-[2rem] font-bold mb-[3vh] text-center">Our Learning Model Brings Together:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-center">
              <div className="mb-[1vh] flex justify-center"><GraduationCap className="w-9 h-9" /></div>
              <p className="text-[1.4rem] font-bold">Teacher</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-center">
              <div className="mb-[1vh] flex justify-center"><Users className="w-9 h-9" /></div>
              <p className="text-[1.4rem] font-bold">Mentor</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-center">
              <div className="mb-[1vh] flex justify-center"><BookOpen className="w-9 h-9" /></div>
              <p className="text-[1.4rem] font-bold">Learner</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-center">
              <div className="mb-[1vh] flex justify-center"><Rocket className="w-9 h-9" /></div>
              <p className="text-[1.4rem] font-bold">Senior Learner</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-center">
              <div className="mb-[1vh] flex justify-center"><Mic className="w-9 h-9" /></div>
              <p className="text-[1.4rem] font-bold">Speaking Practice</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-center">
              <div className="mb-[1vh] flex justify-center"><Target className="w-9 h-9" /></div>
              <p className="text-[1.4rem] font-bold">Exam Prep</p>
            </div>
          </div>
        </div>

        <p className="text-[1.6rem] text-[var(--text-black-soft)] text-center leading-relaxed">
          This creates a <strong>connected learning environment</strong> in which learners can continuously learn, practice, communicate and improve.
        </p>
      </section>

      {/* Our Mission */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh]">
        <div className="bg-gradient-to-r from-[var(--starbucks-green)] to-emerald-600 text-white rounded-lg p-8">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold mb-[3vh] text-center">
            Our Mission
          </h2>
          <p className="text-[1.8rem] text-center leading-relaxed mb-[4vh]">
            Our mission is to make language learning <strong>structured, practical and accessible</strong>, while creating an environment where learners can continuously practice with teachers, mentors and fellow learners.
          </p>
          <div className="border-t-2 border-emerald-300 pt-[3vh]">
            <p className="text-[1.6rem] text-center font-bold text-emerald-100">
              Learn your level. Practice with the next level. Strengthen your communication. Prepare for your goal.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications & Registrations */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] bg-white rounded-lg my-[4vh]">
        <div className="text-center mb-[4vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)] mb-[2vh]">
            Certifications & Registrations
          </h2>
          <p className="text-[1.6rem] text-[var(--text-black-soft)] max-w-2xl mx-auto">
            Our official documents are available below for your reference.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.file}
              className="flex flex-col overflow-hidden rounded-lg border border-[var(--ceramic)] bg-[#fdf8f3]"
            >
              <div className="flex items-start gap-3 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--green-light)] text-[var(--starbucks-green)]">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-[1.8rem] font-bold text-[var(--text-black)]">{doc.title}</h3>
                  <p className="text-[1.4rem] text-[var(--text-black-soft)]">{doc.description}</p>
                </div>
              </div>
              <iframe
                src={doc.file}
                title={doc.title}
                className="h-[480px] w-full border-y border-[var(--ceramic)] bg-white"
              />
              <a
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-4 text-[1.4rem] font-bold text-[var(--starbucks-green)] hover:bg-[var(--green-light)] transition-colors"
              >
                Open PDF
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 py-[8vh] mt-[4vh]">
        <div className="text-center space-y-[3vh]">
          <h2 className="text-[3rem] md:text-[2.5rem] font-bold text-[var(--text-black)]">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-[1.6rem] text-[var(--text-black-soft)] max-w-2xl mx-auto">
            Join thousands of learners who are progressing through our structured, practical learning system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[2vw] mt-[3vh]">
            <Link
              href="/register"
              className="px-8 py-4 bg-[var(--starbucks-green)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]"
            >
              Get Started Today
            </Link>
            <Link
              href="/classes"
              className="px-8 py-4 border-2 border-[var(--starbucks-green)] text-[var(--starbucks-green)] rounded-lg font-bold hover:bg-[var(--green-light)] transition-colors text-[1.4rem]"
            >
              Explore Free Classes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
