/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DropImageForm from "@/components/molecules/functions/render-traces/DropImageForm";
import GenerateImageButton from "@/components/atoms/buttons/GenerateImageButton";
import SelectEngine from "@/components/atoms/inputs/SelectEngine";
import SelectEnvironment from "@/components/atoms/inputs/SelectEnviroment";
import SelectType from "@/components/atoms/inputs/SelectType";
import SuggestionInput from "@/components/atoms/inputs/SuggestionInput";
import { FnOptions } from "@/interfaces/FnOptions";
import { useFnStore } from "@/stores/fnStore";
//import { useMaskStore } from "@/stores/maskStore";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectStyle from "@/components/atoms/inputs/SelectStyle";
import SelectMode from "@/components/atoms/inputs/SelectMode";
import OptionProps from "@/interfaces/OptionProps";
import ReferenceImage from "@/components/molecules/functions/render-traces/ReferenceImage";
import { useToast } from "@/hooks/useToast";
import { SelectOptionsProps } from "@/types/generate-form";
import { findValueByTitle } from "@/utils/forms";
import GeneratorTopActions from "@/components/atoms/inputs/GeneratorTopActions";
import ImageAreaEmpty from "@/components/molecules/functions/render-traces/ImageAreaEmpty";
import ImageAreaFilled from "@/components/molecules/functions/render-traces/ImageAreaFilled";
import { usePathname } from "next/navigation";
import ComposerController from "@/components/molecules/composer/ComposerController";
import MaskController from "@/components/molecules/MaskController";
import EnhancementButton from "@/components/atoms/buttons/EnhancementButton";
import FeedbackGeneration from "@/components/molecules/feedback/FeedbackGeneration";

const renderTracesSchema = z.object({
  engine: z.string().min(1),
  environment: z.string().min(1),
  style: z.string().optional(),
  mode: z.string().optional(),
  type: z.string().optional(),
  suggestions: z.array(z.string()),
});

type FormInputs = z.infer<typeof renderTracesSchema>;

const modeOptions: OptionProps[] = [
  {
    title: "Modo 1",
    value: "mode1",
    tooltip:
      "Ideal para desenhos que já possuem cores e deseja-se manter estas cores.",
  },
  {
    title: "Modo 2",
    value: "mode2",
    tooltip: "Ideal para desenhos que não estão coloridos.",
  },
  {
    title: "Modo 3",
    value: "mode3",
    tooltip:
      "Realize a transformação de um desenho utilizando uma imagem extra como referência.",
  },
];

export default function RenderTracesForm() {
  const t = useTranslations("functions.page");
  const pathname = usePathname();
  const fnOptions ={
    name: "render-traces",
    params: {
      engine: [
        { title: "Stable Diffusion", value: "sd" },
        { title: "ControlNet", value: "cf" },
      ],
      environment: [
        { title: "Interior", value: "interior" },
        { title: "Exterior", value: "exterior" },
      ],
      style: [
        { title: "Dia", value: "day" },
        { title: "Noite", value: "night" },
      ],
      type: [
        { title: "Desenho", value: "drawing" },
        { title: "Pintura", value: "painting" },
      ],
    },
  }
  // const initialValues = {
  //   engine: "sd",
  //   environment: "interior",
  //   style: "day",
  //   mode: "mode1",
  //   type: "drawing",
  //   suggestions: [],
  // }

  const {
    handleSubmit,
    register,
    watch,
    unregister,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(renderTracesSchema),
  });
  const { handleSubmitGenerate, currentGeneration, initialImage } =
    useFnStore();
  const [environment, mode, engine] = watch(["environment", "mode", "engine"]);
  const { referenceImage } = useFnStore();

  const [isReferenceImageInvalid, setIsReferenceImageInvalid] =
    useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    if (environment === "exterior") {
      unregister("type");
    } else {
      register("type");
    }
  }, [environment, register, unregister]);

  useEffect(() => {
    if (mode === "mode3") {
      unregister("style");
    }
  }, [mode, register, unregister]);

  useEffect(() => {
    if (engine === "cf") {
      unregister("mode");
    } else {
      register("mode");
    }

    setIsReferenceImageInvalid(false);
  }, [engine, register, unregister]);

  const onSubmitGenerate = async (formData: any) => {
    // const { activeMask } = useMaskStore.getState();

    formData.style = findValueByTitle(fnOptions.params.style, formData.style);
    formData.type = findValueByTitle(fnOptions.params.type, formData.type);

    if (engine === "cf") {
      delete formData.mode;
    }

    if (mode === "mode3" && !referenceImage?.url) {
      setIsReferenceImageInvalid(true);
      return toast.use(
        "warning",
        "No modo 3 você deve inserir uma imagem de referência."
      );
    }

    if (environment === "exterior") {
      delete formData.type;
    }

    const submitFormData = {
      ...formData,
      fnName: fnOptions.name,
      suggestions:
        formData.suggestions.length > 0
          ? formData.suggestions.join(",").toLowerCase()
          : "",
      extraOpts: { seed: -1 },
    };

    if (referenceImage?.url) {
      submitFormData.referenceImage = referenceImage.url;
    }

   const res =  await handleSubmitGenerate(submitFormData);

  

   console.log("🚀 ~ file: RenderTraces.tsx:163 ~ onSubmitGenerate ~ res:", res)
  };

  return (
    <DropImageForm>
      <div className="flex flex gap-4 w-full h-full">
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

          {/* <UploadTipsModal /> */}

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

          {/* <PreviousCarousel /> */}
        </div>
        <form
          onSubmit={handleSubmit(onSubmitGenerate)}
          className="fn-form-container"
        >
          {(mode === "mode3" || engine === "cf") && (
            <ReferenceImage
              optional={engine === "cf"}
              isInvalid={isReferenceImageInvalid}
              onPress={
                isReferenceImageInvalid
                  ? () => setIsReferenceImageInvalid(false)
                  : undefined
              }
            />
          )}
          <div className="flex flex-col items-start gap-4">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-2">
              <SelectEngine
                {...register("engine")}
                options={fnOptions?.params?.engine}
                isInvalid={!!errors.engine}
                setValue={setValue}
                name="engine"
              />
              <SelectEnvironment
                {...register("environment")}
                isInvalid={!!errors.environment}
              />
              {mode !== "mode3" && (
                <SelectStyle
                  {...register("style")}
                  options={fnOptions?.params?.style as SelectOptionsProps[]}
                  isInvalid={!!errors.style}
                />
              )}
              {engine !== "cf" && (
                <SelectMode
                  options={modeOptions}
                  {...register("mode")}
                  isInvalid={!!errors.mode}
                />
              )}
              {environment === "interior" && (
                <SelectType
                  {...register("type")}
                  options={fnOptions?.params?.type as SelectOptionsProps[]}
                  isInvalid={!!errors.type}
                />
              )}
            </div>
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
