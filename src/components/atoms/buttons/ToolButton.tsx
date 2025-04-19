import React, { useRef } from "react";
import { Tooltip } from "@mui/material";
import { Button } from "@nextui-org/react";

export default function ToolButton({
  icon,
  onPress,
  isActive,
  isDisabled,
  tooltipInfo,
}: {
  icon: React.ReactNode;
  onPress: () => void;
  isActive: boolean;
  isDisabled: boolean;
  tooltipInfo: string;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Função para interceptar teclas pressionadas
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Spacebar") {
      // Detecta a tecla espaço
      e.preventDefault(); // Evita a ação padrão (pressionar o botão)
    }
  };

  const handleClick = () => {
    if (onPress) {
      onPress();
    };

    if (buttonRef.current) {
      buttonRef.current.blur();
    };
  };

  return (
    <>
      <Tooltip
        title={<span className="text-base">{tooltipInfo}</span>}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="pointer-events-auto"
      >
        <span className="inline-block">
          <Button
            ref={buttonRef}
            size="sm"
            onPress={handleClick}
            isDisabled={isDisabled}
            variant={isActive ? "solid" : "bordered"}
            color={isActive ? "primary" : "default"}
            isIconOnly
            onKeyDown={handleKeyDown}
          >
            {icon}
          </Button>
        </span>
      </Tooltip>
    </>
  );
}
