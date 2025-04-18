/* eslint-disable @next/next/no-async-client-component */
"use client";
import FolderContent from "@/components/organisms/projects/folder/FolderContent";
import ProjectsContent from "@/components/organisms/projects/ProjectsContent";
import ProjectsNav from "@/components/organisms/projects/ProjectsNav";
import { useGenerationStore } from "@/stores";
import Filters from "@/components/organisms/generations/Filters";

export default function ProjectFolders({
  searchParams,
}: {
  searchParams: {
    folder: string;
  };
}) {
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
      {searchParams.folder ? (
        <FolderContent folderId={searchParams.folder} />
      ) : (
        <ProjectsContent />
      )}
    </main>
  );
}
