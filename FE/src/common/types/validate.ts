import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// ========== Cấu hình mặc định ==========
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // Giới hạn kích thước file upload: 3MB
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
];

// ========== Schema biến thể sản phẩm ==========
export const variantSchema = z
  .object({
    _id: z.string().optional(), // ID (khi chỉnh sửa)

    price: z.coerce
      .number({ message: "Giá bán phải là số" })
      .gte(1, { message: "Giá bán phải lớn hơn hoặc bằng 1" }),

    originalPrice: z.coerce
      .number({ message: "Giá gốc phải là số" })
      .gte(1, { message: "Giá gốc phải lớn hơn hoặc bằng 1" }),

    priceSale: z.coerce
      .number({ message: "Giá giảm giá phải là số" })
      .gte(0, { message: "Giá giảm giá không thể âm" })
      .optional(),

    countOnStock: z.coerce
      .number({ message: "Số lượng phải là số" })
      .gte(1, { message: "Số lượng phải lớn hơn hoặc bằng 1" }),

    values: z.array(
      // Mảng chứa các giá trị thuộc tính của biến thể
      z.object({
        _id: z.string(), // ID của giá trị thuộc tính (attribute value)
        type: z.string(), // Tên loại thuộc tính (VD: "màu sắc", "kích thước")
      })
    ),

    image: z
      .union([
        z.string().url().or(z.literal("")), // Trường hợp ảnh đã được upload (dạng URL) hoặc trống
        z
          .instanceof(File)
          .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
            message: "Chỉ được upload file ảnh (PNG, JPEG, JPG, GIF, WEBP)",
          }),
      ])
      .optional(),
  })
  .refine(
    (data) => data.priceSale === undefined || data.priceSale < data.price,
    {
      message: "Giá giảm giá phải nhỏ hơn giá bán thông thường",
      path: ["priceSale"],
    }
  );

// ========== Schema sản phẩm đầy đủ (có biến thể) ==========
export const productSchema = z.object({
  _id: z.string().optional(),

  name: z.string().min(1, { message: "Tên sản phẩm không được để trống" }),

  description: z.string().min(10, {
    message: "Mô tả sản phẩm phải có ít nhất 10 ký tự",
  }),

  descriptionDetail: z.string().optional(), // Mô tả chi tiết sản phẩm

  category: z.array(z.string()).optional(), // Danh sách ID danh mục sản phẩm

  image: z.union([
    z.string().url().or(z.literal("")),
    z.instanceof(File).optional(),
  ]), // Ảnh đại diện sản phẩm (có thể là URL hoặc File)

  price: z.coerce.number().optional(), // Giá bán thông thường
  priceSale: z.coerce.number().optional(), // Giá giảm giá (nếu có)

  variants: z.array(variantSchema).refine((variants) => variants.length > 0, {
    message: "Sản phẩm phải có ít nhất 1 biến thể",
  }),

  createdAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  updatedAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),

  deleted: z.boolean().optional(),
});

// ========== Schema sản phẩm đơn giản (dành cho sản phẩm đơn không có biến thể) ==========
export const productSimpleSchema = z
  .object({
    _id: z.string().optional(),

    name: z.string().min(1, { message: "Tên sản phẩm không được để trống" }),

    category: z.array(z.string()).optional(),

    description: z.string().min(1, {
      message: "Mô tả sản phẩm không được để trống",
    }),

    descriptionDetail: z.string().optional(),

    image: z
      .union([z.string().url().or(z.literal("")), z.instanceof(File)])
      .optional(),

    price: z.coerce.number(),
    priceSale: z.coerce.number().optional(),
  })
  .refine(
    (data) => data.priceSale === undefined || data.priceSale < data.price,
    {
      message: "Giá giảm giá phải nhỏ hơn giá thông thường",
      path: ["priceSale"],
    }
  );

// ========== Types cho React Hook Form ==========
export type FormTypeProductSimple = UseFormReturn<
  z.infer<typeof productSimpleSchema>
>;

export type FormTypeProductVariation = UseFormReturn<
  z.infer<typeof productSchema>
>;

export type FormTypeProductCommon = UseFormReturn<
  z.infer<typeof productSimpleSchema> & Partial<z.infer<typeof productSchema>>
>;
