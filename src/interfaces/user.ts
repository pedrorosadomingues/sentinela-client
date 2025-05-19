import { Tables } from "@/lib/supabase/types";

type WatchedTours = {
  tour_id: number;
};

export interface UserProps extends Tables<"user"> {
  avatar: string;
  v_coins: {
    current: number;
    total: number;
  };
  watched_tours: WatchedTours[] | [];
  plan: Tables<"plan">;
  subscription: Tables<"subscription">;
  coin_receipts: Tables<"coin_receipt">[];
}

export interface SessionUserProps {
  session_user: UserProps;
  access_token: string;
}

export interface GetUserByIdParams {
  user_id: number | string;
}

export interface GetUserByIdResponse {
  status: number;
  data?: UserProps;
  message?: string;
}
