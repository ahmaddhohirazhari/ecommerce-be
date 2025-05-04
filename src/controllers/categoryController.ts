import { Request, Response } from 'express';
import { Category } from '../models';

export const categoryController = {
  // GET ALL
  getAll: async (_req: Request, res: Response) => {
    try {
      const categories = await Category.findAll();
      return res.json(categories);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // GET BY ID
  getById: async (req: Request, res: Response) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ message: 'Not found' });
      return res.json(category);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // CREATE
  create: async (req: Request, res: Response) => {
    try {
      const category = await Category.create(req.body);
      return res.status(201).json(category);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // UPDATE
  update: async (req: Request, res: Response) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ message: 'Not found' });

      await category.update(req.body);
      return res.json(category);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // DELETE
  delete: async (req: Request, res: Response) => {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ message: 'Not found' });

      await category.destroy();
      return res.json({ message: 'Deleted' });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};
