import { BorderColor, Checkroom, DesignServices } from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";

export const ICON_MAPPING = {
  "dress-model": (size: SvgIconProps["fontSize"] = "large") => (
    <Checkroom fontSize={size} className="text-inherit" />
  ),
  txt2img: (size: SvgIconProps["fontSize"] = "large") => (
    <BorderColor fontSize={size} className="text-inherit" />
  ),
  "render-traces": (size: SvgIconProps["fontSize"] = "large") => (
    <DesignServices fontSize={size} className="text-inherit" />
  ),
};
