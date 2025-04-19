import React from "react";
import { useFnStore } from "@/stores/fnStore";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { AutoFixHighOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Switch } from "@nextui-org/react";

export default function EnhancementButton() {
  const t = useTranslations("functions.page");
  const {
    currentGeneration,
    setActiveGeneratorButton,
    activeEnhancement,
    setActiveEnhancement,
  } = useFnStore();

  const pathname = usePathname();

  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (currentGeneration?.engine === "cf" && pathname === "/member/render" && currentGeneration?.enhanced) {
    return (
      <motion.div
        initial="hidden" // Estado inicial da animação
        animate="visible" // Estado final da animação
        exit="hidden" // Estado ao desmontar (opcional)
        variants={animationVariants}
        className={`relative`}
        onMouseEnter={() => setActiveGeneratorButton("enhancement")}
      >
        <label className="flex items-center justify-between gap-2 ml-auto w-fit">
          <AutoFixHighOutlined width={24} height={24} />
          {t("enhance_image_label")}{" "}
          <Switch
            size="sm"
            isSelected={activeEnhancement}
            onValueChange={(active) => {
              setActiveEnhancement(active);
            }}
          />
        </label>
      </motion.div>
    );
  }
}
