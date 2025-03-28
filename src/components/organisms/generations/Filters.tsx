"use client";
import React, { useEffect } from "react";
import FilterButtons from "./FilterBtn";
import SortButton from "./SortBtn";
import { useProjectStore } from "@/stores";

export default function Filters() {
  const getAllProjects = useProjectStore(state => state.getAllProjects);

  useEffect(() => {
    getAllProjects();
  }, [getAllProjects]);

  return (
    <div className="flex flex-wrap items-center gap-2 p-1">
      <FilterButtons />
      <SortButton />
    </div>
  );
}
