import { createGeneration } from "@/services";
import { FormValues } from "@/interfaces/generation";

export async function handleSubmit(
  values: FormValues,
  setIsLoading: (loading: boolean) => void,
  setResultImagePath: (path: string) => void
): Promise<void> {
  const payload = {
    category: values.category,
    model_image: values.model_image,
    garment_image: values.garment_image,
    fn: values.fn,
    cover_feet: values.cover_feet,
    adjust_hands: values.adjust_hands,
    restore_clothes: values.restore_clothes,
    guidance_scale: values.guidance_scale,
    timesteps: values.timesteps,
    seed: values.seed,
    num_samples: values.num_samples,
    garment_photo_type: values.garment_photo_type,
  };

  setIsLoading(true);

  try {
    const response = await createGeneration(payload);

    const { data: result_image_path } = response;

    if (response.status === 200) {
      setResultImagePath(result_image_path);
    } else {
      alert("Error: " + JSON.stringify(response));
    }
  } catch (error) {
    console.log("Erro inesperado:", error);
  } finally {
    setIsLoading(false);
  }
}
