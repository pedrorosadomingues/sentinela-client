import React from "react";
import { User } from "@/interfaces";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface ExpandSideBarButtonProps {
  isLocked: boolean;
  isExpanded: boolean;
  openCoinModal: boolean;
  user?: User;
  toggleLock: () => void;
  setOpenCoinModal: (value: boolean) => void;
}

export default function ExpandSideBarButton({
  isLocked,
  isExpanded,
  toggleLock,

}: ExpandSideBarButtonProps) {
  return (
    <div className="flex items-center justify-center flex-col esta">
      <button
        onClick={toggleLock}
        className={`bg-transparent p-2 rounded-full z-50 text-gray-600 hover:text-gray-800 focus:outline-none flex items-center justify-center ${
          isExpanded && "w-full"
        }`}
        title={isLocked ? "Fechar Sidebar" : "Abrir Sidebar"}
      >
        {!isLocked ? (
          <KeyboardDoubleArrowLeftIcon />
        ) : (
          <KeyboardDoubleArrowRightIcon />
        )}
      </button>
    </div>
  );
}
