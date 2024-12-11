/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useGenerationStore } from "@/zustand-stores";
import { useEffect, useState } from "react";
import GenerationCard from "@/components/molecules/GenerationCard";

export default function MyGenerations(): JSX.Element {
  const { getGenerations, generations } = useGenerationStore();

  useEffect(() => {
    getGenerations();
  }, [getGenerations]);

  if (generations.length < 1) {
    return (
      <div className="flex items-center justify-center animate-fade-in">
        <p className="text-lg font-semibold">No generations found</p>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-start animate-fade-in mt-[130px] ml-[-300px]">
      <div className="flex flex-wrap justify-center gap-4">
        {generations &&
          generations.map((generation) => (
            <GenerationCard key={generation.id} data={generation} />
          ))}
      </div>
    </div>
  );
}
