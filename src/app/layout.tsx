import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Vestiq - Fashion.AI",
  description: "Vestiq - Fashion.AI",
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
