import { Outfit } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import GlobalLoader from "@/components/common/GlobalRouteLoader";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} dark:bg-gray-900`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SidebarProvider>
            <Suspense fallback={<GlobalLoader />}>
              {children}
            </Suspense>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
