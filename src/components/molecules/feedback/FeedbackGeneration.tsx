/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  Textarea,
} from "@nextui-org/react";
import FeedbackRating from "./FeedbackRating";
import { FeedbackOutlined } from "@mui/icons-material";
import { useGlobalStore } from "@/stores/globalStore";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/useToast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function FeedbackGeneration() {
  const t = useTranslations("functions.feedback");
  const {
    handleShowFeedbackModal,
    isOpenFeedbackModal,
    generationHasEvaluated,
    onOpenFeedbackModalChange,
    handleSendFeedback,
  } = useGlobalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackSchema = z.object({
    rating: z.string().min(1, t("empty_rating_error")),
    feedback: z.string().optional(),
  });

  type FormInputs = z.infer<typeof feedbackSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormInputs>({
    resolver: zodResolver(feedbackSchema),
  });

  const [rating] = watch(["rating"]);
  const toast = useToast();

  const onSubmitFeedback = async (formData: FormInputs) => {
    setIsSubmitting(true);

    const rating = Number(formData.rating);
    const feedback = formData.feedback ?? "";
    
    await handleSendFeedback(feedback, rating)
      .then(() => {
        toast.use("success", t("success_message"));
        onOpenFeedbackModalChange();
      })
      .catch((_error) => {
        toast.use("error", t("error_message"));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    handleShowFeedbackModal({ delay: true });
  }, []);

  return (
    <>
      {generationHasEvaluated === false && (
        <>
          <Tooltip
            content={t("tooltip")}
            placement="left"
            color="foreground"
            showArrow
          >
            <Button
              color="primary"
              size="sm"
              className={`hidden sm:flex`}
              onPress={onOpenFeedbackModalChange}
              startContent={<FeedbackOutlined fontSize="small" />}
            >
              {t("feedback_button")}
            </Button>
          </Tooltip>
          <Modal
            isOpen={isOpenFeedbackModal}
            shouldBlockScroll={false}
            onOpenChange={onOpenFeedbackModalChange}
            size="lg"
            isDismissable={false}
          >
            <ModalContent>
              <ModalBody>
                <ModalHeader className="flex-col items-center gap-1 px-0 text-center">
                  <h1 className="text-xl">{t("modal_title")}</h1>
                  <p className="text-small font-normal text-default-500">
                    {t("modal_description")}
                  </p>
                </ModalHeader>
                <form
                  className="flex w-full flex-col gap-4"
                  onSubmit={handleSubmit(onSubmitFeedback)}
                >
                  <Textarea
                    aria-label="Feedback"
                    placeholder={t("textarea_placeholder")}
                    {...register("feedback")}
                    labelPlacement="outside"
                    maxRows={5}
                    variant="bordered"
                    isInvalid={!!errors.feedback}
                    errorMessage={errors.feedback?.message}
                    isDisabled={isSubmitting}
                  />

                  <div className="flex gap-4 w-full items-center justify-between pb-4">
                    <FeedbackRating
                      value={Number(rating)}
                      setValue={(value) => setValue("rating", value.toString())}
                      isInvalid={!!errors.rating}
                      invalidMessage={t("empty_rating_error")}
                    />

                    <Button
                      type="submit"
                      className="btn btn-primary-gradient"
                      isLoading={isSubmitting}
                    >
                      {t("submit_button")}
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
}
