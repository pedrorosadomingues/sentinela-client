import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useTour } from "@reactour/tour";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";

export default function WelcomeTourModal() {
  const t = useTranslations("tours");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setIsOpen, setCurrentStep, currentStep } = useTour();

  useEffect(() => {
    onOpen();
  }, []);

  const handleStartTour = () => {
    if (currentStep !== 0) {
      setCurrentStep(0);
    }

    setIsOpen(true);
    onClose();
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
            width={400}
            height={400}
            quality={100}
            className="w-full object-contain border-b border-default-200"
          />
          <p className="text-sm 2xl:text-base">
            {t("welcome_tour.greeting_message")}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {t("skip_label")}
          </Button>
          <Button color="secondary" radius="sm" onPress={handleStartTour}>
            {t("start_label")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
