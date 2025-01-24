/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { extractFileName } from "@/utils/extract-filename";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { createDownloadImage } from "@/services/download-image/create";

export default function DownloadButton({ generation }: { generation: any }) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  async function fetchDownloadUrl() {
    const fileName = extractFileName(generation.path);
    const token = localStorage.getItem("token");

    setIsDownloading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}/download/${fileName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.downloadUrl) {
        // Faz o download diretamente sem abrir outra aba
        const downloadResponse = await fetch(data.downloadUrl);
        const blob = await downloadResponse.blob();
        const blobUrl = URL.createObjectURL(blob);

        // Criar link invisível e simular clique para iniciar o download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName + "_vestiq"; // Nome do arquivo
        document.body.appendChild(link);
        link.click();

        // Remover o link após o download
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        // Chama o serviço para registrar o download
        createDownloadImage({
          generation_id: generation.id,
          user_id: generation.user_id,
        });
      }
    } catch (error) {
      console.error("Erro ao obter URL de download:", error);
    } finally {
      // Habilita o botão novamente, seja sucesso ou erro
      setIsDownloading(false);
    }
  }

  return (
    <button
      onClick={fetchDownloadUrl}
      disabled={isDownloading} // desativa enquanto isDownloading for true
      className={`bg-blue-700 text-white rounded-md ${
        isDownloading ? "cursor-not-allowed" : "hover:bg-blue-800"
      }`}
    >
      <FileDownloadIcon className="bg-blue-700 rounded" />
    </button>
  );
}
