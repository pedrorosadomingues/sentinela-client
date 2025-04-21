/* eslint-disable @typescript-eslint/no-explicit-any */
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {axiosClient} from "@/lib/axios/axiosClient";

interface DownloadFile {
  url: string;
  name?: string;
}

interface DownloadOptions {
  filename?: string;
  asZip?: boolean;
  onProgress?: (progress: { loaded: number; total: number; percent: number }) => void;
}

/**
 * Remove a URL base e retorna apenas o caminho do arquivo no bucket S3/R2.
 */
const getFilePathFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // 🔥 Remove o "/" inicial
  } catch (error: any) {
    console.error("Erro ao converter URL:", error);
    return url; // Caso não seja uma URL, retorna o caminho original
  }
};

/**
 * Faz o download de um ou vários arquivos, chamando a API do Next.js para obter Signed URLs via Axios.
 * Agora envia todos os `filePaths` em uma única requisição para melhorar a eficiência.
 * @param {string[]} urls - Lista de caminhos no S3/R2.
 * @param {DownloadOptions} options - Nome do arquivo, ZIP e progresso.
 */
export const downloadFiles = async (
  urls: string[],
  options: DownloadOptions = { filename: "download", asZip: false }
): Promise<void> => {
  if (!urls || urls.length === 0) {
    throw new Error("Nenhum arquivo disponível para download.");
  }

  try {
    // 🔥 Convertemos todas as URLs para os caminhos do S3/R2 antes de enviar à API
    const filePaths = urls.map(getFilePathFromUrl);

    // 🔥 Chamada ÚNICA para a API do Next.js, enviando TODOS os paths de uma só vez
    const response = await axiosClient.post("/api/image/temp-url", { filePaths });

    if (!response.data.signedUrls) {
      throw new Error("Erro ao obter Signed URLs.");
    }

    // 🔥 Agora temos todas as Signed URLs de uma só vez
    const signedUrls = response.data.signedUrls.map((signedUrl: string, index: number) => ({
      originalPath: urls[index],
      signedUrl,
    }));

    const files: DownloadFile[] = signedUrls.map(({ signedUrl, originalPath }: { signedUrl: string; originalPath: string }) => {
      const fileNameFromUrl = originalPath.split("/").pop() || `file-${Math.random()}`;
      return { url: signedUrl, name: fileNameFromUrl };
    });

    const totalSize = 0;

    if (options.onProgress) {
      options.onProgress({ loaded: 0, total: 100, percent: 0 }); // ⏳ 0% - Iniciando...
    }

    if (options.asZip && files.length > 1) {
      const zip = new JSZip();

      await Promise.all(
        files.map(async (file) => {
          if (options.onProgress) {
            options.onProgress({ loaded: 0, total: 100, percent: 10 + Math.random() * 10 }); // ⏳ 10%-20% - Obtendo URL
          }

          const response = await axiosClient.get(file.url, { responseType: "blob" });
          if (response.status !== 200) {
            throw new Error(`Erro ao baixar o arquivo: ${file.name}`);
          }

          if (options.onProgress) {
            options.onProgress({ loaded: 0, total: 100, percent: 20 + Math.random() * 10 }); // ⏳ 20%-30% - Conectando
          }

          zip.file(file.name!, response.data);
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });

      saveAs(zipBlob, `${options.filename || "download"}.zip`);

      if (options.onProgress) {
        options.onProgress({ loaded: totalSize, total: totalSize, percent: 100 }); // ✅ 100% Concluído
      }
    } else {
      const file = files[0];

      if (options.onProgress) {
        options.onProgress({ loaded: 0, total: 100, percent: 10 + Math.random() * 10 }); // ⏳ 10%-20% - Obtendo URL
      }

      const response = await axiosClient.get(file.url, { responseType: "blob" });
      if (response.status !== 200) {
        throw new Error(`Erro ao baixar o arquivo: ${file.name}`);
      }

      if (options.onProgress) {
        options.onProgress({ loaded: 0, total: 100, percent: 20 + Math.random() * 10 }); // ⏳ 20%-30% - Conectando
      }

      saveAs(response.data, file.name || `${options.filename}.png`);

      if (options.onProgress) {
        options.onProgress({ loaded: 100, total: 100, percent: 100 }); // ✅ 100% Concluído
      }
    }
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    throw new Error(`Erro ao realizar o download: ${errorMessage}`);
  }
};
