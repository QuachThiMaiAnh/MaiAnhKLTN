import logo from "@/assets/logo3.png";
import { Blog } from "@/common/types/Blog";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [posts, setPosts] = useState<Blog[]>([]);
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

  // const posts = [
  //   {
  //     title: "FUSCE TINCIDUNT ACCUMSAN GIÁ TRỊ TẠI ĐÂY",
  //     date: "07 Tháng 4 / 15",
  //     imgSrc: imageFoot1,
  //   },
  //   {
  //     title: "FUSCE TINCIDUNT ACCUMSAN GIÁ TRỊ TẠI ĐÂY",
  //     date: "07 Tháng 4 / 15",
  //     imgSrc: imageFoot2,
  //   },
  //   {
  //     title: "FUSCE TINCIDUNT ACCUMSAN GIÁ TRỊ TẠI ĐÂY",
  //     date: "07 Tháng 4 / 15",
  //     imgSrc: imageFoot1,
  //   },
  // ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/blogs");
        setPosts(response.data.slice(3,6));
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <footer className="bg-[#343434] text-xs text-gray-400 py-10 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Thông Tin Công Ty */}
        <div>
          <img src={logo} className="w-32 mb-3" alt="Logo" />
          <p>
            Vị trí và tư thế được thiết lập để nâng cao hiệu quả. Hãy duy trì tư
            thế vững vàng, tập trung vào vị trí để đạt được kết quả tốt nhất.
          </p>

          <ul className="mt-4 space-y-6">
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 text-[#b8cd06]"
              >
                <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                <path
                  fillRule="evenodd"
                  d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
                  clipRule="evenodd"
                />
              </svg>
              <a
                href="tel:+3625551238745"
                className="hover:text-[#b8cd06] cursor-pointer"
              >
                CONTECT US: +3 (625) 555 123 8745
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 text-[#b8cd06]"
              >
                <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
              </svg>

              <a
                href="mailto:office@exzo.com"
                className="hover:text-[#b8cd06] cursor-pointer"
              >
                EMAIL: office@exzo.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 text-[#b8cd06] "
              >
                <path
                  fillRule="evenodd"
                  d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
                  clipRule="evenodd"
                />
              </svg>

              <a
                href="#location"
                className="hover:text-[#b8cd06] cursor-pointer"
              >
                ADDRESS: 1st, New York, USA
              </a>
            </li>
          </ul>
        </div>

        {/* Liên Kết Nhanh */}
        <div>
          <h3 className="font-raleway font-extrabold text-white mb-4">
            LIÊN KẾT NHANH
          </h3>
          <div className="grid grid-cols-2 gap-x-4">
            <ul className="space-y-5">
              {quickLinks
                .slice(0, Math.ceil(quickLinks.length / 2))
                .map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="hover:text-[#b8cd06] cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
            </ul>
            <ul className="space-y-5">
              {quickLinks
                .slice(Math.ceil(quickLinks.length / 2))
                .map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.url}
                      className="hover:text-[#b8cd06] cursor-pointer"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Một Số Bài Viết */}
        <div>
          <h3 className="font-raleway font-extrabold text-white mb-4">
            MỘT SỐ BÀI VIẾT
          </h3>
          <ul className="space-y-5 ">
            {posts.map((post, index) => (
              <li
                key={index}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <img
                  src={post.image}
                  alt="Ảnh Bài Viết"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <Link to={`/blog/detail/${post._id}`}>
                    <p className="text-gray-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="hover:text-[#b8cd06] text-slate-200 font-raleway font-bold uppercase line-clamp-2">
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
