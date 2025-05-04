import { Request, Response } from 'express';
import { ProductServices } from './product.service';
import { productValidationSchema } from './product.validation';
import fs from 'fs';
import path from 'path';
import wrapper from '../../utils/wrapper';

interface ProductRequest extends Request {
  file?: Express.Multer.File;
}

const createProduct = async (req: ProductRequest, res: Response) => {
  let uploadedFilePath: string | null = null;

  try {
    // Simpan path file yang diupload untuk cleanup jika error
    if (req.file) {
      uploadedFilePath = path.join(
        __dirname,
        '../../../src/storage/products',
        req.file.filename
      );
    }

    // Gabungkan data dari body dan file
    const productData = {
      ...req.body,
      image_url: req.file
        ? `http://localhost:3000/storage/products/${req.file.filename}`
        : null,
    };

    console.log('product data :', productData);
    // Validasi input
    const { error } = productValidationSchema.validate(productData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Create product
    const result = await ProductServices.createProduct(productData);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: {
        ...result,
        image_url: productData.image_url
          ? `${process.env.BASE_URL}${productData.image_url}`
          : null,
      },
    });
  } catch (error: any) {
    // Hanya hapus file jika sudah terupload dan terjadi error
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const result = await ProductServices.getAllProducts({
      searchTerm,
      page,
      pageSize,
    });

    if (result.data.length === 0) {
      const message = searchTerm
        ? `No products found matching '${searchTerm}'`
        : 'No products found';
      return wrapper.response(res, 404, message, null);
    }

    const successMessage = searchTerm
      ? `Products matching '${searchTerm}' fetched successfully`
      : 'All products fetched successfully';

    return wrapper.response(res, 200, successMessage, result.data, {
      total: result.pagination.total,
      page: result.pagination.page,
      pageSize: result.pagination.pageSize,
    });
  } catch (error: any) {
    return wrapper.response(
      res,
      500,
      error.message || 'Failed to fetch products',
      null
    );
  }
};
const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const product = await ProductServices.getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully!',
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product',
    });
  }
};

const updateProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;

    // Validasi input
    const { error } = productValidationSchema.validate(updateData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updatedProduct = await ProductServices.updateProduct(
      productId,
      updateData
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

const deleteProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const result = await ProductServices.deleteProduct(productId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Product not found!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
