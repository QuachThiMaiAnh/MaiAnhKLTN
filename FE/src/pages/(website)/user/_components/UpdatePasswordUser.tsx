import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function ChangePassword() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleChangePassword: SubmitHandler<FormValues> = async (data) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (!user) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Người dùng chưa đăng nhập!",
      });
      return;
    }

    if (newPassword === currentPassword) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Mật khẩu mới không được giống với mật khẩu hiện tại!",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp!",
      });
      return;
    }

    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được cập nhật thành công!",
      });
      navigate("/users");
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi cập nhật mật khẩu!",
      });
      console.error('Lỗi khi cập nhật mật khẩu', error)
      if (error instanceof Error) {
        const errorMessage = error.message;
      // Xử lý lỗi trả về từ Clerk
      if (errorMessage.includes("Passwords validation failed")) {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: "Mật khẩu hiện tại không chính xác!",
        });
      } else if (
        errorMessage.includes("Given password is not strong enough")
      ) {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: "Mật khẩu không đủ mạnh. Vui lòng sử dụng mật khẩu có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái viết hoa và một số hoặc ký tự đặc biệt.",
        });
      } else if (
        errorMessage.includes(
          "Password has been found in an online data breach"
        )
      ) {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: "Mật khẩu mới đã xuất hiện trong các vụ rò rỉ dữ liệu. Vui lòng chọn mật khẩu khác an toàn hơn.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: "Có lỗi sảy ra khi cập nhật mật khẩu!",
        });
      }
    }
  }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Đổi Mật Khẩu</h2>
      <p className="text-sm text-green-400 mb-6">
        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác!
      </p>
      <hr />
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-8">
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-6"
        >
          {/* Mật khẩu hiện tại */}
          <div className="sm:flex flex-col sm:flex-row items-center sm:gap-10">
            <label
              htmlFor="currentPassword"
              className="sm:w-1/5 text-gray-700 font-medium text-end"
            >
              Mật Khẩu Hiện Tại:
            </label>
            <div className="sm:w-2/3">
              <input
                id="currentPassword"
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                {...register("currentPassword", {
                  required: "Mật khẩu hiện tại không được để trống",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu hiện tại phải có ít nhất 8 ký tự",
                  },
                  // validate: {
                  //   hasUpperCase: (value) =>
                  //     /[A-Z]/.test(value) ||
                  //     "Mật khẩu hiện tại phải có ít nhất một chữ cái viết hoa",
                  //   hasDigitOrSpecialChar: (value) =>
                  //     /\d/.test(value) ||
                  //     /[!@#$%^&*]/.test(value) ||
                  //     "Mật khẩu hiện tại phải chứa ít nhất một số hoặc ký tự đặc biệt",
                  // },
                })}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Mật khẩu mới */}
          <div className="sm:flex flex-col sm:flex-row items-center sm:gap-10">
            <label
              htmlFor="newPassword"
              className="w-1/5 text-gray-700 font-medium text-end"
            >
              Mật Khẩu Mới:
            </label>
            <div className="sm:w-2/3">
              <input
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                {...register("newPassword", {
                  required: "Mật khẩu mới không được để trống",
                  minLength: {
                    value: 8,
                    message: "Mật khẩu mới phải có ít nhất 8 ký tự",
                  },
                  // validate: {
                  //   hasUpperCase: (value) =>
                  //     /[A-Z]/.test(value) ||
                  //     "Mật khẩu mới phải có ít nhất một chữ cái viết hoa",
                  //   hasDigitOrSpecialChar: (value) =>
                  //     /\d/.test(value) ||
                  //     /[!@#$%^&*]/.test(value) ||
                  //     "Mật khẩu mới phải chứa ít nhất một số hoặc ký tự đặc biệt",
                  // },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="sm:flex flex-col sm:flex-row items-center sm:gap-10">
            <label
              htmlFor="confirmPassword"
              className="w-1/5 text-gray-700 font-medium text-end"
            >
              Xác Nhận Mật Khẩu:
            </label>
            <div className="sm:w-2/3">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                {...register("confirmPassword", {
                  required: "Xác nhận mật khẩu không được để trống",
                  validate: (value) =>
                    value ===
                      (
                        document.getElementById(
                          "newPassword"
                        ) as HTMLInputElement
                      )?.value ||
                    "Mật khẩu xác nhận không khớp với mật khẩu mới",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Nút Xác Nhận */}
          <div className="flex items-center justify-center sm:justify-normal sm:gap-10">
            <div className="sm:w-1/5"></div>
            <div className="sm:w-2/3 flex items-center justify-between">
              <button
                type="submit"
                className="w-40 bg-[#b8cd06] text-white font-medium py-2 rounded-md transition"
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;