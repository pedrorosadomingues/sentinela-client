import {
  DeselectOutlined,
  MoreVertOutlined,
  SelectAllOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGenerationStore } from "@/zustand-stores";

export default function SeeMoreActions() {
  const t = useTranslations("my-generations");
  const { handleSelectAllGenerations, clearSelectedGenerations } =
    useGenerationStore();
  const [activeSelectAll, setActiveSelectAll] = useState<boolean>(false);

  const toggleSelectAll = () => {
    if (activeSelectAll) {
      clearSelectedGenerations();
      setActiveSelectAll(false);
      return;
    }

    handleSelectAllGenerations();
    setActiveSelectAll(true);
  };

  const handleActions = (action: string) => {
    if (action === "select-all") {
      toggleSelectAll();
    }
  };

  return (
    <Dropdown shouldBlockScroll={false} aria-label={t("see_more_actions")}>
      <DropdownTrigger>
        <Button
          type="button"
          isIconOnly
          radius="full"
          size="sm"
          variant="light"
          className="z-0"
        >
          <MoreVertOutlined fontSize="small" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("see_more_actions")}
        onAction={(key) => handleActions(key as string)}
      >
        <DropdownItem
          key="select-all"
          aria-label={t("select_all")}
          startContent={
            activeSelectAll ? (
              <DeselectOutlined fontSize="small" />
            ) : (
              <SelectAllOutlined fontSize="small" />
            )
          }
        >
          {activeSelectAll ? t("deselect_all") : t("select_all")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
