import { useState } from "react";
import ToggleButton from "@/components/atoms/ToggleButton";
import { ModelImageControlsProps } from "@/interfaces/model-image-controls";
import { CHECKBOX_OPTIONS } from "@/constants/options";
import { useTranslations } from "next-intl";
import ToolInfo from "@/components/atoms/ToolInfo";

export default function ModelImageControls({
  formik,
}: ModelImageControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const text = useTranslations("model_image_controls");

  function toggleControls() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="mb-5 h-full w-[320px]">
      <div
        className="flex items-center justify-start gap-[5px] w-full hover:cursor-pointer"
        onClick={toggleControls}
      >
        <span style={{ fontSize: "16px" }}>{text("title")}</span>
        <ToggleButton isOpen={isOpen} onClick={toggleControls} />
      </div>
      <div
        className={`mt-2 overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2">
          {CHECKBOX_OPTIONS.map((option) => (
            <label key={option.name} className="control-section">
              <input
                type="checkbox"
                checked={formik.values[option.name] as boolean}
                onChange={() =>
                  formik.setFieldValue(
                    option.name,
                    !(formik.values[option.name] as boolean)
                  )
                }
              />
              {text(`options.${option.name}`)}

              <ToolInfo
                title="lorem ipsum dolor"
                text="lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
                video="https://redrawacademy.s3.sa-east-1.amazonaws.com/videos/tutorial/suggestions.mp4"
                href="https://academy.arch.redraw.pro/"
              />
            </label>
          ))}
        </div>
      </div>

      <style jsx>{`
        span {
          font-size: 0.875rem;
        }
        .control-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
        }

        input[type="checkbox"]:checked {
          background-color: #2563eb;
        }
      `}</style>
    </div>
  );
}
