import React from "react";
import { ScrollShadow, Image } from "@heroui/react";

interface GalleryProps<T extends string> {
  items: T[];
  selectedItem: T;
  onSelectItem: (item: T) => void;
  imagePath: string;
  imageSuffix?: string;
  imageType?: string;
  gender?: "male" | "female";
}

export function Gallery<T extends string>({
  items,
  selectedItem,
  onSelectItem,
  imagePath,
  imageSuffix = "",
  imageType = "webp",
  gender,
}: GalleryProps<T>) {
  return (
    <ScrollShadow className="w-full max-h-56 scrollbar overflow-x-hidden px-2" size={10}>
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-4">
        {items.map((item) => (
          <div
            key={item}
            className={`flex items-center justify-center ${
              selectedItem === item ? "opacity-30" : "opacity-100"
            }`}
          >
            <Image
              alt={item}
              src={`${imagePath}/${gender ? `${gender}_` : ""}${imageSuffix}${item}.${imageType}`}
              radius="lg"
              shadow="sm"
              isZoomed
              onClick={() => onSelectItem(item)}
              className="z-0 cursor-pointer object-contain aspect-square w-full h-full flex-1"
            />
          </div>
        ))}
      </div>
    </ScrollShadow>
  );
}
