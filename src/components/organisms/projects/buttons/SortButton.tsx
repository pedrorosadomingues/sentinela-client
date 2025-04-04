/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ImportExportOutlined } from "@mui/icons-material";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import { useGenerationStore } from "@/stores/generationStore";
import { useProjectStore } from "@/stores/projectStore";
import { useTranslations } from "next-intl";

export default function SortButton() {
  const t = useTranslations("projects.sort_button"); // Uso de traduções
  const [sortedKey, setSortedKey] = useState({
    key: "newest-editions",
    label: t("newest_editions"),
  });

  const {
    generations,
    setGenerations,
    setSelectedGenerations,
    setGenerationsWithoutPaste,
  } = useGenerationStore();

  const { project, setProject, projects } = useProjectStore();

  const dropdownItems = [
    { key: "newest-editions", label: t("newest_editions") },
    { key: "oldest-editions", label: t("oldest_editions") },
  ];

  const sortAndSetData = (key: string) => {
    const sortedGenerations = generations?.map((item: any) => ({ ...item }));
    const sortedProjects = projects.map((item: any) => ({ ...item }));
    const sortedProject = {
      ...project,
      pastes: project?.pastes || [],
      generations: project?.generations || [],
    };

    setSelectedGenerations([]);

    switch (key) {
      case "newest-editions":
        sortedGenerations!.sort(
          (
            a: { started_at: string | Date },
            b: { started_at: string | Date }
          ) =>
            new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
        );
        sortedProjects.sort(
          (
            a: { created_at: string | Date },
            b: { created_at: string | Date }
          ) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;

      case "oldest-editions":
        sortedGenerations!.sort(
          (
            a: { started_at: string | Date },
            b: { started_at: string | Date }
          ) =>
            new Date(a.started_at).getTime() - new Date(b.started_at).getTime()
        );
        sortedProjects.sort(
          (
            a: { created_at: string | Date },
            b: { created_at: string | Date }
          ) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      // case "alphabetical-asc":
      //   if (sortedGenerations) {
      //     // Ordenar generations por nome de forma ascendente
      //     sortedGenerations.sort((a: { name: any }, b: { name: any }) =>
      //       (a.name || "").localeCompare(b.name || "")
      //     );
      //   }

      //   if (sortedProjects) {
      //     // Ordenar projects por nome de forma ascendente
      //     sortedProjects.sort((a: { name: any }, b: { name: any }) =>
      //       (a.name || "").localeCompare(b.name || "")
      //     );
      //   }

      //   if (sortedProject) {
      //     if (sortedProject.generations) {
      //       // Ordenar project.generations por nome ascendente
      //       sortedProject.generations.sort(
      //         (a: { name: any }, b: { name: any }) =>
      //           (a.name || "").localeCompare(b.name || "")
      //       );
      //     }

      //     if (sortedProject.pastes) {
      //       // Ordenar project.pastes por nome ascendente
      //       sortedProject.pastes.sort((a: { name: any }, b: { name: any }) =>
      //         (a.name || "").localeCompare(b.name || "")
      //       );
      //     }
      //   }
      //   break;
      // case "alphabetical-desc":
      //   if (sortedGenerations) {
      //     // Ordenar generations por nome de forma descendente
      //     sortedGenerations.sort((a: { name: any }, b: { name: any }) =>
      //       (b.name || "").localeCompare(a.name || "")
      //     );
      //   }

      //   if (sortedProjects) {
      //     // Ordenar projects por nome de forma descendente
      //     sortedProjects.sort((a: { name: any }, b: { name: any }) =>
      //       (b.name || "").localeCompare(a.name || "")
      //     );
      //   }

      //   if (sortedProject) {
      //     if (sortedProject.generations) {
      //       // Ordenar project.generations por nome descendente
      //       sortedProject.generations.sort(
      //         (a: { name: any }, b: { name: any }) =>
      //           (b.name || "").localeCompare(a.name || "")
      //       );
      //     }

      //     if (sortedProject.pastes) {
      //       // Ordenar project.pastes por nome descendente
      //       sortedProject.pastes.sort((a: { name: any }, b: { name: any }) =>
      //         (b.name || "").localeCompare(a.name || "")
      //       );
      //     }
      //   }
      //   break;
      default:
        break;
    }

    setGenerations(
      sortedGenerations!.map((item: any) => ({ ...item, checked: false }))
    );

    setGenerationsWithoutPaste(
      sortedGenerations!.map((item: any) => ({ ...item, checked: false }))
    );

    //setProjects(sortedProjects);
    setProject(sortedProject);
  };

  return (
    <Dropdown placement="bottom-end" backdrop="opaque">
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="bg-white"
          size="sm"
          startContent={<ImportExportOutlined fontSize="small" />}
        >
          {sortedKey.label}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("sort_actions")}
        variant="flat"
        disallowEmptySelection
        selectedKeys={sortedKey.key}
        onAction={(key) => {
          const selectedItem =
            dropdownItems.find((item) => item.key === key) || dropdownItems[0];
          setSortedKey(selectedItem);
          sortAndSetData(key as string);
        }}
      >
        {dropdownItems.map((item) => (
          <DropdownItem key={item.key} textValue={item.label}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
