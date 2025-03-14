"use client";

import { useGlobalStore } from "@/stores/globalStore";
import { getProfileTabs } from "@/utils/profile";
import { Tabs, Tab } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

export default function TabContent() {
  const { selectedProfileTab } = useGlobalStore();
  const locale = useLocale();

  const availableTabs = getProfileTabs(locale);

  return (
    <aside className="flex w-full bg-background-white h-full">
      <main className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProfileTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            <Tabs
              aria-label="Options"
              selectedKey={selectedProfileTab}
              className="hidden"
              classNames={{
                tabList: "hidden",
                wrapper: "hidden",
              }}
            >
              {availableTabs.map((tab) => (
                <Tab
                  key={tab.key}
                  title={tab.title}
                  className="w-full"
                >
                  {tab.content}
                </Tab>
              ))}
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </main>
    </aside>
  );
}
