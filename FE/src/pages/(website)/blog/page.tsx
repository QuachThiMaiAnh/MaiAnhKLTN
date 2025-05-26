import { Link, Outlet } from "react-router-dom";
import Sidebar from "./_components/Sidebar";
import React from "react";

const BlogPage = () => {
  React.useEffect(() => {
        document.title = "Tin Tức"; // Đặt tiêu đề cho trang
      }, []);
  // Kiểm tra URL hiện tại có chứa '/detail' không
  const isDetailPage = location.pathname.includes("/detail");
  return (
    <div className="xl:px-36 mt-10 mb-10 px-5">
      <div className="text-[11px] leading-[18px] uppercase text-[#888] breadcrumbs">
        <a className="bread" href="#">
          Trang chủ
        </a>
        <Link to="/blog">Tin tức</Link>
      </div>
      {/* Hiển thị title nếu không phải trang chi tiết */}
      {!isDetailPage && (
        <header className="text-center mb-10 mt-20">
          <h5 className="text-sm uppercase font-questrial text-gray-500 tracking-wider mb-3">
            sản phẩm phổ biến
          </h5>
          <h2 className="text-3xl sm:text-4xl font-raleway text-[#343434] font-extrabold uppercase">
            Thông tin những sản phẩm tốt nhất
          </h2>
          <div className="flex items-center gap-1 justify-center my-6">
            <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
            <span className="h-[1px] w-12 bg-[#b8cd06] mb-2"></span>
            <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
          </div>
        </header>
      )}
      <div className="flex flex-col lg:flex-row gap-8 mt-20">
      {/* <div>
          <Sidebar />
        </div> */}
        {/* Nội dung chính */}
        <div className="flex-1">
          <Outlet />
        </div>
        {/* Sidebar */}
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
