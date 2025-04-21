/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { axiosClient } from "@/lib/axios/axiosClient";
import { create } from "zustand";
import { useFnStore } from "./fnStore";

export interface CurrentPathnameProps {
  basePathname: string;
  subPathname: string | null;
  param: { key: string; value: string } | null;
}

interface GlobalStoreProps {
  // sidebar resources and functions
  sidebar: boolean;
  toggleSidebar: () => void;
  sidebarLayout: "minimized" | "expanded";
  setSidebarLayout: (variant: "minimized" | "expanded") => void;
  toggleSidebarLayout: () => void;
  imgSize: { width: number; height: number };

  showUploadTipsModal: boolean;
  setShowUploadTipsModal: (value: boolean) => void;
  setImgSize: (width: number, height: number) => void;
  // header pathname resources and functions
  currentPathname: CurrentPathnameProps | null;
  setCurrentPathname: (pathname: CurrentPathnameProps) => void;

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
  openUploadTipsModal: () => void;

  // email sent feedback
  emailSended: string;
  setEmailSended: (email: string) => void;

  //profile resources
  selectedProfileTab: string;
  setSelectedProfileTab: (tab: string) => void;

  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;

  hasAlert: boolean;
  setHasAlert: (value: boolean) => void;

  handleShowFeedbackModal: ({ delay }: { delay: boolean }) => Promise<void>;

  handleCheckPrevEvaluated: (generationId: number) => Promise<boolean>;

  generationHasEvaluated: boolean | undefined;

  isOpenFeedbackModal: boolean;

  onOpenFeedbackModalChange: () => void;

 // fetchAdvertisement: (locale: string) => Promise<void>;
  advertisement?: any; // Add this property to the interface

  handleSendFeedback: (feedback: string, rating: number) => Promise<boolean>;
}

export const useGlobalStore = create<GlobalStoreProps>((set) => ({
  handleSendFeedback: async (feedback, rating) => {
    const { currentGenerationIdRef } = useFnStore.getState();

    const body = {
      generation_id: currentGenerationIdRef.id,
      rating: Number(rating),
      feedback: feedback,
    };

    await axiosClient
      .put("/api/generation/feedback", body)
      .then(() => {
        set({ generationHasEvaluated: true });
        return true;
      })
      .catch((_error) => {
        return false;
      });

    return false;
  },
  
  // fetchAdvertisement: async (locale) => {
  //   const response = await axiosClient.get(`/api/ads?locale=${locale}`);

  //   if (response.status === 200) {
  //     set({
  //       advertisement: response.data,
  //     });
  //   }
  // },

  onOpenFeedbackModalChange: () =>
    set((state) => ({ isOpenFeedbackModal: !state.isOpenFeedbackModal })),

  isOpenFeedbackModal: false,

  generationHasEvaluated: undefined,

  handleCheckPrevEvaluated: async (generationId) => {
    // Check if user has already evaluated this image

    await axiosClient
      .get("/api/generation/feedback", {
        params: {
          id: generationId,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          set({ generationHasEvaluated: false });
          return true;
        } else if (res.status === 202) {
          set({ generationHasEvaluated: true });
          return false;
        }
      })
      .catch((_error) => {
        console.error("Error checking evaluation:", _error);
        return false;
      });

    return false;
  },

  handleShowFeedbackModal: async ({ delay }: { delay: boolean }) => {
    const {
      handleCheckPrevEvaluated,
      isOpenFeedbackModal,
      onOpenFeedbackModalChange,
    } = useGlobalStore.getState();
    const { currentGenerationIdRef } = useFnStore.getState();

    const wasEvaluated = await handleCheckPrevEvaluated(
      currentGenerationIdRef.id
    );

    if (wasEvaluated) {
      return;
    }

    const shouldOpen = Math.random() < 0.1;

    if (shouldOpen && !isOpenFeedbackModal) {
      delay
        ? setTimeout(onOpenFeedbackModalChange, 10000)
        : onOpenFeedbackModalChange();
    }
  },

  sidebar: true,
  toggleSidebar: () => set((state) => ({ sidebar: !state.sidebar })),
  imgSize: { width: 0, height: 0 },
  setImgSize: (width, height) => set({ imgSize: { width, height } }),
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
  showUploadTipsModal: false,
  setShowUploadTipsModal: (value: boolean) => {
    set({ showUploadTipsModal: value });
  },
  openUploadTipsModal: () => {
    const expirationDateString = localStorage.getItem(
      "rdw-upload-pp-expiration"
    );

    if (!expirationDateString) {
      set({ showUploadTipsModal: true });
      return;
    }

    const expirationDate = new Date(expirationDateString);
    if (expirationDate <= new Date()) {
      // Data expirada, modal será exibido novamente
      localStorage.removeItem("rdw-upload-pp-expiration");
      set({ showUploadTipsModal: true });
    }
  },
  currentPathname: null,
  setCurrentPathname: (pathname) => set({ currentPathname: pathname }),

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

  selectedProfileTab: "profile",
  setSelectedProfileTab: (tab) => set({ selectedProfileTab: tab }),

  isEditMode: false,
  setIsEditMode: (value) => set({ isEditMode: value }),

  hasAlert: false,
  setHasAlert: (value: boolean) => set({ hasAlert: value }),
}));
