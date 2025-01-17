/* eslint-disable @typescript-eslint/no-explicit-any */
export type CreateCoinReceiptBody = {
  user_email: string;
  v_coins: number;
  type_id: number;
  transaction_id?: number;
};

export type CoinReceipt = {
  id: number;
  total: number;
  v_coins: number;
  amount: number;
  expiration_date: Date;
  is_active: boolean;
  type_id: number;
  transaction_id: number;
  user_email: string;
  created_at: Date;
  updated_at: Date;
};

export interface CoinReceiptResponse {
  status: number;
  data?: any;
  message?: any;
}
