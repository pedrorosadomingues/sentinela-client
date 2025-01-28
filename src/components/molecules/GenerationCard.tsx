/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Generation } from "@/interfaces/generation";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadButton from "../atoms/DownloadButton";

export default function GenerationCard({ data }: { data: Generation }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleDelete = async () => {
    alert("Imagem deletada!");
  };

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
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800"
                >
                  <DeleteIcon />
                </button>
              </li>
              <li>
                <DownloadButton generation={data}/>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div
        id="img-container"
        className="flex items-center justify-center relative w-full h-full group"
      >
        <img
          src={data.path as string}
          alt={data.fn as string}
          className="z-[1] w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
