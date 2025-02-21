import { Button } from "@nextui-org/react";
import React from "react";
import { CloseOutlined } from "@mui/icons-material";
import { CustomStepType } from "@/constants/tours";
import { useTranslations } from "next-intl";

type BubbleProps = {
  steps: CustomStepType[];
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  setIsOpen: (open: boolean) => void;
};

export default function Bubble({
  steps,
  currentStep,
  setCurrentStep,
  setIsOpen,
}: BubbleProps) {
  const t = useTranslations("tours");
  const { isLastStep, content, description } = steps[currentStep];

  const handleNext = async () => {
    if (isLastStep) {
      setIsOpen(false);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-secondary text-white relative">
      {/* Botão de Fechar */}
      <Button
        isIconOnly
        radius="full"
        variant="light"
        size="sm"
        className="text-white absolute top-1 right-1"
        onPress={() => setIsOpen(false)}
      >
        <CloseOutlined fontSize="small" />
      </Button>

      {/* Conteúdo do Popover */}
      <article className="space-y-2">
        <h3 className="text-sm 2xl:text-base font-semibold">
          {typeof content === "function" ? null : content}
        </h3>
        <p className="text-sm">{description}</p>
      </article>

      {/* Controles de navegação */}
      <div className="w-full flex items-center justify-between">
        <Button
          className="text-white"
          size="sm"
          variant="light"
          onPress={() => setIsOpen(false)}
        >
          {t('skip_label')}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            className="text-white"
            variant="light"
            onPress={() => setCurrentStep((s) => Math.max(s - 1, 0))}
          >
            {t('previous_label')}
          </Button>
          <Button
            className={`bg-white text-default-900 ${
              steps[currentStep].animate
                ? "animate-pulse hover:animate-none"
                : ""
            }`}
            onPress={handleNext}
            isDisabled={steps[currentStep].disableButton}
          >
            {isLastStep ? t('finish_label') : t('next_label')}
          </Button>
        </div>
      </div>
    </div>
  );
}
