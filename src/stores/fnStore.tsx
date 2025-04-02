import { create } from "zustand";
import { getAllImageFns } from "@/services";
import { ImageFunctionProps } from "@/interfaces/image-function";
import { ToastFunction } from "@/hooks/useToast";
import { useGlobalStore } from "./globalStore";
import { Dispatch, SetStateAction } from "react";
import { validateImageSize } from "@/utils/image";

interface GenerationProps {
  original: string | null;
  generated: string | null;
  enhanced?: string | null;
  batchPath?: string[] | [];
}

interface CurrentGenerationProps extends GenerationProps {
  isLoading: boolean;
  status?: string | null;
  engine?: string;
}

type UploadOptions = {
  dropped?: boolean;
  form?: true;
  url?: string;
};
interface ImageSize {
  width: number;
  height: number;
}

interface IImage {
  url: string;
  size: ImageSize;
  elSize: ImageSize;
  isLoading: boolean;
}
type MaskImageProps = {
  url: string | null;
  isInverted: boolean;
  maskType: string;
};
type ImageProps = {
  image: CanvasImageSource;
  width: number;
  height: number;
};
interface FnStoreProps {
  t: any;
  toast: ToastFunction | null;
  isFetching: boolean;
  imageFunctions: ImageFunctionProps[];
  initialImage: Partial<IImage> | undefined;
  setInitialImage: Dispatch<SetStateAction<Partial<IImage> | undefined>>;
  referenceImage: Partial<IImage> | undefined;
  setReferenceImage: Dispatch<SetStateAction<Partial<IImage> | undefined>>;
  initialFormNewImage: Partial<IImage> | undefined;
  setInitialFormNewImage: Dispatch<SetStateAction<Partial<IImage> | undefined>>;
  maskImage: MaskImageProps;
  setMaskImage: (
    url: string | null,
    isInverted: boolean,
    maskType: string
  ) => void;
  setImageFunctions: (imageFunctions: ImageFunctionProps[]) => void;
  handleImageUpload: (e: any, options?: UploadOptions) => void;
  getImageFunctions: (locale: string) => Promise<void>;
  currentGenerationIdRef: { job_id: string; id: number };
  currentGeneration: CurrentGenerationProps;
  setSavingImage: (savingImage: boolean) => void;
  savingImage: boolean;
  setCurrentGenerationIdRef: (ref: { job_id: string; id: number }) => void;
  setCurrentGeneration: (generation: CurrentGenerationProps) => void;
  generateStep: number;
  handleResizeImage: (
    image: ImageProps,
    fileReader: string,
    target?: string
  ) => void;
  setGenerateStep: (step: number) => void;
}

