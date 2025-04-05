/**
 * Interface para a função de conversão de URL para Base64
 */
export interface UrlToBase64 {
  /**
   * Converte uma URL de imagem para uma string Base64
   * @param imageUrl URL da imagem a ser convertida
   * @returns Promise<string> Uma Promise que resolve para a string Base64 da imagem
   */
  (imageUrl: string): Promise<string>;
}

/**
 * Interface para a função de conversão de Base64 para File
 */
export interface Base64ToFile {
  /**
   * Converte uma string Base64 para um arquivo do tipo File
   * @param base64 A string Base64 da imagem
   * @param filename O nome do arquivo resultante
   * @returns File O objeto `File` gerado a partir do Base64
   */
  (base64: string, filename: string): File;
}

/**
 * Função que converte uma URL de imagem para Base64
 * @param imageUrl URL da imagem
 * @returns Promise<string> Promise com o Base64 da imagem
 */
export const urlToBase64: UrlToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  } catch (error) {
    console.error("Erro ao converter URL para Base64:", error);
    throw error;
  }
};

/**
 * Função que converte uma string Base64 para um objeto File
 * @param base64 A string Base64 da imagem
 * @param filename O nome do arquivo resultante
 * @returns File O objeto `File` gerado a partir do Base64
 */
export const base64ToFile: Base64ToFile = (base64, filename) => {
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png"; // Padrão PNG se não encontrar
  const byteString = atob(arr[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], filename, { type: mime });
};

export const validateImageSize = (width: number) => {
  if (width < 100) {
    return false;
  }
  return true;
};
