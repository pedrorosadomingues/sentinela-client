/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";

export async function createDownloadImage (body: {generation_id: number, user_id: number}): Promise<any> {
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
        const response = await api.post("/download", body, config);
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