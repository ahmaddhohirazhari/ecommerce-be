import { Model } from 'sequelize';
import { Product } from '../../models';

export interface ICartItemAttributes {
  id?: string;
  cart_id: string;
  product_id: string;
  user_id?: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  product?: Product;
}

export interface ICartItemInstance
  extends Model<ICartItemAttributes>,
    ICartItemAttributes {
  // Untuk custom instance methods
}
