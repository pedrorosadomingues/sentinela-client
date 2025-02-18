import React from "react";
import FilterButtons from "./FilterBtn";
import SortButton from "./SortBtn";

export default function Filters() {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1">
      <FilterButtons />
      <SortButton />
    </div>
  );
}
