import { create } from "zustand";

interface GlobalStoreProps {
  // sidebar resources and functions
  sidebar: boolean;
  toggleSidebar: () => void;
  sidebarLayout: "minimized" | "expanded";
  setSidebarLayout: (variant: "minimized" | "expanded") => void;
  toggleSidebarLayout: () => void;

  // confirmation modal resources and functions
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

  // login components to show control
  rootControl: string;
  setRootControl: (control: string) => void;

  // email sent feedback
  emailSended: string;
  setEmailSended: (email: string) => void;
}

export const useGlobalStore = create<GlobalStoreProps>((set) => ({
  sidebar: true,
  toggleSidebar: () => set((state) => ({ sidebar: !state.sidebar })),

  sidebarLayout: "expanded",
  setSidebarLayout: (variant: "minimized" | "expanded") =>
    set({ sidebarLayout: variant }),
  toggleSidebarLayout: () => {
    const { sidebarLayout } = useGlobalStore.getState();

    set((state) => ({
      sidebarLayout:
        state.sidebarLayout === "minimized" ? "expanded" : "minimized",
    }));

    localStorage.setItem(
      "sidebar-layout",
      sidebarLayout === "minimized" ? "expanded" : "minimized"
    );
  },

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

  rootControl: "login",
  setRootControl: (control: string) => set({ rootControl: control }),

  emailSended: "",
  setEmailSended: (email: string) => set({ emailSended: email }),
}));
