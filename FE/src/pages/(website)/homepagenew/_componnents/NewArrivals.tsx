import {  Category, ProductItem } from "@/common/types/Products";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const NewArrivals = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);

  // Gọi API để lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category");
        const categoryNames = [
          "TẤT CẢ",
          ...response.data
          .filter((cat: Category) => cat.name !== "Chưa phân loại") 
          .map((cat: Category) => cat.name),
        ];
        setCategories(categoryNames);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Gọi API để lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products/all");
        setProducts(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (swiperRef.current && products.length > 0) {
      swiperRef.current.slideTo(0); // Đặt Swiper về slide đầu tiên
    }
  }, [products]);

  const filteredProducts = products.filter((product) => {
    // Nếu chọn "TẤT CẢ", hiển thị tất cả sản phẩm
    if (activeCategory === 0) return true;

    // Kiểm tra nếu danh mục của sản phẩm chứa danh mục đang chọn
    return product.category.some(
      (cat: Category) => cat.name === categories[activeCategory]
    );
  });

  // Đóng menu khi nhấp ra bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // chuyển sản phẩm
  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const scrollToProduct = (index: number) => {
    swiperRef.current?.slideTo(index);
    setActiveProductIndex(index);
  };

  return (
    <div className="mx-auto pt-32 pb-10 md:pb-0">
      {/* Tiêu đề phần */}
      <div className="text-center md:mb-20">
        <h5 className="text-sm uppercase text-gray-500 font-questrial tracking-wider mb-3">
          SẢN PHẨM MỚI
        </h5>
        <h2 className="text-3xl sm:text-4xl text-[#343434] font-raleway font-extrabold">
          THỜI TRANG MỚI DÀNH CHO BẠN
        </h2>
        <div className="flex items-center gap-1 justify-center my-6">
          <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
          <span className="h-[1px] w-12 bg-[#b8cd06] mb-2"></span>
          <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
        </div>
      </div>

      {/* Menu danh mục */}
      <div className="flex md:hidden flex-col items-center mb-16" ref={menuRef}>
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="px-6 py-4 text-gray-700 border rounded-full text-xs font-semibold flex justify-between items-center w-full max-w-[300px] uppercase"
        >
          {categories[activeCategory] || "Loading..."}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-2 transition-transform duration-300 ${
              isCategoryOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown danh mục */}
        <ul
          className={`w-full max-w-[300px] bg-white px-4 border-l border-r mt-2 transition-all duration-300 overflow-hidden ${
            isCategoryOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => {
                setActiveCategory(index);
                setIsCategoryOpen(false);
              }}
              className={`px-6 py-2 text-xs font-semibold cursor-pointer uppercase ${
                index === activeCategory
                  ? "bg-[#b8cd06] rounded-full text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden md:flex justify-center items-center mb-16">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center">
            {/* Đường viền bên trái cho các mục trừ mục đầu tiên */}
            {index > 0 && (
              <span className="h-6 border-l border-gray-300"></span>
            )}

            <button
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-2 mx-3 text-xs font-semibold transition-all duration-300 uppercase ${
                index === activeCategory
                  ? "bg-[#b8cd06] text-white rounded-full"
                  : "text-gray-500 hover:shadow rounded-full"
              }`}
            >
              {category}
            </button>
          </div>
        ))}
      </div>

      {/* Slider sản phẩm */}
      <div className="relative h-[445px] text-center">
        {/* Mũi tên cuộn trái */}
        <button
          onClick={handlePrev}
          className="absolute hidden lg:flex left-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 border-[5px] border-zinc-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Container cuộn sản phẩm */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveProductIndex(swiper.realIndex)}
          loop={true}
          touchRatio={1}
          // resistance={true}
          // direction="horizontal"
          centerInsufficientSlides={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
        >
          {filteredProducts.map((product, index) => (
            <SwiperSlide
              key={index}
              className="relative bg-white border cursor-grab p-4 min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[25%] xl:min-w-[20%] max-w-[250px] group overflow-hidden"
            >
              {/* Nhãn giảm giá */}
              {product.priceSale > 0 && (
                <span className="absolute top-5 left-6 text-xs text-white py-1 px-2 rounded-full bg-red-500">
                  GIẢM GIÁ
                </span>
              )}

              <div className="mt-10 mb-5">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[250px] object-contain"
                  />
                </Link>
              </div>

              {/* Phần nút hiển thị khi hover */}

              <div>
                {/* <h5 className="text-xs uppercase font-questrial text-[#b8cd06] mb-1 text-wrap relative transition-all duration-300 top-0 group-hover:top-[-8px]">
                  {product.edition}
                </h5> */}
                <h3 className="font-extrabold font-raleway text-[13px] text-inherit group-hover:text-[#b8cd06] mb-3 text-wrap relative transition-all duration-300 top-0 group-hover:top-[-3px] line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3  duration-200 text-wrap line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-center duration-300 gap-2">
                  {product.priceSale && product.priceSale < product.price? (
                    <>
                      {/* Giá khuyến mãi */}
                      <span className="font-bold text-red-600">
                        {product.priceSale.toLocaleString()} VNĐ
                      </span>
                      {/* Gạch ngang giá gốc */}
                      <span className="text-sm text-gray-400 line-through">
                        {product.price.toLocaleString()} VNĐ
                      </span>
                    </>
                  ) : (
                    /* Chỉ hiển thị giá gốc nếu không có giá khuyến mãi */
                    <span className="font-bold text-red-600">
                      {product.price.toLocaleString()} VNĐ
                    </span>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mũi tên cuộn phải */}
        <button
          onClick={handleNext}
          className="absolute hidden lg:flex right-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 border-[5px] border-zinc-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Chỉ báo vòng tròn - chỉ hiển thị trên màn hình nhỏ */}
      {filteredProducts.length > 1 && (
        <div className="flex space-x-2 mt-10 sm:mt-20 lg:hidden justify-center items-center">
          {filteredProducts.map((_, index) => (
            <div
              key={index}
              className={`rounded-full w-3 h-3 bg-white cursor-pointer ${
                index === activeProductIndex
                  ? "border-[3px] w-4 h-4 border-[#b8cd06]"
                  : "border-[1px] border-gray-500"
              }`}
              onClick={() => scrollToProduct(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
