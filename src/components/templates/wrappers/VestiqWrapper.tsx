import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import VestiqLoading from "@/components/organisms/VestiqLoading";
import { useUserStore } from "@/stores";
import React from "react";

export default function VestiqWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();

  if (!user) {
    return <VestiqLoading />;
  }

  return (
    <div className="min-h-screen flex justify-center w-full">
      <Header />
      <Sidebar />
      <article className="w-full md:ml-24 mt-20 px-4 md:px-0 md:pr-4">
        {children}
      </article>
    </div>
  );
}
