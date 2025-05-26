import { updateUserResponse, User } from "@/common/types/User";
import Confirm from "@/components/Confirm/Confirm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { SignedIn, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import EditUserForm from "./UpdateUser";
import PaginationComponent from "./Paginations";

function ListUser() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpendelete, setModalOpendelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmBanOpen, setConfirmBanOpen] = useState(false);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [isConfirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [userToRestore, setUserToRestore] = useState<User | null>(null);
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [roleFilter, setRoleFilter] = useState<"User" | "Admin">("User");
  const { id } = useParams();
  const totalUsers = allUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  useEffect(() => {
    if (!id) document.title = "Danh Sách Người Dùng";
  }, [id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [includeDeleted]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/users`);

      const usersData = Array.isArray(res.data?.data) ? res.data.data : [];

      setAllUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm lọc user theo vai trò và tìm kiếm
  const filteredUsers = allUsers.filter(
    (u) =>
      u.clerkId !== user?.id && // Bỏ tài khoản hiện tại
      u.role === roleFilter && // Lọc theo vai trò
      (u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Lấy danh sách user hiển thị trên trang hiện tại
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const result = parts.pop();
      return result ? result.split(";").shift() : null;
    }

    return null;
  };

  const softDeleteUser = async (clerkId: string) => {
    const token = getCookie("__session") || localStorage.getItem("token");

    if (!token) {
      toast({
        variant: "destructive",
        title: "Xác thực thất bại",
        description: "Không tìm thấy token, vui lòng đăng nhập lại.",
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/users/soft-delete/${clerkId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        className: "bg-green-400 text-white h-auto",
        title:
          "Tài khoản đã được xóa thành công, có thể khôi phục được tài khoản!",
      });
      setAllUsers((prevUsers) =>
        prevUsers.filter((user) => user.clerkId !== clerkId)
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xóa mềm thất bại",
        description: "Có lỗi xảy ra khi xóa tài khoản.",
      });
      console.error("Lỗi khi xóa tài khoản:", error);
    }
  };

  const restoreSoftDeletedUser = async (clerkId: string) => {
    const token = getCookie("__session") || localStorage.getItem("token");

    if (!token) {
      toast({
        variant: "destructive",
        title: "Xác thực thất bại",
        description: "Không tìm thấy token, vui lòng đăng nhập lại.",
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/users/restore/${clerkId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Tài khoản đã được khôi phục thành công!",
      });

      fetchUsers();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Khôi phục thất bại",
        description: "Có lỗi xảy ra khi khôi phục tài khoản.",
      });
      console.error("Lỗi khi khôi phục tài khoản:", error);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setModalOpendelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      softDeleteUser(selectedUser.clerkId);
      setModalOpendelete(false);
    }
  };

  // hàm khôi phục tài khoản
  const handleRestoreClick = (user: User) => {
    setUserToRestore(user);
    setConfirmRestoreOpen(true);
  };

  // hàm xác nhận khôi phục
  const handleConfirmRestore = async () => {
    if (userToRestore) {
      await restoreSoftDeletedUser(userToRestore.clerkId);
      setConfirmRestoreOpen(false);
    }
  };

  const toggleActivation = async (clerkId: string, isBanned: boolean) => {
    try {
      if (isBanned) {
        await axios.post(`http://localhost:8080/api/users/unban/${clerkId}`);
        toast({
          className: "bg-green-400 text-white h-auto",
          title: "Tài khoản đã được mở khóa thành công!",
        });
      } else {
        await axios.post(`http://localhost:8080/api/users/ban/${clerkId}`);
        toast({
          className: "bg-green-400 text-white h-auto",
          title: "Tài khoản đã được khóa thành công!",
        });
      }
      // Cập nhật lại trạng thái của người dùng trong danh sách allUsers
      setAllUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.clerkId === clerkId ? { ...user, isBanned: !isBanned } : user
        )
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Khóa tài khoản thất bại",
        description: "Có lỗi xảy ra khi khóa tài khoản người dùng.",
      });
      console.error("Error updating user status:", error);
    }
  };

  const handleBanClick = (user: User) => {
    setUserToBan(user);
    setConfirmBanOpen(true);
  };

  const handleConfirmBan = async () => {
    if (userToBan) {
      await toggleActivation(userToBan.clerkId, userToBan.isBanned);
      setConfirmBanOpen(false);
    }
  };

  // Cập nhật hàm để mở modal khi nhấn "Edit"
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true); // Mở modal
  };

  const handleSuccessUpdate = (updatedUser: updateUserResponse) => {
    // console.log("Dữ liệu cập nhật:", updatedUser);
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.clerkId === updatedUser.data.clerkId
          ? { ...user, ...updatedUser.data }
          : user
      )
    );

    setSelectedUser(null);
    setModalOpen(false); // Đóng modal
    toast({
      className: "bg-green-400 text-white h-auto",
      title: "Danh sách đã được cập nhật.",
    });
  };

  return (
    <div className="">
      <SignedIn>
        <div className="">
          <h1 className="text-2xl sm:text-3xl pb-10 text-center font-semibold text-gray-900 uppercase">
            Danh Sách người dùng
          </h1>

          <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-center xl:justify-between">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border xl:w-[300px] py-2 rounded-md"
            />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as "User" | "Admin")
                }
                className="border px-4 py-2 rounded-md cursor-pointer"
              >
                <option value="User">Người dùng</option>
                <option value="Admin">Quản trị</option>
              </select>

              <select
                value={includeDeleted ? "deleted" : "active"}
                onChange={(e) =>
                  setIncludeDeleted(e.target.value === "deleted")
                }
                className="border w-full sm:w-auto px-4 py-2 rounded-md"
              >
                <option value="active">Tài khoản đang hoạt động</option>
                <option value="deleted">Tài khoản đã bị xóa</option>
              </select>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {user?.publicMetadata?.role === "Admin" ? (
                  <DialogTrigger asChild>
                    <DialogTitle
                      onClick={(e) => {
                        // Kiểm tra quyền khi nhấn vào nút
                        if (user?.publicMetadata?.role !== "Admin") {
                          e.preventDefault();
                          // Nếu không phải Admin, hiển thị toast thông báo và ngừng mở form
                          toast({
                            variant: "destructive", // Toast hiển thị màu đỏ (thông báo lỗi)
                            title: "Quyền truy cập bị từ chối",
                            description:
                              "Chỉ Admin mới có thể tạo người dùng mới.", // Mô tả lỗi
                          });
                          return; // Ngừng thực hiện hành động mở form
                        }
                        // Nếu là Admin, mở Dialog
                        setIsOpen(true);
                      }}
                      className="px-6 w-[180px] sm:w-auto font-normal text-[15px] cursor-pointer flex items-center gap-2  py-2 rounded-md bg-black text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                      </svg>
                      Thêm tài khoản
                    </DialogTitle>
                  </DialogTrigger>
                ) : null}

                {/* Nội dung modal */}
                <DialogContent className="p-0">
                  <RegisterForm
                    onClose={() => setIsOpen(false)} // hàm đóng form
                    onSuccess={fetchUsers} // Hàm cập nhật danh sách người dùng
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className=" grid overflow-x-auto bg-white my-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tên đầy đủ
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                {roleFilter !== "Admin" && (
                  <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-800">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.clerkId}>
                    <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                      <img
                        src={user.imageUrl}
                        alt="User Avatar"
                        className="w-12 h-12 object-contain rounded"
                      />
                    </td>
                    <td
                      onClick={() =>
                        navigate(`/admin/users/detail/${user.clerkId}`)
                      }
                      className="px-6 py-5 border-b border-gray-200 bg-white text-blue-500 text-sm underline cursor-pointer"
                    >
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm  ">
                      {user.email}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm   ">
                      {user.role}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                      {user.isDeleted ? (
                        <span className="text-gray-600 font-semibold">
                          Đã xóa
                        </span>
                      ) : user.isBanned ? (
                        <span className="text-red-600 font-semibold">
                          Đã khóa
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          Hoạt động
                        </span>
                      )}
                    </td>
                    {roleFilter !== "Admin" && (
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm items-center flex mt-[15px]">
                        <>
                          {user.isDeleted ? (
                            <button
                              onClick={() => handleRestoreClick(user)}
                              className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Khôi phục
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleBanClick(user)}
                                className={`mr-4 ${
                                  user.isBanned
                                    ? "bg-green-500"
                                    : "bg-amber-500"
                                } hover:bg-opacity-75 text-white font-bold py-2 px-4 rounded`}
                              >
                                {user.isBanned ? "Mở khóa" : "Khóa"}
                              </button>

                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="text-red-600 font-bold py-2 px-4 rounded mr-3"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              <button
                                onClick={() => handleEditUser(user)}
                                className=" font-bold py-2 px-4 rounded"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 16 16"
                                  fill="currentColor"
                                  className="size-5"
                                >
                                  <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                                  <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                                </svg>
                              </button>
                            </>
                          )}
                        </>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-red-500">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Modal hiển thị form chỉnh sửa */}
          {selectedUser && (
            <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
              <DialogTitle></DialogTitle>
              <DialogContent>
                <EditUserForm
                  onClose={() => {
                    setModalOpen(false);
                    setSelectedUser(null);
                  }}
                  onSuccess={handleSuccessUpdate}
                  userData={selectedUser}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </SignedIn>

      {/*phân trang  */}
      <div className="mt-4">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={itemsPerPage}
        />
      </div>

      <Confirm
        isOpen={isModalOpendelete}
        onClose={() => setModalOpendelete(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa user "<strong>${selectedUser?.firstName} ${selectedUser?.lastName}</strong>" ?`}
      />

      <Confirm
        isOpen={isConfirmRestoreOpen}
        title="Xác nhận khôi phục tài khoản"
        message={`Bạn có chắc chắn muốn khôi phục tài khoản "<strong>${userToRestore?.firstName} ${userToRestore?.lastName}</strong>"?`}
        onClose={() => setConfirmRestoreOpen(false)}
        onConfirm={handleConfirmRestore}
      />

      {isConfirmBanOpen && (
        <Confirm
          isOpen={isConfirmBanOpen}
          title={`Xác nhận ${
            userToBan?.isBanned ? "mở khóa" : "khóa"
          } tài khoản`}
          message={`Bạn có chắc chắn muốn ${
            userToBan?.isBanned ? "mở khóa" : "khóa"
          } tài khoản của "<strong>${userToBan?.firstName} ${
            userToBan?.lastName
          }</strong>" ?`}
          onClose={() => setConfirmBanOpen(false)}
          onConfirm={handleConfirmBan}
        />
      )}
    </div>
  );
}

export default ListUser;
