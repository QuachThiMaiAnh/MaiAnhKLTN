import { useState } from "react";
import product1 from "../../../../assets/img/products/product1.jpg";
import product2 from "../../../../assets/img/products/product2.jpg";
import {
  default as product3,
  default as product7,
} from "../../../../assets/img/products/product3.jpg";
import product4 from "../../../../assets/img/products/product4.jpg";
import product5 from "../../../../assets/img/products/product5.jpg";
import product6 from "../../../../assets/img/products/product6.jpg";
import product8 from "../../../../assets/img/products/product7.jpg";

const Products = () => {
  const [activeButton, setActiveButton] = useState("All"); // State để lưu trữ nút hiện tại được chọn

  const menuItems = [
    "All",
    "Shirt",
    "Cap",
    "Trouser",
    "Shorts",
    "Shoe",
    "Sock",
    "Jacket",
    "Hoodie",
    "Glasses",
    "Watch",
  ];

  // Hàm xử lý sự kiện khi click vào nút
  const handleButtonClick = (category: string) => {
    setActiveButton(category);
  };

  const products = [
    { id: 1, name: "Product 1", price: 100, image: product1 },
    { id: 2, name: "Product 2", price: 120, image: product2 },
    { id: 3, name: "Product 3", price: 90, image: product3 },
    { id: 4, name: "Product 4", price: 110, image: product4 },
    { id: 5, name: "Product 5", price: 95, image: product5 },
    { id: 6, name: "Product 6", price: 130, image: product6 },
    { id: 7, name: "Product 7", price: 115, image: product7 },
    { id: 8, name: "Product 8", price: 105, image: product8 },
  ];
  return (
    <div>
      <div className="mt-6 grid grid-flow-col gap-2 lg:px-[100px] overflow-x-auto scrollbar-hide justify-items-center cursor-pointer">
        {menuItems.map((item) => (
          <div
            key={item}
            onClick={() => handleButtonClick(item)}
            className={`px-4 py-2 ${
              activeButton === item
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            } rounded-full mx-2 mb-2 sm:mb-0`}
          >
            {item}
          </div>
        ))}
      </div>

      <div className=" mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-[30px]">
          {products.map((product) => (
            <div key={product.id} className="p-4 relative">
              <div className="border rounded-3xl h-auto">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full rounded-3xl"
                />
                <div className="absolute top-5 right-5 lg:top-5 lg:right-5 mt-2 mr-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2  flex leading-7 gap-3 justify-between items-center">
                <p className=" basi-1/2 lg:text-[25px]  text-[20px] font-[500]">
                  {product.name}
                </p>
                <p className=" basi-1/2 lg:text-[25px] text-[21px] font-[600]">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-gray-900 mx-auto hover:bg-gray-800 rounded-full py-4 px-8 transition duration-300 ease-in-out transform hover:scale-105 text-gray-100">
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
