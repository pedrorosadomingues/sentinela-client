/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { create } from "zustand";
import { getAllImageFns } from "@/services";
import { ImageFunctionProps } from "@/interfaces/image-function";
import { ToastFunction } from "@/hooks/useToast";
import { useGlobalStore } from "./globalStore";
//import { Dispatch, SetStateAction } from "react";
import { base64ToFile, validateImageSize } from "@/utils/image";
import { useUserStore } from "./userStore";
import crypto from "crypto";
import { axiosClient } from "@/lib/axios/axiosClient";
import { MAX_SUGGESTION_CHAR_COUNT } from "@/utils/forms";
import { newRecord } from "@/types/generation";
import { useMaskStore } from "./maskStore";
import { v4 as uuidv4 } from "uuid";
import { uploadFile } from "@/utils";

interface GenerationProps {
  original: string | null;
  generated: string | null;
  enhanced?: string | null;
  batchPath?: string[] | [];
  setSelectedEngine: (eng: string) => void;
  selectedEngine?: string;
}

interface CurrentGenerationProps extends GenerationProps {
  isLoading: boolean;
  status?: string | null;
  engine?: string;
  previousGenerated?: string | null;
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
  fnOptions: any;
  t: any;
  toast: ToastFunction | null;
  isFetching: boolean;
  imageFunctions: ImageFunctionProps[];
  initialImage: Partial<IImage> | undefined;
  setInitialImage: any;
  referenceImage: any;
  setReferenceImage: any;
  initialFormNewImage: Partial<IImage> | undefined;
  setInitialFormNewImage: any;
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

  setSelectedEngine: (eng: string) => void;
  selectedEngine?: string; // Added this line

  handleCheckSuggestionLength: (suggestion: string) => boolean;

  handleSubmitGenerate: (formData: any) => Promise<void>;

  handleGenerateSameImage: () => void;

  handleSaveImageS3: (
    image: string,
    fnName: string,
    target: string
  ) => Promise<string | null>;

  lastGeneration: { original: string | null; generated: string | null };

  // handleCheckIsGenerated: (generationId: string) => Promise<void>;

  onImageGenerated: (generated: newRecord) => void;

  onImageGeneratedError: (errorCode: string, type: any, status: string) => void;

  activeEnhancement: boolean;

  showOriginalImage: boolean;
  setShowOriginalImage: (showOriginalImage: boolean) => void;

  activeGeneratorButton: string;
  setActiveGeneratorButton: (button: string) => void;

  isCompare: boolean;
  setIsCompare: (isCompare: boolean) => void;

  selectedGeneratorButton: string;
  setSelectedGeneratorButton: (button: string) => void;

  handleGenerateNewImage: () => void;

  handleCleaningSelectedImage: () => void;

  handleCancelGeneration: () => Promise<void>;

  clearCurrentGeneration: () => void;

  fnSelected: string;
  setFnSelected: (fn: string) => void;

  resetMaskState: () => void;

  currentImageScore: any | null;

  setActiveEnhancement: (active: boolean) => void;
}

const initialMaskImage: MaskImageProps = {
  url: null,
  isInverted: false,
  maskType: "",
};

