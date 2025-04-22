"use client";

import { useFnStore } from "@/stores/fnStore";
import { motion } from "framer-motion";

export default function DropImageForm({ children }: { children: React.ReactNode }) {
  const { generateStep } = useFnStore();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.3 } },
      }}
      className={`card w-full h-fit lg:min-h-[450px] min-h-[450px] !flex-col !justify-between relative p-2`}
    >
      <div
        className={`w-full h-full flex flex-col items-center gap-2 py-2 px-4 xl:px-4 transition-opacity delay-300
      ${generateStep === 1 ? "opacity-50 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
      >
        {/* <div className="flex gap-2 items-center font-lexend">
          {!currentGeneration.generated && (
            <span className="flex items-center justify-center w-6 h-6 border-2 border-primary rounded-full text-primary text-sm">
              2
            </span>
          )}
          <h2 className="text-xl xl:text-2xl text-font font-medium whitespace-nowrap">{t("detail_image_title")}</h2>
        </div>
        <p className="text-font-medium text-center text-sm">{t("detail_image_subtext")}</p> */}
        <div className="relative px-4 mt-4 h-full w-full">{children}</div>
      </div>
    </motion.div>
  );
}
