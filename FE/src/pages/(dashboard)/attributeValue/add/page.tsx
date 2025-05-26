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
import { useGetAttributeByID } from "../../attribute/actions/useGetAttributeByID";
import { useCreateAttributeValue } from "../actions/useCreateAttributeValue";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Hãy viết tên giá trị thuộc tính",
  }),
  value: z.string().min(1, {
    message: "Hãy viết giá trị thuộc tính",
  }),

  type: z.string().min(1, {
    message: "Hãy chọn loại giá trị thuộc tính",
  }),
});

const CreateAttributeValuePage = () => {
  const { id } = useParams();
  const [typeValue, setTypeValue] = useState<string>("text");

  const { isLoadingAtribute, atribute } = useGetAttributeByID(id!);
  const { createAttributeValue, isCreating } = useCreateAttributeValue(id!);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
      type: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    createAttributeValue(values);
  }

  useEffect(() => {
    if (atribute) {
      form.reset({ type: atribute.name });
    }
  }, [atribute, form]);

  if (isLoadingAtribute) return <div>Loading...</div>;

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
              <FormLabel>Tên giá trị thuộc tính</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá trị thuộc tính</FormLabel>
                <FormControl>
                  <Input type={typeValue} placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => {
              setTypeValue(typeValue === "text" ? "color" : "text");
            }}
          >
            {typeValue === "text" ? "Đổi sang màu" : "Đổi sang chữ"}
          </Button>
        </div>
        {/* <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại giá trị thuộc tính</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button disabled={isCreating} type="submit">
          {isCreating ? "Đang tạo..." : "Tạo"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateAttributeValuePage;
