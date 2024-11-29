/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MainTemplate from "@/components/templates/Main";
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
      <MainTemplate />
    </div>
  );
}
