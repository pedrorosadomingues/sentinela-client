"use client";
import { useState } from "react";
import { useGlobalStore } from "@/stores";
import ConfirmationButton from "../atoms/buttons/ConfirmationButton";

export default function ConfirmationModal() {
  const { confirmationModal } = useGlobalStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!confirmationModal.isOpen) return null;

  async function handleConfirm() {
    setIsLoading(true);
    await confirmationModal.onConfirm();
    setIsLoading(false);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="relative bg-white rounded-[10px] w-full max-w-md mx-4 my-8 shadow-small flex flex-col"
        onClick={(e) => e.stopPropagation()} // Impede o clique no container de fechar o modal
      >
        <header className="flex items-center justify-center p-4 border-b">
          <h1 className="text-xl text-center font-semibold">
            {confirmationModal.title}
          </h1>
        </header>
        <main className="p-4">
          <p className="text-center">{confirmationModal.message}</p>
        </main>
        <footer className="p-4 flex gap-2">
          <ConfirmationButton
            isLoading={false}
            onClick={confirmationModal.onCancel}
            color="secondary"
            size="sm"
          >
            Cancelar
          </ConfirmationButton>
          <ConfirmationButton
            isLoading={isLoading}
            onClick={handleConfirm}
            color={"danger"}
            size="sm"
          >
            Confirmar
          </ConfirmationButton>
        </footer>
      </div>
    </div>
  );
}
