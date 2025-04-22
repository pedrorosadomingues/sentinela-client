import { useFnStore } from "@/stores/fnStore";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { StarGroup } from "@/components/atoms/icons/index";
import { useEffect, useState } from "react";

export default function GenerateImageButton({
  isVideo,
}: {
  isVideo?: boolean;
}) {
  const { initialImage, currentGeneration } = useFnStore();
  const t = useTranslations("functions.page");
  const isButtonDisabled = !initialImage;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(currentGeneration.isLoading);
  }, [currentGeneration.isLoading]);

  return (
    <Button
      type="submit"
      isLoading={isLoading}
      isDisabled={isButtonDisabled}
      className="btn btn-primary-gradient"
    >
      {!isLoading && <StarGroup />}{" "}
      {isVideo ? t("generate_video") : t("generate_image")}
    </Button>
  );
}
