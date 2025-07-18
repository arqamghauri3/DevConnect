import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ReactQueryClientProvider } from '@/components/ReactQueryClientProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevConnect",
  description: "A social media app",
  icons: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmTwnA_cbtpvYtWYfPtisBpkedtXxX0Xy6fQ&s"  
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" className="">
        <AuthProvider>
          <ThemeProvider>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              {/* <Navbar /> */}
              {children}
              <Toaster />
            </body>
          </ThemeProvider>
        </AuthProvider>
      </html>
    </ReactQueryClientProvider>
  );
}
