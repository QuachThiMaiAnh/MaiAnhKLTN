import { FormTypeProductVariation } from "@/common/types/validate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

// Component nhận props form từ React Hook Form
const ProductImage = ({ form }: { form: FormTypeProductVariation }) => {
  // Lấy ảnh ban đầu từ form (nếu có), để hiển thị preview
  const [previewImagesMain, setPreviewImagesMain] = useState<string | File>(
    form.getValues("image") || ""
  );

  // Hàm xử lý khi người dùng chọn ảnh từ input
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; // Lấy file đầu tiên từ danh sách đã chọn
    if (file) {
      const reader = new FileReader(); // Tạo đối tượng đọc file
      reader.onloadend = () => {
        setPreviewImagesMain(reader.result as string); // Gán dữ liệu base64 vào preview
      };
      reader.readAsDataURL(file); // Đọc file thành chuỗi base64

      // Gán file ảnh vào trường image của form (React Hook Form quản lý)
      form.setValue("image", file);
    }
  }

  return (
    <Accordion
      className="bg-white border px-4"
      type="single"
      collapsible
      defaultValue="item-2"
    >
      <AccordionItem className="border-none" value="item-2">
        <AccordionTrigger className="no-underline font-bold">
          Ảnh đại diện
        </AccordionTrigger>

        <AccordionContent>
          {/* Input file ẩn, sẽ được trigger bằng click vào vùng preview */}
          <div className="mt-2 flex">
            <input
              className="input-file__image"
              {...form.register("image")} // React Hook Form đăng ký field "image"
              type="file"
              hidden
              onChange={handleImageChange} // Xử lý chọn ảnh
            />
          </div>

          {/* Vùng preview ảnh hoặc biểu tượng upload */}
          <div
            onClick={() => {
              // Khi click vào vùng này, tìm input và click nó
              const inputElement = document.querySelector(".input-file__image");
              if (inputElement) {
                (inputElement as HTMLInputElement).click();
              }
            }}
            className="w-full min-h-56 max-h-56 border border-dashed border-blue-300 cursor-pointer rounded p-1 flex items-center justify-center overflow-hidden"
          >
            {previewImagesMain ? (
              <img
                src={
                  typeof previewImagesMain === "string" ? previewImagesMain : ""
                }
                alt="Preview"
                className="object-contain w-40 h-full"
              />
            ) : (
              <FaCloudUploadAlt className="text-4xl text-blue-400" />
            )}
          </div>

          {/* Nút xoá ảnh (reset preview + reset giá trị form) */}
          <p
            className="mt-2 text-red-500 underline cursor-pointer"
            onClick={() => {
              form.setValue("image", ""); // Xoá giá trị trong form
              setPreviewImagesMain(""); // Xoá ảnh hiển thị
            }}
          >
            Xóa ảnh
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductImage;

/**
 * Cho phép người dùng chọn một ảnh đại diện từ thiết bị.
 *
 * Hiển thị ảnh vừa chọn (preview) ngay trong giao diện.
 *
 * Cập nhật ảnh vào form để gửi cùng dữ liệu sản phẩm.
 *
 * Cho phép xóa ảnh đã chọn và đặt lại giá trị ban đầu.
 */
