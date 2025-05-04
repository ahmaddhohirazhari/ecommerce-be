import { Model } from 'sequelize';

export interface IOrderItemAttributes {
  id?: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderItemInstance
  extends Model<IOrderItemAttributes>,
    IOrderItemAttributes {
  // For custom instance methods
}
