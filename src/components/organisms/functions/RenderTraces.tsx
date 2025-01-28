"use client";

import { useState } from "react";
import Image from "next/image";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface ImageDetails {
  ambiente: string;
  estilo: string;
  modo: string;
  tipo: string;
  descricao: string;
}

export default function RenderTraces(): JSX.Element {
  const [imageDetails, setImageDetails] = useState<ImageDetails>({
    ambiente: "Interior",
    estilo: "",
    modo: "",
    tipo: "",
    descricao: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setImageDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado:", file.name);
    }
  };

  const handleSubmit = () => {
    console.log("Detalhes da imagem enviados:", imageDetails);
  };

  return (
    <div className="flex justify-center items-start min-h-screen max-w-6xl mx-auto my-4 md:my-8">
      {/* Seção 1: Upload */}
      <div className="flex flex-col items-center w-1/2 bg-white p-6 rounded-lg shadow-md mr-4">
        <div className="flex items-start justify-start gap-[5px]">
          <Image
            src="/icons/number-one-red.ico"
            alt="1"
            width={24}
            height={24}
          />
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Envie seu desenho
          </h2>
        </div>
        <div className="flex flex-col items-center  p-6 rounded-lg w-full text-center h-[639px]">
          <div className="mb-4">
            <Image
              src="/images/render-traces-first-placeholder.png"
              alt="Placeholder"
              className="w-[300px] h-[300px]"
              width={300}
              height={300}
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Para começar a renderizar a sua imagem, arraste um arquivo
            <br />
            ou clique no botão abaixo para enviar
          </p>
          <label
            htmlFor="fileUpload"
            className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600"
          >
            Enviar arquivo
          </label>
          <input
            id="fileUpload"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Seção 2: Detalhes da Imagem */}
      <div className="flex flex-col items-start w-1/2 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-start justify-start gap-[5px]">
          <Image
            src="/icons/number-two-red.ico"
            alt="2"
            width={24}
            height={24}
          />
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Detalhe sua imagem
          </h2>
        </div>
        <form className="w-full space-y-4">
          <div>
            <label
              htmlFor="ambiente"
              className="block text-sm font-medium text-gray-700"
            >
              Ambiente
            </label>
            <input
              type="text"
              id="ambiente"
              name="ambiente"
              value={imageDetails.ambiente}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="estilo"
              className="block text-sm font-medium text-gray-700"
            >
              Estilo
            </label>
            <input
              type="text"
              id="estilo"
              name="estilo"
              value={imageDetails.estilo}
              onChange={handleInputChange}
              placeholder="Nenhum"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="modo"
              className="block text-sm font-medium text-gray-700"
            >
              Modo
            </label>
            <input
              type="text"
              id="modo"
              name="modo"
              value={imageDetails.modo}
              onChange={handleInputChange}
              placeholder="Selecione"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo
            </label>
            <input
              type="text"
              id="tipo"
              name="tipo"
              value={imageDetails.tipo}
              onChange={handleInputChange}
              placeholder="Selecione"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700"
            >
              Detalhe as características
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={imageDetails.descricao}
              onChange={handleInputChange}
              placeholder="Digite aqui..."
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            ></textarea>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            <AutoAwesomeIcon className="mr-2"/> Gerar imagem agora!
          </button>
        </form>
      </div>
    </div>
  );
}
