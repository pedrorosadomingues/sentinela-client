export interface SamplingControlsProps {
    formik: {
      values: {
        guidance_scale: number;
        timesteps: number;
        seed: number;
        num_samples: number;
      };
      setFieldValue: (field: string, value: number) => void;
    };
  }
  