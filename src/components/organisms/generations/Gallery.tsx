import { useGenerationStore } from "@/stores";
import ImageCard from "./ImageCard";

export default function Gallery(): JSX.Element {
  const {  sortedGenerations } = useGenerationStore();

  return (
    <div className="animate-fade-in my-4 md:my-8 grid w-full 3xl:max-w-7xl mx-auto gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 3xl:grid-cols-6">
      {sortedGenerations &&
        sortedGenerations.map((generation) => (
          <ImageCard
            key={generation.id}
            data={generation}
          />
        ))}
    </div>
  );
}
