/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ScrollShadow,
  Card,
  CardFooter,
  Image,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaceOutlined } from "@mui/icons-material";
import axiosClient from "@/lib/axios/axiosClient";
import { useToast } from "@/hooks/useToast";
import { useCreateModelStore } from "@/zustand-stores/createModelStore";

type ChooseDefaultModelProps = {
  onModelSelect: (imagePath: string) => void;
};

export default function ChooseDefaultModel({
  onModelSelect,
}: ChooseDefaultModelProps) {
  const { defaultModels, setDefaultModels } = useCreateModelStore();
  const t = useTranslations("choose_model_modal");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const toast = useToast();

  const fetchModels = async () => {
    setIsLoading(true);

    try {
      const response = await axiosClient.get("/model-default");

      if (response.status === 200) {
        setDefaultModels(response.data);
      }
    } catch (error) {
      console.error("Error while fetching models:", error);
      onOpenChange();
      // TO DO traduzir aqui
      toast.use("error", "Error while fetching models");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!defaultModels) fetchModels();
  }, [isOpen, defaultModels]);

  const handleSelectModel = (imagePath: string) => {
    onModelSelect(imagePath);
    onOpenChange();
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="secondary"
        className="w-full text-sm"
        size="lg"
        radius="sm"
        startContent={<FaceOutlined />}
      >
        {t("choose_model_button")}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isLoading ? () => {} : onOpenChange}
        size="2xl"
        className="pb-4"
        shouldBlockScroll={false}
        isDismissable={!isLoading}
      >
        <ModalContent>
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalBody className="xs:flex-row gap-4 xs:max-h-[500px]">
            <ScrollShadow
              as="aside"
              className="w-full xs:pr-2 max-h-60 xs:max-h-full scrollbar grid grid-cols-2 xs:grid-cols-[repeat(3,1fr)] gap-2 lg:gap-4"
              size={10}
            >
              {isLoading
                ? [...Array(9)].map((_, index) => (
                    <Card
                      key={index}
                      className="m-0 p-0 group relative overflow-hidden min-h-32 w-full xs:min-h-40 xs:w-full"
                      shadow="none"
                      radius="sm"
                    >
                      <Image
                        alt="Loading skeleton"
                        className="object-cover"
                        height={200}
                        width={200}
                        isLoading={true}
                      />
                    </Card>
                  ))
                : defaultModels?.map((model) => (
                    <Card
                      key={model.id}
                      className="m-0 p-0 group relative overflow-hidden min-h-32 w-full xs:min-h-40 xs:w-full"
                      shadow="none"
                      radius="sm"
                    >
                      <Image
                        alt={`Image of ${model.label}`}
                        className="object-cover"
                        loading="eager"
                        height={200}
                        src={model.image_path}
                        width={200}
                      />
                      <CardFooter className="group-hover:-translate-y-0 transition-all ease-in-out translate-y-24 w-full px-2 items-center justify-between bg-black/70 py-2 absolute bottom-0 left-0 shadow-small z-10">
                        <p className="hidden xs:block text-tiny text-white/80">
                          {model.label}
                        </p>
                        <Button
                          color="secondary"
                          size="sm"
                          onPress={() => handleSelectModel(model.image_path)}
                        >
                          {t("select_button")}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
            </ScrollShadow>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
