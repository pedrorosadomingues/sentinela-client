import MyGenerations from "@/components/templates/MyGenerations";
import { notFound } from "next/navigation";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams?.category || "";
  const availableKeys = ["results", "models"];

  if (!category || category === "" || !availableKeys.includes(category)) {
    return notFound();
  }
  // http://localhost:3000/pt/main/generations?category=results

  return (
    <>
      {category === "results" && <MyGenerations />}
      {category === "models" && <div>Modelos</div>}
    </>
  );
}
