/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Generation } from "@/interfaces/generation";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadButton from "../atoms/DownloadButton";
import { Image } from "@heroui/react";
import { deleteGeneration } from "@/services";
import { useGlobalStore } from "@/zustand-stores";
import ConfirmationButton from "../atoms/ConfirmationButton";

export default function GenerationCard({
  data,
  isLoading,
  setIsLoading,
}: {
  data: Generation;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}): JSX.Element {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { openConfirmation, closeConfirmation } = useGlobalStore();

  function toggleMenu() {
    setIsMenuVisible(!isMenuVisible);
  }

  function confirmDelete() {
    openConfirmation(
      "Excluir Imagem",
      "Tem certeza que deseja excluir esta imagem? Essa ação não pode ser desfeita.",
      handleDelete,
      closeConfirmation
    );
  }

  async function handleDelete() {
    setIsLoading(true);
    const res = await deleteGeneration([data.id]);
    setIsLoading(false);

    if (res.status === 200) {
      closeConfirmation();
    } else {
      alert("Falha ao excluir geração.");
    }
  }

  return (
    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-default-200">
      <div className="absolute top-2 right-2 z-[2]">
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
          onClick={toggleMenu}
        >
          <FaEllipsisV />
        </button>

        {isMenuVisible && (
          <div className="absolute top-10 right-0 bg-white shadow-lg rounded-lg p-2 z-[3]">
            <ul className="flex flex-col gap-2">
              <li>
                <ConfirmationButton
                  isLoading={isLoading}
                  onClick={confirmDelete}
                  color="danger"
                  size="sm"
                >
                  <DeleteIcon />
                </ConfirmationButton>
              </li>
              <li>
                <DownloadButton generation={data} />
              </li>
            </ul>
          </div>
        )}
      </div>

      <div
        id="img-container"
        className="flex items-center justify-center relative w-full h-full group bg-default-200"
      >
        <Image
          src={data.path as string}
          alt={data.fn as string}
          className="z-[1] w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
