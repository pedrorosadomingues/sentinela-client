import { useState } from "react";
import ToggleButton from "@/components/atoms/Toggle-button";
import { SamplingControlsProps } from "@/interfaces/sampling-controls";

export default function SamplingControls({ formik }: SamplingControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleControls() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="mb-5 h-full w-[100%]">
      <div className="flex items-center justify-between">
        <span>Sampling Controls</span>
        <ToggleButton isOpen={isOpen} onClick={toggleControls} />
      </div>
      {isOpen && (
        <div className="mt-2">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span>Guidance Scale</span>
              <div className="control-section">
                <input
                  type="range"
                  min="1.5"
                  max="5"
                  step="0.1"
                  value={formik.values.guidance_scale}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "guidance_scale",
                      parseFloat(e.target.value)
                    )
                  }
                />
                <span>{formik.values.guidance_scale}</span>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span>Timesteps</span>
              <div className="control-section">
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="1"
                  value={formik.values.timesteps}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "timesteps",
                      parseInt(e.target.value, 10)
                    )
                  }
                />
                <span>{formik.values.timesteps}</span>
              </div>
            </label>

            <label className="flex flex-col gap-1">
              <span>Seed</span>
              <input
                type="number"
                value={formik.values.seed}
                onChange={(e) =>
                  formik.setFieldValue("seed", parseInt(e.target.value, 10))
                }
              />
            </label>

            {/* <label className="flex flex-col gap-1">
              <span>Number of Samples</span>
              <div className="control-section">
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={formik.values.num_samples}
                  onChange={(e) =>
                    formik.setFieldValue("num_samples", parseInt(e.target.value, 10))
                  }
                />
                <span>{formik.values.num_samples}</span>
              </div>
            </label> 
            */}
          </div>
        </div>
      )}
      <style jsx>{`
        input[type="range"] {
          width: 100%;
        }

        input[type="number"] {
          width: 65px;
          padding: 0.5rem;
          border: 1px solid #ccc;
        }

        span {
          font-size: 0.875rem;
        }

        .control-section {
          display: flex;
          gap: 28px;
        }
      `}</style>
    </div>
  );
}
