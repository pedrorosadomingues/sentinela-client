import {
  FullscreenOutlined,
  CloseFullscreenOutlined,
  FullscreenExitOutlined,
} from "@mui/icons-material";
import { Button, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function FullscreenView({ src }: { src: string }) {
  const [activeFullscreen, setActiveFullscreen] = useState(false);
  const t = useTranslations("functions.page");

  const toggleFullscreen = () => {
    setActiveFullscreen(!activeFullscreen);
  };

  const closeFullscreen = () => {
    setActiveFullscreen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }
    };

    if (activeFullscreen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeFullscreen]);

  return (
    <>
      <Button isIconOnly size="sm" onPress={toggleFullscreen}>
        {activeFullscreen ? (
          <CloseFullscreenOutlined />
        ) : (
          <FullscreenOutlined />
        )}
      </Button>

      {activeFullscreen && (
        <>
          <div className="fixed inset-0 z-40 bg-black bg-opacity-90" />
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <Image
              src={src}
              width={100}
              height={100}
              alt="Fullscreen View"
              className="w-full h-full object-contain"
            />
            <Tooltip
              content={t("fullscreen_close")}
              color="foreground"
              placement="bottom"
              showArrow
            >
              <Button
                isIconOnly
                size="sm"
                className="absolute top-2 right-2 z-50"
                onClick={closeFullscreen}
              >
                <FullscreenExitOutlined />
              </Button>
            </Tooltip>
          </div>
        </>
      )}
    </>
  );
}
