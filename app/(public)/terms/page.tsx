'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SEED_CONTENT = `
# Terms of Service

**Effective Date:** October 2026

Welcome to BhashaSchool. By accessing or using our platform, you agree to be bound by these Terms of Service.

## 1. Acceptance of Terms
By creating an account, you agree to comply with and be legally bound by these terms. If you do not agree to these terms, you have no right to obtain information from or otherwise continue using the platform.

## 2. Peer Ladder Code of Conduct
A core component of our methodology integrates you as a mentor to junior learners (e.g., A2 mentoring A1). 
- **Respectful Communication:** You must maintain strict professional courtesy. 
- **Punctuality:** You are expected to join requested live cohort sessions on time.

## 3. Payments and Subscriptions
Currently, BhashaSchool operates a cohort billing model.
- Payments are non-refundable after the first 14 days of a cohort.
- Subscription renewals are processed automatically unless cancelled 48 hours prior to the billing date.

## 4. Limitation of Liability
BhashaSchool is a learning platform. We do not absolutely guarantee passing official Goethe or telc exams.

If you have questions regarding these terms, contact us immediately.
`;

export default function TermsPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get('/company/profile');
        if (res.data && res.data.termsOfService) {
          setContent(res.data.termsOfService);
        } else {
          setContent(SEED_CONTENT); // Seed fallback
        }
      } catch (err) {
        setContent(SEED_CONTENT); // Seed fallback
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--white)] py-[10vh]">
      <div className="max-w-[800px] mx-auto px-[5vw] md:px-0">
        
        <div className="flex items-center gap-[1.5vw] mb-[4vh] pb-[4vh] border-b border-[var(--ceramic)]">
          <div className="w-[60px] h-[60px] rounded-[16px] bg-[var(--green-light)] flex items-center justify-center">
            <FileText className="w-8 h-8 text-[var(--starbucks-green)]" />
          </div>
          <div>
            <h1 className="display-text text-[var(--text-black)] mb-1">Terms of Service</h1>
            <p className="body-text text-[var(--text-black-soft)] font-medium">BhashaSchool Standard Legal Framework</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-[2vh] bg-[var(--ceramic)] rounded w-3/4"></div>
            <div className="h-[2vh] bg-[var(--ceramic)] rounded w-full"></div>
            <div className="h-[2vh] bg-[var(--ceramic)] rounded w-5/6"></div>
          </div>
        ) : (
          <article className="prose prose-lg md:prose-xl prose-emerald max-w-none 
            prose-headings:text-[var(--text-black)] 
            prose-p:text-[var(--text-black-soft)] 
            prose-li:text-[var(--text-black-soft)]">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="h1-text mb-[2vh] mt-[4vh]" {...props} />,
                h2: ({node, ...props}) => <h2 className="h2-text mb-[1.5vh] mt-[3vh]" {...props} />,
                p: ({node, ...props}) => <p className="body-text mb-[2vh]" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-[2vw] mb-[2vh]" {...props} />,
                li: ({node, ...props}) => <li className="body-text mb-[1vh]" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-[var(--text-black)]" {...props} />
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        )}
      </div>
    </main>
  );
}
