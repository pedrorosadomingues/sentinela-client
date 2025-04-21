/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CurrentGenerationProps } from "@/types/generation";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import {  useState } from "react";
import { DownloadOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/useToast";
import { axiosClient } from "@/lib/axios/axiosClient";
import { useFnStore } from "@/stores/fnStore";
import { useUserStore } from "@/stores/userStore";
import { useGlobalStore } from "@/stores/globalStore";
import InfoModal from "./InfoModal";
import { downloadFiles } from "@/utils/download-files";

export default function DownloadGeneration({
  generation,
}: {
  generation: CurrentGenerationProps;
}) {
  const t = useTranslations("functions.page");
  const dt = useTranslations("download-info-modal");
  const pathname = usePathname();
  const toast = useToast();
  //const locale = useLocale();
  const { currentGeneration, currentGenerationIdRef } = useFnStore();
  const { user } = useUserStore();
  const { handleShowFeedbackModal, generationHasEvaluated } = useGlobalStore();
  const { isOpen, onOpenChange, onClose } = useDisclosure();
  //const { fetchAdvertisement } = useGlobalStore();

  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [canCloseModal, setCanCloseModal] = useState<boolean>(false);

  // useEffect(() => {
  //   fetchAdvertisement(locale);
  // }, []);

  const availableFormats = [
    {
      key: "png",
      value:
        currentGeneration?.engine === "cf" && pathname === "/member/render"
          ? t("no_enhancement")
          : `${t("format_label")} PNG`,
      disabled: pathname.includes("/member/video-generator"),
      show: true,
    },
    {
      key: "enhanced",
      value: t("enhancement"),
      disabled: pathname.includes("/member/video-generator"),
      show: currentGeneration?.engine === "cf" && pathname === "/member/render",
    },
    {
      key: "mp4",
      value: `${t("format_label")} MP4`,
      disabled: !pathname.includes("/member/video-generator"),
      show: true,
    },
  ];

  const handleDownloadGeneration = async (format: string) => {
    if (!generation || !generation.generated) {
      toast.use("error", t("VWGNM-D000"), "VWGNM-D000");
      return;
    }

    setProgress(0);
    setIsLoadingDownload(true);
    setCanCloseModal(false);

    const result =
      format === "enhanced" && generation.enhanced
        ? generation.enhanced
        : generation.generated;

    try {
      onOpenChange();

      await downloadFiles([result], {
        onProgress: ({ percent }) => {
          setProgress(percent);
        },
      });

      setTimeout(() => {
        onClose();
      }, 8000);

      // Atualiza status no backend
      axiosClient.patch("/api/my-generation/download", {
        generation_id: currentGenerationIdRef.id,
        user_uuid: user?.id,
      });
    } catch (error: any) {
      console.error("Error downloading generation:", error);
      onClose();
      toast.use("error", t("VWGNM-D000"), "VWGNM-D000");
    } finally {
      setIsLoadingDownload(false);
      setCanCloseModal(true);

      if (!generationHasEvaluated) handleShowFeedbackModal({ delay: false });
    }
  };

  return (
    <>
      <Dropdown shouldBlockScroll={false}>
        <DropdownTrigger>
          <Button isIconOnly size="sm">
            {isLoadingDownload ? (
              <Spinner color="current" size="sm" />
            ) : (
              <DownloadOutlined />
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Download generation formats"
          items={availableFormats.filter((item) => item.show)}
          onAction={(key) => handleDownloadGeneration(key as string)}
          disabledKeys={availableFormats
            .filter((item) => item.disabled)
            .map((item) => item.key)}
        >
          {(item) => <DropdownItem key={item.key}>{item.value}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>

      {/* Modal de Progresso */}
      <InfoModal
        isOpen={isOpen}
        onPress={onOpenChange}
        title={
          progress === 100
            ? dt("modal_title_ready")
            : dt("modal_title_preparing")
        }
        text={progress === 100 ? t("VWGNM-S200") : dt("modal_text_preparing")}
        showProgress
        progressOptions={{
          value: progress,
          max: 100,
        }}
        isDismissable={canCloseModal}
        hideCloseButton={!canCloseModal}
        // currentAds={{
        //   title: advertisement?.title as string,
        //   text: advertisement?.text as string,
        //   href: advertisement?.href as string,
        //   label: advertisement?.label as string,
        //   src: advertisement?.src as string,
        // }}
      />
    </>
  );
}
