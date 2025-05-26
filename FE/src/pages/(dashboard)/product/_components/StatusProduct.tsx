import { FormTypeProductVariation } from "@/common/types/validate";
import CategoryProduct from "./CategoryProduct";
import ProductImage from "./ProductImage";

const StatusProduct = ({
  form,
  loading,
}: {
  form: FormTypeProductVariation;
  loading: boolean;
}) => {
  return (
    <div
      className={`w-full xl:w-1/4 flex flex-col gap-3 ${
        loading ? "pointer-events-none" : ""
      }`}
    >
      <ProductImage form={form} />
      <CategoryProduct form={form} />
    </div>
  );
};

export default StatusProduct;
