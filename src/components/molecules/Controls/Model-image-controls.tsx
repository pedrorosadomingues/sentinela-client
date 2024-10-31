import { useState } from "react";
import ToggleButton from "@/components/atoms/Toggle-button";
import { ModelImageControlsProps } from "@/interfaces/model-image-controls";
import { checkboxOptions } from "@/constants/options";

export default function ModelImageControls({
  formik,
}: ModelImageControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleControls() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="mb-5 h-full w-[30%]">
      <div
        className="flex items-center gap-[15px] hover:cursor-pointer"
        onClick={toggleControls}
      >
        <span>Model Image Controls</span>
        <ToggleButton isOpen={isOpen} onClick={toggleControls} />
      </div>
      {isOpen && (
        <div className="mt-2">
          <div className="flex flex-col gap-2">
            {checkboxOptions.map((option) => (
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
                {option.label}
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
