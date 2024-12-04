import React from "react";

export default function Card({
  title,
  description,
  label,
  isBeta,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  label: string;
  isBeta: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <div className="border relative border-gray-200 rounded-lg p-6 shadow-md flex flex-col items-start bg-white w-[25%] h-[268px] min-w-[369px] animate-fade-in hover:shadow-lg">
      {icon}
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-bold text-[#49424A]">{title}</h3>
        {isBeta && (
          <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-full fixed right-0 top-0">
            BETA
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-gray-600">{description}</p>
      <button
        onClick={onClick}
        className="mt-auto text-red-500 font-bold text-sm hover:underline"
      >
        {label}
      </button>
    </div>
  );
}
