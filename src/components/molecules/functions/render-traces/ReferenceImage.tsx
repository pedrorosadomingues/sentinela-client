/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useFnStore } from "@/stores/fnStore";
import { getCroppedImg } from "@/utils/image";
import { DeleteOutlineOutlined, FileUpload } from "@mui/icons-material";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Crop, PixelCrop } from "react-image-crop";
import ReactCropper from "./ReactCropper";

export default function ReferenceImage({
  isInvalid,
  onPress,
  optional,
  reactCropMode = false,
}: {
  isInvalid?: boolean;
  onPress?: () => void;
  optional?: boolean;
  reactCropMode?: boolean;
}) {
  const t = useTranslations("functions");

  const [newImageSrc, setNewImageSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [reactCrop, setReactCrop] = useState<Crop | null>();
  const [reactCropAreaPixels, setReactCropAreaPixels] = useState<PixelCrop>();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalBodyRef = useRef<HTMLDivElement | null>(null);

  const { setReferenceImage, handleResizeImage } = useFnStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const [loadingProxy, setLoadingProxy] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.crossOrigin = "Anonymous";

        image.onload = () => {
          const { width, height } = image;

          setReferenceImage((state: any) => ({
            ...state,
            isLoading: false,
            url: image.src,
            size: { width, height },
          }));

          handleResizeImage(
            { image, width: image.width, height: image.height },
            image.src,
            "reference"
          );

          setNewImageSrc(image.src);
          onOpenChange();
        };
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedArea = croppedAreaPixels || reactCropAreaPixels;

      if (!newImageSrc || !croppedArea) {
        return;
      };

      handleRemoveImage();

      let croppedImageBase64 = "";

      if (!reactCropMode) {
        croppedImageBase64 = await getCroppedImg(newImageSrc, croppedArea);
      } else {
        croppedImageBase64 = croppedImage as string;
      }

      setImageSrc(croppedImageBase64);
      setReferenceImage((state: any) => ({
        ...state,
        url: croppedImageBase64,
      }));

      const image = new Image();
      image.src = croppedImageBase64;

      image.onload = () => {
        handleResizeImage(
          { image, width: image.width, height: image.height },
          image.src,
          "reference"
        );
      };

      onOpenChange();
    } catch (error) {
      console.error("Erro ao recortar a imagem:", error);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      onPress && onPress();
      fileInputRef.current.click();
    }
  };

  const handleCancelCrop = () => {
    onOpenChange();
    setNewImageSrc(null);
    setReferenceImage(undefined);
    setReactCrop(undefined);
    setReactCropAreaPixels(undefined);
    setCroppedImage(null);
  };

  const handleRemoveImage = () => {
    setImageSrc("");
    setNewImageSrc(null);
    setReferenceImage(undefined);
    setReactCrop(undefined);
    setReactCropAreaPixels(undefined);
    setCroppedImage(null);
  };

  const handleUseOriginalImage = () => {
    setImageSrc(newImageSrc as string);
    onOpenChange();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragOver(false);

    const url = e.dataTransfer.getData("text/plain");

    if (url) {
      setLoadingProxy(true);
      // Use a rota de proxy para acessar a imagem sem problemas de CORS
      const proxyUrl = `/api/image/proxy-image?url=${encodeURIComponent(url)}`;

      try {
        const response = await fetch(proxyUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const image = new Image();
          image.src = reader.result as string;
          image.crossOrigin = "Anonymous";

          image.onload = () => {
            const { width, height } = image;

            setReferenceImage({
              isLoading: false,
              url: image.src,
              size: { width, height },
            });

            handleResizeImage(
              { image, width: image.width, height: image.height },
              image.src,
              "reference"
            );

            setNewImageSrc(image.src);
            onOpenChange();
          };
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Erro ao carregar a imagem do URL:", error);
      } finally {
        setLoadingProxy(false);
      }
    } else {
      const files = e.dataTransfer.files;
      if (files.length) {
        const selectedFile = files[0];

        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = () => {
            const image = new Image();
            image.src = reader.result as string;
            image.crossOrigin = "Anonymous";

            image.onload = () => {
              const { width, height } = image;

              setReferenceImage({
                isLoading: false,
                url: image.src,
                size: { width, height },
              });

              handleResizeImage(
                { image, width: image.width, height: image.height },
                image.src,
                "reference"
              );

              setNewImageSrc(image.src as string);
              onOpenChange();
            };
          };
          reader.readAsDataURL(selectedFile);
        }
      }
    }
  };

  useEffect(() => {
    setReferenceImage(undefined);
    setImageSrc("");
    setNewImageSrc(null);
    setReactCrop(undefined);
    setReactCropAreaPixels(undefined);
  }, [setReferenceImage]);

  return (
    <>
      <div className={`flex flex-col gap-2 mb-2 animate-appearance-in`}>
        <label className={`${isInvalid ? "text-danger" : "text-font"} text-sm`}>
          {t('inputs.reference_image_label') + " "}
          {optional && <span className="text-slate-400">({t('inputs.optional_field')})</span>}
        </label>
        <div
          ref={containerRef}
          onDragEnter={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDragOver={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onDrop={handleDrop}
        >
          {imageSrc ? (
            <div
              className={`relative ${
                isDragOver && "opacity-50 flex items-center justify-center"
              }`}
            >
              <img
                src={imageSrc}
                alt="Referência"
                className={`w-full h-32 sm:h-48 md:h-56 lg:h-full ${
                  reactCropMode ? "object-cover" : "object-contain"
                } rounded-2xl`}
              />
              <Button
                color="danger"
                size="sm"
                isIconOnly
                hidden={isDragOver}
                startContent={<DeleteOutlineOutlined fontSize="small" />}
                className="absolute top-2 right-2"
                onPress={handleRemoveImage}
              />
              {isDragOver && (
                <p className="bg-black p-2 animate-pulse text-white text-medium absolute pointer-events-none">
                  {t("page.drop_image")}
                </p>
              )}
            </div>
          ) : (
            <div
              className={`
                        h-32 sm:h-48 md:h-56 lg:h-40 ${
                          isInvalid
                            ? "border-dashed-danger"
                            : "border-dashed-redraw"
                        } 
                        mt-2 w-full h-full p-6 flex items-center flex-col gap-2 text-center 
                        ${
                          isDragOver &&
                          "bg-grayscale-50 justify-center animate-pulse"
                        }`}
            >
              {isDragOver ? (
                <p className="opacity-25 bg-black p-2 animate-pulse text-white text-medium absolute pointer-events-none">
                  {t("page.drop_image")}
                </p>
              ) : (
                <div className={`${isDragOver && "pointer-events-none"}`}>
                  <input
                    type="file"
                    hidden
                    accept="image/jpeg"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />

                  <p className="text-slate-400 text-sm pointer-events-none select-none">
                    {t("page.drag_drop_image")}
                  </p>
                  {loadingProxy ? (
                    <Spinner size="md" />
                  ) : (
                    <Button
                      variant="bordered"
                      className="mt-4 select-none"
                      startContent={<FileUpload fontSize="small" />}
                      onPress={handleUploadClick}
                    >
                      {t("page.send_file")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleCancelCrop}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-center">
            <h1 className="text-xl text-center font-semibold">
              {t('page.crop_image_area')}
            </h1>
          </ModalHeader>
          <ModalBody>
            <div
              ref={modalBodyRef}
              className="flex items-center justify-center relative w-full h-96"
            >
              {newImageSrc &&
                //  crop do brush
                (reactCropMode ? (
                  <ReactCropper
                    image={newImageSrc}
                    reactCrop={reactCrop}
                    setReactCrop={setReactCrop}
                    setReactCropAreaPixels={setReactCropAreaPixels}
                    onCropComplete={(croppedImg) => {
                      setCroppedImage(null);
                      setCroppedImage(croppedImg);
                    }}
                  />
                ) : (
                  // crop de outras funções
                  <Cropper
                    image={newImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                    objectFit="contain"
                    classes={{
                      mediaClassName: "w-full h-full object-contain",
                      containerClassName: "w-full h-full object-contain",
                      cropAreaClassName: "w-full h-full object-contain",
                    }}
                  />
                ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              onPress={handleUseOriginalImage}
              className="btn btn-secondary flex-1"
            >
              {t('page.use_original_btn')}
            </Button>
            <Button onPress={handleCrop} className="btn btn-primary flex-1">
            {t('page.crop_btn')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
