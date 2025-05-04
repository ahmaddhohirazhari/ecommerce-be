import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { categoryValidationScheme } from './category.validation';

const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;

    const { error } = categoryValidationScheme.validate(categoryData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await CategoryService.createCategory(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create category',
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No categories found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'All categories fetched successfully!',
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await CategoryService.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully!',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch category',
    });
  }
};

const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const updateData = req.body;

    const { error } = categoryValidationScheme.validate(updateData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const updateCategory = await CategoryService.updateCategory(
      categoryId,
      updateData
    );

    if (!updateCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully!',
      data: updateCategory,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update category',
    });
  }
};

const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await CategoryService.deleteCategory(categoryId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Category not found!',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully!',
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete category',
    });
  }
};

export const categoryControllers = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
