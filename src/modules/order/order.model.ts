import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import {
  IOrderAttributes,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from './order.interface';

// Define ENUM types first
const orderStatusEnum = DataTypes.ENUM<OrderStatus>(
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

const paymentStatusEnum = DataTypes.ENUM<PaymentStatus>(
  'unpaid',
  'paid',
  'failed',
  'refunded'
);

const paymentMethodEnum = DataTypes.ENUM<PaymentMethod>(
  'credit_card',
  'bank_transfer',
  'e_wallet',
  'cod'
);

class Order extends Model<IOrderAttributes> implements IOrderAttributes {
  public id!: string;
  public user_id!: string;
  public total_price!: number;
  public status!: OrderStatus;
  public payment_method!: PaymentMethod;
  public payment_status!: PaymentStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  items: any;

  // Define association method
  public static associate(models: any) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items', // This is the alias you'll use in queries
    });
  }
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: orderStatusEnum,
      defaultValue: 'pending',
    },
    payment_method: {
      type: paymentMethodEnum,
      allowNull: false,
    },
    payment_status: {
      type: paymentStatusEnum,
      defaultValue: 'unpaid',
    },
    snap_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    snap_redirect_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'orders',
    tableName: 'orders',
    timestamps: true,
    underscored: true,
  }
);

// Export the model first
export default Order;

// Then set up associations in your model initialization file
// This should be in a separate file (usually models/index.ts)
export function setupOrderRelationships(models: any) {
  Order.associate(models);

  // If you need to set up reciprocal association
  models.OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order', // Different alias for the reverse association
  });
}
