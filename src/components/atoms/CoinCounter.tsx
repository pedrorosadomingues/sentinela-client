import { Card } from "@heroui/react";
import React from "react";
import { VestiqCoins } from "./icons/VestiqCoins";
import { UserProps } from "@/interfaces";

export default function CoinCounter({
  user,
  hideCounter,
  onlyCounter,
  hideBorder,
}: {
  user: UserProps;
  hideCounter?: boolean;
  onlyCounter?: boolean;
  hideBorder?: boolean;
}): JSX.Element {
  if (onlyCounter) {
    return (
      <span className="text-secondary select-none">
        {user.v_coins.total - user?.v_coins.current + "/" + user?.v_coins.total}
      </span>
    );
  }

  return (
    <Card
      className={`flex-row items-center gap-2 px-4 py-1 ${!hideBorder && "border-1.5 border-default-300"} text-base`}
      shadow="none"
      radius="sm"
    >
      <VestiqCoins />
      {!hideCounter && (
        <span className="text-secondary select-none mx-auto">
          {user.v_coins.total -
            user?.v_coins.current +
            "/" +
            user?.v_coins.total}
        </span>
      )}
    </Card>
  );
}
