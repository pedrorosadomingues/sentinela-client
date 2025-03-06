export interface Plan {
    id: number;
    name: string;
    available_resources: string[];
    coins: number;
    storage_limit: number;
    price: number;
    period: string;
    key: string;
    stripe_price_id: string;
}