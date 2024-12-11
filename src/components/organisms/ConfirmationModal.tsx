'use client';
import { useGlobalStore } from "@/zustand-stores";

export default function ConfirmationModal() {
  const { confirmationModal } = useGlobalStore();

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
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm"
      style={{ backgroundColor: "transparent" }}
      // Caso queira fechar ao clicar fora do modal:
      // onClick={closeConfirmation}
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
          <button
            className="flex-1 btn btn-secondary border border-gray-300 rounded py-2 text-center"
            onClick={confirmationModal.onCancel}
          >
            Cancelar
          </button>
          <button
            className={`flex-1 btn rounded py-2 text-center ${btnColorMap(
              confirmationModal.variant ?? "default"
            )}`}
            onClick={confirmationModal.onConfirm}
          >
            Confirmar
          </button>
        </footer>
      </div>
    </div>
  );
}
