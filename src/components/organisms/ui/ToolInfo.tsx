"use client";

import { InfoOutlined } from "@mui/icons-material";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import ReactPlayer from "react-player";

interface ToolInfoProps {
  href?: string;
  title: string;
  text: string;
  video?: string;
}

export default function ToolInfo({ href, title, text, video }: ToolInfoProps) {
  const t = useTranslations("tool-info");
  const [show, setShow] = useState<boolean>(false);

  const toggleShow = () => setShow(!show);

  if (!title || !text) return null;

  return (
    <Popover
      showArrow
      color="foreground"
      backdrop="opaque"
      isOpen={show}
      onClose={toggleShow}
    >
      <PopoverTrigger className="cursor-pointer">
        <InfoOutlined
          className="opacity-25 hover:text-primary-light hover:opacity-100"
          fontSize="small"
          onClick={toggleShow}
        />
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <div className="flex flex-col gap-2 max-w-[260px]">
          <h3 className=" font-bold">{title}</h3>
          {video && (
            <ReactPlayer
              url={video}
              width="100%"
              height="100%"
              loop
              muted
              playing
              controls={false}
            />
          )}
          <p className="text-xs">{text}</p>
          {href && (
            <Link href={href as string} target="_blank" className="ml-auto">
              <Button
                size="sm"
                color="primary"
                className="btn-primary-gradient"
              >
                {t('see_more')}
              </Button>
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
