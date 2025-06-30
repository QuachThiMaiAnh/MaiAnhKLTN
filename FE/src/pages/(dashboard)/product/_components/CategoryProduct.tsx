import { useEffect, useState } from "react";
import { useCategory } from "@/common/hooks/useCategory";
import { FormTypeProductVariation } from "@/common/types/validate";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";

// Lấy ID danh mục mặc định từ biến môi trường
const DEFAULT_CATEGORY_ID = import.meta.env.VITE_DEFAULT_CATEGORY_ID;

type Category = {
  _id: string;
  name: string;
  slug: string;
  defaultCategory: boolean;
  deleted: boolean;
};

const CategoryProduct = ({ form }: { form: FormTypeProductVariation }) => {
  const { category, isLoadingCategory } = useCategory(); // Sử dụng hook để lấy danh mục sản phẩm
  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    "item-3"
  );

  // Gán mặc định danh mục nếu chưa có danh mục nào được chọn
  useEffect(() => {
    const selectedCategories = form.getValues("category") || [];
    if (selectedCategories.length === 0) {
      form.setValue("category", [DEFAULT_CATEGORY_ID], {
        // Cập nhật giá trị mặc định
        shouldValidate: true,
      });
    }
  }, [form]);

  // Hiển thị loading
  if (isLoadingCategory) return <div>Đang tải danh mục...</div>;

  // Xử lý khi click checkbox
  const handleCategoryChange = (
    checked: boolean, // Trạng thái checkbox
    categoryId: string, // ID danh mục
    currentValues: string[] // Các giá trị hiện tại đã chọn (_id của các danh mục đã chọn)
  ) => {
    let updatedValues = checked
      ? [...currentValues, categoryId] // Nếu checked, thêm ID danh mục vào danh sách đã chọn
      : currentValues.filter((id) => id !== categoryId); // Nếu không checked, loại bỏ ID danh mục khỏi danh sách đã chọn

    // Nếu chọn danh mục mới khác default -> bỏ default
    if (
      categoryId !== DEFAULT_CATEGORY_ID &&
      updatedValues.includes(DEFAULT_CATEGORY_ID)
    ) {
      updatedValues = updatedValues.filter((id) => id !== DEFAULT_CATEGORY_ID); // Loại bỏ danh mục mặc định nếu đã chọn danh mục khác
    }

    // Nếu bỏ hết danh mục → thêm lại mặc định
    if (updatedValues.length === 0) {
      updatedValues = [DEFAULT_CATEGORY_ID]; // Nếu không có danh mục nào được chọn, thêm lại danh mục mặc định
    }

    return updatedValues; // Trả về danh sách đã cập nhật
  };

  return (
    <Accordion
      className="bg-white border px-4"
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={(value) => setAccordionValue(value)} // Cập nhật giá trị accordion khi thay đổi (ví dụ: khi mở hoặc đóng accordion)
    >
      <AccordionItem className="border-none" value="item-3">
        <AccordionTrigger className="no-underline font-bold">
          Danh mục
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={form.control}
            name="category"
            render={() => (
              <FormItem>
                {category?.map(
                  (
                    item: Category // Lặp qua danh sách danh mục
                  ) => (
                    <FormField
                      key={item._id}
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0 mb-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item._id)} // Kiểm tra xem danh mục hiện tại có được chọn không
                              onCheckedChange={(
                                checked // Xử lý sự kiện khi checkbox được chọn hoặc bỏ chọn
                              ) =>
                                field.onChange(
                                  handleCategoryChange(
                                    Boolean(checked), // Chuyển đổi checked thành boolean
                                    item._id, // ID của danh mục hiện tại
                                    field.value || []
                                  )
                                )
                              }
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  )
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryProduct;

/**
 Form CategoryProduct dùng để:

Cho phép chọn nhiều danh mục sản phẩm (checkbox).

Nếu chưa chọn danh mục nào, hệ thống sẽ tự động chọn 1 danh mục mặc định (DEFAULT_CATEGORY_ID).

Nếu người dùng chọn thêm danh mục khác ➝ loại bỏ danh mục mặc định.

Nếu người dùng bỏ chọn hết ➝ tự thêm lại danh mục mặc định.
 */
