/* eslint-disable @typescript-eslint/no-unused-vars */
import { createGeneration } from "@/services";
import { FormValues, } from "@/interfaces/generation";
import { updateCoins } from "./update-coins";
import { useDressModelStore } from "@/stores/dressModelStore";
import { uploadFile } from "./upload-file";
import { base64ToFile } from "./image";
import { ToastFunction } from "@/hooks/useToast";
import { useUserStore } from "@/stores";
import { v4 as uuidv4 } from 'uuid';

export async function handleSubmit(
  values: FormValues,
  toast: ToastFunction
): Promise<void> {
  const { currentGeneration, setImagesLoading, setCurrentResultImage } = useDressModelStore.getState();
  const { user } = useUserStore.getState();

  setImagesLoading(true);

  try {
    const modelUuid = uuidv4();
    const garmentUuid = uuidv4();

    const modelFileName = `${user?.id}/${modelUuid}_model.jpg`;
    const garmentFileName = `${user?.id}/${garmentUuid}_garment.jpg`;

    const modelFile = base64ToFile(currentGeneration.model!, modelFileName);
    const garmentFile = base64ToFile(currentGeneration.garment!, garmentFileName);

    const [modelUpload, garmentUpload] = await Promise.all([
      uploadFile(modelFile),
      uploadFile(garmentFile),
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
