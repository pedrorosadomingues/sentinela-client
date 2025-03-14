/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import MenuProfile from "../organisms/my-profile/MenuLeft";
import PersonalData from "../organisms/my-profile/Personal-Data";
import UserProfile from "../organisms/my-profile/User-Profile";
import PlanBilling from "../organisms/my-profile/Plan-Billing";
import MenuUp from "../organisms/my-profile/MenuUp";
import { useGlobalStore, useProfileStore } from "@/stores";
import { useTranslations } from "next-intl";
import TabList from "../organisms/profile/TabList";
import TabContent from "../organisms/profile/TabContent";
import { useEffect } from "react";

export default function MyProfile({ view }: { view: string }) {
  const { selectedProfileTab, setSelectedProfileTab } = useGlobalStore();
  const text = useTranslations("menu_profile");

  useEffect(() => {
    setSelectedProfileTab(view);
  }, [view]);

  return (
    <main className="w-full min-h-screen flex">
      <div className="w-full flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-sm border-grayscale-60">
        <TabList />
        <TabContent />
      </div>
    </main>
  );
}
