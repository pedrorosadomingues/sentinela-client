import { handleFileChange } from "./handle-file-change";

export async function onFileChange(
  file: File,
  name: string,
  setImagePath: (url: string) => void,
  setFieldValue: (field: string, value: string) => void
): Promise<void> {
  try {
    await handleFileChange(file, name, setImagePath, setFieldValue);
  } catch (error) {
    console.error("Erro ao fazer upload da imagem b:", error);
  }
}
