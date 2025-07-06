import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Practice",
  description: "Next.js app with Navbar and Footer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen pt-14 pb-12 flex flex-col`}>
        <UserProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow container mx-auto px-6 pt-6">{children}</main>
            <Footer />
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
}
