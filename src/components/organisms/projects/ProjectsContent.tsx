/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ArrowRight } from "@mui/icons-material";
import { useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/stores/projectStore";
import ImageCard from "@/components/organisms/generations/ImageCard";
import { useGenerationStore } from "@/stores/generationStore";
import { usePasteStore } from "@/stores/pasteStore";
import { useTranslations } from "next-intl";

export default function ProjectsContent(): JSX.Element {
  const t = useTranslations("projects.projects_content");

  const {
    setGenerations,
    setSelectedGenerations,
    generations,
    sortedGenerations,
    setSortedGenerations,
  } = useGenerationStore();

  const [filteredProject, setFilteredProject] = useState<any | null>(null);

  const [selectedImage, setSelectedImage] = useState<string>("");

  const { onOpenChange } = useDisclosure();

  const { project, getProjectById, isLoading, setSelectedProjectId } =
    useProjectStore();

  const { setPastes } = usePasteStore();

  const router = useRouter();

  const params = useParams();

  const { id: projectId } = params;

  useEffect(() => {
    setPastes(null);
    setSelectedGenerations([]);
    const fetchData = async () => {
      await getProjectById(projectId as any);
    };

    setSelectedProjectId(projectId as any);
    fetchData();
  }, [
    projectId,
    isLoading,
    setPastes,
    setSelectedGenerations,
    setSelectedProjectId,
    getProjectById,
  ]);

  useEffect(() => {
    if (project) {
      setFilteredProject(project as any);
    }
    setGenerations(project?.generations);
    setSortedGenerations(project?.generations);
  }, [project, setGenerations, setSortedGenerations]);

  const handleCardClick = (item: any) => {
    if (typeof item === "string") {
      setSelectedImage(item);
      return onOpenChange();
    }

    router.push(`/main/projects/${projectId}?folder=${item?.id}`);
  };

  return (
    <div className="w-full relative">
      {filteredProject?.pastes?.length > 0 && (
        <>
          <section className="flex items-center gap-4 w-full my-8">
            <h2 className="flex items-center text-xl font-medium font-lexend">
              <ArrowRight className="text-primary" />
              {t("folders")}
            </h2>

            <hr className="relative top-1 border-1 border-dashed w-full" />
          </section>

          <section className="mt-4 grid w-full gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-8">
            {filteredProject.pastes?.map((item: any) => (
              <ProjectCard
                key={item.id}
                pasteId={item.id as number}
                projectId={item.project_id}
                type="folder"
                count={item.totalFiles ?? 0}
                image_count={item.generations?.length}
                name={item.name}
                onPress={() => handleCardClick(item)}
              />
            ))}
          </section>
        </>
      )}

      {generations && generations?.length > 0 && (
        <>
          <section className="flex items-center gap-4 w-full my-8">
            <h2 className="flex items-center text-xl font-medium font-lexend">
              <ArrowRight className="text-primary" />
              {t("files")}
            </h2>

            <hr className="relative top-1 border-1 border-dashed w-full" />
          </section>

          <section className="mt-4 grid w-full gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 3xl:grid-cols-8">
            {sortedGenerations?.map((item: any) => (
              <ImageCard key={item.id} data={item} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}
