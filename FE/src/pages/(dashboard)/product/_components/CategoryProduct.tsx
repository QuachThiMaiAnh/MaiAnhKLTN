import { useCategory } from "@/common/hooks/useCategory";
import { FormTypeProductVariation } from "@/common/types/validate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  defaultCategory: boolean;
  deleted: boolean;
};

const CategoryProduct = ({ form }: { form: FormTypeProductVariation }) => {
  const defaultCategory = "675dadfde9a2c0d93f9ba531";

  const { category, isLoadingCategory } = useCategory();

  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    "item-3"
  );

  useEffect(() => {
    const selectedCategories = form.getValues("category") || [];

    // Nếu không có danh mục nào được chọn, thêm `defaultCategory`
    if (selectedCategories.length === 0) {
      form.setValue("category", [defaultCategory], { shouldValidate: true });
    }
  }, [form]);

  if (isLoadingCategory) return <div>Loading...</div>;

  return (
    <Accordion
      className="bg-white border px-4"
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={(value) => setAccordionValue(value)}
    >
      <AccordionItem className="border-none" value="item-3">
        <AccordionTrigger className="no-underline">Danh mục</AccordionTrigger>
        <AccordionContent>
          <FormField
            control={form.control}
            name="category"
            render={() => (
              <FormItem>
                {category?.data?.map((item: Category) => (
                  <FormField
                    key={item._id}
                    control={form.control}
                    name="category"
                    render={({ field }) => {
                      // console.log(item);
                      return (
                        <FormItem
                          key={item._id}
                          className="flex flex-row items-start space-x-2 space-y-0 mb-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item._id)} // Tích khi item thuộc mảng category
                              onCheckedChange={(checked) => {
                                let updatedValues = checked
                                  ? [...(field.value || []), item._id] // Thêm danh mục
                                  : field.value?.filter(
                                      (value) => value !== item._id
                                    ); // Loại bỏ danh mục

                                // Nếu danh mục được chọn không phải `defaultCategory`, loại bỏ `defaultCategory`
                                if (
                                  item._id !== defaultCategory &&
                                  updatedValues?.includes(defaultCategory)
                                ) {
                                  updatedValues = updatedValues.filter(
                                    (value) => value !== defaultCategory
                                  );
                                }

                                // Nếu không có danh mục nào được chọn, thêm `defaultCategory`
                                if (
                                  !updatedValues ||
                                  updatedValues.length === 0
                                ) {
                                  updatedValues = [defaultCategory];
                                }

                                // Cập nhật giá trị
                                field.onChange(updatedValues);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
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
