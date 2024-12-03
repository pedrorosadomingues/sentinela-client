import type { Metadata } from "next";
import "./global.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vestiq - Fash.AI",
  description: "Vestiq - Fash.AI",
  icons: [
    {
      url: "/icons/logo-vestiq.png",
      href: "/icons/logo-vestiq.png",
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
