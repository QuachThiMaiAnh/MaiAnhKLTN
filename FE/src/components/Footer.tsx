import logo from "@/assets/logo3.png";
import { Blog } from "@/common/types/Blog";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  { name: "Trang Chủ", url: "/" },
  { name: "Giới Thiệu", url: "/about" },
  { name: "Sản Phẩm", url: "/shopping" },
  { name: "Dịch Vụ", url: "/services" },
  { name: "Bài Viết", url: "/blog" },
  { name: "Liên Hệ", url: "/contact" },
  { name: "Chính Sách Bảo Mật", url: "/privacy-policy" },
  { name: "Bảo Hành", url: "/warranty" },
];

const FooterIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="text-primary size-5">{children}</div>
);

const Footer = () => {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [logoUrl, setLogoUrl] = useState<string>(""); // URL của logo, mặc định là Logo.jpg

  // Lấy bài viết từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs`);
        setPosts(res.data.slice(1, 4)); // Lấy 3 bài viết đầu tiên
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };
    fetchPosts();
  }, []);

  // Lấy logo từ API
  const fetchLogo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/logo`);

      const data = await response.data; // Giả sử API trả về một mảng chứa logo

      if (data && data.length > 0) {
        setLogoUrl(data[0].image);
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);
  return (
    <footer className="bg-background text-foreground py-10 px-5 text-sm transition-colors duration-300 border-t border-muted-foreground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Thông tin công ty */}
        <div>
          {/* Logo lấy động từ API */}
          <img className="w-32 mb-4" src={logoUrl} alt="Logo" />
          <p className="leading-relaxed text-muted-foreground">
            Thời trang dành cho phái mạnh hiện đại – trẻ trung, linh hoạt và
            luôn sẵn sàng cho mọi hành trình.
          </p>

          <ul className="mt-5 space-y-5">
            {/*☎️ Điện thoại */}
            <li className="flex items-center gap-2">
              <FooterIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                  <path
                    fillRule="evenodd"
                    d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
                    clipRule="evenodd"
                  />
                </svg>
              </FooterIcon>
              <a
                href="tel:+841234567890"
                className="hover:text-primary transition"
              >
                (+84) 123 456 7890
              </a>
            </li>
            {/*  ✉️ Email */}
            <li className="flex items-center gap-2">
              <FooterIcon>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                  <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                </svg>
              </FooterIcon>
              <a
                href="mailto:maianh@gmail.com"
                className="hover:text-primary transition"
              >
                maianh@gmail.com
              </a>
            </li>
            {/* 📍 Địa chỉ */}
            <li className="flex items-center gap-2">
              <FooterIcon>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </FooterIcon>
              <span className="hover:text-primary transition">
                Số 1, Võ Văn Ngân, Linh Chiểu, TP. Thủ Đức
              </span>
            </li>
          </ul>

          {/* Bản đồ Google */}
          <div className="mt-4">
            <iframe
              title="Bản đồ Google"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4798071723885!2d106.77107767559879!3d10.851064189302308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752774d7ef06ef%3A0xe1f3dda94d3fde26!2zc-G7kSAxIMSQLiBWw7UgVsSDbiBOZ8OibiwgTGluaCBDaGnhu4N1LCBUaOG7pyDEkOG7qWMsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2sus!4v1749023109375!5m2!1svi!2sus"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-md shadow-md"
            ></iframe>
          </div>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-foreground font-semibold mb-4">LIÊN KẾT NHANH</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.url}
                className="text-muted-foreground hover:text-primary transition"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bài viết nổi bật */}
        <div>
          <h3 className="text-foreground font-semibold mb-4">
            MỘT SỐ BÀI VIẾT
          </h3>
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post._id} className="flex gap-3 items-start">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <Link to={`/blog/detail/${post._id}`}>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="line-clamp-2 text-sm text-foreground hover:text-primary font-medium uppercase">
                      {post.title}
                    </p>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
