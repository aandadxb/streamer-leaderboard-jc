import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [{ path: "./fonts/Inter-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JustCasino - Streamer's Wager Race",
  description: "Exclusive prizes to be won.",
  icons: {
    icon: "/justcasino.svg",
    shortcut: "/justcasino.svg",
    apple: "/justcasino.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} antialiased min-h-screen flex flex-col overflow-x-hidden`}>
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
