export interface GenerationProps {
  original: string | null;
  generated: string | null;
  enhanced?: string | null;
  batchPath?: string[] | [];
}

export interface CurrentGenerationProps extends GenerationProps {
  isLoading: boolean;
  status?: string | null;
  engine?: string
}

export type ImageProps = {
  image: CanvasImageSource;
  width: number;
  height: number;
};

type ImageScoreParams = {
  image_res: number;
  border_area: number;
  mean_intensity: number;
  shadow_percentage: number;
};

type ImageScoreSliders = {
  resolution: number;
  border_score: number;
  light_score: number;
  shadow_score: number;
  average_score: number
};

export interface ImageScoreProps {
  sliders: ImageScoreSliders | null;
  parameters: ImageScoreParams | null;
  is_loading: boolean;
};

type Params = {
  style: string;
  format: string;
};

type Image = {
  id: string;
  url: string;
};

export interface PromptResult {
  id: string;
  originalPrompt: string;
  prompt: string;
  params: Params;
  generations: Image[];
  isLoading: boolean;
  status: "QUEUED" | "COMPLETED" | "FAILED" | "CANCELLED" | "IN_PROGRESS" | "TOXIC" | "BLOCKED";
}

export interface newRecord {
  id: number;
  path_original: string;
  path: string;
  batch_paths: string[] | null;
  status: string;
  fn?: string;
}

export type HistoryItem = {
  id: number;
  batch_paths: string[] | null;
  ended_at: string;
  feedback: string | null;
  fn: string;
  paste_id: string | null;
  path: string;
  path_original: string;
  project_id: string | null;
};