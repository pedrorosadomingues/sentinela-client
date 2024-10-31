export interface ModelImageControlsFormValues {
  cover_feet: boolean;
  adjust_hands: boolean;
  restore_background: boolean;
  restore_clothes: boolean;
}

export interface ModelImageControlsProps {
  formik: {
    values: ModelImageControlsFormValues;
    setFieldValue: (field: string, value: boolean) => void;
  };
}
