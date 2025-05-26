
export interface User {
  _id?: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  Address: string;
  role: string;
  phone: string;
  gender: string;
  password?: string;
  isActive?: string;
  paymentInfo: string;
  passwordPlaintext?: string; 
  orders: string;
  isBanned: boolean;
  isDeleted: boolean;
}
export interface updateUserResponse{
  data: User
}
export interface BackendError {
  code: string;
  message: string;
}
export interface Errors {
  response?: {
    data?: {
      message?: string;
      errors?: BackendError[];
    }
  }
}

