'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { BookOpen } from 'lucide-react';

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
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center animate-bounce shadow-lg shadow-emerald-300">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm font-semibold text-emerald-700">Redirecting to your workspace...</p>
      </div>
    </div>
  );
}
