import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Vestiq - Fashion.AI",
  description: "Vestiq - Fashion.AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
