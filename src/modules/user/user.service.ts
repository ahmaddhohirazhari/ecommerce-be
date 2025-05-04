import User from './user.model';
import { IUserAttributes, IUserImageAttributes } from './user.interface';

const createUser = async (userData: IUserAttributes) => {
  return await User.create(userData);
};

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] },
  });
};

const getUserById = async (userId: string) => {
  return await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });
};

const getUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

const updateUser = async (
  userId: string,
  updateData: Partial<IUserAttributes>
) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  return await user.update(updateData);
};

const updateImage = async (
  userId: string,
  updateData: Partial<IUserImageAttributes>
) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  return await user.update(updateData);
};

const deleteUser = async (userId: string) => {
  const deletedCount = await User.destroy({
    where: { id: userId },
  });
  return { deletedCount };
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
