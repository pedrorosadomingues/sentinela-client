/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import HistoryIcon from "@mui/icons-material/History";
import Card from "@/components/molecules/MainCard";
import { useImageFunctionStore, useMainStore } from "@/zustand-stores";
import { AiFillCamera } from "react-icons/ai";
import { ImageFunctionName } from "@/interfaces/imageFunction";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { useTranslations } from "next-intl";

export default function Home(): JSX.Element {
  const [visibleCards, setVisibleCards] = useState(0);

  const { imageFunctions, getImageFunctions } = useImageFunctionStore();
  const { setMainControl } = useMainStore();

  const text = useTranslations("home");

  const ICON_MAPPING = {
    "dress-model": (
      <AiFillCamera style={{ fontSize: 47, minWidth: 47, color: "#F10641" }} />
    ),
    txt2img: (
      <BorderColorIcon
        style={{
          fontSize: 47,
          minWidth: 47,
          color: "#F10641",
        }}
      />
    ),
    "render-traces": (
      <DesignServicesIcon
        style={{ fontSize: 47, minWidth: 47, color: "#F10641" }}
      />
    ),
  };

  const imageFunctionDetails: Record<
    ImageFunctionName,
    { description: string; label: string; isBeta: boolean }
  > = {
    "dress-model": {
      description: text("dress_model_description"),
      label: text("start"),
      isBeta: true,
    },
    "render-traces": {
      description: text("render_traces_description"),
      label: text("start"),
      isBeta: true,
    },
    txt2img: {
      description: text("txt2img_description"),
      label: text("start"),
      isBeta: false,
    },
  };

  useEffect(() => {
    getImageFunctions();
  }, [getImageFunctions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev < imageFunctions.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, [imageFunctions]);

  return (
    <div className="mt-10 p-10 rounded-xl w-full ml-[55px] bg-white mt-[90px] mb-auto flex flex-wrap gap-[1%]">
      <div className="border border-gray-200 rounded-lg shadow-md flex flex-col items-center mb-[15px] bg-white w-[17%] h-[268px] justify-center gap-[8px] min-w-[254px] animate-fade-in hover:shadow-lg">
        <HistoryIcon
          className="text-2xl text-[#FFFFFF] bg-[#F10641] rounded-full p-2"
          style={{ width: "80px", height: "80px", paddingRight: "10px" }}
        />
        <button
          className="text-[#49424A] font-bold text-sm hover:underline "
          onClick={() => setMainControl(text("my_generations"))}
        >
          {text("access_generations")}
        </button>
      </div>
      {imageFunctions &&
        imageFunctions.slice(0, visibleCards).map((func) => {
          const details =
            imageFunctionDetails[func.name as ImageFunctionName] || {};
          return (
            <Card
              key={func.id}
              title={text(func.name)}
              description={details.description}
              label={details.label}
              isBeta={details.isBeta}
              onClick={() => setMainControl(text(func.name))}
              icon={ICON_MAPPING[func.name as ImageFunctionName]}
            />
          );
        })}
    </div>
  );
}
