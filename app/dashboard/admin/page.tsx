'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin/users');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64 text-emerald-700 font-semibold text-base">
      Redirecting to Admin Users Engine...
    </div>
  );
}