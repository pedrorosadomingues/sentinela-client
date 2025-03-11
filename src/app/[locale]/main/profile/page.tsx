import MyProfile from "@/components/templates/MyProfile";
import { profileTabsKeys } from "@/utils/profile";
import { redirect } from "next/navigation";

export default function page({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const availableKeys = profileTabsKeys;

  if (!availableKeys.includes(searchParams.view as string)) {
    // return notFound();
    return redirect("/main/profile?view=profile");
  }

  return <MyProfile view={searchParams.view as string} />;
}
