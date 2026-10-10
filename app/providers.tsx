'use client';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function BackendKeepAlive() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const pingBackend = () => {
      fetch(`${apiUrl}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {});
    };

    // Immediate initial ping
    pingBackend();

    // Ping every 4 minutes (240,000 ms) to keep Render awake
    const interval = setInterval(pingBackend, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "33929668327-4181d6ec94cq6j3dknqg618s5veqi1qg.apps.googleusercontent.com"}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BackendKeepAlive />
          {children}
          <Toaster position="top-right" richColors theme="dark" />
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
