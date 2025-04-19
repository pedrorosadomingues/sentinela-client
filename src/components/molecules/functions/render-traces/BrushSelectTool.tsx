/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Line, Rect, Image } from "react-konva";
import { useFnStore } from "@/stores/fnStore";
import Konva from "konva";
import { useMaskStore } from "@/stores/maskStore";
import { KonvaEventObject } from "konva/lib/Node";
import { BrushHistoryItem } from "@/interfaces/Function";
import { generateBrushMaskImage } from "@/utils/image";
import svgCursor from "@/utils/svgCursor";

export default function BrushSelectTool() {
  const {
    scale,
    brushSize = 5,
    clearBrushTool,
    undoEvent,
    redoEvent,
    brushErase,
    brushInvertMask,
    mask,
    updateMask,
    invertImage,
    setClearBrushTool,
    setUndoEvent,
    setRedoEvent,
    imageContainerDimensions,
  } = useMaskStore();

  const { initialImage, selectedEngine, maskImage, setMaskImage, resetMaskState } = useFnStore();

  const stageRef = useRef<Konva.Stage | null>(null);
  const isDrawing = useRef<boolean>(false);
  const backgroundImageRef = useRef<Konva.Layer | null>(null);
  const brushLayerRef = useRef<Konva.Layer | null>(null);

  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [imageObj, setImageObj] = useState<HTMLImageElement | undefined>(undefined);

  const canvasSize = {
    width: imageContainerDimensions.width ?? 0,
    height: imageContainerDimensions.height ?? 0,
  };

  useEffect(() => {
    const image = new window.Image();
    image.src = initialImage?.url ?? "";
    image.onload = () => {
      setImageObj(image);
    };
  }, []);

  // Estado local para armazenar as linhas desenhadas
  const [localLinesDraw, setLocalLinesDraw] = useState<any>([]);

  // Sincronizar localLinesDraw com mask.linesDraw ao montar o componente
  useEffect(() => {
    setLocalLinesDraw(mask.linesDraw);
  }, [mask.linesDraw]);

  // Ajuste do tamanho do brush
  const adjustedBrushSize = (brushSize ?? 0) * scale;
  const brushRadius = adjustedBrushSize / 2;
  const cursor = svgCursor(adjustedBrushSize, brushRadius);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) {
      e.evt.preventDefault();
      return;
    }

    if (isSpacePressed) return;

    isDrawing.current = true;
    const pos = e.target.getStage()?.getRelativePointerPosition();

    if (pos) {
      setLocalLinesDraw((prevLines: any) => [
        ...prevLines,
        {
          tool: mask.tool,
          points: [
            pos.x / canvasSize.width,
            pos.y / canvasSize.height,
            pos.x / canvasSize.width,
            pos.y / canvasSize.height,
          ],
          brushSize: adjustedBrushSize / canvasSize.width,
        },
      ]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage?.getRelativePointerPosition();

    if (!stage || !point) {
      return;
    }

    setLocalLinesDraw((prevLines: string | any[]) => {
      const lastLineIndex = prevLines.length - 1;
      const lastLine = prevLines[lastLineIndex];

      if (lastLine && (lastLine.tool === "pen" || lastLine.tool === "eraser")) {
        const newPoints = lastLine.points.concat([point.x / canvasSize.width, point.y / canvasSize.height]);

        const updatedLine = {
          ...lastLine,
          points: newPoints,
        };

        const newLines = [...prevLines as any];
        newLines[lastLineIndex] = updatedLine;

        return newLines;
      }

      return prevLines;
    });
  };

  const handleMouseUp = async () => {
    isDrawing.current = false;

    updateMask((prev) => ({
      ...prev,
      linesDraw: localLinesDraw,
      historyDraw: localLinesDraw,
      historyDrawStep: prev.historyDrawStep + 1,
    }));
  };

  const handleMouseEnter = (e: any) => {
    if (!mask.tool) {
      return;
    }

    if (adjustedBrushSize) {
      const container = e.target.getStage().getContainer();
      container.style.cursor = cursor;
    }
  };

  const handleMouseLeave = (e: any) => {
    const container = e.target.getStage().getContainer();
    container.style.cursor = "default";
    setIsSpacePressed(false);
    isDrawing.current = false;
  };

  const updateHistoryDrawStep = useCallback(
    (newStep: number, newLines: BrushHistoryItem[]) => {
      updateMask((prev) => ({
        ...prev,
        historyDrawStep: newStep,
        linesDraw: newLines,
      }));
      // Atualiza também o localLinesDraw
      setLocalLinesDraw(newLines);
    },
    [updateMask]
  );

  const handleUndo = useCallback(() => {
    if (mask.historyDrawStep > 0) {
      const newStep = mask.historyDrawStep - 1;
      const newLines = mask.historyDraw.slice(0, newStep);
      updateHistoryDrawStep(newStep, newLines);
    }
    setUndoEvent(false); // Garante que o evento seja resetado
  }, [mask.historyDrawStep, mask.historyDraw, updateHistoryDrawStep, setUndoEvent]);

  const handleRedo = useCallback(() => {
    if (mask.historyDrawStep < mask.historyDraw.length) {
      const newStep = mask.historyDrawStep + 1;
      const newLines = mask.historyDraw.slice(0, newStep);
      updateHistoryDrawStep(newStep, newLines);
    }

    setRedoEvent(false);
  }, [mask.historyDrawStep, mask.historyDraw, updateHistoryDrawStep, setRedoEvent]);

  const handleClear = useCallback(() => {
    if (localLinesDraw.at(-1)?.tool !== "clear") {
      const newLinesDraw: any = [];
      const newHistoryDraw: any = [...mask.historyDraw, { tool: "clear" }];

      updateMask((prev) => ({
        ...prev,
        linesDraw: newLinesDraw,
        historyDraw: newHistoryDraw,
        historyDrawStep: prev.historyDrawStep + 1,
      }));

      setLocalLinesDraw(newLinesDraw);
      resetMaskState();
    }

    setClearBrushTool(false);
  }, [localLinesDraw, mask.historyDraw, setClearBrushTool, updateMask]);

  const updateTool = useCallback(() => {
    updateMask((prev) => {
      const isInverted = brushInvertMask;
      const tool = brushErase ? "eraser" : "pen";
      if (prev.isInverted !== isInverted || prev.tool !== tool) {
        return { ...prev, isInverted, tool };
      }
      return prev;
    });
  }, [brushErase, brushInvertMask, updateMask]);

  useEffect(() => {
    if (undoEvent) {
      handleUndo();
    } else if (redoEvent) {
      handleRedo();
    } else if (clearBrushTool) {
      handleClear();
    } else {
      updateTool();
    }
  }, [handleUndo, handleRedo, handleClear, updateTool, undoEvent, redoEvent, clearBrushTool]);

  useEffect(() => {
    setMaskImage(maskImage.url, brushInvertMask, maskImage.maskType);
  }, [brushInvertMask, maskImage.maskType, maskImage.url, setMaskImage]);

  useEffect(() => {
    if (!brushLayerRef.current) return;

    if (localLinesDraw.length > 0) {
      generateBrushMaskImage(initialImage, brushLayerRef, async (maskBase64: string | null) => {
        if (selectedEngine === "at") {
          setMaskImage(maskBase64, mask.isInverted, "brush");
        }

        if (selectedEngine === "cf") {
          if (mask.isInverted) {
            setMaskImage(maskBase64, mask.isInverted, "brush");
          } else {
            const invertedImage = maskBase64 ? await invertImage(maskBase64) : null;
            setMaskImage(invertedImage, mask.isInverted, "brush");
          }
        }
      });
    }
  }, [mask.isInverted, localLinesDraw]);

  useEffect(() => {
    if (stageRef.current) {
      const container = stageRef.current.getStage().container();
      const canvases = container.getElementsByTagName("canvas");

      if (canvases.length > 1) {
        canvases[1].classList.toggle("inverted-canvas", mask.isInverted);
      }
    }
  }, [mask.isInverted]);

  return (
    <>
      <div className="z-[2] brushTool w-full flex justify-center items-center">
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          ref={stageRef}
          onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
            if (!mask.tool) {
              return;
            }
            handleMouseDown(e);
          }}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Layer name={"backgroundImage"} ref={backgroundImageRef} listening={false} draggable={false}>
            <Image image={imageObj} x={0} y={0} draggable={false} width={canvasSize.width} height={canvasSize.height} />
          </Layer>

          <Layer name={"brushLayer"} ref={brushLayerRef}>
            {localLinesDraw.map((line: { tool: string; points: any[]; brushSize: number }, i: any) => {
              if (line.tool == "pen" || line.tool == "eraser") {
                return (
                  <Line
                    key={`brush-history-${i}`}
                    points={line.points.map((p: number, i: number) =>
                      i % 2 == 0 ? p * canvasSize.width : p * canvasSize.height
                    )}
                    stroke="#000"
                    strokeWidth={line.brushSize * canvasSize.width}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
                  />
                );
              }

              if (line.tool == "clear") {
                return (
                  <Rect
                    key={`brush-history-${i}`}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    x={0}
                    y={0}
                    globalCompositeOperation={"destination-out"}
                    fill="#fff"
                  />
                );
              }
            })}
          </Layer>
        </Stage>
      </div>
    </>
  );
}
