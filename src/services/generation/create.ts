/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";
import { CreateGenerationBody, CreateGenerationResponse } from "@/interfaces";

export async function createGeneration(
  createGenerationBody: CreateGenerationBody
): Promise<CreateGenerationResponse> {
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

  try {
    const response = await api.post("/generation", createGenerationBody, config);

    return {
      status: httpStatus.OK,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    if (error.response) {
      return {
        status: error.status,
        message: error.response.data.error || "Unknown error",
      };
    } else {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Server connection error",
      };
    }
  }
}
