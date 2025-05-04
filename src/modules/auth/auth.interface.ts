export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin'; // Optional, default 'customer'
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}
