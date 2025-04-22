/* eslint-disable @typescript-eslint/no-explicit-any */

import Konva from "konva";
import { Area } from "react-easy-crop";
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

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: Area,
  modalRef: HTMLDivElement | null = null
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      let scaleX = image.naturalWidth / image.width;
      let scaleY = image.naturalHeight / image.height;

      if (
        modalRef &&
        modalRef.clientWidth <= image.width &&
        modalRef.clientHeight <= image.height
      ) {
        scaleX = image.naturalWidth / modalRef.clientWidth;
        scaleY = image.naturalHeight / modalRef.clientHeight;
      }

      const adjustedX = pixelCrop.x * scaleX;
      const adjustedY = pixelCrop.y * scaleY;
      const adjustedWidth = pixelCrop.width * scaleX;
      const adjustedHeight = pixelCrop.height * scaleY;

      canvas.width = adjustedWidth;
      canvas.height = adjustedHeight;

      ctx.drawImage(
        image,
        adjustedX,
        adjustedY,
        adjustedWidth,
        adjustedHeight,
        0,
        0,
        adjustedWidth,
        adjustedHeight
      );

      const base64Image = canvas.toDataURL("image/jpeg");
      resolve(base64Image);
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

// Função para calcular a luminosidade de uma imagem
export function getImageLuminosity(image: HTMLImageElement): Promise<number> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve(255); // Assume luminosidade clara se algo der errado

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let totalLuminosity = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const [r, g, b] = [
        imageData.data[i],
        imageData.data[i + 1],
        imageData.data[i + 2],
      ];
      const luminosity = 0.299 * r + 0.587 * g + 0.114 * b; // Fórmula de luminosidade
      totalLuminosity += luminosity;
    }

    const avgLuminosity = totalLuminosity / (imageData.data.length / 4);
    resolve(avgLuminosity);
  });
}

const resizeImageWithoutLibrary = (
  base64: string,
  originalImageSize: any,
  callback: (arg0: string) => void
) => {
  const img = new Image();
  img.src = base64;
  img.crossOrigin = "Anonymous";

  img.onload = () => {
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = originalImageSize.size.width;
    resizedCanvas.height = originalImageSize.size.height;

    const resizedCtx = resizedCanvas.getContext("2d");
    resizedCtx?.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      resizedCanvas.width,
      resizedCanvas.height
    );

    const resizedBase64 = resizedCanvas.toDataURL("image/png");
    callback(resizedBase64);
  };

  img.onerror = (error) => {
    console.error("Erro ao carregar a imagem:", error);
  };
};

export const generateBrushMaskImage = debounce(
  async (
    originalImageSize: any,
    brushLayerRef: React.RefObject<Konva.Layer>,
    callback: (base64: string) => void
  ) => {
    if (!brushLayerRef.current) {
      return;
    }

    const uri = brushLayerRef.current.toDataURL();

    if (!uri) {
      return;
    }

    const maskToolImage = new Image();
    maskToolImage.src = uri;
    maskToolImage.crossOrigin = "Anonymous";

    maskToolImage.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx !== null) {
        canvas.width = maskToolImage.width;
        canvas.height = maskToolImage.height;

        ctx.drawImage(
          maskToolImage,
          0,
          0,
          maskToolImage.width,
          maskToolImage.height
        );

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // If pixel is transparent
          if (data[i + 3] === 0) {
            // Change transparent parts to black
            data[i] = 0; // Red
            data[i + 1] = 0; // Green
            data[i + 2] = 0; // Blue
            data[i + 3] = 255; // Alpha (Opaque)
          } else {
            // Change non-transparent parts to white
            data[i] = 255; // Red
            data[i + 1] = 255; // Green
            data[i + 2] = 255; // Blue
            data[i + 3] = 255; // Alpha (Opaque)
          }
        }

        // Put the modified image data back to canvas
        ctx.putImageData(imageData, 0, 0);

        const uri = canvas.toDataURL("image/png");

        resizeImageWithoutLibrary(uri, originalImageSize, (resizedUri) => {
          callback(resizedUri);
        });
      }
    };
  },
  500
);

export const generatePolygonalMaskImage = debounce(
  (
    layers: any,
    imgWidth: number,
    imgHeight: number,
    callback: (base64: string) => void
  ) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = imgWidth;
    canvas.height = imgHeight;
    ctx.clearRect(0, 0, imgWidth, imgHeight);

    const backgroundColor = "white";

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, imgWidth, imgHeight);

    layers?.forEach((layer: { points: { x: number; y: number }[] }) => {
      const polygonColor = "black";

      ctx.fillStyle = polygonColor;
      ctx.beginPath();
      ctx.moveTo(layer.points[0].x, layer.points[0].y);
      layer.points.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.closePath();
      ctx.fill();
    });

    const base64 = canvas.toDataURL("image/png", 0.8);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    callback(base64);
  },
  500
);

export const validateImageSize = (width: number) => {
  if (width < 100) {
    return false;
  }
  return true;
};
