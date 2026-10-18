'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'mentor') {
        router.push('/dashboard/mentor');
      } else {
        router.push('/dashboard/student');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <img
          src="/logos/logowithouttext.png"
          alt="BhashaSchool Logo"
          className="w-16 h-16 object-contain animate-bounce"
        />
        <p className="text-sm font-semibold text-emerald-700">Redirecting to your workspace...</p>
      </div>
    </div>
  );
}
