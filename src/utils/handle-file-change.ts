/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadFile } from "./upload-file";

export async function handleFileChange(
  file: File,
  name: string,
  setImagePath: (url: string) => void,
  setFieldValue: (field: string, value: any) => void
): Promise<void> {
  try {
    const { uploadUrl, localUrl } = await uploadFile(file);

    setImagePath(localUrl);
    
    setFieldValue(name, uploadUrl);
  } catch (error) {
    console.error("Erro ao fazer upload da imagem c:", error);
    throw error;
  }
}
