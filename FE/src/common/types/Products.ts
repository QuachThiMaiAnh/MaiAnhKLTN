export type Category = {
    _id: string;
    name: string;
    title: string;
    image: string;
    description: string;
    slug: string;
    deleted: boolean;
    defaultCategory: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
  export type CommentProducts = {
    _id: string;
    userId: string;
    content: string;
    deleted?: boolean;
    rating: number;
    createdAt: Date;
  }
  
  export type VariantValue = {
    _id: string;
    name: string;
    slugName: string;
    type: string;
    value: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
  export type VariantItem = {
    _id: string;
    price: number;
    name?: string;
    originalPrice: number;
    priceSale: number | null;
    values: VariantValue[];
    countOnStock: number;
    image: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  
  export type ProductItem = {
    _id: string;
    name: string;
    slug: string;
    category: Category[];
    countOnStock: number;
    image: string;
    price: number;
    priceSale: number;
    totalOriginalPrice: number;
    description: string;
    descriptionDetail: string;
    deleted: boolean;
    comments: CommentProducts[];
    variants: string[];
    count: number;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Product = {
    productItem: ProductItem;
    variantItem: VariantItem;
    quantity: number;
    selected: boolean;
    isCommented?: boolean;
    statusComment?: boolean;
    _id?: string;
  };
  
  