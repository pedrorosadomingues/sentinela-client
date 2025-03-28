"use client";

import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import { AddOutlined } from "@mui/icons-material";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function AddButton() {
  const t = useTranslations("member.modal_create_project");
  const { isOpen, onOpenChange } = useDisclosure();
  const { handleCreate, setIsLoadingCreate, isLoadingCreate } = useProjectStore();
  const { user } = useUserStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const { id: projectId } = params;
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<string>("");

  // Define os itens do dropdown
  const dropdownItems = [
    { key: "new-folder", label: t("new_folder_label"), show: !!projectId },
    { key: "new-project", label: t("new_project_label"), show: !projectId },
    { key: "new-generation", label: t("generate_image_label"), show: true },
  ];

  // Lida com o envio do formulário (criação de projeto ou pasta)
  const handleSubmit = async () => {
    if (!inputValue && inputRef.current) {
      inputRef.current.focus();
      return;
    }

    setIsLoadingCreate(true);

    // Decide o tipo de criação baseado na chave selecionada
    if (selectedKey === "new-project") {
      await handleCreate("project", inputValue);
    } else if (selectedKey === "new-folder") {
      await handleCreate("folder", inputValue);
    }

    // Após a criação, fecha o modal e limpa os campos
    setIsLoadingCreate(false);
    setInputValue("");
    onOpenChange();
  };

  // Define a chave selecionada (pasta ou projeto) e navega, se necessário
  const handleSelectedKey = (key: string) => {
    setSelectedKey(key);

    if (key !== "new-generation") {
      onOpenChange();
    } else {
      router.push(`/member/render`);
    }
  };

  return (
    <>
      <Dropdown placement="bottom-end" backdrop="opaque">
        <DropdownTrigger>
          <Button
            variant="bordered"
            size="sm"
            startContent={<AddOutlined fontSize="small" />}
          >
            {t("add_btn")}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Add projects actions"
          variant="flat"
          onAction={(key) => handleSelectedKey(key as string)}
        >
          {dropdownItems
            .filter((item) => item.show)
            .map((item) => (
              <DropdownItem key={item.key} textValue={item.label}>
                <p className="font-medium">{item.label}</p>
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>

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
              {selectedKey === "new-project"
                ? t("title_project")
                : selectedKey === "new-folder" && t("title_folder")}
            </h1>
          </ModalHeader>
          <ModalBody className="">
            <Input
              label={t("input_label")}
              variant="bordered"
              labelPlacement="outside"
              placeholder={t("input_placeholder")}
              value={inputValue}
              ref={inputRef}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              className="flex-1"
              onPress={onOpenChange}
            >
              {t("cancel")}
            </Button>
            <Button
              color="primary"
              isLoading={isLoadingCreate}
              onPress={handleSubmit}
              className="flex-1"
            >
              {t("submit_2")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
