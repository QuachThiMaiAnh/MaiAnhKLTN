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
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetAttributeByID } from "../actions/useGetAttributeByID";
import { useUpdateAttributeByID } from "../actions/useUpdateAttributeByID";

// Schema kiểm tra dữ liệu đầu vào (zod)
const formSchema = z.object({
  name: z.string().min(1, { message: "Hãy viết tên thuộc tính" }).max(50),
});

const UpdateAttributePage = () => {
  const { id } = useParams<{ id: string }>();
  const { updateAttribute, isUpdating } = useUpdateAttributeByID(id!);
  const { isLoadingAttribute, attribute, error } = useGetAttributeByID(id!);

  // Khởi tạo form và validate với schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Khi dữ liệu attribute đã tải xong thì reset form
  useEffect(() => {
    if (attribute) {
      form.reset({ name: attribute.name });
    }
  }, [attribute, form]);

  // Loading ban đầu
  if (isLoadingAttribute) {
    return <div>Loading...</div>;
  }

  // Gửi form cập nhật
  function onSubmit(values: z.infer<typeof formSchema>) {
    updateAttribute(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-2/3 ml-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên thuộc tính</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên thuộc tính..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isUpdating} type="submit">
          {isUpdating ? "Đang cập nhật" : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateAttributePage;
