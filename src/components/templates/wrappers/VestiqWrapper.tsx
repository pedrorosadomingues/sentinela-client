/* eslint-disable react-hooks/exhaustive-deps */
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import VestiqLoading from "@/components/organisms/VestiqLoading";
import { useFnStore, useUserStore } from "@/stores";
import { useLocale } from "next-intl";
import React, { useEffect } from "react";

export default function VestiqWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getImageFunctions, isFetching } = useFnStore();
  const { user } = useUserStore();
  const locale = useLocale();

  useEffect(() => {
    getImageFunctions(locale as string);
  }, [locale]);

  // 🔹 Exibe loading enquanto busca a sessão
  if (isFetching || !user) {
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
