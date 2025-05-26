import {
  Accordion,
  AccordionItem
} from "@/components/ui/accordion";
import { useUser } from "@clerk/clerk-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import AvatarEditor from "react-avatar-editor";
import { FaCloudUploadAlt } from "react-icons/fa";

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthdate: string;
  image?: string | File;
}

interface ImageUserProps {
  form: {
    getValues: (field: keyof UserProfileData) => string | File;
    setValue: (field: keyof UserProfileData, value: string | File, options?: { shouldValidate?: boolean }) => void;
  };
}


const ImageUser = forwardRef(({ form }: ImageUserProps, ref) => {
  // State lưu ảnh hiện tại (URL hoặc file)
  const [previewImagesMain, setPreviewImagesMain] = useState<string | File>(
    form.getValues("image") || "" // Lấy giá trị ban đầu từ form nếu có
  );
  const [scale, setScale] = useState(1); // Thu phóng ảnh
  const { user } = useUser();
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Lưu file ảnh đã chọn
  const editorRef = useRef<AvatarEditor>(null); // Tham chiếu đến component AvatarEditor

  useEffect(() => {
    if (user?.imageUrl) {
      setPreviewImagesMain(user.imageUrl); // Hiển thị ảnh từ Clerk nếu có
    }
  }, [user?.imageUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Lưu ảnh vào state
      const reader = new FileReader(); // Tạo FileReader để đọc file
      reader.onloadend = () => {
        setPreviewImagesMain(reader.result as string); // Hiển thị ảnh mới
      };
      reader.readAsDataURL(file);
      form.setValue("image", file, { shouldValidate: false }); // Cập nhật giá trị vào form
    }
  };

  // Hàm cập nhật ảnh đại diện của người dùng
  const updateProfileImage = async () => {
    if (selectedImage && user && editorRef.current) {
      try {
        // Lấy canvas từ AvatarEditor và chuyển thành Blob
        const canvas = editorRef.current.getImageScaledToCanvas();
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((blob) => resolve(blob), "image/jpeg")
        );

        if (blob) {
          // Tạo file từ Blob
          const newFile = new File([blob], "profile.jpg", {
            type: "image/jpeg",
          });
          await user.setProfileImage({ file: newFile }); // Cập nhật ảnh đại diện qua Clerk
          await user.reload(); // Tải lại thông tin người dùng
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật ảnh đại diện:", error);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    updateProfileImage,
  }));


  return (
    <Accordion className="bg-white border px-4" type="multiple">
      <AccordionItem className="border-none" value="item-2">
        <div className="p-3 text-[18px] text-center">Ảnh người dùng</div>
        <div>
          <div className="mt-2 flex">
            <input
              className="input-file__image"
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Hiển thị ảnh và cho phép chỉnh sửa */}
          <div className="max-w-80 min-h-48 max-h-60 border border-dashed border-blue-300 cursor-pointer rounded p-1 flex items-center justify-center overflow-hidden">
            {previewImagesMain ? (
              <AvatarEditor
                ref={editorRef}
                image={previewImagesMain}
                width={1000} //  độ phân giải canvas
                height={1000} //  độ phân giải canvas
                border={0}
                scale={scale}
                className="rounded"
                style={{ width: "200px", height: "200px" }}
              />
            ) : (
              <FaCloudUploadAlt className="text-4xl text-blue-400" />
            )}
          </div>

          {/* Nút chọn ảnh */}
          <div className="flex justify-center mt-4">
            <button
            type="button"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              onClick={() => {
                const inputElement =
                  document.querySelector(".input-file__image");
                if (inputElement) {
                  (inputElement as HTMLInputElement).click();
                }
              }}
            >
              Chọn ảnh
            </button>
          </div>

          {/* Thanh trượt thu phóng */}
          {previewImagesMain && (
            <div className="mt-4">
              <label className="block mb-2 text-gray-700">Thu phóng:</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Xóa ảnh */}
          <p
            className="mt-2 text-red-500 underline cursor-pointer"
            onClick={() => {
              form.setValue("image", "");
              setPreviewImagesMain("");
              setSelectedImage(null);
            }}
          >
            Xóa ảnh
          </p>

        </div>
      </AccordionItem>
    </Accordion>
  );
});

export default ImageUser;
