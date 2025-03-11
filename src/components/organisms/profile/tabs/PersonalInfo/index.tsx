/* eslint-disable @typescript-eslint/no-unused-vars */
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import { useTranslations } from "next-intl";

export default function PersonalInfo() {
  const { user } = useUserStore();
  const { isEditMode, setIsEditMode } = useGlobalStore();

  return (
    <main className="flex flex-col gap-8 select-none w-full py-4 lg:px-8"></main>
  );
}
