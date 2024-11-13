/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useFormik } from "formik";
import { Button } from "@mui/material";
import { useState, useRef } from "react";
import ModelImageControls from "@/components/molecules/Controls/Model-image-controls";
import SamplingControls from "../molecules/Controls/Sampling-controls";
import ModelImageArea from "@/components/molecules/ImageArea/Model-image-area";
import GarmentImageArea from "@/components/molecules/ImageArea/Garment-image-area";
import ResultImageArea from "@/components/molecules/ImageArea/Result-image-area";
import { onFileChange } from "@/utils/on-file-change";
import { handleSubmit } from "@/utils/handle-submit";
import CategoryBtnArea from "@/components/molecules/CategoryBtnArea";
import FnButtons from "../molecules/FnButtons";
import Header from "../organisms/Header";
import Sidebar from "../organisms/Sidebar";
import { useLocale, useTranslations } from "next-intl";

export default function Studio(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [model_image_path, setModelImagePath] = useState<string>("");
  const [garment_image_path, setGarmentImagePath] = useState<string>("");
  const [result_image_path, setResultImagePath] = useState<string>("");
  const [modelImageWidth, setModelImageWidth] = useState<number>(0);
  const [garmentImageWidth, setGarmentImageWidth] = useState<number>(0);
  const [resultImageWidth, setResultImageWidth] = useState<number>(0);

  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const garmentInputRef = useRef<HTMLInputElement | null>(null);

  const text = useTranslations("home_page");

  const formik = useFormik({
    initialValues: {
      category: "",
      model_image: "",
      garment_image: "",
      fn: "",
      cover_feet: false,
      adjust_hands: false,
      restore_background: false,
      restore_clothes: false,
      guidance_scale: 3,
      timesteps: 50,
      seed: 42,
      num_samples: 1,
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

      console.log("file", file);
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

  return (
    <div className="bg-primary min-h-screen flex justify-center w-full">
      <Header />

      <Sidebar />
      {/* <Image
        src={"/img/logo-vestiq.png"}
        alt="Logo"
        width={150}
        height={250}
        priority={true}
      /> */}
      <div className="mt-10 p-10 rounded-xl w-[60%] bg-white mt-[90px] mb-[130px]">
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="flex w-full gap-[30px] justify-center">
            <ModelImageArea
              model_image_path={model_image_path}
              openFileDialog={openFileDialog}
              handleDrop={(e) => handleDrop(e, "model")}
              handleDragOver={handleDragOver}
              handleFileInputChange={handleFileInputChange}
              modelInputRef={modelInputRef}
              setModelImageWidth={setModelImageWidth}
            />
            <GarmentImageArea
              garment_image_path={garment_image_path}
              openFileDialog={openFileDialog}
              handleDrop={(e) => handleDrop(e, "garment")}
              handleDragOver={handleDragOver}
              handleFileInputChange={handleFileInputChange}
              garmentInputRef={garmentInputRef}
              setGarmentImageWidth={setGarmentImageWidth}
            />
            <ResultImageArea
              result_image_path={result_image_path}
              setResultImageWidth={setResultImageWidth}
            />
          </div>

          <div className="flex justify-between">
            <ModelImageControls formik={formik} />
            <div>
              <CategoryBtnArea
                selectedCategory={formik.values.category}
                setFieldValue={formik.setFieldValue}
              />
              { <FnButtons
                selectedFn={formik.values.fn}
                setFieldValue={formik.setFieldValue}
              /> }
            </div>
            <div className="w-[30%]">
              <div className="ml-auto mb-5">
                <Button
                  type="submit"
                  variant="outlined"
                  disabled={isLoading}
                  fullWidth
                >
                  {text("generate_image")}
                </Button>
              </div>
              <SamplingControls formik={formik} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
