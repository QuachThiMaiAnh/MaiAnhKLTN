import { useEffect, useRef, useState } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const offers = [
  {
    title: "ÁO THUN NAM + TÚI VẢI + MIỄN PHÍ GIAO HÀNG",
    price: "299.000 VND",
    description:
      "Áo thun cotton chất lượng cao, thoáng mát, thích hợp mặc hàng ngày. Tặng kèm túi vải tiện dụng.",
    image:
      "https://anlocgroup.com/wp-content/uploads/2023/05/thiet-ke-shop-quan-ao-luxury-02-1-jpg.webp",
    timer: { days: 1, hours: 5, minutes: 30, seconds: 20 },
  },
  {
    title: "ÁO KHOÁC JEAN + MŨ LEN + MIỄN PHÍ GIAO HÀNG",
    price: "499.000 VND",
    description:
      "Áo khoác jean phong cách, bền bỉ và ấm áp. Phù hợp cho những ngày se lạnh, đi kèm mũ len thời trang.",
    image:
      "https://as2.ftcdn.net/v2/jpg/00/59/42/19/1000_F_59421939_L3dQE3na6Hsk9ap0omWTSuyiytYZZcul.jpg",
    timer: { days: 2, hours: 8, minutes: 45, seconds: 10 },
  },
  {
    title: "QUẦN JEANS + THẮT LƯNG DA + MIỄN PHÍ GIAO HÀNG",
    price: "399.000 VND",
    description:
      "Quần jeans co giãn, ôm dáng, kết hợp hoàn hảo với thắt lưng da cao cấp.",
    image:
      "https://blog.btaskee.com/wp-content/uploads/2018/08/chup-hinh-dep-e1534849946134.jpg",
    timer: { days: 0, hours: 12, minutes: 20, seconds: 45 },
  },
];

const SpecialOffers = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(offers[activeIndex].timer);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    setTimer(offers[activeIndex].timer);

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        let { days, hours, minutes, seconds } = prevTimer;

        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days -= 1;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(countdown); // Dừng đếm khi hết thời gian
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(countdown); // Xóa bộ đếm khi thay đổi sản phẩm
  }, [activeIndex]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.slideTo(index); // Chuyển đến slide được nhấn
  };

  return (
    <div className=" mx-auto px-5 lg:px-28 pt-44 pb-10 md:pb-0 overflow-hidden w-full md:pt-36">
      <div className="text-center mb-5 lg:mb-0">
        <h5 className="text-sm uppercase text-gray-500 font-questrial tracking-wider mb-3">
          Ưu Đãi Đặc Biệt
        </h5>
        <h2 className="text-3xl sm:text-4xl font-raleway text-[#343434] font-extrabold">
          CHỌN LỰA TỐT NHẤT
        </h2>
        <div className="flex items-center gap-1 justify-center my-6">
          <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
          <span className="h-[1px] w-12 bg-[#b8cd06] mb-2"></span>
          <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        loop={true}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        speed={600}
        spaceBetween={30}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
      >
        {offers.map((offer, index) => (
          <SwiperSlide
            key={index}
            className="slider-item w-full flex-shrink-0 flex-col gap-10 md:flex-row  xl:items-center justify-center space-y-8 lg:space-y-0  cursor-grab"
            style={{ display: "flex" }}
          >
            <div className="w-full flex justify-center mt-10 lg:mt-0 pointer-events-none">
              <img
                src={offer.image}
                alt="Hình ảnh sản phẩm"
                className="rounded-lg shadow-lg w-full md:w-[600px] lg:w-[555px] h-auto object-cover"
              />
            </div>

            <div className="w-full lg:w-3/4 text-left space-y-5 justify-center">
              <h3 className="text-3xl font-extrabold font-raleway text-[#343434]">
                {offer.title.split(/([+\-*/,;:"'<>\s])/).map((part, index) => (
                  <span
                    key={index}
                    className={
                      [
                        "+",
                        "-",
                        "*",
                        "/",
                        ",",
                        ";",
                        ":",
                        '"',
                        "'",
                        "<",
                        ">",
                      ].includes(part.trim())
                        ? "text-[#b8cd06]"
                        : ""
                    }
                  >
                    {part}
                  </span>
                ))}
              </h3>
              <p className="text-lg font-questrial text-gray-500">
                GIÁ TỐT NHẤT:{" "}
                <span className="text-[#b8cd06]">{offer.price}</span>
              </p>

              <div className="flex space-x-5 justify-start text-center mb-6">
                {[
                  { label: "NGÀY", value: timer.days },
                  { label: "GIỜ", value: timer.hours },
                  { label: "PHÚT", value: timer.minutes },
                  { label: "GIÂY", value: timer.seconds },
                ].map((unit, index) => (
                  <div
                    key={index}
                    className="border-2 border-[#b8cd06] rounded-full h-16 w-16 md:w-20 md:h-20 flex flex-col items-center justify-center"
                  >
                    <div className="text-sm sm:text-base lg:text-lg text-gray-800">
                      {unit.value}
                    </div>
                    <p className="text-[10px] text-gray-500">{unit.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-sm font-questrial leading-relaxed">
                {offer.description}
              </p>

              <div className="flex lg:space-x-2 space-y-3 lg:space-y-0 flex-col lg:flex-row justify-center lg:justify-start">
                <button className="group relative lg:px-16 py-6 text-xs bg-[#b8cd06] text-white rounded-full font-semibold overflow-hidden">
                  <span className="absolute inset-0 flex items-center justify-center text-xs transition-all duration-200 ease-in-out transform group-hover:translate-x-full group-hover:opacity-0">
                    TÌM HIỂU THÊM
                  </span>
                  <span className="absolute inset-y-0 left-0 flex items-center justify-center w-full text-white transition-all duration-200 ease-in-out transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>

                <button className="group relative lg:px-20 py-6 text-xs bg-[#343434] text-white rounded-full font-semibold overflow-hidden">
                  <span className="absolute inset-0 flex items-center justify-center text-xs transition-all duration-200 ease-in-out transform group-hover:translate-x-full group-hover:opacity-0">
                    THÊM VÀO GIỎ HÀNG
                  </span>
                  <span className="absolute inset-y-0 left-0 flex items-center justify-center w-full text-white transition-all duration-200 ease-in-out transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex space-x-2 mt-16 lg:mt-16 justify-center items-center">
        {offers.map((_, index) => (
          <div
            key={index}
            className={`rounded-full duration-300 bg-white cursor-pointer ${
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

export default SpecialOffers;
