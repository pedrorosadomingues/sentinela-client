/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import Gallery from "../organisms/generations/Gallery";
import VestiqLoading from "../organisms/VestiqLoading";
import { useGenerationStore } from "@/stores";
import SelectedGenerationsNav from "../organisms/generations/SelectedGenerationNav";
import Filters from "../organisms/generations/Filters";

export default function MyGenerations() {
  const { getGenerations, generations, isFetching, selectedGenerations } =
    useGenerationStore();

  useEffect(() => {
    if (generations && generations.length > 0) {
      return;
    }

    getGenerations();
  }, []);

  if (isFetching) {
    return <VestiqLoading />;
  }

  return (
    <div>
      <div className="hidden md:block min-h-11">
        {selectedGenerations && selectedGenerations.length > 0 ? (
          <SelectedGenerationsNav />
        ) : (
          <Filters />
        )}
      </div>
      <div className="block md:hidden">
        <Filters />
      </div>

      {!isFetching && generations && generations.length < 1 ? (
        <div className="flex items-center justify-center animate-fade-in">
          <p className="text-lg font-semibold">No generations found</p>
        </div>
      ) : (
        <Gallery />
      )}
    </div>
  );
}
