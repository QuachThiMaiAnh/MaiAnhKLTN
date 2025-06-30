import { Swiper, SwiperSlide } from "swiper/react"; // Thành phấn chính để tạo slider
import { Autoplay } from "swiper/modules"; // Slide tự chuyển động

import "swiper/css";
import "@/App.css";

// Images
import thum_35 from "@/assets/images/thumbnail-35.jpg";
import thum_36 from "@/assets/images/thumbnail-36.jpg";
import thum_37 from "@/assets/images/thumbnail-37.jpg";

// Danh sách các slide
/**
o	img: ảnh đại diện của slide
o	title: tiêu đề slide
o	description: nội dung mô tả

 */
const slides = [
  {
    img: thum_35,
    title: "Khẳng định phong cách cá nhân",
    description:
      "FabricFocus giúp bạn xây dựng dấu ấn riêng qua từng outfit – từ tối giản, thanh lịch đến cá tính mạnh mẽ. Trang phục không chỉ là lựa chọn, mà là tuyên ngôn.",
  },
  {
    img: thum_36,
    title: "Chất lượng tạo nên đẳng cấp",
    description:
      "Chúng tôi chọn lựa chất liệu cao cấp, đường may tỉ mỉ và thiết kế tối ưu để bạn luôn tự tin và thoải mái trong mọi tình huống – dù là công sở hay dạo phố.",
  },
  {
    img: thum_37,
    title: "Tự do phối đồ – Tự do thể hiện",
    description:
      "Hệ thống gợi ý phối đồ thông minh giúp bạn kết hợp linh hoạt giữa các sản phẩm – từ áo thun, quần jeans đến áo khoác – theo gu riêng của bạn.",
  },
  {
    img: thum_35,
    title: "Mỗi bộ sưu tập là một câu chuyện",
    description:
      "FabricFocus cập nhật xu hướng theo mùa nhưng luôn giữ được tinh thần riêng – hiện đại, lịch lãm và đậm chất nam giới Việt.",
  },
  {
    img: thum_36,
    title: "Hỗ trợ cá nhân hóa theo sở thích",
    description:
      "Với AI stylist tích hợp, chúng tôi giúp bạn lựa chọn trang phục phù hợp vóc dáng, tông da và phong cách sống. Trải nghiệm mua sắm chưa từng dễ dàng đến vậy.",
  },
];

const SlideShow = () => (
  <Swiper
    modules={[Autoplay]} // Kích hoạt tính năng tự động chạy slide
    breakpoints={{
      1200: { slidesPerView: 3 },
      768: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
    }} // Mỗi kích thước hiển thị số lượng slide khác nhau
    spaceBetween={30} //Slide sẽ tự chuyển sau 3 giây
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    loop // Cho phép vòng lặp vô tận các slide
    className="mySwiper"
  >
    {slides.map((slide, index) => (
      <SwiperSlide key={index}>
        <div className="flex flex-col items-center gap-5">
          <img
            src={slide.img}
            alt={`slide-${index}`}
            className="w-full max-w-[415px] rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02]" // Phóng nhẹ khi hover chuột
          />
          <div className="max-w-[415px] flex flex-col gap-4 text-center text-[14px] md:text-[16px]">
            <h6 className="uppercase font-bold text-foreground">
              {slide.title}
            </h6>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default SlideShow;
