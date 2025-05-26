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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";
// import { useCreateAttribute } from "../actions/useCreateAttribute";
// import { useGetAttributeByID } from "../actions/useGetAttributeByID";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetCategoryByID } from "../actions/useGetCategoryByID";
import { useUpdateCategoryByID } from "../actions/useUpdateCategoryByID";
import { uploadFile } from "@/lib/upload";
import { toast } from "@/components/ui/use-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
// import { useUpdateAttributeByID } from "../actions/useUpdateAttributeByID";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Hãy viết tên danh mục",
  }),
  title: z.string().min(1, {
    message: "Hãy viết tiêu đề danh mục",
  }),
  image: z.union([
    z.string().url().or(z.literal("")), // URL hợp lệ hoặc chuỗi rỗng
    z.instanceof(File), // File là tùy chọn
  ]),
  description: z.string().min(1, {
    message: "Hãy viết mô tả danh mục",
  }),
});

const UpdateAttributePage = () => {
  const { id } = useParams<{ id: string }>();
  const { updateCategory, isUpdating } = useUpdateCategoryByID(id!);

  const [isLoading, setIsLoading] = useState(false);

  const { isLoadingCategory, category, error } = useGetCategoryByID(id!);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      image: "",
      description: "",
    },
  });

  const [previewImagesMain, setPreviewImagesMain] = useState<string | File>(
    form.getValues("image") || ""
  );

  console.log("category", previewImagesMain);

  // 2. Define a submit handler.
  useEffect(() => {
    if (category) {
      form.reset(category);
      setPreviewImagesMain(category.image);
    }
  }, [category, form]);

  if (isLoadingCategory) {
    return <div>Loading...</div>;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagesMain(reader.result as string); // Cập nhật preview với ảnh mới
      };
      reader.readAsDataURL(file);
      form.setValue("image", file); // Cập nhật giá trị ảnh trong form
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    let imageFormat = values.image;
    if (typeof values.image !== "string")
      imageFormat = await uploadFile(values.image as File);

    updateCategory({ ...values, image: imageFormat, _id: id });
    setIsLoading(false);
    toast({
      variant: "success",
      title: "Tạo danh mục thành công",
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ml-5">
        <h2 className="text-2xl font-medium">Cập nhật danh mục</h2>

        <div className="flex flex-col xl:flex-row gap-10">
          <div className="w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tên danh mục"
                      {...field}
                      className={`${
                        isLoading || isUpdating
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề danh mục</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tiêu đề danh mục"
                      {...field}
                      className={`${
                        isLoading || isUpdating
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả danh mục</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả danh mục"
                      rows={7}
                      {...field}
                      className={`${
                        isLoading || isUpdating
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full xl:w-1/2">
            <Accordion
              className="bg-white border px-4"
              type="single"
              collapsible
              defaultValue="item-2"
            >
              <AccordionItem className="border-none" value="item-2">
                <AccordionTrigger className="no-underline">
                  Ảnh danh mục
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2 flex">
                    <input
                      className="input-file__image"
                      {...form.register("image")}
                      type="file"
                      hidden
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Preview Image */}
                  <div
                    onClick={() => {
                      const inputElement =
                        document.querySelector(".input-file__image");
                      if (inputElement) {
                        (inputElement as HTMLInputElement).click();
                      }
                    }}
                    className="w-full min-h-56 max-h-56 border border-dashed border-blue-300 cursor-pointer rounded p-1 flex items-center justify-center overflow-hidden"
                  >
                    {previewImagesMain ? (
                      <img
                        src={
                          typeof previewImagesMain === "string"
                            ? previewImagesMain
                            : ""
                        }
                        alt="Preview"
                        className="object-contain w-40 h-full"
                      />
                    ) : (
                      <FaCloudUploadAlt className="text-4xl text-blue-400" />
                    )}
                  </div>

                  <p
                    className="mt-2 text-red-500 underline cursor-pointer"
                    onClick={() => {
                      form.setValue("image", "");
                      setPreviewImagesMain("");
                    }}
                  >
                    Xóa ảnh
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <Button
          disabled={isUpdating}
          type="submit"
          className={`${isLoading || isUpdating ? "opacity-30" : ""}`}
        >
          {isUpdating ? "Đang tạo danh mục ..." : "Tạo danh mục"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateAttributePage;
