import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import { IOrderItemAttributes } from './orderItem.interface';

class OrderItem
  extends Model<IOrderItemAttributes>
  implements IOrderItemAttributes
{
  public id!: string;
  public order_id!: string;
  public product_id!: string;
  public quantity!: number;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define association method

  static associate(models: any) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order',
    });

    OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      validate: {
        isUUID: 4,
      },
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
      validate: {
        isUUID: 4,
      },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      validate: {
        isUUID: 4,
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: 'order_item',
    tableName: 'order_items',
    timestamps: true,
    underscored: true,
    paranoid: false, // Consider enabling if you need soft deletes
    indexes: [
      {
        fields: ['order_id'], // Index for better query performance
      },
      {
        fields: ['product_id'],
      },
    ],
  }
);

export default OrderItem;
