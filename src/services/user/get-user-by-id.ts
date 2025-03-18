/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import {GetUserByIdParams, GetUserByIdResponse } from "@/interfaces/user";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function getUserById({
  user_id,
}: GetUserByIdParams): Promise<GetUserByIdResponse> {
  try {
    const response = await axiosClient.get(`/user/${user_id}`);
    
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