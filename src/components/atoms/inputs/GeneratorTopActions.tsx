import { useTranslations } from "next-intl";
import OriginalImageButton from "@/components/atoms/buttons/OriginalImageButton";
import CompareImageButton from "@/components/atoms/buttons/CompareImageButton";

export default function GeneratorTopActions() {
  const t = useTranslations("functions.page");

  return (
    <nav className="h-full lg:min-h-min min-w-[300px] !flex-col !justify-between relative w-full p-2">
      <div className="w-full flex justify-between mb-2">
        <h2 className="text-lg xl:text-2xl text-font font-medium font-lexend">
          {t("title")}
        </h2>
        <div className="flex gap-2">
          <OriginalImageButton />
          <CompareImageButton />
        </div>
      </div>
    </nav>
  );
}
