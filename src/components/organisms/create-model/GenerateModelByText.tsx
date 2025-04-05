/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useToast } from "@/hooks/useToast";
import { axiosClient } from "@/lib/axios/axiosClient";
import { useCreateModelStore } from "@/stores/createModelStore";
import { useImageFromTextStore } from "@/stores/imageFromTextStore";
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
import { CircularProgress } from "@mui/material";

type GenerateModelByTextProps = {
  onModelSelect: (imagePath: string) => void;
  isDisabled: boolean;
};

const generateCustomModelSchema = z.object({
  // Traduzido
  prompt: z.string().nonempty("O prompt é obrigatório"),
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
  const [customModelImages, setCustomModelImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(
    null
  );
  const toast = useToast();
  const locale = useLocale();
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

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

  const handleGenerateModelByText = async (values: FormValues) => {
    setIsSubmitting(true);
    setPrompt(values.prompt);
    setCustomModelImages([]);
    setShowSuggestions(false);

    const submitFormData = {
      engine: "cf",
      fnName: "txt2img",
      originalPrompt: values.prompt,
      suggestions: values.prompt,
      format: "free", // Pode ser ajustado conforme necessário
      extraOpts: { seed: -1, imageCount: 4 },
    };

    try {
      const result = await useImageFromTextStore
        .getState()
        .handleSubmitTxt2Img(submitFormData);

      if (result && result.generation_id) {
        setCurrentGenerationId(result.generation_id);
        setCustomModelImages(result.generation_url || []);
      } else {
        toast.use("error", "Ocorreu um erro ao gerar imagens");
      }
    } catch (error) {
      console.error("Erro ao gerar imagens:", error);
      toast.use("error", "Ocorreu um erro ao gerar imagens");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectModel = (imagePath: string) => {
    onModelSelect(imagePath);
    onOpenChange();
  };

  const handleImageClick = (imagePath: string) => {
    // Abrir imagem em tela cheia
    window.open(imagePath, "_blank");
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
        scrollBehavior="inside"
      >
        <ModalContent className="w-fit">
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalBody className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4 w-full"
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

              {showSuggestions && (
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
                      onClick={() => {
                        formik.setFieldValue("prompt", suggestion.text);
                      }}
                    >
                      <p className="text-sm line-clamp-3">{suggestion.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {customModelImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {customModelImages.map((imagePath, index) => (
                  <div key={index} className="relative">
                    <Image
                      alt={`Modelo gerado ${index + 1}`}
                      className="object-cover aspect-square w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      src={imagePath}
                      onClick={() => handleSelectModel(imagePath)}
                      onDoubleClick={() => handleImageClick(imagePath)}
                      isLoading={isSubmitting}
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        className="bg-transparent hover:bg-black hover:bg-opacity-30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(imagePath);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isSubmitting && (
              <div className="flex justify-center items-center p-4">
                <CircularProgress size={40} />
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
