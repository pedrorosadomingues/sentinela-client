/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import DropImageForm from "@/components/molecules/functions/render-traces/DropImageForm";
import GenerateImageButton from "@/components/atoms/buttons/GenerateImageButton";
import SuggestionInput from "@/components/atoms/inputs/SuggestionInput";
import { useFnStore } from "@/stores/fnStore";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReferenceImage from "@/components/molecules/functions/render-traces/ReferenceImage";
import { useToast } from "@/hooks/useToast";
import GeneratorTopActions from "@/components/atoms/inputs/GeneratorTopActions";
import ImageAreaEmpty from "@/components/molecules/functions/render-traces/ImageAreaEmpty";
import ImageAreaFilled from "@/components/molecules/functions/render-traces/ImageAreaFilled";
import { usePathname } from "next/navigation";
import ComposerController from "@/components/molecules/composer/ComposerController";
import MaskController from "@/components/molecules/MaskController";
import EnhancementButton from "@/components/atoms/buttons/EnhancementButton";
import FeedbackGeneration from "@/components/molecules/feedback/FeedbackGeneration";

const renderTracesSchema = z.object({
  suggestions: z.array(z.string()).optional(),
  referenceImage: z.string().optional(),
});

type FormInputs = z.infer<typeof renderTracesSchema>;

export default function RenderTracesForm() {
  const t = useTranslations("functions.page");
  const pathname = usePathname();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(renderTracesSchema),
  });

  const { handleSubmitGenerate, currentGeneration, initialImage, referenceImage } =
    useFnStore();

  const [isReferenceImageInvalid, setIsReferenceImageInvalid] = useState<boolean>(false);
  const toast = useToast();

  const onSubmitGenerate = async (formData: any) => {
    const { referenceImage } = useFnStore.getState();
  
    // 🔧 Define valores padrão obrigatórios ausentes
    formData.engine = "sd"; // ou "cf", se for o padrão do projeto
  
    const submitFormData = {
      ...formData,
      fnName: "render-traces",
      suggestions:
        formData.suggestions && formData.suggestions.length > 0
          ? formData.suggestions.join(",").toLowerCase()
          : "",
      extraOpts: { seed: -1 },
    };
  
    if (referenceImage?.url) {
      submitFormData.referenceImage = referenceImage.url;
    }
  
    const res = await handleSubmitGenerate(submitFormData);
  };
  

  return (
    <DropImageForm>
      <div className="flex gap-4 w-full h-full">
        <div className="card min-h-[450px] h-full lg:min-h-min min-w-[300px] !flex-col !justify-between relative w-full p-2">
          {currentGeneration.generated ? (
            <GeneratorTopActions />
          ) : (
            <div className="w-full flex items-center justify-center mb-2">
              <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-2 items-center font-lexend">
                  <span className="flex items-center justify-center w-6 h-6 border-2 border-primary rounded-full text-primary text-sm">
                    1
                  </span>
                  <h2 className="text-2xl text-font font-medium">
                    {t("send_image")}
                  </h2>
                </div>
                <p className="text-font-medium text-center text-sm">
                  {t("tip_upload_best_result")}
                </p>
              </div>
            </div>
          )}

          {!initialImage?.url ? <ImageAreaEmpty /> : <ImageAreaFilled />}

          {initialImage?.url && !currentGeneration.generated && (
            <div className="w-full flex gap-4 items-center justify-end mt-4 lg:hidden">
              {pathname.includes("add-objects") ? (
                <ComposerController isDisabled={currentGeneration.isLoading} />
              ) : (
                <MaskController isDisabled={currentGeneration.isLoading} />
              )}
            </div>
          )}

          {initialImage?.url && !currentGeneration.generated && (
            <div className="hidden lg:block w-full">
              {pathname.includes("add-objects") ? (
                <ComposerController isDisabled={currentGeneration.isLoading} />
              ) : (
                <MaskController isDisabled={currentGeneration.isLoading} />
              )}
            </div>
          )}

          {currentGeneration.generated && (
            <div className="w-full flex gap-4 items-center justify-end mt-4">
              <EnhancementButton />
              <FeedbackGeneration />
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmitGenerate)}
          className="fn-form-container"
        >
          <ReferenceImage
            optional={true}
            isInvalid={false}
            onPress={
              isReferenceImageInvalid
                ? () => setIsReferenceImageInvalid(false)
                : undefined
            }
          />

          <div className="flex flex-col items-start gap-4">
            <SuggestionInput
              {...register("suggestions")}
              setValue={setValue}
              name="suggestions"
            />
          </div>

          <GenerateImageButton />
        </form>
      </div>
    </DropImageForm>
  );
}
