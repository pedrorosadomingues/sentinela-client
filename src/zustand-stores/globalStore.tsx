import { create } from "zustand";

interface IGlobalStore {
  confirmationModal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "primary" | "danger";
  };
  openConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void,
    variant?: "primary" | "danger"
  ) => void;
  closeConfirmation: () => void;
}

export const useGlobalStore = create<IGlobalStore>((set) => ({
  confirmationModal: {
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
    variant: "primary",
  },
  openConfirmation: (title, message, onConfirm, onCancel, variant?) => {
    set({
      confirmationModal: {
        isOpen: true,
        title,
        message,
        onConfirm,
        onCancel,
        variant,
      },
    });
  },
  closeConfirmation: () => {
    set({
      confirmationModal: {
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => {},
        onCancel: () => {},
        variant: "primary",
      },
    });
  },
}));
