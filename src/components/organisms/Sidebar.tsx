import React, { useState } from "react";
import Image from "next/image";
import { FaHome, FaImages, FaInfoCircle, FaEnvelope } from "react-icons/fa";

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
      <div className="p-4 flex flex-col items-center">
        <Image
          src={"/img/logo-vestiq.png"}
          alt="Logo"
          width={isExpanded ? 120 : 50}
          height={isExpanded ? 120 : 50}
          priority={true}
        />
        <ul className={`mt-4 w-full`}>
          <li className="mb-2 flex items-center">
            <FaHome className="text-xl" />
            {isExpanded && <span className="ml-3">Studio</span>}
          </li>
          <li className="mb-2 flex items-center">
            <FaImages className="text-xl" />
            {isExpanded && <span className="ml-3">My Images</span>}
          </li>
          <li className="mb-2 flex items-center">
            <FaInfoCircle className="text-xl" />
            {isExpanded && <span className="ml-3">About</span>}
          </li>
          <li className="mb-2 flex items-center">
            <FaEnvelope className="text-xl" />
            {isExpanded && <span className="ml-3">Contact</span>}
          </li>
        </ul>
      </div>
    </div>
  );
}
