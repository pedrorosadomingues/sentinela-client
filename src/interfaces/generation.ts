/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormValues {
  category: string;
  model_image: string;
  garment_image: string;
  fn: string;
  cover_feet: boolean;
  adjust_hands: boolean;
  restore_background: boolean;
  restore_clothes: boolean;
  guidance_scale: number;
  timesteps: number;
  seed: number;
  num_samples: number;
}

export interface CreateGenerationParams {
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