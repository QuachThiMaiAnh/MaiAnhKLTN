import Confirm from "@/components/Confirm/Confirm";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ListLogoPage = () => {
  const [logos, setLogos] = useState<any[]>([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const { toast } = useToast();
  const [logoToDelete, setLogoToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { id } = useParams();
  
    useEffect(() => {
      if (!id) document.title = "Danh Sách Logo";
    }, [id]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/logo");
        setLogos(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách logo.", error);
      }
    };

    fetchLogos();
  }, []);

  const handleSetCurrent = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/api/logo/current/${id}`);
      const response = await axios.get("http://localhost:8080/api/logo");
      setLogos(response.data);
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Logo đã được đặt làm logo chính thành công!",
      });
    } catch (error) {
      console.error("Lỗi khi đặt làm logo chính.", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi đặt làm logo chính!",
      });
    }
  };

  const openConfirmDeleteDialog = (id: string, title: string) => {
    setLogoToDelete({ id, title });
    setIsConfirmDeleteOpen(true);
  };

  const closeConfirmDeleteDialog = () => {
    setIsConfirmDeleteOpen(false);
    setLogoToDelete(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/logo/${id}`);
      setLogos(logos.filter((logo) => logo._id !== id));
      toast({
        className: "bg-green-400 text-white h-auto",
        title: "Logo đã được xóa thành công!",
      });
    } catch (error) {
      console.error("Lỗi khi xóa logo.", error);
      toast({
        variant: "destructive",
        title: "Thất bại",
        description: "Có lỗi sảy ra khi xóa logo!",
      });
    } finally {
      setIsConfirmDeleteOpen(false);
      setLogoToDelete(null);
    }
  };

  return (
    <div className="mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row md:items-center justify-between mb-5">
        <h2 className="text-3xl text-center font-bold text-gray-900">
          Danh Sách Logo
        </h2>
        <div className="flex justify-end">
          <Link
          to="/admin/logos/add"
          className="mt-3 sm:mt-0 flex items-center gap-2  md:w-44 bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 shadow-lg transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Thêm Logo
        </Link>
        </div>
      </div>

      <div className=" grid overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase">
                Tiêu Đề
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase">
                Hình Ảnh
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase">
                Chọn Làm Logo Chính
              </th>
              <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logos.map((logo) => (
              <tr
                key={logo._id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 md:px-6 py-4  text-sm font-medium text-gray-900">
                  {logo.title}
                </td>

                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <img
                    src={logo.image}
                    alt={logo.title}
                    className="w-full h-20 md:w-40 md:h-24 rounded-lg object-contain "
                  />
                </td>
                
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleSetCurrent(logo._id)}
                    className={`bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition duration-300 ${
                      logo.isCurrent ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={logo.isCurrent}
                  >
                    {logo.isCurrent ? "Logo Chính" : "Chọn Làm Logo Chính"}
                  </button>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/logos/edit/${logo._id}`}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() =>
                        openConfirmDeleteDialog(logo._id, logo.title)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition duration-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Confirm
        isOpen={isConfirmDeleteOpen}
        onClose={closeConfirmDeleteDialog}
        onConfirm={() => {
          if (logoToDelete) handleDelete(logoToDelete.id);
        }}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa Logo "<strong>${logoToDelete?.title}</strong>"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};

export default ListLogoPage;
