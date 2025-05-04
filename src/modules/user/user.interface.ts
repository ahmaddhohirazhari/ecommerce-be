import { Model } from 'sequelize';

export type UserRole = 'customer' | 'admin';

export interface IUserAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserImageAttributes {
  image?: string;
}

export interface IUserInstance extends Model<IUserAttributes>, IUserAttributes {
  // For custom instance methods
  comparePassword?(candidatePassword: string): Promise<boolean>;
}
