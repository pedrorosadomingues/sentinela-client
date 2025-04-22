/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  useDisclosure,
  ScrollShadow,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import { useFnStore } from "@/stores/fnStore";
import { Project, Folder } from "@/types/project";
import { useToast } from "@/hooks/useToast";
import { axiosClient } from "@/lib/axios/axiosClient";
import { AddIcon, FolderIcon } from "@/components/atoms/icons";
import { Folder as MuiFolderIcon } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useGenerationStore } from "@/stores/generationStore";

export default function ManageGenerationModal({
  generationId,
  trigger,
  actionType,
}: {
  generationId?: string;
  trigger?: React.ReactNode;
  actionType: "save" | "move";
}) {
  const t = useTranslations(`functions.save-generation-modal`);
  const mt = useTranslations("projects.move_generation_button");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    data,
    setData,
    selectedFolderId,
    setSelectedFolderId,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    getAllProjects,
    handleCreate,
    isLoading,
    setIsLoading,
    isCreating,
    setIsCreating,
    isLoadingCreate,
    inputValue,
    setInputValue,
  } = useProjectStore();
  const { selectedGenerations, setSelectedGenerations } = useGenerationStore();
  const [isInSubFolder, setIsInSubFolder] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const { user } = useUserStore();
  const { currentGenerationIdRef } = useFnStore();
  const isSaveMode = actionType === "save";

  useEffect(() => {
    if (user?.id) {
      getAllProjects();
    }
  }, [getAllProjects, user?.id]);

  useEffect(() => {
    if (projects) {
      setData(projects);
    }
  }, [projects, setData]);

  const handleProjectClick = (file: any) => {
    if (!file.project_id) {
      // Se não tem project_id, é um projeto
      setSelectedProjectId(file.id);
      setSelectedFolderId(null);
      if (file.pastes) {
        setData(file.pastes as Folder[]);
        setIsInSubFolder(true);
      }
    } else {
      // Caso contrário, é uma pasta
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

  const handleAction = async () => {
    setIsLoading(true);
    const generationsIds = isSaveMode
      ? [generationId || currentGenerationIdRef.id]
      : selectedGenerations;

    const body = {
      generations_ids: generationsIds,
      paste_id: selectedFolderId || null,
      project_id: selectedProjectId,
      user_uuid: user?.id,
    };

    try {
      const response = await axiosClient.patch("/api/my-generation", body);

      if (response.status === 200) {
        toast.use("success", isSaveMode ? t("SVGNM-S200") : mt("success_move"));
        if (!isSaveMode) setSelectedGenerations([]);
        onOpenChange();
      } else {
        toast.use("error", isSaveMode ? t("SVGNM-G500") : mt("error_move"));
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.use("error", isSaveMode ? t("SVGNM-D400") : mt("error_move"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger as React.ReactElement, {
          onClick: () => {
            handleGoBack();
            onOpen();
          },
        })
      ) : (
        <Button
          onPress={() => {
            handleGoBack();
            onOpen();
          }}
          size="sm"
          variant="bordered"
        >
          {isSaveMode ? t("save") : mt("move")}
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
          <ModalHeader className="flex flex-col gap-1 text-center justify-center">
            <h1 className="text-base xs:text-xl text-center font-semibold">
              {isSaveMode
                ? t("title")
                : isInSubFolder
                ? mt("select_folder")
                : mt("select_project")}
            </h1>
            {isSaveMode && (
              <p className="text-xs lg:text-sm font-medium text-font-lighter">
                {t("subtitle")}
              </p>
            )}
          </ModalHeader>
          <ScrollShadow className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4 px-6 max-h-80 overflow-y-scroll scrollbar">
            <NewFolderCard
              project={!isInSubFolder}
              onCreate={() => setIsCreating(true)}
            />
            {data?.map((item: any) => {
              const {
                id,
                name,
                total_pastes = 0,
                total_generations = 0,
                pastes,
              } = item;
              const count = total_pastes + total_generations;
              const type = pastes ? "project" : "folder";

              return (
                <FolderCard
                  key={id}
                  name={name}
                  count={count}
                  type={type}
                  onPress={() => handleProjectClick(item)}
                  isSelected={
                    selectedFolderId === id || selectedProjectId === id
                  }
                />
              );
            })}
          </ScrollShadow>
          <ModalFooter>
            <Button
              variant="bordered"
              className="flex-1 btn"
              onPress={handleGoBack}
              isDisabled={isLoading}
            >
              {t("back")}
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              onPress={handleAction}
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
              {isInSubFolder ? t("create-folder") : t("create_project")}
            </h1>
          </ModalHeader>
          <ModalBody>
            <Input
              label={isInSubFolder ? t("folder_name") : t("project_name")}
              variant="bordered"
              labelPlacement="outside"
              placeholder={
                isInSubFolder
                  ? t("placeholder_folder")
                  : t("placeholder_project")
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
  const t = useTranslations("functions.save-generation-modal");

  return (
    <div
      onClick={onPress}
      className={`card-folder cursor-pointer group animate-appearance-in hover:bg-gray-100 h-32 select-none flex-1 p-1
              ${
                isSelected &&
                "border-primary-400 bg-primary-50 hover:bg-primary-100"
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
          {count > 0 ? `${count} ${t("files")}` : t("empty")}
        </p>
        <p className="text-base text-font group-hover:text-font/75 font-medium truncate">
          {name}
        </p>
      </div>
    </div>
  );
};

export const NewFolderCard = ({
  project,
  onCreate,
}: {
  project?: boolean;
  onCreate: () => void;
}) => {
  const t = useTranslations("functions.save-generation-modal");

  return (
    <div
      onClick={onCreate}
      className="card-folder cursor-pointer group animate-appearance-in hover:bg-vivid-blue-50"
    >
      <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
        <AddIcon />
        <p className="text-sm font-semibold text-center text-font">
          {project ? t("create_project") : t("create-folder")}
        </p>
      </div>
    </div>
  );
};
