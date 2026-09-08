import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import ToastContainer from "@/components/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParkSmart — Find it. Reserve it. Park it.",
  description:
    "Real-time parking availability, smart recommendations, and easy reservations across Colombo.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🅿️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer className="border-t border-zinc-200 bg-white py-6 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
              <div className="flex items-center gap-2 font-semibold text-zinc-800">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white text-xs font-bold">
                  P
                </span>
                ParkSmart
              </div>
              <p>Find it. Reserve it. Park it. — Student prototype · Demo Mode</p>
              <p>© {new Date().getFullYear()} ParkSmart</p>
            </div>
          </footer>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
