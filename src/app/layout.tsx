import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProfileProvider } from "@/context/ProfileContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sprout — Shop smarter, eat better",
  description: "Personalised health scores for every grocery product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProfileProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ProfileProvider>
      </body>
    </html>
  );
}
