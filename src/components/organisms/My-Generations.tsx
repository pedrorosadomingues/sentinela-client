/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useGenerationStore } from "@/zustand-stores";
import { useEffect, useState } from "react";
import GenerationCard from "@/components/molecules/GenerationCard";
import VestiqLoading from "./VestiqLoading";

export default function MyGenerations(): JSX.Element {
  const { getGenerations, generations, isFetching } = useGenerationStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getGenerations();
  }, [getGenerations, isLoading]);

  if (isFetching) {
    return <VestiqLoading />;
  }

  if (!isFetching && generations.length < 1) {
    return (
      <div className="flex items-center justify-center animate-fade-in">
        <p className="text-lg font-semibold">No generations found</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in my-4 md:my-8 grid w-full 3xl:max-w-7xl mx-auto gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 3xl:grid-cols-6">
      {generations &&
        generations.map((generation) => (
          <GenerationCard key={generation.id} data={generation} isLoading={isLoading} setIsLoading={setIsLoading} />
        ))}
    </div>
  );
}
