"use client";

import { useGlobalStore } from "@/stores/globalStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getProfileTabs } from "@/utils/profile";
import { useLocale } from "next-intl";

export default function TabList() {
  const { selectedProfileTab, setSelectedProfileTab } = useGlobalStore();
  const router = useRouter();
  const locale = useLocale();

  const availableTabs = getProfileTabs(locale);

  const handleTabClick = (tabKey: string) => {
    if (tabKey === "notifications") {
    //   router.push("/member/profile/notifications");

      return;
    }

    setSelectedProfileTab(tabKey);
    router.push(`/main/profile?view=${tabKey}`);
  };

  return (
    <ul className="list-none flex lg:flex-col border-l border-r w-full lg:w-1/4 lg:h-full bg-background-white">
      {availableTabs
        .filter((item) => item.show)
        .map((tab) => (
          <li
            key={tab.key}
            className={`w-full h-full overflow-x-scroll md:overflow-hidden flex items-center justify-center lg:block lg:h-auto lg:border-b whitespace-nowrap ${
              selectedProfileTab === tab.key ? "bg-primary-light/10" : ""
            }`}
          >
            <button
              onClick={() => handleTabClick(tab.key)}
              className="w-full text-center py-2 lg:p-5 lg:text-left text-sm md:text-base 2xl:text-xl font-medium text-font relative"
            >
              <span
                className={`block lg:hidden ${
                  selectedProfileTab === tab.key
                    ? "text-font"
                    : "text-font-lighter"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`hidden text-xs lg:text-lg lg:block ${
                  selectedProfileTab === tab.key
                    ? "text-font"
                    : "text-font-lighter"
                }`}
              >
                {tab.title}
              </span>
              {/* Underline animation */}
              {selectedProfileTab === tab.key ? (
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-1 bg-primary"
                  layoutId="underline"
                  transition={{ duration: 0.3 }}
                />
              ) : null}
            </button>
          </li>
        ))}
    </ul>
  );
}
