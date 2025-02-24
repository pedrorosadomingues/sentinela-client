"use client";

import { useRootStore } from "@/stores/rootStore";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VestiqLoading from "@/components/organisms/VestiqLoading";
import {
  SignIn,
  SignUp,
  ForgotPassword,
  EmailSentFeedback,
} from "@/components/templates/auth/index";
import AuthWrapper from "@/components/templates/wrappers/AuthWrapper";

export default function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { rootControl, setRootControl } = useRootStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!searchParams) return;
  }, [searchParams]);

  useEffect(() => {
    const type = searchParams?.get("type");

    if (type) {
      setRootControl(type);
    }
  }, [searchParams, setRootControl]);

  useEffect(() => {
    if (rootControl && searchParams) {
      router.replace(`?type=${rootControl}`);
      setIsLoading(false);
    }
  }, [rootControl, router, searchParams]);

  if (isLoading) {
    return <VestiqLoading />;
  }

  return (
    <AuthWrapper>
      {rootControl === "login" ? (
        <SignIn />
      ) : rootControl === "register" ? (
        <SignUp />
      ) : rootControl === "forgot-password" ? (
        <ForgotPassword />
      ) : (
        rootControl === "success-email-sended" && <EmailSentFeedback />
      )}
    </AuthWrapper>
  );
}
