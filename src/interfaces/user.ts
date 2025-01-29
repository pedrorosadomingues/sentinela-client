import { Tables } from "@/lib/supabase/types";

export interface UserProps extends Tables<"user"> {
  avatar: string;
  v_coins: {
    current: number;
    total: number;
  }
}

export interface GetUserByIdParams {
  user_id: number | string;
}

export interface GetUserByIdResponse {
  status: number;
  data?: UserProps;
  message?: string;
}
