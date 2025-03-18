import MyProfile from "@/components/templates/MyProfile";
import { profileTabsKeys } from "@/utils/profile";
//import { redirect } from "next/navigation";

interface Props {
  searchParams: { view?: string };
}

export default function Page({ searchParams }: Props) {
  const view = searchParams.view;

  // Página com parâmetro válido renderiza normalmente
  if (view && profileTabsKeys.includes(view)) {
    return <MyProfile view={view} />;
  }

  // Página padrão, sem redirecionamento server-side:
  return <MyProfile view="profile" />;
}
