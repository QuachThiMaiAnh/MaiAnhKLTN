// Nhập các thư viện cần thiết
import { Slide } from "@/common/types/Slide"; // Kiểu dữ liệu Slide
import Confirm from "@/components/Confirm/Confirm"; // Component xác nhận xóa
import { useToast } from "@/components/ui/use-toast"; // Hook hiển thị thông báo
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PaginationComponent from "../../user/_component/Paginations"; // Component phân trang

const ListSlider = () => {
  // ======== State ========
  const [sliders, setSliders] = useState<Slide[]>([]); // Danh sách slide
  const [loading, setLoading] = useState(true); // Trạng thái tải
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Hiển thị popup xóa
  const [selectedSliderId, setSelectedSliderId] = useState<string | null>(null); // ID slide đang chọn xóa
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(5); // Số item mỗi trang
  const [filterType, setFilterType] = useState("all"); // Bộ lọc theo loại slider
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [expandedRows, setExpandedRows] = useState(new Set()); // Set lưu trạng thái "xem thêm"
  const { toast } = useToast(); // Hook toast
  const apiUrl = import.meta.env.VITE_API_URL; // URL API từ biến môi trường

  const { id } = useParams(); // Lấy ID từ URL (nếu có)

  // Cập nhật tiêu đề tab
  useEffect(() => {
    if (!id) document.title = "Danh Sách Slider";
  }, [id]);

  // ======== Xử lý tìm kiếm ========
  const filteredSliders = sliders.filter(
    (slider) =>
      slider.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slider.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ======== Phân trang ========
  const indexOfLastSlider = currentPage * itemsPerPage;
  const indexOfFirstSlider = indexOfLastSlider - itemsPerPage;
  const totalPages = Math.ceil(filteredSliders.length / itemsPerPage);
  const currentSliders = filteredSliders.slice(
    indexOfFirstSlider,
    indexOfLastSlider
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  // ======== Gọi API lấy sliders ========
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/sliders${
            filterType !== "all" ? `?type=${filterType}` : ""
          }`
        );
        setSliders(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, [filterType]);

  // ======== Xử lý xóa slider ========
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/sliders/${id}`);
      setSliders(sliders.filter((slider) => slider._id !== id)); // Cập nhật lại danh sách
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Slide đã được xóa thành công!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi xóa slide!",
      });
    }
  };

  const openConfirm = (id: string) => {
    setSelectedSliderId(id);
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
  };

  const confirmDelete = () => {
    if (selectedSliderId) {
      handleDelete(selectedSliderId);
      setIsConfirmOpen(false);
    }
  };

  // ======== Toggle mở rộng nội dung dài ========
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // ======== Giao diện hiển thị ========
  return (
    <div className="p-4 mx-auto max-w-full">
      {/* Tiêu đề + thanh công cụ */}
      <div className="flex xl:flex-row flex-col xl:items-center justify-between mb-4">
        <h2 className="text-3xl text-center font-semibold py-10">
          Danh Sách Slider
        </h2>
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md"
          />
          <div className="flex items-center justify-between gap-5">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="all">Tất cả</option>
              <option value="homepage">Homepage</option>
              <option value="product">Product</option>
            </select>

            <Link
              to="/admin/sliders/add"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-1"
            >
              {/* Biểu tượng dấu cộng */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
              Thêm Slider
            </Link>
          </div>
        </div>
      </div>

      {/* Danh sách slider */}
      {loading ? (
        <p className="text-center">Đang tải...</p>
      ) : (
        <div className="grid overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Tiêu Đề</th>
                <th className="px-4 py-2 border">Loại slide</th>
                <th className="px-4 py-2 border">Ảnh chính</th>
                <th className="px-4 py-2 border">Ảnh nền</th>

                {/* Hiển thị cột riêng theo loại */}
                {filterType === "homepage" && (
                  <>
                    <th className="px-4 py-2 border">Phụ Đề</th>
                    <th className="px-4 py-2 border">Mô Tả</th>
                    <th className="px-4 py-2 border">Tính Năng</th>
                    <th className="px-4 py-2 border">Giá</th>
                  </>
                )}
                {filterType === "product" && (
                  <>
                    <th className="px-4 py-2 border">Tiêu đề nổi</th>
                    <th className="px-4 py-2 border">Text % sale</th>
                  </>
                )}
                <th className="px-4 py-2 border">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {currentSliders.length > 0 ? (
                currentSliders.map((slider, index) => (
                  <tr key={slider._id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">
                      {index + 1 + indexOfFirstSlider}
                    </td>
                    <td className="px-2 py-2 border">
                      <div>
                        <p
                          className={`${
                            expandedRows.has(slider._id) ? "" : "line-clamp-4"
                          }`}
                        >
                          {slider.title || "Không có"}
                        </p>
                        {slider.title?.length > 50 && (
                          <button
                            className="text-blue-500 text-sm mt-1"
                            onClick={() => toggleRowExpansion(slider._id)}
                          >
                            {expandedRows.has(slider._id)
                              ? "Thu gọn"
                              : "Xem thêm"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2 border capitalize">
                      {slider.type}
                    </td>
                    <td className="px-2 py-2 border">
                      {slider.image ? (
                        <img
                          src={slider.image}
                          alt="Ảnh"
                          className="w-52 h-20 object-contain mx-auto"
                        />
                      ) : (
                        "Không có"
                      )}
                    </td>
                    <td className="px-2 py-2 border">
                      {slider.backgroundImage ? (
                        <img
                          src={slider.backgroundImage}
                          alt="Ảnh nền"
                          className="w-52 h-20 object-contain mx-auto"
                        />
                      ) : (
                        "Không có"
                      )}
                    </td>

                    {/* Cột riêng theo loại homepage */}
                    {filterType === "homepage" &&
                      slider.type === "homepage" && (
                        <>
                          <td className="px-2 py-2 border">
                            {slider.subtitle || "Không có"}
                          </td>
                          <td className="px-2 py-2 border">
                            {slider.description || "Không có"}
                          </td>
                          <td className="px-2 py-2 border">
                            {slider.features?.length
                              ? slider.features.join(", ")
                              : "Không có"}
                          </td>
                          <td className="px-2 py-2 border">
                            {slider.price?.toLocaleString("vi-VN") ||
                              "Không có"}{" "}
                            VNĐ
                          </td>
                        </>
                      )}

                    {/* Cột riêng theo loại product */}
                    {filterType === "product" && slider.type === "product" && (
                      <>
                        <td className="px-2 py-2 border">
                          {slider.promotionText || "Không có"}
                        </td>
                        <td className="px-2 py-2 border">
                          {slider.textsale || "Không có"}
                        </td>
                      </>
                    )}

                    {/* Nút sửa / xóa */}
                    <td className="px-2 py-2 border">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/sliders/edit/${slider._id}`}
                          className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => openConfirm(slider._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    Không tìm thấy kết quả nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang */}
      <div className="mt-4 mb-3">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={itemsPerPage}
        />
      </div>

      {/* Hộp xác nhận xóa */}
      <Confirm
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa slider này?"
      />
    </div>
  );
};

export default ListSlider;
