import "@/styles/globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { ReduxProvider } from "@/store/provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Workout Tracker",
  description: "Improve your workouts with our tracker app!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* <Navbar /> */}
            <div className="flex-grow flex">
              <div className="hidden lg:block">{/* <Sidebar /> */}</div>
              <main className="flex-grow flex justify-center ">{children}</main>
            </div>
            <footer>{/* <FooterContent /> */}</footer>
            {/* <BottomBar /> */}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
