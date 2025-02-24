/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { CreateCoinReceiptBody, CoinReceiptResponse } from "@/interfaces";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function createCoinReceiptService(
  createCoinReceiptBody: CreateCoinReceiptBody
): Promise<CoinReceiptResponse> {
  try {
    const response = await axiosClient.post("/coin-receipt", createCoinReceiptBody);
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
