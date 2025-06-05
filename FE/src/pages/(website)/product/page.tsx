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

type Product = {
  _id: string;
  name: string;
  price: number;
  priceSale: number;
  image: string;
};

interface Data {
  bestSellerProducts: Product[];
  bestFavoriteProducts: Product[];
  listRelatedProducts: Product[];
}

const apiUrl = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<Data>({
    bestSellerProducts: [],
    bestFavoriteProducts: [],
    listRelatedProducts: [],
  });
  const [isGetting, setIsGetting] = useState(false);
  const { isLoading, product, error } = useGetProductById(id!);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsGetting(true);
        const response = await axios.get(
          `${apiUrl}/listProductFavorite?categoryId=${product.category[0]._id}&productId=${product._id}`
        ); // URL API
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

  if (error || !product) {
    return <div>Error loading product!</div>;
  }

  return (
    <div className="container mb-4">
      <div className="h-4 md:h-8 mb-0"></div>
      {/* Breadcrumbs */}
      <div className="text-[11px] leading-[18px] uppercase text-[#888] breadcrumbs">
        <Link to="/" className="bread">
          Trang chủ
        </Link>
        <Link to="/shopping" className="bread">
          Shopping
        </Link>
        <Link to={`/product/${product._id}`}>{product.name}</Link>
      </div>
      {/* Khoang cach */}
      <div className="h-4 md:h-12 lg:h-24 mb-0"></div>
      {/* Info product */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="px-[15px] mx-auto mb-[30px] md:mb-0">
          {/* Carousel */}
          <SliderImage imageMain={product.image} variants={product.variants} />
        </div>

        {/* Product info */}
        <div>
          {/* Sử dụng ProductInfo */}
          <ProductInfo product={product} />

          {/* BUTTON */}
        </div>
      </div>
      {/* See More */}
      <div className="h-[35px] md:h-[70px]"></div>
      <SeeMore
        descriptionDetail={product.descriptionDetail}
        comments={product?.comments}
      />
      <div className="h-[35px] md:h-[70px]"></div>
      <ListProductFavorite data={data} />
    </div>
  );
};

export default ProductDetail;
