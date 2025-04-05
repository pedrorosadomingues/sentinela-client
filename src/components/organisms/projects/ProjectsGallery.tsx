/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "./ProjectCard";
import { useProjectStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";
import { useGenerationStore } from "@/stores/generationStore";
import { usePasteStore } from "@/stores/pasteStore";

export default function ProjectsGallery() {
  const { projects, isLoading, setProject } = useProjectStore();
  const [selectedFolder, setSelectedFolder] = useState("");
  const router = useRouter();
  const {
    generationsWithoutPaste,
    setSelectedGenerations,
    setGenerationsWithoutPaste,
    setGenerations,
    setIsCheckedSelectAllBtn,
  } = useGenerationStore();
  const { setGenerationsObj, setPastes } = usePasteStore();
  const { user } = useUserStore();

  const handleProjectClick = (id: string) => {
    setSelectedFolder(id);

    router.push(`/main/projects/${id}`);
  };

  useEffect(() => {
    setIsCheckedSelectAllBtn(false);
    setGenerationsObj({});
    setProject(null);
    setSelectedGenerations([]);
    setGenerationsWithoutPaste([]);
    setGenerations([]);
    setPastes(null);
  }, [projects, user?.id, isLoading, setIsCheckedSelectAllBtn, setGenerationsObj, setProject, setSelectedGenerations, setGenerationsWithoutPaste, setGenerations, setPastes]);

  useEffect(() => {
    if (generationsWithoutPaste) {
    }
  }, [generationsWithoutPaste]);

  return (
    <section
      className={`
        grid w-full gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8
        `}
    >
      {projects?.map(
        (item: {
          total_generations: number;
          total_pastes: number;
          id: number;
          pastes: string | any[];
          name: string;
          generations: string | any[];
        }) => (
          <ProjectCard
            key={item.id}
            projectId={item.id as number}
            type="project"
            count={item.total_pastes ?? 0}
            image_count={item.total_generations ?? 0}
            name={item.name}
            onPress={() => handleProjectClick(item.id.toString())}
            isSelected={selectedFolder === item.id.toString() ? true : false}
          />
        )
      )}
    </section>
  );
}
