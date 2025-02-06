"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  EmojiEmotionsOutlined,
  FiberNew,
  HelpOutlineOutlined,
  InfoOutlined,
  LaunchOutlined,
  PlayCircleOutlineOutlined,
  ReportProblemOutlined,
  WhatsApp,
} from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import Image from "next/image";

interface BannerProps {
  id: number | null;
  title: string | null;
  description: string | null;
  background: string | null;
  creative: string | null;
  href: string | null;
  label: string | null;
  external: boolean | null;
  icon: string | null;
  locale: string | null;
  order: number | null;
}

const settings: Settings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 5000,
  waitForAnimate: true,
  speed: 500,
  pauseOnHover: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  lazyLoad: "ondemand",
  fade: true,
  nextArrow: <></>,
  prevArrow: <></>,
};

export default function Banner() {
  const carouselRef = useRef(null);

  return (
    <section className="min-h-64 w-full row-span-1">
      {banners.length > 1 ? (
        <Slider {...settings} ref={carouselRef}>
          {banners
            .sort((a, b) => {
              if (a.order === null && b.order === null) return 0; // Mantém a posição se ambos forem null
              if (a.order === null) return 1; // Deixa `a` no final
              if (b.order === null) return -1; // Deixa `b` no final

              return a.order - b.order; // Ordena os valores numéricos
            })
            .map((banner) => (
              <BannerCard key={banner.id} {...banner} />
            ))}
        </Slider>
      ) : (
        banners.length === 1 && <BannerCard {...banners[0]} />
      )}
    </section>
  );
}

const BannerCard = ({
  title,
  description,
  background,
  creative,
  href,
  label,
  external,
  icon,
}: Omit<BannerProps, "locale">) => {
  const router = useRouter();

  const handleBannerClick = () => {
    if (external && href) {
      window.open(href as string, "_blank");
    } else {
      router.push(href as string);
    }
  };

  const iconsMap = (icon: string) => {
    const iconProps: React.ComponentProps<typeof PlayCircleOutlineOutlined> = {
      fontSize: "medium",
    };

    switch (icon) {
      case "play":
        return <PlayCircleOutlineOutlined {...iconProps} />;
      case "whatsapp":
        return <WhatsApp {...iconProps} />;
      case "report":
        return <ReportProblemOutlined {...iconProps} />;
      case "help":
        return <HelpOutlineOutlined {...iconProps} />;
      case "info":
        return <InfoOutlined {...iconProps} />;
      case "emoji":
        return <EmojiEmotionsOutlined {...iconProps} />;
      case "launch":
        return <LaunchOutlined {...iconProps} />;
      case "new":
        return <FiberNew {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`group h-96 lg:h-64 flex flex-col lg:flex-row overflow-hidden rounded-xl relative transition-opacity duration-300`}
    >
      <Image
        src={background ? background : "/images/banner/default.png"}
        width={100}
        height={100}
        alt="redraw banner background"
        className="w-full h-full object-cover absolute"
        unoptimized
      />
      <div className="flex w-full flex-col gap-2 p-4 lg:p-6 lg:w-2/5 z-[1]">
        {title && (
          <h2 className="font-bold text-white md:whitespace-nowrap text-xl md:text-2xl lg:text-2xl">
            {title}
          </h2>
        )}

        {description && (
          <p className="max-w-md text-gray-400 text-xs md:text-sm xl:text-base">
            {description}
          </p>
        )}

        {href && label && (
          <Button
            startContent={iconsMap(icon as string)}
            onPress={handleBannerClick}
            size="lg"
            className="mt-4 lg:mt-auto w-fit btn bg-white"
          >
            {label}
          </Button>
        )}
      </div>

      {creative && (
        <div className="order-first h-full w-full lg:order-none p-4 lg:w-3/5 overflow-hidden z-[1]">
          <Image
            src={creative}
            width={100}
            height={100}
            alt={title as string}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-1000"
            unoptimized
          />
        </div>
      )}
    </div>
  );
};

const banners: BannerProps[] = [
  {
    id: 1,
    title: "title",
    description: "description",
    background: "/images/banners/bg-example.png",
    creative: "/images/creatives/creative-welcome-vestiq.png",
    href: "/",
    label: "label",
    external: false,
    icon: "play",
    locale: "en",
    order: 1,
  },
  {
    id: 2,
    title: "title",
    description: "description",
    background: "/images/banners/bg-example.png",
    creative: "/images/creatives/creative-welcome-vestiq.png",
    href: "https://google.com",
    label: "label",
    external: true,
    icon: "whatsapp",
    locale: "en",
    order: 2,
  },
];
