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

export default function DressModel(): JSX.Element {
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
      category: "",
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
      garment_photo_type: "auto",
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
      className="flex flex-col items-center gap-8 mx-auto my-4 md:my-8"
    >
      <div className="w-full h-full flex flex-wrap gap-8 justify-center">
        <div className="h-full flex flex-col gap-5">
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
          <div className="flex flex-col gap-5 w-full">
            <ChooseModelButton onModelSelect={handleModelSelect} />
            <ModelImageControls formik={formik} />
          </div>
        </div>
        <div className="h-full flex flex-col gap-5">
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
          <div className="flex flex-col gap-5 w-full">
            <TypeBtnArea
              selectedType={formik.values.garment_photo_type}
              setFieldValue={formik.setFieldValue}
            />
            <CategoryBtnArea
              selectedCategory={formik.values.category}
              setFieldValue={formik.setFieldValue}
            />
          </div>
        </div>
        <div className="h-full flex flex-col gap-5">
          <ResultImageArea
            result_image_path={result_image_path}
            setResultImageWidth={setResultImageWidth}
            onClearImage={handleClearImage}
          />{" "}
          <div className="flex flex-col gap-5 w-full">
            <Button
              color="secondary"
              radius="sm"
              type="submit"
              size="lg"
              className="w-full"
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
      </div>

      <div className="flex gap-8 justify-center">
        {/* <div className="w-[320px] justify-start flex flex-col">
            <TypeBtnArea
              selectedType={formik.values.garment_photo_type}
              setFieldValue={formik.setFieldValue}
            />
            <CategoryBtnArea
              selectedCategory={formik.values.category}
              setFieldValue={formik.setFieldValue}
            />
          </div> */}
        {/* <div className="items-start flex-col justify-start w-[320px] ">
            <div className="mb-5 ">
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                className="bg-primary-background text-white"
              >
                <AutoAwesomeIcon className="mr-2" />
                {text("generate_image")}
              </Button>
            </div>
            <SamplingControls formik={formik} />
          </div> */}
      </div>
    </form>
  );
}
