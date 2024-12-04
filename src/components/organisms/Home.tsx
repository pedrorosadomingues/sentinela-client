/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import HistoryIcon from "@mui/icons-material/History";
import Card from "@/components/molecules/MainCard";
import { useImageFunctionStore } from "@/zustand-stores";

const CardGrid = () => {
  const [visibleCards, setVisibleCards] = useState(0);

  const { imageFunctions, getImageFunctions } = useImageFunctionStore();

  const cards = [
    {
      title: "Vestir modelo",
      description:
        "Adicione qualquer roupas únicas ou peças completas a um modelo utilizando IA.",
      label: "Começar",
      isBeta: true,
    },
    {
      title: "Renderizar traços",
      description:
        "Transforme os seus esboços, desenhos e croquis em realidade com a ferramenta de renderizar traços da Vestiq.",
      label: "Começar",
      isBeta: true,
    },
    {
      title: "Imagem a partir de texto",
      description:
        "Crie uma imagem a partir de uma descrição textual. Transforme ideias em representações visuais para projetos criativos ou conceituais.",
      label: "Começar",
      isBeta: false,
    },
  ];

  useEffect(() => {
    getImageFunctions();
  }, [getImageFunctions]);

  useEffect(() => {
    if (imageFunctions !== null) {
      console.log(imageFunctions);
    }
  }, [imageFunctions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev < cards.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 p-10 rounded-xl w-full ml-[55px] bg-white mt-[90px] mb-auto flex flex-wrap gap-[1%]">
      <div className="border border-gray-200 rounded-lg shadow-md flex flex-col items-center mb-[15px] bg-white w-[17%] h-[268px] justify-center gap-[8px] min-w-[254px] animate-fade-in hover:shadow-lg">
        <HistoryIcon
          className="text-2xl text-[#FFFFFF] bg-[#F10641] rounded-full p-2"
          style={{ width: "80px", height: "80px" }}
        />
        <button className="text-red-500 font-bold text-sm hover:underline">
          Acessar Gerações
        </button>
      </div>
      {cards.slice(0, visibleCards).map((card, index) => (
        <Card
          key={index}
          title={card.title}
          description={card.description}
          label={card.label}
          isBeta={card.isBeta}
          onClick={() => alert(`${card.title} clicado!`)}
        />
      ))}
    </div>
  );
};

export default CardGrid;
