import React from "react";
import Image from "next/image";
import { User } from "@/interfaces";

interface CoinsHoverBoxProps {
  isLocked: boolean;
  isExpanded: boolean;
  openCoinModal: boolean;
  user?: User;
  setOpenCoinModal: (value: boolean) => void;
}

export default function CoinsHoverBox({
  isLocked,
  isExpanded,
  openCoinModal,
  user,
  setOpenCoinModal,
}: CoinsHoverBoxProps) {
  return (
    <div
      className="relative flex border border-gray-200 rounded-[10px] p-2 mt-4 gap-4"
      onMouseEnter={() => isLocked && setOpenCoinModal(true)}
      onMouseLeave={() => isLocked && setOpenCoinModal(false)}
    >
      <div
        className={`fixed flex border border-gray-200 z-[99] rounded-[10px] p-2 left-[65px] bottom-[20px] mb-[12px] bg-white
          ${openCoinModal ? "" : "hidden"}`}
      >
        <span className="text-[#F10641]">
          {Number(user?.v_coins ?? 0).toFixed(2)}V
        </span>
      </div>

      <Image
        src="/icons/coins-icon.png"
        alt="Logo"
        width={25}
        height={25}
        priority={true}
      />

      {isExpanded && user && "v_coins" in user && (
        <span className="text-[#F10641]">
          {Number(user.v_coins).toFixed(2)}V
        </span>
      )}
    </div>
  );
}
