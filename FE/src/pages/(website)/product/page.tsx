import { Link, useParams } from "react-router-dom"; // 1.Điều hướng trong SPA mà không reload trang - 2. Hook dùng để lấy tham số từ URL

// Import các Component con
import ProductInfo from "./_components/ProductInfo"; // Hiển thị chi tiết sản phẩm
import SeeMore from "./_components/SeeMore";
import SkeletonProduct from "./_components/SkeletonProduct";
import SliderImage from "./_components/SliderImage";
import ListProductFavorite from "./_components/ListProductFavorite";

// Import Custom Hook & State
import { useGetProductById } from "./actions/useGetProductById"; // gọi API lấy thông tin sản phẩm theo id
import { useEffect, useState } from "react"; // side-effect và local state

import axios from "axios";

// Định nghĩa kiểu dữ liệu Product
type Product = {
  _id: string; // MongoDB
  name: string; // Tên SP
  price: number; // Giá gốc
  priceSale: number; // Giá khuyến mãi
  image: string; // URL ảnh đại diện cho SP
};

// Định nghĩa interface Data
interface Data {
  bestSellerProducts: Product[]; //Danh sách các sản phẩm bán chạy
  bestFavoriteProducts: Product[]; // Danh sách các sản phẩm được yêu thích nhất
  listRelatedProducts: Product[]; // Danh sách sản phẩm liên quan
}

const apiUrl = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams(); // Lấy id từ route --- /product/6762de526b62be7e96f8bc74
  const [data, setData] = useState<Data>({
    // Tạo local state để lưu dữ liệu
    bestSellerProducts: [],
    bestFavoriteProducts: [],
    listRelatedProducts: [],
  });
  const [isGetting, setIsGetting] = useState(false); // kiểm soát loading khi gọi API gợi ý sản phẩm yêu thích / bán chạy / liên quan
  const { isLoading, product, error } = useGetProductById(id!); // Dấu ! sau id! giúp TypeScript hiểu rằng id chắc chắn không undefined.

  console.log(data, "11");
  // API này có thể dùng để lấy dữ liệu gợi ý trên trang sản phẩm.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsGetting(true);
        /**
        1.	✅ Top 3 sản phẩm bán chạy nhất (dựa trên field count)
        2.	✅ Top 3 sản phẩm được yêu thích nhất (dựa trên trọng số trung bình rating từ các bình luận không bị xoá)
        3.	✅ Top 3 sản phẩm liên quan (cùng danh mục với sản phẩm đang xem)
         */
        const response = await axios.get(
          `${apiUrl}/listRelatedProducts?categoryId=${product.category[0]._id}&productId=${product._id}`
        );
        setIsGetting(false);
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsGetting(false);
      }
    };

    if (product) fetchProducts();
  }, [product]);

  if (isLoading || isGetting) {
    return (
      <div className="container mb-4">
        <SkeletonProduct />
      </div>
    );
  }

  // Nếu đang tải dữ liệu sản phẩm chính (isLoading) hoặc đang tải sản phẩm liên quan (isGetting) → hiển thị component khung xương (SkeletonProduct).
  if (error || !product) {
    return (
      <div className="font-bold text-center text-xl my-8">
        Dữ liệu sản phẩm đang được tải!! Đợi mình tí ...
      </div>
    );
  }
  // console.log(data, "data");
  return (
    <div className="container mx-auto mb-10 px-4">
      {/* ====== PHẦN TRÊN: Breadcrumbs ====== */}
      <div className="h-4 md:h-8" /> {/* khoảng cách đầu trang */}
      <nav className="text-[11px] leading-[18px] uppercase text-gray-500 breadcrumbs space-x-2">
        <Link to="/" className="hover:underline text-[11px] text-gray-500">
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          to="/shopping"
          className="hover:underline text-[11px] text-gray-500"
        >
          Sản phẩm
        </Link>
        <span>/</span>
        <span className="font-medium text-black line-clamp-1">
          {product.name}
        </span>
      </nav>
      {/* ====== KHOẢNG CÁCH GIỮA ====== */}
      <div className="h-6 md:h-12 lg:h-20" />
      {/* ====== KHỐI ẢNH + THÔNG TIN ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Slider ảnh sản phẩm */}
        <div className="mx-auto w-full max-w-lg">
          <SliderImage imageMain={product.image} variants={product.variants} />
        </div>

        {/* Thông tin sản phẩm + nút mua */}
        <div className="flex flex-col justify-start">
          <ProductInfo product={product} />
        </div>
      </div>
      {/* ====== KHOẢNG CÁCH SAU KHỐI CHÍNH ====== */}
      <div className="h-10 md:h-16" />
      {/* ====== MÔ TẢ CHI TIẾT & BÌNH LUẬN ====== */}
      <SeeMore
        descriptionDetail={product.descriptionDetail}
        comments={product?.comments}
      />
      <div className="h-10 md:h-16" />
      {/* ====== GỢI Ý SẢN PHẨM YÊU THÍCH, BÁN CHẠY... ====== */}
      <ListProductFavorite data={data} />
    </div>
  );
};

export default ProductDetail;
