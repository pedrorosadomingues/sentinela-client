/* eslint-disable @typescript-eslint/no-unused-vars */
import { createGeneration } from "@/services";
import { FormValues, } from "@/interfaces/generation";
import { updateCoins } from "./update-coins";
import { useDressModelStore } from "@/zustand-stores/dressModelStore";
import { uploadFile } from "./upload-file";
import { base64ToFile } from "./image";
import { ToastFunction } from "@/hooks/useToast";

export async function handleSubmit(
  values: FormValues,
  toast: ToastFunction
): Promise<void> {
  const { currentGeneration, setImagesLoading, setCurrentResultImage } = useDressModelStore.getState();
  setImagesLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const modelFile = base64ToFile(currentGeneration.model!, "model.png");
    const garmentFile = base64ToFile(currentGeneration.garment!, "garment.png");

    const [modelUpload, garmentUpload] = await Promise.all([
      uploadFile(modelFile, token),
      uploadFile(garmentFile, token),
    ]);

    // URLs dos arquivos enviados
    const modelImageUrl = modelUpload.uploadUrl;
    const garmentImageUrl = garmentUpload.uploadUrl;

    const payload = {
      ...values,
      model_image: modelImageUrl,
      garment_image: garmentImageUrl,
    };

    const response = await createGeneration(payload);
    const { data: result_image_path } = response;

    if (response.status === 200) {
      await updateCoins();

      setCurrentResultImage(result_image_path);
    } else {
      toast("error", JSON.stringify(response));
    }
  } catch (error) {
    toast("error", "Erro inesperado");
  } finally {
    setImagesLoading(false);
  }
}
