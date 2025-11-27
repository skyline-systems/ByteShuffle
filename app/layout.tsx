import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";

import "./global.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ByteShuffle",
  description: "Shuffle into your next favorite website.",
  openGraph: {
    type: "website",
    title: "ByteShuffle",
    description: "Shuffle into your next favorite website.",
    images: "/android-chrome-512x512.png",
    url: "https://www.byteshuffle.net",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
