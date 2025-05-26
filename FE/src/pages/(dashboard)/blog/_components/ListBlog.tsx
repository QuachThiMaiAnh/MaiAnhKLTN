import { Blog } from "@/common/types/Blog";
import Confirm from "@/components/Confirm/Confirm";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PaginationComponent from "../../user/_component/Paginations";

const ListBlog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [Delete, setToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    if (!id) document.title = "Danh Sách Bài Viết";
  }, [id]);

  const currentBlogs = Array.isArray(filteredBlogs)
    ? filteredBlogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/category")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/blogs")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
          setFilteredBlogs(data);
        } else {
          // console.error("API không trả về mảng hợp lệ:", data);
          setBlogs([]);
          setFilteredBlogs([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi lấy dữ liệu bài viết");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Lọc bài viết khi người dùng thay đổi từ khóa tìm kiếm
    const result = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(result);
    setCurrentPage(1); // Reset về trang 1 mỗi khi thay đổi query tìm kiếm
  }, [searchQuery, blogs]);

  const openConfirmDeleteDialog = (id: string, title: string) => {
    setToDelete({ id, title });
    setIsConfirmDeleteOpen(true);
  };

  const closeConfirmDeleteDialog = () => {
    setIsConfirmDeleteOpen(false);
    setToDelete(null);
  };

  const handleDelete = async (blogId: string): Promise<void> => {
    try {
      // Gửi yêu cầu xóa bài viết
      const response = await fetch(
        `http://localhost:8080/api/blogs/${blogId}`,
        {
          method: "DELETE",
        }
      );

      // Kiểm tra xem phản hồi có phải là lỗi hay không
      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi xóa bài viết");
      }

      // Xử lý dữ liệu thành công
      await response.json();
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Bài viết đã được xóa thành công",
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      setFilteredBlogs(filteredBlogs.filter((blog) => blog._id !== blogId)); // Cập nhật lại filteredBlogs
    } catch (error) {
      // Xử lý lỗi, bao gồm lỗi của fetch hoặc bất kỳ lỗi nào khác
      toast({
        variant: "destructive",
        title: "Lỗi khi xóa bài viết",
        description:
          error instanceof Error ? error.message : "Có lỗi không xác định",
      });
      console.error("Error when deleting blog:", error);
    } finally {
      setIsConfirmDeleteOpen(false);
      setToDelete(null);
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : categoryId;
  };

  if (loading)
    return (
      <div className="text-center text-xl text-gray-600">
        Đang tải bài viết...
      </div>
    );
  if (error)
    return <div className="text-center text-xl text-red-500">{error}</div>;

  return (
    <div className=" mx-auto px-4 ">
      <div className="pb-6 flex flex-col lg:flex-row justify-between items-center">
        <h1 className="text-3xl font-semibold mb-10 lg:mb-0">
          Danh sách bài viết
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-[100%] lg:w-auto  gap-8">
          {/* Trường nhập liệu tìm kiếm */}
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc tác giả..."
              className="p-2 w-full sm:w-[300px] border border-gray-300 rounded-lg"
            />
          </div>

          <Link
            to="/admin/blogs/add"
            className="flex w-[180px] items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Thêm bài viết
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBlogs.length === 0 ? (
          <div className="col-span-full text-center text-lg mt-10 text-gray-500">
            Hiện tại chưa có bài viết nào. Hãy thêm bài viết mới!
          </div>
        ) : (
          currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Tiêu đề và Thông tin cơ bản */}
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                <span>
                  {blog.author} - {getCategoryLabel(blog.category)}
                </span>
              </div>

              {/* Hình ảnh bài viết */}
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-contain rounded-lg mb-4"
              />

              {/* Tóm tắt bài viết */}
              <p className="text-sm text-gray-700 mb-4">{blog.description}</p>

              {/* Buttons */}
              <div className="flex justify-between items-center">
                <Link
                  to={`/admin/blogs/edit/${blog._id}`}
                  className="text-blue-500 hover:text-blue-600 transition duration-300"
                >
                  Chỉnh sửa
                </Link>
                <button
                  onClick={() => openConfirmDeleteDialog(blog._id, blog.title)}
                  className="text-red-500 hover:text-red-600 transition duration-300"
                >
                  Xóa
                </button>
              </div>

              {/* Toggle Collapse for Content */}
              <details className="mt-4 group-hover:block">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-700">
                  Xem chi tiết
                </summary>
                <div
                  className="detail text-gray-800 mt-2"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </details>
            </div>
          ))
        )}
      </div>

      <Confirm
        isOpen={isConfirmDeleteOpen}
        onClose={closeConfirmDeleteDialog}
        onConfirm={() => {
          if (Delete) handleDelete(Delete.id);
        }}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa"<strong>${Delete?.title}</strong>"? Hành động này không thể hoàn tác.`}
      />

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
    </div>
  );
};

export default ListBlog;
