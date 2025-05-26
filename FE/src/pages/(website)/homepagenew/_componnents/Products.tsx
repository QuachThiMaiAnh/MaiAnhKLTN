import { IProduct } from "@/common/types/Orders";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const swiperRef = useRef<SwiperCore | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      // console.log("Products:", response.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    <div className="relative h-[558px]">
      {/* Mũi tên trái */}
      <button
        onClick={handlePrev}
        className="absolute hidden lg:flex left-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 border-[5px] border-zinc-100 "
      >
        <span className="material-icons text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveProductIndex(swiper.realIndex)}
        loop={true}
        touchRatio={1}
        resistance={false}
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
            slidesPerView: 4,
          },
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide
            key={index}
            className="relative bg-white border-r border-b border-t p-4 min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[25%] xl:min-w-[20%] flex-shrink-0 text-wrap group cursor-grab"
          >
            {/* Giảm giá */}
            {product.priceSale > 0 && (
              <span className="absolute top-5 left-6 text-xs text-white py-1 px-2 bg-red-500 rounded-full">
                GIẢM GIÁ
              </span>
            )}

            {/* Ảnh sản phẩm */}
            <Link to={`/product/${product._id}`}>
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="mx-auto my-10 mb-20 w-[250px] h-[250px] object-cover"
                />
              </div>
            </Link>

            {/* Lớp phủ hiệu ứng hover với nút */}

            <div className="px-10 relative">
              {/* Phiên bản */}
              <h5 className="text-xs font-questrial text-[#b8cd06] mb-1">
                {/* {product.category?.name} */}
              </h5>

              {/* Tên sản phẩm */}
              <h3 className="font-raleway font-extrabold text-inherit text-[13px] mb-2 group-hover:text-[#b8cd06] line-clamp-1 uppercase">
                {product.name}
              </h3>

              {/* Mô tả */}
              <p className="text-sm font-questrial text-gray-500 mb-2 transition-opacity duration-300 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                {/* Giá */}
                <div className="flex items-center justify-center space-x-2">
                  {product.priceSale && product.priceSale < product.price ? (
                    <>
                      {/* Giá sale */}
                      <span className="text-[18px] text-red-600 font-bold">
                        {product.priceSale.toLocaleString("vi-VN")} VNĐ
                      </span>
                      {/* Giá gốc gạch ngang */}
                      <span className="text-md text-gray-400 line-through">
                        {product.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </>
                  ) : (
                    /* Chỉ hiển thị giá gốc nếu không có giá sale */
                    <span className="text-[18px] text-red-600 font-bold">
                      {product.price.toLocaleString("vi-VN")} VNĐ
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Mũi tên phải*/}
      <button
        onClick={handleNext}
        className="absolute hidden lg:flex right-[-30px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 border-[5px] border-zinc-100"
      >
        <span className="material-icons text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {/* Chấm đánh dấu*/}
      <div className="flex lg:hidden space-x-2 mt-8 justify-center items-center">
        {products.map((_, index) => (
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
    </div>
  );
};

export default Products;
