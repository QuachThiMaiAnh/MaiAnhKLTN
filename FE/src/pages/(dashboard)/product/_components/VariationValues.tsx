import { FormTypeProductVariation } from "@/common/types/validate";
import { Button } from "@/components/ui/button";
import { FieldErrors } from "react-hook-form";

const VariationValues = ({
  form,
  indexValue,
  removeFields,
}: {
  form: FormTypeProductVariation;
  indexValue: number;
  removeFields: (index: number) => void;
}) => {
  const errors = form.formState.errors.variants as
    | FieldErrors<{
        price: number;
        countOnStock: number;
        priceSale: number;
        originalPrice: number;
      }>[]
    | undefined;

  return (
    <div className="mt-4">
      <div className="flex flex-col lg:flex-row justify-between">
        <div>
          <label className="block text-lg">Giá gốc</label>
          <input
            type="text"
            {...form.register(`variants.${indexValue}.originalPrice` as const)}
            className={
              errors?.[indexValue]?.originalPrice ? "border-red-500" : ""
            }
          />
          <span className="text-xs block text-red-600 mt-2">
            {errors?.[indexValue]?.originalPrice?.message}
          </span>
        </div>

        <div>
          <label className="block text-lg">Giá bán</label>
          <input
            type="text"
            {...form.register(`variants.${indexValue}.price` as const)}
            className={errors?.[indexValue]?.price ? "border-red-500" : ""}
          />
          <span className="text-xs block text-red-600 mt-2">
            {errors?.[indexValue]?.price?.message}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-lg">Giá Giảm giá</label>
        <input
          type="text"
          {...form.register(`variants.${indexValue}.priceSale` as const)}
          className={errors?.[indexValue]?.priceSale ? "border-red-500" : ""}
        />
        <span className="text-xs block text-red-600 mt-2">
          {errors?.[indexValue]?.priceSale?.message}
        </span>
      </div>

      <Button
        type="button"
        className="bg-red-500 mt-2"
        onClick={() => removeFields(indexValue)}
      >
        Xóa
      </Button>
    </div>
  );
};

export default VariationValues;
