import { zodResolver } from "@hookform/resolvers/zod"; // Thư viện để tích hợp Zod với React Hook Form
import { useForm } from "react-hook-form"; // React Hook Form để quản lý form state
import { z } from "zod"; // Zod là thư viện để xác thực dữ liệu

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
} from "@/components/ui/accordion"; // Accordion để hiển thị ảnh danh mục

import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom"; // useParams để lấy tham số từ URL
import { useEffect, useState } from "react";
import { useGetCategoryByID } from "../actions/useGetCategoryByID";
import { useUpdateCategoryByID } from "../actions/useUpdateCategoryByID";
import { uploadFile } from "@/lib/upload"; // Hàm upload file ảnh
import { toast } from "@/components/ui/use-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";

// Xác thực schema với zod, đảm bảo các trường cần thiết phải có
const formSchema = z.object({
  name: z.string().min(1, { message: "Hãy viết tên danh mục" }),
  title: z.string().min(1, { message: "Hãy viết tiêu đề danh mục" }),
  image: z.union([z.string().url().or(z.literal("")), z.instanceof(File)]),
  description: z.string().min(1, { message: "Hãy viết mô tả danh mục" }),
});

const UpdateCategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { updateCategory, isUpdating } = useUpdateCategoryByID(id!);

  const [previewImage, setPreviewImage] = useState<string>("");

  const { isLoading: isFetching, category } = useGetCategoryByID(id!);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      image: "",
      description: "",
    },
  });

  // Khi dữ liệu category được tải xong, cập nhật lại giá trị form và ảnh preview
  useEffect(() => {
    if (category) {
      form.reset(category);
      setPreviewImage(category.image);
    }
  }, [category, form]);

  // Hiển thị loading khi đang tải dữ liệu danh mục từ server
  if (isFetching) return <div>Loading...</div>;

  // Khi người dùng chọn ảnh mới từ máy
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string); // Cập nhật ảnh preview từ dữ liệu đọc
      reader.readAsDataURL(file);
      form.setValue("image", file); // Gán file ảnh vào trường image của form
    }
  };

  // Xử lý khi submit form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let imageUpload = values.image;

      // Nếu ảnh là File thì upload lên, ngược lại giữ nguyên
      if (values.image instanceof File) {
        imageUpload = await uploadFile(values.image);
      }

      await updateCategory({ ...values, image: imageUpload, _id: id });
      toast({ variant: "success", title: "Cập nhật danh mục thành công" });
    } catch (err) {
      toast({ variant: "destructive", title: "Cập nhật thất bại" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ml-5">
        <h2 className="text-2xl font-medium">Cập nhật danh mục</h2>

        <div className="flex flex-col xl:flex-row gap-10">
          {/* Cột trái: Thông tin text */}
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                      disabled={isUpdating}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cột phải: ảnh danh mục */}
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
                      form.setValue("image", "");
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
          disabled={isUpdating}
          className={isUpdating ? "opacity-30" : ""}
        >
          {isUpdating ? "Đang cập nhật..." : "Cập nhật danh mục"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateCategoryPage;
