import React, { useState } from "react";
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
  Textarea,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  AddReactionOutlined,
  ChatOutlined,
  CloseOutlined,
  FaceOutlined,
} from "@mui/icons-material";
import { useFormik } from "formik";
import { z } from "zod";
import { withZodSchema } from "formik-validator-zod";

type ChooseModelButtonProps = {
  onModelSelect: (imagePath: string) => void;
};

const generateCustomModelSchema = z.object({
  prompt: z.string().nonempty("Prompt is required"),
});

type FormValues = z.infer<typeof generateCustomModelSchema>;

interface TriggerProps {
  key: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export default function ChooseModelButton({
  onModelSelect,
}: ChooseModelButtonProps) {
  const t = useTranslations("choose_model_modal");
  const [customModelImage, setCustomModelImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSelectModel = (imagePath: string) => {
    onModelSelect(imagePath);
    onOpenChange();
  };

  const handleGenerateCustomModel = (values: FormValues) => {
    setIsLoading(true);
    setPrompt(values.prompt);
    // Call the API to generate a custom
    // model based on the prompt
    console.log(values.prompt);

    setTimeout(() => {
      setCustomModelImage("https://heroui.com/images/hero-card.jpeg");
      setIsLoading(false);
    }, 4000);
  };

  const formik = useFormik({
    initialValues: {
      prompt: "",
    },
    validate: withZodSchema(generateCustomModelSchema),
    onSubmit: (values) => handleGenerateCustomModel(values),
  });

  const GenerateCustomModelContent = () => {
    return (
      <aside className="basis-4/5 sm:basis-3/5 flex flex-col max-h-full gap-4">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <Textarea
            label={t("generate_label")}
            labelPlacement="outside"
            variant="bordered"
            radius="sm"
            placeholder={t("generate_placeholder")}
            className="w-full"
            maxRows={3}
            isDisabled={isLoading}
            id="prompt"
            name="prompt"
            onChange={formik.handleChange}
            value={formik.values.prompt}
            isInvalid={formik.errors.prompt ? true : false}
          />
          <Button
            color="secondary"
            radius="sm"
            className="w-full"
            isLoading={isLoading}
            type="submit"
          >
            {t("generate_button")}
          </Button>
        </form>

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
                isLoading={isLoading}
              />
              <CardFooter className="group-hover:-translate-y-0 transition-all ease-in-out translate-y-24 w-full px-2 items-center justify-between bg-black/70 py-2 absolute bottom-0 left-0 shadow-small z-10">
                <p className="text-tiny text-white/80 line-clamp-1">{prompt}</p>
                <Button
                  color="secondary"
                  size="sm"
                  radius="sm"
                  isDisabled={isLoading}
                  onPress={() => handleSelectModel(customModelImage as string)}
                >
                  {t("select_button")}
                </Button>
              </CardFooter>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                className="absolute z-10 top-2 right-2"
                isDisabled={isLoading}
                onPress={() => setCustomModelImage(null)}
              >
                <CloseOutlined fontSize="small" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="h-full hidden xs:grid grid-cols-2 gap-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`
                              ${
                                isLoading
                                  ? "opacity-50 pointer-events-none cursor-not-allowed"
                                  : "opacity-100"
                              }
                              flex-1 h-full p-2 border border-gray-200 rounded-lg cursor-pointer select-none`}
                onClick={() => formik.setFieldValue("prompt", suggestion.text)}
              >
                <p className="text-sm line-clamp-3">{suggestion.text}</p>
              </div>
            ))}
          </div>
        )}
      </aside>
    );
  };

  const SelectRedrawModels = () => {
    return (
      <ScrollShadow
        as="aside"
        className="xs:pr-2 max-h-60 xs:max-h-full basis-2/5 sm:basis-3/5 scrollbar grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 gap-4"
        size={10}
      >
        {models.map((model) => (
          <Card
            key={model.id}
            className="m-0 p-0 group relative overflow-hidden min-h-32 w-full xs:min-h-40 xs:w-full"
            shadow="none"
            radius="sm"
            onTouchStart={() => handleSelectModel(model.image)}
          >
            <Image
              alt={`Image of ${model.name}`}
              className="object-cover"
              height={200}
              src={model.image}
              width={200}
            />
            <CardFooter className="group-hover:-translate-y-0 transition-all ease-in-out translate-y-24 w-full px-2 items-center justify-between bg-black/70 py-2 absolute bottom-0 left-0 shadow-small z-10">
              <p className="hidden xs:block text-tiny text-white/80">
                {model.name}
              </p>
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
    );
  };

  const triggers: TriggerProps[] = [
    {
      key: "select-redraw-models",
      label: t("choose_model_button"),
      icon: <FaceOutlined />,
      onPress: () => onOpen(),
    },
    {
      key: "generate-model-by-text",
      label: t("model_by_text_button"),
      icon: <ChatOutlined />,
      onPress: () => onOpen(),
    },
    {
      key: "generate-custom-model",
      label: t("model_creator_button"),
      icon: <AddReactionOutlined />,
      onPress: () => onOpen(),
    },
  ];

  return (
    <nav className="w-full space-y-4 mt-6">
      {triggers.map((trigger) => (
        <Button
          key={trigger.key}
          onPress={trigger.onPress}
          color="secondary"
          className="w-full text-sm"
          size="lg"
          radius="sm"
          startContent={trigger.icon}
        >
          {trigger.label}
        </Button>
      ))}

      <Modal
        isOpen={isOpen}
        onClose={isLoading ? () => {} : onOpenChange}
        size="2xl"
        className="pb-4"
        isDismissable={!isLoading}
      >
        <ModalContent>
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalBody className="xs:flex-row gap-4 xs:max-h-[500px]">
            <GenerateCustomModelContent />
            <SelectRedrawModels />
          </ModalBody>
        </ModalContent>
      </Modal>
    </nav>
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
  locale: "pt-br" | "en" | "es"; // to show the suggestion in the correct language
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
