const jwt = require('jsonwebtoken');

import User from '../user/user.model';
import {
  IAuthResponse,
  ILoginRequest,
  IRegisterRequest,
} from './auth.interface';

import config from '../../config';

const registerUser = async (
  userData: IRegisterRequest
): Promise<IAuthResponse> => {
  // Check if email exists
  const existingUser = await User.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Create user
  const user = await User.create({
    ...userData,
    role: userData.role || 'customer',
  });

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const loginUser = async (
  credentials: ILoginRequest
): Promise<IAuthResponse> => {
  // Find user by email
  const user = await User.findOne({ where: { email: credentials.email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await user.comparePassword(credentials.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

// Helper function to generate JWT
const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const AuthService = {
  registerUser,
  loginUser,
};
