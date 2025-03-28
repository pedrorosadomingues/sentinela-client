"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { Key, useEffect, useRef, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import { Project, Folder } from "@/types/project";
import { useToast } from "@/hooks/useToast";
import axiosClient from "@/lib/axiosClient";
import { FolderIcon, AddIcon } from "../../../shared/icons";
import { useGenerationStore } from "@/stores/generationStore";
import { Folder as MuiFolderIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";

export default function MoveGenerationButton({
  type,
}: {
  type?: string;
}): JSX.Element | null {
  const t = useTranslations("projects.move_generation_button");
  const { user } = useUserStore();
  const {
    data,
    setData,
    selectedFolderId,
    setSelectedFolderId,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    getProjects,
    handleCreate,
    isLoading,
    setIsLoading,
    isCreating,
    setIsCreating,
    isLoadingCreate,
    inputValue,
    setInputValue,
  } = useProjectStore();
  const { selectedGenerations } = useGenerationStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isInSubFolder, setIsInSubFolder] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    setIsOpened(selectedGenerations.length > 0);
  }, [selectedGenerations]);

  useEffect(() => {
    if (user?.id) {
      getProjects(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (projects) {
      setData(projects);
    }
  }, [projects]);

  const handleProjectClick = (file: any) => {
    if (file.pastes) {
      setSelectedProjectId(file.id);
      setSelectedProject(file);
      setSelectedFolderId(null);
      const selectedItem = data.find(
        (item: { id: any }) => item.id === file.id
      );

      if (selectedItem && "pastes" in selectedItem && selectedItem.pastes) {
        setData(selectedItem.pastes as Folder[]);
        setIsInSubFolder(true);
      }
    } else if (file.project_id) {
      setSelectedFolderId(file.id);
    }
  };

  const handleGoBack = () => {
    if (isInSubFolder) {
      setData(projects as Project[]);
      setIsInSubFolder(false);
    } else {
      onOpenChange();
    }

    setSelectedFolderId(null);
    setSelectedProjectId(null);
  };

  const handleMoveImage = async () => {
    setIsLoading(true);

    const body = {
      generations_ids: selectedGenerations,
      paste_id: selectedFolderId || null,
      project_id: selectedProjectId,
      user_uuid: user?.id,
    };

    try {
      await axiosClient.patch("/api/my-generation", body);
      toast.use("success", t("success_move"));
      onOpenChange();
    } catch (error) {
      console.error(error);
      toast.use("error", t("error_move"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpened) return null;
  
  return (
    <>
      {type === "modal" ? (
        <p
          className="text-white flex w-full h-full items-center justify-center cursor-pointer"
          onClick={() => {
            onOpen();
          }}
        >
          {t("move")}
        </p>
      ) : (
        <Button
          onPress={() => {
            handleGoBack();
            onOpen();
          }}
          size="sm"
          variant="bordered"
        >
          {t("move_images")}
        </Button>
      )}
      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-center">
            <h1 className="text-base xs:text-xl text-center font-semibold">
              {isInSubFolder ? t("select_folder") : t("select_project")}
            </h1>
          </ModalHeader>
          <ModalBody className="max-h-80 overflow-y-scroll">
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4">
              {data?.map(
                (item: {
                  id: Key | null | undefined;
                  name: string;
                  totalFiles: number;
                }) => (
                  <FolderCard
                    key={item.id}
                    name={item.name}
                    count={item.totalFiles}
                    onPress={() => handleProjectClick(item)}
                    isSelected={
                      selectedFolderId === item.id ||
                      selectedProjectId === item.id
                    }
                  />
                )
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              className="flex-1 btn"
              isDisabled={isLoading}
              onPress={handleGoBack}
            >
              {t("back")}
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={handleMoveImage}
              isDisabled={!selectedProjectId}
              className="flex-1 btn btn-primary-gradient"
            >
              {!isInSubFolder ? t("continue") : t("confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isCreating}
        onOpenChange={() => setIsCreating(false)}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-center">
            <h1 className="text-xl text-center font-semibold">
              {isInSubFolder ? t("create_new_folder") : t("create_new_project")}
            </h1>
          </ModalHeader>
          <ModalBody>
            <Input
              label={isInSubFolder ? t("folder_name") : t("project_name")}
              variant="bordered"
              labelPlacement="outside"
              placeholder={
                isInSubFolder ? t("enter_folder_name") : t("enter_project_name")
              }
              value={inputValue}
              ref={inputRef}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              className="flex-1 btn"
              isDisabled={isLoadingCreate}
              onPress={() => setIsCreating(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              color="primary"
              isLoading={isLoadingCreate}
              isDisabled={!inputValue}
              className="flex-1 btn btn-primary-gradient"
              onPress={() =>
                handleCreate(isInSubFolder ? "folder" : "project", inputValue)
              }
            >
              {t("create")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export const FolderCard = ({
  name,
  count,
  onPress,
  isSelected,
  type,
}: {
  name: string;
  count: number;
  onPress: () => void;
  isSelected: boolean;
  type?: "project" | "folder";
}) => {
  const t = useTranslations("projects.move_generation_button");

  return (
    <div
      onClick={onPress}
      className={`card-folder cursor-pointer group animate-appearance-in hover:bg-gray-100 h-32 select-none flex-1 p-1
        ${
          isSelected && "border-primary-400 bg-primary-50 hover:bg-primary-100"
        }`}
    >
      <div className="justify-between">
        {type === "project" ? (
          <FolderIcon />
        ) : (
          <MuiFolderIcon
            fontSize="large"
            className="text-jaffa-300 scale-110"
          />
        )}
      </div>
      <div className="flex flex-col items-start overflow-hidden">
        <p className="text-xs text-grayscale-500 group-hover:text-grayscale-600 truncate">
          {count > 0 ? t("files", { count }) : t("empty")}
        </p>
        <p className="text-base text-font group-hover:text-font/75 font-medium truncate">
          {name}
        </p>
      </div>
    </div>
  );
};

const NewFolderCard = ({
  project,
  onCreate,
}: {
  project?: boolean;
  onCreate: () => void;
}) => {
  const t = useTranslations("projects.move_generation_button");

  return (
    <div
      onClick={onCreate}
      className="card-folder cursor-pointer group animate-appearance-in hover:bg-vivid-blue-50"
    >
      <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
        <AddIcon />
        <p className="text-base font-semibold whitespace-nowrap text-font">
          {project ? t("create_project") : t("create_folder")}
        </p>
      </div>
    </div>
  );
};
