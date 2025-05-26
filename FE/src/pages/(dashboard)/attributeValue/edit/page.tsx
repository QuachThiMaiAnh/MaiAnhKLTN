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

// import { useUpdateAttributeByID } from "../actions/useUpdateAttributeByID";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Hãy viết tên giá trị thuộc tính",
  }),
  value: z.string().min(1, {
    message: "Hãy viết giá trị thuộc tính",
  }),

  // type: z.string().min(1, {
  //   message: "Hãy chọn loại giá trị thuộc tính",
  // }),
});

const UpdateAttributeValuePage = () => {
  const { id } = useParams<{ id: string }>();
  const [typeValue, setTypeValue] = useState<string>("text");

  const { isLoadingAtributeValue, atributeValue, error } =
    useGetAttributeValueByID(id!);

  const { updateAttributeValue, isUpdating } = useUpdateAttributeValue(id!);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
      // type: "",
    },
  });

  // 2. Define a submit handler.
  useEffect(() => {
    if (atributeValue) {
      form.reset(atributeValue);
      if (atributeValue.value.startsWith("#")) {
        setTypeValue("color");
      }
    }
  }, [atributeValue, form]);

  if (isLoadingAtributeValue) {
    return <div>Loading...</div>;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    updateAttributeValue({ ...values, _id: id });
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
              <FormLabel>Tên giá trị thuộc tính</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Giá trị thuộc tính</FormLabel>
                <FormControl>
                  <Input type={typeValue} placeholder="shadcn" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="mt-3 bg-blue-500 hover:bg-blue-600"
            type="button"
            onClick={() => {
              setTypeValue(typeValue === "text" ? "color" : "text");
            }}
          >
            {typeValue === "text" ? "Đổi sang màu" : "Đổi sang chữ"}
          </Button>

          {/* <Button className="self-end">asd</Button> */}
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
        <Button disabled={isUpdating} type="submit">
          {isUpdating ? "Đang cập nhật" : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
};
export default UpdateAttributeValuePage;
