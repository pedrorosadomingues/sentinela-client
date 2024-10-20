import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Vestiq - Fash.AI",
  description: "Vestiq - Fash.AI",
  icons: [
    {
      url: "/img/logo.png",
      href: "/img/logo.png",
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
