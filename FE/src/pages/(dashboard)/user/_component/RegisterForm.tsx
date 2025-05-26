import { BackendError, Errors } from "@/common/types/User";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

export interface User {
  _id?: string;
  userId?: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: "Admin" | "User";
  imageUrl?: string;
}

interface RegisterFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setError,
    reset, 
    formState: { errors },
  } = useForm<User>();

  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    if (!id) document.title = "Thêm Tài Khoản";
  }, [id]);

  const onSubmit = async (data: User) => {
    try {
      await axios.post("http://localhost:8080/api/users/create-user", data);
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Tài khoản đã được tạo thành công!",
      });
      reset(); // Reset form
      onClose(); // Đóng form
      onSuccess(); // Cập nhật danh sách người dùng
    } catch (err: unknown) {
      const error = err as Errors;
      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message;
        const backendErrors = error.response.data.errors;
  
        // Xử lý lỗi cụ thể từ backend
        if (backendErrors) {
          backendErrors.forEach((err: BackendError) => {
            if (err.code === "form_identifier_exists") {
              setError("emailAddress", {
                type: "manual",
                message: "Email đã được sử dụng. Vui lòng thử email khác.",
              });
            }
  
            if (err.code === "form_password_pwned") {
              setError("password", {
                type: "manual",
                message: "Mật khẩu yếu. Vui lòng chọn mật khẩu mạnh hơn.",
              });
            }
  
            // Hiển thị lỗi trong toast
            toast({
              variant: "destructive",
              title: "Lỗi đăng ký",
              description: err.message,
            });
          });
        } else {
          // Hiển thị lỗi tổng quát nếu không có chi tiết
          toast({
            variant: "destructive",
            title: "Đăng ký thất bại",
            description: backendMessage || "Có lỗi xảy ra. Vui lòng thử lại.",
          });
        }
      } else {
        // Lỗi kết nối hoặc lỗi không xác định
        toast({
          variant: "destructive",
          title: "Đăng ký thất bại",
          description: "Không thể kết nối với server. Vui lòng thử lại sau.",
        });
      }
    }
  };
  
  

  return (
    <div className="min-h-full flex items-center justify-center px-4 rounded-lg sm:px-6 lg:px-8 ">
      <Card className="w-full max-w-md my-8 ">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription className="text-center text-gray-500 text-sm sm:text-base">
            Điền thông tin bên dưới để tạo tài khoản mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            id="register-form"
          >
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Email
              </label>
              <input
                type="email"
                {...register("emailAddress", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="example@example.com"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 text-sm sm:text-base"
              />
              {errors.emailAddress?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.emailAddress.message)}
                </p>
              )}
            </div>
  
            {/* Họ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Họ</label>
              <input
                type="text"
                {...register("firstName", { required: "Họ là bắt buộc" })}
                placeholder="Nguyễn"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 text-sm sm:text-base"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.firstName.message)}
                </p>
              )}
            </div>
  
            {/* Tên */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Tên
              </label>
              <input
                type="text"
                {...register("lastName", { required: "Tên là bắt buộc" })}
                placeholder="Văn A"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 text-sm sm:text-base"
              />
              {errors.lastName?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.lastName.message)}
                </p>
              )}
            </div>
  
            {/* Mật khẩu */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Mật khẩu
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                })}
                placeholder="Mật khẩu"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 text-sm sm:text-base"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
  
            {/* Vai trò */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Role (Mặc định: User)
              </label>
              <select
                {...register("role")}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 text-sm sm:text-base"
              >
                <option value="Admin">Quản trị</option>
                <option value="User">Người dùng</option>
              </select>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" form="register-form" type="submit">
            Đăng ký
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  
};

export default RegisterForm;