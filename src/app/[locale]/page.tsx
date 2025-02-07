/* eslint-disable @next/next/no-img-element */
"use client";
import SignInTemplate from "@/components/templates/SignIn";
import SignUpTemplate from "@/components/templates/SignUp";
import { useRootStore } from "@/zustand-stores/rootStore";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ForgotPasswordTemplate from "@/components/templates/ForgotPassword";
import SuccessEmailSendedTemplate from "@/components/templates/EmailSended";

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
      {rootControl === "login" ? (
        <SignInTemplate />
      ) : rootControl === "register" ? (
        <SignUpTemplate />
      ) : rootControl === "forgot-password" ? (
        <ForgotPasswordTemplate />
      ) : (
        rootControl === "success-email-sended" && <SuccessEmailSendedTemplate />
      )}
    </div>
  );
}
