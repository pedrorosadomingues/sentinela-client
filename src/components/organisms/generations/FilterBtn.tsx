"use client";

import { ArrowDropDownOutlined } from "@mui/icons-material";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface FilterProps {
  member: string;
  tool: string;
  date: string;
}

export default function FilterButtons() {
  const t = useTranslations("my-generations.filters");
  const [filters, setFilters] = useState<FilterProps>({
    member: "",
    tool: "",
    date: "",
  });

  const dateOptions = [
    { key: "any-time", label: t("any_time") },
    { key: "today", label: t("today") },
    { key: "yesterday", label: t("yesterday") },
    { key: "last-30-days", label: t("last_30_days") },
    { key: "last-90-days", label: t("last_90_days") },
    { key: "last-year", label: t("last_year") },
  ];

  const handleSelectMember = (
    key: string,
    filter: "date" | "member" | "tool"
  ) => {
    if (filters[filter] === key) {
      return setFilters({ ...filters, [filter]: "" });
    }

    setFilters({ ...filters, [filter]: key });
  };

  return (
    <Dropdown
      placement="bottom-start"
      backdrop="opaque"
      shouldBlockScroll={false}
    >
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="bg-white z-0"
          size="sm"
          endContent={<ArrowDropDownOutlined fontSize="small" />}
        >
          {filters.date
            ? dateOptions.filter((item) => item.key === filters.date)[0].label
            : t("edit_date")}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("filter_by_date")}
        disallowEmptySelection
        variant="flat"
        onAction={(key) => handleSelectMember(key as string, "date")}
      >
        {dateOptions.map((time) => (
          <DropdownItem key={time.key} textValue={time.label}>
            {time.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
