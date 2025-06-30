import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgePlus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const Header = () => {
  // Hook để thao tác với query string (?status=)
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy giá trị hiện tại từ query, mặc định là "display"
  const currentLayout = searchParams.get("status") || "display";

  // Hàm xử lý khi chọn tab (ẩn / hiển thị)
  function handleChange(layout: string) {
    searchParams.set("status", layout); // Cập nhật giá trị status
    setSearchParams(searchParams); // Gửi lại lên URL
  }

  return (
    <div className="sm:flex justify-between items-center">
      <h4 className="text-xl font-semibold">Danh sách thuộc tính</h4>

      {/* Tabs để chuyển đổi trạng thái hiển thị / ẩn */}
      <div className="md:flex gap-10">
        <Tabs
          className="mb-4 md:mb-0"
          defaultValue={currentLayout}
          onValueChange={(layout) => handleChange(layout)}
        >
          <TabsList className="border">
            <TabsTrigger value="display">Danh sách hiển thị</TabsTrigger>
            <TabsTrigger value="hidden">Danh sách ẩn</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Nút chuyển hướng đến trang thêm mới */}
        <Link to="add">
          <Button className="text-lg font-light flex gap-3 px-4 bg-orange-500 hover:bg-orange-400">
            <BadgePlus /> {/* icon dấu cộng */}
            <span className="hidden lg:block">Thêm thuộc tính</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
