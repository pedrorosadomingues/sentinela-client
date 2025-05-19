/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Textarea,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { createCoinReceiptService, cancelSubscription } from "@/services";
import { useUserStore } from "@/stores";
import { useToast } from "@/hooks/useToast";

function Select({ onValueChange, children }: any) {
  return <div className="space-y-2">{children}</div>;
}

function SelectTrigger({ children, onClick, className = "" }: any) {
  return (
    <div
      onClick={onClick}
      className={`border px-4 py-2 rounded w-full cursor-pointer bg-white ${className}`}
    >
      {children}
    </div>
  );
}

function SelectValue({ placeholder }: any) {
  return <span className="text-gray-500">{placeholder}</span>;
}

function SelectContent({ children }: any) {
  return <div className="mt-1 border rounded shadow bg-white">{children}</div>;
}

function SelectItem({ value, children, onClick }: any) {
  return (
    <div
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onClick(value)}
    >
      {children}
    </div>
  );
}

export default function CancelSubscriptionButton() {
  const t = useTranslations("cancel-subscription");
  const { user } = useUserStore();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [offeredBonus, setOfferedBonus] = useState(false);
  const [showSelectContent, setShowSelectContent] = useState(false);
  const [cancelBonus, setCancelBonus] = useState(false);
  const { setUser } = useUserStore.getState(); // ou useUserStore()

  const handleInitialCancel = () => {
    setStep(1);
    setOpen(true);
  };

  const handleBonus = async () => {
    if (!user?.email) {
      console.error("Email do usuário não está disponível.");
      return;
    }

    try {
      const response = await createCoinReceiptService({
        user_email: user.email,
        v_coins: 10,
        type_id: 4,
      });

      if (response.status === 200) {
        setOfferedBonus(true);
        setOpen(false);
        toast.use(
          "success",
          t("bonus_success_description", {
            coins: response.data.v_coins,
          })
        );
      } else {
        console.error("Erro ao criar recibo de coins:", response.message);
      }
    } catch (error) {
      console.error("Erro inesperado ao criar recibo de coins:", error);
    }
  };
  const handleFinalCancel = async () => {
    const reason =
      cancelReason === t("reason_other") ? customReason : cancelReason;
    try {
      await cancelSubscription(user?.subscription?.stripe_id as string, reason);
      toast.use("success", t("cancel_success"));
      if (user) {
        setUser({
          ...user,
          avatar: user.avatar ?? "",
          subscription: {
            ...user.subscription,
            stripe_status: "canceled",
          },
        });
      }
    } catch (error) {
      console.error("Erro ao cancelar a assinatura:", error);
      toast.use("error", t("cancel_error"));
    }

    setOpen(false);
    setStep(0);
  };

  const handleNextStep = () => {
    if (!offeredBonus) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleSelect = (value: any) => {
    setCancelReason(value);
    setShowSelectContent(false);
  };

  useEffect(() => {
    if (user?.coin_receipts?.some((receipt) => receipt.type_id === 4)) {
      setCancelBonus(true);
    }
  }, [user]);

  return (
    <>
      <motion.button
        type="button"
        aria-label={t("cancel_button")}
        whileTap={{ scale: 0.95 }}
        whileHover={{ y: -2 }}
        onClick={handleInitialCancel}
        className="group relative inline-flex items-center justify-center gap-2 rounded-3xl border-2 border-red-600 bg-white px-7 py-3 text-sm font-semibold tracking-wide text-red-600 shadow-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 hover:bg-red-50 hover:shadow-md"
      >
        <X className="h-4 w-4 shrink-0 stroke-[2.5]" aria-hidden="true" />
        {t("cancel_button")}
      </motion.button>

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalContent>
          {step === 1 && (
            <>
              <ModalHeader className="text-lg font-semibold">
                {t("step1_title")}
              </ModalHeader>
              <ModalBody>
                <p className="mb-4">{t("step1_text")}</p>
              </ModalBody>
              <ModalFooter className="flex justify-end gap-3">
                <Button
                  variant="bordered"
                  onPress={() =>
                    window.open("https://wa.me/seuNumeroSuporte", "_blank")
                  }
                >
                  {t("talk_to_support")}
                </Button>
                <Button onPress={handleNextStep}>
                  {t("continue_cancellation")}
                </Button>
              </ModalFooter>
            </>
          )}

          {step === 2 && (
            <>
              <ModalHeader className="text-lg font-semibold">
                {!cancelBonus ? t("step2_title") : t("step2_title_bonus")}
              </ModalHeader>
              <ModalBody>
                {!cancelBonus ? (
                  <p className="mb-4">{t("step2_text")}</p>
                ) : (
                  <p className="mb-4">{t("step2_text_bonus")}</p>
                )}
              </ModalBody>
              <ModalFooter className="flex justify-end gap-3">
                <Button variant="bordered" onPress={() => setStep(3)}>
                  {t("still_cancel")}
                </Button>
                {!cancelBonus ? (
                  <Button onPress={handleBonus}>{t("accept_bonus")}</Button>
                ) : (
                  <Button variant="bordered" onPress={() => setStep(1)}>
                    {t("back")}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}

          {step === 3 && (
            <>
              <ModalHeader className="text-lg font-semibold">
                {t("step3_title")}
              </ModalHeader>
              <ModalBody>
                <p className="mb-4">{t("step3_text")}</p>

                <Select>
                  <SelectTrigger
                    onClick={() => setShowSelectContent(!showSelectContent)}
                    className="mb-3"
                  >
                    <SelectValue
                      placeholder={cancelReason || t("reason_placeholder")}
                    />
                  </SelectTrigger>
                  {showSelectContent && (
                    <SelectContent>
                      <SelectItem
                        value={t("reason_result")}
                        onClick={handleSelect}
                      >
                        {t("reason_result")}
                      </SelectItem>
                      <SelectItem
                        value={t("reason_inactive")}
                        onClick={handleSelect}
                      >
                        {t("reason_inactive")}
                      </SelectItem>
                      <SelectItem
                        value={t("reason_technical")}
                        onClick={handleSelect}
                      >
                        {t("reason_technical")}
                      </SelectItem>
                      <SelectItem
                        value={t("reason_price")}
                        onClick={handleSelect}
                      >
                        {t("reason_price")}
                      </SelectItem>
                      <SelectItem
                        value={t("reason_other")}
                        onClick={handleSelect}
                      >
                        {t("reason_other")}
                      </SelectItem>
                    </SelectContent>
                  )}
                </Select>

                {cancelReason === t("reason_other") && (
                  <Textarea
                    placeholder={t("custom_reason_placeholder")}
                    value={customReason}
                    onChange={(e) => {
                      setCustomReason(e.target.value);
                      console.log(customReason);
                    }}
                    className="mb-4"
                  />
                )}
              </ModalBody>
              <ModalFooter className="flex justify-end gap-3">
                <Button variant="bordered" onPress={() => setStep(2)}>
                  {t("back")}
                </Button>
                <Button onPress={handleFinalCancel}>
                  {t("submit_feedback")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
