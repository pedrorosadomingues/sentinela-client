/* eslint-disable @typescript-eslint/no-unused-vars */
/* components/organisms/StudioContent.tsx */
"use client";
import { useFormik } from "formik";
import { useState, useRef } from "react";
import ModelImageControls from "@/components/molecules/functions/dress-model/Controls/Model-image-controls";
import SamplingControls from "@/components/molecules/functions/dress-model/Controls/Sampling-controls";
import ModelImageArea from "@/components/molecules/functions/dress-model/ImageArea/Model-image-area";
import GarmentImageArea from "@/components/molecules/functions/dress-model/ImageArea/Garment-image-area";
import ResultImageArea from "@/components/molecules/functions/dress-model/ImageArea/Result-image-area";
import { onFileChange } from "@/utils/on-file-change";
import { handleSubmit } from "@/utils/handle-submit";
import CategoryBtnArea from "@/components/molecules/functions/dress-model/Controls/Garment-category-controls";
import TypeBtnArea from "@/components/molecules/functions/dress-model/Controls/Garment-type-controls";
import { useTranslations } from "next-intl";
import ChooseModelButton from "@/components/atoms/ChooseModelButton";
import { StarGroup } from "../icons";
import { Button } from "@heroui/react";
import RowSteps from "@/components/atoms/RowSteps";
import { useDressModelStore } from "@/zustand-stores/dressModelStore";

