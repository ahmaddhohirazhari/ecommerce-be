import { Request, Response } from 'express';
import { UserService } from './user.service';
import { IUserAttributes } from './user.interface';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData: IUserAttributes = req.body;
    const user = await UserService.createUser(userData);

    // Exclude password from response
    const userResponse = user.toJSON();
    // delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create user',
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user',
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await UserService.updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Exclude password from response
    const userResponse = updatedUser.toJSON();
    // delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userResponse,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await UserService.deleteUser(userId);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};

export const UserController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
