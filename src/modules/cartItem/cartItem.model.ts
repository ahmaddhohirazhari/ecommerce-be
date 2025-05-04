import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import { ICartItemAttributes } from './cartItem.interface';
import { Product } from '../../models';

class CartItem
  extends Model<ICartItemAttributes>
  implements ICartItemAttributes
{
  public id!: string;
  public cart_id!: string;
  public product_id!: string;
  public quantity!: number;
  public price!: number;
  public user_id!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public product?: Product;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cart_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'carts',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: 'cart_items',
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
  }
);

export default CartItem;
