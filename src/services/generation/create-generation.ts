import api from "@/config/server";
import httpStatus from "http-status";

interface CreateGenerationParams {
  category: string;
  model_image: string;
  garment_image: string;
  fn: string;
}

interface CreateGenerationResponse {
  status: number;
  data?: any;
  message?: any;
}

export async function createGeneration({
  category,
  model_image,
  garment_image,
  fn,
}: CreateGenerationParams): Promise<CreateGenerationResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        status: httpStatus.UNAUTHORIZED,
        message: "Unauthorized",
      };
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.post(
      "/generation",
      {
        category,
        model_image,
        garment_image,
        fn,
      },
      config
    );
    return {
      status: httpStatus.OK,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data || "Unknown error",
      };
    } else {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Server connection error",
      };
    }
  }
}
