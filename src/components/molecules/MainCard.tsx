import React from "react";

export default function Card({
  title,
  description,
  label,
  isBeta,
  onClick,
}: {
  title: string;
  description: string;
  label: string;
  isBeta: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-md flex flex-col items-start bg-white w-[25%] mb-[15px] h-[268px] min-w-[369px] animate-fade-in hover:shadow-lg">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {isBeta && (
          <span className="ml-2 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
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
