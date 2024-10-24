/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import { ErrorResponse } from "@/interfaces";

export async function createPresignedUrl(
  key: string,
  type: string
): Promise<string | ErrorResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return "Unauthorized";
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.post(
      "/aws/generate-presigned-url",
      {
        key,
        type,
      },
      config
    );
    return response.data.url;
  } catch (error: any) {
    return error as ErrorResponse;
  }
}
