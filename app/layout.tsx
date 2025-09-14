// import "./globals.css";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "react-hot-toast";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ReduxProvider } from "@/lib/ReduxProvider";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "AI Code Assistant | Learn & Code with AI",
//   description: "AI-powered coding tutor and assistant for developers",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ReduxProvider>
//       <ClerkProvider>
//         <html lang="en">
//           <body className={inter.className}>
//             <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//               {children}
//               <Toaster position="top-right" />
//             </ThemeProvider>
//           </body>
//         </html>
//       </ClerkProvider>
//     </ReduxProvider>
//   );
// }

// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/lib/Providers"; // new client wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Code Assistant | Learn & Code with AI",
  description: "AI-powered coding tutor and assistant for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="top-right" />
          </ThemeProvider> */}
        </Providers>
      </body>
    </html>
  );
}
