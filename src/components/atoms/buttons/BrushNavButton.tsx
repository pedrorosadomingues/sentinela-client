/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ToolButton from "./ToolButton";
import {
  AddCircleOutline,
  CleaningServicesOutlined,
  DeblurOutlined,
  InvertColorsOffOutlined,
  InvertColorsOutlined,
  RedoOutlined,
  RemoveCircleOutline,
  UndoOutlined,
} from "@mui/icons-material";

import { Slider } from "@nextui-org/react";
import { useMaskStore } from "@/stores/maskStore";
import { useTranslations } from "next-intl";

type BrushNavButtonProps = {};

const BrushNavButton: React.FC<BrushNavButtonProps> = () => {
  const t = useTranslations("tools.mask");

  const {
    brushMode,
    // scale,
    brushSize,
    brushErase,
    brushInvertMask,
    setBrushInvertMask,
    setBrushErase,
    setScale,
    setBrushSize,
    setClearBrushTool,
    setUndoEvent,
    setRedoEvent,
  } = useMaskStore();

  const toggleEraserTool = () => setBrushErase(!brushErase);
  const toggleInvertMask = () => setBrushInvertMask(!brushInvertMask);
  const handleUndoEvent = () => setUndoEvent(true);
  const handleRedoEvent = () => setRedoEvent(true);
  const handleClearEvent = () => setClearBrushTool(true);

  const handleBrushSizeChange = (value: number | number[]) => {
    if (typeof value === "number") setBrushSize(value);
  };

  const handleDecreaseBrushSize = () => {
    if (brushSize > 1) setBrushSize(brushSize - 1);
  };

  const handleIncreaseBrushSize = () => {
    if (brushSize < 100) setBrushSize(brushSize + 1);
  };

  // Função para lidar com a mudança de escala usando escala logarítmica
  const handleScaleChange = (value: number | number[]) => {
    if (typeof value === "number") setScale(Math.pow(10, value));
  };

  // const handleDecreaseZoom = () => {
  //   const newScale = Math.max(scale / 1.2, 0.25);
  //   setScale(newScale);
  // };

  // const handleIncreaseZoom = () => {
  //   const newScale = Math.min(scale * 1.2, 50);
  //   setScale(newScale);
  // };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col md:flex-row gap-2 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-8 mt-2">
        <div className="flex items-center justify-items-start justify-start w-full 2xl:w-3/5 gap-2">
          <ToolButton
            tooltipInfo={t("brush.undo_event")}
            icon={<UndoOutlined />}
            onPress={handleUndoEvent}
            isActive={false}
            isDisabled={false}
          />
          <ToolButton
            tooltipInfo={t("brush.redo_event")}
            icon={<RedoOutlined />}
            onPress={handleRedoEvent}
            isActive={false}
            isDisabled={false}
          />
          <ToolButton
            tooltipInfo={t("brush.eraser")}
            icon={<DeblurOutlined />}
            onPress={toggleEraserTool}
            isActive={brushErase}
            isDisabled={false}
          />
          <ToolButton
            tooltipInfo={t("brush.clear_event")}
            icon={<CleaningServicesOutlined />}
            onPress={handleClearEvent}
            isActive={false}
            isDisabled={false}
          />
          <ToolButton
            tooltipInfo={`${brushInvertMask ? t("brush.toogle_invert_mask_on") : t("brush.toogle_invert_mask_off")}`}
            icon={brushInvertMask ? <InvertColorsOutlined /> : <InvertColorsOffOutlined />}
            onPress={toggleInvertMask}
            isActive={brushInvertMask}
            isDisabled={!brushMode}
          />
          <div className="ml-2 flex items-center justify-items-end justify-end w-full 2xl:w-[250px] gap-2">
            <Slider
              aria-label="brushSize"
              size="sm"
              color="foreground"
              value={brushSize}
              minValue={10}
              maxValue={100}
              step={10}
              onChange={handleBrushSizeChange}
              startContent={
                <ToolButton
                  tooltipInfo={t("brush.decrease_brush_size")}
                  icon={<RemoveCircleOutline />}
                  onPress={handleDecreaseBrushSize}
                  isActive={false}
                  isDisabled={!brushMode}
                />
              }
              endContent={
                <ToolButton
                  tooltipInfo={t("brush.increase_brush_size")}
                  icon={<AddCircleOutline />}
                  onPress={handleIncreaseBrushSize}
                  isActive={false}
                  isDisabled={!brushMode}
                />
              }
              className="max-w-md w-[300px]"
            />
            <p className="text-default-500 font-medium text-small p-1 flex items-center">
              {Math.round(brushSize ?? 0)}
            </p>
          </div>
        </div>

        {/* <div className="flex items-center justify-items-end justify-end w-2/3 lg:w-3/5 2xl:w-[250px] gap-2">
          <Slider
            aria-label="scale"
            size="sm"
            color="foreground"
            // Usando o log10 da escala para o slider
            value={Math.log10(scale)}
            minValue={Math.log10(0.25)}
            maxValue={Math.log10(50)}
            step={0.01}
            onChange={handleScaleChange}
            startContent={
              <ToolButton
                tooltipInfo={t("brush.decrease_zoom")}
                icon={<ZoomOut />}
                onPress={handleDecreaseZoom}
                isActive={false}
                isDisabled={!brushMode}
              />
            }
            endContent={
              <ToolButton
                tooltipInfo={t("brush.increase_zoom")}
                icon={<ZoomIn />}
                onPress={handleIncreaseZoom}
                isActive={false}
                isDisabled={!brushMode}
              />
            }
            className="max-w-md w-[300px]"
          />
          <p className="text-default-500 font-medium text-small border p-1 flex items-center rounded">
            {Math.round(scale * 100)}%
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default BrushNavButton;
