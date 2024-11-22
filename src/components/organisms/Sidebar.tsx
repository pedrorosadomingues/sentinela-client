import React, { useState } from "react";
import Image from "next/image";

export default function Sidebar(): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onMouseEnter={toggleSidebar}
      onMouseLeave={toggleSidebar}
      className={`fixed top-0 left-0 h-screen bg-[#FFFFFF] text-black transition-all duration-300 border-r border-gray-200`}
      style={{
        width: isExpanded ? "230px" : "75px",
      }}
    >
      <div className="p-4">
        <Image
          src={"/img/logo-vestiq.png"}
          alt="Logo"
          width={120}
          height={120}
          priority={true}
        />
        <ul className={`mt-4 ${isExpanded ? "block" : "hidden"}`}>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Studio
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              My Images
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              About
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
