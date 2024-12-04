/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import HistoryIcon from "@mui/icons-material/History";

const Card = ({ title, description, label, isBeta, onClick }: any) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-md flex flex-col items-start bg-white w-[25%] mb-[15px] h-[268px] min-w-[369px]">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {isBeta && (
          <span className="ml-2 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
            BETA
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <button
        onClick={onClick}
        className="mt-auto text-red-500 font-bold text-sm hover:underline"
      >
        {label}
      </button>
    </div>
  );
};

const CardGrid = () => {
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

  return (
    <div className="mt-10 p-10 rounded-xl w-[100%] ml-[55px] bg-white mt-[90px] mb-[130px] flex flex-wrap gap-[1%]">
      <div className="border border-gray-200 rounded-lg  mb-[15px] shadow-md flex flex-col items-center bg-white w-[17%] h-[268px] justify-center gap-[8px] min-w-[254px]">
        <HistoryIcon
          className="text-2xl text-[#FFFFFF] bg-[#F10641] rounded-full p-2"
          style={{ width: "80px", height: "80px" }}
        />

        <button className="text-red-500 font-bold text-sm hover:underline">
          Acessar Gerações
        </button>
      </div>
      {cards.map((card, index) => (
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
