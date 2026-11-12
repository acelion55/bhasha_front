'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/lib/auth-context';
import { API_BASE_URL } from '@/lib/api';
import { FCMProvider } from '@/components/FCMProvider';
import { Toaster } from 'sonner';
import { ReactLenis } from 'lenis/react';

const queryClient = new QueryClient();

function BackendKeepAlive() {
  useEffect(() => {
    if (!API_BASE_URL) return;
    const pingBackend = () => {
      fetch(`${API_BASE_URL}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {});
    };

    // Immediate initial ping
    pingBackend();

    // Ping every 4 minutes (240,000 ms) to keep backend awake
    const interval = setInterval(pingBackend, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FCMProvider>
            <BackendKeepAlive />
            {isDashboard ? (
              children
            ) : (
              <ReactLenis
                root
                options={{
                  lerp: 0.08,
                  duration: 1.2,
                  smoothWheel: true,
                  wheelMultiplier: 1,
                  touchMultiplier: 1.5,
                  infinite: false,
                }}
              >
                {children}
              </ReactLenis>
            )}
            <Toaster position="top-right" richColors theme="dark" />
          </FCMProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
