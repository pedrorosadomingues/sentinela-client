/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ProjectsNav from "@/components/organisms/projects/ProjectsNav";
import ProjectsGallery from "@/components/organisms/projects/ProjectsGallery";
import { useGenerationStore } from "@/stores";
import Filters from "@/components/organisms/generations/Filters";

export default function MyProjects() {
  const { selectedGenerations } = useGenerationStore();

  return (
    <main className="w-full flex flex-col gap-4" role="main">
      <div className="hidden md:block min-h-11">
        {selectedGenerations && selectedGenerations.length > 0 ? (
          <ProjectsNav />
        ) : (
          <Filters />
        )}
      </div>
      <div className="block md:hidden">
        <Filters />
      </div>

      <ProjectsGallery />
    </main>
  );
}
