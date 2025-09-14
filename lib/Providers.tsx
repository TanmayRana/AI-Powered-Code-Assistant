// lib/Providers.tsx
"use client"; // only this file is client-side

import { ReactNode } from "react";
import { ReduxProvider } from "./ReduxProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ClerkProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </ClerkProvider>
    </ReduxProvider>
  );
}
