import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useGetAtributes } from "../actions/useGetAllAttributeValues";
import { useCreateAttributeValue } from "../actions/useCreateAttributeValue";

// Định nghĩa schema kiểm tra dữ liệu đầu vào
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Hãy viết tên giá trị thuộc tính",
  }),
  value: z.string().min(1, {
    message: "Hãy viết giá trị thuộc tính",
  }),
  type: z.string().min(1, {
    message: "Thiếu loại thuộc tính",
  }),
});

const CreateAttributeValuePage = () => {
  const { id } = useParams(); // Lấy id Thuộc tính cha từ URL
  const [typeValue, setTypeValue] = useState<string>("text"); // Mặc định là kiểu text
  const { isLoading: isLoadingAtribute, atributeValues } = useGetAtributes(id!); // Lấy danh sách giá trị thuộc tính theo thuộc tính cha
  const { createAttributeValue, isCreating } = useCreateAttributeValue(id!); // Tạo giá trị thuộc tính mới

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
      type: "",
    },
  });

  // Khi đổi typeValue hoặc thuộc tính được load, gán loại vào trường `type`
  useEffect(() => {
    if (atributeValues && atributeValues.length > 0) {
      form.reset({ type: atributeValues[0].name }); // Gán loại thuộc tính đầu tiên
    }
  }, [atributeValues, form]);

  if (isLoadingAtribute) return <div>Loading...</div>;

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAttributeValue(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-2/3 ml-5"
      >
        {/* Tên giá trị thuộc tính */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên giá trị thuộc tính</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Đỏ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Giá trị thực tế */}
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá trị thuộc tính</FormLabel>
              <FormControl>
                <Input
                  type={typeValue}
                  placeholder={typeValue === "text" ? "Nhập chữ" : "Chọn màu"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nút đổi kiểu hiển thị value */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() =>
              setTypeValue((prev) => {
                const next = prev === "text" ? "color" : "text";
                form.setValue("type", next);
                return next;
              })
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {typeValue === "text" ? "Đổi sang màu" : "Đổi sang chữ"}
          </Button>

          <Button disabled={isCreating} type="submit">
            {isCreating ? "Đang tạo..." : "Tạo"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateAttributeValuePage;
