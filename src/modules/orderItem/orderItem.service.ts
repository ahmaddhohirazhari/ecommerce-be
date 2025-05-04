import { OrderItem } from '../../models';
import { IOrderItemAttributes } from './orderItem.interface';
import { Transaction } from 'sequelize';

const createOrderItem = async (
  itemData: IOrderItemAttributes,
  transaction?: Transaction
) => {
  return await OrderItem.create(itemData, { transaction });
};

const createBulkOrderItems = async (
  items: IOrderItemAttributes[],
  transaction?: Transaction
) => {
  return await OrderItem.bulkCreate(items, { transaction });
};

const getOrderItems = async (orderId: string) => {
  return await OrderItem.findAll({
    where: { order_id: orderId },
    include: ['product'],
  });
};

const updateOrderItem = async (
  itemId: string,
  updateData: Partial<IOrderItemAttributes>
) => {
  const item = await OrderItem.findByPk(itemId);
  if (!item) return null;

  return await item.update(updateData);
};

const deleteOrderItem = async (itemId: string) => {
  return await OrderItem.destroy({
    where: { id: itemId },
  });
};

export const OrderItemService = {
  createOrderItem,
  createBulkOrderItems,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
};
