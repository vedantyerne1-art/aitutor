'use client';

import { useEffect } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { SWRConfig } from 'swr';

export default function RootProvider({ children }: { children: React.ReactNode }) {
  useLenis();

  useEffect(() => {
    // Keyboard shortcut for command palette
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const { useAppStore } = require('@/store');
        useAppStore.getState().toggleCommand();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
