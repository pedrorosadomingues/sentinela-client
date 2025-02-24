import PlansAndSubscriptions from "@/components/organisms/plans/PlansAndSubscriptions";
import MyProfile from "@/components/templates/MyProfile";
import { notFound } from "next/navigation";
import React from "react";

export default function page({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const availableKeys = ["profile", "plans"];

  if (!availableKeys.includes(searchParams.view as string)) {
    return notFound();
  }

  return (
    <>
      {searchParams.view === "profile" && <MyProfile />}
      {searchParams.view === "plans" && <PlansAndSubscriptions />}
    </>
  );
}
