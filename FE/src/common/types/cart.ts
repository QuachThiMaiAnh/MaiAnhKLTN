import { Product } from "./Products";
export  interface Voucher {
  _id: string;
  code: string;
  category: 'product' | 'shipping'; // Loại voucher (sản phẩm hay vận chuyển)
  discount: number; // Số tiền hoặc phần trăm giảm
  type: 'fixed' | 'percent'; // Kiểu giảm giá (số tiền hoặc phần trăm)
  status: 'active' | 'inactive'; // Trạng thái của voucher
  countOnStock: number; // Số lượng voucher còn lại
} 
export interface ICart {
  userId?: string;
  products?: Product[];
  voucher?: Voucher[];
  subTotal?: number;
  discount?: number;
  ship?: number;
  total?: number;
}
