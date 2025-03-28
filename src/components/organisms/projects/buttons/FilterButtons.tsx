"use client";

import { useGenerationStore } from "@/stores/generationStore";
import { useProjectStore } from "@/stores/projectStore";
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
  const t = useTranslations("projects.filter_buttons");
  const [filters, setFilters] = useState<FilterProps>({
    member: "",
    tool: "",
    date: "",
  });

  const { generations, setGenerations, setselectedGenerations } =
    useGenerationStore();

  const { projects, setProjects } = useProjectStore();

  const filterAndSetGenerations = (timeKey: string) => {
    const now = new Date();
    let startDate;
    let endDate = now; // Por padrão, o fim do período é agora
    setselectedGenerations([]);

    const startOfDay = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    switch (timeKey) {
      case "today":
        startDate = startOfDay(now);
        break;

      case "yesterday":
        startDate = startOfDay(new Date(now));
        startDate.setDate(startDate.getDate() - 1);
        endDate = startOfDay(now);
        break;

      case "last-30-days":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        break;

      case "last-90-days":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 90);
        break;

      case "last-year":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;

      default:
        startDate = new Date(0); // Data muito antiga
        break;
    }

    const isDateInRange = (date: number | Date) => {
      return date >= startDate && date <= endDate;
    };

    const updatedGenerations = generations.map(
      (item: { started_at: string | number | Date }) => {
        const date = new Date(item.started_at);
        const shouldHide = !isDateInRange(date);
        return {
          ...item,
          hidden: shouldHide,
          checked: false,
        };
      }
    );

    setGenerations(updatedGenerations);

    const updatedProjects = projects.map(
      (item: { created_at: string | number | Date }) => {
        const date = new Date(item.created_at);
        const shouldHide = !isDateInRange(date);
        return {
          ...item,
          hidden: shouldHide,
          checked: false,
        };
      }
    );

    setProjects(updatedProjects);
  };

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

    filterAndSetGenerations(key);
    setFilters({ ...filters, [filter]: key });
  };

  return (
    <Dropdown placement="bottom-start" backdrop="opaque">
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="bg-white"
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
          <DropdownItem
            key={time.key}
            textValue={time.label}
          >
            {time.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
