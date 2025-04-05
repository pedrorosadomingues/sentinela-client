/* eslint-disable @next/next/no-async-client-component */
import ProjectFolders from "@/components/templates/ProjectFolders";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    folder: string;
  };
}) {
  return (
    <main className="w-full flex flex-col gap-4" role="main">
      <ProjectFolders searchParams={searchParams} />
    </main>
  );
}
