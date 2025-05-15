/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { usePasteStore } from "@/stores/pasteStore";
import { useGenerationStore } from "@/stores/generationStore";
import { useProjectStore } from "@/stores/projectStore";
import { useTranslations } from "next-intl";

export default function SelectAllButton(): JSX.Element | null {
  const t = useTranslations("projects.select_all_button");
  const {
    setGenerations,
    generations,
    setSelectedGenerations,
    generationsWithoutPaste,
    isCheckedSelectAllBtn,
    setIsCheckedSelectAllBtn,
  } = useGenerationStore();
  const { generationsObj } = usePasteStore();
  const { isLoading } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsCheckedSelectAllBtn(!isCheckedSelectAllBtn);

    const updatedGenerations = generations?.map((item: any) => ({
      ...item,
      checked: !isCheckedSelectAllBtn,
    }));

    const selectedGenerationIds = updatedGenerations!
      .filter((item: any) => item.checked)
      .map((item: any) => item.id);

    setSelectedGenerations(selectedGenerationIds);
    setGenerations(updatedGenerations as any);
  };

  useEffect(() => {
    let shouldOpen = Object.keys(generationsObj).length > 0;

    if ((generationsWithoutPaste?.length ?? 0) > 0) {
      shouldOpen = true;
    } else if (generations!.length > 0) {
      const unhidden = generations?.filter((item: any) => !item.hidden);
      shouldOpen = unhidden!.length > 0;
    }

    setIsOpen(shouldOpen);
  }, [generationsObj, generations, generationsWithoutPaste, isLoading]);

  if (!isOpen) return null;

  return (
    <Button
      size="sm"
      variant="bordered"
      onPress={handleToggle}
      startContent={
        <Checkbox
          isSelected={isCheckedSelectAllBtn}
          size="sm"
          className="pointer-events-none"
          classNames={{
            wrapper: "m-0",
          }}
        />
      }
    >
      {t("button_label")}
    </Button>
  );
}
