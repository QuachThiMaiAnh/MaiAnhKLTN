import { Blog } from "@/common/types/Blog";
import { Category } from "@/common/types/Orders";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

const Detail = () => {
  const [searchParams] = useSearchParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);
  const [, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const currentCategory = searchParams.get("category");
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
console.log("currentCategory", currentCategory)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy danh mục
        const categoryResponse = await axios.get(
          "http://localhost:8080/api/category"
        );
        const categoriesData = categoryResponse.data;
        setCategories(categoriesData);

        // Gọi API để lấy chi tiết bài viết
        const postResponse = await axios.get(
          `http://localhost:8080/api/blogs/${id}`
        );
        const currentBlog = postResponse.data;

        // Thêm tên danh mục vào bài viết
        const category = categoriesData.find(
          (cat: Category) => cat._id === currentBlog.category
        );
        setBlog({
          ...currentBlog,
          categoryName: category ? category.name : "Không xác định",
        });

        // Gọi API để lấy các bài viết liên quan
        const relatedResponse = await axios.get(
          `http://localhost:8080/api/blogs?category=${currentBlog.category}`
        );

        // Lọc bài viết liên quan, loại bỏ bài viết hiện tại
        const relatedPostsData = relatedResponse.data
          .filter((post: Blog) => post._id !== id) // Loại bỏ bài viết hiện tại
          .map((post: Blog) => {
            const relatedCategory = categoriesData.find(
              (cat: Category) => cat._id === post.category
            );
            return {
              ...post,
              categoryName: relatedCategory
                ? relatedCategory.name
                : "Không xác định",
            };
          });

        setRelatedPosts(relatedPostsData);
      } catch (error) {
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return (
      <div className="text-center text-gray-500 font-semibold">
        Bài viết không tồn tại.
      </div>
    );
  }
  return (
    <div className="space-y-28 mb-10 ">
      {/* Chi tiết bài viết */}
      <div className="max-w-4xl mx-auto overflow-hidden">
        <p className="text-[11px] flex items-center gap-3 text-gray-500 uppercase mb-3">
          <span>
            {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-[#b8cd06]">
            {blog.author} - {blog.categoryName}
          </span>
        </p>

        <h2 className="text-[25px] font-raleway font-extrabold text-[#343434] uppercase mb-6">
          {blog.title}
        </h2>
        <div>
          <img
            src={blog.image}
            alt="Blog"
            className="w-full mb-5 object-cover"
          />
        </div>

        <p className="text-[#272626] text-[15px] text-justify">
          {blog.description}
        </p>

        {/* Nội dung bài viết */}
        <div
          className="detail text-md mb-4"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Hiển thị baif viết liên quan */}
      {relatedPosts.length > 0 && (
        <div className="space-y-8 mt-10">
          <header className=" mb-10 mt-20">
            <h5 className="text-sm uppercase font-questrial text-gray-500 tracking-wider mb-3">
              sản phẩm phổ biến
            </h5>
            <h2 className="text-2xl sm:text-3xl font-raleway text-[#343434] font-extrabold uppercase">
              Thông tin liên quan
            </h2>
            <div className="flex items-center gap-1 my-6">
              <span className="h-[1px] w-2 bg-[#b8cd06] mb-2"></span>
              <span className="h-[1px] w-12 bg-[#b8cd06] mb-2"></span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((post) => (
              <div key={post._id}>
                <Link to={`/blog/detail/${post._id}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full rounded-xl h-[60%] object-cover"
                  />
                </Link>

                <div className="p-4 text-center space-y-5">
                  <Link
                    to={`/blog/detail/${post._id}`}
                    className="text-[13px] font-raleway font-extrabold text-[#343434] hover:text-[#b8cd06] cursor-pointer uppercase duration-200"
                  >
                    {post.title}
                  </Link>
                  <p className="text-[11px] flex items-center gap-3 justify-center text-gray-500 uppercase mb-3">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[#b8cd06]">
                      {post.author} - {post.categoryName}
                    </span>
                  </p>
                  <p className="text-[13px] text-[#888] line-clamp-3">
                    {post.description}
                  </p>

                  <div>
                    <button className="group relative w-full md:w-[130px] px-8 py-5 text-xs bg-[#b8cd06] text-white rounded-full font-semibold overflow-hidden">
                      <Link to={`/blog/detail/${post._id}`}>
                        {/* Text chính */}
                        <span className="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-in-out transform group-hover:translate-x-full group-hover:opacity-0">
                          TÌM HIỂU THÊM
                        </span>
                        {/* Icon */}

                        <span className="absolute inset-y-0 left-0 flex items-center justify-center w-full transition-all duration-200 ease-in-out transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
