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

type ChooseModelButtonProps = {
  onModelSelect: (imagePath: string) => void;
};

export default function ChooseModelButton({
  onModelSelect,
}: ChooseModelButtonProps) {
  const t = useTranslations("choose_model_modal");
  const locale = useLocale();
  const [customModelImage, setCustomModelImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSelectModel = (imagePath: string) => {
    onModelSelect(imagePath);
    onOpenChange();
  };

  return (
    <>
      <Button onPress={onOpen} color="secondary" size="lg" radius="sm">
        {t("choose_model_button")}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalBody className="flex-row gap-4">
            <aside className="basis-3/5 flex flex-col gap-4">
              <Textarea
                label={t("generate_label")}
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                placeholder={t("generate_placeholder")}
                className="w-full"
                defaultValue={prompt as string}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button color="secondary" radius="sm" className="w-full">
                {t("generate_button")}
              </Button>
              <Card
                className="m-0 p-0 group relative overflow-hidden"
                shadow="none"
                radius="lg"
              >
                {customModelImage ? (
                  <div className="w-full">
                    <Image
                      alt={`Image of your custom model`}
                      className="object-cover"
                      height={200}
                      src={customModelImage}
                      width={200}
                    />
                  </div>
                ) : (
                  <div className="h-full grid grid-cols-2 gap-4">
                    {suggestions.map(
                      (suggestion) =>
                        suggestion.locale === locale && (
                          <Card
                            key={suggestion.id}
                            shadow="none"
                            radius="sm"
                            className="flex-1 border border-gray-200 p-2 cursor-pointer"
                            onPress={() => setPrompt(suggestion.text)}
                          >
                            <p className="text-sm">{suggestion.text}</p>
                          </Card>
                        )
                    )}
                  </div>
                )}
              </Card>
            </aside>
            <ScrollShadow
              className="max-h-96 w-full basis-3/5 scrollbar grid grid-cols-1 md:grid-cols-2 gap-4"
              size={20}
            >
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
  {
    id: "32",
    name: "Model 3",
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
    locale: "pt-br",
    text: "Foto de corpo inteiro de um modelo em um parque. O modelo está usando uma camiseta azul e calça jeans. Fundo com árvores verdes."
  },
  {
    id: "2",
    locale: "pt-br",
    text: "Foto de plano médio de um modelo posando em um estúdio. O modelo veste um vestido vermelho elegante. Fundo cinza neutro."
  },
  {
    id: "3",
    locale: "pt-br",
    text: "Imagem de close-up de um modelo sorrindo. O modelo está usando um blazer preto. Fundo desfocado de um ambiente interno."
  },
  {
    id: "4",
    locale: "pt-br",
    text: "Foto ao ar livre de um modelo sentado em uma escadaria. O modelo veste uma jaqueta de couro marrom e botas. Fundo urbano."
  },
  {
    id: "5",
    locale: "en",
    text: "Full-body shot of a model in a park. The model is wearing a blue t-shirt and jeans. Background with green trees."
  },
  {
    id: "6",
    locale: "en",
    text: "Medium shot of a model posing in a studio. The model is wearing an elegant red dress. Neutral gray background."
  },
  {
    id: "7",
    locale: "en",
    text: "Close-up shot of a smiling model. The model is wearing a black blazer. Blurred background of an indoor setting."
  },
  {
    id: "8",
    locale: "en",
    text: "Outdoor photo of a model sitting on a staircase. The model is wearing a brown leather jacket and boots. Urban background."
  },
  {
    id: "9",
    locale: "es",
    text: "Foto de cuerpo entero de un modelo en un parque. El modelo lleva una camiseta azul y jeans. Fondo con árboles verdes."
  },
  {
    id: "10",
    locale: "es",
    text: "Foto de plano medio de un modelo posando en un estudio. El modelo lleva un elegante vestido rojo. Fondo gris neutro."
  },
  {
    id: "11",
    locale: "es",
    text: "Imagen de primer plano de un modelo sonriendo. El modelo lleva un blazer negro. Fondo desenfocado de un entorno interior."
  },
  {
    id: "12",
    locale: "es",
    text: "Foto al aire libre de un modelo sentado en una escalera. El modelo lleva una chaqueta de cuero marrón y botas. Fondo urbano."
  },
];
