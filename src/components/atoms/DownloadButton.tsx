import { extractFileName } from "@/utils/extract-filename";

export default function DownloadButton({ path }: { path: string }) {
  async function fetchDownloadUrl() {
    const fileName = extractFileName(path);
    const token = localStorage.getItem("token");

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
        console.log("Download URL:", data.downloadUrl);

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
      }
    } catch (error) {
      console.error("Erro ao obter URL de download:", error);
    }
  }

  return (
    <button
      onClick={fetchDownloadUrl}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      Baixar Imagem
    </button>
  );
}
