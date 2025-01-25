import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ScrollShadow,
  Card,
  CardFooter,
  Image,
} from "@heroui/react";
import { useTranslations } from "next-intl";

type ChooseModelButtonProps = {
  onModelSelect: (imagePath: string) => void;
};

export default function ChooseModelButton({
  onModelSelect,
}: ChooseModelButtonProps) {
  const t = useTranslations("choose_model_modal");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSelectModel = (imagePath: string) => {
    onModelSelect(imagePath);
    onOpenChange();
  };

  return (
    <>
      <Button onPress={onOpen} color="secondary" size="lg" className="w-fit">
        {t("choose_model_button")}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <ModalHeader>{t("title")}</ModalHeader>
          <ScrollShadow className="max-h-96 w-full scrollbar" size={20}>
            <ModalBody className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {models.map((model) => (
                <Card
                  key={model.id}
                  className="m-0 p-0 group relative overflow-hidden"
                  shadow="none"
                  radius="lg"
                >
                  <Image
                    alt={`Image of ${model.name}`}
                    className="object-cover"
                    height={200}
                    src={model.image}
                    width={200}
                  />
                  <CardFooter className="group-hover:-translate-y-0 transition-all ease-in-out translate-y-24 w-full px-2 items-center justify-between bg-black/70 py-2 absolute bottom-0 left-0 shadow-small z-10">
                    <p className="text-tiny text-white/80">{model.name}</p>
                    <Button
                      color="secondary"
                      size="sm"
                      onPress={() => handleSelectModel(model.image)}
                    >
                      {t("select_button")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </ModalBody>
          </ScrollShadow>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
}

type Model = {
  id: string;
  name: string;
  image: string;
};

const models: Model[] = [
  {
    id: "1",
    name: "Model 1",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "2",
    name: "Model 2",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "3",
    name: "Model 3",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "1a",
    name: "Model 1",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "25",
    name: "Model 2",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "33",
    name: "Model 3",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "12",
    name: "Model 1",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "21",
    name: "Model 2",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
  {
    id: "32",
    name: "Model 3",
    image: "https://heroui.com/images/hero-card.jpeg",
  },
];
