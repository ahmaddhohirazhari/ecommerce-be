import { Model } from 'sequelize';

export interface IProductAttributes {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductInstance
  extends Model<IProductAttributes>,
    IProductAttributes {
  // For custom instance methods
}
