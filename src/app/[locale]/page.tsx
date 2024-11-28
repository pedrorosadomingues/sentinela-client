"use client";
import SignInTemplate from "@/components/templates/Sign-in";
import SignUpTemplate from "@/components/templates/Sign-up";
import { useRootStore } from "@/zustand-stores/rootStore";

export default function WelcomePage() {
  const { rootControl } = useRootStore();

  return (
    <div className="w-full flex items-center justify-center flex-col">
      {rootControl === "login" ? (
        <SignInTemplate />
      ) : (
        <SignUpTemplate />
      )}
    </div>
  );
}
