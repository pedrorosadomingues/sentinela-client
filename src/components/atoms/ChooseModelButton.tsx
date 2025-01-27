import React, { useState } from "react";
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
  Textarea,
} from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { CloseOutlined } from "@mui/icons-material";

type ChooseModelButtonProps = {
  onModelSelect: (imagePath: string) => void;
};

export default function ChooseModelButton({
  onModelSelect,
}: ChooseModelButtonProps) {
  const t = useTranslations("choose_model_modal");
  const locale = useLocale();
  const [customModelImage, setCustomModelImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSelectModel = (imagePath: string) => {
    onModelSelect(imagePath);
    onOpenChange();
  };

  const handleGenerateCustomModel = () => {
    setIsLoading(true);
    // Call the API to generate a custom
    // model based on the prompt

    setTimeout(() => {
      setCustomModelImage("https://heroui.com/images/hero-card.jpeg");
      setIsLoading(false);
    }, 4000);
  };

  return (
    <>
      <Button onPress={onOpen} color="secondary" size="lg" radius="sm">
        {t("choose_model_button")}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalBody className="flex-row gap-4 max-h-[500px]">
            <aside className="basis-3/5 flex flex-col max-h-full gap-4">
              <div className="flex flex-col gap-4">
                <Textarea
                  label={t("generate_label")}
                  labelPlacement="outside"
                  variant="bordered"
                  radius="sm"
                  placeholder={t("generate_placeholder")}
                  className="w-full"
                  isDisabled={isLoading}
                  defaultValue={prompt as string}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button
                  color="secondary"
                  radius="sm"
                  className="w-full"
                  isLoading={isLoading}
                  onPress={handleGenerateCustomModel}
                >
                  {t("generate_button")}
                </Button>
              </div>

              {customModelImage ? (
                <Card
                  className="m-0 p-0 group relative overflow-hidden w-full"
                  shadow="none"
                  radius="sm"
                >
                  <div className="w-full h-full">
                    <Image
                      alt={`Image of custom model`}
                      className="object-cover w-full h-full"
                      src={customModelImage as string}
                    />
                    <CardFooter className="group-hover:-translate-y-0 transition-all ease-in-out translate-y-24 w-full px-2 items-center justify-between bg-black/70 py-2 absolute bottom-0 left-0 shadow-small z-10">
                      <p className="text-tiny text-white/80 line-clamp-1">
                        {prompt}
                      </p>
                      <Button
                        color="secondary"
                        size="sm"
                        radius="sm"
                        onPress={() =>
                          handleSelectModel(customModelImage as string)
                        }
                      >
                        {t("select_button")}
                      </Button>
                    </CardFooter>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      className="absolute z-10 top-2 right-2"
                      onPress={() => setCustomModelImage(null)}
                    >
                      <CloseOutlined fontSize="small" />
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="h-full grid grid-cols-2 gap-4">
                  {suggestions.map(
                    (suggestion) =>
                      suggestion.locale === locale && (
                        <div
                          key={suggestion.id}
                          className={`
                              ${
                                isLoading
                                  ? "opacity-50 pointer-events-none cursor-not-allowed"
                                  : "opacity-100"
                              }
                              flex-1 h-full p-2 border border-gray-200 rounded-lg cursor-pointer select-none`}
                          onClick={() => setPrompt(suggestion.text)}
                        >
                          <p className="text-sm line-clamp-3">
                            {suggestion.text}
                          </p>
                        </div>
                      )
                  )}
                </div>
              )}
            </aside>
            <ScrollShadow
              as="aside"
              className="pr-2 max-h-full w-full basis-3/5 scrollbar grid grid-cols-1 md:grid-cols-2 gap-4"
              size={10}
            >
              {models.map((model) => (
                <Card
                  key={model.id}
                  className="m-0 p-0 group relative overflow-hidden min-h-40"
                  shadow="none"
                  radius="sm"
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
            </ScrollShadow>
          </ModalBody>
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
];

type SuggestionProps = {
  id: string;
  text: string;
  locale: "pt-br" | "en" | "es";
};

const suggestions: SuggestionProps[] = [
  {
    id: "1",
    locale: "en",
    text: "Full-body shot of a model walking down a city street. The model is wearing a white shirt and black pants. Urban skyscrapers in the background.",
  },
  {
    id: "2",
    locale: "en",
    text: "Studio shot of a model with a neutral expression. The model is wearing a colorful sweater. Plain light gray background.",
  },
  {
    id: "3",
    locale: "en",
    text: "Action shot of a model running on the beach. The model is wearing athletic wear. Waves and sand visible in the background.",
  },
  {
    id: "4",
    locale: "en",
    text: "Candid photo of a model holding a coffee cup. The model is wearing a casual hoodie. Background shows a cozy café.",
  },
  {
    id: "5",
    locale: "en",
    text: "Portrait of a model wearing traditional clothing. The model is standing in a lush garden. Bright flowers and greenery in the background.",
  },
  {
    id: "6",
    locale: "en",
    text: "Evening shot of a model under a streetlamp. The model is wearing a long coat and scarf. Dimly lit urban setting in the background.",
  },
];
