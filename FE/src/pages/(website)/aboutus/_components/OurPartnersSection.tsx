import { Link } from "react-router-dom";

// Import logo của từng đối tác (có thể import thêm tùy thực tế)
import shopee from "@/assets/partners/shopee.png";
import shopee_hover from "@/assets/partners/shopee-hover.png";
import lazada from "@/assets/partners/lazada.png";
import lazada_hover from "@/assets/partners/lazada_hover.png";

/**
•	front: ảnh logo mặc định.
•	hover: ảnh logo sẽ hiển thị khi hover.
•	url: đường dẫn khi click vào logo.

 */
const partnerLogos = [
  {
    front: shopee,
    hover: shopee_hover,
    url: "https://example1.com",
  },
  {
    front: lazada,
    hover: lazada_hover,
    url: "https://example2.com",
  },
  {
    front: shopee,
    hover: shopee_hover,
    url: "https://example1.com",
  },
  {
    front: lazada,
    hover: lazada_hover,
    url: "https://example2.com",
  },
  {
    front: shopee,
    hover: shopee_hover,
    url: "https://example1.com",
  },
];

const OurPartnersSection = () => {
  return (
    // •	Canh giữa (mx-auto) và tạo khoảng cách phía trên (pt-[140px]).
    <section className="w-full max-w-[1160px] mx-auto pt-[140px] px-4 flex flex-col gap-y-16">
      {/* Header */}
      <div className="grid place-items-center max-w-[650px] text-center gap-4 mx-auto">
        <span className="uppercase text-muted-foreground text-sm tracking-wide">
          Thương hiệu của chúng tôi
        </span>
        <h2 className="uppercase text-[28px] md:text-[34px] font-bold text-foreground">
          Đối tác của chúng tôi
        </h2>
        <div className="h-[2px]">
          <span className="w-14 h-[2px] inline-block bg-primary relative before:absolute before:content-[''] before:w-2 before:h-[2px] before:bg-primary before:-left-3 before:top-0 after:absolute after:content-[''] after:w-2 after:h-[2px] after:bg-primary after:-right-3 after:top-0" />
        </div>
      </div>

      {/* Grid logo */}
      <div className="Client_Logo grid grid-cols-5 grid-rows-1 gap-4 border border-border overflow-hidden rounded-2xl">
        {partnerLogos.map((logo, idx) => (
          <Link
            key={idx}
            to={logo.url || "#"}
            className="group relative aspect-square overflow-hidden border border-border flex items-center justify-center rounded-2xl"
          >
            {/* Ảnh gốc - Khi hover → dịch lên trên -translate-y-full → biến mất.*/}
            <img
              src={logo.front}
              alt={`logo-${idx}`}
              className="transition-transform duration-500 group-hover:-translate-y-full"
            />

            {/* Ảnh hover - Ban đầu nằm dưới (translate-y-full), khi hover thì trượt lên vị trí (translate-y-0). */}
            <img
              src={logo.hover}
              alt={`logo-hover-${idx}`}
              className="absolute top-0 left-0 w-full h-full object-contain transition-transform duration-500 translate-y-full group-hover:translate-y-0"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OurPartnersSection;
