/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from "@/hooks/useToast";
import { axiosClient } from "@/lib/axios/axiosClient";
import { useCreateModelStore } from "@/stores/createModelStore";
import {
  Button,
  Card,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { ChatOutlined, CloseOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { z } from "zod";

type GenerateModelByTextProps = {
  onModelSelect: (imagePath: string) => void;
  isDisabled: boolean;
};

const generateCustomModelSchema = z.object({
  // TO DO traduzir aqui
  prompt: z.string().nonempty("Prompt is required"),
});

type FormValues = z.infer<typeof generateCustomModelSchema>;

export default function GenerateModelByText({
  onModelSelect,
  isDisabled,
}: GenerateModelByTextProps) {
  const t = useTranslations("choose_model_modal");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { modelSuggestions, setModelSuggestions, defaultModels } =
    useCreateModelStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [customModelImage, setCustomModelImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const toast = useToast();
  const locale = useLocale();

  const fetchSuggestions = async () => {
    setIsLoading(true);

    try {
      const response = await axiosClient.get(
        `/model-default/suggestion/${locale}`
      );

      if (response.status === 200) {
        setModelSuggestions(response.data);
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
    if (isOpen && !modelSuggestions) fetchSuggestions();
  }, [isOpen, modelSuggestions]);

  const handleGenerateModelByText = (values: FormValues) => {
    setIsSubmitting(true);
    setPrompt(values.prompt);
    // Call the API to generate a custom
    // model based on the prompt
    console.log(values.prompt);

    setTimeout(() => {
      setCustomModelImage(
        (defaultModels && (defaultModels[0]?.image_path as string)) ||
          "https://heroui.com/images/hero-card.jpeg"
      );
      setIsSubmitting(false);
    }, 2000);
  };

  const handleSelectModel = (imagePath: string) => {
    onModelSelect(imagePath);
    onOpenChange();
  };

  const formik = useFormik({
    initialValues: {
      prompt: "",
    },
    validate: withZodSchema(generateCustomModelSchema),
    onSubmit: (values) => handleGenerateModelByText(values),
  });

  return (
    <>
      <Button
        onPress={onOpen}
        color="secondary"
        className="w-full text-sm dt-sixth-step"
        radius="sm"
        size="lg"
        isDisabled={isDisabled}
        startContent={<ChatOutlined />}
      >
        {t("model_by_text_button")}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={isSubmitting ? () => {} : onOpenChange}
        size="2xl"
        className="pb-4"
        shouldBlockScroll={false}
        isDismissable={!isSubmitting}
      >
        <ModalContent className="w-fit">
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalBody className="xs:max-h-[500px] flex flex-col md:flex-row max-h-full gap-4">
            <form
              onSubmit={formik.handleSubmit}
              className={`flex flex-col gap-4 sm:min-w-80 transition-all ease-soft-spring ${
                customModelImage ? "basis-1/3" : "basis-full"
              }`}
            >
              <Textarea
                label={t("generate_label")}
                labelPlacement="outside"
                variant="bordered"
                radius="sm"
                placeholder={t("generate_placeholder")}
                className="w-full"
                maxRows={3}
                isDisabled={isSubmitting}
                id="prompt"
                name="prompt"
                onChange={formik.handleChange}
                value={formik.values.prompt}
                isInvalid={formik.errors.prompt ? true : false}
              />
              <Button
                color="secondary"
                radius="sm"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                type="submit"
              >
                {t("generate_button")}
              </Button>

              <div className="hidden xs:grid grid-cols-2 gap-4">
                {modelSuggestions?.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`
                              ${
                                isLoading
                                  ? "opacity-50 pointer-events-none cursor-not-allowed"
                                  : "opacity-100"
                              }
                              flex-1 h-full p-2 border border-gray-200 rounded-lg cursor-pointer select-none`}
                    onClick={() =>
                      formik.setFieldValue("prompt", suggestion.text)
                    }
                  >
                    <p className="text-sm line-clamp-3">{suggestion.text}</p>
                  </div>
                ))}
              </div>
            </form>

            {customModelImage && (
              <aside className="flex flex-col justify-between transition-all ease-soft-spring">
                <div className="relative w-full">
                  <Image
                    alt={`Image of custom model`}
                    className="object-contain aspect-square w-72 lg:w-96 h-full"
                    src={customModelImage as string}
                    isLoading={isLoading}
                  />

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

                <Button
                  color="secondary"
                  size="lg"
                  className="w-full"
                  onPress={() => handleSelectModel(customModelImage as string)}
                >
                  Utilizar modelo
                </Button>
              </aside>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
