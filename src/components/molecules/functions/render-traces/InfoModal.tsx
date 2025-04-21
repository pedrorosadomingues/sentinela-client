"use client";

import React from "react";
import {
  Button,
  ButtonVariantProps,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Progress,
} from "@nextui-org/react";
import Image from "next/image";
import ReactPlayer from "react-player";
import Link from "next/link";

const isFormat = (src: string, formats: string[]) =>
  formats.some((format) => src.toLowerCase().endsWith(format));

const availableFormats = {
  image: [".png", ".jpg", ".jpeg", ".gif"],
  video: [".mp4"],
};

export default function InfoModal({
  isOpen,
  onPress,
  label,
  color,
  src,
  title,
  text,
  href,
  showProgress,
  progressOptions,
  isDismissable,
  hideCloseButton,
  onPressCloseButton,
  secondaryAction,
  disableCloseEvent,
  backdrop,
  shouldBlockScroll,
  currentAds,
}: {
  isOpen: boolean;
  onPress: () => void;
  label?: string;
  color?: ButtonVariantProps["color"];
  src?: string;
  title: string;
  text: string;
  href?: string;
  showProgress?: boolean;
  progressOptions?: {
    value: number;
    max: number;
  };
  isDismissable?: boolean;
  hideCloseButton?: boolean;
  onPressCloseButton?: () => void;
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  disableCloseEvent?: boolean;
  backdrop?: ModalProps["backdrop"];
  shouldBlockScroll?: boolean;
  currentAds?: {
    title: string;
    text: string | HTMLElement;
    href: string;
    label: string;
    src: string;
  };
}) {
  const renderMedia = () => {
    if (!src || typeof src !== "string") {
      return null;
    }

    const isBase64Image = src.startsWith("data:image/");
    const isBase64Video = src.startsWith("data:video/");

    if (isFormat(src, availableFormats.image) || isBase64Image) {
      return (
        <Image
          src={src}
          width={200}
          height={200}
          alt="Redraw advice creative"
          className="w-full h-auto aspect-video object-cover rounded-lg"
          unoptimized
        />
      );
    }

    if (isFormat(src, availableFormats.video) || isBase64Video) {
      return (
        <ReactPlayer
          url={src}
          controls={false}
          loop
          className="w-full h-auto aspect-video"
          aria-label="Redraw info media"
        />
      );
    }

    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={
        disableCloseEvent
          ? () => null
          : onPressCloseButton
          ? onPressCloseButton
          : onPress
      }
      size="sm"
      backdrop={backdrop ?? "transparent"}
      shouldBlockScroll={shouldBlockScroll ?? false}
      placement="bottom"
      isDismissable={isDismissable ?? true}
      hideCloseButton={hideCloseButton ?? false}
      classNames={{
        base: "bg-slate-900 text-white absolute sm:-bottom-12 sm:-right-2",
      }}
    >
      <ModalContent>
        {progressOptions && showProgress && (
          <ModalHeader>
            <Progress
              value={progressOptions.value}
              className="w-full"
              aria-label="modal progress bar"
              isIndeterminate={progressOptions.value !== progressOptions.max}
              color={
                progressOptions.value === progressOptions.max
                  ? "success"
                  : "primary"
              }
              size="sm"
              showValueLabel={true}
            />
          </ModalHeader>
        )}
        <>
          {currentAds && currentAds.src ? (
            <ModalBody className={`mt-2 flex-col mb-2 animate-appearance-in`}>
              <div className="space-y-2 transition-all ease-soft-spring">
                <h4 className="font-semibold text-base">{title}</h4>
                <p className="text-sm mt-1">{text}</p>
              </div>
              {showProgress && <Divider className="my-2 bg-grayscale-100/30" />}
              <AdvertisementContent {...currentAds} />
            </ModalBody>
          ) : (
            <>
              <ModalBody
                className={`mt-2 ${
                  showProgress ? "flex-col-reverse" : "flex-col"
                }`}
              >
                {renderMedia()}
                {showProgress && src && (
                  <Divider className="my-2 bg-grayscale-100/30" />
                )}
                <div className="space-y-2 transition-all ease-soft-spring">
                  <h4 className="font-semibold text-base">{title}</h4>
                  <p className="text-sm mt-1">{text}</p>
                </div>
              </ModalBody>
              <ModalFooter className="flex flex-col md:flex-row w-full justify-start">
                {label &&
                  (href ? (
                    <Link
                      href={href}
                      target={href.startsWith("http") ? "_blank" : "_self"}
                      className="w-fit"
                    >
                      <Button
                        className={`${
                          color ? `btn` : "btn btn-primary-gradient"
                        }`}
                        onPress={onPress}
                        color={color ?? "primary"}
                        size="lg"
                        autoFocus
                      >
                        {label}
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Button
                        className="btn btn-primary-gradient"
                        onPress={onPress}
                        size="md"
                        autoFocus
                      >
                        {label}
                      </Button>
                      {secondaryAction && (
                        <Link
                          onClick={secondaryAction.onPress}
                          autoFocus
                          href="#"
                          className="text-sm underline hover:text-white/90"
                        >
                          {secondaryAction.label}
                        </Link>
                      )}
                    </div>
                  ))}
              </ModalFooter>
            </>
          )}
        </>
      </ModalContent>
    </Modal>
  );
}

const AdvertisementContent = ({
  title,
  text,
  href,
  label,
  src,
}: {
  title: string;
  text: string | HTMLElement;
  href: string;
  label: string;
  src: string;
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <Image
        src={src}
        width={200}
        height={200}
        alt="Redraw advice creative"
        className="w-full h-auto aspect-video object-contain rounded-lg border border-grayscale-100/30"
        unoptimized
      />
      <div className="space-y-1">
        <h4 className="font-semibold text-base">{title}</h4>
        {typeof text === "string" ? (
          <p className="text-sm mt-1">{text}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: text as HTMLElement }} />
        )}
      </div>
      {href && label && (
        <Link
          href={href}
          target={href?.startsWith("http") ? "_blank" : "_self"}
          className="w-full"
        >
          <Button
            className="btn btn-primary-gradient w-full mt-2"
            onPress={() => null}
            color="primary"
            size="lg"
            autoFocus
          >
            {label}
          </Button>
        </Link>
      )}
    </div>
  );
};
