import { useGenerationStore } from "@/stores";
import ImageCard from "./ImageCard";

export default function Gallery(): JSX.Element {


  const { sortedGenerations } = useGenerationStore();

  const flattenedGenerations = sortedGenerations?.flatMap((generation) => {
    if (generation.batch_paths && generation.batch_paths.length > 0) {
      return generation.batch_paths.map((batchUrl: string, index: number) => ({
        ...generation,
        id: `${generation.id}-batch-${index}`, // ID único
        generated: batchUrl, // substitui imagem gerada
      }));
    }

    return [generation];
  });

  return (
    <div className="animate-fade-in my-4 md:my-8 grid w-full 3xl:max-w-7xl mx-auto gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 3xl:grid-cols-6">
      {flattenedGenerations?.map((generation) => (
        <ImageCard key={generation.id} data={generation} />
      ))}
    </div>
  );
}
