import { Op } from 'sequelize';
import Category from './category.model';
import { CategoryData } from './category.interface';

const createCategory = async (categoryData: { CategoryData: CategoryData }) => {
  const category = await Category.create(categoryData);
  return category;
};

const getAllCategories = async (searchTerm?: string) => {
  const options = searchTerm
    ? {
        where: {
          name: { [Op.iLike]: `%${searchTerm}%` },
        },
        paranoid: false,
      }
    : {};

  return await Category.findAll(options);
};

const getCategoryById = async (id: string) => {
  return await Category.findByPk(id, { paranoid: false });
};

const updateCategory = async (
  id: string,
  updateData: Partial<CategoryData>
) => {
  const category = await Category.findByPk(id);
  if (!category) return null;

  return await category.update(updateData);
};

const deleteCategory = async (id: string, force: boolean = false) => {
  const result = await Category.destroy({
    where: { id },
  });

  return { deletedCount: result };
};

const restoreCategory = async (id: string) => {
  const result = await Category.restore({
    where: { id },
  });

  return { restoredCount: result };
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  restoreCategory,
};