export const useFnStore = create<FnStoreProps>((set) => ({
  fnOptions: {},
  setFnOptions: (fnOptions: any) => set({ fnOptions }),
  setActiveEnhancement: (active) => set({ activeEnhancement: active }),

  currentImageScore: null,

  resetMaskState: () => set({ maskImage: initialMaskImage }),

  fnSelected: "",
  setFnSelected: (fn: string) => set({ fnSelected: fn }),

  clearCurrentGeneration: () =>
    set({
      currentGeneration: {
        original: null,
        generated: null,
        isLoading: false,
        batchPath: [],
        setSelectedEngine: function (eng: string): void {
          throw new Error("Function not implemented.");
        },
      },
    }),

  handleCancelGeneration: async () => {
    const generationId = useFnStore.getState().currentGenerationIdRef.job_id;

    if (generationId) {
      await axiosClient.delete(`/api/generation`, {
        data: {
          generationId: generationId,
        },
      });
    }

    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        isLoading: false,
      },
      currentGenerationIdRef: { job_id: "", id: 0 },
    }));
  },

  handleCleaningSelectedImage: () => {
    const {
      currentGeneration,
      currentGenerationIdRef,
      handleCancelGeneration,
      clearCurrentGeneration,
    } = useFnStore.getState();

    const { setActiveMask } = useMaskStore.getState();

    if (currentGeneration.isLoading && currentGenerationIdRef.job_id) {
      handleCancelGeneration();

      setActiveMask(false);
      clearCurrentGeneration();
    } else {
      set((_state) => ({
        initialImage: undefined,
        currentImageScore: null,
      }));

      setActiveMask(false);
    }
  },

  handleGenerateNewImage: () => {
    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        generated: null,
        enhanced: null,
        isLoading: false,
      },
      currentGenerationIdRef: { job_id: "", id: 0 },
    }));
  },

  selectedGeneratorButton: "compare",
  setSelectedGeneratorButton: (button) =>
    set({ selectedGeneratorButton: button }),

  isCompare: false,
  setIsCompare: (isCompare) => set({ isCompare }),

  activeGeneratorButton: "compare",
  setActiveGeneratorButton: (button) => set({ activeGeneratorButton: button }),

  showOriginalImage: false,
  setShowOriginalImage: (showOriginalImage) => set({ showOriginalImage }),

  t: null,
  toast: null,
  setSavingImage: (saving: boolean) => set({ savingImage: saving }),
  isFetching: false,
  imageFunctions: [],
  initialImage: undefined,
  setInitialImage: (image: any) => set({ initialImage: image }),
  initialFormNewImage: undefined,
  setInitialFormNewImage: (image: any) => set({ initialFormNewImage: image }),
  maskImage: { url: null, isInverted: false, maskType: "" },
  setMaskImage: (url, isInverted, maskType) =>
    set({ maskImage: { url, isInverted, maskType } }),
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
  activeEnhancement: false,
  generateStep: 1,
  setGenerateStep: (step) => set({ generateStep: step }),
  setCurrentGenerationIdRef: (ref) => set({ currentGenerationIdRef: ref }),
  currentGeneration: {
    original: null,
    generated: null,
    isLoading: false,
    batchPath: [],
    status: null,
    setSelectedEngine: function (eng: string): void {
      throw new Error("Function not implemented.");
    },
  },
  savingImage: false,
  referenceImage: undefined,
  setReferenceImage: (image: any) => set({ referenceImage: image }),
  currentGenerationIdRef: { job_id: "", id: 0 },
  setCurrentGeneration: (generation: CurrentGenerationProps) =>
    set({ currentGeneration: generation }),

  onImageGeneratedError: (errorCode: string, type: any, status: string) => {
    const { t, toast } = useFnStore.getState();

    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        isLoading: false,
        status: status,
      },
    }));

    t && toast && toast(type, t(`error.${errorCode}`), errorCode);
  },

  onImageGenerated: (generated: newRecord) => {
    const originalImage: string = generated.path_original ?? "";
    const resultImage: string = generated.path ?? "";
    const batchImage = generated.batch_paths ?? [];

    const isRenderFn = generated.fn === "render";
    const hasEnhanced = batchImage.length > 0 && isRenderFn;

    set((state) => ({
      currentGeneration: {
        ...state.currentGeneration,
        engine: state.selectedEngine,
        original: originalImage,
        generated: resultImage,
        enhanced: hasEnhanced ? batchImage[0] : null,
        batchPath: batchImage,
        isLoading: false,
        status: generated.status,
      },
      currentGenerationIdRef: {
        ...state.currentGenerationIdRef,
        id: generated.id,
      },
      lastGeneration: {
        original: originalImage,
        generated: resultImage,
      },
      activeEnhancement: hasEnhanced ? true : state.activeEnhancement,
    }));
  },

  // handleCheckIsGenerated: async (generationId: string) => {
  //   const { onImageGenerated, onImageGeneratedError } = useFnStore.getState();

  //   try {
  //     if (generationId === "") {
  //       throw new Error();
  //     }

  //     pollUserImageGeneration(
  //       generationId,
  //       onImageGenerated,
  //       onImageGeneratedError
  //     );
  //   } catch (error) {
  //     onImageGeneratedError("GNR-I500", "error", "ERROR");
  //   }
  // },

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

  handleGenerateSameImage: () => {
    set((_state) => ({
      showOriginalImage: false,
      isCompare: false,
      currentGeneration: {
        ..._state.currentGeneration,
        generated: null,
        enhanced: null,
        isLoading: false,
      },
      currentGenerationIdRef: { job_id: "", id: 0 },
    }));
  },

  lastGeneration: { original: null, generated: null },

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

  setSelectedEngine: (eng) => set({ selectedEngine: eng }),

  handleSaveImageS3: async (base64: string, fn: string, target: string) => {
    const { t, toast } = useFnStore.getState();

    try {
      set({ savingImage: true });

      const user = useUserStore.getState().user;
      if (!user) {
        if (t && toast) {
          toast("error", t("error.U404"), "U404");
          return null;
        }
      }

      const file = base64ToFile(base64, uuidv4() + "render-traces.png");

      const { uploadUrl } = await uploadFile(file);

      console.log("uploadUrl", uploadUrl);

      document.cookie = `imageUrl=${uploadUrl}; path=/; max-age=3600`;

      // Remove o cabeçalho base64 da imagem
      const imageBuffer = Buffer.from(
        base64.split(";base64,").pop()!,
        "base64"
      );

      // Gera um hash baseado no conteúdo da imagem para garantir um nome único para imagens iguais
      const hash = crypto
        .createHash("sha256")
        .update(new Uint8Array(imageBuffer))
        .digest("hex");

      const folderName = Buffer.from(String(user?.id)).toString("base64");

      const date = Date.now();

      const fileName = `${fn}-${
        target === "mask" || target === "reference" ? date : ""
      }${hash}.png`;
      const file_paths = [`${folderName}/originals/${fn}/${fileName}`];

      // Verifica se o arquivo já existe
      // const checkFileResponse = await axiosClient.post(
      //   "/api/storage?method=checkIfExists",
      //   { filePath }
      // );
      // const fileExists = checkFileResponse.data.exists;

      // if (fileExists) {
      //   if (target === "mask" || target === "reference") {
      //     await axiosClient.post("/api/storage?method=delete", { filePath });
      //   } else {
      //     set({ savingImage: false });
      //     return filePath;
      //   }
      // }

      // const urlResponse = await axiosClient.post(
      //   "/download/generate-presigned-url",
      //   {
      //     file_paths,
      //   }
      // );

      // console.log("urlResponse", urlResponse);
      // const uploadUrl = urlResponse.data.url;

      const config = {
        headers: {
          "Content-Type": "image/png",
        },
      };

      //await axiosClient.put(uploadUrl, imageBuffer, config);

      set({ savingImage: false });

      // console.log("uploadUrl", uploadUrl);

      return file_paths[0];
    } catch (error) {
      set({ savingImage: false });

      if (t && toast) {
        toast("error", t("error.IMG-S3500"), "IMG-S3500");
      }

      return null;
    }
  },

  handleCheckSuggestionLength: (suggestion: string) => {
    const { t, toast } = useFnStore.getState();

    if (suggestion.length > MAX_SUGGESTION_CHAR_COUNT) {
      t && toast && toast("warning", t("warning.suggestion_max_count"));

      return true;
    }

    return false;
  },

  handleSubmitGenerate: async (formData: any) => {
    const { user } = useUserStore.getState();
    console.log("formData", formData);
    const {
      t,
      toast,
      lastGeneration,
      currentGeneration,
      handleGenerateSameImage,
      handleCheckSuggestionLength,
    } = useFnStore.getState();

    // if (
    //   lastGeneration.generated &&
    //   lastGeneration.generated === currentGeneration.generated
    // ) {
    //   handleGenerateSameImage();
    // }

    const exceedsSuggestionLimit = handleCheckSuggestionLength(
      formData.suggestions || ""
    );

    if (exceedsSuggestionLimit) {
      return;
    }

    try {
      // Inicializa estados
      set((state) => ({
        currentGeneration: {
          ...state.currentGeneration,
          isLoading: true,
        },
      }));

      const { initialImage, handleSaveImageS3, maskImage } =
        useFnStore.getState();
      const { engine, referenceImage, activeMask, fnName } = formData;

      const { size, isLoading, url } = initialImage || {};

      // Validação inicial do engine e da imagem
      if (!engine) {
        t && toast && toast("warning", t("warning.EN-406"), "EN-406");
        set((state) => ({
          currentGeneration: {
            ...state.currentGeneration,
            isLoading: false,
          },
        }));
        return;
      }

      if (isLoading || !url) {
        t && toast && toast("warning", t("warning.IMG-LOD411"), "IMG-LOD411");
        set((state) => ({
          currentGeneration: {
            ...state.currentGeneration,
            isLoading: false,
          },
        }));
        return;
      }

      // Inicializa estados
      set((state) => ({
        generateStep: 2,
        currentGeneration: {
          ...state.currentGeneration,
          isLoading: true,
        },
        savingImage: true,
      }));

      console.log("initialImage", initialImage);

      // Função auxiliar para salvar imagem e tratar erro
      const saveImage = async (imageUrl: string, type: string) => {
        try {
          return await handleSaveImageS3(imageUrl, fnName, type);
        } catch (error) {
          t && toast && toast("warning", t("warning.IMG-LOD411"), "IMG-LOD411");
          return null;
        }
      };

      // Salva a imagem original e referência/máscara em paralelo
      const [originalImagePath, referenceImagePath, maskImagePath] =
        await Promise.all([
          saveImage(url, "initial"),
          referenceImage
            ? saveImage(referenceImage, "reference")
            : Promise.resolve(null),
          activeMask && maskImage?.url
            ? saveImage(maskImage.url, "mask")
            : Promise.resolve(null),
        ]);

        set((state) => ({
          currentGeneration: {
            ...state.currentGeneration,
            original: url, // 👈 usar base64 como fallback para comparação visual
          },
        }));

      if (!originalImagePath) {
        t && toast && toast("warning", t("warning.IMG-LOD411"), "IMG-LOD411");
        return;
      }

      // Prepara os dados para a geração
      const generationExtras: any = {};

      if (referenceImagePath)
        generationExtras.reference_image_path = referenceImagePath;

      if (maskImagePath) {
        generationExtras.mask_image_path = maskImagePath;
        generationExtras.mask_invert = maskImage.isInverted;
      }

      // if (formData.suggestions && !!formData.suggestions.trim()) {
      //   const translateSuggestions = await axiosClient.post(
      //     "/api/translate",
      //     formData.suggestions.trim()
      //   );

      //   if (translateSuggestions.status === 200) {
      //     formData.suggestions = translateSuggestions.data;
      //   }
      // }

      const payload: any = {
        ...formData,
        originalImagePath,
        initial_image_width: size?.width,
        initial_image_height: size?.height,
        generation_extras: generationExtras,
      };

      console.log("payload", payload);

      // Remove dados desnecessários
      delete payload.activeMask;
      delete payload.referenceImage;

      set((state) => ({
        lastGeneration: {
          original: originalImagePath,
          generated: state.currentGeneration.generated, // 👈 A imagem gerada anterior!
        },
      }));

      // Faz a chamada para geração
      const result = await axiosClient.post(
        "/generation/text-to-img",
        payload,
        {
          headers: { id: user?.id, engine },
          withCredentials: true,
        }
      );
      // Atualiza o estado com o resultado da geração
      if (
        result.status === 200 &&
        result.data.hasOwnProperty("generation_id")
      ) {
        // const { handleCheckIsGenerated } = useFnStore.getState();
        const { generation_id } = result.data;

        //handleCheckIsGenerated(generation_id);
        console.log("generation_id", result.data.generation_url[0]);
        set((state) => ({
          currentGenerationIdRef: {
            ...state.currentGenerationIdRef,
            job_id: generation_id,
          },
          currentGeneration: {
            ...state.currentGeneration,
            isLoading: true,
            status: "QUEUED",
            previousGenerated: state.currentGeneration.generated ?? null, // 👈 salvar antes de substituir
            generated: result.data.generation_url[0],
          },
          activeEnhancement: false,
        }));
      }
      return result.data;
    } catch (error: any) {
      if (error.status === 402) {
        t && toast && toast("warning", t("warning.SUB-SU402"), "SUB-SU402");
      }

      if (error.status === 429) {
        toast?.("warning", t?.("warning.request_max_count"), "REQ-MAX");
      }

      set((state) => ({
        currentGeneration: {
          ...state.currentGeneration,
          isLoading: false,
          status: "FAILED",
        },
      }));
    }
  },
}));
