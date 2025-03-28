"use client";

import { ImportExportOutlined } from "@mui/icons-material";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGenerationStore } from "@/stores";

export default function SortButton() {
  const t = useTranslations("my-generations.filters");

  const { sortGenerations } = useGenerationStore();

  const dropdownItems = [
    { key: "newest-editions", label: t("newest_editions") },
    { key: "oldest-editions", label: t("oldest_editions") },
  ];
  const [sortedKey, setSortedKey] = useState(dropdownItems[0]);

  return (
    <Dropdown
      placement="bottom-end"
      backdrop="opaque"
      shouldBlockScroll={false}
    >
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="bg-white z-0"
          size="sm"
          startContent={<ImportExportOutlined fontSize="small" />}
        >
          {sortedKey.label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("sort_actions")}
        variant="flat"
        disallowEmptySelection
        selectedKeys={sortedKey.key}
        onAction={(key) => {
          sortGenerations(key as 
            "newest-editions" | "oldest-editions"
          );
          console.log("key", key);
          const selectedItem =
            dropdownItems.find((item) => item.key === key) || dropdownItems[0];
          setSortedKey(selectedItem);
        }}
      >
        {dropdownItems.map((item) => (
          <DropdownItem key={item.key} textValue={item.label}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
