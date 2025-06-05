import React from "react";
import { Link } from "react-router-dom";

// Images
import client_logo_1 from "@/assets/images/client-logo-1.jpg";
import client_logo_2 from "@/assets/images/client-logo-2.jpg";
import bg_25 from "@/assets/images/background-25.jpg";
import thum_1 from "@/assets/img/about_thumb1.jpg";
import thum_2 from "@/assets/img/about_thumb2.jpg";
import About_Us_Bg from "@/assets/images/about-us-bg.jpg";

// Components
import SlideShow from "./_components/SlideShow";
import SlideOurTeam from "./_components/SlideOurTeam";
import OurPartnersSection from "./_components/OurPartnersSection";
import TimelineSection from "./_components/TimelineSection";

const AboutUsPage = () => {
  React.useEffect(() => {
    document.title = "Giới Thiệu";
  }, []);

  return (
    <>
      {/* Banner giới thiệu */}
      <section
        // fixed để tạo hiệu ứng parallax khi cuộn.
        style={{ backgroundImage: `url(${About_Us_Bg})` }}
        className="min-h-[600px] bg-cover bg-fixed bg-center bg-no-repeat text-black"
      >
        <div className="flex items-center justify-end min-h-[600px]">
          <div className="w-full md:w-2/3 px-4">
            <div className="max-w-[650px] mx-auto space-y-4 font-bold text-center">
              <h2 className="uppercase text-[40px] text-foreground">
                Chúng tôi là fabricfocus
              </h2>
              <p className="text-muted-foreground">
                Chúng tôi tin rằng thời trang không chỉ là những gì bạn mặc, mà
                còn là cách bạn thể hiện bản thân và kể câu chuyện của mình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Giới thiệu khái quát về thương hiệu*/}
      <section className="w-full max-w-screen-xl mx-auto pt-24 px-4">
        {/* •	Grid 2 cột: trái (tiêu đề), phải (nội dung chi tiết). */}
        <div className="grid lg:grid-cols-[500px_auto] gap-8">
          <div className="space-y-4">
            <span className="uppercase text-sm text-muted-foreground tracking-wider">
              Về chúng tôi
            </span>
            <h2 className="uppercase text-[28px] md:text-[34px] font-bold text-foreground">
              Chúng tôi là FabricFocus
            </h2>
            <div className="h-1">
              <span className="w-[500px] h-[2px] inline-block bg-primary relative before:absolute before:content-[''] before:w-2 before:h-[2px] before:bg-primary before:-left-3 before:top-0 after:absolute after:content-[''] after:w-2 after:h-[2px] after:bg-primary after:-right-3 after:top-0" />
            </div>
            <p className="text-muted-foreground text-sm">
              FabricFocus là nơi sáng tạo hội tụ cùng tinh thần đổi mới trong
              ngành thời trang. Chúng tôi không chỉ tạo ra sản phẩm, mà còn
              truyền tải cá tính và cảm hứng đến từng bộ trang phục.
            </p>
          </div>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              Tại FabricFocus, từng chi tiết – từ chất liệu vải, màu sắc cho đến
              đường may – đều được chọn lọc kỹ lưỡng để tạo nên những thiết kế
              thoải mái, bền đẹp và mang tính ứng dụng cao.
            </p>
            <p>
              Dù bạn theo đuổi phong cách năng động, tối giản hay thanh lịch,
              chúng tôi đều có giải pháp phù hợp cho bạn. FabricFocus luôn hướng
              tới việc giúp bạn tự tin trong mọi khoảnh khắc – từ công sở đến
              phố thị, từ buổi tập đến sự kiện đặc biệt.
            </p>
          </div>
        </div>
      </section>

      {/* Đặc trưng nổi bật */}
      <section className="w-full max-w-[1160px] mx-auto pt-24 px-4">
        <SlideShow />
      </section>

      {/* Gặp gỡ đội ngũ */}
      <section className="container pt-[120px] flex flex-col gap-y-16">
        <div className="grid place-items-center max-w-[650px] text-center gap-4 mx-auto">
          <span className="uppercase text-muted-foreground tracking-wider text-sm">
            Nhóm chúng tôi
          </span>
          <h2 className="uppercase text-[28px] md:text-[34px] font-bold text-foreground">
            Gặp gỡ các chuyên gia
          </h2>
          <div className="h-[2px]">
            <span className="w-14 h-[2px] inline-block bg-primary relative before:absolute before:content-[''] before:w-2 before:h-[2px] before:bg-primary before:-left-3 before:top-0 after:absolute after:content-[''] after:w-2 after:h-[2px] after:bg-primary after:-right-3 after:top-0" />
          </div>
        </div>
        <div className="w-full max-w-[1160px] mx-auto px-4">
          <SlideOurTeam />
        </div>
      </section>

      {/* Đối tác */}
      <OurPartnersSection />

      {/* Cảm nhận sản phẩm*/}
      <section className="w-full max-w-[1160px] mx-auto pt-[140px] px-4 grid">
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-12">
          <div className="hidden lg:block">
            <img src={bg_25} alt="FabricFocus Feature" />
          </div>
          <div className="flex flex-col gap-y-14">
            <div className="Title grid gap-y-3">
              <span className="uppercase text-muted-foreground text-sm tracking-wide">
                Phong cách đích thực
              </span>
              <h2 className="uppercase text-[28px] md:text-[34px] font-bold text-foreground">
                Cảm nhận nhịp điệu hoàn hảo
              </h2>
              <div className="h-2">
                <span className="w-2 h-[1px] inline-block bg-primary relative after:absolute after:content-[''] after:w-14 after:h-[1px] after:bg-primary after:-right-[3.75rem] after:top-0" />
              </div>
              <p className="text-muted-foreground">
                Tại <strong>FabricFocus</strong>, mỗi thiết kế đều mang hơi thở
                hiện đại và đậm cá tính. Chúng tôi chú trọng đến chất liệu, form
                dáng và từng đường may nhằm mang lại sự thoải mái, lịch lãm và
                tự tin cho nam giới trong mọi khoảnh khắc.
              </p>
            </div>
            <div className="Content_Feel grid gap-y-7">
              {[thum_1, thum_2].map((thumb, index) => (
                <div key={index} className="flex gap-x-0 md:gap-x-6">
                  <img
                    className="rounded-xl w-[200px] h-[150px] object-cover"
                    src={thumb}
                    alt={`Cảm nhận ${index + 1}`}
                  />
                  <div className="flex flex-col justify-center gap-y-3 text-sm">
                    <div className="uppercase font-bold text-foreground">
                      {index === 0
                        ? "Phối đồ linh hoạt, thể hiện chất riêng"
                        : "Trải nghiệm vượt mong đợi"}
                    </div>
                    <p className="text-muted-foreground">
                      {index === 0
                        ? "Khám phá cách phối đồ sáng tạo từ áo thun, sơ mi đến áo khoác – tất cả đều được thiết kế để bạn tự tin thể hiện cá tính."
                        : "Không chỉ là trang phục – đó là cảm giác thoải mái, vừa vặn và phong cách bạn có thể cảm nhận ngay từ lần thử đầu tiên."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mốc phát triển */}
      <TimelineSection />
    </>
  );
};

export default AboutUsPage;
