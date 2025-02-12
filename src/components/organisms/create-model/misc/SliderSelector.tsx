import React from "react";
import { Slider } from "@heroui/react";
import Image from "next/image";

interface CustomSliderProps {
  label: string;
  value: string;
  onChange: (value: number) => void;
  marks: { value: number; label: string }[];
  iconStartPath: string;
  iconEndPath: string;
}

export function SliderSelector({
  label,
  value,
  onChange,
  marks,
  iconStartPath,
  iconEndPath,
}: CustomSliderProps) {
  return (
    <div className="flex gap-2 md:gap-4 items-center">
      {/* Ícone à esquerda */}
      <Image
        src={iconStartPath}
        alt={`start-${label}`}
        width={56}
        height={56}
      />

      {/* Slider */}
      <Slider
        color="secondary"
        aria-label={`${label} slider`}
        marks={marks}
        classNames={{ mark: "text-xs whitespace-nowrap" }}
        onChange={(value) => onChange(value as number)}
        showSteps={true}
        minValue={0}
        maxValue={marks.length - 1}
        defaultValue={marks.findIndex((mark) => mark.label === value)}
      />

      {/* Ícone à direita */}
      <Image
        src={iconEndPath}
        alt={`end-${label}`}
        width={56}
        height={56}
      />
    </div>
  );
}
