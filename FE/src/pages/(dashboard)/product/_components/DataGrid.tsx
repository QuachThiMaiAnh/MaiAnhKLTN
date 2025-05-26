import { Product } from "@/components/Column";
import ListCategories from "./ListCategories";
import { Link } from "react-router-dom";

const DataGrid = ({ data }: { data: Product[] }) => {
  // console.log(data);
  return (
    <div>
      {/* <ListCategories /> */}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* <div className="flex flex-wrap gap-4"> */}
        {data.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-md shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex-[1_1_290px]"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="mt-4 p-4">
              <div className="flex justify-between items-center">
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="text-lg"
                >
                  {product.name}
                </Link>
                <span className="text-sm">${product.price}</span>
              </div>
              <p className="text-gray-500 mt-2 text-sm leading-normal">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataGrid;
