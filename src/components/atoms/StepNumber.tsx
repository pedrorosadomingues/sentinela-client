import React from "react";

export default function StepNumber({
  number,
  label,
}: {
  number: number;
  label: string;
}) {
  return (
    <div className="hidden md:flex gap-2 items-center font-lexend">
      <span className="flex items-center justify-center w-6 h-6 border-3 border-secondary rounded-full text-secondary text-xs font-bold text-center">
        {number}
      </span>
      <label className="text-base text-font font-medium">{label}</label>
    </div>
  );
}
