import { FileUpload } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useFnStore } from "@/stores/fnStore";
import { Button, Spinner } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { DropImageAreaIcon } from "@/components/atoms/icons/index";
import { useMaskStore } from "@/stores/maskStore";

export default function ImageAreaEmpty() {
  const [isDragOver, setIsDragOver] = useState(false);
  const {
    initialImage,
    handleImageUpload,
    setGenerateStep,
    currentGeneration,
    handleGenerateNewImage,
  } = useFnStore();
  const { setClearBrushTool } = useMaskStore();

  const [loadingProxy, setLoadingProxy] = useState(false);
  const t = useTranslations("functions.page");

  const handleUploadClick = () =>
    document.getElementById("input-image")?.click();

  const resetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e);
    e.target.value = "";
  };

  useEffect(() => {
    if (!initialImage) setGenerateStep(1);
  }, [initialImage, setGenerateStep]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setLoadingProxy(true);
    setClearBrushTool(true);

    const url = e.dataTransfer.getData("text/plain");
    if (url) {
      // Use a rota de proxy para acessar a imagem sem problemas de CORS
      const proxyUrl = `/api/image/proxy-image?url=${encodeURIComponent(url)}`;
      handleImageUpload(null, { url: proxyUrl });
    } else {
      const files = e.dataTransfer.files;
      if (files.length) handleImageUpload(e, { dropped: true });
    }

    if (currentGeneration.generated) {
      handleGenerateNewImage();
    }

    setGenerateStep(2);
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    over: boolean
  ) => {
    e.preventDefault();
    setIsDragOver(over);
  };

  return (
    <div
      className={`relative px-4 mt-4 h-full xl:h-[560px] 2xl:max-h-fit w-full ${
        isDragOver
          ? "border-dashed-redraw bg-grayscale-50"
          : "border-2 border-transparent"
      } animate-appearance-in`}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        hidden
        name="image"
        id="input-image"
        accept="image/png,image/jpeg"
        required
        onChange={resetInput}
      />

      <div className="p-2 h-full pointer-events-none cursor-no-drop">
        <div className="w-full h-full min-h-[450px] lg:min-h-min min-w-[300px] flex flex-col items-center justify-center gap-4 lg:gap-2 overflow-hidden">
          {isDragOver ? (
            <div className="h-full min-h-[450px] flex flex-col gap-6 justify-center items-center animate-pulse select-none">
              <p className="opacity-50 bg-black p-2 text-center animate-pulse text-white text-medium absolute pointer-events-none">
                {t("drop_image_area_text")}
              </p>
            </div>
          ) : (
            <div className="pointer-events-none select-none cursor-no-drop h-full min-h-[450px] flex flex-col gap-6 justify-center items-center">
              <div className="w-full flex flex-col items-center justify-center">
                {loadingProxy ? (
                  <Spinner size="md" />
                ) : (
                  <>
                    <DropImageAreaIcon className="pointer-events-none mb-6" />
                    <h3 className="w-3/4 font-lexend text-center text-lg">
                      {t("drop_image_area_text")}
                    </h3>
                    <p className="text-slate-400 text-center text-sm">
                      {t("drop_image_area_subtext")}
                    </p>

                    <Button
                      type="submit"
                      variant="bordered"
                      className={`mt-8 pointer-events-auto ${
                        initialImage?.url && "mb-4"
                      } ${initialImage?.isLoading && "mb-4"}`}
                      startContent={<FileUpload fontSize="small" />}
                      isDisabled={isDragOver}
                      onPress={handleUploadClick}
                    >
                      {t("send_file")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
