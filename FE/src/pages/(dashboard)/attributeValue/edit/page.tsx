import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetAttributeValueByID } from "../actions/useGetAttributeValueByID";
import { useUpdateAttributeValue } from "../actions/useUpdateAttributeValue";

// Định nghĩa schema
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Hãy viết tên giá trị thuộc tính",
  }),
  value: z.string().min(1, {
    message: "Hãy viết giá trị thuộc tính",
  }),
});

const UpdateAttributeValuePage = () => {
  const { id } = useParams<{ id: string }>();
  const [typeValue, setTypeValue] = useState<string>("text");

  const { isLoadingAtributeValue, atributeValue } = useGetAttributeValueByID(
    id!
  ); // Lấy chi tiết giá trị thuộc tính theo ID
  const { updateAttributeValue, isUpdating } = useUpdateAttributeValue(id!); // Cập nhật giá trị thuộc tính

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  // Khi có dữ liệu thì reset form và tự xác định kiểu value (màu/chữ)
  useEffect(() => {
    if (atributeValue) {
      form.reset({ name: atributeValue.name, value: atributeValue.value });
      if (atributeValue.value.startsWith("#")) {
        setTypeValue("color");
      }
    }
  }, [atributeValue, form]);

  if (isLoadingAtributeValue) {
    return <div>Loading...</div>;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateAttributeValue({ ...values });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-2/3 ml-5"
      >
        {/* Tên */}
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

        {/* Giá trị */}
        <div className="flex items-center gap-3">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Giá trị thuộc tính</FormLabel>
                <FormControl>
                  <Input
                    type={typeValue}
                    placeholder="Ví dụ: #FF0000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-3 bg-blue-500 hover:bg-blue-600"
            type="button"
            onClick={() =>
              setTypeValue(typeValue === "text" ? "color" : "text")
            }
          >
            {typeValue === "text" ? "Đổi sang màu" : "Đổi sang chữ"}
          </Button>
        </div>

        <Button disabled={isUpdating} type="submit">
          {isUpdating ? "Đang cập nhật" : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateAttributeValuePage;
