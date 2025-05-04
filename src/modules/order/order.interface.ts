import { Model } from 'sequelize';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod =
  | 'credit_card'
  | 'bank_transfer'
  | 'e_wallet'
  | 'cod';

export interface IOrderAttributes {
  id?: string;
  user_id: string;
  total_price: number;
  status?: OrderStatus;
  payment_method: PaymentMethod;
  payment_status?: PaymentStatus;
  snap_token?: string; // Add this
  snap_redirect_url?: string; // Add this
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderInstance
  extends Model<IOrderAttributes>,
    IOrderAttributes {
  // For custom instance methods
}

export interface CreateOrderParams {
  user_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  payment_method: string;
}
