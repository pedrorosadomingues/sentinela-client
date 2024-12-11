/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useGenerationStore } from "@/zustand-stores";
import { useEffect, useState } from "react";
import GenerationCard from "@/components/molecules/GenerationCard";

export default function MyGenerations(): JSX.Element {
  const [visibleCards, setVisibleCards] = useState(0);

  const { getGenerations, generations } = useGenerationStore();

  useEffect(() => {
    getGenerations();
  }, [getGenerations]);

  useEffect(() => {
    if (generations && generations.length > 0) {
      const interval = setInterval(() => {
        setVisibleCards((prev) => {
          if (prev < generations.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [generations]);

  if (generations.length < 1) {
    return (
      <div className="flex items-center justify-center animate-fade-in">
        <p className="text-lg font-semibold">No generations found</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center animate-fade-in">
      <div className="flex flex-wrap justify-center gap-4">
        {generations &&
          generations.slice(0, visibleCards).map((generation) => (
            <GenerationCard key={generation.id} data={generation} />
          ))}
      </div>
    </div>
  );
}
