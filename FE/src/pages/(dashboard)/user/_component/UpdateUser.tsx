import { updateUserResponse, User } from "@/common/types/User";
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
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

interface EditUserFormProps {
  onClose: () => void;
  onSuccess: (updatedUser: updateUserResponse) => void;
  userData: User; // Thông tin người dùng
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  onClose,
  onSuccess,
  userData,
}) => {
  // const { clerkId } = useParams<{ clerkId: string }>();
  const [canChangeRole, setCanChangeRole] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: userData, // Đặt giá trị mặc định là dữ liệu người dùng hiện tại
  });

  const { toast } = useToast();
  const { user } = useUser();
  const { id } = useParams();

  // Kiểm tra số lượng admin còn lại trong hệ thống
  const checkAdminCount = async () => {
    setIsChecking(true);
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      // console.log("Dữ liệu nhận được từ server:", response.data);
      // Truy cập vào mảng nằm trong response.data.data
      const users = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      const adminCount = users.filter(
        (user: User) => user.role === "Admin"
      ).length;
      // console.log("Số lượng admin:", adminCount);
      return adminCount > 2;
    } catch (error) {
      console.error("Error checking admin count", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (!id) document.title = "Cập Nhật Thông Tin Người Dùng";
    const fetchAdminPermission = async () => {
      const canChange = await checkAdminCount();
      setCanChangeRole(canChange); // Cập nhật trạng thái có thể thay đổi vai trò hay không
    };

    fetchAdminPermission();
  }, [id]);

  useEffect(() => {
    if (userData) {
      const sanitizedUserData = { ...userData, password: "" };
      reset(sanitizedUserData);
    }
  }, [userData, reset]);

  const onSubmit = async (updatedUser: User) => {
    // Gửi mật khẩu gốc cho backend nếu có nhập
    if (updatedUser.password) {
      updatedUser.passwordPlaintext = updatedUser.password; // Gửi mật khẩu gốc
    } else {
      delete updatedUser.password; // Xóa nếu không thay đổi
    }
    console.log("Dữ liệu gửi đi:", updatedUser);

    try {
      // Gửi yêu cầu cập nhật thông tin người dùng
      const response = await axios.put(
        `http://localhost:8080/api/users/${updatedUser.clerkId}`,
        updatedUser
      );

      //   console.log(response.data);

      if (response.status === 200) {
        if (user?.id === updatedUser.clerkId) {
          // Nếu role thay đổi, cập nhật lại trong localStorage
          localStorage.setItem("userRole", updatedUser.role);
        }
        // Reload lại session hoặc điều hướng đến trang login
        await user?.reload();
        toast({
          className: "bg-green-400 text-white h-auto",
          title: "Thông tin người dùng đã được cập nhật!",
        });
        // console.log("Cập nhật thành công:", response.data);
        onSuccess(response.data);
        onClose(); // Đóng form
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error: unknown) {
      // Kiểm tra lỗi từ backend
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const backendMessage = error.response.data.message;
        const backendErrors = error.response.data.errors;

        // Xử lý lỗi từ backend
        if (backendErrors) {
          backendErrors.forEach((err: { code: string; message: string }) => {
            // Kiểm tra mã lỗi và thông báo lỗi cụ thể
            if (err.code === "form_identifier_exists") {
              setError("email", {
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
              title: "Lỗi cập nhật",
              description: err.message || "Có lỗi xảy ra. Vui lòng thử lại.",
            });
          });
        } else {
          // Hiển thị lỗi tổng quát nếu không có chi tiết
          toast({
            variant: "destructive",
            title: "Cập nhật thất bại",
            description: backendMessage || "Có lỗi xảy ra. Vui lòng thử lại.",
          });
        }
      }
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center">
      <Card className="w-full max-w-md my-3">
        <CardHeader>
          <CardTitle className="text-center">Chỉnh sửa thông tin</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Cập nhật thông tin cá nhân của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            id="edit-user-form"
          >
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="example@example.com"
                className="w-full border rounded px-4 py-2 "
                autoFocus
              />
              {errors.email?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            {/* Họ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Họ</label>
              <input
                type="text"
                {...register("firstName", { required: "Họ là bắt buộc" })}
                placeholder="Nguyễn"
                className="w-full border rounded px-4 py-2 "
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.firstName.message)}
                </p>
              )}
            </div>

            {/* Tên */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Tên
              </label>
              <input
                type="text"
                {...register("lastName", { required: "Tên là bắt buộc" })}
                placeholder="Văn A"
                className="w-full border rounded px-4 py-2 "
              />
              {errors.lastName?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.lastName.message)}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự",
                  },
                })}
                placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            {/* Vai trò */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Vai trò
              </label>
              <select
                {...register("role")}
                className={`w-full border rounded px-4 py-2 ${
                  !canChangeRole || isChecking
                    ? "cursor-not-allowed bg-gray-200"
                    : ""
                }`}
                disabled={!canChangeRole || isChecking} // Disable khi đang kiểm tra hoặc không đủ điều kiện
              >
                <option value="Admin">Quản trị</option>
                <option value="User">Người dùng</option>
              </select>
              {isChecking && (
                <p className="text-blue-500 text-sm mt-1">
                  Đang kiểm tra điều kiện...
                </p>
              )}
              {!isChecking && !canChangeRole && (
                <p className="text-red-500 text-sm mt-1">
                  Không thể thay đổi vai trò người dùng. Hệ thống yêu cầu phải
                  có ít nhất 2 Admin.
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button
            type="button"
            className="bg-slate-100"
            onClick={onClose}
            variant="outline"
          >
            Hủy
          </Button>
          <Button form="edit-user-form" type="submit">
            Cập nhật
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditUserForm;
