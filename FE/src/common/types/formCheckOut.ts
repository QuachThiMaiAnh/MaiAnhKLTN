export interface FormOut {
  addressId: string;
  _id?:string;
  paymentMethod: string;
  agreeToTerms: boolean; // Thêm trường agreeToTerms
  emailUpdates: boolean;
  note: string;
}

// Định nghĩa các kiểu cho danh mục của sản phẩm
interface Category {
  _id: string;
  name: string;
  slug: string;
  __v: number;
}

// Định nghĩa kiểu cho sản phẩm (productItem)
interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  category: Category[];
  image: string;
  price: number;
  type: string;
  description: string;
  deleted: boolean;
  reviews: unknown[]; // Nếu bạn có thông tin về reviews có thể thay đổi kiểu này
  variants: string[]; // Danh sách các ID của các biến thể (variants)
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu cho giá trị của biến thể (variant value)
interface VariantValue {
  _id: string;
  name: string;
  type: string;
  value: string;
  __v: number;
}

// Định nghĩa kiểu cho biến thể sản phẩm (variantItem)
interface VariantItem {
  _id: string;
  price: number;
  priceSale: number;
  values: VariantValue[];
  countOnStock: number;
  image: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa kiểu cho sản phẩm trong giỏ hàng (cart product)
interface CartProduct {
  _id: string;
  productItem: ProductItem;
  variantItem: VariantItem;
  quantity: number;
}

// Định nghĩa kiểu cho giỏ hàng (cart)
export interface Cart {
  _id: string;
  selected?:string;
  userId: string;
  products: CartProduct[];
  voucher: unknown[]; // Nếu có thông tin về voucher, có thể thay đổi kiểu này
  total: number;
  createdAt: string;
  updatedAt: string;
  discount: number;
  subTotal: number;
}



