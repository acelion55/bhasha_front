'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SEED_CONTENT = `
# Privacy Policy

**Effective Date:** October 2026

At BhashaSchool, we are committed to protecting your privacy and ensuring the security of your personal data. 

## 1. Data Collection
We collect the following personal information when you register:
- **Identity Data:** First name, Last name
- **Contact Data:** Email address, optional WhatsApp number
- **Technical Data:** IP address, browser type, cookies

## 2. Usage of Information
Your data is exclusively used to:
- Pair you with the appropriate peer mentor level (A1 -> A2).
- Facilitate live class video rooms securely.
- Track course progression and CEFR evaluation metrics.

## 3. Data Protection
All data is encrypted in transit via TLS 1.3. We do not sell, rent, or trade your personal information to explicit third-party marketers.

## 4. Your Rights
Under GDPR protocols, you retain the right to:
- Access your data vault.
- Request explicit deletion of all learning records.
- Export your progress to a standardized machine-readable format.

If you have questions, contact us via the support portal.
`;

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get('/company/profile');
        if (res.data && res.data.privacyPolicy) {
          setContent(res.data.privacyPolicy);
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
            <ShieldAlert className="w-8 h-8 text-[var(--starbucks-green)]" />
          </div>
          <div>
            <h1 className="display-text text-[var(--text-black)] mb-1">Privacy Policy</h1>
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
            prose-headings:text-[var(--text-black)] prose-headings:font-bold 
            prose-p:text-[var(--text-black-soft)] prose-p:leading-relaxed 
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
