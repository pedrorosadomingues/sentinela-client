"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeTemplate from "@/components/templates/Studio";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/pages/sign-in"); // Redireciona para a página de login se o token não existir
    }
  }, [router]);

  return (
    <div className="w-full flex bg-gradient-to-r from-[#3C4854] via-[#CBCBCB] to-[#3C4854]">
      <HomeTemplate />
    </div>
  );
}