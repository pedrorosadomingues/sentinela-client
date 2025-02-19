/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import {
  Modal,
  ModalBody,
  ModalContent,
  ScrollShadow,
} from "@nextui-org/react";
import React from "react";
import { Tables } from "@/lib/supabase/types";
import { Button, Image, Spinner, Tooltip } from "@heroui/react";
import { StarGroup } from "../icons";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useGenerationStore } from "@/zustand-stores";

export function ViewGenerationModal({
  id,
  groupId,
  src,
  prompt,
  onOpen,
  onOpenChange,
  isOpen,
  trigger,
  params,
  video,
  showDelete,
  isTextFn,
  batch,
}: {
  id: string | number;
  groupId?: string;
  src: string;
  prompt?: string;
  onOpen: () => void;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  trigger?: React.ReactNode;
  params?: Tables<"generation">["params_fashn"];
  video?: boolean;
  showDelete?: boolean;
  isTextFn?: boolean;
  batch?: string[] | null;
}) {
  const t = useTranslations("my-generations");
  const { handleDeleteSelectedGenerations, handleDownloadSelectedGenerations } =
    useGenerationStore();

  const ParamsContent = () => {
    const ParamsRow = ({ label, value }: { label: string; value: string }) => {
      const labelMap = () => {
        const filteredLabel = label.replace(/_/g, " ");

        switch (filteredLabel) {
          case "originalPrompt":
            return "Prompt";
          default:
            return filteredLabel;
        }
      };

      return (
        <div className="flex flex-col gap-2">
          <p className="font-lexend font-normal text-xs md:text-sm lg:text-base">
            <strong className="capitalize">{labelMap()}:</strong>{" "}
            {value === "" ? "N/A" : value}
          </p>
        </div>
      );
    };

    const availableParamsToShow = [
      "camera_motion",
      "frames",
      "style",
      "format",
      "originalPrompt",
      "suggestions",
      "type",
      "freedom",
      "environment",
      "mode",
    ];

    if (
      typeof params === "object" &&
      params !== null &&
      "originalPrompt" in params
    ) {
      delete params.suggestions;
    }

    return (
      <>
        {Object.entries(params ?? {})
          .filter(([key]) => availableParamsToShow.includes(key))
          .map(([key, value]) => {
            // Tratar os casos específicos
            if (
              key === "style" &&
              typeof params === "object" &&
              params !== null &&
              !Array.isArray(params) &&
              "style" in params
            ) {
              return (
                <ParamsRow
                  key={key}
                  label="Style"
                  value={
                    typeof params === "object" &&
                    params?.style &&
                    typeof params?.style === "object" &&
                    "title" in params?.style
                      ? (params?.style?.title as string)
                      : ""
                  }
                />
              );
            }
            return (
              <ParamsRow
                key={key}
                label={key}
                value={(value ?? "").toString()}
              />
            );
          })}
      </>
    );
  };

  const isUseImageLoading = false;

  return (
    <>
      {trigger &&
        React.cloneElement(trigger as React.ReactElement, {
          onClick: () => {
            onOpen();
          },
        })}

      <Modal
        backdrop="opaque"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: "p-0 px-2 py-4",
        }}
        size="2xl"
      >
        <ModalContent>
          <ModalBody className="justify-between md:flex-row md:justify-normal gap-4 w-full">
            <aside className="md:w-full h-full bg-grayscale-100">
              {/* {video ? (
                <div className="flex items-center justify-center relative mx-auto md:mx-0 w-fit bg-black">
                  <ReactPlayer
                    url={src}
                    key={`player-${id}`}
                    width="100%"
                    height="100%"
                    className={`aspect-video`}
                    muted
                    playing
                    loop
                    controls={true}
                  />
                </div>
              ) : ( */}
              <div className="flex items-center justify-center relative w-full h-full rounded-xl bg-default-300">
                <Image
                  src={src}
                  radius="none"
                  alt="Generation"
                  className="md:h-96 w-96 max-h-96 object-contain z-0"
                />

                {!src.includes("mp4") && (
                  <Tooltip
                    content={t("edit_image_tooltip")}
                    color="foreground"
                    placement="top"
                  >
                    <Button
                      className="absolute bottom-2 right-2 z-[1]"
                      endContent={
                        isUseImageLoading ? (
                          <Spinner color="current" size="sm" />
                        ) : (
                          <StarGroup />
                        )
                      }
                      isDisabled={isUseImageLoading}
                      color="secondary"
                      size="sm"
                      // onPress={() => onUseImage(src)}
                      variant="solid"
                      isIconOnly
                    />
                  </Tooltip>
                )}

                {showDelete && (
                  <Tooltip
                    content={t("delete_image_tooltip")}
                    color="foreground"
                    placement="top"
                  >
                    <Button
                      className="z-[1] absolute top-2 right-2 hidden md:flex"
                      endContent={<DeleteOutlineOutlined />}
                      size="sm"
                      variant="solid"
                      color="danger"
                      isIconOnly
                      onPress={() =>
                        handleDeleteSelectedGenerations({
                          mode: "single",
                          data: [id] as number[],
                        })
                      }
                    />
                  </Tooltip>
                )}
              </div>
            </aside>

            <div className="relative flex flex-col md:basis-3/6">
              <ScrollShadow className="scrollbar-hide max-h-32 md:max-h-40 xl:max-h-72 space-y-1 mb-6 md:mb-2">
                {prompt && (
                  <p className="font-lexend font-normal text-xs md:text-sm xl:text-base">
                    <strong>Prompt:</strong> {prompt}
                  </p>
                )}
                {params && <ParamsContent />}
              </ScrollShadow>
              <div className="flex flex-col xs:flex-row gap-2 mt-auto h-auto">
                {/* <ManageGenerationModal
                  actionType="save"
                  generationId={id as string}
                  trigger={ */}
                <Button
                  variant="bordered"
                  size="sm"
                  className="w-full bg-white hidden xs:flex"
                >
                  {t("save_image_tooltip")}
                </Button>
                {/* }
                /> */}
                <Button
                  size="sm"
                  color="secondary"
                  className="w-full"
                  // onPress={handleDownloadGeneration}
                  onPress={() =>
                    handleDownloadSelectedGenerations({
                      mode: "single",
                      data: [Number(id)],
                    })
                  }
                  // isLoading={isLoadingDownload}
                >
                  {t("download_image_tooltip")}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de Progresso */}
      {/* <InfoModal
        isOpen={isOpenInfo}
        onPress={onOpenChangeInfo}
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
        // src="https://generations-dev.s3.sa-east-1.amazonaws.com/render-1738599856351.png"
      /> */}
    </>
  );
}