export const useFnStore = create<FnStoreProps>((set) => ({
  t: null,
  toast: null,
  setSavingImage: (saving: boolean) => set({ savingImage: saving }),
  isFetching: false,
  imageFunctions: [],
  setImageFunctions: (imageFunctions: ImageFunctionProps[]) =>
    set({ imageFunctions }),
  getImageFunctions: async (locale) => {
    set({ isFetching: true });

    const response = await getAllImageFns(locale);

    if (response.status === 200) {
      set({ imageFunctions: response.data, isFetching: false });
    } else {
      console.error(response.message);
    }
  },
  generateStep: 1,
  setGenerateStep: (step) => set({ generateStep: step }),
  setCurrentGenerationIdRef: (ref) => set({ currentGenerationIdRef: ref }),
  currentGeneration: {
    original: null,
    generated: null,
    isLoading: false,
    batchPath: [],
    status: null,
  },
  savingImage: false,
  referenceImage: undefined,
  setReferenceImage: (image: Partial<IImage> | undefined) =>
    set({ referenceImage: image }),
  currentGenerationIdRef: { job_id: "", id: 0 },
  setCurrentGeneration: (generation: CurrentGenerationProps) =>
    set({ currentGeneration: generation }),

  handleImageUpload: async (e, options) => {
    const { t, toast } = useFnStore.getState();

    let file;
    let imageUrl = null;

    // verifica não há o proxUrl proveniente do options?.url
    if (options?.url) {
      if (options.url.includes("/api/image/proxy-image")) {
        imageUrl = options.url;
      } else {
        // precisa colocar para liberar no google chrome**
        const proxyUrl = `/api/image/proxy-image?url=${encodeURIComponent(
          options?.url
        )}`;

        imageUrl = proxyUrl;
      }

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);

      imageUrl = objectURL;
    } else {
      file = options?.dropped ? e.dataTransfer.files[0] : e.target.files[0];
    }

    const reader = new FileReader();

    reader.onloadstart = () => {
      set((state) => ({
        initialImage: {
          ...state.initialImage,
          isLoading: true,
        },
      }));
    };

    reader.onabort = () => {
      set((state) => ({
        initialImage: {
          ...state.initialImage,
          isLoading: false,
        },
      }));
    };

    reader.onerror = () => {
      set((state) => ({
        initialImage: {
          ...state.initialImage,
          isLoading: false,
        },
      }));
    };

    useGlobalStore.getState().openUploadTipsModal();

    if (imageUrl) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = imageUrl;

      image.onload = () => {
        const { width, height } = image;

        if (!validateImageSize(width)) {
          set(() => ({
            initialImage: undefined,
          }));

          if (t && toast) {
            return toast("warning", t("warning.IMG-OPT406"), "IMG-OPT406");
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0);

        const base64Image = canvas.toDataURL("image/jpeg");

        set((state) => ({
          initialImage: {
            ...state.initialImage,
            isLoading: false,
            url: base64Image,
            size: { width, height },
          },
        }));

        useFnStore
          .getState()
          .handleResizeImage({ image, width, height }, base64Image);
      };
    } else {
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.crossOrigin = "Anonymous";

        image.onload = () => {
          const { width, height } = image;

          if (!validateImageSize(width)) {
            set(() => ({
              initialImage: undefined,
            }));

            if (t && toast) {
              return toast("warning", t("warning.IMG-OPT406"), "IMG-OPT406");
            }
          }

          set((state) => ({
            initialImage: {
              ...state.initialImage,
              isLoading: false,
            },
          }));

          if (options?.form) {
            useFnStore.getState().setInitialFormNewImage({
              url: reader.result as string,
              size: { width, height },
            });
          }

          useFnStore
            .getState()
            .handleResizeImage(
              { image, width, height },
              reader.result as string
            );
        };
      };

      reader.readAsDataURL(file);
    }
  },

  handleResizeImage: (
    image: ImageProps,
    fileReader: string,
    target?: string
  ): { newWidth: number; newHeight: number } | void => {
    const { t, toast } = useFnStore.getState();

    const maxDimensionSize = 1920;
    let newWidth = image.width;
    let newHeight = image.height;

    if (image.width > maxDimensionSize || image.height > maxDimensionSize) {
      t && toast && toast("loading", t("info.102"));

      const aspectRatio = image.width / image.height;

      if (image.width > maxDimensionSize) {
        newWidth = maxDimensionSize;
        newHeight = Math.round(newWidth / aspectRatio);
      }

      if (newHeight > maxDimensionSize) {
        newHeight = maxDimensionSize;
        newWidth = Math.round(newHeight * aspectRatio);
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx !== null) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image.image, 0, 0, newWidth, newHeight);

        const resizedImage = canvas.toDataURL("image/jpeg");

        if (target === "reference") {
          set((state) => ({
            referenceImage: {
              ...state.referenceImage,
              url: resizedImage,
              size: { width: newWidth, height: newHeight },
            },
          }));
        } else {
          set((state) => ({
            initialImage: {
              ...state.initialImage,
              url: resizedImage,
              size: { width: newWidth, height: newHeight },
            },
            generateStep: 2,
          }));
        }
      }

      return { newWidth, newHeight };
    }

    if (target === "reference" || target === "referenceByColor") {
      set((state) => ({
        referenceImage: {
          ...state.referenceImage,
          url: fileReader,
          size: { width: newWidth, height: newHeight },
        },
      }));

      return { newWidth, newHeight };
    }

    set((state) => ({
      initialImage: {
        ...state.initialImage,
        url: fileReader,
        size: { width: newWidth, height: newHeight },
      },
      generateStep: 2,
    }));

    useGlobalStore.getState().setImgSize(newWidth, newHeight);

    return { newWidth, newHeight };
  },
}));
