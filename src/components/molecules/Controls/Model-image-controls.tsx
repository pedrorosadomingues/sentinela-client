import { useState } from "react";
import ToggleButton from "@/components/atoms/Toggle-button";
import { ModelImageControlsProps } from "@/interfaces/model-image-controls";
import { CHECKBOX_OPTIONS } from "@/constants/options";
import { useTranslations } from "next-intl";

export default function ModelImageControls({
  formik,
}: ModelImageControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const text = useTranslations("model_image_controls");

  function toggleControls() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="mb-5 h-full w-[30%]">
      <div
        className="flex items-center gap-[15px] hover:cursor-pointer"
        onClick={toggleControls}
      >
        <span>{text("title")}</span>
        <ToggleButton isOpen={isOpen} onClick={toggleControls} />
      </div>
      {isOpen && (
        <div className="mt-2">
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
              </label>
            ))}
          </div>
        </div>
      )}
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
