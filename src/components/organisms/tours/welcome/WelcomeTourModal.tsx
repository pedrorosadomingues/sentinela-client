import { useUserStore } from "@/stores";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useWelcomeTour } from "@/hooks/useWelcomeTour";

export default function WelcomeTourModal() {
  const t = useTranslations("tours");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useUserStore();
  const { 
    currentStep, 
    isOpen: isTourOpen, 
    setIsOpen, 
    startWelcomeTour, 
    handleSkipTour,
    hasSkippedOnce 
  } = useWelcomeTour();

  const handleStartTour = () => {
    if (user && isTourOpen) {
      return;
    }

    if (currentStep !== 0 && !isTourOpen) {
      startWelcomeTour();
    }

    setTimeout(() => {
      onOpen();
    }, 2000);
  };

  useEffect(() => {
    handleStartTour();
  }, []);

  const handleOpenTour = () => {
    onClose();
    setIsOpen(true);
  };
  
  const handleSkip = async () => {
    onClose();
    await handleSkipTour();
  };

  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col">
          {t("welcome_tour.greeting_title")}
        </ModalHeader>
        <ModalBody>
          <Image
            src="/images/tour/welcome-tour.png"
            alt="vestiq welcome model"
            width={200}
            height={200}
            quality={100}
            className="w-full object-contain border-b border-default-200"
          />
          <p className="text-sm 2xl:text-base">
            {t("welcome_tour.greeting_message")}
          </p>
          {hasSkippedOnce && (
            <p className="text-xs text-warning mt-2">
              Pular novamente marcará o tour como visualizado permanentemente.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button 
            color={hasSkippedOnce ? "warning" : "danger"} 
            variant="light" 
            onPress={handleSkip}
          >
            {hasSkippedOnce ? "Pular permanentemente" : t("skip_label")}
          </Button>
          <Button color="secondary" radius="sm" onPress={handleOpenTour}>
            {t("start_label")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
