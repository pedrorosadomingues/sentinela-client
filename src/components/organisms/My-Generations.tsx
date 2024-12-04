import { useGenerationStore } from "@/zustand-stores";
import { useEffect, useState } from "react";

export default function MyGenerations(): JSX.Element {
  const [visibleCards, setVisibleCards] = useState(0);

  const { getGenerations, generations } = useGenerationStore();

  useEffect(() => {
    getGenerations();

    console.log("generations", generations);
  }, [getGenerations]);

  useEffect(() => {
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
  }, [generations]);

  return (
    <div className="mt-[500px]">
      <div className="flex flex-wrap justify-center gap-4">
        {generations.slice(0, visibleCards).map((generation) => (
          <div
            key={generation.id}
            className="flex flex-col w-[300px] h-[300px] bg-white rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center p-4">
              <p className="text-lg font-semibold">
                Generation {generation.id}
              </p>
              <p className="text-sm text-gray-500">{generation.status}</p>
            </div>
            <div className="flex justify-center items-center h-[200px]">
              <img
                src={generation.path}
                alt="model"
                className="h-[200px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
