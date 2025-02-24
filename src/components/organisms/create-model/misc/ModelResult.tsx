/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCreateModelStore } from "@/stores/createModelStore";
import { Image } from "@heroui/react";
import React from "react";

export function ModelResult() {
  const { generatedModel } = useCreateModelStore();

  return (
    <article className="w-full flex items-center">
      <Image
        alt={`Image of custom model`}
        className="object-contain w-96 h-full aspect-square"
        src={generatedModel as string}
      />
    </article>
  );
}
