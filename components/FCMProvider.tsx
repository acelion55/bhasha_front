'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  initFirebaseAnalytics,
  requestFCMToken,
  subscribeForegroundMessages,
} from '@/lib/firebase';

interface FCMContextType {
  fcmToken: string | null;
  permission: NotificationPermission | 'unsupported';
  enableNotifications: () => Promise<string | null>;
}

const FCMContext = createContext<FCMContextType>({
  fcmToken: null,
  permission: 'default',
  enableNotifications: async () => null,
});

export function useFCM() {
  return useContext(FCMContext);
}

export function FCMProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    initFirebaseAnalytics();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }
  }, []);

  const syncTokenWithBackend = useCallback(async (token: string) => {
    try {
      await api.post('/notifications/token', { token });
      if (typeof window !== 'undefined') {
        localStorage.setItem('fcm_token', token);
      }
    } catch (err) {
      console.warn('[FCM] Could not sync token with backend:', err);
    }
  }, []);

  const enableNotifications = useCallback(async (): Promise<string | null> => {
    const token = await requestFCMToken();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
    if (token) {
      setFcmToken(token);
      if (user?.id) {
        await syncTokenWithBackend(token);
      }
    }
    return token;
  }, [syncTokenWithBackend, user?.id]);

  // Automatically register FCM token when user is logged in and permission is granted
  useEffect(() => {
    if (!user?.id) return;
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      enableNotifications();
    } else if (Notification.permission === 'default') {
      // Request permission gracefully once logged into the dashboard
      const alreadyPrompted = sessionStorage.getItem('fcm_prompted');
      if (!alreadyPrompted) {
        sessionStorage.setItem('fcm_prompted', '1');
        enableNotifications();
      }
    }
  }, [user?.id, enableNotifications]);

  // Foreground notification listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let active = true;

    subscribeForegroundMessages((payload) => {
      if (!active) return;
      const title = payload.notification?.title || payload.data?.title || 'New Notification';
      const body = payload.notification?.body || payload.data?.body || '';
      toast.info(title, {
        description: body || undefined,
        duration: 6000,
      });
    }).then((unsub) => {
      if (active) {
        unsubscribe = unsub;
      } else if (unsub) {
        unsub();
      }
    });

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <FCMContext.Provider value={{ fcmToken, permission, enableNotifications }}>
      {children}
    </FCMContext.Provider>
  );
}
