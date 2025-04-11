import { create } from "zustand";
import { useFnStore } from "./fnStore";
import { useUserStore } from "./userStore";
import { axiosClient } from "@/lib/axios/axiosClient";
import { analyzeTextWithPerspective } from "@/utils/perspective-api";
import { bannedKeywords } from "@/lib/perspective/banned-words";
import { Tables } from "@/lib/supabase/types";
import { validateImageSize } from "@/utils/image";
import { useGlobalStore } from "./globalStore";
import { updateCoins } from "@/utils/update-coins";

type Params = {
  style: string;
  format: string;
};
type Image = {
  id: string;
  url: string;
};

interface PromptResult {
  id: string;
  originalPrompt: string;
  prompt: string;
  params: Params;
  generations: Image[];
  isLoading: boolean;
  status:
    | "QUEUED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "IN_PROGRESS"
    | "TOXIC"
    | "BLOCKED";
}

type ImageProps = {
  image: CanvasImageSource;
  width: number;
  height: number;
};

interface ImageFromTextProps {
  currentPrompt: string;
  setCurrentPrompt: (currentPrompt: string) => void;

  selectedImageStyle: Tables<"prompt_styles"> | null;
  setSelectedImageStyle: (selectedImageStyle: Tables<"prompt_styles">) => void;

  selectedAspectRatio: "16:9" | "4:3" | "1:1";
  setSelectedAspectRatio: (selectedAspectRatio: "16:9" | "4:3" | "1:1") => void;

  promptHistory: PromptResult[] | [];
  setPromptHistory: (promptHistory: PromptResult[] | []) => void;

  selectedImage: Image | null;
  setSelectedImage: (selectedImage: Image | null) => void;

  handleSubmitTxt2Img: (formData: any) => Promise<{
    generation_id?: string;
    error?: boolean;
    generation_url?: string[];
  }>;

  handleUseImage: (
    sectionId: string,
    generationId: string
  ) => Promise<{ success: true } | { success: false; error: any } | null>;

  handleGenerateExtraImages: (
    urls: string[],
    generationId: number
  ) => Promise<{ success: true } | { success: false; error: any } | null>;

  handleCheckPrompt: (text: string) => Promise<{
    approved: boolean;
    reason: "blocked" | "error" | "toxic" | null;
  }>;

  handleImageUpload: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLDivElement>
      | null,
    options?: { url?: string; dropped?: boolean; form?: boolean }
  ) => Promise<void>;

  handleResizeImage: (
    image: ImageProps,
    fileReader: string,
    target?: "reference" | "referenceByColor"
  ) => { newWidth: number; newHeight: number } | void;

  initialImage?: {
    url?: string;
    size?: { width: number; height: number };
    isLoading?: boolean;
  };

  referenceImage?: {
    url?: string;
    size?: { width: number; height: number };
    isLoading?: boolean;
  };

  generateStep?: number;
}

