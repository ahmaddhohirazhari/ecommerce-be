import { Model } from 'sequelize';

export interface ICartAttributes {
  id?: string;
  user_id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartInstance extends Model<ICartAttributes>, ICartAttributes {
  // For custom instance methods
}
