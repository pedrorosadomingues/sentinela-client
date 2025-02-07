"use client";

import { ReactNode } from "react";

interface EmailSendedMessageProps {
  icon: ReactNode;
  title: string;
  description: string;
  extraText?: string;
  buttonText: string;
  onButtonClick: () => void;
}

export default function EmailSendedMessage({
  icon,
  title,
  description,
  extraText,
  buttonText,
  onButtonClick,
}: EmailSendedMessageProps) {
  return (
    <div className="p-2 w-[80%] h-screen flex flex-col justify-center items-center max-w-[576px] m-auto text-justify">
      {icon}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2 text-sm max-w-md">{description}</p>

      {extraText && <p className="text-gray-500 text-xs mt-2">{extraText}</p>}

      <button
        onClick={onButtonClick}
        className="mt-6 px-5 py-2 bg-primary-background text-white font-semibold rounded-md shadow-md hover:opacity-90 transition"
      >
        {buttonText}
      </button>
    </div>
  );
}