export default function DressModel(): JSX.Element {
  const { step, setStep, current } = useDressModelStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [model_image_path, setModelImagePath] = useState<string>("");
  const [garment_image_path, setGarmentImagePath] = useState<string>("");
  const [result_image_path, setResultImagePath] = useState<string>("");
  const [modelImageWidth, setModelImageWidth] = useState<number>(0);
  const [garmentImageWidth, setGarmentImageWidth] = useState<number>(0);
  const [resultImageWidth, setResultImageWidth] = useState<number>(0);

  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const garmentInputRef = useRef<HTMLInputElement | null>(null);

  const text = useTranslations("dress_model");

  const formik = useFormik({
    initialValues: {
      model_image: "",
      garment_image: "",
      fn: "dress-model",
      cover_feet: false,
      adjust_hands: false,
      restore_clothes: false,
      guidance_scale: 3,
      timesteps: 50,
      seed: 42,
      num_samples: 1,
      garment_photo_type: "flat-lay",
      category: "tops",
    },
    onSubmit: (values) =>
      handleSubmit(values, setIsLoading, setResultImagePath),
  });

  async function handleFileInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name } = event.target;
    const files = event.target.files;

    if (files && files[0]) {
      const file = files[0];
      const setImagePath =
        name === "model_image" ? setModelImagePath : setGarmentImagePath;

      await onFileChange(file, name, setImagePath, formik.setFieldValue);
    }
  }

  async function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
    type: "model" | "garment"
  ) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      const name = type === "model" ? "model_image" : "garment_image";
      const setImagePath =
        name === "model_image" ? setModelImagePath : setGarmentImagePath;

      await onFileChange(file, name, setImagePath, formik.setFieldValue);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function openFileDialog(type: string) {
    if (type === "model" && modelInputRef.current) {
      modelInputRef.current.click();
    } else if (type === "garment" && garmentInputRef.current) {
      garmentInputRef.current.click();
    }
  }

  // to set selected model image path to formik values
  const handleModelSelect = (imagePath: string) => {
    setModelImagePath(imagePath);

    formik.setFieldValue("model_image", imagePath);
  };

  function handleClearImage(type: "model" | "garment" | "result" | "reset") {
    const resetAllImages = () => {
      setModelImagePath("");
      setGarmentImagePath("");
      setResultImagePath("");
      formik.setFieldValue("model_image", "");
      formik.setFieldValue("garment_image", "");

      setStep(0);
    };

    switch (type) {
      case "model":
        setModelImagePath("");
        formik.setFieldValue("model_image", "");
        break;
      case "garment":
        setGarmentImagePath("");
        formik.setFieldValue("garment_image", "");
        break;
      case "result":
        setResultImagePath("");
        break;
      case "reset":
        resetAllImages();
      default:
        break;
    }
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="h-full w-full flex flex-col items-center gap-8 mx-auto my-4 md:my-8"
    >
      <div className="w-full h-full hidden md:grid grid-cols-3 max-w-8xl gap-2 lg:gap-8">
        <div className="w-full h-fit flex flex-col gap-4">
          <ModelImageArea
            model_image_path={model_image_path}
            openFileDialog={openFileDialog}
            handleDrop={(e) => handleDrop(e, "model")}
            handleDragOver={handleDragOver}
            handleFileInputChange={handleFileInputChange}
            modelInputRef={modelInputRef}
            setModelImageWidth={setModelImageWidth}
            onClearImage={handleClearImage}
          />
          <ChooseModelButton onModelSelect={handleModelSelect} />
          <ModelImageControls formik={formik} />
        </div>
        <div className="w-full h-fit flex flex-col gap-4">
          <GarmentImageArea
            garment_image_path={garment_image_path}
            openFileDialog={openFileDialog}
            handleDrop={(e) => handleDrop(e, "garment")}
            handleDragOver={handleDragOver}
            handleFileInputChange={handleFileInputChange}
            garmentInputRef={garmentInputRef}
            setGarmentImageWidth={setGarmentImageWidth}
            onClearImage={handleClearImage}
          />
          <TypeBtnArea
            selectedType={formik.values.garment_photo_type}
            setFieldValue={formik.setFieldValue}
          />
          <CategoryBtnArea
            selectedCategory={formik.values.category}
            setFieldValue={formik.setFieldValue}
          />
        </div>
        <div className="w-full h-fit flex flex-col gap-4">
          <ResultImageArea
            result_image_path={result_image_path}
            setResultImageWidth={setResultImageWidth}
            onClearImage={handleClearImage}
          />{" "}
          <Button
            color="secondary"
            radius="sm"
            type="submit"
            size="lg"
            className="w-full text-sm mt-6"
            isDisabled={isLoading}
            isLoading={isLoading}
            startContent={
              !isLoading ? (
                <StarGroup className="mr-2" width={24} height={24} />
              ) : null
            }
          >
            {text("generate_image")}
          </Button>
          <SamplingControls formik={formik} />
        </div>
      </div>

      {/* MOBILE DRESS FN AREA */}
      <div className="w-full max-w-md block md:hidden mx-auto">
        <RowSteps
          currentStep={step}
          onStepChange={setStep}
          color="secondary"
          steps={[
            {
              title: "Model image",
            },
            {
              title: "Garment image",
            },
            {
              title: "Generate image",
            },
          ]}
        />

        {current === "model" ? (
          <div className="space-y-4 w-full">
            <ModelImageArea
              model_image_path={model_image_path}
              openFileDialog={openFileDialog}
              handleDrop={(e) => handleDrop(e, "model")}
              handleDragOver={handleDragOver}
              handleFileInputChange={handleFileInputChange}
              modelInputRef={modelInputRef}
              setModelImageWidth={setModelImageWidth}
              onClearImage={handleClearImage}
            />
            <ChooseModelButton onModelSelect={handleModelSelect} />
            <ModelImageControls formik={formik} />
          </div>
        ) : current === "garment" ? (
          <div className="space-y-4 w-full">
            <GarmentImageArea
              garment_image_path={garment_image_path}
              openFileDialog={openFileDialog}
              handleDrop={(e) => handleDrop(e, "garment")}
              handleDragOver={handleDragOver}
              handleFileInputChange={handleFileInputChange}
              garmentInputRef={garmentInputRef}
              setGarmentImageWidth={setGarmentImageWidth}
              onClearImage={handleClearImage}
            />
            <TypeBtnArea
              selectedType={formik.values.garment_photo_type}
              setFieldValue={formik.setFieldValue}
            />
            <CategoryBtnArea
              selectedCategory={formik.values.category}
              setFieldValue={formik.setFieldValue}
            />
          </div>
        ) : (
          (current === "generated" || current === "result") && (
            <div className="space-y-4 w-full">
              <ResultImageArea
                result_image_path={result_image_path}
                setResultImageWidth={setResultImageWidth}
                onClearImage={handleClearImage}
              />{" "}
              <Button
                color="secondary"
                radius="sm"
                type="submit"
                size="lg"
                className="w-full text-sm md:mt-6"
                isDisabled={isLoading}
                isLoading={isLoading}
                startContent={
                  !isLoading ? (
                    <StarGroup className="mr-2" width={24} height={24} />
                  ) : null
                }
              >
                {text("generate_image")}
              </Button>
              <SamplingControls formik={formik} />
            </div>
          )
        )}
      </div>
    </form>
  );
}
