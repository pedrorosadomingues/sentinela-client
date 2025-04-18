/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowRight } from "@mui/icons-material";
import ImageCard from "@/components/organisms/generations/ImageCard";
import { usePasteStore } from "@/stores/pasteStore";
import { useGenerationStore } from "@/stores/generationStore";
import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useTranslations } from "next-intl";

export default function FolderContent({
  folderId,
}: {
  folderId: string;
}): JSX.Element {
  const t = useTranslations("projects.folder_content");
  const { pastes, getPaste } = usePasteStore();
  const { setGenerations, setSelectedGenerations, generations, sortedGenerations, setSortedGenerations } =
    useGenerationStore();
  const { isLoading } = useProjectStore();

  useEffect(() => {
    setSelectedGenerations([]);
    const fetchData = async () => {
      await getPaste(folderId);
    };
    fetchData();
  }, [folderId, getPaste, isLoading, setSelectedGenerations]);

  useEffect(() => {
    if (pastes) {
      setGenerations(pastes?.generations);
      setSortedGenerations(pastes?.generations);
    }
  }, [pastes, isLoading, setGenerations, setSortedGenerations]);

  return (
    <>
      {generations && pastes && generations?.length > 0 && (
        <>
          <section className="flex items-center gap-4 w-full my-8">
            <h2 className="flex items-center text-xl font-medium font-lexend">
              <ArrowRight className="text-primary" />
              {t("files")}
            </h2>
            <hr className="relative top-1 border-1 border-dashed w-full" />
          </section>
          <div className="mt-4 grid w-full gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-8">
            {pastes &&
              sortedGenerations?.map((generation: any) => (
                <ImageCard key={generation.id} data={generation} />
              ))}
          </div>
        </>
      )}
    </>
  );
}
