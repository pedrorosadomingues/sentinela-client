/**
 * Faz o upload de um arquivo e retorna a URL assinada para upload.
 * @param {File} file - O arquivo a ser enviado.
 * @returns {Promise<{ uploadUrl: string; localUrl: string }>} - URLs para upload e visualização local.
 */
export async function uploadFile(file: File): Promise<{ uploadUrl: string; localUrl: string }> {
  try {
    // 🔹 Obtém o token dos cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("vq-access-token="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("Token não encontrado nos cookies.");
    }

    const file_name = file.name;
    const file_type = file.type;

    // 🔹 Criamos um FormData para enviar o arquivo
    const formData = new FormData();
    formData.append("file", file);

    // 🔹 Criamos os parâmetros da query string
    const queryParams = new URLSearchParams({ file_name, file_type }).toString();

    // 🔹 Pegamos a URL da API definida no `.env`
    const apiBaseUrl = `https://${process.env.NEXT_PUBLIC_API_BASE_URL}`;
    if (!apiBaseUrl) {
      throw new Error("A variável de ambiente NEXT_PUBLIC_API_BASE_URL não está definida.");
    }

    const absoluteUrl = new URL(`/upload/generate-presigned-url?${queryParams}`, apiBaseUrl).href;

    console.log("🌍 URL Final da Requisição:", absoluteUrl); // Depuração para confirmar a URL correta

    // 🔹 Fazendo a requisição para obter a pre-signed URL
    const response = await fetch(absoluteUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // 🔹 Enviamos o FormData no body, como no código original
    });

    if (!response.ok) {
      throw new Error("Erro ao obter pre-signed URL da API.");
    }

    const data = await response.json();
    const { uploadUrl }: { uploadUrl: string } = data;

    console.log("✅ Pre-signed URL recebida:", uploadUrl);

    // 🔹 Criamos uma URL local para preview do arquivo
    const localUrl = URL.createObjectURL(file);

    return { uploadUrl, localUrl };
  } catch (error) {
    console.error("🚨 Erro ao fazer upload da imagem:", error);
    throw error;
  }
}
