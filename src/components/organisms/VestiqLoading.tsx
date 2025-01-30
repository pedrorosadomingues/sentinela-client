import Image from "next/image";
import { useMainStore } from "@/zustand-stores";
import { useTranslations } from "next-intl";

export default function VestiqLoading() {
  const { mainControl } = useMainStore();
  const text = useTranslations("home");

  return (
    <div
      className={`${
        mainControl === text("my_generations")
          ? "flex items-center w-full h-[90%] justify-center absolute bg-white z-50"
          : "flex items-center w-screen h-screen justify-center top-0 right-0 absolute bg-white z-50"
      }`}
    >
      <Image
        unoptimized
        src="/icons/logo-vestiq.ico"
        alt="Loading"
        className="animate-spin-bounce w-24 h-24"
        width={96}
        height={96}
      />
    </div>
  );
}
