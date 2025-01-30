import { Tables } from "@/lib/supabase/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ImageFunctionProps extends Tables<"image_function"> {
  description: string;
}

export type ImageFunctionName = "dress-model" | "render-traces" | "txt2img";
