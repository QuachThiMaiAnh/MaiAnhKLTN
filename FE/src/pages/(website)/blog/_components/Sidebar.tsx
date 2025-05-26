import { Blog } from "@/common/types/Blog";
import { Category } from "@/common/types/Products";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // Lấy và cập nhật tham số URL
  const currentCategory = searchParams.get("category");
  const [categories, setCategories] = useState<Category[]>([]); // Lưu danh mục
  const [posts, setPosts] = useState<Blog[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>(""); // Lưu từ khóa tìm kiếm

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategoriesAndPosts = async () => {
      try {
        // Lấy danh mục
        const categoryResponse = await axios.get("http://localhost:8080/api/category");
        const categoriesData = categoryResponse.data;
        setCategories([{ _id: null, name: "TẤT CẢ" }, ...categoriesData]);
  
        // Lấy bài viết
        const postResponse = await axios.get("http://localhost:8080/api/blogs");
        const postsData = postResponse.data.slice(5, 10); 
  
        // Kết hợp bài viết với tên danh mục
        const combinedPosts = postsData.map((post:Blog) => {
          const category = categoriesData.find((cat:Category) => cat._id === post.category);
          return {
            ...post,
            categoryName: category ? category.name : "Không xác định",
          };
        });
  
        setPosts(combinedPosts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
  
    fetchCategoriesAndPosts();
  }, []);
  

  // Cập nhật từ khóa tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    searchParams.set("search", e.target.value);
    searchParams.set("page", "1"); // Reset trang về 1 khi tìm kiếm
    setSearchParams(searchParams);
  };

  // Cập nhật danh mục
  const handleCategoryClick = (category: string | null) => {
    if (category) {
      searchParams.set("category", category); // Thêm category vào URL
    } else {
      searchParams.delete("category"); // Xóa category khỏi URL nếu là "TẤT CẢ"
    }
    searchParams.set("page", "1"); // Reset trang về 1
    setSearchParams(searchParams);
    if (window.location.pathname.includes("/detail")) {
      window.location.href = "/blog"; // Chuyển về trang danh sách bài viết
    }
  };

  return (
    <div className="mb-20 lg:w-80">
      <div className="flex flex-col uppercase">
        {/* Input tìm kiếm */}
        <div className="mb-10 relative">
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            type="text"
            placeholder="Tìm kiếm theo tên bài viết hoặc tác giả..."
            className="w-full text-xs py-3 pr-10 border border-[#efefef] rounded-full focus:outline-none focus:ring-[#b8cd06] focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        {/* Danh mục */}
        <div className="mb-10">
          <h3 className="mb-4 text-lg font-raleway font-extrabold uppercase text-[#343434]">
            danh mục
          </h3>
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className={`text-[#888] text-[11px] font-raleway hover:text-[#b8cd06] cursor-pointer border-b border-[#efefef] pb-4 ${
                  currentCategory === cat._id ? "text-[#b8cd06] font-bold" : ""
                }`}
                onClick={() => handleCategoryClick(cat._id)}
              >
                {/* {cat.name} */}
                <Link to={cat._id ? `/blog?category=${cat._id}` : `/blog`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bài viết khác */}
        <div className="mb-10">

          <div className="mb-10">
            <h2 className="mb-4 text-[20px] text-[#343434] font-raleway font-extrabold uppercase">
              Bài viết khác
            </h2>

            {posts.map((post) => (
              <div key={post._id} className="flex flex-col w-[350px] items-start mb-10">
                <div className="lg:w-full h-full mb-4 bg-gray-200 rounded-md overflow-hidden">
                  <Link to={`/blog/detail/${post._id}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
                <p className="text-[#343434] text-[15px] font-raleway font-extrabold mb-1 cursor-pointer">
                  {post.title}
                </p>
                <p className="text-[11px] text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}{" "}
                  &nbsp;&bull;&nbsp;{" "}
                  <span className="text-[#b8cd06]">{post.author}</span>{" "}
                  &nbsp;&bull;&nbsp;{" "}
                  <span className="text-[#b8cd06]">{post.categoryName}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
