"use client";

import { useState } from "react";
import Image from "next/image";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import { useImageFromTextStore } from "@/stores/imageFromTextStore";
import { CircularProgress } from "@mui/material";
import { useUserStore } from "@/stores/userStore";
import { VestiqCoins } from "../../atoms/icons/VestiqCoins";
import { useToast } from "@/hooks/useToast";
export default function ImageFromText() {
  const [prompt, setPrompt] = useState<string>("");
  const toast = useToast();

  const [aspectRatio] = useState<string>("free");
  const [imageCount, setImageCount] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setCurrentGenerationId] = useState<string | null>(null);
  const { user } = useUserStore();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      user?.v_coins.current &&
      user?.v_coins?.current < calculateTotalCost()
    ) {
      return toast.use(
        "error",
        "Você não tem coins suficientes para gerar imagens"
      );
    }

    setIsLoading(true);
    setGeneratedImages(Array(4).fill(""));

    const submitFormData = {
      engine: "cf",
      fnName: "txt2img",
      originalPrompt: prompt,
      suggestions: prompt,
      format: aspectRatio,
      extraOpts: { seed: -1, imageCount },
    };

    try {
      const result = await useImageFromTextStore
        .getState()
        .handleSubmitTxt2Img(submitFormData);

      setCurrentGenerationId(
        result.generation_id ? result.generation_id : null
      );
      if (result && result.generation_id) {
        setCurrentGenerationId(result.generation_id);
        setGeneratedImages(result.generation_url || []);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao gerar imagens:", error);
      toast.use("error", "Ocorreu um erro ao gerar imagens:");

      setIsLoading(false);
    }
  };

  const calculateTotalCost = () => {
    return imageCount;
  };

  return (
    <div className="flex flex-col gap-4 mx-auto min-h-screen max-w-6xl px-4 my-4 md:my-8">
      <h1 className="text-lg xs:text-xl md:text-2xl font-bold text-gray-800">
        O que você deseja criar hoje?
      </h1>
      <div className="bg-white p-4 sm:p-6 w-full rounded-lg shadow-md">
        <form onSubmit={handleGenerate} className="w-full">
          <div className="relative w-full">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Modelo sorrindo em meio a uma avenida de carros movimentada atravessando a faixa de pedestres"
              className="w-full h-28 border border-gray-300 rounded-lg p-4 pb-14 sm:pb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className={`absolute flex bg-primary-background items-center justify-center right-[10px] sm:right-[20px] h-[35px] bottom-[10px] w-[35%] xs:w-[30%] sm:w-[25%] md:w-[20%] text-xs xs:text-sm sm:text-base bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 sm:py-3 rounded-lg font-bold ${
                isLoading || !prompt.trim()
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" className="mr-2" />
              ) : (
                <AutoAwesomeIcon className="mr-[6px] hidden xs:inline" />
              )}
              {isLoading ? "Gerando..." : "Gerar"}
              {!isLoading && (
                <span className="hidden sm:inline ml-1">imagem</span>
              )}
            </button>
          </div>
        </form>
        <div className="mt-4">
          <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Quantidade de imagens:
          </p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {[1, 2, 3, 4].map((count) => (
              <button
                type="button"
                key={count}
                className={`px-3 sm:px-4 py-2 border rounded-md text-xs sm:text-sm ${
                  imageCount === count
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setImageCount(count)}
              >
                {count} {count === 1 ? "img" : "imgs"} ({count}{" "}
                <span className="inline-block h-3 w-3 align-text-bottom">
                  <VestiqCoins />
                </span>
                )
              </button>
            ))}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-2">
            Custo total: {calculateTotalCost()}{" "}
            <span className="inline-block h-3 w-3 align-text-bottom">
              <VestiqCoins />
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {generatedImages[0].length > 0 && (
          <p className="text-gray-700 font-medium mb-4 text-sm sm:text-base">
            {prompt}
          </p>
        )}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {generatedImages.map((src, index) => (
            <div
              key={index}
              className={`w-full aspect-square bg-gray-200 flex items-center justify-center rounded-lg ${
                index >= imageCount
                  ? "opacity-30 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  : "cursor-pointer"
              }`}
              onClick={() => src && window.open(src, "_blank")}
            >
              {isLoading && index < imageCount ? (
                <CircularProgress size={40} color="inherit" />
              ) : src ? (
                <Image
                  src={src}
                  alt={`Imagem gerada ${index + 1}`}
                  className="flex-1 object-cover rounded-lg"
                  width={300}
                  height={300}
                />
              ) : (
                <CheckroomIcon className="text-[#565D6DFF]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
