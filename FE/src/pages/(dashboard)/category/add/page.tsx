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
import { useCreateCategory } from "../actions/useCreateCategory";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/lib/upload";

// Note: Lược sử dụng để xác thực dữ liệu đầu vào của form
const formSchema = z.object({
  name: z.string().min(1, { message: "Hãy viết tên danh mục" }),
  title: z.string().min(1, { message: "Hãy viết tiêu đề danh mục" }),
  image: z.union([z.string().url().or(z.literal("")), z.instanceof(File)]),
  description: z.string().min(1, { message: "Hãy viết mô tả danh mục" }),
});

const CategoryAddPage = () => {
  const { createCategory, isCreating } = useCreateCategory(); // Note: Sử dụng hook để gọi API tạo danh mục
  const [previewImage, setPreviewImage] = useState<string>(""); // Note: State để lưu preview ảnh

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Note: Sử dụng zod để xác thực dữ liệu form
    defaultValues: {
      name: "",
      title: "",
      image: "",
      description: "",
    },
  });

  // Note: Cập nhật preview và giá trị ảnh trong form
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Lấy file đầu tiên nếu có

    // Nếu có file, đọc nó và cập nhật preview
    if (file) {
      const reader = new FileReader(); // Tạo FileReader để đọc file
      reader.onloadend = () => setPreviewImage(reader.result as string); // Cập nhật preview khi đọc xong
      reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
      form.setValue("image", file); // Cập nhật giá trị ảnh trong form
    }
  };

  // Note: Submit handler xử lý upload ảnh nếu cần, sau đó gọi API tạo danh mục
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let finalImage = values.image;

      // Nếu là File thì mới upload
      if (values.image instanceof File) {
        finalImage = await uploadFile(values.image); // Upload file và lấy URL
      }

      // Gọi API tạo danh mục với giá trị đã chuẩn bị
      await createCategory({ ...values, image: finalImage });
      form.reset(); // Reset lại form sau khi tạo thành công
      setPreviewImage("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ml-5">
        <h2 className="text-2xl font-medium">Thêm danh mục</h2>

        <div className="flex flex-col xl:flex-row gap-10">
          {/* Cột trái: Thông tin văn bản */}
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
                      disabled={isCreating}
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
                      disabled={isCreating}
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
                      disabled={isCreating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cột phải: Ảnh danh mục */}
          <div className="w-full xl:w-1/2">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-2"
              className="bg-white border px-4"
            >
              <AccordionItem value="item-2" className="border-none">
                <AccordionTrigger className="no-underline">
                  Ảnh danh mục
                </AccordionTrigger>
                <AccordionContent>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-file__image"
                  />

                  <div
                    onClick={() =>
                      document.querySelector(".input-file__image")?.click()
                    }
                    className="w-full min-h-56 max-h-56 border border-dashed border-blue-300 cursor-pointer rounded p-1 flex items-center justify-center overflow-hidden"
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
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
                      form.setValue("image", ""); // Reset giá trị ảnh trong form
                      setPreviewImage("");
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
          type="submit"
          disabled={isCreating}
          className={isCreating ? "opacity-30" : ""}
        >
          {isCreating ? "Đang tạo danh mục..." : "Tạo danh mục"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryAddPage;
