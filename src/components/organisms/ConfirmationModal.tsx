'use client';
import { useGlobalStore } from "@/zustand-stores";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function ConfirmationModal() {
  const { confirmationModal, closeConfirmation } = useGlobalStore();

  if (!confirmationModal.isOpen) return null;

  const btnColorMap = (key: "primary" | "danger" | "default") => {
    const variants = {
      primary: "btn-primary-gradient",
      danger: "btn-destructive",
      default: "btn-primary",
    };

    return variants[key];
  };

  return (
    <Modal
      backdrop="opaque"
      placement="center"
      isOpen={true}
      onOpenChange={closeConfirmation}
      size="md"
      className=" z-[9999]"
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-center">
          <h1 className="text-xl text-center font-semibold">
            {confirmationModal.title}
          </h1>
        </ModalHeader>
        <ModalBody>
          <p className="text-center">{confirmationModal.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="bordered"
            className="flex-1 btn btn-secondary"
            onPress={confirmationModal.onCancel}
          >
            Cancelar
          </Button>
          <Button
            className={`flex-1 btn ${btnColorMap(
              confirmationModal.variant ?? "default"
            )}`}
            onPress={confirmationModal.onConfirm}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
