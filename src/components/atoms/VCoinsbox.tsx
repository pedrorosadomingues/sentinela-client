import React from "react";
import { UserProps } from "@/interfaces";
import { VestiqCoins } from "../organisms/icons/VestiqCoins";
import CoinCouter from "./CoinCounter";
import { Tooltip } from "@heroui/react";

interface CoinsHoverBoxProps {
  isLocked: boolean;
  isExpanded: boolean;
  openCoinModal: boolean;
  user?: UserProps | null;
  setOpenCoinModal: (value: boolean) => void;
}

export default function CoinsHoverBox({
  isLocked,
  isExpanded,
  user,
  setOpenCoinModal,
}: CoinsHoverBoxProps) {
  return (
    <Tooltip
      content={user && <CoinCouter user={user} onlyCounter />}
      placement="right"
      hidden={!isLocked || isExpanded}
      showArrow
    >
      <div
        className="relative flex border border-gray-200 rounded-[10px] p-2 mt-4 gap-4"
        onMouseEnter={() => isLocked && setOpenCoinModal(true)}
        onMouseLeave={() => isLocked && setOpenCoinModal(false)}
      >
        <VestiqCoins />
        {isExpanded && user && <CoinCouter onlyCounter user={user} />}
      </div>
    </Tooltip>
  );
}
