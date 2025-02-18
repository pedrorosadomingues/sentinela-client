/* eslint-disable @next/next/no-img-element */
"use client";

import { Image, useDisclosure } from "@nextui-org/react";
import { Visibility } from "@mui/icons-material";
import { Generation } from "@/interfaces";
import { useGenerationStore } from "@/zustand-stores";
import { ViewGenerationModal } from "./ViewGenerationModal";

export default function ImageCard({ data }: { data: Generation }) {
  const {
    generations,
    setGenerations,
    setSelectedGenerations,
    selectedGenerations,
  } = useGenerationStore();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function handleCheck() {
    const index = generations.findIndex((item: Generation) => item.id === data.id);

    if (index !== -1) {
      const selectedGenerations = [...generations];

      selectedGenerations[index] = {
        ...selectedGenerations[index],
        checked: !selectedGenerations[index].checked,
      };

      setGenerations(selectedGenerations);

      const selectedGenerationIds = selectedGenerations
        .filter((item) => item.checked)
        .map((item) => item.id);

      setSelectedGenerations(selectedGenerationIds);
    }
  }

  const handleOpen = () => {
    // setselectedGenerations([data.id]);

    onOpen();
  };

  const currentItem = generations.find((item: Generation) => item.id === data.id);
  const isChecked = currentItem?.checked || false;
  const isHidden = generations.find((item: Generation) => item.id === data.id)?.hidden;

  return (
    <>
      <div
        className={`relative group w-full aspect-square flex-col items-center justify-center ${
          isHidden ? "hidden" : "flex"
        } rounded-xl overflow-hidden `}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheck}
          className={`w-4 h-4 absolute top-4 left-2 z-[3] ${
            selectedGenerations && selectedGenerations.length > 0
              ? "hidden md:block"
              : "hidden group-hover:md:block"
          } cursor-pointer`}
        />

        <div
          id="img-container"
          className="flex items-center justify-center relative w-full h-full group bg-grayscale-100 shadow-sm shadow-black"
        >
          <Image
            radius="none"
            isZoomed
            onClick={
              selectedGenerations && selectedGenerations.length > 0
                ? handleCheck
                : () => null
            }
            src={data.path as string}
            alt={data.fn as string}
            className={`z-[0] w-full h-full object-cover text-xs ${
              selectedGenerations &&
              selectedGenerations.length > 0 &&
              "cursor-pointer"
            }`}
          />
          <div
            id="bg-overlay"
            className="transition-transform duration-500 ease-in-out translate-y-96 group-hover:translate-y-0 group-hover:flex items-center justify-center absolute z-[2] w-full h-full bg-secondary rounded-lg shadow-md pointer-events-auto cursor-pointer"
          >
            <div className="text-center w-full h-full flex flex-col items-center justify-around">
              <h3 className="text-white text-sm 2xl:text-base mb-2 w-3/4">
                {data.fn}
              </h3>
              <p
                className="text-white m-0 text-sm 2xl:text-base"
                onClick={() => handleOpen()}
              >
                <Visibility className="text-white" fontSize="small" />{" "}
                Visualizar
              </p>
            </div>
          </div>
        </div>
      </div>

      <ViewGenerationModal
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onOpen={onOpen}
        params={data?.params_fashn}
        src={data.path as string}
        id={data.id}
        showDelete
      />
    </>
  );
}
