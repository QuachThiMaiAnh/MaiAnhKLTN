import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import axios from "axios";
import { Link } from "react-router-dom";
import { ProductItem } from "@/common/types/Products";

const OurSeries = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const swiperRef = useRef<SwiperCore | null>(null);

  // Gọi API để lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products/all");
        const sortedProducts = response.data.data
          .sort((a: ProductItem, b: ProductItem) => b.count - a.count) // Sắp xếp giảm dần dựa vào count
          .slice(0, 6);

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // Chia sản phẩm thành các nhóm 3
  const productGroups = [];
  for (let i = 0; i < products.length; i += 3) {
    productGroups.push(products.slice(i, i + 3));
  }

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index); // Chuyển đến slide được nhấn
  };

  return (
    <div className="mx-auto px-5 xl:px-28 pt-16 md:pt-36 overflow-hidden cursor-grab select-none">
      {/* Tiêu đề phần */}
      <div className="text-center mb-8">
        <h5 className="text-sm uppercase font-questrial text-gray-500 tracking-wider mb-3">
          SẢN PHẨM bán chạy
        </h5>
        <h2 className="text-3xl sm:text-4xl font-raleway text-[#343434] font-extrabold uppercase">
          lựa chọn dành cho bạn
        </h2>
        <div className="flex items-center gap-1 justify-center my-6">
          <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
          <span className="h-[1px] w-12 bg-[#b8cd06] mb-2"></span>
          <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
        </div>
      </div>

      {/* Nội dung sản phẩm */}
      <Swiper
        spaceBetween={300}
        slidesPerView={1}
        centeredSlides={false}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        loop={true}
        speed={600}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {productGroups.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className="flex flex-col md:flex-row gap-10 justify-center w-full">
              {group.map((product, index) => (
                <div
                  key={product._id}
                  className={`flex flex-col ${
                    (groupIndex % 2 === 0 && index === 0) ||
                    (groupIndex % 2 !== 0 && index === 2)
                      ? "w-full mb-8 md:mb-0 relative"
                      : "md:w-1/2"
                  } items-center text-center`}
                >
                  {(groupIndex % 2 === 0 && index === 0) ||
                  (groupIndex % 2 !== 0 && index === 2) ? (
                    <>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="rounded-xl md:w-[600px] md:h-[480px] object-cover transition-transform duration-300 ease-in-out"
                      />

                      <div className="absolute md:h-[480px] inset-0 bg-black bg-opacity-20 rounded-xl flex flex-col justify-center p-8 text-white">
                        <div className="text-left  text-lg font-questrial mb-5">
                          BẮT ĐẦU TỪ {" "}
                          {product.priceSale && product.priceSale < product.price ? (
                            <>
                              {/* Giá khuyến mãi */}
                              <span className="text-[#fff] font-bold">
                                {product.priceSale.toLocaleString()} VNĐ
                              </span>
                              {/* Giá gốc gạch ngang */}
                              <span className="text-gray-400 line-through ml-2">
                                {product.price.toLocaleString()} VNĐ
                              </span>
                            </>
                          ) : (
                            /* Giá gốc khi không có khuyến mãi */
                            <span className="text-[#fff] font-bold">
                              {product.price.toLocaleString()} VNĐ
                            </span>
                          )}
                        </div>

                        <h2 className="text-3xl text-left font-extrabold font-raleway mb-6 line-clamp-2">
                          {product.name.split(" ")[0]}{" "}
                          <span className="text-[#b8cd06]">
                            {product.name.split(" ")[1]}
                          </span>{" "}
                          {product.name.split(" ").slice(2).join(" ")}
                        </h2>
                        <p className="text-sm text-left mb-6 leading-relaxed line-clamp-2">
                          {product.description}
                        </p>
                        <button className="group relative md:w-10 px-10 md:px-16 text-left py-6 md:py-6 text-sm bg-[#fff] text-[#555] rounded-full font-semibold overflow-hidden">
                          <Link to={`/product/${product._id}`}>
                            {" "}
                            <span className="absolute inset-0 flex items-center justify-center text-xs transition-all duration-200 ease-in-out transform group-hover:translate-x-full group-hover:opacity-0">
                              TÌM HIỂU THÊM
                            </span>
                            <span className="absolute inset-y-0 left-0 flex items-center justify-center w-full text-[#555] transition-all duration-200 ease-in-out transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>{" "}
                          </Link>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`mb-4 w-[315px] xl:w-[315px] xl:h-[315px] object-cover transition-transform duration-300 ease-in-out `}
                      />

                      <div className="max-w-[100%]">
                        <h3 className="text-lg font-raleway text-[#343434] font-extrabold mb-2 line-clamp-1">
                          {product.name.split(" ")[0]}{" "}
                          <span className="text-[#b8cd06]">
                            {product.name.split(" ")[1]}
                          </span>{" "}
                          {product.name.split(" ").slice(2).join(" ")}
                        </h3>
                        <p className="text-gray-500 text-xs px-16 md:px-6 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-center gap-2 my-5">
                          {product.priceSale && product.priceSale < product.price? (
                            <>
                              {/* Hiển thị giá khuyến mãi */}
                              <span className="text-red-600 font-bold text-lg">
                                {product.priceSale.toLocaleString()} VNĐ
                              </span>
                              {/* Hiển thị giá gốc với gạch ngang */}
                              <span className="text-gray-500 text-sm line-through">
                                {product.price.toLocaleString()} VNĐ
                              </span>
                            </>
                          ) : (
                            /* Hiển thị giá gốc khi không có giá khuyến mãi */
                            <span className="text-red-600 font-bold text-lg">
                              {product.price.toLocaleString()} VNĐ
                            </span>
                          )}
                        </div>

                        <button className="group relative px-20 md:px-16 py-5 md:py-5 text-sm bg-[#b8cd06] text-white rounded-full font-semibold overflow-hidden">
                          <Link to={`/product/${product._id}`}>
                            <span className="absolute inset-0 flex items-center justify-center text-xs transition-all duration-200 ease-in-out transform group-hover:translate-x-full group-hover:opacity-0">
                              TÌM HIỂU THÊM
                            </span>
                            <span className="absolute inset-y-0 left-0 flex items-center justify-center w-full text-white transition-all duration-200 ease-in-out transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </Link>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Chỉ báo tròn */}
      <div className="flex space-x-2 mt-16 md:mt-10 justify-center items-center">
        {productGroups.map((_, index) => (
          <div
            key={index}
            className={`rounded-full duration-300 bg-white ${
              index === activeIndex
                ? "border-[#b8cd06] border-4 size-4"
                : "border-gray-300 border-2 size-3"
            }`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default OurSeries;
