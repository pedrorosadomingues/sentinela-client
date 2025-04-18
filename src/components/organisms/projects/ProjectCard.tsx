/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FolderIcon } from "@/components/atoms/icons";
import {
  DeleteOutlineOutlined,
  EditOutlined,
  MoreVert,
} from "@mui/icons-material";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
//import { Project } from "@/types/project";

interface ProjectCardProps {
  projectId?: number;
  pasteId?: number;
  type: "project" | "folder";
  name: string;
  count: number;
  onPress: () => void;
  isSelected?: boolean;
  image_count?: number;
}

export default function ProjectCard({
  projectId,
  pasteId,
  type,
  name,
  count,
  onPress,
  isSelected,
  image_count,
}: ProjectCardProps) {
  const {
    handleUpdateProject,
    handleDeleteProject,
    getAllProjects,
    getProjectById,
    refreshCurrentFolder,
    projects,
    selectedProjectId,
  } = useProjectStore();
  const { user } = useUserStore();
  const t = useTranslations("projects.project_card");
  const { isOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const toast = useToast();

  const { control, handleSubmit, setFocus, reset } = useForm({
    defaultValues: {
      projectName: name,
    },
  });

  const currentProject = useMemo(
    () => projects?.find((project: any) => project.id === projectId),
    [projects, projectId]
  );
  const isHidden = currentProject?.hidden;

  const showToast = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    toast.use(type, message);
  };

  const handleRenameItem = async ({ projectName }: { projectName: string }) => {
    if (!projectName) {
      setFocus("projectName");
      showToast("warning", t("input_label"));
      return;
    }

    if (projectName === name) {
      setFocus("projectName");
      showToast("warning", t("input_placeholder"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await handleUpdateProject(type, {
        name: projectName,
        requester_email: user?.email as string,
        project_id: projectId,
        paste_id: pasteId,
      });

      if (res.success) {
        showToast("success", res.message);
        onOpenChange();
      } else {
        showToast("error", res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    setIsLoading(true);
    try {
      const res = await handleDeleteProject(type, {
        requester_email: user?.email as string,
        project_id: projectId,
        paste_id: pasteId,
      });

      if (res.success) {
        await getAllProjects();
        await getProjectById(selectedProjectId as number);
        await refreshCurrentFolder(selectedProjectId as number);

        showToast("success", res.message);
        onOpenChange();
      }
    } catch {
      showToast("error", t("delete_file"));
    } finally {
      setIsLoading(false);
    }
  };

  const ModalSelectedContent = () => {
    if (selectedKey === "edit") {
      return (
        <Controller
          name="projectName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label={t("input_label")}
              variant="bordered"
              labelPlacement="outside"
              placeholder={t("input_placeholder")}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      );
    }

    return (
      <div className="flex flex-col gap-2 items-center justify-center">
        <p>{t("confirm_delete", { type: pasteId ? "folder" : "project" })}</p>
        <span className="md:text-xl text-font font-medium">{name}</span>
        {count > 0 && (
          <p className="text-sm text-danger">
            {t(pasteId ? "folder_contains_files" : "project_contains_files", {
              count,
            })}
          </p>
        )}
      </div>
    );
  };

  if (isHidden) return null;

  return (
    <>
      <div
        onClick={onPress}
        className={`card-folder cursor-pointer group animate-appearance-in hover:bg-gray-100 min-h-36 select-none flex-1 p-1
          ${
            isSelected
              ? "border-primary-400 bg-primary-50 hover:bg-primary-100"
              : ""
          }`}
      >
        <div className="justify-between">
          <FolderIcon />
          <Dropdown>
            <DropdownTrigger>
              <div className="absolute right-0 top-4 cursor-pointer px-1">
                <MoreVert className="text-grayscale-400 group-hover:text-grayscale-700 pointer-events-none" />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              aria-label={t("dropdown_aria")}
              onAction={(action) => {
                setSelectedKey(action as string);
                reset({ projectName: name });
                onOpenChange();
              }}
            >
              <DropdownSection showDivider>
                <DropdownItem key="edit" startContent={<EditOutlined />}>
                  {t("rename_file")}
                </DropdownItem>
              </DropdownSection>
              <DropdownSection>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<DeleteOutlineOutlined />}
                >
                  {t("delete_file")}
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex flex-col items-start overflow-hidden">
          <p className="text-sm 3xl:text-lg text-grayscale-500 group-hover:text-grayscale-600 truncate">
            {count > 1
              ? t("folders_count", { count })
              : count === 1
              ? t("single_folder")
              : t("no_folders")}
          </p>
          <p className="text-sm 3xl:text-lg text-grayscale-500 group-hover:text-grayscale-600 truncate">
            {(image_count ?? 0) > 1
              ? t("images_count", { count: image_count })
              : image_count === 1
              ? t("single_image")
              : t("no_images")}
          </p>
          <p className="text-lg 3xl:text-xl text-font group-hover:text-font/75 font-medium truncate">
            {name}
          </p>
        </div>
      </div>
      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-center">
            <h1 className="text-xl text-center font-semibold">
              {selectedKey === "edit" ? t("rename_file") : t("delete_file")}
            </h1>
          </ModalHeader>
          <ModalBody>
            <ModalSelectedContent />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              className="flex-1"
              onPress={onOpenChange}
            >
              {t("back")}
            </Button>
            <Button
              color={selectedKey === "edit" ? "primary" : "danger"}
              isLoading={isLoading}
              onClick={
                selectedKey === "edit"
                  ? handleSubmit(handleRenameItem)
                  : handleDeleteItem
              }
              className="flex-1"
            >
              {t("confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
