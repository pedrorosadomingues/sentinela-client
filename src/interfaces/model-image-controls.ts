export interface ModelImageControlsProps {
    formik: {
      values: {
        cover_feet: boolean;
        adjust_hands: boolean;
        restore_background: boolean;
        restore_clothes: boolean;
      };
      setFieldValue: (field: string, value: boolean) => void;
    };
  }
  