import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import { IProductAttributes } from './product.interface';

class Product extends Model<IProductAttributes> implements IProductAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number; // Explicitly declared
  public stock!: number;
  public image_url?: string;
  public category_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt?: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: {
      // Explicitly defined with type
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    category_id: { type: DataTypes.UUID, allowNull: false },
  },
  {
    sequelize,
    modelName: 'products',
    paranoid: true,
  }
);

export default Product;
