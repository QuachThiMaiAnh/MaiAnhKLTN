import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ImageUser from "./ImageUser";
import { Button } from "@/components/ui/button";

interface ProfileImageRef {
  updateProfileImage: () => Promise<void>;
}
export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  image?: string | File;
  phone?: string; // Optional vì có thể để trống
  gender?: string; // Optional
  birthdate?: string; // Optional
}

const ProfilePageModern: React.FC = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [editField, setEditField] = useState<string | null>(null);
  const imageUserRef = useRef<ProfileImageRef>();
  const { toast } = useToast();
  const apiUrl = import.meta.env.VITE_API_URL;
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UserProfileData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      birthdate: "",
    },
  });

  const fetchUserData = async () => {
    if (user) {
      try {
        const response = await axios.get(`${apiUrl}/users/${user.id}`);
        const userData = response.data;

        setValue("firstName", user.firstName || "");
        setValue("lastName", user.lastName || "");
        setValue("email", user.primaryEmailAddress?.emailAddress || "");
        setValue("phone", userData.phone || "");
        setValue("gender", userData.gender || "");
        setValue("birthdate", userData.birthdate?.split("T")[0] || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchUserData();
    }
  }, [user, navigate]);

  const handleSaveChanges = async (data: UserProfileData) => {
    setIsLoading(true);
    console.log("Dữ liệu form gửi lên BE:", data);
    try {
      const formData = new FormData();
      (Object.keys(data) as (keyof UserProfileData)[]).forEach((key) => {
        if (data[key] !== "" && data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      console.log("FormData sau khi thêm dữ liệu:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      if (imageUserRef.current) {
        await imageUserRef.current.updateProfileImage();
      }

      const response = await axios.put(`${apiUrl}/users/${user?.id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        toast({
          className: "bg-green-400 text-white font-semibold h-auto",
          title: "Thành công",
          description: "Cập nhật thành công!",
        });
        await user?.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Thất bại",
          description: "Có lỗi xảy ra!",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi lưu dữ liệu.",
      });
    } finally {
      setIsLoading(false); // Kết thúc tải lên
    }
  };

  return (
    <div className="p-5 lg:px-16 rounded-xl mx-auto mb-32">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 border-zinc-400 mt-5">
        Hồ sơ của tôi
      </h1>
      <p className="text-green-500 mb-10">
        Cập nhật thông tin hồ sơ để bảo mật tài khoản!
      </p>

      <form
        onSubmit={handleSubmit(handleSaveChanges)}
        className="grid grid-cols-1 lg:grid-cols-2"
      >
        <div>
          {/* First Name and Last Name Fields */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:space-x-4 ">
              <div className="mb-3">
                <label className="block font-semibold text-gray-700 mb-2">
                  Họ
                </label>
                <input
                  type="text"
                  {...register("firstName", {
                    required: "Họ không được để trống",
                  })}
                  placeholder="Họ"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Tên
                </label>
                <input
                  type="text"
                  {...register("lastName", {
                    required: "Tên không được để trống",
                  })}
                  placeholder="Tên"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-8">
            <label className="block font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                {...register("email", {
                  required: "Email không được để trống",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="Email"
                readOnly={editField !== "email"}
                className={`border border-gray-300 rounded-lg px-3 py-2 w-full ${
                  editField === "email" ? "bg-white" : "bg-gray-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setEditField("email")}
                className=" w-20 text-blue-500 hover:text-blue-700"
              >
                Thay đổi
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Số điện thoại
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                {...register("phone", {
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Số điện thoại phải có 10 chữ số",
                  },
                })}
                placeholder="Số điện thoại"
                readOnly={editField !== "phone"}
                className={`border border-gray-300 rounded-lg px-3 py-2 w-full ${
                  editField === "phone" ? "bg-white" : "bg-gray-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setEditField("phone")}
                className="w-20 text-blue-500 hover:text-blue-700"
              >
                Thay đổi
              </button>
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Gender Selection */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Giới tính
            </label>
            {["Nam", "Nữ", "Khác"].map((gender) => (
              <label key={gender} className="mr-4">
                <input
                  type="radio"
                  value={gender}
                  {...register("gender")}
                  className="mr-1"
                />
                {gender}
              </label>
            ))}
          </div>

          {/* Birthdate Field */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              {...register("birthdate")}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            />
          </div>
        </div>

        {/* Profile Image Section */}

        <div className="md:px-10 mt-6 ">
          <ImageUser ref={imageUserRef} form={{ setValue, getValues }} />
        </div>
        {/* Save Changes Button */}
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150"
            disabled={isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePageModern;
