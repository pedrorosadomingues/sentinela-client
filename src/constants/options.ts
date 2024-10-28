export interface Category {
  label: string;
  value: string;
}

export const categories: Category[] = [
  { label: "Top", value: "tops" },
  { label: "Bottom", value: "bottoms" },
  { label: "Full-body", value: "one-pieces" },
];

export interface FnOption {
  label: string;
  value: string;
  selectable: boolean;
}

export const fnOptions: FnOption[] = [
  { label: "Main", value: "main", selectable: true },
  { label: "Render Traces", value: "render_traces", selectable: false },
  { label: "Txt2Img", value: "txt2img", selectable: false },
];
