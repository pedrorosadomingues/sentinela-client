/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFnStore } from "@/stores/fnStore";
import { useMaskStore } from "@/stores/maskStore";
/* eslint-disable @next/next/no-img-element */
import { getImageLuminosity } from "@/utils/image";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import ImageRanking from "./ImageRanking";

export default function PreviewImage({ src }: { src?: string }) {
  const t = useTranslations("functions.page");
  const previewElRef = useRef<any>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTextDark, setIsTextDark] = useState(false);
  const [message, setMessage] = useState(t("image_loading_initial"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentGeneration, currentImageScore } = useFnStore();
  const { setImageContainerDimensions } = useMaskStore();

  const preventDragHandler: React.DragEventHandler<HTMLImageElement> = (event) => {
    event.preventDefault();
  };

  const messages = useMemo(() => [t("image_loading_message_1"), t("image_loading_message_2")], [t]);

  useEffect(() => {
    setIsLoading(currentGeneration.isLoading);
  }, [currentGeneration.isLoading]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isLoading) {
      setSecondsElapsed(0);

      interval = setInterval(() => {
        setSecondsElapsed((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      setSecondsElapsed(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!src) return;

  //  handleCheckImageByAI(src as string);

    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      getImageLuminosity(img).then((luminosity) => {
        setIsTextDark(luminosity > 128);
      });
    };
  }, [src]);

  useEffect(() => {
    let messageInterval: NodeJS.Timeout | null = null;

    if (secondsElapsed > 20) {
      let messageIndex = 0;

      setMessage(messages[messageIndex]);

      messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        setMessage(messages[messageIndex]);
      }, 5000);
    } else {
      setMessage(t("image_loading_initial"));
    }

    return () => {
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [secondsElapsed > 20, messages]);

  useEffect(() => {
    if (!previewElRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        if (width !== 0 && height !== 0) {
          setImageContainerDimensions(width, height);
        }
      }
    });

    observer.observe(previewElRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return t("time_format", {
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    });
  };

  return (
    <div className="relative inset-0 flex items-center justify-center h-full w-full">
      <ImageRanking isDisabled={!currentImageScore} />
      {isLoading && (
        <div className="flex flex-col gap-4 text-center justify-center align-middle items-center font-medium absolute z-10 text-sm pointer-events-none">
          <img src="/logo.ico" alt="logo" className="h-12 transition-all ease-in animate-pulse redraw-loading-logo" />
          <span className={`drop-shadow-sm ${isTextDark ? "text-black" : "text-white"}`}>{message}</span>

          <span className={`drop-shadow-sm stroke-slate-900 ${isTextDark ? "text-vivid-blue-600" : "text-white"}`}>
            {formatTime(secondsElapsed)}
          </span>
        </div>
      )}

      <div>
        <img
          src={src}
          ref={previewElRef}
          crossOrigin="anonymous"
          alt="redraw initial image"
          className={`${isLoading && "animate-blur-pulse"} w-full`}
          onDragStart={preventDragHandler}
        />
      </div>
    </div>
  );
}
