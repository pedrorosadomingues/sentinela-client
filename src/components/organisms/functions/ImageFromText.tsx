"use client";

import { useState } from "react";
import Image from "next/image";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ColorLesnIcon from "@mui/icons-material/ColorLens";
import CheckroomIcon from "@mui/icons-material/Checkroom";

export default function ImageFromText() {
  const [prompt, setPrompt] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("free");
  const [generatedImages, setGeneratedImages] = useState<string[]>([
    "", 
    "",
    "",
    "",
  ]);

  const handleGenerate = () => {
    console.log("Prompt enviado:", prompt);
    console.log("Formato selecionado:", aspectRatio);
    setGeneratedImages(["/placeholder.png", "/placeholder.png"]);
  };

  return (
    <div className="p-8 bg-gray-100 min-h- w-[80%] screen mt-[50px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        O que você deseja criar hoje?
      </h1>

      <div className="bg-white p-6 w-full rounded-lg shadow-md mb-6">
        <div className="relative w-full">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Modelo sorrindo em meio a uma avenida de carros movimentada atravessando a faixa de pedestres"
            className="w-full h-28 border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerate}
            className="absolute flex bg-primary-background items-center justify-center right-[20px] h-[35px] bottom-[15px] mt-6 w-[20%] bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:opacity-90"
          >
            <AutoAwesomeIcon className="mr-[6px]" />
            Gerar imagem agora!
          </button>
        </div>
        <div className="flex items-center mt-4">
          <button
            className={`flex items-center px-4 py-2 mr-4 border rounded-md`}
            onClick={() => setAspectRatio("free")}
          >
            <ColorLesnIcon className="mr-[6px]" /> Formato livre
          </button>
          <button
            className={`flex items-center px-4 py-2 border rounded-md ${
              aspectRatio === "1:1"
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => setAspectRatio("1:1")}
          >
            <input
            type="checkbox"
            className="mr-2"
            /> 1:1
          </button>
        </div>
      </div>

      {/* Galeria de imagens geradas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 font-medium mb-4">
          Gere uma roupa bem bonita
        </p>
        <div className="flex gap-[15px]">
          {generatedImages.map((src, index) => (
            <div
              key={index}
              className="w-[353px] h-48 bg-gray-200 flex items-center justify-center rounded-lg"
            >
              {src ? (
                <Image
                  src={src}
                  alt={`Imagem gerada ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
             <CheckroomIcon
             className="text-[#565D6DFF]"
             />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
