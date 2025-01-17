export interface User {
  id: number | null;
  name: string;
  email: string;
  password: string;
  created_at: Date | null;
  updated_at: Date | null;
  v_coins: number;
}

export interface GetUserByIdParams {
  user_id: number | string;
}

export interface GetUserByIdResponse {
  status: number;
  data?: User;
  message?: string;
}
