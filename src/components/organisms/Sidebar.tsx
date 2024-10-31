import React from "react";
import ToggleButton from "../atoms/Toggle-button";

export default function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClick = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);
  return (
    <div className="w-64 h-screen bg-gray-800 fixed left-0">
      <ToggleButton isOpen={isOpen} onClick={onClick} />
      <div className={`overflow-hidden ${isOpen ? "h-64" : "h-0"}`}>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
