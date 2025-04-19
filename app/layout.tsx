import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextDevIndicatorRemover from '@/components/NextDevIndicatorRemover'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Superwrite",
  description: "A minimal writing environment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <NextDevIndicatorRemover />
      </body>
    </html>
  );
}
