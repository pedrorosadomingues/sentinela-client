import { handleFileChange } from "./handle-file-change";

export async function onFileChange(
  file: File,
  name: string,
  setImagePath: (url: string) => void,
  setFieldValue: (field: string, value: string) => void
): Promise<void> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    await handleFileChange(file, name, token, setImagePath, setFieldValue);
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
  }
}
