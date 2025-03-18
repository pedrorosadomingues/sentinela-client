import Functions from "@/components/templates/Functions";
import React from "react";

export default function page({
  params,
}: {
  params: { key: string; locale: string };
}) {
  return <Functions fn={params.key} />;
}
