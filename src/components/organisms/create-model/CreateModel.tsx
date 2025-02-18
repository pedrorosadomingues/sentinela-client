import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { AddReactionOutlined } from "@mui/icons-material";
import { ModelGenderSelection, ModelCustomization, ModelResult } from "./misc";
import {
  ModelCustomizationsProps,
  useCreateModelStore,
} from "@/zustand-stores/createModelStore";

type CreateModelButtonProps = {
  onModelSelect: (imagePath: string) => void;
  isDisabled: boolean;
};

export default function CreateModelButton({
  onModelSelect,
  isDisabled,
}: CreateModelButtonProps) {
  const t = useTranslations("choose_model_modal");
  const {
    step,
    setStep,
    isLoading,
    setIsLoading,
    selectedModel,
    selectedCustomizations,
    setGeneratedModel,
    defaultModels,
  } = useCreateModelStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleCreateModel = () => {
    setIsLoading(true);
    setGeneratedModel(
      (defaultModels && (defaultModels[0]?.image_path as string)) ||
        "https://heroui.com/images/hero-card.jpeg"
    );
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleUseModel = () => {
    onModelSelect(selectedModel as string);
    onOpenChange();
  };

  const isModelReadyToCreation = (
    customizations: ModelCustomizationsProps | null
  ): boolean => {
    if (!customizations) return false;

    const requiredFields: (keyof ModelCustomizationsProps)[] = [
      "gender",
      "skinTone",
      "eyeShape",
      "eyeColor",
      "hairStyle",
      "hairColor",
      "age",
      "height",
      "bodyType",
    ];

    return requiredFields.every((field) => Boolean(customizations[field]));
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="secondary"
        className="w-full text-sm dt-seventh-step"
        size="lg"
        radius="sm"
        isDisabled={isDisabled}
        startContent={<AddReactionOutlined />}
      >
        {t("model_creator_button")}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isLoading ? () => {} : onOpenChange}
        isDismissable={!isLoading}
        placement="center"
        shouldBlockScroll={false}
      >
        <ModalContent className="min-w-80 min-h-56 w-fit max-w-2xl">
          <ModalHeader className="text-sm sm:text-base lg:text-lg">
            {step === 0 && "Escolha um modelo base"}
            {step === 1 && "Personalize o modelo"}
            {step === 2 && "Resultado do modelo"}
          </ModalHeader>
          <ModalBody className="w-full h-full min-h-56 flex items-center justify-center">
            {step === 0 && <ModelGenderSelection />}
            {step === 1 && <ModelCustomization />}
            {step === 2 && <ModelResult />}
          </ModalBody>
          <ModalFooter>
            <Button
              radius="sm"
              variant="bordered"
              onPress={() => {
                if (step > 0) {
                  setStep(step - 1);
                } else {
                  onOpenChange();
                }
              }}
              isDisabled={isLoading}
            >
              {step === 0 ? "Cancelar" : "Voltar"}
            </Button>
            <Button
              color="secondary"
              radius="sm"
              onPress={() => {
                if (step === 2) {
                  handleUseModel();
                } else if (step === 1) {
                  handleCreateModel();
                } else {
                  setStep(step + 1);
                }
              }}
              isLoading={isLoading}
              isDisabled={
                isLoading ||
                (step === 0 && !selectedModel) ||
                (step === 1 && !isModelReadyToCreation(selectedCustomizations))
              }
            >
              {step === 2
                ? "Utilizar modelo"
                : step === 1
                ? "Gerar modelo personalizado"
                : "Próximo"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
