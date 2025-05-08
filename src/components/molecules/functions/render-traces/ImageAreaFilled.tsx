/* eslint-disable @next/next/no-img-element */
import { CloseOutlined, DeleteOutlineOutlined, SaveOutlined } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useFnStore } from "@/stores/fnStore";
import { Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useMaskStore } from "@/stores/maskStore";
import LassoSelectTool from "./LassoSelectTool";
import BrushSelectTool from "./BrushSelectTool";
import PreviewImage from "./PreviewImage";
import CompareImage from "./CompareImage";
import ImageComposerTool from "../../composer/ImageComposerTool";
import { useComposerStore } from "@/stores/composerStore";
import FullscreenView from "./FullscreenView";
import DownloadGeneration from "./DownloadGeneration";
import ManageGenerationModal from "@/components/organisms/ManageGenerationModal";

export default function ImageAreaFilled() {
  const t = useTranslations("functions.page");
  const {
    initialImage,
    handleImageUpload,
    setGenerateStep,
    currentGeneration,
    handleGenerateNewImage,
    isCompare,
    setIsCompare,
    handleCleaningSelectedImage,
    showOriginalImage,
    fnSelected,
    currentGenerationIdRef,
    activeEnhancement,
  } = useFnStore();
  const { activeMask, setActiveMask, selectionMode, brushMode, setClearBrushTool } = useMaskStore();
  const { composerMode, lastComposerHistory, getLastHistoryCanvas } = useComposerStore();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialImage) {
      setGenerateStep(1);
    }
  }, [initialImage, setGenerateStep]);

  useEffect(() => {
    if (activeMask) setIsCompare(false);
  }, [activeMask, setIsCompare]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(false);
    setClearBrushTool(true);
    setActiveMask(false);

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

  const handleCleaningImage = (key: "original" | "generated") => {
    // para exibir o histórico de imagens sem que o canvas limpe as imagens ou bug as posições
    // precisa desse tempo para ele renderizar o histórico dentro do canvas
    if (key === "generated") {
      handleGenerateNewImage();

      setTimeout(() => {
        if (fnSelected === "add-objects" && lastComposerHistory) {
          getLastHistoryCanvas();
        }
      }, 1000);
    } else if (key === "original") {
      handleCleaningSelectedImage();
    }
  };

  return (
    <>
      <input
        type="file"
        hidden
        name="image"
        id="input-image"
        accept="image/jpeg"
        required={true}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
      
          // ✅ Verificação do tipo MIME
          if (file.type !== "image/jpeg") {
            alert("Apenas imagens .jpg são suportadas no momento.");
            e.target.value = ""; // limpa o input
            return;
          }
      
          handleImageUpload(e);
          e.target.value = "";
        }}
      />
      <div
        ref={containerRef}
        onDragEnter={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDragOver={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onDrop={handleDrop}
        className={`
          w-full h-full min-h-[450px] lg:min-h-min flex flex-col items-center justify-center gap-4 lg:gap-2 overflow-hidden 
          ${isDragOver ? "opacity-50" : "opacity-100"} relative
          `}
      >
        {!currentGeneration.generated ? (
          <div className="relative flex w-full bg-grayscale-100">
            {initialImage?.url && !initialImage?.isLoading && (
              <>
                <Button
                  onPress={() => handleCleaningImage("original")}
                  color="danger"
                  size="sm"
                  isIconOnly
                  isDisabled={currentGeneration.isLoading && !currentGenerationIdRef.job_id}
                  startContent={<CloseOutlined fontSize="small" />}
                  className="absolute top-2 right-2 z-10"
                />
              </>
            )}

            <div className="relative flex w-full items-center justify-center" ref={canvasRef}>
              {activeMask && !currentGeneration.isLoading ? (
                <>
                  {selectionMode && <LassoSelectTool />}
                  {brushMode && !selectionMode && <BrushSelectTool />}
                </>
              ) : composerMode && !activeMask && !brushMode ? (
                <ImageComposerTool />
              ) : (
                <PreviewImage src={initialImage?.url} />
              )}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-grayscale-50">
            <Button
              onPress={() => handleCleaningImage("generated")}
              color="danger"
              size="sm"
              isIconOnly
              startContent={<DeleteOutlineOutlined fontSize="medium" />}
              className="absolute top-2 right-2 z-10"
            />

            {!isCompare && (
              <nav className="absolute bottom-2 right-2 flex flex-col gap-2 transition-all ease-in-out duration-300">
                {currentGenerationIdRef.id && (
                  <ManageGenerationModal
                    actionType="save"
                    trigger={
                      <Button isIconOnly size="sm">
                        <SaveOutlined />
                      </Button>
                    }
                  />
                )}
                <DownloadGeneration generation={currentGeneration} />
                <FullscreenView
                  src={
                    currentGeneration.enhanced && activeEnhancement
                      ? currentGeneration.enhanced
                      : currentGeneration.generated
                  }
                />
              </nav>
            )}

            {showOriginalImage && currentGeneration.original ? (
              <div className="relative">
                <span className="w-fit absolute top-1 left-1 p-1 bg-black text-white text-xs bg-opacity-70 transition-opacity duration-300 opacity-100">
                  {t("original_image")}
                </span>
                <img src={currentGeneration.original ?? ""} alt="redraw initial image" className="w-full h-full" />
              </div>
            ) : (
              <CompareImage isCompare={isCompare} />
            )}
          </div>
        )}
        {isDragOver && (
          <p className="bg-black p-2 animate-pulse text-white text-medium absolute pointer-events-none">
            {t("drop_image")}
          </p>
        )}
        <span className="absolute bottom-2 left-3 px-1 text-xs bg-black text-white opacity-50">
          {initialImage?.size?.width}px x {initialImage?.size?.height}px
        </span>
      </div>
    </>
  );
}
