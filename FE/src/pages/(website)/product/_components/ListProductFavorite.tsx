import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

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
const ListProductFavorite = ({ data }: { data: Data }) => {
  console.log(data.bestSellerProducts);

  return (
    <div className="grid gap-4 lg:gap-0 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-between">
      {data.bestSellerProducts && data.bestSellerProducts.length ? (
        <div>
          <h2 className="uppercase text-2xl font-black mb-4">bán chạy nhất</h2>
          {data.bestSellerProducts?.map((product: Product) => (
            <div key={product._id}>
              <div className="flex gap-4 items-center mb-12">
                <Link
                  to={`/product/${product._id}`}
                  className="font-bold hover:text-[#b8cd06] hover:underline"
                >
                  <img
                    className="w-24 rounded-lg"
                    src={product.image}
                    alt="Ảnh sản phẩm"
                  />
                </Link>
                <div>
                  <Link
                    to={`/product/${product._id}`}
                    className="font-bold hover:text-[#b8cd06] hover:underline"
                  >
                    {product.name}
                  </Link>

                  <div className="">
                    <span
                      className={`${
                        product.priceSale > 0 ? "mr-4 text-red-700" : ""
                      } `}
                    >
                      {product.priceSale > 0 &&
                        formatCurrency(product.priceSale) + " VNĐ"}
                    </span>
                    <span
                      className={`${
                        product.priceSale > 0 ? "line-through" : ""
                      }`}
                    >
                      {formatCurrency(product.price)} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {data.bestFavoriteProducts && data.bestFavoriteProducts.length ? (
        <div>
          <h2 className="uppercase text-2xl font-black mb-4">
            được yêu thích nhất
          </h2>
          {data.bestFavoriteProducts?.map((product: Product) => (
            <div key={product._id}>
              <div className="flex gap-4 items-center mb-12">
                <Link
                  to={`/product/${product._id}`}
                  className="font-bold hover:text-[#b8cd06] hover:underline"
                >
                  <img
                    className="w-24 rounded-lg"
                    src={product.image}
                    alt="Ảnh sản phẩm"
                  />
                </Link>
                <div>
                  <Link
                    to={`/product/${product._id}`}
                    className="font-bold hover:text-[#b8cd06] hover:underline"
                  >
                    {product.name}
                  </Link>

                  <div className="">
                    <span
                      className={`${
                        product.priceSale > 0 ? "mr-4 text-red-700" : ""
                      } `}
                    >
                      {product.priceSale > 0 &&
                        formatCurrency(product.priceSale) + " VNĐ"}
                    </span>
                    <span
                      className={`${
                        product.priceSale > 0 ? "line-through" : ""
                      }`}
                    >
                      {formatCurrency(product.price)} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {data.listRelatedProducts && data.listRelatedProducts.length ? (
        <div>
          <h2 className="uppercase text-2xl font-black mb-4">
            sản phẩm liên quan
          </h2>
          {data.listRelatedProducts?.map((product: Product) => (
            <div key={product._id}>
              <div className="flex gap-4 items-center mb-12">
                <Link
                  to={`/product/${product._id}`}
                  className="font-bold hover:text-[#b8cd06] hover:underline"
                >
                  <img
                    className="w-24 rounded-lg"
                    src={product.image}
                    alt="Ảnh sản phẩm"
                  />
                </Link>
                <div>
                  <Link
                    to={`/product/${product._id}`}
                    className="font-bold hover:text-[#b8cd06] hover:underline"
                  >
                    {product.name}
                  </Link>

                  <div className="">
                    <span
                      className={`${
                        product.priceSale > 0 ? "mr-4 text-red-700" : ""
                      } `}
                    >
                      {product.priceSale > 0 &&
                        formatCurrency(product.priceSale) + " VNĐ"}
                    </span>
                    <span
                      className={`${
                        product.priceSale > 0 ? "line-through" : ""
                      }`}
                    >
                      {formatCurrency(product.price)} VNĐ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ListProductFavorite;
