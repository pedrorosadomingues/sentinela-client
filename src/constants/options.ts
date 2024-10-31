import { ModelImageControlsFormValues } from "@/interfaces/model-image-controls";

export interface Category {
  label: string;
  value: string;
}

export interface CheckboxOption {
  name: keyof ModelImageControlsFormValues;
  label: string;
}

export interface FnOption {
  label: string;
  value: string;
  selectable: boolean;
}

export const CATEGORIES: Category[] = [
  { label: "Top", value: "tops" },
  { label: "Bottom", value: "bottoms" },
  { label: "Full-body", value: "one-pieces" },
];

export const FN_OPTIONS: FnOption[] = [
  { label: "Main", value: "main", selectable: true },
  { label: "Render Traces", value: "render_traces", selectable: false },
  { label: "Txt2Img", value: "txt2img", selectable: false },
];

export const checkboxOptions: CheckboxOption[] = [
  { name: "cover_feet", label: "Cover Feet" },
  { name: "adjust_hands", label: "Adjust Hands" },
  { name: "restore_background", label: "Restore Background" },
  { name: "restore_clothes", label: "Restore Clothes" },
];
