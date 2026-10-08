import type { Metadata } from "next";
import { Inter, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SubmissionSyncAgent } from "@/components/sync/SubmissionSyncAgent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Handwriting for the teacher's red-pen marks on score papers. */
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["500", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Olympiad Digital Examination | Interactive Examination Platform",
  description: "Official digital Olympiad examination platform featuring interactive problem solving engines, administrator oversight, live student monitoring, and authentic teacher evaluation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${caveat.variable}`}>
      <body className="bg-[#F4F7FB] text-slate-900 min-h-screen">
        <AuthProvider>
          <SubmissionSyncAgent />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
