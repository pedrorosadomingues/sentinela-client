import { useState } from "react";
import ToggleButton from "../atoms/Toggle-button";
import { ModelImageControlsProps } from "@/interfaces/model-image-controls";

export default function ModelImageControls({
  formik,
}: ModelImageControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleControls() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="mb-5 h-full w-[26%]">
      <div className="flex items-center justify-between">
        <span>Model Image Controls</span>
        <ToggleButton isOpen={isOpen} onClick={toggleControls} />
      </div>
      {isOpen && (
        <div className="mt-2">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formik.values.cover_feet}
                onChange={() =>
                  formik.setFieldValue("cover_feet", !formik.values.cover_feet)
                }
              />
              Cover Feet
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formik.values.adjust_hands}
                onChange={() =>
                  formik.setFieldValue(
                    "adjust_hands",
                    !formik.values.adjust_hands
                  )
                }
              />
              Adjust Hands
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formik.values.restore_background}
                onChange={() =>
                  formik.setFieldValue(
                    "restore_background",
                    !formik.values.restore_background
                  )
                }
              />
              Restore Background
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formik.values.restore_clothes}
                onChange={() =>
                  formik.setFieldValue(
                    "restore_clothes",
                    !formik.values.restore_clothes
                  )
                }
              />
              Restore Clothes
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