export const useImageFromTextStore = create<ImageFromTextProps>((set) => ({
  currentPrompt: "",
  setCurrentPrompt: (currentPrompt) => set({ currentPrompt: currentPrompt }),

  selectedImageStyle: null,
  setSelectedImageStyle: (selectedImageStyle) =>
    set({ selectedImageStyle: selectedImageStyle }),

  selectedAspectRatio: "1:1",
  setSelectedAspectRatio: (selectedAspectRatio) =>
    set({ selectedAspectRatio: selectedAspectRatio }),

  promptHistory: [],
  setPromptHistory: (promptHistory) => set({ promptHistory: promptHistory }),

  selectedImage: null,
  setSelectedImage: (selectedImage) => set({ selectedImage: selectedImage }),

  handleSubmitTxt2Img: async (formData: any) => {
    const { t, toast } = useFnStore.getState();

    const {
      setSavingImage,
      currentGeneration,
      setCurrentGeneration,
      currentGenerationIdRef,
      setCurrentGenerationIdRef,
    } = useFnStore.getState();

    try {
      const { user } = useUserStore.getState();
      const { engine } = formData;
      const { promptHistory, currentPrompt, handleCheckPrompt } =
        useImageFromTextStore.getState();
      // Inicializa estados
      setCurrentGeneration({
        ...currentGeneration,
        isLoading: true,
      });

      setSavingImage(true);

      const payload = {
        ...formData,
      };

      const checkedPrompt = await handleCheckPrompt(currentPrompt);

      if (checkedPrompt && !checkedPrompt.approved) {
        // Registra o prompt como tóxico e encerra a função
        const filteredStatus =
          checkedPrompt.reason === "toxic"
            ? "TOXIC"
            : checkedPrompt.reason === "blocked"
            ? "BLOCKED"
            : "ERROR";

        const newRecord: PromptResult = {
          id: `toxicity-catch-${promptHistory.length + 1}`,
          originalPrompt: formData.originalPrompt,
          prompt: formData.suggestions,
          params: { style: formData.style, format: formData.format },
          generations: [] as Image[],
          isLoading: false,
          status: filteredStatus as PromptResult["status"],
        };

        set((state) => ({
          promptHistory: [newRecord, ...state.promptHistory],
        }));

        setCurrentGeneration({
          ...currentGeneration,
          isLoading: false,
        });

        return { error: true };
      }

      // Faz a chamada para geração
      const result = await axiosClient.post(
        "/generation/text-to-img",
        payload,
        {
          headers: { id: user?.id, engine },
        }
      );

      // Atualiza o estado com o resultado da geração
      if (result.status === 200) {
        const { generation_id, original, generated } = result.data;
        updateCoins();

        if (!generation_id) {
          throw new Error("Generation ID not found");
        }

        setCurrentGeneration({
          ...currentGeneration,
          original,
          generated,
          isLoading: true,
        });

        setCurrentGenerationIdRef({
          ...currentGenerationIdRef,
          job_id: generation_id,
        });

        const defaultImageGeneration: Image[] = [];

        for (let index = 0; index < 4; index++) {
          defaultImageGeneration.push({
            id: `${generation_id}-${index}`,
            url: "",
          });
        }

        const newRecord: PromptResult = {
          id: `${generation_id}`,
          originalPrompt: formData.originalPrompt,
          prompt: formData.suggestions,
          params: { style: formData.style, format: formData.format },
          generations: defaultImageGeneration,
          isLoading: true,
          status: "QUEUED",
        };

        set((state) => ({
          promptHistory: [newRecord, ...state.promptHistory],
        }));

        // Retornar o ID da geração para que o componente possa acompanhar
        return result.data;
      } else {
        // Adicione um retorno explícito para quando o status não for 200

        return { error: true };
      }
    } catch (error: any) {
      if (error.status === 402) {
        if (t && toast) toast("warning", t("warning.SUB-SU402"), "SUB-SU402");
      } else {
        if (t && toast) toast("error", t("error.GNR-I500"), "GNR-I500");
      }

      setCurrentGeneration({
        ...currentGeneration,
        isLoading: false,
      });

      return { error: true };
    } finally {
      // Garante que o estado de carregamento seja atualizado mesmo em caso de erro
      setSavingImage(false);
    }
  },

  handleUseImage: async (sectionId, generationId) => {
    const { handleImageUpload, setGenerateStep, handleGenerateNewImage } =
      useFnStore.getState();
    const { promptHistory } = useImageFromTextStore.getState();
    const { t, toast } = useFnStore.getState();

    const generationSection = promptHistory.find(
      (item) => item.id === sectionId
    );
    const selectedImage = generationSection?.generations.find(
      (item) => item.id === generationId
    );

    if (!selectedImage) {
      if (t && toast) toast("error", t("error.IMG-S400"), "IMG-S400");
      return null;
    }

    try {
      await handleImageUpload(null, { url: selectedImage.url });
      // Retorna algum valor que indique o sucesso do upload
      handleGenerateNewImage();
      setGenerateStep(2);
      return { success: true };
    } catch (error) {
      return { success: false, error }; // Retorna o erro para tratamento posterior
    }
  },

  handleGenerateExtraImages: async (generations_urls, generationId) => {
    const { t, toast } = useFnStore.getState();
    const { user } = useUserStore.getState();

    try {
      const payload = {
        generations_urls,
        generation_id: generationId,
        user_uuid: user?.id,
      };

      const result = await axiosClient.post("/api/my-generation", payload, {
        headers: { id: user?.id },
      });

      if (result.status === 200) {
        return { success: true };
      }
    } catch (error: any) {
      if (error.status === 402) {
        if (t && toast) toast("warning", t("warning.SUB-SU402", "SUB-SU402"));
      } else {
        if (t && toast) toast("error", t("error.GNR-I500"), "GNR-I500");
      }
    } finally {
    }

    return { success: false, error: null };
  },
  handleImageUpload: async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent<HTMLDivElement>
      | null,
    options?: { url?: string; dropped?: boolean; form?: boolean }
  ) => {
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
    target?: "reference" | "referenceByColor"
  ) => {
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

      return t && toast && toast("success", t("info.103"));
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

  handleCheckPrompt: async (text: string) => {
    function containsBannedKeywords(text: string): boolean {
      const lowercasedText = text.toLowerCase();

      return bannedKeywords.some((keyword) => lowercasedText.includes(keyword));
    }

    // Verifica palavras-chave proibidas
    if (containsBannedKeywords(text)) {
      return { approved: false, reason: "blocked" };
    }

    // Faz a validação via Perspective API
    const toxicityScores = await analyzeTextWithPerspective(text);

    if (toxicityScores) {
      const {
        TOXICITY,
        SEVERE_TOXICITY,
        IDENTITY_ATTACK,
        INSULT,
        THREAT,
        PROFANITY,
      } = toxicityScores;

      // Checa se alguma métrica excede o limite
      const isToxic =
        TOXICITY > 0.5 ||
        SEVERE_TOXICITY > 0.5 ||
        IDENTITY_ATTACK > 0.5 ||
        INSULT > 0.5 ||
        THREAT > 0.5 ||
        PROFANITY > 0.5;

      if (isToxic) {
        return { approved: false, reason: "toxic" };
      }
    } else {
      // Caso a API falhe, considere como rejeitado ou retorne erro
      return { approved: false, reason: "error" };
    }

    // Se passar por todas as validações, aprova
    return { approved: true, reason: null };
  },
}));
