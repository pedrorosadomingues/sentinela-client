/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { Layer, Mask, Point } from "@/interfaces/Function";
import { axiosClient } from "@/lib/axios/axiosClient";

interface IMaskStore {
  activeMask: boolean;
  setActiveMask: (active: boolean) => void;
  brushMode: boolean;
  setBrushMode: (update: boolean | ((prev: boolean) => boolean)) => void;
  selectionMode: boolean;
  setSelectionMode: (update: boolean | ((prev: boolean) => boolean)) => void;
  currentPoints: Point[];
  setCurrentPoints: (points: Point[]) => void;
  layers: Set<Layer> | null;
  setLayers: (layers: Set<Layer>) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layerId: number) => void;
  selectedLayerId: number | null;
  setSelectedLayerId: (id: number | null) => void;
  invertedMask: boolean;
  setInvertedMask: (inverted: boolean) => void;

  imageContainerDimensions: { width: number; height: number };
  setImageContainerDimensions: (width: number, height: number) => void;

  scale: number;
  setScale: (scale: number) => void;

  position: { x: number; y: number };
  setPosition: (x: number, y: number) => void;

  brushSize: number;
  setBrushSize: (value: number) => void;

  clearBrushTool: boolean;
  setClearBrushTool: (clear: boolean) => void;

  undoEvent: boolean;
  setUndoEvent: (undo: boolean) => void;

  redoEvent: boolean;
  setRedoEvent: (redo: boolean) => void;

  brushErase: boolean;
  setBrushErase: (eraser: boolean) => void;

  brushInvertMask: boolean;
  setBrushInvertMask: (inverted: boolean) => void;

  invertedImage: string | null;
  invertImage: (imageBase64: string) => Promise<string | null>;

  initialMaskState: Mask;
  mask: Mask;
  setMask: (newMask: Mask) => void;
  updateMask: (updateFn: (prev: Mask) => Mask) => void;
}

export const useMaskStore = create<IMaskStore>((set, get) => ({
  activeMask: false,
  setActiveMask: (active) => set({ activeMask: active }),

  brushMode: false,
  setBrushMode: (update) =>
    set((state) => ({
      brushMode:
        typeof update === "function"
          ? (update as (prev: boolean) => boolean)(state.brushMode)
          : update,
    })),

  selectionMode: false,
  setSelectionMode: (update) =>
    set((state) => ({
      selectionMode:
        typeof update === "function"
          ? (update as (prev: boolean) => boolean)(state.selectionMode)
          : update,
    })),

  currentPoints: [],
  setCurrentPoints: (points) => set({ currentPoints: points }),

  layers: new Set<Layer>(),
  selectedLayerId: null,
  setLayers: (layers) => set({ layers: new Set(layers) }),

  addLayer: (layer: Layer) =>
    set((state) => {
      const newLayers = new Set(state.layers);
      newLayers.add(layer);
      return { layers: newLayers };
    }),

  removeLayer: (layerId: number) =>
    set((state) => {
      const newLayers = new Set(state.layers);
      newLayers.forEach((layer) => {
        if (layer.id === layerId) {
          newLayers.delete(layer);
        }
      });
      return { layers: newLayers };
    }),

  setSelectedLayerId: (id) => set({ selectedLayerId: id }),

  invertedMask: false,
  setInvertedMask: (inverted) => set({ invertedMask: inverted }),

  imageContainerDimensions: { width: 0, height: 0 },
  setImageContainerDimensions: (width, height) =>
    set({ imageContainerDimensions: { width, height } }),

  position: { x: 0, y: 0 },
  setPosition: (x, y) => set(() => ({ position: { x, y } })),

  scale: 1, // zoom inicial
  setScale: (scale: number) => set({ scale }),

  brushSize: 50,
  setBrushSize: (value: number) => set(() => ({ brushSize: value })),

  clearBrushTool: false,
  setClearBrushTool: (clear) => set({ clearBrushTool: clear }),

  undoEvent: false,
  setUndoEvent: (undo) => set({ undoEvent: undo }),

  redoEvent: false,
  setRedoEvent: (redo) => set({ redoEvent: redo }),

  brushErase: false,
  setBrushErase: (eraser) => set({ brushErase: eraser }),

  brushInvertMask: false,
  setBrushInvertMask: (inverted) => set({ brushInvertMask: inverted }),

  invertedImage: null,
  invertImage: async (imageBase64: string) => {
    try {
      const response = await axiosClient.post("/api/image/proxy-image", {
        imageBase64,
      });

      const data = response.data;

      if (data.error) {
        console.error(data.error);
        set({ invertedImage: null });
        return null;
      }

      set({ invertedImage: data.invertedImage });
      return data.invertedImage;
    } catch (error) {
      console.error(error);
      set({ invertedImage: null });
      return null;
    }
  },

  initialMaskState: {
    isActive: false,
    tool: "pen",
    isInverted: false,
    historyDraw: [],
    historyDrawStep: 0,
    linesDraw: [],
  },

  mask: {
    isActive: false,
    tool: "pen",
    isInverted: false,
    historyDraw: [],
    historyDrawStep: 0,
    linesDraw: [],
  },

  setMask: (newMask) => set({ mask: newMask }),
  updateMask: (updateFunction) =>
    set((state) => ({ mask: updateFunction(state.mask) })),
}));
