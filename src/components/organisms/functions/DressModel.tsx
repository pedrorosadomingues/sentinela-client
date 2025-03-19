/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* components/organisms/StudioContent.tsx */
"use client";

import { useRef, useEffect } from "react";
import ModelImageControls from "@/components/molecules/functions/dress-model/Controls/Model-image-controls";
import ModelImageArea from "@/components/molecules/functions/dress-model/ImageArea/Model-image-area";
import GarmentImageArea from "@/components/molecules/functions/dress-model/ImageArea/Garment-image-area";
import ResultImageArea from "@/components/molecules/functions/dress-model/ImageArea/Result-image-area";
import { handleSubmit } from "@/utils/handle-submit";
import CategoryBtnArea from "@/components/molecules/functions/dress-model/Controls/Garment-category-controls";
import TypeBtnArea from "@/components/molecules/functions/dress-model/Controls/Garment-type-controls";
import { useTranslations } from "next-intl";
import { StarGroup } from "../icons";
import { Button } from "@heroui/react";
import RowSteps from "@/components/atoms/RowSteps";
import { useDressModelStore } from "@/stores/dressModelStore";
import CreateModelButton from "../create-model/CreateModel";
import ChooseDefaultModel from "../create-model/ChooseDefaultModel";
import GenerateModelByText from "../create-model/GenerateModelByText";
import { useTour } from "@reactour/tour";
import { FormValues } from "@/interfaces";
import { urlToBase64 } from "@/utils/image";
import { useToast } from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/stores";

