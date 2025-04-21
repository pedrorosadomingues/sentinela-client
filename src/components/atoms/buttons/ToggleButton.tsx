import React from "react";

interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ToggleButton({ isOpen, onClick }: ToggleButtonProps) {
  return (
    <button type="button" className="text-red-500" onClick={onClick}>
      {isOpen ? "▾" : "▸"}
    </button>
  );
}
