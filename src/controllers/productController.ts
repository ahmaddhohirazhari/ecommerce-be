import { Request, Response } from 'express';
import { Product } from '../models';
import sequelize from '../config/database';

export const productController = {
  // GET ALL
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const searchTerm: string | undefined = req.query.searchTerm as
        | string
        | undefined;
      const result = await Product.findAll();

      // Throw error if there are no matches
      if (result.length === 0) {
        const error = {
          success: false,
          message: `No products found matching the search term '${searchTerm}'`,
        };
        throw error;
      }

      res.status(200).json({
        success: true,
        message: searchTerm
          ? `Products matching search term '${searchTerm}' fetched successfully!`
          : `Products fetched successfully!`,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  // GET BY ID
  getProductById: async (req: Request, res: Response) => {
    try {
      const result = await Product.findByPk(req.params.id);

      // if product is not found
      if (!result) {
        const error = {
          success: false,
          message: 'Product not found!',
        };
        throw error;
      }
      res.status(200).json({
        success: true,
        message: 'Product fetched successfully!',
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  // CREATE
  createProduct: async (req: Request, res: Response) => {
    try {
      const product = await Product.create(req.body);

      res.status(200).json({
        success: true,
        message: 'Product created successfully!',
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // UPDATE
  updateProductById: async (req: Request, res: Response) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product)
        return res.status(404).json({ message: 'Product not found' });

      const result = await product.update(req.body);

      // If product does not exist
      if (!result) {
        const error = {
          success: false,
          message: 'Product does not exist!',
        };
        throw error;
      }
      res.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // DELETE
  deleteProductById: async (req: Request, res: Response): Promise<Response> => {
    const transaction = await sequelize.transaction();

    try {
      const product = await Product.findByPk(req.params.id, { transaction });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      await product.destroy({ transaction });
      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: null,
      });
    } catch (error: unknown) {
      await transaction.rollback();

      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: error.message || 'Failed to delete product',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'An unknown error occurred',
      });
    }
  },
};
