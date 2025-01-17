/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SignUpBody {
  email: string;
  password: string;
  name: string;
}

export interface SignUpResponse {
  status: number;
  data?: any;
  message?: any;
}
