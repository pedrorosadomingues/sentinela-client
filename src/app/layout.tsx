import type { Metadata } from "next";
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vestiq",
  description: "Vestiq",
  icons: [
    {
      url: "/icons/logo-vestiq.ico",
      href: "/icons/logo-vestiq.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}` }>
      <body className={`antialiased font-sans`}>{children}</body>
    </html>
  );
}
