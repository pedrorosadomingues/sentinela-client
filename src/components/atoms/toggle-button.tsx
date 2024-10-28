import React from "react";

interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

function ToggleButton({ isOpen, onClick }: ToggleButtonProps) {
  return (
    <button type="button" onClick={onClick}>
      {isOpen ? "▾" : "▸"}
    </button>
  );
}

export default ToggleButton;
