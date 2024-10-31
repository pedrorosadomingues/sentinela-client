import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Vestiq - Fash.AI",
  description: "Vestiq - Fash.AI",
  icons: [
    {
      url: "/img/logo-vestiq.png",
      href: "/img/logo-vestiq.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
