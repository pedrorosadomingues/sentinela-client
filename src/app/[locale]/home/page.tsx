/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeTemplate from "@/components/templates/Studio";
import { useLocale } from "next-intl";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/${locale}/sign-in`);
    }
  }, [router]);

  return (
    <div className="w-full flex">
      <HomeTemplate />
    </div>
  );
}
