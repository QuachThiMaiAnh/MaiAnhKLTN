import { Link } from "react-router-dom";

import CategoriesMenu from "./_components/CategoriesMenu";
import { MainContent } from "./_components/MainContent";
import React from "react";

const ProductShopPage = () => {
  React.useEffect(() => {
    document.title = "Sản Phẩm"; // Đặt tiêu đề cho trang
  }, []);
  return (
    <>
      <div className="container">
        <div className="h-4 md:h-8 mb-0"></div>

        {/* BREADCRUM */}
        <div className="text-[11px] leading-[18px] uppercase text-[#888] breadcrumbs">
          <Link className="bread" to="/">
            Trang chủ
          </Link>
          <Link className="bread" to="/shopping">
            Sản phẩm
          </Link>
        </div>
        {/* BREADCRUM */}

        {/* Khoang cach */}
        <div className="h-4 md:h-12 lg:h-24 mb-0"></div>
        {/* Khoang cach */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* CAROUSEL */}
          <MainContent />
          {/* CAROUSEL */}
          {/*=========================  */}
          {/* CATEGORY */}
          <CategoriesMenu />
          {/* CATEGORY */}
        </div>
      </div>
    </>
  );
};

export default ProductShopPage;
