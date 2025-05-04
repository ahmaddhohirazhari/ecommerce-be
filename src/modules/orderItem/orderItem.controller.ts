import { Request, Response } from 'express';
import { OrderItemService } from './orderItem.service';
import { IOrderItemAttributes } from './orderItem.interface';

export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const itemData: IOrderItemAttributes = req.body;
    const orderItem = await OrderItemService.createOrderItem(itemData);

    res.status(201).json({
      success: true,
      message: 'Order item created successfully',
      data: orderItem,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order item',
    });
  }
};

export const getOrderItems = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const items = await OrderItemService.getOrderItems(orderId);

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order items',
    });
  }
};

export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const updateData = req.body;

    const updatedItem = await OrderItemService.updateOrderItem(
      itemId,
      updateData
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order item updated successfully',
      data: updatedItem,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order item',
    });
  }
};

export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const result = await OrderItemService.deleteOrderItem(itemId);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order item deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete order item',
    });
  }
};

export const OrderItemController = {
  createOrderItem,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
};
