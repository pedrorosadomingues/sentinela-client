export async function uploadFile(
  file: File,
  token: string
): Promise<{ uploadUrl: string; localUrl: string }> {
  try {
    const file_name = file.name;
    const file_type = file.type;

    const formData = new FormData();
    formData.append("file", file);

    const queryParams = new URLSearchParams({
      file_name,
      file_type,
    }).toString();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL}upload/generate-presigned-url?${queryParams}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao obter pre-signed URL");
    }

    const data = await response.json();
    const { uploadUrl }: { uploadUrl: string } = data;

    const localUrl = URL.createObjectURL(file);

    return { uploadUrl, localUrl };
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    throw error;
  }
}