export default function DressModel(): JSX.Element {
  const {
    step,
    setStep,
    current,
    handleDressTour,
    currentGeneration,
    setCurrentModelImage,
    setCurrentGarmentImage,
    setCurrentResultImage,
  } = useDressModelStore();
  const { user } = useUserStore();
  const {
    isOpen: isTourOpen,
    setIsOpen,
    setCurrentStep,
    currentStep,
  } = useTour();
  const tours = user?.watched_tours.map((tour) => tour.tour_id);
  const showDressTour = !tours?.includes(2);

  const handleStartTour = () => {
    if (user && !showDressTour && isTourOpen) {
      return;
    }

    if (currentStep !== 0 && !isTourOpen) {
      setCurrentStep(0);
    }
    
    setTimeout(() => {
      setIsOpen(true);
      setValue("category", "one-pieces");
    }, 2000);
  };

  useEffect(() => {
    handleStartTour();
  }, []);

  useEffect(() => {
    handleDressTour(currentStep);
  }, [currentStep]);

  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const garmentInputRef = useRef<HTMLInputElement | null>(null);
  const text = useTranslations("dress_model");
  const toast = useToast();

  const {
    setValue,
    handleSubmit: formSubmit,
    watch,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      model_image: "",
      garment_image: "",
      fn: "dress-model",
      cover_feet: false,
      adjust_hands: false,
      restore_clothes: false,
      seed: 42,
      num_samples: 1,
      garment_photo_type: "flat-lay",
      category: "tops",
      mode: "quality",
    },
  });

  const [garmentPhotoType, garmentCategory] = watch([
    "garment_photo_type",
    "category",
  ]);

  async function onFileChange(
    file: File,
    setImagePath: (value: string) => void
  ) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result as string;
      setImagePath(base64String);
    };

    reader.onerror = (error) => {
      console.error("Erro ao ler o arquivo:", error);
    };
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = event.target;

    if (files && files[0]) {
      const file = files[0];

      const setImagePath =
        name === "model_image" ? setCurrentModelImage : setCurrentGarmentImage;

      onFileChange(file, setImagePath);
    }
  }

  function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
    type: "model" | "garment"
  ) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      const setImagePath =
        type === "model" ? setCurrentModelImage : setCurrentGarmentImage;

      onFileChange(file, setImagePath);
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

  const handleModelSelect = async (imagePath: string) => {
    try {
      const base64Image = await urlToBase64(imagePath);

      setCurrentModelImage(base64Image);
    } catch (error) {
      console.error("Erro ao carregar imagem como Base64:", error);
    }
  };

  function handleClearImage(type: "model" | "garment" | "result" | "reset") {
    const resetAllImages = () => {
      setCurrentModelImage("");
      setCurrentGarmentImage("");
      setCurrentResultImage("");
      setValue("model_image", "");
      setValue("garment_image", "");

      setStep(0);
    };

    switch (type) {
      case "model":
        setCurrentModelImage("");
        setValue("model_image", "");
        break;
      case "garment":
        setCurrentGarmentImage("");
        setValue("garment_image", "");
        break;
      case "result":
        setCurrentResultImage("");
        break;
      case "reset":
        resetAllImages();
      default:
        break;
    }
  }

  const ModelArea = () => (
    <>
      <ModelImageArea
        src={currentGeneration.model}
        openFileDialog={openFileDialog}
        handleDrop={(e) => handleDrop(e, "model")}
        handleDragOver={handleDragOver}
        handleFileInputChange={handleFileInputChange}
        modelInputRef={modelInputRef}
        onClearImage={handleClearImage}
      />
      <div className="w-full space-y-3 dt-fourth-step">
        <ChooseDefaultModel
          isDisabled={currentGeneration.isLoading}
          onModelSelect={handleModelSelect}
        />
        <GenerateModelByText
          isDisabled={currentGeneration.isLoading}
          onModelSelect={handleModelSelect}
        />
        <CreateModelButton
          isDisabled={currentGeneration.isLoading}
          onModelSelect={handleModelSelect}
        />
      </div>
    </>
  );

  const GarmentArea = () => (
    <>
      <GarmentImageArea
        src={currentGeneration.garment}
        openFileDialog={openFileDialog}
        handleDrop={(e) => handleDrop(e, "garment")}
        handleDragOver={handleDragOver}
        handleFileInputChange={handleFileInputChange}
        garmentInputRef={garmentInputRef}
        onClearImage={handleClearImage}
      />
      <TypeBtnArea selectedType={garmentPhotoType} setValue={setValue} />
      <CategoryBtnArea selectedCategory={garmentCategory} setValue={setValue} />
    </>
  );

  const ResultArea = () => (
    <>
      <ResultImageArea
        src={currentGeneration.result}
        onClearImage={handleClearImage}
      />
      <Button
        color="secondary"
        radius="sm"
        type="submit"
        size="lg"
        className="w-full text-sm mt-6 dt-thirteenth-step"
        isDisabled={
          currentGeneration.garment === "" || currentGeneration.model === ""
        }
        isLoading={currentGeneration.isLoading}
        startContent={
          !currentGeneration.isLoading ? (
            <StarGroup className="mr-2" width={24} height={24} />
          ) : null
        }
      >
        {text("generate_image")}
      </Button>
    </>
  );

  return (
    <form
      onSubmit={formSubmit((values) => {
        handleSubmit(values, toast.use);
      })}
      className="h-full w-full flex flex-col items-center gap-8 mx-auto my-4 md:my-8"
    >
      <div className="dt-first-step w-full h-full hidden md:grid grid-cols-3 max-w-8xl gap-2 lg:gap-8">
        <div className="w-full h-fit flex flex-col gap-4">
          <ModelArea />
          <ModelImageControls setValue={setValue} control={control} />
        </div>
        <div className="w-full h-fit flex flex-col gap-4">
          <GarmentArea />
        </div>
        <div className="w-full h-fit flex flex-col gap-4 dt-thirteenth-step">
          <ResultImageArea
            src={currentGeneration.result}
            onClearImage={handleClearImage}
          />
          <Button
            color="secondary"
            radius="sm"
            type="submit"
            size="lg"
            className="w-full text-sm mt-6"
            isDisabled={
              currentGeneration.garment === "" || currentGeneration.model === ""
            }
            isLoading={currentGeneration.isLoading}
            startContent={
              !currentGeneration.isLoading ? (
                <StarGroup className="mr-2" width={24} height={24} />
              ) : null
            }
          >
            {text("generate_image")}
          </Button>
        </div>
      </div>

      {/* MOBILE DRESS MODEL FN AREA */}
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
            <ModelArea />
          </div>
        ) : current === "garment" ? (
          <div className="space-y-4 w-full">
            <GarmentArea />
          </div>
        ) : (
          (current === "generated" || current === "result") && (
            <div className="space-y-4 w-full">
              <ResultArea />
            </div>
          )
        )}
      </div>
    </form>
  );
}
