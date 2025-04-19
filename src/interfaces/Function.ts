export interface ImageSize {
  width: number;
  height: number;
}

export interface Image {
  url: string;
  size: ImageSize;
  elSize: ImageSize;
  isLoading: boolean;
}

export type BrushTool = "pen" | "eraser" | "clear";

export interface BrushPosition {
  x: number;
  y: number;
}

export interface BrushHistoryBase {
  tool: BrushTool;
}

export interface BrushHistoryLinesItem extends BrushHistoryBase {
  tool: "pen" | "eraser";
  points: number[]; // Pares [x, y]
  brushSize: number;
}

export interface BrushHistoryClearItem extends BrushHistoryBase {
  tool: "clear";
}

export type BrushHistoryItem = BrushHistoryLinesItem | BrushHistoryClearItem;

export interface Mask {
  isActive: boolean;
  tool: BrushTool;
  isInverted: boolean;
  historyDraw: BrushHistoryItem[];
  historyDrawStep: number;
  linesDraw: BrushHistoryItem[];
}

export interface Point {
  x: number;
  y: number;
}

export interface Layer {
  title: string;
  id: number;
  points: Point[];
  selected?: boolean;
}
