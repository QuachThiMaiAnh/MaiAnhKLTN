import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Professionals = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        pagination={{ clickable: true }}
        className="max-[1024px]:h-[550px] max-[1024px]:mt-[50px] mt-[160px] max-[1280px]:h-[700px] max-[768px]:h-auto"
        style={{ cursor: "url(/src/assets/icons/drag.png), pointer" }}
      >
        <SwiperSlide>
          <div
            className="bg-cover bg-center h-full"
            style={{
              backgroundImage:
                "url('/src/assets/choiceoftheprofessionals.jpg')",
            }}
          >
            <div
              className="container justify-center items-center grid max-[768px]:py-[35px] max-[768px]:grid-cols-1 grid-cols-2 px-4 relative min-[1200px]:w-[1170px] min-[992px]:w-[970px] min-[768px]:w-[750px]"
             
            >
              <div className="px-4">
                <h2
                  className="text-[50px] highlight max-[1280px]:text-[46px] max-[1280px]:leading-[46px] max-[767px]:text-[34px] max-[767px]:leading-[40px]  leading-[70px] font-black uppercase text-white "
                  style={{
                    textShadow: "1px 1px 1px rgba(0, 0, 0, .1)",
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                 Lựa chọn của các chuyên gia
                </h2>
                <div>
                  <div className="p-[20px_0] light  title-underline h-[21px] ">
                    <span className="w-[55px] ml-[2%] text-white h-[1px] bg-current inline-block align-top relative"></span>
                  </div>
                </div>
                <div
                  className="text-[16px] leading-[24px] text-[#fff]"
                  style={{
                    textShadow: "1px 1px 1px rgba(0, 0, 0, .1)",
                  }}
                >
                 Chúng tôi cung cấp giải pháp tối ưu với đội ngũ chuyên gia giàu kinh nghiệm.
                  Từ việc phân tích kỹ lưỡng đến thực thi hoàn hảo, chúng tôi cam kết mang lại kết quả chất lượng cao nhất. 
                  Dịch vụ của chúng tôi giúp bạn tiết kiệm thời gian và đạt được mục tiêu một cách hiệu quả nhất.
                </div>
              </div>
              <div className="max-[768px]:hidden">
                <img
                  src="/src/assets/images/background-choiceoftheprofessionals.png"
                  alt="slider"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="bg-cover bg-center h-full"
            style={{
              backgroundImage:
                "url('/src/assets/choiceoftheprofessionals.jpg')",
            }}
          >
            <div
              className="container justify-center items-center grid max-[768px]:py-[35px] max-[768px]:grid-cols-1 grid-cols-2 px-4 relative min-[1200px]:w-[1170px] min-[992px]:w-[970px] min-[768px]:w-[750px]"
              style={{ cursor: "url(/src/assets/icons/drag.png), pointer" }}
            >
                <div className="max-[768px]:hidden">
                <img
                  src="/src/assets/img/background-12-Professionals.png"
                  alt="slider"
                />
              </div>
              <div className="px-4">
                <h2
                  className="text-[50px] highlight  max-[1199px]:text-[46px] max-[1199px]:leading-[46px] max-[767px]:text-[34px] max-[767px]:leading-[40px]  leading-[70px] font-black uppercase text-white "
                  style={{
                    textShadow: "1px 1px 1px rgba(0, 0, 0, .1)",
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                 Chuyên gia hàng đầu
                </h2>
                <div>
                  <div className="p-[20px_0] light  title-underline h-[21px] ">
                    <span className="w-[55px] ml-[2%] text-white h-[1px] bg-current inline-block align-top relative"></span>
                  </div>
                </div>
                <div
                  className="text-[16px] leading-[24px] text-[#fff]"
                  style={{
                    textShadow: "1px 1px 1px rgba(0, 0, 0, .1)",
                  }}
                >
                Với đội ngũ chuyên gia dày dặn kinh nghiệm, chúng tôi cam kết cung cấp các giải pháp tối ưu để giúp bạn đạt được kết quả như mong muốn, tiết kiệm thời gian và nguồn lực.
                </div>
              </div>
              
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Navigation buttons */}
      <div className="swiper-button-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-white hidden lg:block"></div>
      <div className="swiper-button-next absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-white hidden lg:block"></div>
    </div>
  );
};

export default Professionals;
