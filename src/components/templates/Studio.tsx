/* components/templates/Studio.tsx */
"use client";
import { useTranslations } from "next-intl";
import Header from "../organisms/Header";
import Sidebar from "../organisms/Sidebar";
import StudioContent from "@/components/organisms/functions/DressModel";

export default function Studio(): JSX.Element {
  return (
    <div className="bg-primary min-h-screen flex justify-center w-full">
      <Header />
      <Sidebar />
      <StudioContent />
    </div>
  );
}
