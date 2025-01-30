import { ModelImageControlsFormValues } from "@/interfaces/model-image-controls";
import {
  ClothesBottom,
  ClothesComplete,
  ClothesTop,
} from "@/components/organisms/icons";
import { SVGProps } from "react";

export interface Category {
  label: string;
  value: string;
  icon?: JSX.Element;
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

const iconProps: SVGProps<SVGSVGElement> = {
  width: 36,
  height: 36,
  className: "text-inherit"
};

export const CATEGORIES_GARMENT: Category[] = [
  { label: "Top", value: "tops", icon: <ClothesTop {...iconProps} /> },
  { label: "Bottom", value: "bottoms", icon: <ClothesBottom {...iconProps} /> },
  {
    label: "Full-body",
    value: "one-pieces",
    icon: <ClothesComplete {...iconProps} />,
  },
];

export const TYPES_GARMENT: Category[] = [
  { label: "Flat-lay", value: "flat-lay" },
  { label: "Model", value: "model" },
];

export const FN_OPTIONS: FnOption[] = [
  { label: "Main", value: "main", selectable: true },
  { label: "Render Traces", value: "render_traces", selectable: false },
  { label: "Txt2Img", value: "txt2img", selectable: false },
];

export const CHECKBOX_OPTIONS: CheckboxOption[] = [
  { name: "cover_feet", label: "Cover Feet" },
  { name: "adjust_hands", label: "Adjust Hands" },
  { name: "restore_clothes", label: "Restore Clothes" },
];
