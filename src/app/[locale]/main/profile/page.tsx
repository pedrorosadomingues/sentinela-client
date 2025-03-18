import MyProfile from "@/components/templates/MyProfile";
import { profileTabsKeys } from "@/utils/profile";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { view?: string };
}

export default function Page({ searchParams }: PageProps) {
  // const availableTabs = profileTabsKeys;
  const view = searchParams.view;

  // Validação segura do parâmetro 'view'
  if (!view || !profileTabsKeys.includes(view)) {
    redirect("/main/profile?view=profile"); // 👈 aqui, sempre use caminho absoluto
  }

  return <MyProfile view={view} />;
}
