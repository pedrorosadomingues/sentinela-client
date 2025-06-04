"use client";
import dynamic from "next/dynamic";
const HomeTemplate = dynamic(
  () => import("@/components/templates/home-template"),
  { ssr: false }
);

export default function HomePage() {
  return <HomeTemplate />;
}