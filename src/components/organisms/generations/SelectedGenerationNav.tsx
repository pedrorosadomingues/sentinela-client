"use client";

import {
  CloseOutlined,
  DeleteOutlineOutlined,
  DownloadOutlined,
  DriveFileMoveOutlined,
} from "@mui/icons-material";
import { Button, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useGenerationStore } from "@/zustand-stores";
import SeeMoreActions from "./SeeMoreActions";

interface ActionsProps {
  action: "download" | "move" | "delete" | "cancel";
}

export default function SelectedGenerationsNav() {
  const t = useTranslations("my-generations");
  const { selectedGenerations, clearSelectedGenerations } =
    useGenerationStore();

  const actions = [
    {
      key: "download",
      trigger: <DownloadOutlined fontSize="small" />,
      label: t("download"),
    },
    {
      key: "move",
      trigger: <DriveFileMoveOutlined fontSize="small" />,
      label: t("move"),
    },
    {
      key: "delete",
      trigger: <DeleteOutlineOutlined fontSize="small" />,
      label: t("delete"),
    },
  ];

  const handleAction = ({ action }: ActionsProps) => {
    if (action === "cancel") {
      clearSelectedGenerations();
    }
  };

  return (
    <nav className="w-full flex items-center gap-4 p-1 rounded-full bg-default-100">
      <div className="flex items-center gap-2 text-sm">
        <Tooltip
          content={t("cancel_selection")}
          placement="bottom"
          color="foreground"
          showArrow
        >
          <Button
            type="button"
            onPress={() => handleAction({ action: "cancel" })}
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
          >
            <CloseOutlined fontSize="small" />
          </Button>
        </Tooltip>

        <span>
          {t("selected_count", { count: selectedGenerations.length })}
        </span>
      </div>

      <ul className="flex items-center gap-2">
        {actions.map((action) => (
          <li key={action.key} className="cursor-pointer">
            <Button
              type="button"
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              isDisabled={true}
            >
              <Tooltip
                content={action.label}
                placement="bottom"
                color="foreground"
                showArrow
              >
                {action.trigger}
              </Tooltip>
            </Button>
          </li>
        ))}

        <li className="cursor-pointer">
          <SeeMoreActions />
        </li>
      </ul>
    </nav>
  );
}
