import { ModelImageControlsFormValues } from "@/interfaces/model-image-controls";
import {
  ClothesBottom,
  ClothesComplete,
  ClothesTop,
} from "@/components/organisms/icons";
import { SVGProps } from "react";
import { getLocaleMessages } from "@/lib/i18n/utils";

export interface Category {
  label: string;
  value: string;
  icon?: JSX.Element;
}

export interface CheckboxOption {
  name: keyof ModelImageControlsFormValues;
  label: string;
  description?: string;
}

export interface FnOption {
  label: string;
  value: string;
  selectable: boolean;
}

const iconProps: SVGProps<SVGSVGElement> = {
  width: 36,
  height: 36,
  className: "text-inherit",
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

export const getCheckboxOptions = (locale: string): CheckboxOption[] => {
  const messages = getLocaleMessages(locale);

  return [
    {
      name: "cover_feet",
      label: messages.model_image_controls.cover_feet_label,
      description: messages.model_image_controls.cover_feet_description,
    },
    {
      name: "adjust_hands",
      label: messages.model_image_controls.adjust_hands_label,
      description: messages.model_image_controls.adjust_hands_description,
    },
    {
      name: "restore_clothes",
      label: messages.model_image_controls.restore_clothes_label,
      description: messages.model_image_controls.restore_clothes_description,
    },
  ];
};
