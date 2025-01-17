/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormValues {
  category: string;
  model_image: string;
  garment_image: string;
  fn: string;
  cover_feet: boolean;
  adjust_hands: boolean;
  restore_clothes: boolean;
  guidance_scale: number;
  timesteps: number;
  seed: number;
  num_samples: number;
  garment_photo_type: string;
}

export interface CreateGenerationBody {
  category: string;
  model_image: string;
  garment_image: string;
  fn: string;
}

export interface CreateGenerationResponse {
  status: number;
  data?: any;
  message?: any;
}

export interface Generation {
  id: number;
  params_fashn: Record<string, any>;
  started_at: string;
  ended_at: string | null;
  fn: string;
  status: string;
  path: string | null;
  model_image_path: string;
  garment_image_path: string;
  error_message: string | null;
  deleted_at: string | null;
  generation_id: string;
  user_id: number;
}
