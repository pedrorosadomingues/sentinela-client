"use client";

import { Button } from "@heroui/react";
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

      <Button onPress={onButtonClick} color="secondary" className="mt-6">
        {buttonText}
      </Button>
    </div>
  );
}
