import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { IRegisterRequest, ILoginRequest } from './auth.interface';
export const register = async (req: Request, res: Response) => {
  try {
    const userData: IRegisterRequest = req.body;
    const authResponse = await AuthService.registerUser(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: authResponse,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const credentials: ILoginRequest = req.body;
    const authResponse = await AuthService.loginUser(credentials);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: authResponse,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

export const AuthController = {
  register,
  login,
};
