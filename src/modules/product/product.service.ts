import Product from './product.model';
import { IProductAttributes } from './product.interface';
import { Op } from 'sequelize';

interface PaginationOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const createProduct = async (productData: IProductAttributes) => {
  const product = await Product.create(productData);
  return product.dataValues;
};

const getAllProducts = async ({
  searchTerm,
  page = 1,
  pageSize = 10,
}: PaginationOptions): Promise<PaginatedResult<Product>> => {
  const offset = (page - 1) * pageSize;

  const whereCondition = searchTerm
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      }
    : {};

  const { count, rows } = await Product.findAndCountAll({
    where: whereCondition,
    limit: pageSize,
    offset: offset,
    paranoid: false,
    order: [['createdAt', 'DESC']],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

const getProductById = async (id: string) => {
  return await Product.findByPk(id, { paranoid: false });
};

const updateProduct = async (
  id: string,
  updateData: Partial<IProductAttributes>
) => {
  const product = await Product.findByPk(id);
  if (!product) return null;

  return await product.update(updateData);
};

const deleteProduct = async (id: string, force: boolean = false) => {
  const result = await Product.destroy({
    where: { id },
    force,
  });

  return { deletedCount: result };
};

const restoreProduct = async (id: string) => {
  const result = await Product.restore({
    where: { id },
  });

  return { restoredCount: result };
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  restoreProduct,
};
