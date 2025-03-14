import { useState, useRef, useCallback } from "react";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/image";
import toast from "react-hot-toast";
import axiosClient from "@/lib/axiosClient";
import { useUserStore } from "@/stores/userStore";
import { useTranslations } from "next-intl";
import { UserProps } from "@/types/user";

export default function ProfileAvatar({ user }: { user: UserProps }) {
  const t = useTranslations("profile.personal_info.avatar");

  const [newImageSrc, setNewImageSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(
    user?.profile_image_64 ?? ""
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [hasNewImage, setHasNewImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { isOpen, onOpenChange } = useDisclosure();
  const { getUser } = useUserStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        toast.error(t("error.size_error"));
        return;
      }
      if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
        toast.error(t("error.type_error"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setNewImageSrc(reader.result as string);
        onOpenChange();
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      if (!newImageSrc || !croppedAreaPixels) return;

      const croppedImageBase64 = await getCroppedImg(
        newImageSrc,
        croppedAreaPixels
      );

      setImageSrc(croppedImageBase64);
      onOpenChange();

      setHasNewImage(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!imageSrc) return;
    setIsLoading(true);

    const options = {
      user_uuid: user.id,
      profile_image_64: imageSrc,
    };

    return axiosClient
      .put("/api/profile/update-image", options)
      .then(async (res) => {
        if (res.status === 200) {
          setHasNewImage(false);
          await getUser();

          toast.success(t("error.upload_success"));
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(t("error.upload_failure"));
        } else {
          toast.error(t("error.server_error"));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancelCrop = () => {
    onOpenChange();
    setNewImageSrc(null);
  };

  return (
    <div className="flex gap-4">
      <Avatar
        className="h-20 w-20 lg:h-24 lg:w-24 text-7xl text-white rounded-full"
        src={imageSrc}
        name={(user?.base_name ?? user?.name ?? user?.email ?? "")
          .charAt(0)
          .toUpperCase()}
        alt="user profile avatar"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm lg:text-lg font-medium">{t("profile_image")}</p>
        <span className="text-xs lg:text-sm text-font-light">
          {t("image_requirements")}
        </span>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          <Button
            variant="light"
            size="sm"
            onPress={handleUploadClick}
            className="btn btn-tertiary w-fit"
          >
            {t("upload_btn")}
          </Button>
          {hasNewImage && (
            <Button
              variant="solid"
              isLoading={isLoading}
              size="sm"
              onPress={handleSubmit}
              className="btn btn-primary w-fit animate-appearance-in-slow"
            >
              {t("save_btn")}
            </Button>
          )}
        </div>
      </div>

      <Modal
        backdrop="blur"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-center">
            <h1 className="text-xl text-center font-semibold">
              {t("modal.title")}
            </h1>
          </ModalHeader>
          <ModalBody>
            <div className="relative w-full h-[300px] bg-grayscale-100 overflow-hidden">
              {newImageSrc && (
                <Cropper
                  image={newImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              className="flex-1"
              onPress={handleCancelCrop}
            >
              {t("modal.back_btn")}
            </Button>
            <Button color="primary" onPress={handleCrop} className="flex-1">
              {t("modal.confirm_btn")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
