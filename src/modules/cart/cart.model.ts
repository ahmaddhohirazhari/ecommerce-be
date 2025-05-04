// Cart.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';
import CartItem from '../cartItem/cartItem.model';
import Product from '../product/product.model';

class Cart extends Model {
  id?: string;
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
  },
  {
    sequelize,
    modelName: 'carts',
  }
);

Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

export default Cart;
