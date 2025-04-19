/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import {
  AddPhotoAlternateOutlined,
  ContentCopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LayersClearOutlined,
  LockOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  UpdateDisabledOutlined,
  VerticalAlignCenterOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { useComposerStore } from "@/stores/composerStore";
import ComposerCanvas from "./ComposerCanvas";
import AddLightBtn from "@/components/atoms/buttons/AddLightBtn";
import html2canvas from "html2canvas";
import { useGlobalStore } from "@/stores/globalStore";
import { useTranslations } from "next-intl";
import RenameObject from "./RenameObject";

export default function ComposerController({ isDisabled }: { isDisabled: boolean }) {
  const t = useTranslations("tools.image_composer");
  const {
    images,
    setComposerMode,
    setBase64Image,
    selectedImageId,
    removeAllImages,
    centralizeImage,
    toggleImageVisibility,
    toggleBlockImageMovement,
    updateImageRotation,
    removeImage,
    duplicateObject,
  } = useComposerStore();

  const { openConfirmation, closeConfirmation } = useGlobalStore();

  const saveAsBase64 = async (elementId: string) => {
    const element = document.getElementById(elementId);

    if (element) {
      const canvas = await html2canvas(element);
      return canvas.toDataURL("image/png"); // Retorna a imagem em base64
    }
    return null;
  };

  const handleSaveAsBase64 = async () => {
    const base64 = await saveAsBase64("canvas-area");

    if (base64) {
      setBase64Image(base64);
      downloadBase64Image(base64, "composed-image.png"); // Chama a função de download
    }
  };

  const downloadBase64Image = (base64: string, filename: string) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setComposerMode(true);

    return () => {
      setComposerMode(false);
    };
  }, []);

  const handleClearCanvas = () => {
    openConfirmation(
      t("confirmation.delete_title"),
      t("confirmation.delete_message", { count: images.length }),
      () => {
        removeAllImages();
        closeConfirmation();
      },
      () => {
        closeConfirmation();
      },
      "danger"
    );
  };

  const handleCentralize = () => {
    const canvas = document.getElementById("canvas-area")?.getBoundingClientRect();

    if (canvas && selectedImageId) {
      centralizeImage(selectedImageId, canvas.width, canvas.height);
    }
  };

  const toolBtns = [
    {
      key: "add",
      label: t("btns.add"),
      icon: <AddPhotoAlternateOutlined fontSize="small" />,
      onClick: () => document.getElementById("image-upload")?.click(),
      show: true,
      isDisabled: false,
    },
    {
      key: "ies-light",
      content: <AddLightBtn />,
      show: true,
      isDisabled: false,
    },
    {
      key: "hide",
      label: t("btns.hide"),
      icon: <VisibilityOffOutlined fontSize="small" />,
      onClick: () => toggleImageVisibility(selectedImageId!),
      show: true,
      isDisabled: selectedImageId === null,
    },
    {
      key: "block",
      label: t("btns.block"),
      icon: <LockOutlined fontSize="small" />,
      onClick: () => toggleBlockImageMovement(selectedImageId!),
      show: true,
      isDisabled: selectedImageId === null,
    },
    {
      key: "duplicate",
      label: t("btns.duplicate"),
      icon: <ContentCopyOutlined fontSize="small" />,
      onClick: () => duplicateObject(selectedImageId!),
      show: true,
      isDisabled: selectedImageId === null,
    },
    {
      key: "delete",
      label: t("btns.delete"),
      icon: <DeleteOutlined fontSize="small" color="error" />,
      onClick: () => removeImage(selectedImageId!),
      show: true,
      isDisabled: selectedImageId === null,
    },
    {
      key: "clear",
      label: t("btns.clear"),
      icon: <LayersClearOutlined fontSize="small" color="error" />,
      onClick: handleClearCanvas,
      show: true,
      isDisabled: images.length < 1,
    },
    {
      key: "centralize",
      label: t("btns.centralize"),
      icon: <VerticalAlignCenterOutlined fontSize="small" />,
      onClick: handleCentralize,
      show: true,
      isDisabled: selectedImageId === null,
    },
    {
      key: "rotate-left",
      label: t("btns.rotate_left"),
      icon: <RotateLeftOutlined fontSize="small" />,
      onClick: () => updateImageRotation(selectedImageId!, "left"),
      show: true,
      isDisabled: selectedImageId === null,
    },
    {
      key: "rotate-right",
      label: t("btns.rotate_right"),
      icon: <RotateRightOutlined fontSize="small" />,
      onClick: () => updateImageRotation(selectedImageId!, "right"),
      show: true,
      isDisabled: selectedImageId === null,
    },
    {
      key: "rotate-original",
      label: t("btns.rotate_original"),
      icon: <UpdateDisabledOutlined fontSize="small" color="error" />,
      onClick: () => updateImageRotation(selectedImageId!, "original"),
      show: true,
      isDisabled:
        images.find((image) => image.id === selectedImageId)?.positioning.rotate === 0 || selectedImageId === null,
    },
    {
      key: "save",
      label: t("btns.save"),
      icon: <DownloadOutlined fontSize="small" />,
      onClick: handleSaveAsBase64,
      show: process.env.NODE_ENV === "development",
      isDisabled: false,
    },
  ];

  const selectedObjectBtns = [
    "hide",
    "block",
    "duplicate",
    "delete",
    "rotate-left",
    "rotate-right",
    "centralize",
    "rotate-original",
  ];
  const unselectedObjectBtns = ["save", "clear", "add", "ies-light"];
  const dangerBtns = ["clear", "delete", "rotate-original"];

  return (
    <>
      <section className="flex flex-col items-start w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-wrap justify-end items-center gap-2 mt-2">
            {toolBtns
              .filter((item) => unselectedObjectBtns.includes(item.key))
              .map((btn) =>
                !btn.content ? (
                  <Tooltip
                    key={btn.key}
                    content={btn.label}
                    color={dangerBtns.includes(btn.key) ? "danger" : "foreground"}
                    showArrow
                    placement="bottom"
                    className={btn.show ? "" : "hidden"}
                  >
                    <Button
                      variant="bordered"
                      size="sm"
                      onPress={btn.onClick}
                      className={btn.show ? "btn" : "hidden"}
                      startContent={btn.icon}
                      isIconOnly
                      isDisabled={btn.isDisabled}
                    />
                  </Tooltip>
                ) : (
                  btn.content
                )
              )}
          </div>
          {/* )} */}
          <div className="flex flex-wrap justify-end items-center gap-2 mt-2">
            {toolBtns
              .filter((item) => selectedObjectBtns.includes(item.key))
              .map(
                (btn) =>
                  !btn.content && (
                    <Tooltip
                      key={btn.key}
                      content={btn.label}
                      color={dangerBtns.includes(btn.key) ? "danger" : "foreground"}
                      showArrow
                      placement="bottom"
                      className={btn.show ? "" : "hidden"}
                    >
                      <Button
                        variant="bordered"
                        size="sm"
                        onPress={btn.onClick}
                        className={btn.show ? "btn" : "hidden"}
                        startContent={btn.icon}
                        isIconOnly
                        isDisabled={btn.isDisabled}
                      />
                    </Tooltip>
                  )
              )}
          </div>
        </div>
        <ComposerCanvas onCentralize={handleCentralize} />
      </section>
      <RenameObject />
    </>
  );
}
