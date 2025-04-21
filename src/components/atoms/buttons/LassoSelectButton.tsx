import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import ToolButton from "./ToolButton";

import { DeleteOutline, InvertColorsOffOutlined, InvertColorsOutlined, LayersClearOutlined } from "@mui/icons-material";

import { useMaskStore } from "@/stores/maskStore";
import { useFnStore } from "@/stores/fnStore";
import { useTranslations } from "next-intl";

export default function LassoSelectButton() {
  const t = useTranslations("tools.mask");

  const { setInvertedMask, selectedLayerId, setSelectedLayerId, layers, setLayers, removeLayer, invertedMask } =
    useMaskStore();

  const { resetMaskState } = useFnStore();

  const handleLayerSelection = (layerId: string) => {
    const layerIdNumber = parseInt(layerId, 10);
    setSelectedLayerId(layerIdNumber);

    if (layers) {
      const updatedLayers = Array.from(layers).map((layer) =>
        layer.id === layerIdNumber ? { ...layer, selected: true } : { ...layer, selected: false }
      );
      setLayers(new Set(updatedLayers));
    }
  };

  const handleDeleteLayer = () => {
    if (selectedLayerId === null) return;

    removeLayer(selectedLayerId);
    setSelectedLayerId(null);

    const updatedLayers = Array.from(layers ?? []).filter((layer) => layer.id !== selectedLayerId);
    setLayers(new Set(updatedLayers));

    if (updatedLayers.length === 0) resetMaskState();
  };

  const handleResetMaskAndLayers = () => {
    resetMaskState();
    setLayers(new Set());
    setInvertedMask(false);
  };

  const handleInvertMask = () => {
    setInvertedMask(!invertedMask);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="max-w-xs flex gap-2 items-center mt-2">
        <Select
          size="sm"
          aria-label={t("lasso.label")}
          placeholder={t("lasso.label")}
          value={selectedLayerId === null ? undefined : String(selectedLayerId)}
          onChange={({ target }) => handleLayerSelection(target.value)}
          selectedKeys={selectedLayerId !== null && !isNaN(selectedLayerId) ? [String(selectedLayerId)] : []}
          disabled={selectedLayerId === null}
        >
          {Array.from(layers ?? []).map((layer) => (
            <SelectItem key={String(layer.id)} value={String(layer.id)}>
              {layer.title}
            </SelectItem>
          ))}
        </Select>

        <ToolButton
          tooltipInfo={t("lasso.delete_layer")}
          icon={<DeleteOutline />}
          onPress={handleDeleteLayer}
          isActive={false}
          isDisabled={layers && layers.size > 0 && selectedLayerId ? false : true}
        />

        <ToolButton
          tooltipInfo={t("lasso.reset_layers")}
          icon={<LayersClearOutlined />}
          onPress={handleResetMaskAndLayers}
          isActive={false}
          isDisabled={!(layers ? layers.size > 0 : true)}
        />

        <ToolButton
          tooltipInfo={`${invertedMask ? t("lasso.toogle_invert_mask_on") : t("lasso.toogle_invert_mask_off")}`}
          icon={invertedMask ? <InvertColorsOutlined /> : <InvertColorsOffOutlined />}
          onPress={handleInvertMask}
          isActive={false}
          isDisabled={!(layers ? layers.size > 0 : true)}
        />
      </div>
    </div>
  );
}
