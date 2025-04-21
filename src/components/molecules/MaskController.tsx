import React, { useEffect, useMemo } from "react";

import { CropFreeOutlined, PolylineOutlined, BrushOutlined } from "@mui/icons-material";
import { Switch } from "@nextui-org/react";
import { useMaskStore } from "@/stores/maskStore";

import ToolButton from "@/components/atoms/buttons/ToolButton";
import BrushNavButton from "@/components/atoms/buttons/BrushNavButton";
import LassoSelectButton from "@/components/atoms/buttons/LassoSelectButton";
import { useFnStore } from "@/stores/fnStore";
import { useTranslations } from "next-intl";

export default function MaskController({ isDisabled = true }: { isDisabled?: boolean }) {
  const t = useTranslations("tools.mask");

  const {
    initialMaskState,
    activeMask,
    brushMode,
    selectionMode,
    setBrushErase,
    setBrushInvertMask,
    setActiveMask,
    setBrushMode,
    setSelectionMode,
    setLayers,
    setInvertedMask,
    setMask,
  } = useMaskStore();

  const { fnSelected, resetMaskState } = useFnStore();

  const availableFnMask = useMemo(() => ["render", "improve-render", "insight", "brush"], []);

  useEffect(() => {
    if (!availableFnMask.includes(fnSelected)) {
      setActiveMask(false);
      setMask(initialMaskState);
      setBrushMode(false);
      setSelectionMode(false);
      setLayers(new Set());
      resetMaskState();
    }
  }, [
    fnSelected,
    availableFnMask,
    setActiveMask,
    setMask,
    initialMaskState,
    setBrushMode,
    setSelectionMode,
    setLayers,
    resetMaskState,
  ]);

  if (!availableFnMask.includes(fnSelected)) {
    return <></>;
  }

  return (
    <>
      <section className="flex flex-col items-start w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1 h-10">
            <CropFreeOutlined fontSize="small" />
            <p className="text-sm">{t("title")}</p>
            <Switch
              size="sm"
              isDisabled={isDisabled}
              className="ml-1"
              isSelected={activeMask}
              onValueChange={(active) => {
                setActiveMask(active);
                setBrushMode(true);

                if (!active) {
                  setLayers(new Set());
                  setBrushMode(false);
                  setSelectionMode(false);
                  setMask(initialMaskState);
                  resetMaskState();
                }
              }}
            />
          </div>

          {activeMask && (
            <div className="flex items-center justify-items-end justify-end gap-2">
              <ToolButton
                tooltipInfo={t("brush.mode")}
                icon={<BrushOutlined />}
                onPress={() => {
                  setBrushMode(true);
                  setSelectionMode(false);
                  setLayers(new Set());
                  setInvertedMask(false);
                  resetMaskState();
                }}
                isActive={brushMode}
                isDisabled={isDisabled}
              />

              <ToolButton
                tooltipInfo={t("lasso.mode")}
                icon={<PolylineOutlined />}
                onPress={() => {
                  setSelectionMode(true);
                  setBrushMode(false);
                  setInvertedMask(false);
                  setBrushErase(false);
                  setBrushInvertMask(false);
                  setLayers(new Set());
                  setMask(initialMaskState);
                  resetMaskState();
                }}
                isActive={selectionMode}
                isDisabled={isDisabled}
              />
            </div>
          )}
        </div>

        {activeMask && (
          <div className="flex w-full">
            {brushMode && <BrushNavButton />}
            {selectionMode && <LassoSelectButton />}
          </div>
        )}
      </section>
    </>
  );
}
