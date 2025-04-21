import { ReactLassoSelect } from "react-lasso-select";
import { useEffect } from "react";
import { useGlobalStore } from "@/stores/globalStore";
import { useFnStore } from "@/stores/fnStore";
import { useMaskStore } from "@/stores/maskStore";
import { Layer, Point } from "@/interfaces/Function";
import { generatePolygonalMaskImage } from "@/utils/image";
import { useTranslations } from "next-intl";

export default function LassoSelectTool() {
  const t = useTranslations("tools.mask");

  const { currentPoints, layers, setLayers, setCurrentPoints, invertedMask, invertImage } = useMaskStore();
  const { imgSize, setImgSize } = useGlobalStore();
  const { initialImage, selectedEngine, setMaskImage, resetMaskState } = useFnStore();

  const pointsToString = (points: Point[]): string => points.map(({ x, y }) => `${x},${y}`).join(" ");

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImgSize(img.naturalWidth, img.naturalHeight);
  };

  const handleSelectionComplete = (points: Point[]) => {
    if (points.length === 0) return;

    const newLayer: Layer = {
      title: `${t("lasso.layer")} ${Array.from(layers ?? []).length + 1}`,
      id: Date.now(),
      points,
      selected: false,
    };

    const updatedLayers = new Set(Array.from(layers ?? []).concat(newLayer));
    setLayers(updatedLayers);
    setCurrentPoints([]);
  };

  const getPolygonStyles = (layer: Layer) => {
    const baseColor = invertedMask ? "rgba(211, 211, 211, 0.8)" : "rgba(255, 0, 0, 0.5)";
    const selectedColor = "rgba(0, 255, 0, 0.5)";

    return {
      fill: layer.selected ? selectedColor : baseColor,
      stroke: layer.selected ? selectedColor : baseColor,
    };
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCurrentPoints([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCurrentPoints]);

  useEffect(() => {
    if (layers && layers.size > 0) {
      generatePolygonalMaskImage(Array.from(layers), imgSize.width, imgSize.height, async (maskBase64) => {
        if (selectedEngine === "at") {
          const invertedImage = maskBase64 ? await invertImage(maskBase64) : null;
          setMaskImage(invertedImage, invertedMask, "polygonal");
        }

        if (selectedEngine === "cf") {
          if (!invertedMask) {
            setMaskImage(maskBase64, invertedMask, "polygonal");
          } else {
            const invertedImage = maskBase64 ? await invertImage(maskBase64) : null;
            setMaskImage(invertedImage, invertedMask, "polygonal");
          }
        }
      });
    }
  }, [imgSize.height, imgSize.width, invertedMask, layers, resetMaskState, selectedEngine, setMaskImage, invertImage]);

  return (
    <div
      className={`relative flex items-center justify-center inset-0 p-0 m-0 ${
        invertedMask ? "bg-custom-red" : "bg-grayscale-100"
      }`}
    >
      <svg
        viewBox={`0 0 ${imgSize.width} ${imgSize.height}`}
        className="absolute inset-0 z-10"
        style={{
          pointerEvents: "none",
        }}
      >
        <defs>
          <filter id="hueShiftFilter" colorInterpolationFilters="sRGB">
            <feColorMatrix type="hueRotate" values="10" />
          </filter>
        </defs>

        {Array.from(layers ?? []).map((layer) => (
          <polygon
            key={layer.id}
            points={pointsToString(layer.points)}
            fill={getPolygonStyles(layer).fill}
            stroke={getPolygonStyles(layer).stroke}
            strokeWidth="1"
            filter={invertedMask ? "url(#hueShiftFilter)" : undefined}
          />
        ))}
      </svg>

      <ReactLassoSelect
        value={currentPoints}
        src={initialImage?.url || ""}
        imageStyle={{
          display: "flex",
          opacity: 0.5,
          alignContent: "center",
        }}
        onChange={setCurrentPoints}
        onComplete={handleSelectionComplete}
        onImageLoad={handleImageLoad}
      />
    </div>
  );
}
