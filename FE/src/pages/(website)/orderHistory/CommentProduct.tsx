import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import { z } from "zod";
import { useUserContext } from "@/common/context/UserProvider";
import { useCreateComment } from "./actions/useCreateComment";

interface IValuesProps {
  _id: string;
  name: string;
  type: string;
  value: string;
  updatedAt?: string | Date;
  deleted?: boolean;
}
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  // "image",
];

const formSchema = z.object({
  content: z.string().optional(),
  rating: z.number().optional(),
  infoProductBuy: z.string().optional(),
});

const CommentProduct = ({
  values,
  productId,
  orderId,
  itemId,
}: {
  values: IValuesProps[];
  productId: string;
  orderId: string;
  itemId: string;
}) => {
  const { _id } = useUserContext();
  const [rating, setRating] = useState(5);
  const { addComment, isAdding } = useCreateComment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      rating: +rating,
      infoProductBuy: "",
    },
  });

  const value = form.watch("content");

  const handleChange = (content: string) => {
    form.setValue("content", content); // Ghi giá trị vào React Hook Form
  };

  useEffect(() => {
    form.setValue(
      "infoProductBuy",
      values.map((value) => `${value.type}: ${value.name}`).join(",")
    );
  }, []);

  function onSubmit(results: z.infer<typeof formSchema>) {
    const { content, rating, infoProductBuy } = results;

    addComment({
      content: content || "",
      rating: rating || 5,
      infoProductBuy: infoProductBuy || "",
      productId,
      userId: _id,
      orderId,
      itemId,
    });

    // console.log({
    //   ...results,
    //   productId,
    //   userId: _id,
    //   orderId,
    //   itemId,
    // });
  }

  // console.log("orderId: ", orderId);
  if (isAdding) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center text-gray-500">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="ml-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Đánh giá</Button>
        </DialogTrigger>
        <DialogContent className="w-[90%] sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Viết đánh giá</DialogTitle>
            <DialogDescription>
              {values.map((value) => (
                <span className="block" key={value._id}>
                  - {`${value.type}: ${value.name}`}
                </span>
              ))}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-0.5">
            <span className="mr-1">Chất lượng:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => {
                  setRating(star);
                  form.setValue("rating", star);
                }}
              >
                ★
              </button>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ReactQuill
                className="bg-white mb-4"
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    ["link"],
                    // ["link", "image"],
                    ["clean"],
                  ],
                }}
                formats={formats}
              />

              <Input
                {...form.register("infoProductBuy")}
                type="hidden"
                value={values
                  .map((value) => `${value.type}: ${value.name}`)
                  .join(", ")}
              />
              <Button type="submit">Gửi</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentProduct;
