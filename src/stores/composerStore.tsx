import { create } from 'zustand';
import { useFnStore } from './fnStore';
import html2canvas from 'html2canvas';
import { Image as IImage } from "@/interfaces/Function";
import toast from 'react-hot-toast';

enum ImageType {
    IES = 'ies',
    common = 'common',
}

interface AbsolutePosition {
    x: number; // Posição absoluta em pixels
    y: number; // Posição absoluta em pixels
}

interface RelativePosition {
    relativeX: number; // Posição relativa em percentual
    relativeY: number; // Posição relativa em percentual
    relativeWidth: number; // Largura relativa em percentual
    relativeHeight: number; // Altura relativa em percentual
    rotate: number; // Rotação em graus
}

interface Positioning extends AbsolutePosition, RelativePosition { }

interface Image {
    readonly id: number;
    name: string;
    isHidden: boolean;
    isBlocked: boolean;
    src: string;
    type: ImageType;
    positioning: Positioning;
    size: {
        width: number;
        height: number;
    };
}

export interface ComposerLastHistory {
    id: string;
    images: Image[];
    result: {
        initialImage: Partial<IImage>;
        composedImage: string;
        generatedImage: string;
    },
    createdAt?: Date;
}

interface ComposerStore {
    containerRef: React.RefObject<HTMLDivElement>;

    composerMode: boolean;
    setComposerMode: (mode: boolean) => void;

    isComposerLoading: boolean;
    setIsComposerLoading: (loading: boolean) => void;

    imageContainerDimensions: { width: number; height: number };
    setImageContainerDimensions: (value: { width: number, height: number }) => void;

    base64Image: string | null;
    setBase64Image: (base64: string | null) => void;

    images: Image[];
    selectedImageId: number | null;
    setSelectedImageId: (id: number | null) => void;

    lastComposerHistory: ComposerLastHistory | null;
    updateLastComposerHistory: (history: ComposerLastHistory) => void;
    getLastHistoryCanvas: () => void;

    renameModal: boolean;
    showRenameModal: () => void;

    addIESLight: (src: string) => void;
    updateImagePosition: (id: number, x: number, y: number) => void;
    updateImageSize: (id: number, width: number, height: number) => void;
    updateImageRelativePosition: (id: number, relativeX: number, relativeY: number) => void;
    updateImageRelativeSize: (id: number, relativeWidth: number, relativeHeight: number) => void;
    updateImageRotation: (id: number, direction: 'left' | 'right' | 'original') => void;
    updateImageName: (id: number, name: string) => void;
    toggleBlockImageMovement: (id: number) => void;
    toggleImageVisibility: (id: number) => void;
    duplicateObject: (id: number) => void;
    removeImage: (id: number) => void;
    removeAllImages: () => void;
    centralizeImage: (id: number, containerWidth: number, containerHeight: number) => void;
    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSaveComposeImage: (t: {
        loading: string;
        success: string;
        error: string;
    }) => Promise<boolean | undefined>;
}

