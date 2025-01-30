/* eslint-disable @next/next/no-img-element */
"use client";
import SignInTemplate from "@/components/templates/Sign-in";
import SignUpTemplate from "@/components/templates/Sign-up";
import { useRootStore } from "@/zustand-stores/rootStore";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { rootControl, setRootControl } = useRootStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!searchParams) return;

  }, [searchParams]);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab) {
      setRootControl(tab);
    }
  }, [searchParams, setRootControl]);

  useEffect(() => {
    if (rootControl && searchParams) {
      router.replace(`?tab=${rootControl}`);
      setIsLoading(false);
    }
  }, [rootControl, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <img
          src="/icons/logo-vestiq.ico"
          alt="Loading"
          className="animate-spin-bounce w-24 h-24"
        />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center flex-col"> 
      {rootControl === "login" ? <SignInTemplate /> : <SignUpTemplate />}
    </div>
  );
}

