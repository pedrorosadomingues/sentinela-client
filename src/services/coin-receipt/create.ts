/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";
import { CreateCoinReceiptBody, CoinReceiptResponse } from "@/interfaces";

export async function createCoinReceiptService(
  createCoinReceiptBody: CreateCoinReceiptBody
): Promise<CoinReceiptResponse> {
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
    const response = await api.post("/coin-receipt", createCoinReceiptBody, config);
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