export const useComposerStore = create<ComposerStore>((set) => ({
    containerRef: { current: null },

    composerMode: false,
    setComposerMode: (mode) => set({ composerMode: mode }),

    isComposerLoading: false,
    setIsComposerLoading: (loading) => set({ isComposerLoading: loading }),

    imageContainerDimensions: { width: 0, height: 0 },
    setImageContainerDimensions: ({ width, height }) => set({ imageContainerDimensions: { width, height } }),

    base64Image: null,
    setBase64Image: (base64) => set({ base64Image: base64 }),

    images: [],
    selectedImageId: null,
    setSelectedImageId: (id) => set({ selectedImageId: id }),

    lastComposerHistory: null,

    updateLastComposerHistory: (history: ComposerLastHistory) => {
        set(() => ({
            lastComposerHistory: history
        }));
    },
    getLastHistoryCanvas: () => {
        const { lastComposerHistory } = useComposerStore.getState();
        const { setInitialImage } = useFnStore.getState();

        if (lastComposerHistory) {
            setInitialImage(lastComposerHistory.result.initialImage as Partial<IImage>);

            // Validar e restaurar as imagens do histórico
            const validatedImages = lastComposerHistory.images.map((image) => ({
                ...image,
                positioning: {
                    x: !isNaN(image.positioning.x) ? image.positioning.x : 0,
                    y: !isNaN(image.positioning.y) ? image.positioning.y : 0,
                    relativeX: image.positioning.relativeX || 0,
                    relativeY: image.positioning.relativeY || 0,
                    relativeWidth: image.positioning.relativeWidth || 1,
                    relativeHeight: image.positioning.relativeHeight || 1,
                    rotate: image.positioning.rotate || 0,
                },
                size: {
                    width: image.size.width || 500,
                    height: image.size.height || 500,
                }
            }));

            set(() => ({ images: validatedImages }));
        };
    },

    renameModal: false,
    showRenameModal: () => set((state) => ({ renameModal: !state.renameModal })),

    addIESLight: (src: string) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const newImage: Image = {
                id: Date.now() + Math.random(),
                name: 'IES light',
                isHidden: false,
                isBlocked: false,
                src: src,
                type: ImageType.IES,
                size: { width: 250, height: 250 },
                positioning: {
                    x: 50,
                    y: 50,
                    relativeX: (50 / window.innerWidth) * 100,
                    relativeY: (50 / window.innerHeight) * 100,
                    relativeWidth: (250 / window.innerWidth) * 100,
                    relativeHeight: (250 / window.innerHeight) * 100,
                    rotate: 0,
                },
            };
            set((state) => ({ images: [...state.images, newImage] }));
        };
    },

    updateImagePosition: (id: number, x: number, y: number) =>
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id ? { ...image, positioning: { ...image.positioning, x, y } } : image
            ),
        })),

    updateImageSize: (id: number, width: number, height: number) =>
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id ? { ...image, size: { width, height } } : image
            ),
        })),

    // Atualiza posição relativa em percentuais
    updateImageRelativePosition: (id: number, relativeX: number, relativeY: number) =>
        set((state) => ({
            images: state.images.map((image) => {
                // Garantir que a posição relativa seja corretamente convertida para absolutas e vice-versa
                const { width, height } = state.imageContainerDimensions;
                const x = (relativeX / 100) * width;
                const y = (relativeY / 100) * height;

                return image.id === id
                    ? {
                        ...image,
                        positioning: { ...image.positioning, relativeX, relativeY, x, y },
                    }
                    : image;
            }),
        })),

    // Atualiza tamanho relativo em percentuais
    updateImageRelativeSize: (id: number, relativeWidth: number, relativeHeight: number) =>
        set((state) => ({
            images: state.images.map((image) => {
                const { width, height } = state.imageContainerDimensions;
                const newWidth = (relativeWidth / 100) * width;
                const newHeight = (relativeHeight / 100) * height;

                return image.id === id
                    ? {
                        ...image,
                        positioning: { ...image.positioning, relativeWidth, relativeHeight },
                        size: { width: newWidth, height: newHeight },
                    }
                    : image;
            }),
        })),

    updateImageRotation: (id: number, direction: 'left' | 'right' | 'original') => {
        const { images } = useComposerStore.getState();
        const selectedImage = images.find(image => image.id === id);

        if (selectedImage) {
            const newRotation = direction === 'left'
                ? selectedImage.positioning.rotate - 5
                : direction === 'right'
                    ? selectedImage.positioning.rotate + 5
                    : 0; // Reset para 0 se for "original"

            set((state) => ({
                images: state.images.map((image) =>
                    image.id === id
                        ? { ...image, positioning: { ...image.positioning, rotate: newRotation } }
                        : image
                ),
            }));
        }
    },
    updateImageName: (id: number, name: string) => {
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id ? { ...image, name } : image
            ),
        }));
    },

    toggleBlockImageMovement: (id: number) =>
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id ? { ...image, isBlocked: !image.isBlocked } : image
            ),
            selectedImageId: state.images.find((image) => image.id === id)?.isBlocked ? id : null,
        })),

    toggleImageVisibility: (id: number) => {
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id ? { ...image, isHidden: !image.isHidden } : image
            ),
        }));
    },

    duplicateObject: (id: number) => {
        const { images } = useComposerStore.getState();

        const image = images.find((image) => image.id === id);
        if (image) {
            set((state) => ({
                images: [
                    ...state.images,
                    {
                        ...image,
                        id: Date.now() + Math.random(),
                        name: `${image.name} - copy`,
                        positioning: {
                            ...image.positioning,
                            x: image.positioning.x + 50,
                            y: image.positioning.y + 50,
                            relativeX: image.positioning.relativeX + 5,
                        },
                    },
                ],
            }));
        }
    },

    removeImage: (id: number) =>
        set((state) => ({
            images: state.images.filter((image) => image.id !== id),
            selectedImageId: state.selectedImageId === id ? null : state.selectedImageId,
        })),

    removeAllImages: () => set(() => ({ images: [], selectedImageId: null })),

    centralizeImage: (id: number, containerWidth: number, containerHeight: number) =>
        set((state) => ({
            images: state.images.map((image) =>
                image.id === id
                    ? {
                        ...image,
                        positioning: {
                            ...image.positioning,
                            x: (containerWidth - image.size.width) / 2,
                            y: (containerHeight - image.size.height) / 2,
                        },
                    }
                    : image
            ),
        })),

    handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const { containerRef } = useComposerStore.getState();

        if (file && containerRef.current) {
            const canvasWidth = containerRef.current.offsetWidth;
            const canvasHeight = containerRef.current.offsetHeight;

            const imageUrl = URL.createObjectURL(file);
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                set((state) => ({
                    images: [
                        ...state.images,
                        {
                            id: Date.now() + Math.random(),
                            name: 'untitled',
                            isHidden: false,
                            isBlocked: false,
                            src: imageUrl,
                            type: ImageType.common,
                            positioning: {
                                x: 50,
                                y: 50,
                                relativeX: (50 / canvasWidth) * 100,
                                relativeY: (50 / canvasHeight) * 100,
                                relativeWidth: (img.width / canvasWidth) * 100,
                                relativeHeight: (img.height / canvasHeight) * 100,
                                rotate: 0,
                            },
                            size: { width: img.width, height: img.height },
                        },
                    ],
                }));
            };
        }
    },

    handleSaveComposeImage: async (t) => {
        const { setInitialImage, initialImage } = useFnStore.getState();
        const { images, updateLastComposerHistory, setIsComposerLoading } = useComposerStore.getState();

        setIsComposerLoading(true);

        const saveAsBase64 = async (elementId: string) => {
            const element = document.getElementById(elementId);

            if (element) {
                if (images.length > 0) {
                    // Adiciona atraso de 4 segundos para garantir que a renderização da composição esteja completa
                    // fix para o erro de renderização com opacidade baixa
                    await new Promise((resolve) => setTimeout(resolve, 4000));
                };

                const canvas = await html2canvas(element, {
                    useCORS: true, // Caso esteja usando imagens externas
                });

                return canvas.toDataURL('image/png'); // Retorna o base64
            };

            return null;
        };

        const oldInitialImage = initialImage as Partial<IImage>;

        const history: ComposerLastHistory = {
            id: Date.now().toString(),
            images: images,
            result: {
                initialImage: oldInitialImage,
                composedImage: '',
                generatedImage: '',
            },
            createdAt: new Date(),
        };

        return toast.promise(
            (async () => {
                const base64 = await saveAsBase64('canvas-area');

                if (base64) {
                    return new Promise<boolean | undefined>((resolve) => {
                        // Atualiza a imagem inicial com a nova composição em base64
                        setInitialImage({
                            ...initialImage,
                            url: base64,
                        });

                        set(() => ({
                            composerMode: false,
                            images: [],
                        }));

                        // Atualiza o histórico com a nova imagem composta
                        history.result.composedImage = base64;
                        updateLastComposerHistory(history);

                        resolve(true); // Garante que o estado foi atualizado
                    });
                }
            })(),
            {
                loading: t.loading,
                success: t.success,
                error: t.error,
            }
        ).finally(() => setIsComposerLoading(false));
    },
}));
