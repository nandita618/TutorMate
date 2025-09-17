'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from '@/contexts/ThemeContext';

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
