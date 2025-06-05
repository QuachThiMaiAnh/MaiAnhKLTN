import { Swiper, SwiperSlide } from "swiper/react"; //2 thành phần chính của thư viện SwiperJS dùng để tạo carousel.
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "@/App.css";

import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

// Avatar thành viên
import thum_40 from "@/assets/images/thumbnail-40.jpg";
import thum_41 from "@/assets/images/thumbnail-41.jpg";
import thum_42 from "@/assets/images/thumbnail-42.jpg";
import thum_43 from "@/assets/images/thumbnail-43.jpg";

const iconMap = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
};

// Danh sách này chứa thông tin của mỗi thành viên: tên, chức vụ, email, avatar, và các link mạng xã hội.
const teamMembers = [
  {
    name: "Vi Quốc Lương",
    role: "Co-Founder",
    email: "luongvqph33533@fpt.edu.vn",
    avatar: thum_40,
    socials: {
      facebook: "https://facebook.com/luongvq",
      linkedin: "https://linkedin.com/in/luongvq",
      instagram: "https://instagram.com/luongvq",
    },
  },
  {
    name: "Đoàn Thị Thu Hằng",
    role: "Co-Founder",
    email: "hangdttph33534@fpt.edu.vn",
    avatar: thum_41,
    socials: {
      facebook: "https://facebook.com/hangdtt",
      linkedin: "https://linkedin.com/in/hangdtt",
      instagram: "https://instagram.com/hangdtt",
    },
  },
  {
    name: "Đỗ Trọng Khanh",
    role: "Co-Founder",
    email: "khanhdtph33535@fpt.edu.vn",
    avatar: thum_42,
    socials: {
      facebook: "https://facebook.com/khanhdt",
      instagram: "https://instagram.com/khanhdt",
    },
  },
  {
    name: "Bùi Văn Hải",
    role: "Co-Founder",
    email: "haibvph33536@fpt.edu.vn",
    avatar: thum_43,
    socials: {
      instagram: "https://instagram.com/haibv",
    },
  },
  {
    name: "Ngô Tân Hoàng Minh",
    role: "Co-Founder",
    email: "minhnthph33537@fpt.edu.vn",
    avatar: thum_40,
    socials: {
      twitter: "https://twitter.com/minhnth",
      youtube: "https://youtube.com/@minhnth",
    },
  },
];

const SlideOurTeam = () => {
  return (
    <Swiper
      modules={[Autoplay]}
      breakpoints={{
        1200: { slidesPerView: 4 },
        991: { slidesPerView: 3 },
        768: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      }} // điều chỉnh số lượng slide hiển thị theo kích thước màn hình.
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      spaceBetween={30} //mỗi 3 giây sẽ tự chạy 1 slide.
      className="mySwiper"
    >
      {/* Duyệt qua danh sách teamMembers để render từng slide */}
      {teamMembers.map((member, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col gap-y-6 items-center group">
            <div className="w-full border border-border overflow-hidden rounded-xl">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-auto object-cover transition duration-300 grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="relative max-w-[300px] text-center text-[13px] lg:text-[16px] flex flex-col gap-y-4">
              {/* Khi hover vào thẻ, phần thông tin này sẽ biến mất (scale-0) để nhường chỗ cho icon mạng xã hội */}
              <div className="transition-all duration-300 group-hover:scale-0 flex flex-col items-center gap-y-2">
                <div className="uppercase text-xs text-primary">
                  {member.role}
                </div>
                <div className="uppercase font-bold text-foreground">
                  {member.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {member.email}
                </div>
              </div>
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 top-1/3 group-hover:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-x-3">
                {Object.entries(member.socials).map(([platform, url]) => {
                  const Icon = iconMap[platform as keyof typeof iconMap];
                  return (
                    // •	Duyệt qua các mạng xã hội có link để hiển thị icon tương ứng.
                    url && (
                      <Link
                        key={platform}
                        to={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition"
                      >
                        <Icon size={16} />
                      </Link>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SlideOurTeam;
